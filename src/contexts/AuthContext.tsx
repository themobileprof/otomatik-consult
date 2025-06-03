import React, { createContext, useContext, useEffect, useState } from 'react';
import { api } from '@/lib/api';

interface User {
  email: string;
  name: string;
  picture?: string;
  role: 'user' | 'admin';
  sub: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  signIn: (credential: string) => Promise<void>;
  signOut: () => Promise<void>;
  isAdmin: () => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    const storedUser = localStorage.getItem('user');
    
    if (token && storedUser) {
      api.setToken(token);
      setUser(JSON.parse(storedUser));
    }
    
    setIsLoading(false);
  }, []);

  const signIn = async (credential: string) => {
    try {
      const { token, user } = await api.googleSignIn(credential);
      localStorage.setItem('auth_token', token);
      localStorage.setItem('user', JSON.stringify(user));
      api.setToken(token);
      setUser(user);
    } catch (error) {
      console.error('Sign in error:', error);
      throw error;
    }
  };

  const signOut = async () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
    api.setToken('');
    setUser(null);
  };

  const isAdmin = () => {
    return user?.role === 'admin';
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        signIn,
        signOut,
        isAdmin,
      }}
    >
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