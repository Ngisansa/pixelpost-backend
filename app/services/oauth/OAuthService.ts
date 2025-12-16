/**
 * OAuth Service
 * Handles OAuth 2.0 authentication flows for social media platforms
 * Supports PKCE for enhanced security where supported
 */

import * as AuthSession from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';
import * as Crypto from 'expo-crypto';
import { Platform } from 'react-native';
import { supabase } from '@/lib/supabase';
import {
  OAUTH_CONFIG,
  PROFILE_ENDPOINTS,
  TOKEN_EXPIRY,
  getRedirectUri,
  OAuthPlatform,
} from './config';
import {
  storeOAuthToken,
  getOAuthToken,
  deleteOAuthToken,
  addConnectedAccount,
  removeConnectedAccount,
  isTokenExpired,
  OAuthToken,
  ConnectedAccount,
} from '../secureStorage';

// Ensure web browser is ready for auth
WebBrowser.maybeCompleteAuthSession();

// PKCE code verifier storage (in-memory for security)
let codeVerifier: string | null = null;

/**
 * Generate a random string for PKCE code verifier
 */
async function generateCodeVerifier(): Promise<string> {
  const randomBytes = await Crypto.getRandomBytesAsync(32);
  const verifier = btoa(String.fromCharCode(...randomBytes))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
  return verifier;
}

/**
 * Generate PKCE code challenge from verifier
 */
async function generateCodeChallenge(verifier: string): Promise<string> {
  const digest = await Crypto.digestStringAsync(
    Crypto.CryptoDigestAlgorithm.SHA256,
    verifier,
    { encoding: Crypto.CryptoEncoding.BASE64 }
  );
  return digest
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
}

/**
 * Build the authorization URL for a platform
 */
async function buildAuthUrl(platform: OAuthPlatform): Promise<string> {
  const config = OAUTH_CONFIG[platform];
  const redirectUri = getRedirectUri();
  
  const params = new URLSearchParams({
    client_id: config.clientId,
    redirect_uri: redirectUri,
    response_type: config.responseType,
    scope: config.scopes.join(' '),
    state: await generateState(),
  });

  // Add PKCE parameters if supported
  if (config.usePKCE) {
    codeVerifier = await generateCodeVerifier();
    const codeChallenge = await generateCodeChallenge(codeVerifier);
    params.append('code_challenge', codeChallenge);
    params.append('code_challenge_method', 'S256');
  }

  return `${config.endpoints.authorizationEndpoint}?${params.toString()}`;
}

/**
 * Generate a random state parameter for CSRF protection
 */
async function generateState(): Promise<string> {
  const randomBytes = await Crypto.getRandomBytesAsync(16);
  return btoa(String.fromCharCode(...randomBytes))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
}

/**
 * Exchange authorization code for access token via edge function
 * This keeps client secrets secure on the server
 */
async function exchangeCodeForToken(
  platform: OAuthPlatform,
  code: string
): Promise<OAuthToken | null> {
  try {
    const { data, error } = await supabase.functions.invoke('oauth-token-exchange', {
      body: {
        platform,
        code,
        redirectUri: getRedirectUri(),
        codeVerifier: OAUTH_CONFIG[platform].usePKCE ? codeVerifier : undefined,
      },
    });

    if (error) {
      console.error('Token exchange error:', error);
      return null;
    }

    // Clear code verifier after use
    codeVerifier = null;

    const token: OAuthToken = {
      accessToken: data.access_token,
      refreshToken: data.refresh_token,
      expiresAt: Date.now() + (data.expires_in || TOKEN_EXPIRY[platform]) * 1000,
      tokenType: data.token_type || 'Bearer',
      scope: data.scope,
    };

    return token;
  } catch (error) {
    console.error('Error exchanging code for token:', error);
    return null;
  }
}

/**
 * Fetch user profile from the platform
 */
async function fetchUserProfile(
  platform: OAuthPlatform,
  accessToken: string
): Promise<{ userId: string; username: string; displayName?: string; profilePicture?: string } | null> {
  try {
    const endpoint = PROFILE_ENDPOINTS[platform];
    const response = await fetch(endpoint, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      console.error('Profile fetch failed:', response.status);
      return null;
    }

    const data = await response.json();

    // Parse response based on platform
    switch (platform) {
      case 'instagram':
        return {
          userId: data.id,
          username: data.username,
        };
      case 'facebook':
        return {
          userId: data.id,
          username: data.name,
          displayName: data.name,
          profilePicture: data.picture?.data?.url,
        };
      case 'twitter':
        return {
          userId: data.data?.id,
          username: data.data?.username,
          displayName: data.data?.name,
          profilePicture: data.data?.profile_image_url,
        };
      case 'linkedin':
        return {
          userId: data.id,
          username: `${data.firstName?.localized?.en_US || ''} ${data.lastName?.localized?.en_US || ''}`.trim(),
          displayName: `${data.firstName?.localized?.en_US || ''} ${data.lastName?.localized?.en_US || ''}`.trim(),
        };
      case 'pinterest':
        return {
          userId: data.username,
          username: data.username,
          displayName: data.username,
          profilePicture: data.profile_image,
        };
      default:
        return null;
    }
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return null;
  }
}

