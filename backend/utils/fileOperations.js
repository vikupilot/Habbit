const fs = require('fs').promises;
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const USERS_FILE = path.join(DATA_DIR, 'users.json');
const TASKS_FILE = path.join(DATA_DIR, 'tasks.json');
const FAVORITES_FILE = path.join(DATA_DIR, 'favorites.json');
const RESET_TOKENS_FILE = path.join(DATA_DIR, 'resetTokens.json');
const STREAK_SETTINGS_FILE = path.join(DATA_DIR, 'streakSettings.json');
const NOTIFICATION_SETTINGS_FILE = path.join(DATA_DIR, 'notificationSettings.json');

// Ensure data directory exists
async function ensureDataDirectory() {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
  } catch (error) {
    console.error('Error creating data directory:', error);
  }
}

// User file operations
async function readUsers() {
  try {
    const data = await fs.readFile(USERS_FILE, 'utf8');
    const parsed = JSON.parse(data);
    
    // Handle migration: if users is an array, convert to object format
    if (Array.isArray(parsed)) {
      const usersObj = {};
      parsed.forEach(user => {
        usersObj[user.email] = user;
      });
      // Save converted format back to file
      await writeUsers(usersObj);
      return usersObj;
    }
    
    return parsed || {};
  } catch (error) {
    return {};
  }
}

async function writeUsers(users) {
  await ensureDataDirectory();
  await fs.writeFile(USERS_FILE, JSON.stringify(users, null, 2));
}

// Task file operations
async function readTasks() {
  try {
    const data = await fs.readFile(TASKS_FILE, 'utf8');
    const tasks = JSON.parse(data);
    return tasks || {};
  } catch (error) {
    return {};
  }
}

async function writeTasks(tasks) {
  try {
    await ensureDataDirectory();
    await fs.writeFile(TASKS_FILE, JSON.stringify(tasks, null, 2), 'utf8');
    console.log('Tasks saved successfully');
  } catch (error) {
    console.error('Error writing tasks file:', error);
    throw error;
  }
}

// Favorites file operations
async function readFavorites() {
  try {
    const data = await fs.readFile(FAVORITES_FILE, 'utf8');
    const favorites = JSON.parse(data);
    return favorites || {};
  } catch (error) {
    return {};
  }
}

async function writeFavorites(favorites) {
  try {
    await ensureDataDirectory();
    await fs.writeFile(FAVORITES_FILE, JSON.stringify(favorites, null, 2), 'utf8');
  } catch (error) {
    console.error('Error writing favorites file:', error);
    throw error;
  }
}

// Reset tokens file operations
async function readResetTokens() {
  try {
    const data = await fs.readFile(RESET_TOKENS_FILE, 'utf8');
    return JSON.parse(data) || {};
  } catch (error) {
    return {};
  }
}

async function writeResetTokens(tokens) {
  try {
    await ensureDataDirectory();
    await fs.writeFile(RESET_TOKENS_FILE, JSON.stringify(tokens, null, 2), 'utf8');
  } catch (error) {
    console.error('Error writing reset tokens file:', error);
    throw error;
  }
}

// Streak settings file operations
async function readStreakSettings() {
  try {
    const data = await fs.readFile(STREAK_SETTINGS_FILE, 'utf8');
    const settings = JSON.parse(data);
    return settings || {};
  } catch (error) {
    return {};
  }
}

async function writeStreakSettings(settings) {
  try {
    await ensureDataDirectory();
    await fs.writeFile(STREAK_SETTINGS_FILE, JSON.stringify(settings, null, 2), 'utf8');
  } catch (error) {
    console.error('Error writing streak settings file:', error);
    throw error;
  }
}

// Notification settings file operations
async function readNotificationSettings() {
  try {
    const data = await fs.readFile(NOTIFICATION_SETTINGS_FILE, 'utf8');
    const settings = JSON.parse(data);
    return settings || {};
  } catch (error) {
    return {};
  }
}

async function writeNotificationSettings(settings) {
  try {
    await ensureDataDirectory();
    await fs.writeFile(NOTIFICATION_SETTINGS_FILE, JSON.stringify(settings, null, 2), 'utf8');
  } catch (error) {
    console.error('Error writing notification settings file:', error);
    throw error;
  }
}

module.exports = {
  ensureDataDirectory,
  readUsers,
  writeUsers,
  readTasks,
  writeTasks,
  readFavorites,
  writeFavorites,
  readResetTokens,
  writeResetTokens,
  readStreakSettings,
  writeStreakSettings,
  readNotificationSettings,
  writeNotificationSettings,
};

