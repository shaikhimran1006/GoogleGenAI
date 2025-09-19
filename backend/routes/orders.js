const express = require('express');
const router = express.Router();
const ordersData = require('../data/orders.json');

// GET /api/orders - Get all orders
router.get('/', (req, res) => {
  try {
    const { status, limit, productId } = req.query;
    let filteredOrders = [...ordersData];
    
    // Filter by status
    if (status) {
      filteredOrders = filteredOrders.filter(o => 
        o.status.toLowerCase() === status.toLowerCase()
      );
    }
    
    // Filter by product ID
    if (productId) {
      filteredOrders = filteredOrders.filter(o => o.productId === productId);
    }
    
    // Limit results
    if (limit) {
      const limitNum = parseInt(limit, 10);
      if (!isNaN(limitNum) && limitNum > 0) {
        filteredOrders = filteredOrders.slice(0, limitNum);
      }
    }
    
    // Sort by order date (newest first)
    filteredOrders.sort((a, b) => new Date(b.orderedAt) - new Date(a.orderedAt));
    
    res.json({
      success: true,
      data: filteredOrders,
      count: filteredOrders.length,
      filters: {
        status: status || null,
        productId: productId || null,
        limit: limit || null
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch orders'
    });
  }
});

// GET /api/orders/:id - Get order by ID
router.get('/:id', (req, res) => {
  try {
    const { id } = req.params;
    const order = ordersData.find(o => o.id === id);
    
    if (!order) {
      return res.status(404).json({
        success: false,
        error: 'Order not found'
      });
    }
    
    res.json({
      success: true,
      data: order
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch order'
    });
  }
});

module.exports = router;