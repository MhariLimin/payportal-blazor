import React, { createContext, useContext, useState, useCallback } from 'react';

interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'reviewer' | 'merchant';
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const demoUsers: User[] = [
  { id: 'admin-1', email: 'admin@payportal.com', name: 'Admin User', role: 'admin' },
  { id: 'reviewer-1', email: 'reviewer@payportal.com', name: 'Review Manager', role: 'reviewer' },
  { id: 'merchant-1', email: 'sarah@techflow.io', name: 'Sarah Chen', role: 'merchant' },
];

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const stored = localStorage.getItem('portal_user');
    return stored ? JSON.parse(stored) : null;
  });

  const login = useCallback(async (email: string, password: string): Promise<boolean> => {
    // Demo authentication - accept any password for demo accounts
    const foundUser = demoUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (foundUser && password.length >= 4) {
      setUser(foundUser);
      localStorage.setItem('portal_user', JSON.stringify(foundUser));
      return true;
    }
    return false;
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem('portal_user');
  }, []);

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
