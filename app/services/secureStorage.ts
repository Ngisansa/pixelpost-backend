/**
 * Secure Storage Service
 * Uses expo-secure-store for native platforms and encrypted AsyncStorage for web
 * Handles secure storage of OAuth tokens and sensitive data
 */

import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

// Storage keys
export const STORAGE_KEYS = {
  // OAuth tokens for each platform
  INSTAGRAM_TOKEN: 'pixelpost_instagram_token',
  FACEBOOK_TOKEN: 'pixelpost_facebook_token',
  TWITTER_TOKEN: 'pixelpost_twitter_token',
  LINKEDIN_TOKEN: 'pixelpost_linkedin_token',
  PINTEREST_TOKEN: 'pixelpost_pinterest_token',
  TIKTOK_TOKEN: 'pixelpost_tiktok_token',
  YOUTUBE_TOKEN: 'pixelpost_youtube_token',
  
  // User data
  USER_DATA: 'pixelpost_user_data',
  CONNECTED_ACCOUNTS: 'pixelpost_connected_accounts',
  
  // App settings
  APP_SETTINGS: 'pixelpost_app_settings',
};

// Token data structure
export interface OAuthToken {
  accessToken: string;
  refreshToken?: string;
  expiresAt?: number; // Unix timestamp
  tokenType?: string;
  scope?: string;
  userId?: string;
  username?: string;
}

// Connected account structure
export interface ConnectedAccount {
  id: string;
  platform: string;
  userId: string;
  username: string;
  displayName?: string;
  profilePicture?: string;
  connectedAt: string;
  expiresAt?: number;
  scopes?: string[];
}

/**
 * Securely store a value
 * Uses SecureStore on native, AsyncStorage with encryption prefix on web
 */
export async function secureSet(key: string, value: string): Promise<void> {
  try {
    if (Platform.OS === 'web') {
      // On web, use AsyncStorage with a simple obfuscation
      // In production, you'd want server-side storage for sensitive data
      const encodedValue = btoa(encodeURIComponent(value));
      await AsyncStorage.setItem(key, encodedValue);
    } else {
      await SecureStore.setItemAsync(key, value, {
        keychainAccessible: SecureStore.WHEN_UNLOCKED,
      });
    }
  } catch (error) {
    console.error('Error storing secure value:', error);
    throw error;
  }
}

/**
 * Securely retrieve a value
 */
export async function secureGet(key: string): Promise<string | null> {
  try {
    if (Platform.OS === 'web') {
      const encodedValue = await AsyncStorage.getItem(key);
      if (encodedValue) {
        return decodeURIComponent(atob(encodedValue));
      }
      return null;
    } else {
      return await SecureStore.getItemAsync(key);
    }
  } catch (error) {
    console.error('Error retrieving secure value:', error);
    return null;
  }
}

/**
 * Securely delete a value
 */
export async function secureDelete(key: string): Promise<void> {
  try {
    if (Platform.OS === 'web') {
      await AsyncStorage.removeItem(key);
    } else {
      await SecureStore.deleteItemAsync(key);
    }
  } catch (error) {
    console.error('Error deleting secure value:', error);
    throw error;
  }
}

/**
 * Store OAuth token for a platform
 */
export async function storeOAuthToken(
  platform: string,
  token: OAuthToken
): Promise<void> {
  const key = `pixelpost_${platform.toLowerCase()}_token`;
  await secureSet(key, JSON.stringify(token));
}

/**
 * Retrieve OAuth token for a platform
 */
export async function getOAuthToken(platform: string): Promise<OAuthToken | null> {
  const key = `pixelpost_${platform.toLowerCase()}_token`;
  const tokenString = await secureGet(key);
  
  if (tokenString) {
    try {
      return JSON.parse(tokenString) as OAuthToken;
    } catch {
      return null;
    }
  }
  return null;
}

/**
 * Delete OAuth token for a platform
 */
export async function deleteOAuthToken(platform: string): Promise<void> {
  const key = `pixelpost_${platform.toLowerCase()}_token`;
  await secureDelete(key);
}

/**
 * Check if token is expired
 */
export function isTokenExpired(token: OAuthToken): boolean {
  if (!token.expiresAt) return false;
  
  // Consider token expired 5 minutes before actual expiry
  const bufferTime = 5 * 60 * 1000; // 5 minutes in milliseconds
  return Date.now() >= (token.expiresAt - bufferTime);
}

/**
 * Store connected accounts list
 */
export async function storeConnectedAccounts(
  accounts: ConnectedAccount[]
): Promise<void> {
  await secureSet(STORAGE_KEYS.CONNECTED_ACCOUNTS, JSON.stringify(accounts));
}

/**
 * Retrieve connected accounts list
 */
export async function getConnectedAccounts(): Promise<ConnectedAccount[]> {
  const accountsString = await secureGet(STORAGE_KEYS.CONNECTED_ACCOUNTS);
  
  if (accountsString) {
    try {
      return JSON.parse(accountsString) as ConnectedAccount[];
    } catch {
      return [];
    }
  }
  return [];
}

/**
 * Add a connected account
 */
export async function addConnectedAccount(
  account: ConnectedAccount
): Promise<void> {
  const accounts = await getConnectedAccounts();
  
  // Remove existing account for same platform if exists
  const filteredAccounts = accounts.filter(
    a => a.platform !== account.platform
  );
  
  filteredAccounts.push(account);
  await storeConnectedAccounts(filteredAccounts);
}

/**
 * Remove a connected account
 */
export async function removeConnectedAccount(
  platform: string
): Promise<void> {
  const accounts = await getConnectedAccounts();
  const filteredAccounts = accounts.filter(a => a.platform !== platform);
  await storeConnectedAccounts(filteredAccounts);
  
  // Also delete the OAuth token
  await deleteOAuthToken(platform);
}

/**
 * Clear all stored data (for logout)
 */
export async function clearAllSecureData(): Promise<void> {
  const allKeys = Object.values(STORAGE_KEYS);
  
  for (const key of allKeys) {
    await secureDelete(key);
  }
}

export default {
  secureSet,
  secureGet,
  secureDelete,
  storeOAuthToken,
  getOAuthToken,
  deleteOAuthToken,
  isTokenExpired,
  storeConnectedAccounts,
  getConnectedAccounts,
  addConnectedAccount,
  removeConnectedAccount,
  clearAllSecureData,
  STORAGE_KEYS,
};
