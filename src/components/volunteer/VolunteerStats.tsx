
import { Award } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface VolunteerStatsProps {
  totalHours: number;
  eventsAttended: number;
  rewardPoints: number;
}

export const VolunteerStats = ({ totalHours, eventsAttended, rewardPoints }: VolunteerStatsProps) => {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle>Your Stats</CardTitle>
        <CardDescription>Your volunteer activity summary</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg text-center">
            <div className="text-2xl font-bold text-volunteer">{totalHours}</div>
            <div className="text-xs text-muted-foreground font-medium mt-1">HOURS</div>
          </div>
          <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg text-center">
            <div className="text-2xl font-bold text-volunteer">{eventsAttended}</div>
            <div className="text-xs text-muted-foreground font-medium mt-1">EVENTS</div>
          </div>
          <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg text-center" style={{ gridColumn: "span 2" }}>
            <div className="flex items-center justify-center">
              <Award className="h-5 w-5 text-event mr-2" />
              <div className="text-2xl font-bold text-event">{rewardPoints}</div>
            </div>
            <div className="text-xs text-muted-foreground font-medium mt-1">REWARD POINTS</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
