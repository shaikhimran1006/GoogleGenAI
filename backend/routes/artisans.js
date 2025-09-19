const express = require('express');
const router = express.Router();
const artisansData = require('../data/artisans.json');

// GET /api/artisans - Get all artisans
router.get('/', (req, res) => {
  try {
    res.json({
      success: true,
      data: artisansData,
      count: artisansData.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch artisans'
    });
  }
});

// GET /api/artisans/:id - Get artisan by ID
router.get('/:id', (req, res) => {
  try {
    const { id } = req.params;
    const artisan = artisansData.find(a => a.id === id);
    
    if (!artisan) {
      return res.status(404).json({
        success: false,
        error: 'Artisan not found'
      });
    }
    
    res.json({
      success: true,
      data: artisan
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch artisan'
    });
  }
});

module.exports = router;