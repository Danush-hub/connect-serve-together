
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"volunteer" | "organization">("volunteer");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast({
        title: "Error",
        description: "Please enter both email and password",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      await login(email, password, activeTab);
      
      toast({
        title: "Success",
        description: "You have successfully logged in!",
      });
      
      // Redirect to appropriate dashboard
      navigate(`/${activeTab}-dashboard`);
    } catch (error) {
      toast({
        title: "Login Failed",
        description: "Invalid email or password",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container flex items-center justify-center min-h-[calc(100vh-13rem)] py-12">
      <div className="w-full max-w-md">
        <Tabs defaultValue="volunteer" onValueChange={(value) => setActiveTab(value as "volunteer" | "organization")}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="volunteer">Volunteer</TabsTrigger>
            <TabsTrigger value="organization">Organization</TabsTrigger>
          </TabsList>
          
          <TabsContent value="volunteer">
            <Card>
              <CardHeader>
                <CardTitle>Volunteer Login</CardTitle>
                <CardDescription>
                  Login to your volunteer account to find and join events.
                </CardDescription>
              </CardHeader>
              <form onSubmit={handleSubmit}>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="volunteer-email">Email</Label>
                    <Input
                      id="volunteer-email"
                      type="email"
                      placeholder="name@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="volunteer-password">Password</Label>
                      <Link to="/forgot-password" className="text-sm text-volunteer hover:underline">
                        Forgot password?
                      </Link>
                    </div>
                    <Input
                      id="volunteer-password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                </CardContent>
                <CardFooter className="flex flex-col space-y-4">
                  <Button 
                    className="w-full bg-volunteer hover:bg-volunteer-dark" 
                    type="submit" 
                    disabled={isLoading}
                  >
                    {isLoading ? "Logging in..." : "Login as Volunteer"}
                  </Button>
                  <p className="text-sm text-center text-muted-foreground">
                    Don't have an account?{" "}
                    <Link to="/register" className="text-volunteer hover:underline">
                      Create an account
                    </Link>
                  </p>
                </CardFooter>
              </form>
            </Card>
          </TabsContent>
          
          <TabsContent value="organization">
            <Card>
              <CardHeader>
                <CardTitle>Organization Login</CardTitle>
                <CardDescription>
                  Login to your organization account to create and manage events.
                </CardDescription>
              </CardHeader>
              <form onSubmit={handleSubmit}>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="org-email">Email</Label>
                    <Input
                      id="org-email"
                      type="email"
                      placeholder="organization@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="org-password">Password</Label>
                      <Link to="/forgot-password" className="text-sm text-volunteer hover:underline">
                        Forgot password?
                      </Link>
                    </div>
                    <Input
                      id="org-password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                </CardContent>
                <CardFooter className="flex flex-col space-y-4">
                  <Button 
                    className="w-full bg-organization hover:bg-organization-dark" 
                    type="submit" 
                    disabled={isLoading}
                  >
                    {isLoading ? "Logging in..." : "Login as Organization"}
                  </Button>
                  <p className="text-sm text-center text-muted-foreground">
                    Don't have an account?{" "}
                    <Link to="/register" className="text-volunteer hover:underline">
                      Create an account
                    </Link>
                  </p>
                </CardFooter>
              </form>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Login;
