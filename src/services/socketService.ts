
// This is a mock service to represent socket.io functionality
// In a real app, you would integrate with actual Socket.io client

type MessageHandler = (message: any) => void;

interface SocketListeners {
  [event: string]: MessageHandler[];
}

class SocketService {
  private connected: boolean = false;
  private listeners: SocketListeners = {};

  // Connect to socket server
  connect() {
    if (!this.connected) {
      console.log('Socket connected');
      this.connected = true;

      // Mock receiving messages every 15 seconds
      setInterval(() => {
        if (this.connected && this.listeners['chat-message']) {
          this.listeners['chat-message'].forEach(handler => {
            handler({
              id: `msg-${Date.now()}`,
              sender: 'System',
              content: `This is a mock message from the Socket.IO service at ${new Date().toLocaleTimeString()}`,
              timestamp: new Date().toISOString()
            });
          });
        }
      }, 15000);
    }
    return this;
  }

  // Disconnect socket
  disconnect() {
    if (this.connected) {
      console.log('Socket disconnected');
      this.connected = false;
    }
  }

  // Register event listener
  on(event: string, callback: MessageHandler) {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event].push(callback);
  }

  // Remove event listener
  off(event: string, callback?: MessageHandler) {
    if (!callback) {
      delete this.listeners[event];
    } else if (this.listeners[event]) {
      this.listeners[event] = this.listeners[event].filter(cb => cb !== callback);
    }
  }

  // Send message
  emit(event: string, data: any) {
    console.log(`Socket emitting: ${event}`, data);
    
    // Mock echo for chat messages
    if (event === 'send-message') {
      setTimeout(() => {
        if (this.listeners['chat-message']) {
          this.listeners['chat-message'].forEach(handler => {
            handler({
              ...data,
              id: `msg-${Date.now()}`,
              timestamp: new Date().toISOString()
            });
          });
        }
      }, 500);
    }
  }
}

export default new SocketService();
