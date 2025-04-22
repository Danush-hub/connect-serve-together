
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Certificate, MapPin, Award, Users } from "lucide-react";
import { Event, getVolunteerEvents, getAllEvents } from "@/services/eventService";
import { ScrollArea } from "@/components/ui/scroll-area";

const VolunteerDashboard = () => {
  const { currentUser, isAuthenticated, userRole } = useAuth();
  const navigate = useNavigate();
  const [registeredEvents, setRegisteredEvents] = useState<Event[]>([]);
  const [availableEvents, setAvailableEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check authentication and role
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    
    if (userRole !== "volunteer") {
      navigate("/organization-dashboard");
      return;
    }
    
    // Load events data
    const fetchEvents = async () => {
      try {
        // In a real app, we'd use the actual user ID
        const userEvents = await getVolunteerEvents(currentUser?.id || "user-1");
        setRegisteredEvents(userEvents);
        
        const allEvents = await getAllEvents();
        // Filter out events the user is already registered for
        const userEventIds = userEvents.map(event => event.id);
        setAvailableEvents(allEvents.filter(event => !userEventIds.includes(event.id)));
        
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

  // Mock data for volunteer stats
  const volunteerStats = {
    totalHours: 24,
    eventsAttended: registeredEvents.length,
    rewardPoints: 240,
    certificates: [
      { id: 'cert-1', title: 'Environmental Stewardship', date: '2025-03-15' },
      { id: 'cert-2', title: 'Community Service Excellence', date: '2025-02-10' }
    ],
    suggestedFriends: [
      { id: 'user-2', name: 'Jane Smith', image: 'https://randomuser.me/api/portraits/women/33.jpg' },
      { id: 'user-3', name: 'Carlos Mendez', image: 'https://randomuser.me/api/portraits/men/45.jpg' },
      { id: 'user-4', name: 'Sarah Johnson', image: 'https://randomuser.me/api/portraits/women/22.jpg' }
    ]
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
      <h1 className="text-3xl font-bold mb-6">Volunteer Dashboard</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* User Profile Card */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Profile</CardTitle>
            <CardDescription>Your volunteer profile</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-4 mb-4">
              <div className="w-16 h-16 rounded-full overflow-hidden">
                <img 
                  src={currentUser?.profileImage || "https://randomuser.me/api/portraits/women/44.jpg"} 
                  alt="Profile" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h3 className="font-semibold text-lg">{currentUser?.name}</h3>
                <p className="text-sm text-muted-foreground">{currentUser?.email}</p>
              </div>
            </div>
            
            <div className="space-y-3 pt-3 border-t">
              <h4 className="font-medium text-sm text-muted-foreground">Social Links</h4>
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
                    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                    <rect width="4" height="12" x="2" y="9"></rect>
                    <circle cx="4" cy="4" r="2"></circle>
                  </svg>
                  <span className="sr-only">LinkedIn</span>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Stats Card */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Your Stats</CardTitle>
            <CardDescription>Your volunteer activity summary</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg text-center">
                <div className="text-2xl font-bold text-volunteer">{volunteerStats.totalHours}</div>
                <div className="text-xs text-muted-foreground font-medium mt-1">HOURS</div>
              </div>
              <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg text-center">
                <div className="text-2xl font-bold text-volunteer">{volunteerStats.eventsAttended}</div>
                <div className="text-xs text-muted-foreground font-medium mt-1">EVENTS</div>
              </div>
              <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg text-center" style={{ gridColumn: "span 2" }}>
                <div className="flex items-center justify-center">
                  <Award className="h-5 w-5 text-event mr-2" />
                  <div className="text-2xl font-bold text-event">{volunteerStats.rewardPoints}</div>
                </div>
                <div className="text-xs text-muted-foreground font-medium mt-1">REWARD POINTS</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Certificates Card */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Certificates</CardTitle>
            <CardDescription>Your earned certificates</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {volunteerStats.certificates.map(cert => (
                <li key={cert.id} className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg flex items-center space-x-3">
                  <Certificate className="h-5 w-5 text-volunteer" />
                  <div className="flex-1">
                    <div className="font-medium">{cert.title}</div>
                    <div className="text-xs text-muted-foreground">{formatDate(cert.date)}</div>
                  </div>
                </li>
              ))}
              <li className="text-center pt-1">
                <Button variant="link" className="text-volunteer">View All Certificates</Button>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
      
      {/* Events Sections */}
      <Tabs defaultValue="upcoming">
        <div className="flex justify-between items-center mb-4">
          <TabsList>
            <TabsTrigger value="upcoming">Upcoming Events</TabsTrigger>
            <TabsTrigger value="past">Past Events</TabsTrigger>
            <TabsTrigger value="discover">Discover</TabsTrigger>
          </TabsList>
          
          <Button size="sm" asChild>
            <a href="/events">Find More Events</a>
          </Button>
        </div>
        
        <TabsContent value="upcoming" className="space-y-4">
          {registeredEvents.length === 0 ? (
            <div className="text-center py-10">
              <div className="text-5xl mb-4">📅</div>
              <h3 className="text-xl font-medium mb-2">No upcoming events</h3>
              <p className="text-muted-foreground mb-4">
                You haven't signed up for any upcoming volunteer events.
              </p>
              <Button asChild>
                <a href="/events">Browse Events</a>
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {registeredEvents.map(event => (
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
                    
                    <div className="flex justify-end mt-2">
                      <Button size="sm" variant="outline" className="text-red-500 hover:text-red-700 hover:bg-red-50">
                        Cancel Registration
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="past" className="space-y-4">
          <div className="text-center py-10">
            <div className="text-5xl mb-4">🏆</div>
            <h3 className="text-xl font-medium mb-2">No past events yet</h3>
            <p className="text-muted-foreground">
              Your completed volunteer events will appear here.
            </p>
          </div>
        </TabsContent>
        
        <TabsContent value="discover" className="space-y-4">
          {availableEvents.length === 0 ? (
            <div className="text-center py-10">
              <div className="text-5xl mb-4">🔍</div>
              <h3 className="text-xl font-medium mb-2">No events found</h3>
              <p className="text-muted-foreground">
                There are no new events available at the moment.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {availableEvents.slice(0, 3).map(event => (
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
                    
                    <div className="flex justify-end mt-2">
                      <Button size="sm">
                        Register
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
      
      {/* Additional Cards Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        {/* Suggested Friends */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">People You May Know</CardTitle>
            <CardDescription>Connect with other volunteers</CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-64">
              <div className="space-y-4">
                {volunteerStats.suggestedFriends.map(friend => (
                  <div key={friend.id} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-full overflow-hidden">
                        <img 
                          src={friend.image} 
                          alt={friend.name} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <div className="font-medium">{friend.name}</div>
                        <div className="text-xs text-muted-foreground">4 mutual connections</div>
                      </div>
                    </div>
                    <Button size="sm" variant="outline">
                      <Users className="h-4 w-4 mr-1" />
                      Connect
                    </Button>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
        
        {/* Upcoming Reminders */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Event Reminders</CardTitle>
            <CardDescription>Your upcoming volunteer commitments</CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-64">
              {registeredEvents.length === 0 ? (
                <div className="text-center py-8">
                  <div className="text-3xl mb-2">⏰</div>
                  <p className="text-muted-foreground">
                    No upcoming event reminders
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {registeredEvents.map(event => (
                    <div key={event.id} className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="font-medium">{event.title}</div>
                          <div className="text-sm text-muted-foreground">{formatDate(event.date)}</div>
                        </div>
                        <Badge variant="outline">{new Date(event.date) > new Date() ? "Upcoming" : "Past"}</Badge>
                      </div>
                      <div className="mt-2 text-sm text-muted-foreground flex items-center">
                        <MapPin className="h-3 w-3 mr-1" />
                        <span className="truncate">{event.location}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default VolunteerDashboard;
