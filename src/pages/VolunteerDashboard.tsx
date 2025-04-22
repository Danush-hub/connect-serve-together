
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Event, getVolunteerEvents, getAllEvents } from "@/services/eventService";
import { VolunteerProfile } from "@/components/volunteer/VolunteerProfile";
import { VolunteerStats } from "@/components/volunteer/VolunteerStats";
import { VolunteerCertificates } from "@/components/volunteer/VolunteerCertificates";
import { EventsList } from "@/components/volunteer/EventsList";
import { SuggestedFriends } from "@/components/volunteer/SuggestedFriends";
import { EventReminders } from "@/components/volunteer/EventReminders";

const VolunteerDashboard = () => {
  const { currentUser, isAuthenticated, userRole } = useAuth();
  const navigate = useNavigate();
  const [registeredEvents, setRegisteredEvents] = useState<Event[]>([]);
  const [availableEvents, setAvailableEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    
    if (userRole !== "volunteer") {
      navigate("/organization-dashboard");
      return;
    }
    
    const fetchEvents = async () => {
      try {
        const userEvents = await getVolunteerEvents(currentUser?.id || "user-1");
        setRegisteredEvents(userEvents);
        
        const allEvents = await getAllEvents();
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
        <VolunteerProfile
          name={currentUser?.name || ""}
          email={currentUser?.email || ""}
          profileImage={currentUser?.profileImage || ""}
        />
        
        <VolunteerStats
          totalHours={volunteerStats.totalHours}
          eventsAttended={volunteerStats.eventsAttended}
          rewardPoints={volunteerStats.rewardPoints}
        />
        
        <VolunteerCertificates
          certificates={volunteerStats.certificates}
          formatDate={formatDate}
        />
      </div>
      
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
        
        <TabsContent value="upcoming">
          <EventsList
            events={registeredEvents}
            formatDate={formatDate}
            type="registered"
          />
        </TabsContent>
        
        <TabsContent value="past">
          <div className="text-center py-10">
            <div className="text-5xl mb-4">🏆</div>
            <h3 className="text-xl font-medium mb-2">No past events yet</h3>
            <p className="text-muted-foreground">
              Your completed volunteer events will appear here.
            </p>
          </div>
        </TabsContent>
        
        <TabsContent value="discover">
          <EventsList
            events={availableEvents.slice(0, 3)}
            formatDate={formatDate}
            type="available"
          />
        </TabsContent>
      </Tabs>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        <SuggestedFriends friends={volunteerStats.suggestedFriends} />
        <EventReminders events={registeredEvents} formatDate={formatDate} />
      </div>
    </div>
  );
};

export default VolunteerDashboard;
