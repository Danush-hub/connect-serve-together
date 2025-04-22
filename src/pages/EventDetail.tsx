
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Clock, MapPin, Users, Share2 } from "lucide-react";
import { Event, getEventById, registerForEvent, unregisterFromEvent } from "@/services/eventService";
import { useToast } from "@/components/ui/use-toast";

const EventDetail = () => {
  const { eventId } = useParams<{ eventId: string }>();
  const { currentUser, isAuthenticated, userRole } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [isRegistering, setIsRegistering] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);

  useEffect(() => {
    const fetchEvent = async () => {
      if (!eventId) {
        navigate("/events");
        return;
      }
      
      try {
        const eventData = await getEventById(eventId);
        setEvent(eventData);
        
        // Check if the current user is registered
        if (currentUser?.id && eventData.volunteersRegistered.includes(currentUser.id)) {
          setIsRegistered(true);
        }
        
        setLoading(false);
      } catch (error) {
        toast({
          title: "Error",
          description: "Could not load event details",
          variant: "destructive",
        });
        navigate("/events");
      }
    };
    
    fetchEvent();
  }, [eventId, navigate, toast, currentUser]);

  const handleRegister = async () => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication Required",
        description: "Please login to register for events",
        variant: "destructive",
      });
      navigate("/login");
      return;
    }
    
    if (userRole !== "volunteer") {
      toast({
        title: "Not Allowed",
        description: "Only volunteers can register for events",
        variant: "destructive",
      });
      return;
    }
    
    if (!event) return;
    
    setIsRegistering(true);
    
    try {
      if (isRegistered) {
        await unregisterFromEvent(event.id, currentUser?.id || "");
        setIsRegistered(false);
        toast({
          title: "Success",
          description: "You have unregistered from this event",
        });
      } else {
        await registerForEvent(event.id, currentUser?.id || "");
        setIsRegistered(true);
        toast({
          title: "Success",
          description: "You have registered for this event",
        });
      }
      
      // Refresh event data to get updated registration info
      const updatedEvent = await getEventById(event.id);
      setEvent(updatedEvent);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Something went wrong",
        variant: "destructive",
      });
    } finally {
      setIsRegistering(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="container py-12 flex items-center justify-center min-h-[calc(100vh-13rem)]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading event details...</p>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="container py-12 text-center">
        <h1 className="text-3xl font-bold mb-4">Event Not Found</h1>
        <p className="mb-6">The event you're looking for doesn't exist or has been removed.</p>
        <Button asChild>
          <a href="/events">Browse Events</a>
        </Button>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <div className="relative w-full h-[300px] md:h-[400px] rounded-xl overflow-hidden">
            <img 
              src={event.imageUrl} 
              alt={event.title} 
              className="w-full h-full object-cover"
            />
            <div className="absolute top-4 right-4 flex gap-2">
              <Badge className="bg-event text-event-dark">{event.category}</Badge>
              <Badge variant="outline" className="bg-white/80 backdrop-blur-sm">{event.status}</Badge>
            </div>
          </div>
          
          <div>
            <h1 className="text-3xl font-bold mb-2">{event.title}</h1>
            <p className="text-muted-foreground mb-6">
              Organized by <span className="font-medium text-foreground">{event.organizationName}</span>
            </p>
            
            <Tabs defaultValue="details">
              <TabsList>
                <TabsTrigger value="details">Details</TabsTrigger>
                <TabsTrigger value="volunteers">Volunteers</TabsTrigger>
                <TabsTrigger value="discussion">Discussion</TabsTrigger>
              </TabsList>
              
              <TabsContent value="details" className="mt-6">
                <div className="prose dark:prose-invert max-w-none">
                  <p>{event.description}</p>
                </div>
                
                <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col space-y-6">
                    <div className="flex items-start space-x-3">
                      <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                      <div>
                        <h3 className="font-medium mb-1">Date</h3>
                        <p className="text-muted-foreground">{formatDate(event.date)}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3">
                      <Clock className="h-5 w-5 text-muted-foreground mt-0.5" />
                      <div>
                        <h3 className="font-medium mb-1">Time</h3>
                        <p className="text-muted-foreground">{formatTime(event.date)}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col space-y-6">
                    <div className="flex items-start space-x-3">
                      <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                      <div>
                        <h3 className="font-medium mb-1">Location</h3>
                        <p className="text-muted-foreground">{event.location}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3">
                      <Users className="h-5 w-5 text-muted-foreground mt-0.5" />
                      <div>
                        <h3 className="font-medium mb-1">Volunteers</h3>
                        <p className="text-muted-foreground">
                          {event.volunteersRegistered.length} registered of {event.volunteersNeeded} needed
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="volunteers" className="mt-6">
                <div className="text-center py-8">
                  <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-xl font-medium mb-2">
                    {event.volunteersRegistered.length} Registered Volunteers
                  </h3>
                  {event.volunteersRegistered.length === 0 ? (
                    <p className="text-muted-foreground">
                      Be the first to volunteer for this event!
                    </p>
                  ) : (
                    <p className="text-muted-foreground">
                      Connect with other volunteers at this event.
                    </p>
                  )}
                </div>
              </TabsContent>
              
              <TabsContent value="discussion" className="mt-6">
                <div className="text-center py-8">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="48"
                    height="48"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="mx-auto text-muted-foreground mb-4"
                  >
                    <path d="M14 9a2 2 0 0 1-2 2H6l-4 4V4c0-1.1.9-2 2-2h8a2 2 0 0 1 2 2v5Z" />
                    <path d="M18 9h2a2 2 0 0 1 2 2v11l-4-4h-6a2 2 0 0 1-2-2v-1" />
                  </svg>
                  <h3 className="text-xl font-medium mb-2">Join the conversation</h3>
                  <p className="text-muted-foreground mb-4">
                    Chat with organizers and other volunteers
                  </p>
                  <Button>
                    View Discussion
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
        
        {/* Sidebar */}
        <div className="space-y-6">
          {/* Registration Card */}
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <h3 className="font-semibold text-xl">
                  {isRegistered ? "You're Registered" : "Register for this Event"}
                </h3>
                
                <div className="flex justify-between items-center py-3 border-y">
                  <span className="text-muted-foreground">Spots Remaining</span>
                  <span className="font-medium">
                    {event.volunteersNeeded - event.volunteersRegistered.length} of {event.volunteersNeeded}
                  </span>
                </div>
                
                <div className="pt-2">
                  <Button 
                    className="w-full"
                    variant={isRegistered ? "outline" : "default"}
                    onClick={handleRegister}
                    disabled={isRegistering}
                  >
                    {isRegistering ? "Processing..." : isRegistered ? "Cancel Registration" : "Register Now"}
                  </Button>
                  
                  <div className="flex justify-center mt-4">
                    <Button variant="ghost" size="sm">
                      <Share2 className="h-4 w-4 mr-1" />
                      Share Event
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Organization Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">About the Organization</CardTitle>
              <CardDescription>Event organizer details</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-4 mb-4">
                <Avatar>
                  <AvatarImage src="https://randomuser.me/api/portraits/men/32.jpg" />
                  <AvatarFallback>{event.organizationName.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <h4 className="font-medium">{event.organizationName}</h4>
                  <p className="text-sm text-muted-foreground">Event Organizer</p>
                </div>
              </div>
              <Button variant="outline" className="w-full">
                View Profile
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default EventDetail;
