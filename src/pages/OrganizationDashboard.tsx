
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, MapPin, Users, Plus } from "lucide-react";
import { Event, getEventsByOrganization, createEvent } from "@/services/eventService";
import { useToast } from "@/components/ui/use-toast";

const OrganizationDashboard = () => {
  const { currentUser, isAuthenticated, userRole } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [organizationEvents, setOrganizationEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  // New event form state
  const [newEvent, setNewEvent] = useState({
    title: "",
    description: "",
    date: "",
    location: "",
    category: "community",
    imageUrl: "https://images.unsplash.com/photo-1531206715517-5c0ba140b2b8?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3",
    volunteersNeeded: 10
  });
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isCreatingEvent, setIsCreatingEvent] = useState(false);

  useEffect(() => {
    // Check authentication and role
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    
    if (userRole !== "organization") {
      navigate("/volunteer-dashboard");
      return;
    }
    
    // Load events data
    const fetchEvents = async () => {
      try {
        // In a real app, we'd use the actual organization ID
        const events = await getEventsByOrganization(currentUser?.id || "org-1");
        setOrganizationEvents(events);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching events:", error);
        setLoading(false);
      }
    };
    
    fetchEvents();
  }, [isAuthenticated, userRole, navigate, currentUser]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const handleNewEventChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewEvent(prev => ({ ...prev, [name]: value }));
  };

  const handleCategoryChange = (value: string) => {
    setNewEvent(prev => ({ ...prev, category: value }));
  };

  const handleVolunteersNeededChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value) || 0;
    setNewEvent(prev => ({ ...prev, volunteersNeeded: value }));
  };

  const handleCreateEvent = async () => {
    // Validate form
    if (!newEvent.title || !newEvent.description || !newEvent.date || !newEvent.location) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }
    
    setIsCreatingEvent(true);
    
    try {
      // In a real app, this would be an API call
      const event = await createEvent({
        ...newEvent,
        organizationId: currentUser?.id || "org-1",
        organizationName: currentUser?.name || "Organization Name"
      });
      
      // Update local state
      setOrganizationEvents(prev => [...prev, event]);
      
      // Close dialog and reset form
      setIsDialogOpen(false);
      setNewEvent({
        title: "",
        description: "",
        date: "",
        location: "",
        category: "community",
        imageUrl: "https://images.unsplash.com/photo-1531206715517-5c0ba140b2b8?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3",
        volunteersNeeded: 10
      });
      
      toast({
        title: "Success",
        description: "Event created successfully",
      });
    } catch (error) {
      console.error("Error creating event:", error);
      toast({
        title: "Error",
        description: "Failed to create event",
        variant: "destructive",
      });
    } finally {
      setIsCreatingEvent(false);
    }
  };

  // Mock data for organization stats
  const orgStats = {
    totalVolunteers: 42,
    eventsHosted: organizationEvents.length,
    volunteerHours: 156,
    averageFeedback: 4.7
  };

  if (loading) {
    return (
      <div className="container py-8 flex items-center justify-center min-h-[calc(100vh-13rem)]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Organization Dashboard</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create New Event
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[550px]">
            <DialogHeader>
              <DialogTitle>Create New Volunteer Event</DialogTitle>
              <DialogDescription>
                Fill in the details below to create a new volunteer opportunity
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="title">Event Title</Label>
                <Input
                  id="title"
                  name="title"
                  placeholder="Enter event title"
                  value={newEvent.title}
                  onChange={handleNewEventChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  placeholder="Describe the volunteer opportunity"
                  value={newEvent.description}
                  onChange={handleNewEventChange}
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="date">Date and Time</Label>
                  <Input
                    id="date"
                    name="date"
                    type="datetime-local"
                    value={newEvent.date}
                    onChange={handleNewEventChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    name="location"
                    placeholder="Event location"
                    value={newEvent.location}
                    onChange={handleNewEventChange}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select value={newEvent.category} onValueChange={handleCategoryChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="environment">Environment</SelectItem>
                      <SelectItem value="community">Community</SelectItem>
                      <SelectItem value="education">Education</SelectItem>
                      <SelectItem value="healthcare">Healthcare</SelectItem>
                      <SelectItem value="animals">Animal Welfare</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="volunteersNeeded">Volunteers Needed</Label>
                  <Input
                    id="volunteersNeeded"
                    name="volunteersNeeded"
                    type="number"
                    min="1"
                    value={newEvent.volunteersNeeded}
                    onChange={handleVolunteersNeededChange}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="imageUrl">Image URL</Label>
                <Input
                  id="imageUrl"
                  name="imageUrl"
                  placeholder="URL for event image"
                  value={newEvent.imageUrl}
                  onChange={handleNewEventChange}
                />
                <p className="text-xs text-muted-foreground">
                  Enter a URL for an image that represents your event
                </p>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateEvent} disabled={isCreatingEvent}>
                {isCreatingEvent ? "Creating..." : "Create Event"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Organization Profile Card */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Organization Profile</CardTitle>
            <CardDescription>Your organization details</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-4 mb-4">
              <div className="w-16 h-16 rounded-full overflow-hidden">
                <img 
                  src={currentUser?.profileImage || "https://randomuser.me/api/portraits/men/32.jpg"} 
                  alt="Organization Logo" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h3 className="font-semibold text-lg">{currentUser?.name}</h3>
                <p className="text-sm text-muted-foreground">{currentUser?.email}</p>
              </div>
            </div>
            
            <div className="space-y-3 pt-3 border-t">
              <h4 className="font-medium text-sm text-muted-foreground">Organization Links</h4>
              <div className="flex space-x-2">
                <Button size="icon" variant="outline">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                  </svg>
                  <span className="sr-only">Facebook</span>
                </Button>
                <Button size="icon" variant="outline">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
                  </svg>
                  <span className="sr-only">Twitter</span>
                </Button>
                <Button size="icon" variant="outline">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M12 2H2v10l9.29 9.29c.94.94 2.48.94 3.42 0l6.58-6.58c.94-.94.94-2.48 0-3.42L12 2Z"></path>
                    <path d="M7 7h.01"></path>
                  </svg>
                  <span className="sr-only">Website</span>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Stats Card */}
        <Card className="col-span-1 lg:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle>Volunteer Statistics</CardTitle>
            <CardDescription>Overview of your volunteer impact</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg text-center">
                <div className="text-2xl font-bold text-organization">{orgStats.totalVolunteers}</div>
                <div className="text-xs text-muted-foreground font-medium mt-1">VOLUNTEERS</div>
              </div>
              <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg text-center">
                <div className="text-2xl font-bold text-organization">{orgStats.eventsHosted}</div>
                <div className="text-xs text-muted-foreground font-medium mt-1">EVENTS</div>
              </div>
              <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg text-center">
                <div className="text-2xl font-bold text-organization">{orgStats.volunteerHours}</div>
                <div className="text-xs text-muted-foreground font-medium mt-1">VOLUNTEER HOURS</div>
              </div>
              <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg text-center">
                <div className="text-2xl font-bold text-organization">{orgStats.averageFeedback}</div>
                <div className="text-xs text-muted-foreground font-medium mt-1">AVG RATING</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Events Sections */}
      <Tabs defaultValue="active">
        <div className="flex justify-between items-center mb-4">
          <TabsList>
            <TabsTrigger value="active">Active Events</TabsTrigger>
            <TabsTrigger value="past">Past Events</TabsTrigger>
            <TabsTrigger value="draft">Draft Events</TabsTrigger>
          </TabsList>
        </div>
        
        <TabsContent value="active" className="space-y-4">
          {organizationEvents.length === 0 ? (
            <div className="text-center py-10 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="text-5xl mb-4">📅</div>
              <h3 className="text-xl font-medium mb-2">No active events</h3>
              <p className="text-muted-foreground mb-4">
                You haven't created any active volunteer events yet.
              </p>
              <Button onClick={() => setIsDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Create Your First Event
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {organizationEvents.map(event => (
                <Card key={event.id} className="overflow-hidden card-hover">
                  <div className="h-40 w-full relative">
                    <img
                      src={event.imageUrl}
                      alt={event.title}
                      className="h-full w-full object-cover"
                    />
                    <div className="absolute top-2 right-2">
                      <Badge className="bg-event text-event-dark">{event.category}</Badge>
                    </div>
                  </div>
                  <CardContent className="p-5 space-y-3">
                    <h3 className="font-semibold text-lg truncate">{event.title}</h3>
                    
                    <div className="flex items-center text-muted-foreground">
                      <Calendar className="h-4 w-4 mr-1" />
                      <span className="text-sm">{formatDate(event.date)}</span>
                    </div>
                    
                    <div className="flex items-center text-muted-foreground">
                      <MapPin className="h-4 w-4 mr-1" />
                      <span className="text-sm truncate">{event.location}</span>
                    </div>
                    
                    <div className="flex items-center text-muted-foreground">
                      <Users className="h-4 w-4 mr-1" />
                      <span className="text-sm">{event.volunteersRegistered.length} / {event.volunteersNeeded} volunteers</span>
                    </div>
                    
                    <div className="flex justify-between mt-2">
                      <Button size="sm" variant="outline" asChild>
                        <a href={`/events/${event.id}`}>View</a>
                      </Button>
                      <Button size="sm">
                        Manage
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="past" className="space-y-4">
          <div className="text-center py-10 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div className="text-5xl mb-4">🏆</div>
            <h3 className="text-xl font-medium mb-2">No past events</h3>
            <p className="text-muted-foreground">
              Your completed events will appear here.
            </p>
          </div>
        </TabsContent>
        
        <TabsContent value="draft" className="space-y-4">
          <div className="text-center py-10 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div className="text-5xl mb-4">📝</div>
            <h3 className="text-xl font-medium mb-2">No draft events</h3>
            <p className="text-muted-foreground mb-4">
              You don't have any events saved as drafts.
            </p>
            <Button onClick={() => setIsDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Create New Event
            </Button>
          </div>
        </TabsContent>
      </Tabs>
      
      {/* Map placeholder */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Event Locations Map</CardTitle>
          <CardDescription>Geographic distribution of your volunteer events</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="bg-gray-100 dark:bg-gray-800 h-96 w-full flex items-center justify-center">
            <div className="text-center">
              <MapPin className="h-12 w-12 text-muted-foreground mb-2 mx-auto" />
              <p className="text-muted-foreground">
                Event map visualization available with MongoDB and MapBox integration
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OrganizationDashboard;
