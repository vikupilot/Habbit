# Email Configuration for Password Reset

This document explains how to configure email sending for the forgot password feature.

## Development Mode

By default, the app runs in **development mode** where password reset emails are logged to the console instead of being sent. This is useful for testing without setting up email services.

When a password reset is requested, you'll see output like:
```
=== PASSWORD RESET EMAIL (Development Mode) ===
To: user@example.com
Subject: Reset Your Password - Habbit
Reset URL: http://localhost:8081/reset-password?token=abc123...
===============================================
```

## Production Setup

To enable actual email sending in production, set the following environment variables:

### Option 1: SMTP Server (Recommended)

**The server is already configured to load `.env` files using `dotenv`.**

Create a `.env` file in the `backend` directory (same folder as `server.js`):

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SMTP_FROM=noreply@habbit.app
FRONTEND_URL=https://your-app-domain.com
```

**Important Notes about `.env` file format:**
- **Quotes are optional** - You can use quotes or no quotes
- **If password has special characters or spaces**, use quotes:
  ```env
  SMTP_PASS="your app password with spaces"
  SMTP_PASS='password-with-special-chars!@#'
  ```
- **For Gmail App Passwords** (16 characters, no spaces), quotes are optional:
  ```env
  SMTP_PASS=abcd efgh ijkl mnop
  # OR
  SMTP_PASS="abcd efgh ijkl mnop"
  # Both work the same
  ```
- **No spaces around the `=` sign** - Use `KEY=value` not `KEY = value`
- **No trailing spaces** - Make sure there are no spaces at the end of values

**For Gmail:**
1. Enable 2-Factor Authentication
2. Generate an App Password: https://myaccount.google.com/apppasswords
3. Use the app password as `SMTP_PASS`

**For other providers:**
- **SendGrid**: Use `smtp.sendgrid.net` with port 587
- **Mailgun**: Use `smtp.mailgun.org` with port 587
- **AWS SES**: Use your SES SMTP endpoint

### Option 2: Email Service APIs (Future Enhancement)

For better scalability, consider integrating:
- **SendGrid API** (recommended)
- **Mailgun API**
- **AWS SES API**
- **Postmark**

These services provide better deliverability and analytics.

## Testing Email in Development

### Using Mailtrap (Recommended for Testing)

1. Sign up at https://mailtrap.io (free tier available)
2. Create an inbox
3. Get SMTP credentials from Mailtrap
4. Set environment variables:

```env
SMTP_HOST=smtp.mailtrap.io
SMTP_PORT=2525
SMTP_USER=your-mailtrap-username
SMTP_PASS=your-mailtrap-password
SMTP_FROM=noreply@habbit.app
```

All emails will be captured in Mailtrap's inbox for testing.

## Security Best Practices

1. **Never commit `.env` files** - Add to `.gitignore`
2. **Use App Passwords** - Don't use your main account password
3. **Rate Limiting** - Consider adding rate limiting to prevent abuse
4. **Token Expiration** - Reset tokens expire after 1 hour
5. **One-Time Use** - Tokens are invalidated after use

## Future: OAuth Integration (Google/Apple)

When implementing OAuth:
- Users who sign up with Google/Apple won't have passwords
- The forgot password endpoint already checks for OAuth users
- OAuth users should reset passwords through their provider (Google/Apple)
- Consider showing a different message for OAuth users

## Deep Linking Configuration

The password reset emails use deep links to open the app directly:
- **Format:** `habbit://reset-password?token=...`
- **Configured in:** `app.json` with scheme `"habbit"`
- **How it works:** When users click the link from email on mobile, it opens the Habbit app automatically

**For Development:**
- Deep links work automatically with Expo Go
- For production builds, ensure `app.json` has the `scheme` configured
- Test deep links using: `npx uri-scheme open habbit://reset-password?token=test123 --ios` or `--android`

**Note:** If `FRONTEND_URL` is set in `.env`, it will use that URL instead (useful for web versions or custom domains).

## Troubleshooting

**Email not sending:**
- Check environment variables are set correctly
- Verify SMTP credentials
- Check firewall/network settings
- Review server logs for error messages

**Email going to spam:**
- Use a proper `SMTP_FROM` address
- Set up SPF/DKIM records for your domain
- Consider using a dedicated email service (SendGrid, etc.)

**Reset link opens JSON instead of app:**
- Ensure `app.json` has `"scheme": "habbit"` configured
- For development, the link should use `habbit://` scheme (not `http://localhost`)
- On mobile, clicking the link should open the app automatically
- If testing on desktop, copy the link and open it on your mobile device

