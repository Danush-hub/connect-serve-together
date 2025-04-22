
import { Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Friend {
  id: string;
  name: string;
  image: string;
}

interface SuggestedFriendsProps {
  friends: Friend[];
}

export const SuggestedFriends = ({ friends }: SuggestedFriendsProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">People You May Know</CardTitle>
        <CardDescription>Connect with other volunteers</CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-64">
          <div className="space-y-4">
            {friends.map(friend => (
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
  );
};
