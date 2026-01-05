// Load environment variables from .env file
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { ensureDataDirectory } = require('./utils/fileOperations');

// Log environment variable status
console.log('[ENV] Checking email configuration...');
console.log('[ENV] SMTP_HOST:', process.env.SMTP_HOST ? '✓ Set' : '✗ Not set');
console.log('[ENV] SMTP_USER:', process.env.SMTP_USER ? '✓ Set' : '✗ Not set');
if (process.env.SMTP_PASS) {
  // Show first 2 and last 2 characters to verify it's loaded (for debugging)
  const pass = process.env.SMTP_PASS;
  const masked = pass.length > 4 
    ? `${pass.substring(0, 2)}${'*'.repeat(pass.length - 4)}${pass.substring(pass.length - 2)}`
    : '****';
  console.log('[ENV] SMTP_PASS:', `✓ Set (${pass.length} chars, ${masked})`);
} else {
  console.log('[ENV] SMTP_PASS:', '✗ Not set');
}
console.log('[ENV] SMTP_FROM:', process.env.SMTP_FROM || 'Using default: noreply@habbit.app');
console.log('[ENV] FRONTEND_URL:', process.env.FRONTEND_URL || 'Using default: http://localhost:8081');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Initialize data directory
ensureDataDirectory();

// Import route modules
const authRoutes = require('./routes/auth');
const plannerRoutes = require('./routes/planner');
const dashboardRoutes = require('./routes/dashboard');
const motivationRoutes = require('./routes/motivation');

// Register routes
app.use('/api/auth', authRoutes);
app.use('/api/tasks', plannerRoutes);
app.use('/api/favorites', dashboardRoutes);
app.use('/api/motivation', motivationRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
});