/**
 * Refresh an expired token via edge function
 */
async function refreshToken(
  platform: OAuthPlatform,
  currentToken: OAuthToken
): Promise<OAuthToken | null> {
  if (!currentToken.refreshToken) {
    console.log('No refresh token available');
    return null;
  }

  try {
    const { data, error } = await supabase.functions.invoke('oauth-token-refresh', {
      body: {
        platform,
        refreshToken: currentToken.refreshToken,
      },
    });

    if (error) {
      console.error('Token refresh error:', error);
      return null;
    }

    const newToken: OAuthToken = {
      accessToken: data.access_token,
      refreshToken: data.refresh_token || currentToken.refreshToken,
      expiresAt: Date.now() + (data.expires_in || TOKEN_EXPIRY[platform]) * 1000,
      tokenType: data.token_type || 'Bearer',
      scope: data.scope || currentToken.scope,
      userId: currentToken.userId,
      username: currentToken.username,
    };

    // Store the new token
    await storeOAuthToken(platform, newToken);

    return newToken;
  } catch (error) {
    console.error('Error refreshing token:', error);
    return null;
  }
}

/**
 * Main OAuth authentication function
 */
export async function authenticateWithPlatform(
  platform: OAuthPlatform
): Promise<{ success: boolean; account?: ConnectedAccount; error?: string }> {
  try {
    // Build authorization URL
    const authUrl = await buildAuthUrl(platform);
    const redirectUri = getRedirectUri();

    // Open browser for authentication
    const result = await WebBrowser.openAuthSessionAsync(authUrl, redirectUri);

    if (result.type !== 'success') {
      return {
        success: false,
        error: result.type === 'cancel' ? 'Authentication cancelled' : 'Authentication failed',
      };
    }

    // Parse the callback URL
    const url = new URL(result.url);
    const code = url.searchParams.get('code');
    const error = url.searchParams.get('error');

    if (error) {
      return {
        success: false,
        error: url.searchParams.get('error_description') || error,
      };
    }

    if (!code) {
      return {
        success: false,
        error: 'No authorization code received',
      };
    }

    // Exchange code for token
    const token = await exchangeCodeForToken(platform, code);

    if (!token) {
      return {
        success: false,
        error: 'Failed to exchange code for token',
      };
    }

    // Fetch user profile
    const profile = await fetchUserProfile(platform, token.accessToken);

    if (!profile) {
      return {
        success: false,
        error: 'Failed to fetch user profile',
      };
    }

    // Update token with user info
    token.userId = profile.userId;
    token.username = profile.username;

    // Store token securely
    await storeOAuthToken(platform, token);

    // Create connected account record
    const account: ConnectedAccount = {
      id: `${platform}_${profile.userId}`,
      platform,
      userId: profile.userId,
      username: profile.username,
      displayName: profile.displayName,
      profilePicture: profile.profilePicture,
      connectedAt: new Date().toISOString(),
      expiresAt: token.expiresAt,
      scopes: OAUTH_CONFIG[platform].scopes,
    };

    // Store connected account
    await addConnectedAccount(account);

    return {
      success: true,
      account,
    };
  } catch (error) {
    console.error('OAuth authentication error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Authentication failed',
    };
  }
}

/**
 * Disconnect a platform account
 */
export async function disconnectPlatform(
  platform: OAuthPlatform
): Promise<{ success: boolean; error?: string }> {
  try {
    // Get current token to revoke if possible
    const token = await getOAuthToken(platform);

    if (token?.accessToken) {
      // Try to revoke token via edge function
      try {
        await supabase.functions.invoke('oauth-token-revoke', {
          body: {
            platform,
            accessToken: token.accessToken,
          },
        });
      } catch (e) {
        // Revocation failure shouldn't prevent disconnection
        console.log('Token revocation failed, continuing with disconnection');
      }
    }

    // Remove stored token and account
    await removeConnectedAccount(platform);

    return { success: true };
  } catch (error) {
    console.error('Error disconnecting platform:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to disconnect',
    };
  }
}

/**
 * Get a valid access token for a platform (refreshing if needed)
 */
export async function getValidAccessToken(
  platform: OAuthPlatform
): Promise<string | null> {
  const token = await getOAuthToken(platform);

  if (!token) {
    return null;
  }

  // Check if token is expired
  if (isTokenExpired(token)) {
    // Try to refresh
    const newToken = await refreshToken(platform, token);
    return newToken?.accessToken || null;
  }

  return token.accessToken;
}

/**
 * Check if a platform is connected and has a valid token
 */
export async function isPlatformConnected(
  platform: OAuthPlatform
): Promise<boolean> {
  const token = await getOAuthToken(platform);
  
  if (!token) {
    return false;
  }

  // If token is expired, try to refresh
  if (isTokenExpired(token)) {
    const newToken = await refreshToken(platform, token);
    return newToken !== null;
  }

  return true;
}

export default {
  authenticateWithPlatform,
  disconnectPlatform,
  getValidAccessToken,
  isPlatformConnected,
};
