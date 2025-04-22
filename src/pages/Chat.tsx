
import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import socketService from "@/services/socketService";
import { Send } from "lucide-react";

interface Message {
  id: string;
  sender: string;
  content: string;
  timestamp: string;
  senderId?: string;
  senderAvatar?: string;
}

const Chat = () => {
  const { currentUser, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  // Mock chat rooms
  const mockChatRooms = [
    { id: 'chat-1', name: 'Beach Cleanup Volunteers', unread: 0 },
    { id: 'chat-2', name: 'Food Bank Team', unread: 2 },
    { id: 'chat-3', name: 'Tech Workshop Group', unread: 0 },
    { id: 'chat-4', name: 'Park Restoration Team', unread: 0 },
    { id: 'chat-5', name: 'After-School Tutors', unread: 1 },
  ];
  
  // Mock online users
  const mockOnlineUsers = [
    { id: 'user-1', name: 'John Doe', avatar: 'https://randomuser.me/api/portraits/men/41.jpg', isOnline: true },
    { id: 'user-2', name: 'Jane Smith', avatar: 'https://randomuser.me/api/portraits/women/33.jpg', isOnline: true },
    { id: 'user-3', name: 'Carlos Mendez', avatar: 'https://randomuser.me/api/portraits/men/45.jpg', isOnline: false },
    { id: 'user-4', name: 'Sarah Johnson', avatar: 'https://randomuser.me/api/portraits/women/22.jpg', isOnline: true },
    { id: 'user-5', name: 'Robert Chen', avatar: 'https://randomuser.me/api/portraits/men/76.jpg', isOnline: false },
  ];

  // Check authentication and connect to socket
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    
    // Connect to socket
    socketService.connect();
    setIsConnected(true);
    
    // Initialize with some mock messages
    setMessages([
      {
        id: 'msg-1',
        sender: 'System',
        content: 'Welcome to the Beach Cleanup Volunteers chat room!',
        timestamp: new Date(Date.now() - 3600000).toISOString(),
      },
      {
        id: 'msg-2',
        sender: 'Jane Smith',
        senderId: 'user-2',
        senderAvatar: 'https://randomuser.me/api/portraits/women/33.jpg',
        content: 'Hey everyone! Looking forward to the cleanup on Saturday!',
        timestamp: new Date(Date.now() - 1800000).toISOString(),
      },
      {
        id: 'msg-3',
        sender: 'Robert Chen',
        senderId: 'user-5',
        senderAvatar: 'https://randomuser.me/api/portraits/men/76.jpg',
        content: 'I'll bring extra trash bags just in case.',
        timestamp: new Date(Date.now() - 900000).toISOString(),
      }
    ]);
    
    // Listen for chat messages
    socketService.on('chat-message', (message) => {
      setMessages(prev => [...prev, message]);
      
      // Scroll to bottom on new message
      setTimeout(() => {
        if (scrollAreaRef.current) {
          scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
        }
      }, 100);
    });
    
    return () => {
      socketService.off('chat-message');
      socketService.disconnect();
    };
  }, [isAuthenticated, navigate]);

  // Scroll to bottom on initial render
  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, []);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newMessage.trim()) return;
    
    const message = {
      sender: currentUser?.name || 'Anonymous',
      senderId: currentUser?.id,
      senderAvatar: currentUser?.profileImage,
      content: newMessage.trim(),
    };
    
    socketService.emit('send-message', message);
    setNewMessage("");
  };

  const formatMessageTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="container py-6">
      <h1 className="text-3xl font-bold mb-6">Messages</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar with chat rooms and online users */}
        <div className="lg:col-span-1 space-y-6">
          {/* Chat Rooms */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Chat Rooms</CardTitle>
              <CardDescription>Your volunteer groups</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="space-y-1">
                {mockChatRooms.map(room => (
                  <div 
                    key={room.id}
                    className={`flex items-center justify-between px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 ${room.id === 'chat-1' ? 'bg-gray-100 dark:bg-gray-800' : ''}`}
                  >
                    <div className="truncate">{room.name}</div>
                    {room.unread > 0 && (
                      <Badge variant="secondary" className="ml-2 bg-volunteer text-white">
                        {room.unread}
                      </Badge>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          
          {/* Online Users */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Online</CardTitle>
              <CardDescription>Members currently available</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="space-y-1">
                {mockOnlineUsers.map(user => (
                  <div 
                    key={user.id}
                    className="flex items-center px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800"
                  >
                    <div className="relative">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={user.avatar} />
                        <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      {user.isOnline && (
                        <span className="absolute bottom-0 right-0 h-2 w-2 rounded-full bg-green-500 ring-1 ring-white"></span>
                      )}
                    </div>
                    <div className="ml-2 truncate">{user.name}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Main chat area */}
        <div className="lg:col-span-3">
          <Card className="flex flex-col h-[calc(100vh-13rem)]">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Beach Cleanup Volunteers</CardTitle>
                  <CardDescription>
                    {isConnected ? 
                      `${mockOnlineUsers.filter(user => user.isOnline).length} members online` : 
                      'Connecting...'}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="flex-1 overflow-hidden p-0">
              <ScrollArea className="h-full p-4" ref={scrollAreaRef}>
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div key={message.id} className="flex items-start gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={message.senderAvatar} />
                        <AvatarFallback>{message.sender.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-sm">
                            {message.sender}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {formatMessageTime(message.timestamp)}
                          </span>
                        </div>
                        <div className="rounded-md bg-muted p-3">
                          <p className="text-sm">{message.content}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
            
            <div className="p-4 border-t">
              <form onSubmit={handleSendMessage} className="flex items-center space-x-2">
                <Input
                  placeholder="Type your message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  className="flex-1"
                />
                <Button type="submit" size="icon">
                  <Send className="h-4 w-4" />
                  <span className="sr-only">Send</span>
                </Button>
              </form>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Chat;
