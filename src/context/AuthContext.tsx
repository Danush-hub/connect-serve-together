
import { createContext, useState, useEffect, useContext, ReactNode } from 'react';

type UserRole = 'volunteer' | 'organization' | null;

interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  profileImage?: string;
}

interface AuthContextType {
  currentUser: User | null;
  isAuthenticated: boolean;
  userRole: UserRole;
  login: (email: string, password: string, role: UserRole) => Promise<void>;
  register: (name: string, email: string, password: string, role: UserRole) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userRole, setUserRole] = useState<UserRole>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  // Check for existing user on load
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const user = JSON.parse(storedUser);
      setCurrentUser(user);
      setUserRole(user.role);
      setIsAuthenticated(true);
    }
  }, []);

  // Mock authentication functions (in a real app, these would make API calls)
  const login = async (email: string, password: string, role: UserRole) => {
    // In a real app, this would be an API call to the backend
    // This is just a mockup for demo purposes
    return new Promise<void>((resolve, reject) => {
      // Simulate API call
      setTimeout(() => {
        if (email && password) {
          const mockUser = {
            id: `user-${Date.now()}`,
            name: email.split('@')[0],
            email,
            role,
            profileImage: role === 'volunteer' 
              ? 'https://randomuser.me/api/portraits/women/44.jpg' 
              : 'https://randomuser.me/api/portraits/men/32.jpg'
          };
          
          localStorage.setItem('user', JSON.stringify(mockUser));
          setCurrentUser(mockUser);
          setUserRole(role);
          setIsAuthenticated(true);
          resolve();
        } else {
          reject(new Error('Invalid login credentials'));
        }
      }, 1000);
    });
  };

  const register = async (name: string, email: string, password: string, role: UserRole) => {
    // In a real app, this would be an API call to register
    return new Promise<void>((resolve, reject) => {
      setTimeout(() => {
        if (name && email && password) {
          const mockUser = {
            id: `user-${Date.now()}`,
            name,
            email,
            role,
            profileImage: role === 'volunteer' 
              ? 'https://randomuser.me/api/portraits/women/44.jpg' 
              : 'https://randomuser.me/api/portraits/men/32.jpg'
          };
          
          localStorage.setItem('user', JSON.stringify(mockUser));
          setCurrentUser(mockUser);
          setUserRole(role);
          setIsAuthenticated(true);
          resolve();
        } else {
          reject(new Error('Invalid registration data'));
        }
      }, 1000);
    });
  };

  const logout = () => {
    localStorage.removeItem('user');
    setCurrentUser(null);
    setUserRole(null);
    setIsAuthenticated(false);
  };

  const value = {
    currentUser,
    isAuthenticated,
    userRole,
    login,
    register,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
