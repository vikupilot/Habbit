const express = require('express');
const { readFavorites, writeFavorites, readStreakSettings, writeStreakSettings, readNotificationSettings, writeNotificationSettings } = require('../utils/fileOperations');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Get favorites
router.get('/', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const favorites = await readFavorites();
    res.json({ favorites: favorites[userId] || [] });
  } catch (error) {
    console.error('Get favorites error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create favorite
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { title } = req.body;
    const userId = req.user.id;

    if (!title || !title.trim()) {
      return res.status(400).json({ error: 'Title is required' });
    }

    const favorites = await readFavorites();

    if (!favorites[userId]) {
      favorites[userId] = [];
    }

    // Check if favorite already exists
    const existingIndex = favorites[userId].findIndex(
      f => f.title.toLowerCase() === title.trim().toLowerCase()
    );

    if (existingIndex !== -1) {
      return res.status(400).json({ error: 'Favorite task already exists' });
    }

    const newFavorite = {
      id: Date.now().toString(),
      title: title.trim(),
      order: favorites[userId].length,
      createdAt: new Date().toISOString(),
    };

    favorites[userId].push(newFavorite);
    await writeFavorites(favorites);

    res.json({ success: true, favorite: newFavorite });
  } catch (error) {
    console.error('Create favorite error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete favorite
router.delete('/:favoriteId', authenticateToken, async (req, res) => {
  try {
    const { favoriteId } = req.params;
    const userId = req.user.id;

    const favorites = await readFavorites();

    if (!favorites[userId]) {
      return res.status(404).json({ error: 'Favorite not found' });
    }

    favorites[userId] = favorites[userId].filter(f => f.id !== favoriteId);
    
    // Reorder favorites after deletion
    favorites[userId].forEach((favorite, index) => {
      favorite.order = index;
    });

    await writeFavorites(favorites);

    res.json({ success: true });
  } catch (error) {
    console.error('Delete favorite error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Reorder favorites
router.put('/reorder', authenticateToken, async (req, res) => {
  try {
    const { favoriteIds } = req.body;
    const userId = req.user.id;

    if (!Array.isArray(favoriteIds)) {
      return res.status(400).json({ error: 'favoriteIds must be an array' });
    }

    const favorites = await readFavorites();

    if (!favorites[userId]) {
      return res.status(404).json({ error: 'Favorites not found' });
    }

    // Reorder favorites based on favoriteIds array
    const favoritesMap = new Map(favorites[userId].map(f => [f.id, f]));
    const reorderedFavorites = favoriteIds
      .map(id => favoritesMap.get(id))
      .filter(Boolean);

    reorderedFavorites.forEach((favorite, index) => {
      favorite.order = index;
    });

    favorites[userId] = reorderedFavorites;
    await writeFavorites(favorites);

    res.json({ success: true, favorites: reorderedFavorites });
  } catch (error) {
    console.error('Reorder favorites error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get streak settings
router.get('/streak-settings', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const settings = await readStreakSettings();
    const userSettings = settings[userId] || { minTasksPerDay: 1 };
    res.json({ success: true, settings: userSettings });
  } catch (error) {
    console.error('Get streak settings error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update streak settings
router.put('/streak-settings', authenticateToken, async (req, res) => {
  try {
    const { minTasksPerDay } = req.body;
    const userId = req.user.id;

    if (typeof minTasksPerDay !== 'number' || minTasksPerDay < 1 || minTasksPerDay > 10) {
      return res.status(400).json({ error: 'minTasksPerDay must be a number between 1 and 10' });
    }

    const settings = await readStreakSettings();
    settings[userId] = { minTasksPerDay };
    await writeStreakSettings(settings);

    res.json({ success: true, settings: { minTasksPerDay } });
  } catch (error) {
    console.error('Update streak settings error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get notification settings
router.get('/notification-settings', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const settings = await readNotificationSettings();
    const userSettings = settings[userId] || { enabled: false, hour: 20, minute: 0 };
    res.json({ success: true, settings: userSettings });
  } catch (error) {
    console.error('Get notification settings error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update notification settings
router.put('/notification-settings', authenticateToken, async (req, res) => {
  try {
    const { enabled, hour, minute } = req.body;
    const userId = req.user.id;

    if (typeof enabled !== 'boolean') {
      return res.status(400).json({ error: 'enabled must be a boolean' });
    }

    if (enabled) {
      if (typeof hour !== 'number' || hour < 0 || hour > 23) {
        return res.status(400).json({ error: 'hour must be a number between 0 and 23' });
      }
      if (typeof minute !== 'number' || minute < 0 || minute > 59) {
        return res.status(400).json({ error: 'minute must be a number between 0 and 59' });
      }
    }

    const settings = await readNotificationSettings();
    settings[userId] = { enabled, hour: enabled ? hour : 20, minute: enabled ? minute : 0 };
    await writeNotificationSettings(settings);

    res.json({ success: true, settings: settings[userId] });
  } catch (error) {
    console.error('Update notification settings error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;

