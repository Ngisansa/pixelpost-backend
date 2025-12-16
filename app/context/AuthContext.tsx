import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Types
export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  subscription: 'free' | 'pro' | 'business';
  credits: number;
  connectedPlatforms: string[];
  createdAt: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (email: string, password: string, name: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  forgotPassword: (email: string) => Promise<{ success: boolean; error?: string }>;
  updateUser: (updates: Partial<User>) => Promise<void>;
  socialLogin: (provider: 'google' | 'facebook') => Promise<{ success: boolean; error?: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEY = '@pixelpost_user';

// Mock user for demo purposes
const createMockUser = (email: string, name: string): User => ({
  id: Math.random().toString(36).substr(2, 9),
  email,
  name,
  avatar: 'https://d64gsuwffb70l.cloudfront.net/693ad930d4eeae4ef855d51c_1765483917034_20681f28.png',
  subscription: 'free',
  credits: 5,
  connectedPlatforms: [],
  createdAt: new Date().toISOString(),
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load user from storage on mount
  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const storedUser = await AsyncStorage.getItem(STORAGE_KEY);
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error('Error loading user:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveUser = async (userData: User) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(userData));
      setUser(userData);
    } catch (error) {
      console.error('Error saving user:', error);
    }
  };

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      setIsLoading(true);
      
      // Validate inputs
      if (!email || !password) {
        return { success: false, error: 'Please enter email and password' };
      }

      if (!email.includes('@')) {
        return { success: false, error: 'Please enter a valid email address' };
      }

      if (password.length < 6) {
        return { success: false, error: 'Password must be at least 6 characters' };
      }

      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Create mock user (in production, this would be an API call)
      const mockUser = createMockUser(email, email.split('@')[0]);
      await saveUser(mockUser);

      return { success: true };
    } catch (error) {
      return { success: false, error: 'Login failed. Please try again.' };
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (email: string, password: string, name: string): Promise<{ success: boolean; error?: string }> => {
    try {
      setIsLoading(true);

      // Validate inputs
      if (!email || !password || !name) {
        return { success: false, error: 'Please fill in all fields' };
      }

      if (!email.includes('@')) {
        return { success: false, error: 'Please enter a valid email address' };
      }

      if (password.length < 6) {
        return { success: false, error: 'Password must be at least 6 characters' };
      }

      if (name.length < 2) {
        return { success: false, error: 'Name must be at least 2 characters' };
      }

      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Create mock user
      const mockUser = createMockUser(email, name);
      await saveUser(mockUser);

      return { success: true };
    } catch (error) {
      return { success: false, error: 'Registration failed. Please try again.' };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem(STORAGE_KEY);
      setUser(null);
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const forgotPassword = async (email: string): Promise<{ success: boolean; error?: string }> => {
    try {
      if (!email || !email.includes('@')) {
        return { success: false, error: 'Please enter a valid email address' };
      }

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      return { success: true };
    } catch (error) {
      return { success: false, error: 'Failed to send reset email. Please try again.' };
    }
  };

  const updateUser = async (updates: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...updates };
      await saveUser(updatedUser);
    }
  };

  const socialLogin = async (provider: 'google' | 'facebook'): Promise<{ success: boolean; error?: string }> => {
    try {
      setIsLoading(true);

      // Simulate OAuth flow
      await new Promise(resolve => setTimeout(resolve, 1500));

      const mockUser = createMockUser(
        `${provider}user@example.com`,
        `${provider.charAt(0).toUpperCase() + provider.slice(1)} User`
      );
      await saveUser(mockUser);

      return { success: true };
    } catch (error) {
      return { success: false, error: `${provider} login failed. Please try again.` };
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        forgotPassword,
        updateUser,
        socialLogin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export default AuthContext;
