
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar, MapPin, Users, FilterX, Filter } from "lucide-react";
import { Event, getAllEvents } from "@/services/eventService";

const Events = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Filter state
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("");
  const [sortBy, setSortBy] = useState<string>("date");
  const [filtersActive, setFiltersActive] = useState(false);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const eventsData = await getAllEvents();
        setEvents(eventsData);
        setFilteredEvents(eventsData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching events:", error);
        setLoading(false);
      }
    };
    
    fetchEvents();
  }, []);

  useEffect(() => {
    // Apply filters and sort
    let results = [...events];
    
    // Apply search term filter
    if (searchTerm) {
      results = results.filter(
        event => 
          event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          event.location.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Apply category filter
    if (categoryFilter) {
      results = results.filter(event => event.category === categoryFilter);
    }
    
    // Apply sorting
    results.sort((a, b) => {
      switch(sortBy) {
        case "date":
          return new Date(a.date).getTime() - new Date(b.date).getTime();
        case "name":
          return a.title.localeCompare(b.title);
        case "spots":
          const aSpots = a.volunteersNeeded - a.volunteersRegistered.length;
          const bSpots = b.volunteersNeeded - b.volunteersRegistered.length;
          return bSpots - aSpots;
        default:
          return 0;
      }
    });
    
    setFilteredEvents(results);
    setFiltersActive(!!searchTerm || !!categoryFilter);
  }, [events, searchTerm, categoryFilter, sortBy]);

  const clearFilters = () => {
    setSearchTerm("");
    setCategoryFilter("");
    setSortBy("date");
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="container py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2">Volunteer Events</h1>
          <p className="text-muted-foreground">
            Find and join volunteer opportunities in your community
          </p>
        </div>
      </div>
      
      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="col-span-1 md:col-span-2">
          <Input
            placeholder="Search by event name, description, or location"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
          />
        </div>
        <div className="grid grid-cols-2 gap-2">
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Categories</SelectItem>
              <SelectItem value="environment">Environment</SelectItem>
              <SelectItem value="community">Community</SelectItem>
              <SelectItem value="education">Education</SelectItem>
              <SelectItem value="healthcare">Healthcare</SelectItem>
              <SelectItem value="animals">Animal Welfare</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger>
              <SelectValue placeholder="Sort By" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="date">Upcoming</SelectItem>
              <SelectItem value="name">Name</SelectItem>
              <SelectItem value="spots">Available Spots</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      {/* Filter status and clear */}
      {filtersActive && (
        <div className="flex justify-between items-center mb-4 p-3 bg-muted rounded-md">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            <span>
              Showing {filteredEvents.length} of {events.length} events
            </span>
          </div>
          <Button variant="ghost" size="sm" onClick={clearFilters}>
            <FilterX className="h-4 w-4 mr-1" />
            Clear Filters
          </Button>
        </div>
      )}
      
      {/* Events list */}
      {loading ? (
        <div className="text-center py-16">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading events...</p>
        </div>
      ) : filteredEvents.length === 0 ? (
        <div className="text-center py-16 bg-gray-50 dark:bg-gray-900 rounded-lg">
          <div className="text-5xl mb-4">🔍</div>
          <h3 className="text-xl font-medium mb-2">No events found</h3>
          <p className="text-muted-foreground mb-4">
            Try adjusting your filters or search terms
          </p>
          <Button onClick={clearFilters}>View All Events</Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map(event => (
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
                <p className="text-muted-foreground line-clamp-2">
                  {event.description}
                </p>
                
                <div className="flex items-center text-muted-foreground">
                  <Calendar className="h-4 w-4 mr-1" />
                  <span className="text-sm">{formatDate(event.date)}</span>
                </div>
                
                <div className="flex items-center text-muted-foreground">
                  <MapPin className="h-4 w-4 mr-1" />
                  <span className="text-sm truncate">{event.location}</span>
                </div>
                
                <div className="flex items-center justify-between mt-4">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Users className="h-4 w-4 mr-1" />
                    <span>
                      {event.volunteersRegistered.length} / {event.volunteersNeeded}
                    </span>
                  </div>
                  <Button size="sm" asChild>
                    <Link to={`/events/${event.id}`}>View Details</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Events;
