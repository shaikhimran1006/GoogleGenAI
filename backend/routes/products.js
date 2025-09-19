const express = require('express');
const router = express.Router();
const productsData = require('../data/products.json');

// GET /api/products - Get all products
router.get('/', (req, res) => {
  try {
    const { category, artisanId, limit } = req.query;
    let filteredProducts = [...productsData];
    
    // Filter by category
    if (category) {
      filteredProducts = filteredProducts.filter(p => 
        p.category.toLowerCase() === category.toLowerCase()
      );
    }
    
    // Filter by artisan ID
    if (artisanId) {
      filteredProducts = filteredProducts.filter(p => p.artisanId === artisanId);
    }
    
    // Limit results
    if (limit) {
      const limitNum = parseInt(limit, 10);
      if (!isNaN(limitNum) && limitNum > 0) {
        filteredProducts = filteredProducts.slice(0, limitNum);
      }
    }
    
    res.json({
      success: true,
      data: filteredProducts,
      count: filteredProducts.length,
      filters: {
        category: category || null,
        artisanId: artisanId || null,
        limit: limit || null
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch products'
    });
  }
});

// GET /api/products/:id - Get product by ID
router.get('/:id', (req, res) => {
  try {
    const { id } = req.params;
    const product = productsData.find(p => p.id === id || p.slug === id);
    
    if (!product) {
      return res.status(404).json({
        success: false,
        error: 'Product not found'
      });
    }
    
    res.json({
      success: true,
      data: product
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch product'
    });
  }
});

module.exports = router;