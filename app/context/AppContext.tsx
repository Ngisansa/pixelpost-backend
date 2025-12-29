import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  SAMPLE_POSTS,
  SAMPLE_NOTIFICATIONS,
  SOCIAL_PLATFORMS,
} from "../constants/data";
import {
  getConnectedAccounts as getStoredAccounts,
} from "../services/secureStorage";

/* =======================
   Types
======================= */

export interface Post {
  id: string;
  image: string;
  caption: string;
  platforms: string[];
  scheduledAt: string | null;
  status: "draft" | "scheduled" | "published" | "failed";
  likes: number;
  comments: number;
  shares: number;
}

export interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
}

export interface ConnectedAccount {
  id: string;
  platform: string;
  username: string;
  avatar?: string;
  connectedAt: string;
}

/* =======================
   Context Interface
======================= */

interface AppContextType {
  // User (guest-safe)
  user: null;

  // Posts
  posts: Post[];
  addPost: (post: Omit<Post, "id">) => void;
  updatePost: (id: string, updates: Partial<Post>) => void;
  deletePost: (id: string) => void;

  // Accounts
  connectedAccounts: ConnectedAccount[];
  connectAccount: (platform: string, username: string) => Promise<boolean>;
  disconnectAccount: (id: string) => void;
  refreshConnectedAccounts: () => Promise<void>;

  // Notifications
  notifications: Notification[];
  markNotificationRead: (id: string) => void;
  clearNotifications: () => void;
  unreadCount: number;

  // Credits
  credits: number;
  addCredits: (amount: number) => void;
  useCredit: () => boolean;

  // Pro
  isPro: boolean;
  activatePro: () => Promise<void>;

  // UI
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

/* =======================
   Storage Keys
======================= */

const POSTS_KEY = "@pixelpost_posts";
const NOTIFICATIONS_KEY = "@pixelpost_notifications";
const CREDITS_KEY = "@pixelpost_credits";
const PRO_KEY = "@pixelpost_is_pro";

/* =======================
   Provider
======================= */

export function AppProvider({ children }: { children: ReactNode }) {
  // Explicit guest user (NO auth assumptions)
  const [user] = useState<null>(null);

  const [posts, setPosts] = useState<Post[]>(SAMPLE_POSTS);
  const [connectedAccounts, setConnectedAccounts] = useState<ConnectedAccount[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>(SAMPLE_NOTIFICATIONS);
  const [credits, setCredits] = useState(5);
  const [isPro, setIsPro] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);

  /* ---------- Load persisted state ---------- */
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [
        storedPosts,
        storedNotifications,
        storedCredits,
        storedIsPro,
      ] = await Promise.all([
        AsyncStorage.getItem(POSTS_KEY),
        AsyncStorage.getItem(NOTIFICATIONS_KEY),
        AsyncStorage.getItem(CREDITS_KEY),
        AsyncStorage.getItem(PRO_KEY),
      ]);

      if (storedPosts) setPosts(JSON.parse(storedPosts));
      if (storedNotifications) setNotifications(JSON.parse(storedNotifications));
      if (storedCredits) setCredits(JSON.parse(storedCredits));
      if (storedIsPro !== null) setIsPro(JSON.parse(storedIsPro));

      await refreshConnectedAccounts();
    } catch (err) {
      console.error("Error loading app state:", err);
    }
  };

  /* ---------- Accounts ---------- */
  const refreshConnectedAccounts = async () => {
    try {
      const stored = await getStoredAccounts();
      const accounts: ConnectedAccount[] = stored.map(acc => ({
        id: acc.id,
        platform: acc.platform,
        username: acc.username,
        avatar: acc.profilePicture,
        connectedAt: acc.connectedAt,
      }));
      setConnectedAccounts(accounts);
    } catch (err) {
      console.error("Error refreshing accounts:", err);
    }
  };

  const connectAccount = async (platform: string, username: string) => {
    const platformInfo = SOCIAL_PLATFORMS.find(p => p.id === platform);
    if (!platformInfo) return false;

    const newAccount: ConnectedAccount = {
      id: Math.random().toString(36).slice(2),
      platform,
      username,
      connectedAt: new Date().toISOString(),
    };

    setConnectedAccounts(prev =>
      [...prev.filter(a => a.platform !== platform), newAccount]
    );
    return true;
  };

  const disconnectAccount = (id: string) => {
    setConnectedAccounts(prev => prev.filter(acc => acc.id !== id));
  };

  /* ---------- Posts ---------- */
  const addPost = (post: Omit<Post, "id">) => {
    const newPost: Post = { ...post, id: Math.random().toString(36).slice(2) };
    const updated = [newPost, ...posts];
    setPosts(updated);
    AsyncStorage.setItem(POSTS_KEY, JSON.stringify(updated));
  };

  const updatePost = (id: string, updates: Partial<Post>) => {
    const updated = posts.map(p => (p.id === id ? { ...p, ...updates } : p));
    setPosts(updated);
    AsyncStorage.setItem(POSTS_KEY, JSON.stringify(updated));
  };

  const deletePost = (id: string) => {
    const updated = posts.filter(p => p.id !== id);
    setPosts(updated);
    AsyncStorage.setItem(POSTS_KEY, JSON.stringify(updated));
  };

  /* ---------- Notifications ---------- */
  const markNotificationRead = (id: string) => {
    const updated = notifications.map(n =>
      n.id === id ? { ...n, read: true } : n
    );
    setNotifications(updated);
    AsyncStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(updated));
  };

  const clearNotifications = () => {
    setNotifications([]);
    AsyncStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify([]));
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  /* ---------- Credits ---------- */
  const addCredits = (amount: number) => {
    const next = credits + amount;
    setCredits(next);
    AsyncStorage.setItem(CREDITS_KEY, JSON.stringify(next));
  };

  const useCredit = () => {
    if (credits <= 0) return false;
    const next = credits - 1;
    setCredits(next);
    AsyncStorage.setItem(CREDITS_KEY, JSON.stringify(next));
    return true;
  };

  /* ---------- Pro ---------- */
  const activatePro = async () => {
    setIsPro(true);
    await AsyncStorage.setItem(PRO_KEY, JSON.stringify(true));
  };

  /* ---------- UI ---------- */
  const toggleDarkMode = () => setIsDarkMode(v => !v);

  return (
    <AppContext.Provider
      value={{
        user,

        posts,
        addPost,
        updatePost,
        deletePost,

        connectedAccounts,
        connectAccount,
        disconnectAccount,
        refreshConnectedAccounts,

        notifications,
        markNotificationRead,
        clearNotifications,
        unreadCount,

        credits,
        addCredits,
        useCredit,

        isPro,
        activatePro,

        isDarkMode,
        toggleDarkMode,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

/* =======================
   Hook
======================= */

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used inside AppProvider");
  return ctx;
}

export default AppContext;
