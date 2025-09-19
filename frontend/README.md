# Stan It Care Frontend

A Next.js-based frontend application for the Stan It Care artisan marketplace MVP. This application showcases handcrafted products from Indian artisans with a modern, responsive interface.

## 🚨 Important Note

**THE FRONTEND IS NOT CONNECTED TO THE BACKEND**

This frontend uses local JSON files for all data and does not make API calls to the backend. This is intentional for the MVP demonstration.

## ✨ Features

- **Home Page**: Hero section with featured products
- **Product Catalog**: Browse and filter products by category
- **Product Details**: Detailed product view with artisan information
- **Artisan Onboarding**: Multi-step form for artisan registration
- **Product Upload**: Form for artisans to add new products
- **Dashboard**: Analytics and order management
- **AR Preview**: Placeholder for future AR functionality
- **Responsive Design**: Works on desktop and mobile devices
- **Smooth Animations**: Powered by Framer Motion

## 🛠 Tech Stack

- **Framework**: Next.js 14
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Data Source**: Local JSON files in `/data`

## 📁 Project Structure

```
frontend/
├── components/           # Reusable React components
│   ├── Header.tsx       # Navigation header
│   ├── Footer.tsx       # Site footer
│   ├── ProductCard.tsx  # Product display card
│   ├── ProductList.tsx  # Product grid layout
│   ├── OnboardForm.tsx  # Artisan registration form
│   ├── UploadForm.tsx   # Product upload form
│   └── Modal.tsx        # Reusable modal component
├── pages/               # Next.js pages
│   ├── index.tsx        # Home page
│   ├── artisans/
│   │   └── onboard.tsx  # Artisan onboarding
│   ├── products/
│   │   ├── index.tsx    # Product catalog
│   │   └── [slug].tsx   # Product detail page
│   └── dashboard/
│       └── index.tsx    # Analytics dashboard
├── data/                # Local JSON data files
│   ├── artisans.json    # Artisan profiles
│   ├── products.json    # Product catalog
│   ├── orders.json      # Order history
│   └── dashboard.json   # Dashboard metrics
├── public/              # Static assets
│   └── images/          # Product and artisan images
└── styles/
    └── globals.css      # Global styles
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm
- Git

### Installation

1. **Navigate to the frontend directory**:
   ```bash
   cd frontend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Run the development server**:
   ```bash
   npm run dev
   ```

4. **Open your browser**:
   Navigate to [http://localhost:3000](http://localhost:3000)

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## 📊 Data Flow

The application uses local JSON files for all data:

- **Products**: Loaded from `/data/products.json`
- **Artisans**: Loaded from `/data/artisans.json`
- **Orders**: Loaded from `/data/orders.json`
- **Dashboard**: Loaded from `/data/dashboard.json`

### Example API Integration (Not Used)

For future reference, here's how you would fetch from the backend:

```typescript
// Example - NOT IMPLEMENTED
const fetchProducts = async () => {
  const response = await fetch('http://localhost:3001/api/products');
  const data = await response.json();
  return data;
};
```

## 🎨 UI Components

### ProductCard
Displays product information in a card format with:
- Product image placeholder
- Title and description
- Price formatting
- Category badge
- Stock status

### OnboardForm
Multi-step artisan registration with:
- Basic information (name, language, location)
- Story/bio section with voice recording placeholder
- Profile photo upload
- Form validation

### Dashboard
Analytics interface featuring:
- Sales metrics cards
- Monthly sales chart (SVG-based)
- Recent orders table
- Order status tracking

## 🔧 Customization

### Adding New Products

Edit `/data/products.json`:

```json
{
  "id": "prod_new",
  "title": "New Product",
  "slug": "new-product",
  "shortDescription": "Brief description",
  "longDescription": "Detailed description",
  "price": 1000,
  "currency": "INR",
  "images": ["/images/products/new-product.jpg"],
  "artisanId": "artisan_1",
  "category": "Category",
  "createdAt": "2025-01-01",
  "stock": 10
}
```

### Styling

The application uses Tailwind CSS with custom color schemes:

- **Primary**: Orange tones for main actions
- **Secondary**: Blue tones for secondary actions
- **Gray**: Various shades for text and backgrounds

Modify `tailwind.config.js` to change the color scheme.

## ♿ Accessibility

- Semantic HTML structure
- ARIA labels on interactive elements
- Keyboard navigation support
- Color contrast compliance
- Screen reader friendly

### Accessibility Checklist

- [x] Semantic HTML elements
- [x] Alt text for images (placeholders)
- [x] ARIA labels for buttons and forms
- [x] Keyboard navigation
- [x] Focus indicators
- [x] Color contrast ratios
- [ ] Screen reader testing (recommended)

## 🧪 Testing

Basic component tests are included:

```bash
npm test
```

Test files are located alongside components with `.test.tsx` extension.

## 📱 Responsive Design

The application is fully responsive with breakpoints:

- **Mobile**: 320px - 768px
- **Tablet**: 768px - 1024px
- **Desktop**: 1024px+

## 🎯 Future Enhancements

1. **Backend Integration**: Connect to the Express API
2. **User Authentication**: Login/logout functionality
3. **Real Image Upload**: File storage integration
4. **AR Preview**: WebAR implementation
5. **Payment Gateway**: Stripe/Razorpay integration
6. **Real-time Updates**: WebSocket implementation
7. **PWA Features**: Offline support
8. **Advanced Search**: Elasticsearch integration

## 🔒 Environment Variables

Create a `.env.local` file for environment-specific settings:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_UPLOAD_URL=/api/upload
```

## 🐛 Troubleshooting

### Common Issues

1. **Port Already in Use**:
   ```bash
   lsof -ti:3000 | xargs kill -9
   ```

2. **Dependency Issues**:
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

3. **TypeScript Errors**:
   ```bash
   npm run type-check
   ```

## 📞 Support

For issues and questions:
- Check the troubleshooting section
- Review the project structure
- Examine the data files in `/data`

---

## 📄 License

MIT License - see LICENSE file for details.

---

**Remember**: This frontend is designed to work independently with local data. The backend exists but is not connected to this frontend application.