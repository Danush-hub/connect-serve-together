
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { getAllEvents } from "@/services/eventService";
import { useEffect, useState } from "react";
import { Event } from "@/services/eventService";
import { Calendar, MapPin, Users } from "lucide-react";

const Index = () => {
  const [featuredEvents, setFeaturedEvents] = useState<Event[]>([]);
  
  useEffect(() => {
    const loadEvents = async () => {
      try {
        const events = await getAllEvents();
        // Just take the first 3 events for the featured section
        setFeaturedEvents(events.slice(0, 3));
      } catch (error) {
        console.error("Error loading events:", error);
      }
    };
    
    loadEvents();
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="hero-gradient text-white py-20 md:py-32">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-10">
            <div className="max-w-lg space-y-5">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight animate-fade-in">
                Make a Difference in Your Community
              </h1>
              <p className="text-lg md:text-xl opacity-90 animate-fade-in" style={{ animationDelay: "0.2s" }}>
                Connect with meaningful volunteer opportunities and organizations making a positive impact.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 pt-4 animate-fade-in" style={{ animationDelay: "0.4s" }}>
                <Button size="lg" asChild className="bg-white text-volunteer hover:bg-gray-100">
                  <Link to="/register">Get Started</Link>
                </Button>
                <Button size="lg" variant="outline" asChild className="border-white text-white hover:bg-white/10">
                  <Link to="/events">Find Events</Link>
                </Button>
              </div>
            </div>
            
            <div className="w-full lg:w-1/2 h-64 md:h-80 lg:h-96 animate-fade-in" style={{ animationDelay: "0.6s" }}>
              <div className="w-full h-full relative rounded-xl overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1546552082-11d50a2cb053?q=80&w=2071&auto=format&fit=crop&ixlib=rb-4.0.3" 
                  alt="Volunteers working together" 
                  className="w-full h-full object-cover"
                />
                {/* Overlay with stats */}
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                  <div className="grid grid-cols-3 w-full">
                    <div className="text-center p-4">
                      <p className="text-3xl md:text-4xl font-bold">500+</p>
                      <p className="text-sm md:text-base">Volunteers</p>
                    </div>
                    <div className="text-center p-4 border-x border-white/30">
                      <p className="text-3xl md:text-4xl font-bold">100+</p>
                      <p className="text-sm md:text-base">Organizations</p>
                    </div>
                    <div className="text-center p-4">
                      <p className="text-3xl md:text-4xl font-bold">2,500+</p>
                      <p className="text-sm md:text-base">Hours Served</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 md:py-24 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">How It Works</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              VolunteerConnect makes it easy to find and participate in volunteer opportunities that match your interests and schedule.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="glass-card card-hover">
              <CardContent className="pt-6">
                <div className="rounded-full bg-volunteer/10 p-3 w-12 h-12 flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-volunteer" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Sign Up</h3>
                <p className="text-muted-foreground">
                  Create a volunteer account or register your organization to get started.
                </p>
              </CardContent>
            </Card>
            
            <Card className="glass-card card-hover">
              <CardContent className="pt-6">
                <div className="rounded-full bg-event/10 p-3 w-12 h-12 flex items-center justify-center mb-4">
                  <Calendar className="h-6 w-6 text-event" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Find Events</h3>
                <p className="text-muted-foreground">
                  Browse volunteer opportunities that match your interests and availability.
                </p>
              </CardContent>
            </Card>
            
            <Card className="glass-card card-hover">
              <CardContent className="pt-6">
                <div className="rounded-full bg-organization/10 p-3 w-12 h-12 flex items-center justify-center mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-6 w-6 text-organization"
                  >
                    <path d="M14 9a2 2 0 0 1-2 2H6l-4 4V4c0-1.1.9-2 2-2h8a2 2 0 0 1 2 2v5Z" />
                    <path d="M18 9h2a2 2 0 0 1 2 2v11l-4-4h-6a2 2 0 0 1-2-2v-1" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">Make an Impact</h3>
                <p className="text-muted-foreground">
                  Volunteer your time, track your impact, and connect with like-minded individuals.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Featured Events Section */}
      {featuredEvents.length > 0 && (
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4 md:px-6">
            <div className="flex justify-between items-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold">Featured Events</h2>
              <Button asChild variant="outline">
                <Link to="/events">View All</Link>
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredEvents.map((event) => (
                <Card key={event.id} className="overflow-hidden card-hover">
                  <div className="h-48 w-full relative">
                    <img
                      src={event.imageUrl}
                      alt={event.title}
                      className="h-full w-full object-cover"
                    />
                    <div className="absolute top-2 right-2">
                      <Badge className="bg-event text-event-dark">{event.category}</Badge>
                    </div>
                  </div>
                  <CardContent className="p-5 space-y-4">
                    <h3 className="font-semibold text-xl truncate">{event.title}</h3>
                    
                    <div className="flex items-center text-muted-foreground">
                      <Calendar className="h-4 w-4 mr-1" />
                      <span className="text-sm">{formatDate(event.date)}</span>
                    </div>
                    
                    <div className="flex items-center text-muted-foreground">
                      <MapPin className="h-4 w-4 mr-1" />
                      <span className="text-sm truncate">{event.location}</span>
                    </div>
                    
                    <div className="flex items-center justify-between mt-4">
                      <div className="text-sm text-muted-foreground">
                        {event.volunteersRegistered.length} / {event.volunteersNeeded} volunteers
                      </div>
                      <Button size="sm" asChild>
                        <Link to={`/events/${event.id}`}>View Details</Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-16 bg-volunteer text-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-10">
            <div className="max-w-lg">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Make a Difference?</h2>
              <p className="text-lg opacity-90">
                Whether you're looking to volunteer or seeking volunteers for your organization, join our community today.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" variant="outline" asChild className="border-white text-white hover:bg-white/10">
                <Link to="/register?role=volunteer">Join as Volunteer</Link>
              </Button>
              <Button size="lg" asChild className="bg-white text-volunteer hover:bg-gray-100">
                <Link to="/register?role=organization">Register Organization</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
