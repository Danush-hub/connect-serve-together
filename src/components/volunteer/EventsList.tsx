
import { Calendar, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Event } from "@/services/eventService";

interface EventsListProps {
  events: Event[];
  formatDate: (date: string) => string;
  type: "registered" | "available";
}

export const EventsList = ({ events, formatDate, type }: EventsListProps) => {
  if (events.length === 0) {
    return (
      <div className="text-center py-10">
        <div className="text-5xl mb-4">📅</div>
        <h3 className="text-xl font-medium mb-2">
          {type === "registered" ? "No upcoming events" : "No events found"}
        </h3>
        <p className="text-muted-foreground mb-4">
          {type === "registered" 
            ? "You haven't signed up for any upcoming volunteer events."
            : "There are no new events available at the moment."}
        </p>
        {type === "registered" && (
          <Button asChild>
            <a href="/events">Browse Events</a>
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {events.map(event => (
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
              {type === "registered" ? (
                <Button size="sm" variant="outline" className="text-red-500 hover:text-red-700 hover:bg-red-50">
                  Cancel Registration
                </Button>
              ) : (
                <Button size="sm">
                  Register
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
