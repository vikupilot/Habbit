const express = require('express');
const { readFavorites, writeFavorites } = require('../utils/fileOperations');
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

module.exports = router;

