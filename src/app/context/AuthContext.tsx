"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { graphqlQuery, graphqlMutation } from '@/lib/graphql-client';
import { GET_ME } from '@/graphql/queries';
import { VERIFY_OTP, LOGOUT } from '@/graphql/mutations';

interface User {
  id: string;
  username: string;
  email: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, otp: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Check if user is logged in (session-based)
    checkSession();
  }, []);

  const checkSession = async () => {
    try {
      const data = await graphqlQuery<{ me: User }>(GET_ME);
      
      if (data.me) {
        setUser(data.me);
      }
    } catch (error) {
      // Session doesn't exist or expired
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, otp: string) => {
    try {
      const data = await graphqlMutation<{
        verifyOTP: {
          user: User;
          message: string;
        };
      }>(VERIFY_OTP, { email, otp });

      setUser(data.verifyOTP.user);
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await graphqlMutation(LOGOUT);
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
    }
  };

  // Prevent SSR issues
  if (!mounted || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        token: null, // Not used in session-based auth
        login,
        logout,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'admin',
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
