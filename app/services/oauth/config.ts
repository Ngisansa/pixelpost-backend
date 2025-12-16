/**
 * OAuth Configuration for Social Media Platforms
 * 
 * IMPORTANT: Client IDs are safe to include in frontend code.
 * Client Secrets should NEVER be in frontend code - they are handled by edge functions.
 * 
 * To set up OAuth for each platform:
 * 
 * 1. INSTAGRAM/FACEBOOK:
 *    - Go to https://developers.facebook.com/
 *    - Create an app and enable Instagram Basic Display API
 *    - Add your redirect URI to valid OAuth redirect URIs
 *    - Copy the App ID as clientId
 * 
 * 2. TWITTER/X:
 *    - Go to https://developer.twitter.com/
 *    - Create a project and app
 *    - Enable OAuth 2.0 with PKCE
 *    - Add callback URL
 *    - Copy the Client ID
 * 
 * 3. LINKEDIN:
 *    - Go to https://www.linkedin.com/developers/
 *    - Create an app
 *    - Add OAuth 2.0 redirect URLs
 *    - Copy the Client ID
 * 
 * 4. PINTEREST:
 *    - Go to https://developers.pinterest.com/
 *    - Create an app
 *    - Add redirect URI
 *    - Copy the App ID
 */

import * as Linking from 'expo-linking';
import Constants from 'expo-constants';

// Get the redirect URI for OAuth callbacks
export const getRedirectUri = () => {
  // For Expo Go development
  const expoRedirectUri = Linking.createURL('oauth/callback');
  
  // For standalone apps, use your app's scheme
  // You should configure this in app.json under "scheme"
  return expoRedirectUri;
};

// OAuth scopes for each platform
export const OAUTH_SCOPES = {
  instagram: [
    'instagram_basic',
    'instagram_content_publish',
    'instagram_manage_comments',
    'instagram_manage_insights',
    'pages_show_list',
    'pages_read_engagement',
  ],
  facebook: [
    'public_profile',
    'email',
    'pages_show_list',
    'pages_read_engagement',
    'pages_manage_posts',
    'publish_to_groups',
  ],
  twitter: [
    'tweet.read',
    'tweet.write',
    'users.read',
    'offline.access',
  ],
  linkedin: [
    'r_liteprofile',
    'r_emailaddress',
    'w_member_social',
  ],
  pinterest: [
    'read_public',
    'write_public',
    'read_private',
  ],
};

// OAuth endpoints for each platform
export const OAUTH_ENDPOINTS = {
  instagram: {
    authorizationEndpoint: 'https://api.instagram.com/oauth/authorize',
    tokenEndpoint: 'https://api.instagram.com/oauth/access_token',
    // Instagram uses Facebook's Graph API for long-lived tokens
    refreshEndpoint: 'https://graph.instagram.com/refresh_access_token',
  },
  facebook: {
    authorizationEndpoint: 'https://www.facebook.com/v18.0/dialog/oauth',
    tokenEndpoint: 'https://graph.facebook.com/v18.0/oauth/access_token',
    refreshEndpoint: 'https://graph.facebook.com/v18.0/oauth/access_token',
  },
  twitter: {
    // Twitter OAuth 2.0 with PKCE
    authorizationEndpoint: 'https://twitter.com/i/oauth2/authorize',
    tokenEndpoint: 'https://api.twitter.com/2/oauth2/token',
    revokeEndpoint: 'https://api.twitter.com/2/oauth2/revoke',
  },
  linkedin: {
    authorizationEndpoint: 'https://www.linkedin.com/oauth/v2/authorization',
    tokenEndpoint: 'https://www.linkedin.com/oauth/v2/accessToken',
    // LinkedIn tokens don't refresh - need to re-authenticate
  },
  pinterest: {
    authorizationEndpoint: 'https://api.pinterest.com/oauth/',
    tokenEndpoint: 'https://api.pinterest.com/v5/oauth/token',
    refreshEndpoint: 'https://api.pinterest.com/v5/oauth/token',
  },
};

// Platform configuration
// NOTE: Replace these placeholder client IDs with your actual OAuth app credentials
export const OAUTH_CONFIG = {
  instagram: {
    clientId: process.env.EXPO_PUBLIC_INSTAGRAM_CLIENT_ID || 'YOUR_INSTAGRAM_APP_ID',
    // Client secret is handled server-side via edge function
    scopes: OAUTH_SCOPES.instagram,
    endpoints: OAUTH_ENDPOINTS.instagram,
    responseType: 'code',
    usePKCE: false, // Instagram doesn't support PKCE
  },
  facebook: {
    clientId: process.env.EXPO_PUBLIC_FACEBOOK_CLIENT_ID || 'YOUR_FACEBOOK_APP_ID',
    scopes: OAUTH_SCOPES.facebook,
    endpoints: OAUTH_ENDPOINTS.facebook,
    responseType: 'code',
    usePKCE: false,
  },
  twitter: {
    clientId: process.env.EXPO_PUBLIC_TWITTER_CLIENT_ID || 'YOUR_TWITTER_CLIENT_ID',
    scopes: OAUTH_SCOPES.twitter,
    endpoints: OAUTH_ENDPOINTS.twitter,
    responseType: 'code',
    usePKCE: true, // Twitter requires PKCE
    codeChallengeMethod: 'S256',
  },
  linkedin: {
    clientId: process.env.EXPO_PUBLIC_LINKEDIN_CLIENT_ID || 'YOUR_LINKEDIN_CLIENT_ID',
    scopes: OAUTH_SCOPES.linkedin,
    endpoints: OAUTH_ENDPOINTS.linkedin,
    responseType: 'code',
    usePKCE: false,
  },
  pinterest: {
    clientId: process.env.EXPO_PUBLIC_PINTEREST_CLIENT_ID || 'YOUR_PINTEREST_APP_ID',
    scopes: OAUTH_SCOPES.pinterest,
    endpoints: OAUTH_ENDPOINTS.pinterest,
    responseType: 'code',
    usePKCE: false,
  },
};

// API endpoints for user profile data
export const PROFILE_ENDPOINTS = {
  instagram: 'https://graph.instagram.com/me?fields=id,username,account_type,media_count',
  facebook: 'https://graph.facebook.com/me?fields=id,name,email,picture',
  twitter: 'https://api.twitter.com/2/users/me?user.fields=profile_image_url,username,name',
  linkedin: 'https://api.linkedin.com/v2/me?projection=(id,firstName,lastName,profilePicture)',
  pinterest: 'https://api.pinterest.com/v5/user_account',
};

// Token expiry times (in seconds)
export const TOKEN_EXPIRY = {
  instagram: 60 * 60 * 24 * 60, // 60 days for long-lived token
  facebook: 60 * 60 * 24 * 60, // 60 days
  twitter: 60 * 60 * 2, // 2 hours (with refresh token)
  linkedin: 60 * 60 * 24 * 60, // 60 days
  pinterest: 60 * 60 * 24 * 30, // 30 days
};

export type OAuthPlatform = keyof typeof OAUTH_CONFIG;

export default {
  OAUTH_CONFIG,
  OAUTH_SCOPES,
  OAUTH_ENDPOINTS,
  PROFILE_ENDPOINTS,
  TOKEN_EXPIRY,
  getRedirectUri,
};
