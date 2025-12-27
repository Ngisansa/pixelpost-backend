import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { apiRequest } from '../lib/api';

export interface User {
  id: string;
  email: string;
  name: string;
  subscription: 'free' | 'pro' | 'business';
  credits: number;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  refreshUser: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

const STORAGE_KEY = '@pixelpost_user';

export function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    initialize();
  }, []);

  async function initialize() {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) {
        setUser(JSON.parse(stored));
      }

      // Attempt backend sync (SAFE)
      await refreshUser();
    } catch (err) {
      console.warn(
        'Auth initialization skipped backend sync:',
        err
      );
    } finally {
      setIsLoading(false);
    }
  }

  /**
   * 🔐 SAFE BACKEND SYNC
   * - Does NOT crash if /users/me is missing
   * - Does NOT block UI rendering
   * - Prevents white screen on web
   */
  async function refreshUser() {
    try {
      const backendUser = await apiRequest('/users/me');

      await AsyncStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(backendUser)
      );
      setUser(backendUser);
    } catch (err) {
      console.warn(
        'User not authenticated or /users/me unavailable'
      );
      // IMPORTANT:
      // Do NOT throw
      // Do NOT blank the app
      setUser(null);
    }
  }

  async function logout() {
    await AsyncStorage.removeItem(STORAGE_KEY);
    setUser(null);
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        refreshUser,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error(
      'useAuth must be used inside AuthProvider'
    );
  }
  return ctx;
}
