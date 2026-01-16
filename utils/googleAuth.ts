import * as AuthSession from 'expo-auth-session';
import * as Crypto from 'expo-crypto';
import { Platform } from 'react-native';
import Constants from 'expo-constants';

// Google OAuth Configuration
// Try to get from environment variable first, then from app.json extra field
function getGoogleClientId(): string {
  // Try environment variable first
  if (process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID) {
    return process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID;
  }
  
  // Try from Constants (app.json extra field)
  if (Constants.expoConfig?.extra?.googleClientId) {
    return Constants.expoConfig.extra.googleClientId;
  }
  
  // Try from Constants.manifest (for older Expo versions)
  if ((Constants.manifest as any)?.extra?.googleClientId) {
    return (Constants.manifest as any).extra.googleClientId;
  }
  
  console.warn('⚠️ Google Client ID not found. Please set EXPO_PUBLIC_GOOGLE_CLIENT_ID or add it to app.json extra field.');
  return '';
}

const GOOGLE_CLIENT_ID = getGoogleClientId();

// Log client ID status (for debugging)
if (__DEV__) {
  console.log('🔑 Google OAuth Client ID:', GOOGLE_CLIENT_ID ? `✓ Set (${GOOGLE_CLIENT_ID.substring(0, 20)}...)` : '✗ Not set');
}

// For Expo apps, makeRedirectUri will generate:
// - Development: http://localhost:8081 (or exp://localhost:8081)
// - Production: Uses your app's scheme (habbit://oauth)
// Google OAuth requires HTTP/HTTPS URLs
// Note: The redirect URI will be logged when verifyRedirectUri() is called
// Use Expo's HTTP proxy for redirect URI
// This is the exact URL that Google will redirect to after authentication
const GOOGLE_REDIRECT_URI = 'https://auth.expo.io/@vikupilot/Habbit/--/oauth';

// Discovery document for Google OAuth
const discovery = {
  authorizationEndpoint: 'https://accounts.google.com/o/oauth2/v2/auth',
  tokenEndpoint: 'https://oauth2.googleapis.com/token',
  revocationEndpoint: 'https://oauth2.googleapis.com/revoke',
};

export interface GoogleUserInfo {
  id: string;
  email: string;
  name: string;
  picture?: string;
  given_name?: string;
  family_name?: string;
}

/**
 * Initiate Google Sign-In flow
 * Returns the authorization code that can be sent to backend for verification
 */
export async function signInWithGoogle(): Promise<{
  code: string;
  state: string;
} | null> {
  try {
    // Validate client ID
    if (!GOOGLE_CLIENT_ID) {
      console.error('❌ Google Client ID is missing!');
      console.error('Please set EXPO_PUBLIC_GOOGLE_CLIENT_ID environment variable or add it to app.json extra field.');
      throw new Error('Google Client ID is not configured. Please check your setup.');
    }

    // Generate a random state for security
    const randomString = Math.random().toString() + Date.now().toString();
    const state = await Crypto.digestStringAsync(
      Crypto.CryptoDigestAlgorithm.SHA256,
      randomString,
      { encoding: Crypto.CryptoEncoding.BASE64 }
    );

    console.log('🔐 Starting Google OAuth flow...');
    console.log('Client ID:', GOOGLE_CLIENT_ID.substring(0, 30) + '...');
    console.log('Redirect URI:', GOOGLE_REDIRECT_URI);

    const request = new AuthSession.AuthRequest({
      clientId: GOOGLE_CLIENT_ID,
      scopes: ['openid', 'profile', 'email'],
      responseType: AuthSession.ResponseType.Code,
      redirectUri: GOOGLE_REDIRECT_URI,
      state,
      usePKCE: false, // Disable PKCE since backend handles token exchange
      extraParams: {},
    });

    const result = await request.promptAsync(discovery);

    if (result.type === 'success' && result.params.code) {
      return {
        code: result.params.code,
        state: result.params.state || state,
      };
    }

    return null;
  } catch (error) {
    console.error('Google sign-in error:', error);
    return null;
  }
}

/**
 * Get Google user info from access token
 * This is typically done on the backend, but included here for reference
 */
export async function getGoogleUserInfo(accessToken: string): Promise<GoogleUserInfo | null> {
  try {
    const response = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch user info');
    }

    const userInfo = await response.json();
    return {
      id: userInfo.id,
      email: userInfo.email,
      name: userInfo.name,
      picture: userInfo.picture,
      given_name: userInfo.given_name,
      family_name: userInfo.family_name,
    };
  } catch (error) {
    console.error('Error fetching Google user info:', error);
    return null;
  }
}

/**
 * Verify and log the redirect URI being used
 * Call this function to see what redirect URI your app is actually using
 * Make sure this exact URI is added to Google Console's authorized redirect URIs
 */
export function verifyRedirectUri(): string {
  const redirectUri = GOOGLE_REDIRECT_URI;
  
  console.log('🔍 Google OAuth Redirect URI Verification:');
  console.log('==========================================');
  console.log('Redirect URI:', redirectUri);
  console.log('Google Client ID:', GOOGLE_CLIENT_ID ? `✓ Set (${GOOGLE_CLIENT_ID.substring(0, 30)}...)` : '✗ Not set');
  
  if (!GOOGLE_CLIENT_ID) {
    console.log('');
    console.log('❌ ERROR: Google Client ID is missing!');
    console.log('   Solutions:');
    console.log('   1. Set EXPO_PUBLIC_GOOGLE_CLIENT_ID environment variable');
    console.log('   2. Or add it to app.json extra.googleClientId field');
    console.log('   3. Or add it to app.config.js extra.googleClientId field');
  }
  
  console.log('');
  console.log('⚠️  IMPORTANT: Make sure this exact redirect URI is added to Google Console:');
  console.log('   Go to: Google Cloud Console > APIs & Services > Credentials');
  console.log('   Edit your OAuth 2.0 Client ID');
  console.log('   Add this URI to "Authorized redirect URIs":', redirectUri);
  console.log('==========================================');
  
  return redirectUri;
}

export { GOOGLE_REDIRECT_URI };

