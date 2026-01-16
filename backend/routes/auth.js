const express = require('express');
const jwt = require('jsonwebtoken');
const { readUsers, writeUsers } = require('../utils/fileOperations');
const { normalizeEmail } = require('../utils/helpers');
const { authenticateToken, JWT_SECRET } = require('../middleware/auth');

// Google OAuth Configuration
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || '';
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET || '';
const GOOGLE_REDIRECT_URI = process.env.GOOGLE_REDIRECT_URI || '';

const router = express.Router();

// Get current user
router.get('/me', authenticateToken, async (req, res) => {
  try {
    const users = await readUsers();
    
    // Normalize email for case-insensitive lookup
    const normalizedEmail = normalizeEmail(req.user.email);
    const user = users[normalizedEmail] || 
      Object.values(users).find(u => u.email && normalizeEmail(u.email) === normalizedEmail);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      success: true,
      user: {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        gender: user.gender || null,
        picture: user.picture || null,
      },
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update user profile
router.put('/profile', authenticateToken, async (req, res) => {
  try {
    const { fullName, gender } = req.body;
    const users = await readUsers();
    
    // Normalize email for case-insensitive lookup
    const normalizedEmail = normalizeEmail(req.user.email);
    const user = users[normalizedEmail] || 
      Object.values(users).find(u => u.email && normalizeEmail(u.email) === normalizedEmail);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Update fields if provided
    if (fullName !== undefined) {
      user.fullName = fullName;
    }
    if (gender !== undefined) {
      if (gender !== null && gender !== 'male' && gender !== 'female') {
        return res.status(400).json({ error: 'Gender must be "male", "female", or null' });
      }
      user.gender = gender;
    }

    // Use normalized email as key
    delete users[normalizedEmail]; // Remove old key if different case
    users[normalizedEmail] = user;
    await writeUsers(users);

    res.json({
      success: true,
      user: {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        gender: user.gender || null,
      },
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Google OAuth - Sign in/Sign up with Google
router.post('/google', async (req, res) => {
  try {
    const { code, redirectUri } = req.body;

    if (!code) {
      return res.status(400).json({ error: 'Authorization code is required' });
    }

    if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET) {
      console.error('Google OAuth credentials not configured');
      return res.status(500).json({ error: 'Google sign-in is not configured' });
    }

    // Exchange authorization code for access token
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        code,
        client_id: GOOGLE_CLIENT_ID,
        client_secret: GOOGLE_CLIENT_SECRET,
        redirect_uri: redirectUri || GOOGLE_REDIRECT_URI,
        grant_type: 'authorization_code',
      }),
    });

    if (!tokenResponse.ok) {
      const errorData = await tokenResponse.json().catch(() => ({}));
      console.error('Google token exchange error:', errorData);
      return res.status(401).json({ error: 'Failed to authenticate with Google' });
    }

    const tokenData = await tokenResponse.json();
    const { access_token } = tokenData;

    // Get user info from Google
    const userInfoResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });

    if (!userInfoResponse.ok) {
      return res.status(401).json({ error: 'Failed to fetch user information from Google' });
    }

    const googleUser = await userInfoResponse.json();
    const { id: googleId, email, name, picture } = googleUser;

    if (!email) {
      return res.status(400).json({ error: 'Email is required from Google account' });
    }

    const users = await readUsers();
    const normalizedEmail = normalizeEmail(email);

    // Check if user exists
    let user = users[normalizedEmail] ||
      Object.values(users).find(u => u.email && normalizeEmail(u.email) === normalizedEmail);

    if (user) {
      // Existing user - update auth provider if needed
      if (!user.authProvider || user.authProvider === 'email') {
        user.authProvider = 'google';
        user.googleId = googleId;
        if (picture) user.picture = picture;
      }
    } else {
      // New user - create account
      const userId = Date.now().toString();
      user = {
        id: userId,
        fullName: name || email.split('@')[0],
        email,
        password: null, // No password for OAuth users
        authProvider: 'google',
        googleId,
        picture: picture || null,
        gender: null,
        createdAt: new Date().toISOString(),
      };
    }

    // Save user
    users[normalizedEmail] = user;
    await writeUsers(users);

    // Generate JWT token
    const token = jwt.sign({ id: user.id, email }, JWT_SECRET, { expiresIn: '7d' });

    res.json({
      success: true,
      token,
      user: {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        gender: user.gender || null,
        picture: user.picture || null,
      },
    });
  } catch (error) {
    console.error('Google OAuth error:', error);
    res.status(500).json({ error: 'Internal server error during Google authentication' });
  }
});

// Apple OAuth - Sign in/Sign up with Apple (prepared for future)
router.post('/apple', async (req, res) => {
  try {
    // TODO: Implement Apple Sign-In when ready
    return res.status(501).json({ 
      error: 'Apple Sign-In is not yet implemented',
      message: 'This feature will be available in a future update'
    });
  } catch (error) {
    console.error('Apple OAuth error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;

