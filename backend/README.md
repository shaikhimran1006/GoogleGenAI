# Stan It Care Backend API

A Node.js Express server providing REST API endpoints for the Stan It Care artisan marketplace. This backend serves static JSON data and is ready for future database integration.

## 🚨 Important Note

**THE FRONTEND IS NOT CONNECTED TO THIS BACKEND**

This backend runs independently and serves API endpoints that return static JSON data. The frontend uses local JSON files instead of calling these APIs. This separation is intentional for the MVP demonstration.

## ✨ Features

- **RESTful API**: Standard HTTP endpoints
- **CORS Enabled**: Ready for frontend integration
- **Error Handling**: Comprehensive error responses
- **Query Parameters**: Filtering and pagination support
- **Health Check**: Server status monitoring
- **Static File Serving**: Image and asset delivery

## 🛠 Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **CORS**: Cross-origin resource sharing
- **Environment**: dotenv for configuration

## 📡 API Endpoints

### Health Check
```
GET /api/health
```
Returns server status and version information.

### Artisans
```
GET /api/artisans           # Get all artisans
GET /api/artisans/:id       # Get artisan by ID
```

### Products
```
GET /api/products           # Get all products
GET /api/products/:id       # Get product by ID or slug
```

Query parameters for products:
- `category`: Filter by product category
- `artisanId`: Filter by artisan ID
- `limit`: Limit number of results

### Orders
```
GET /api/orders             # Get all orders
GET /api/orders/:id         # Get order by ID
```

Query parameters for orders:
- `status`: Filter by order status
- `productId`: Filter by product ID
- `limit`: Limit number of results

## 📁 Project Structure

```
backend/
├── server.js              # Main application server
├── routes/                # API route handlers
│   ├── artisans.js       # Artisan endpoints
│   ├── products.js       # Product endpoints
│   └── orders.js         # Order endpoints
├── data/                 # Static JSON data
│   ├── artisans.json     # Artisan profiles
│   ├── products.json     # Product catalog
│   └── orders.json       # Order history
├── package.json          # Dependencies and scripts
└── .env                  # Environment variables
```

## 🚀 Getting Started

### Prerequisites

- Node.js 16+ and npm
- Git

### Installation

1. **Navigate to the backend directory**:
   ```bash
   cd backend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm run dev
   ```

