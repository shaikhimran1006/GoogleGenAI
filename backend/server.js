const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

// Import routes
const artisansRoutes = require('./routes/artisans');
const productsRoutes = require('./routes/products');
const ordersRoutes = require('./routes/orders');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static files (for serving images)
app.use('/images', express.static(path.join(__dirname, 'public/images')));

// Routes
app.use('/api/artisans', artisansRoutes);
app.use('/api/products', productsRoutes);
app.use('/api/orders', ordersRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Stan It Care API is running',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to Stan It Care API',
    version: '1.0.0',
    endpoints: [
      'GET /api/health - Health check',
      'GET /api/artisans - Get all artisans',
      'GET /api/artisans/:id - Get artisan by ID',
      'GET /api/products - Get all products',
      'GET /api/products/:id - Get product by ID',
      'GET /api/orders - Get all orders'
    ]
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Route ${req.originalUrl} not found`,
    availableEndpoints: [
      '/api/health',
      '/api/artisans',
      '/api/products',
      '/api/orders'
    ]
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong!'
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Stan It Care API Server running on port ${PORT}`);
  console.log(`📍 Health check: http://localhost:${PORT}/api/health`);
  console.log(`📖 API endpoints: http://localhost:${PORT}/`);
  console.log('');
  console.log('🔗 Available API endpoints:');
  console.log(`   GET http://localhost:${PORT}/api/artisans`);
  console.log(`   GET http://localhost:${PORT}/api/products`);
  console.log(`   GET http://localhost:${PORT}/api/orders`);
  console.log('');
  console.log('⚠️  Note: Frontend is NOT connected to this backend');
  console.log('   Frontend uses local JSON files for data');
});