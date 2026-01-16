# Google OAuth Setup Guide

This guide will help you set up Google Sign-In for the Habbit app.

## Prerequisites

1. A Google Cloud Platform (GCP) account
2. Access to the Google Cloud Console

## Step 1: Configure OAuth Consent Screen (IMPORTANT - Do This First!)

**⚠️ You MUST complete the OAuth consent screen BEFORE creating OAuth credentials, otherwise you'll get "This app does not comply with Google OAuth 2.0 policy" error.**

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Navigate to **APIs & Services** > **OAuth consent screen**

4. **Configure the OAuth Consent Screen:**
   
   a. **User Type:**
      - Choose **External** (unless you have a Google Workspace account)
      - Click **Create**
   
   b. **App Information (Required):**
      - **App name**: Use your actual app/project name from Google Console (e.g., "HabbitTracker", "Habbit", etc.)
        - **Note**: This can be different from your app name in `app.json` - it's just the name shown to users during OAuth
        - Use whatever name you have in your Google Cloud project
      - **User support email**: Your email address (required)
      - **App logo** (optional): Upload your app icon
      - **Application home page**: 
        - **For development**: `http://localhost:8081` (this is fine for testing)
        - **For production**: Your actual website URL (e.g., `https://habbit.app` or `https://yourdomain.com`)
        - **Note**: If you don't have a website yet, you can use `http://localhost:8081` for now and update it later
      - **Application privacy policy link**: 
        - **For development**: You can use a placeholder URL like:
          - `https://habbit.app/privacy` (doesn't need to exist yet)
          - `https://www.example.com/privacy` (any placeholder URL works)
          - Or create a simple GitHub Pages site with a privacy policy
        - **For production**: Must be a real, accessible privacy policy page
      - **Application terms of service link**: 
        - **For development**: You can use a placeholder URL like:
          - `https://habbit.app/terms` (doesn't need to exist yet)
          - `https://www.example.com/terms` (any placeholder URL works)
          - Or create a simple GitHub Pages site with terms of service
        - **For production**: Must be a real, accessible terms of service page
      - **Authorized domains**: 
        - **For Development**: You can SKIP this field or leave it empty. Localhost doesn't require a domain.
        - **For Production**: Add your actual domain (e.g., `habbit.app` or `yourdomain.com`)
          - Only add the domain name without `http://` or `https://` (e.g., just `habbit.app`)
          - You need to own/verify this domain in Google Search Console if you want to use it
        - **Note**: If you don't have a domain yet, you can skip this for development and add it later when you deploy to production
      - **Developer contact information**: Your email address (required)
      - Click **Save and Continue**
   
   c. **Scopes:**
      - Click **Add or Remove Scopes**
      - Add these scopes:
        - `.../auth/userinfo.email` (View your email address)
        - `.../auth/userinfo.profile` (See your personal info, including any personal info you've made publicly available)
        - `openid` (Associate you with your personal info on Google)
      - Click **Update**
      - Click **Save and Continue**
   
   d. **Test Users (Required if app is in Testing mode):**
      - Click **Add Users**
      - Add your email address and any other test user emails
      - **Important**: Only these test users can sign in while the app is in Testing mode
      - Click **Add**
      - Click **Save and Continue**
   
   e. **Summary:**
      - Review all the information
      - Click **Back to Dashboard**
   
   f. **Publishing (Optional for now):**
      - For development: Keep the app in "Testing" mode (only test users can sign in)
      - For production: Click **Publish App** to allow all users to sign in
      - Note: Publishing may require verification for sensitive scopes

## Step 2: Create OAuth 2.0 Credentials

1. Navigate to **APIs & Services** > **Credentials**
2. Click **Create Credentials** > **OAuth client ID**
3. If you haven't completed Step 1, you'll be prompted to configure the OAuth consent screen first

## Step 3: Configure OAuth Client

**Important:** For Expo apps, you need to create a **Web application** OAuth client, not an Android/iOS client. This is because:

- Expo apps use a web-based OAuth flow (even on mobile devices)
- The `expo-auth-session` library uses OAuth 2.0 authorization code flow which requires a web application client
- The redirect URI uses a custom URL scheme (like `habbit://oauth`) which is treated as a web redirect
- Native Android/iOS OAuth clients are only for fully native apps (not Expo managed workflow)

1. Application type: **Web application** (required for Expo apps)
2. Name: Habbit Web Client
3. Authorized redirect URIs:
   
   **IMPORTANT:** Google OAuth web application clients only accept valid HTTP/HTTPS URLs, NOT custom URL schemes like `habbit://` or `exp://`.
   
   Add these redirect URIs:
   - For development with Expo Go: `http://localhost:8081`
   - For development tunnel: `https://your-tunnel-url.expo.dev` (if using Expo tunnel)
   - For production: Your production HTTPS URL (e.g., `https://yourapp.com/oauth`)
   
   **Note:** `expo-auth-session` will automatically handle the redirect back to your app using the custom scheme (`habbit://`), but Google needs a valid HTTP/HTTPS URL in the OAuth client configuration.
   
   The actual redirect flow works like this:
   1. User authenticates with Google
   2. Google redirects to `http://localhost:8081` (or your HTTPS URL)
   3. Expo intercepts this and redirects to your app using `habbit://oauth`

4. Click **Create**
5. Copy the **Client ID** and **Client Secret**

## Step 4: Configure Environment Variables

### Frontend (.env or app.json)

Add to your `.env` file or `app.json`:

```env
EXPO_PUBLIC_GOOGLE_CLIENT_ID=your-client-id-here.apps.googleusercontent.com
```

Or in `app.json`:
```json
{
  "expo": {
    "extra": {
      "googleClientId": "your-client-id-here.apps.googleusercontent.com"
    }
  }
}
```

### Backend (.env)

Add to `backend/.env`:

```env
GOOGLE_CLIENT_ID=your-client-id-here.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-client-secret-here
GOOGLE_REDIRECT_URI=http://localhost:8081
```

**Note:** The backend redirect URI should match what you configured in Google Console (HTTP/HTTPS URL, not custom scheme).

## Step 5: Update app.json

Make sure your `app.json` has the correct scheme:

```json
{
  "expo": {
    "scheme": "habbit",
    ...
  }
}
```

## Step 6: Verify Redirect URI

Before testing, verify what redirect URI your app is actually using:

1. Add this temporary code to see the redirect URI:
   ```typescript
   import * as AuthSession from 'expo-auth-session';
   const redirectUri = AuthSession.makeRedirectUri({ useProxy: true });
   console.log('Redirect URI:', redirectUri);
   ```

2. Make sure this exact URI is added to Google Console's authorized redirect URIs

## Step 7: Test the Integration

1. Start your backend server:
   ```bash
   cd backend
   npm start
   ```

2. Start your Expo app:
   ```bash
   npm start
   ```

3. Try signing in with Google from the login or signup screen

## Troubleshooting

### Common Issues

1. **"redirect_uri_mismatch" error**
   - Make sure the redirect URI in Google Console matches exactly with what's configured in your app
   - The redirect URI must be a valid HTTP/HTTPS URL (e.g., `http://localhost:8081`)
   - Do NOT use custom schemes like `habbit://oauth` in Google Console - only use HTTP/HTTPS URLs
   - Check the console logs to see what redirect URI `expo-auth-session` is actually using

2. **"Invalid Redirect: must end with a public top-level domain" error**
   - This means you tried to use a custom URL scheme (`habbit://`) in Google Console
   - Solution: Use `http://localhost:8081` for development instead
   - Google OAuth web clients only accept HTTP/HTTPS URLs, not custom schemes

2. **"invalid_client" error**
   - Verify your Client ID and Client Secret are correct
   - Make sure environment variables are loaded properly

3. **"This app does not comply with Google OAuth 2.0 policy" error**
   - This error occurs when the OAuth consent screen is not properly configured or the app is in testing mode
   - **Solution Steps:**
     
     a. **Complete OAuth Consent Screen Configuration:**
        1. Go to [Google Cloud Console](https://console.cloud.google.com/)
        2. Navigate to **APIs & Services** > **OAuth consent screen**
        3. Fill in ALL required fields:
           - **App name**: Use your actual project/app name from Google Console (e.g., "HabbitTracker", "Habbit", etc.)
           - **User support email**: Your email address
           - **App logo** (optional but recommended): Upload your app icon
           - **Application home page**: 
             - For development: `http://localhost:8081` (this works fine)
             - For production: Your website URL (e.g., `https://habbit.app` or `https://yourdomain.com`)
           - **Application privacy policy link**: 
             - For development: Can use a placeholder like `https://habbit.app/privacy` (doesn't need to exist)
             - For production: Must be a real, accessible privacy policy page
           - **Application terms of service link**: 
             - For development: Can use a placeholder like `https://habbit.app/terms` (doesn't need to exist)
             - For production: Must be a real, accessible terms of service page
           - **Authorized domains**: 
             - **For development: You can SKIP this or leave it empty** - localhost doesn't require a domain
             - For production: Add your domain (e.g., `habbit.app` or `yourdomain.com`) - just the domain name, no `http://`
           - **Developer contact information**: Your email address
     
     b. **Add Required Scopes:**
        1. Click on **Scopes** tab
        2. Click **Add or Remove Scopes**
        3. Add these scopes:
           - `.../auth/userinfo.email`
           - `.../auth/userinfo.profile`
           - `openid`
        4. Click **Update** and then **Save and Continue**
     
     c. **Add Test Users (if app is in Testing mode):**
        1. Go to **Test users** tab
        2. Click **Add Users**
        3. Add the email addresses of users who will test the app
        4. **Important**: Only test users can sign in while the app is in Testing mode
        5. Click **Add** and then **Save and Continue**
     
     d. **Review and Submit:**
        1. Review all the information
        2. Click **Back to Dashboard**
        3. If you want to publish the app (allow any user to sign in):
           - Click **Publish App** button
           - Note: Publishing requires verification if you're requesting sensitive scopes
           - For basic scopes (email, profile), you can usually publish immediately
     
     e. **For Development/Testing:**
       - Keep the app in "Testing" mode
       - Add your own email and any test user emails to the test users list
       - Test users can sign in immediately without verification
     
     f. **For Production:**
       - Complete all required fields (privacy policy, terms of service)
       - Click "Publish App" to make it available to all users
       - If verification is required, Google will review your app (can take a few days)

4. **OAuth consent screen not configured**
   - Complete the OAuth consent screen setup in Google Cloud Console
   - Add test users if your app is in testing mode
   - See error #3 above for detailed steps

4. **App not opening after Google sign-in**
   - Verify the scheme is correctly configured in `app.json`
   - Check that the redirect URI uses the correct scheme

## Security Notes

- Never commit `.env` files with real credentials
- Use different OAuth clients for development and production
- Regularly rotate your Client Secret
- Keep your Client Secret secure on the backend only

## Next Steps

Once Google Sign-In is working, you can:
- Customize the OAuth consent screen
- Add more scopes if needed
- Set up production OAuth credentials
- Implement Apple Sign-In (see `utils/appleAuth.ts` for structure)

