
import { MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Event } from "@/services/eventService";

interface EventRemindersProps {
  events: Event[];
  formatDate: (date: string) => string;
}

export const EventReminders = ({ events, formatDate }: EventRemindersProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Event Reminders</CardTitle>
        <CardDescription>Your upcoming volunteer commitments</CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-64">
          {events.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-3xl mb-2">⏰</div>
              <p className="text-muted-foreground">
                No upcoming event reminders
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {events.map(event => (
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
  );
};
