const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { readUsers, writeUsers, readResetTokens, writeResetTokens } = require('../utils/fileOperations');
const { normalizeEmail } = require('../utils/helpers');
const { sendPasswordResetEmail } = require('../utils/email');
const { authenticateToken, JWT_SECRET } = require('../middleware/auth');

const router = express.Router();

// Signup
router.post('/signup', async (req, res) => {
  try {
    const { fullName, email, password } = req.body;

    if (!fullName || !email || !password) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const users = await readUsers();

    // Normalize email for case-insensitive lookup and storage
    const normalizedEmail = normalizeEmail(email);
    
    // Check if user exists (case-insensitive)
    const existingUser = users[normalizedEmail] || 
      Object.values(users).find(u => u.email && normalizeEmail(u.email) === normalizedEmail);
    
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const userId = Date.now().toString();

    users[normalizedEmail] = {
      id: userId,
      fullName,
      email,
      password: hashedPassword,
      authProvider: 'email', // Track auth method for future OAuth support
      createdAt: new Date().toISOString(),
    };

    await writeUsers(users);

    const token = jwt.sign({ id: userId, email }, JWT_SECRET, { expiresIn: '7d' });

    res.json({
      success: true,
      token,
      user: {
        id: userId,
        fullName,
        email,
      },
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const users = await readUsers();
    
    // Normalize email for case-insensitive lookup
    const normalizedEmail = normalizeEmail(email);
    const user = users[normalizedEmail] || 
      Object.values(users).find(u => u.email && normalizeEmail(u.email) === normalizedEmail);

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user.id, email }, JWT_SECRET, { expiresIn: '7d' });

    res.json({
      success: true,
      token,
      user: {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

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
      id: user.id,
      fullName: user.fullName,
      email: user.email,
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Forgot Password - Request password reset
router.post('/forgot-password', async (req, res) => {
  console.log('[FORGOT PASSWORD] Request received:', { email: req.body.email });
  try {
    const { email } = req.body;

    if (!email) {
      console.log('[FORGOT PASSWORD] Missing email in request');
      return res.status(400).json({ error: 'Email is required' });
    }

    console.log('[FORGOT PASSWORD] Looking up user:', email);
    const users = await readUsers();
    
    // Normalize email for case-insensitive lookup
    const normalizedEmail = normalizeEmail(email);
    console.log('[FORGOT PASSWORD] Normalized email for lookup:', normalizedEmail);
    console.log('[FORGOT PASSWORD] Available user keys in DB:', Object.keys(users).map(e => `"${e}"`).join(', '));
    
    // Case-insensitive lookup
    const user = users[normalizedEmail] || 
      Object.values(users).find(u => u.email && normalizeEmail(u.email) === normalizedEmail);

    // Security: Don't reveal if email exists or not
    // Always return success message to prevent email enumeration
    if (!user) {
      console.log('[FORGOT PASSWORD] User not found (returning success for security)');
      return res.json({ 
        success: true, 
        message: 'If an account with that email exists, a password reset link has been sent.' 
      });
    }

    console.log('[FORGOT PASSWORD] User found:', { id: user.id, authProvider: user.authProvider });

    // Check if user signed up with OAuth (Google/Apple) - they don't have passwords
    if (user.authProvider && user.authProvider !== 'email') {
      console.log('[FORGOT PASSWORD] User signed up with OAuth, skipping password reset');
      return res.json({ 
        success: true, 
        message: 'If an account with that email exists, a password reset link has been sent.' 
      });
    }

    // Generate secure reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const expiresAt = Date.now() + (60 * 60 * 1000); // 1 hour from now
    console.log('[FORGOT PASSWORD] Generated reset token, expires at:', new Date(expiresAt).toISOString());

    // Store reset token (use normalized email for consistency)
    const resetTokens = await readResetTokens();
    resetTokens[resetToken] = {
      email: normalizedEmail,
      expiresAt: expiresAt,
      used: false,
    };
    await writeResetTokens(resetTokens);
    console.log('[FORGOT PASSWORD] Reset token stored successfully');

    // Send password reset email
    console.log('[FORGOT PASSWORD] Attempting to send email...');
    try {
      await sendPasswordResetEmail(email, resetToken);
      console.log('[FORGOT PASSWORD] Email sent successfully');
    } catch (emailError) {
      console.error('[FORGOT PASSWORD] ❌ ERROR sending password reset email:');
      console.error('[FORGOT PASSWORD] Error message:', emailError.message);
      console.error('[FORGOT PASSWORD] Error code:', emailError.code);
      console.error('[FORGOT PASSWORD] Error command:', emailError.command);
      console.error('[FORGOT PASSWORD] Full error:', emailError);
      // Don't fail the request if email fails - token is still valid
    }

    res.json({ 
      success: true, 
      message: 'If an account with that email exists, a password reset link has been sent.' 
    });
  } catch (error) {
    console.error('[FORGOT PASSWORD] ❌ Unexpected error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Reset Password - Validate token and update password
router.post('/reset-password', async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      return res.status(400).json({ error: 'Token and new password are required' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }

    // Validate reset token
    const resetTokens = await readResetTokens();
    const tokenData = resetTokens[token];

    if (!tokenData) {
      return res.status(400).json({ error: 'Invalid or expired reset token' });
    }

    if (tokenData.used) {
      return res.status(400).json({ error: 'This reset token has already been used' });
    }

    if (Date.now() > tokenData.expiresAt) {
      // Clean up expired token
      delete resetTokens[token];
      await writeResetTokens(resetTokens);
      return res.status(400).json({ error: 'Reset token has expired. Please request a new one.' });
    }

    // Update user password
    const users = await readUsers();
    
    // Normalize email for case-insensitive lookup
    const normalizedEmail = normalizeEmail(tokenData.email);
    const user = users[normalizedEmail] || 
      Object.values(users).find(u => u.email && normalizeEmail(u.email) === normalizedEmail);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    
    // Use normalized email as key to ensure consistency
    delete users[tokenData.email]; // Remove old key if different case
    users[normalizedEmail] = user;
    await writeUsers(users);

    // Mark token as used
    resetTokens[token].used = true;
    await writeResetTokens(resetTokens);

    res.json({ 
      success: true, 
      message: 'Password has been reset successfully. You can now login with your new password.' 
    });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;

