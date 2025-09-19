# Stan It Care - AI Marketplace MVP

A complete full-stack marketplace application connecting Indian artisans with customers worldwide. This MVP demonstrates a modern e-commerce platform with artisan onboarding, product management, and analytics.

## 🚨 Important Architecture Note

**THE FRONTEND IS NOT CONNECTED TO THE BACKEND**

This is an intentional design decision for the MVP:
- **Frontend**: Uses local JSON files for all data
- **Backend**: Provides REST API endpoints with the same data schema
- **Purpose**: Demonstrates both components working independently

## 🎯 Project Overview

Stan It Care empowers Indian artisans by providing a platform to showcase their handcrafted products with rich storytelling, modern UI/UX, and plans for AR preview capabilities.

### Key Features

- **Artisan Onboarding**: Multi-step registration with voice story placeholders
- **Product Management**: Upload and showcase handcrafted items
- **Rich Product Details**: Detailed views with artisan stories
- **Analytics Dashboard**: Sales tracking and order management
- **Responsive Design**: Works across all devices
- **Modern Animations**: Smooth transitions and interactions
- **AR Preview Placeholder**: Future-ready AR integration

## 🛠 Technology Stack

### Frontend
- **Framework**: Next.js 14 with TypeScript
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Data**: Local JSON files

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **API**: RESTful endpoints
- **Data**: Static JSON files

## 📁 Project Structure

```
stan-it-care/
├── frontend/                 # Next.js application
│   ├── components/          # React components
│   ├── pages/              # Next.js pages
│   ├── data/               # Local JSON data
│   ├── public/             # Static assets
│   └── styles/             # CSS styles
├── backend/                 # Express API server
│   ├── routes/             # API routes
│   ├── data/               # JSON data files
│   └── server.js           # Main server file
└── README.md               # This file
```

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ and npm
- Git

### 1. Clone the Repository
```bash
git clone <repository-url>
cd stan-it-care
```

### 2. Start the Frontend
```bash
cd frontend
npm install
npm run dev
```
Frontend runs on: http://localhost:3000

### 3. Start the Backend (Optional)
```bash
cd backend
npm install
npm run dev
```
Backend runs on: http://localhost:3001

## 🎮 Usage Guide

### Frontend Features

