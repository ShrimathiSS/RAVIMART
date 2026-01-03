import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Role } from '../types';

interface AuthContextType {
  user: User | null;
  allUsers: User[];
  login: (email: string, password: string, role: Role) => Promise<boolean>;
  signup: (name: string, email: string, password: string, phone?: string) => Promise<boolean>;
  updateProfile: (details: Partial<User>) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock initial users
const INITIAL_USERS: User[] = [
  { id: 'u1', name: 'Rahul Sharma', email: 'rahul@example.com', role: 'user', joinDate: '2024-12-15', phone: '9876543210', address: '123 Main St', city: 'Erode', zip: '638001' },
  { id: 'u2', name: 'Priya Patel', email: 'priya@example.com', role: 'user', joinDate: '2025-01-10', phone: '9898989898' },
  { id: 'u3', name: 'Amit Singh', email: 'amit@example.com', role: 'user', joinDate: '2025-01-22' },
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [allUsers, setAllUsers] = useState<User[]>(INITIAL_USERS);

  // Load users and current session from localStorage on mount
  useEffect(() => {
    const storedAllUsers = localStorage.getItem('ravimart_all_users');
    if (storedAllUsers) {
      setAllUsers(JSON.parse(storedAllUsers));
    } else {
      localStorage.setItem('ravimart_all_users', JSON.stringify(INITIAL_USERS));
    }

    const storedUser = localStorage.getItem('ravimart_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // Save allUsers to localStorage whenever it changes
  useEffect(() => {
    if (allUsers.length > 0) {
      localStorage.setItem('ravimart_all_users', JSON.stringify(allUsers));
    }
  }, [allUsers]);

  const login = async (email: string, password: string, role: Role): Promise<boolean> => {
    await new Promise(resolve => setTimeout(resolve, 800));

    if (role === 'admin') {
      if (email === 'admin@ravimart.com' && password === 'admin123') {
        const adminUser: User = {
          id: 'admin-1',
          name: 'RaviMart Admin',
          email,
          role: 'admin',
          joinDate: '2023-01-01'
        };
        setUser(adminUser);
        localStorage.setItem('ravimart_user', JSON.stringify(adminUser));
        return true;
      }
      return false;
    } else {
      if (password.length < 6) return false;
      
      const currentUser = allUsers.find(u => u.email === email && u.role === 'user');
      
      if (currentUser) {
        setUser(currentUser);
        localStorage.setItem('ravimart_user', JSON.stringify(currentUser));
        return true;
      }
      return false;
    }
  };

  const signup = async (name: string, email: string, password: string, phone?: string): Promise<boolean> => {
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Check if user already exists
    if (allUsers.some(u => u.email === email)) {
      return false;
    }

    const newUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      name,
      email,
      phone,
      role: 'user',
      joinDate: new Date().toISOString().split('T')[0]
    };

    setAllUsers(prev => [...prev, newUser]);
    setUser(newUser);
    localStorage.setItem('ravimart_user', JSON.stringify(newUser));
    return true;
  };

  const updateProfile = (details: Partial<User>) => {
    if (!user) return;

    const updatedUser = { ...user, ...details };
    setUser(updatedUser);
    localStorage.setItem('ravimart_user', JSON.stringify(updatedUser));

    // Also update in the allUsers list
    setAllUsers(prev => prev.map(u => u.id === user.id ? updatedUser : u));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('ravimart_user');
  };

  return (
    <AuthContext.Provider value={{ user, allUsers, login, signup, updateProfile, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
