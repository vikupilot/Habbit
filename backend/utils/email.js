const nodemailer = require('nodemailer');

// Email configuration
// For development: Use Gmail SMTP or a service like Mailtrap
// For production: Use SendGrid, Mailgun, or AWS SES
const createEmailTransporter = () => {
  // Check for environment variables first (production)
  if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
    console.log('[EMAIL CONFIG] SMTP configuration found:');
    console.log(`  Host: ${process.env.SMTP_HOST}`);
    console.log(`  Port: ${process.env.SMTP_PORT || '587'}`);
    console.log(`  User: ${process.env.SMTP_USER}`);
    console.log(`  From: ${process.env.SMTP_FROM || 'noreply@habbit.app'}`);
    
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
    
    // Test connection
    transporter.verify((error, success) => {
      if (error) {
        console.error('[EMAIL CONFIG] SMTP connection test failed:', error.message);
        console.error('[EMAIL CONFIG] Full error:', error);
      } else {
        console.log('[EMAIL CONFIG] SMTP connection verified successfully');
      }
    });
    
    return transporter;
  }
  
  // Development: Use Gmail (requires app password)
  // Or use Mailtrap for testing: https://mailtrap.io
  // For now, return null and log email content instead
  console.warn('[EMAIL CONFIG] Email configuration not found.');
  console.warn('[EMAIL CONFIG] Set SMTP environment variables in .env file for production.');
  console.warn('[EMAIL CONFIG] For development, emails will be logged to console.');
  console.warn('[EMAIL CONFIG] Required variables: SMTP_HOST, SMTP_USER, SMTP_PASS');
  return null;
};

const emailTransporter = createEmailTransporter();

// Send password reset email
async function sendPasswordResetEmail(email, resetToken) {
  // Use deep link scheme for React Native app
  // Format: habbit://reset-password?token=...
  // This will open the app directly when clicked from email
  const resetUrl = process.env.FRONTEND_URL 
    ? `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`
    : `habbit://reset-password?token=${resetToken}`;
  
  const mailOptions = {
    from: process.env.SMTP_FROM || 'noreply@habbit.app',
    to: email,
    subject: 'Reset Your Password - Habbit',
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .button { 
              display: inline-block; 
              padding: 12px 24px; 
              background-color: #000000; 
              color: #ffffff; 
              text-decoration: none; 
              border-radius: 8px; 
              margin: 20px 0;
            }
            .footer { margin-top: 30px; font-size: 12px; color: #666; }
          </style>
        </head>
        <body>
          <div class="container">
            <h2>Reset Your Password</h2>
            <p>You requested to reset your password for your Habbit account.</p>
            <p>Click the button below to reset your password:</p>
            <a href="${resetUrl}" class="button">Reset Password</a>
            <p style="margin-top: 20px; padding: 15px; background-color: #f5f5f5; border-radius: 8px;">
              <strong>📱 On Mobile:</strong> The link will open the Habbit app automatically.<br/>
              <strong>💻 On Desktop:</strong> Copy the link below and paste it into your mobile device's browser, or manually enter the token in the app.
            </p>
            <p>Or copy and paste this link:</p>
            <p style="word-break: break-all; color: #666; font-family: monospace; padding: 10px; background-color: #f9f9f9; border-radius: 4px;">${resetUrl}</p>
            <p><strong>This link will expire in 1 hour.</strong></p>
            <p>If you didn't request this password reset, please ignore this email.</p>
            <div class="footer">
              <p>© ${new Date().getFullYear()} Habbit. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `,
    text: `
      Reset Your Password - Habbit
      
      You requested to reset your password for your Habbit account.
      
      Click this link to reset your password:
      ${resetUrl}
      
      This link will expire in 1 hour.
      
      If you didn't request this password reset, please ignore this email.
    `,
  };

  if (emailTransporter) {
    try {
      console.log(`[EMAIL] Attempting to send password reset email to: ${email}`);
      const info = await emailTransporter.sendMail(mailOptions);
      console.log(`[EMAIL] Password reset email sent successfully to ${email}`);
      console.log(`[EMAIL] Message ID: ${info.messageId}`);
      console.log(`[EMAIL] Response: ${info.response}`);
    } catch (error) {
      console.error('[EMAIL] Error sending email:', error.message);
      console.error('[EMAIL] Error code:', error.code);
      console.error('[EMAIL] Error command:', error.command);
      console.error('[EMAIL] Full error:', error);
      throw error;
    }
  } else {
    // Development: Log email instead of sending
    console.log('\n=== PASSWORD RESET EMAIL (Development Mode) ===');
    console.log('To:', email);
    console.log('Subject:', mailOptions.subject);
    console.log('Reset URL:', resetUrl);
    console.log('===============================================\n');
  }
}

module.exports = {
  sendPasswordResetEmail,
};