4. **Access the API**:
   Server runs on [http://localhost:3001](http://localhost:3001)

### Available Scripts

- `npm run dev` - Start development server with nodemon
- `npm start` - Start production server

## 📊 API Response Format

All API responses follow a consistent format:

### Success Response
```json
{
  "success": true,
  "data": [...],
  "count": 2
}
```

### Error Response
```json
{
  "success": false,
  "error": "Error message"
}
```

## 🔍 API Examples

### Get All Products
```bash
curl http://localhost:3001/api/products
```

Response:
```json
{
  "success": true,
  "data": [
    {
      "id": "prod_1",
      "title": "Handwoven Sambalpuri Saree",
      "slug": "sambalpuri-saree-aarti",
      "shortDescription": "Handwoven Sambalpuri saree with temple motifs.",
      "longDescription": "A 5.5m handwoven saree crafted by Aarti using traditional Sambalpuri technique.",
      "price": 4500,
      "currency": "INR",
      "images": ["/images/products/saree1.jpg", "/images/products/saree2.jpg"],
      "artisanId": "artisan_1",
      "category": "Textiles",
      "createdAt": "2025-01-15",
      "stock": 5
    }
  ],
  "count": 1
}
```

### Get Products by Category
```bash
curl "http://localhost:3001/api/products?category=Textiles"
```

### Get Artisan by ID
```bash
curl http://localhost:3001/api/artisans/artisan_1
```

Response:
```json
{
  "success": true,
  "data": {
    "id": "artisan_1",
    "name": "Aarti",
    "language": "Odia",
    "bio": "Handloom weaver from Odisha. Specializes in Sambalpuri sarees in temple motifs.",
    "profileImage": "/images/artisans/aarti.jpg",
    "location": "Bhubaneswar, Odisha",
    "joinedAt": "2024-10-10"
  }
}
```

### Get Orders with Filtering
```bash
curl "http://localhost:3001/api/orders?status=Delivered&limit=5"
```

## 🗃️ Data Schema

### Artisan Object
```json
{
  "id": "string",
  "name": "string",
  "language": "string",
  "bio": "string",
  "profileImage": "string",
  "location": "string",
  "joinedAt": "YYYY-MM-DD"
}
```

### Product Object
```json
{
  "id": "string",
  "title": "string",
  "slug": "string",
  "shortDescription": "string",
  "longDescription": "string",
  "price": "number",
  "currency": "string",
  "images": ["string"],
  "artisanId": "string",
  "category": "string",
  "createdAt": "YYYY-MM-DD",
  "stock": "number"
}
```

### Order Object
```json
{
  "id": "string",
  "productId": "string",
  "productTitle": "string",
  "buyer": "string",
  "amount": "number",
  "currency": "string",
  "status": "string",
  "orderedAt": "YYYY-MM-DD"
}
```

## 🔧 Configuration

### Environment Variables

Create or edit `.env` file:

```env
NODE_ENV=development
PORT=3001
```

### CORS Configuration

CORS is enabled for all origins by default. To restrict origins:

```javascript
app.use(cors({
  origin: ['http://localhost:3000', 'https://yourdomain.com']
}));
```

## 📝 Adding New Data

### Adding Products

Edit `/data/products.json`:

```json
{
  "id": "prod_3",
  "title": "New Product",
  "slug": "new-product",
  "shortDescription": "Brief description",
  "longDescription": "Detailed description",
  "price": 2000,
  "currency": "INR",
  "images": ["/images/products/new-product.jpg"],
  "artisanId": "artisan_1",
  "category": "Category",
  "createdAt": "2025-01-01",
  "stock": 15
}
```

### Adding Artisans

Edit `/data/artisans.json`:

```json
{
  "id": "artisan_3",
  "name": "New Artisan",
  "language": "Hindi",
  "bio": "Artisan biography",
  "profileImage": "/images/artisans/new-artisan.jpg",
  "location": "City, State",
  "joinedAt": "2025-01-01"
}
```

## 🧪 Testing the API

### Using curl

Test all endpoints:

```bash
# Health check
curl http://localhost:3001/api/health

# Get all artisans
curl http://localhost:3001/api/artisans

# Get specific artisan
curl http://localhost:3001/api/artisans/artisan_1

# Get all products
curl http://localhost:3001/api/products

# Get products by category
curl "http://localhost:3001/api/products?category=Textiles"

# Get specific product
curl http://localhost:3001/api/products/prod_1

# Get all orders
curl http://localhost:3001/api/orders
```

### Using a REST Client

Import into Postman or similar:

1. Create a new collection
2. Add requests for each endpoint
3. Set base URL to `http://localhost:3001`
4. Test different query parameters

## 🔒 Security Considerations

For production deployment:

1. **Environment Variables**: Use secure environment variable management
2. **Rate Limiting**: Add rate limiting middleware
3. **Input Validation**: Validate query parameters
4. **Authentication**: Add JWT or session-based auth
5. **HTTPS**: Use HTTPS in production
6. **CORS**: Restrict to specific origins

### Example Security Middleware

```javascript
// Rate limiting
const rateLimit = require('express-rate-limit');
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Input validation
const { body, validationResult } = require('express-validator');
```

## 🚀 Deployment

### Using PM2 (Recommended)

```bash
npm install -g pm2
pm2 start server.js --name "stan-it-care-api"
pm2 startup
pm2 save
```

### Using Docker

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 3001
CMD ["npm", "start"]
```

### Environment Setup

For production:

```env
NODE_ENV=production
PORT=3001
```

## 🔧 Future Enhancements

1. **Database Integration**: Replace JSON files with MongoDB/PostgreSQL
2. **Authentication**: JWT-based user authentication
3. **File Upload**: Multer for image uploads
4. **Real-time Features**: WebSocket support
5. **Caching**: Redis for improved performance
6. **Logging**: Winston for structured logging
7. **API Documentation**: Swagger/OpenAPI
8. **Testing**: Unit and integration tests

### Database Migration Example

```javascript
// Future database integration
const Product = require('./models/Product');

router.get('/', async (req, res) => {
  try {
    const products = await Product.find(req.query);
    res.json({ success: true, data: products });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});
```

## 🐛 Troubleshooting

### Common Issues

1. **Port Already in Use**:
   ```bash
   lsof -ti:3001 | xargs kill -9
   ```

2. **Module Not Found**:
   ```bash
   npm install
   ```

3. **Permission Errors**:
   ```bash
   sudo chown -R $USER:$GROUP ~/.npm
   ```

### Debugging

Enable debug mode:

```bash
DEBUG=* npm run dev
```

## 📊 API Testing

### Health Check Response
```json
{
  "status": "OK",
  "message": "Stan It Care API is running",
  "timestamp": "2025-01-01T00:00:00.000Z",
  "version": "1.0.0"
}
```

### Error Responses

404 Not Found:
```json
{
  "error": "Not Found",
  "message": "Route /api/invalid not found",
  "availableEndpoints": ["/api/health", "/api/artisans", "/api/products", "/api/orders"]
}
```

500 Internal Server Error:
```json
{
  "error": "Internal Server Error",
  "message": "Something went wrong!"
}
```

## 📞 Support

For API issues:
1. Check server logs
2. Verify JSON data files
3. Test with curl or Postman
4. Check environment variables

---

## 📄 License

MIT License - see LICENSE file for details.

---

**Remember**: This backend is ready for frontend integration but currently runs independently. The frontend uses local JSON files instead of these API endpoints.