1. **Home Page** (http://localhost:3000)
   - Hero section with call-to-action
   - Featured products showcase
   - Navigation to all sections

2. **Product Catalog** (/products)
   - Browse all products
   - Filter by category
   - Product upload interface

3. **Product Details** (/products/[slug])
   - Detailed product information
   - Artisan story and profile
   - AR preview placeholder
   - AI caption generation demo

4. **Artisan Onboarding** (/artisans/onboard)
   - Multi-step registration form
   - Profile photo upload (UI only)
   - Voice recording placeholder
   - Preview generated profile

5. **Dashboard** (/dashboard)
   - Sales analytics
   - Order management
   - Visual charts and metrics

### Backend API Endpoints

Test the API endpoints (remember: frontend doesn't use these):

```bash
# Health check
curl http://localhost:3001/api/health

# Get products
curl http://localhost:3001/api/products

# Get artisans
curl http://localhost:3001/api/artisans

# Get orders
curl http://localhost:3001/api/orders
```

## 📊 Data Schema

The application uses consistent data schemas across frontend and backend:

### Product Schema
```json
{
  "id": "prod_1",
  "title": "Handwoven Sambalpuri Saree",
  "slug": "sambalpuri-saree-aarti",
  "shortDescription": "Brief description",
  "longDescription": "Detailed description",
  "price": 4500,
  "currency": "INR",
  "images": ["/images/products/saree1.jpg"],
  "artisanId": "artisan_1",
  "category": "Textiles",
  "createdAt": "2025-01-15",
  "stock": 5
}
```

### Artisan Schema
```json
{
  "id": "artisan_1",
  "name": "Aarti",
  "language": "Odia",
  "bio": "Artisan story and background",
  "profileImage": "/images/artisans/aarti.jpg",
  "location": "Bhubaneswar, Odisha",
  "joinedAt": "2024-10-10"
}
```

## 🔧 Development

### Adding New Products

Edit `frontend/data/products.json`:
```json
{
  "id": "prod_new",
  "title": "New Product",
  "slug": "new-product-slug",
  "shortDescription": "Brief description",
  "longDescription": "Detailed description",
  "price": 2000,
  "currency": "INR",
  "images": ["/images/products/new-product.jpg"],
  "artisanId": "artisan_1",
  "category": "Category",
  "createdAt": "2025-01-01",
  "stock": 10
}
```

Also update `backend/data/products.json` to keep both in sync.

### Adding New Artisans

Edit both `frontend/data/artisans.json` and `backend/data/artisans.json`:
```json
{
  "id": "artisan_new",
  "name": "Artisan Name",
  "language": "Language",
  "bio": "Artisan biography and story",
  "profileImage": "/images/artisans/artisan.jpg",
  "location": "City, State",
  "joinedAt": "2025-01-01"
}
```

## 🎨 Customization

### Styling
The frontend uses Tailwind CSS with custom color schemes:
- Primary: Orange tones (`primary-*`)
- Secondary: Blue tones (`secondary-*`)
- Neutral: Gray scale for text and backgrounds

### Components
All components are modular and reusable:
- `ProductCard`: Product display
- `OnboardForm`: Multi-step form
- `Modal`: Reusable modal dialog
- `Header/Footer`: Navigation components

## 🧪 Testing

### Frontend Testing
```bash
cd frontend
npm run test
```

### Backend Testing
```bash
cd backend
# Test API endpoints
curl http://localhost:3001/api/health
curl http://localhost:3001/api/products
curl http://localhost:3001/api/artisans
curl http://localhost:3001/api/orders
```

## 🔐 Security Notes

For production deployment:

1. **Environment Variables**: Secure all API keys
2. **CORS**: Restrict origins
3. **Rate Limiting**: Prevent API abuse
4. **Input Validation**: Sanitize all inputs
5. **HTTPS**: Use SSL certificates

## 🚀 Deployment

### Frontend Deployment (Vercel Recommended)
```bash
cd frontend
npm run build
# Deploy to Vercel, Netlify, or similar
```

### Backend Deployment (Railway/Heroku)
```bash
cd backend
npm start
# Deploy to Railway, Heroku, or similar
```

## 🔮 Future Enhancements

### Phase 1: Integration
1. Connect frontend to backend APIs
2. Implement real authentication
3. Add real file upload functionality

### Phase 2: Advanced Features
1. **AR Preview**: WebAR product visualization
2. **Voice Stories**: Real audio recording and playback
3. **AI Content**: GPT-powered product descriptions
4. **Payment Gateway**: Stripe/Razorpay integration

### Phase 3: Scale
1. **Database**: MongoDB/PostgreSQL integration
2. **Real-time**: WebSocket notifications
3. **Mobile App**: React Native companion
4. **Admin Panel**: Content management system

## 📱 Mobile Experience

The application is fully responsive and provides an excellent mobile experience:
- Touch-friendly interface
- Optimized images and loading
- Mobile-first design approach
- Smooth animations on touch devices

## ♿ Accessibility

Built with accessibility in mind:
- Semantic HTML structure
- ARIA labels and roles
- Keyboard navigation support
- High contrast color schemes
- Screen reader compatibility

## 🐛 Troubleshooting

### Common Issues

1. **Frontend won't start**:
   ```bash
   cd frontend
   rm -rf node_modules package-lock.json
   npm install
   npm run dev
   ```

2. **Backend port conflict**:
   ```bash
   lsof -ti:3001 | xargs kill -9
   cd backend
   npm run dev
   ```

3. **Data not showing**:
   - Check JSON syntax in `/data` files
   - Verify file paths are correct
   - Check browser console for errors

## 📊 Performance

### Frontend Optimizations
- Next.js automatic code splitting
- Image optimization ready
- CSS purging with Tailwind
- Bundle size monitoring

### Backend Optimizations
- Lightweight Express setup
- Static JSON serving
- CORS optimization
- Error handling

## 📞 Support

### Getting Help
1. Check the README files in `/frontend` and `/backend`
2. Review the troubleshooting sections
3. Examine the data files for schema examples
4. Test API endpoints with curl

### Documentation
- Frontend: `/frontend/README.md`
- Backend: `/backend/README.md`
- API Documentation: Available at http://localhost:3001

## 🎯 MVP Goals Achieved

✅ **Frontend Application**: Complete Next.js app with all required pages
✅ **Component Library**: Reusable React components
✅ **Responsive Design**: Mobile-first approach
✅ **Animations**: Smooth Framer Motion transitions
✅ **Local Data**: JSON-based data management
✅ **Backend API**: Complete Express server with REST endpoints
✅ **Documentation**: Comprehensive setup and usage guides
✅ **Separation**: Frontend and backend work independently

## 🏗️ Architecture Decisions

### Why Frontend-Backend Separation?
1. **Independent Development**: Teams can work separately
2. **Demonstration**: Shows both components clearly
3. **Future Flexibility**: Easy to connect when ready
4. **Testing**: Both can be tested independently

### Why Local JSON Files?
1. **Simplicity**: No database setup required
2. **Rapid Prototyping**: Quick data changes
3. **Version Control**: Data changes tracked in Git
4. **Demonstration**: Clear data structure

## 📄 License

MIT License - see individual component README files for details.

---

**Stan It Care** - Empowering Indian Artisans Through Technology

*Built with ❤️ for artisans and their craft*