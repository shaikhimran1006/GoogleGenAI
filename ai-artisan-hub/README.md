# AI Artisan Hub - Marketplace for Local Artisans

A comprehensive AI-powered marketplace that connects local artisans with global customers, featuring voice-first onboarding, multilingual support, and intelligent product recommendations using Google Cloud technologies.

## 🌟 Features

### 🎯 Core Features
- **Voice-First Onboarding**: Google Cloud Speech-to-Text for easy artisan registration
- **AI Content Generation**: Auto-generate product titles, descriptions, and cultural stories using Vertex AI
- **Multilingual Support**: Real-time translation with Google Cloud Translation API
- **Image Enhancement**: Google Cloud Vision API for photo quality checks
- **AR Product Preview**: Support for 3D model viewing with Google Scene Viewer
- **Progressive Web App**: Offline functionality and app-like experience

### 💳 Commerce Features
- **Payment Integration**: Razorpay and Google Pay UPI support
- **Order Management**: End-to-end order lifecycle with Firebase Functions
- **Analytics Dashboard**: AI-driven insights and sales predictions
- **Social Media Integration**: Auto-generated social media content

### 🔧 Technical Features
- **Firebase Authentication**: Email, phone, and Google login
- **Real-time Updates**: Firebase Firestore for live notifications
- **Cloud Storage**: Firebase Storage for product images
- **Serverless Functions**: Firebase Functions for backend logic

## 🚀 Quick Start

### Prerequisites

Before you begin, ensure you have the following installed:
- [Node.js](https://nodejs.org/) (v18 or higher)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- [Firebase CLI](https://firebase.google.com/docs/cli)
- [Google Cloud SDK](https://cloud.google.com/sdk)

### 🔑 Google Cloud Setup

1. **Create a Google Cloud Project**
   ```bash
   gcloud projects create ai-artisan-hub --name="AI Artisan Hub"
   gcloud config set project ai-artisan-hub
   ```

2. **Enable Required APIs**
   ```bash
   gcloud services enable aiplatform.googleapis.com
   gcloud services enable translate.googleapis.com
   gcloud services enable speech.googleapis.com
   gcloud services enable vision.googleapis.com
   gcloud services enable firebase.googleapis.com
   ```

3. **Create Service Account**
   ```bash
   gcloud iam service-accounts create ai-artisan-hub-sa --display-name="AI Artisan Hub Service Account"
   gcloud iam service-accounts keys create ./service-account-key.json --iam-account=ai-artisan-hub-sa@ai-artisan-hub.iam.gserviceaccount.com
   ```

4. **Grant Required Permissions**
   ```bash
   gcloud projects add-iam-policy-binding ai-artisan-hub --member="serviceAccount:ai-artisan-hub-sa@ai-artisan-hub.iam.gserviceaccount.com" --role="roles/aiplatform.user"
   gcloud projects add-iam-policy-binding ai-artisan-hub --member="serviceAccount:ai-artisan-hub-sa@ai-artisan-hub.iam.gserviceaccount.com" --role="roles/cloudtranslate.user"
   gcloud projects add-iam-policy-binding ai-artisan-hub --member="serviceAccount:ai-artisan-hub-sa@ai-artisan-hub.iam.gserviceaccount.com" --role="roles/speech.client"
   gcloud projects add-iam-policy-binding ai-artisan-hub --member="serviceAccount:ai-artisan-hub-sa@ai-artisan-hub.iam.gserviceaccount.com" --role="roles/vision.imageAnnotator"
   ```

### 🔥 Firebase Setup

1. **Create Firebase Project**
   ```bash
   firebase login
   firebase projects:create ai-artisan-hub
   firebase use ai-artisan-hub
   ```

2. **Initialize Firebase Services**
   ```bash
   cd firebase
   firebase init
   # Select: Firestore, Functions, Hosting, Storage
   # Choose existing project: ai-artisan-hub
   # Accept defaults for most options
   ```

3. **Deploy Security Rules**
   ```bash
   firebase deploy --only firestore:rules,storage:rules
   ```

### 📦 Installation

1. **Clone and Setup**
   ```bash
   git clone <repository-url>
   cd ai-artisan-hub
   npm run install:all
   ```

2. **Environment Configuration**
   ```bash
   cp .env.example .env
   # Fill in your configuration values (see Environment Variables section)
   ```

3. **Build and Start**
   ```bash
   # Development mode
   npm run dev

   # Production build
   npm run build
   npm start
   ```

## 🔧 Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=ai-artisan-hub.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=ai-artisan-hub
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=ai-artisan-hub.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_firebase_app_id

# Google Cloud Configuration
GOOGLE_CLOUD_PROJECT_ID=ai-artisan-hub
GOOGLE_APPLICATION_CREDENTIALS=./service-account-key.json
VERTEX_AI_PROJECT_ID=ai-artisan-hub
VERTEX_AI_LOCATION=us-central1

# Payment Configuration
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret

# Backend Configuration
NODE_ENV=development
PORT=3001
JWT_SECRET=your_jwt_secret_key
FRONTEND_URL=http://localhost:3000
```

## 🏗️ Project Structure

```
ai-artisan-hub/
├── frontend/                 # Next.js React application
│   ├── src/
│   │   ├── app/             # App Router pages
│   │   ├── components/      # Reusable React components
│   │   ├── hooks/           # Custom React hooks
│   │   ├── lib/             # Utility libraries and configurations
│   │   ├── types/           # TypeScript type definitions
│   │   └── utils/           # Helper functions
│   ├── public/              # Static assets
│   └── package.json
├── backend/                 # Express.js API server
│   ├── src/
│   │   ├── routes/          # API route handlers
│   │   ├── middleware/      # Express middleware
│   │   ├── services/        # Business logic services
│   │   ├── types/           # TypeScript interfaces
│   │   └── index.ts         # Server entry point
│   └── package.json
├── firebase/                # Firebase configuration and functions
│   ├── functions/           # Cloud Functions
│   ├── firestore.rules      # Firestore security rules
│   ├── storage.rules        # Cloud Storage security rules
│   └── firebase.json        # Firebase configuration
├── .env.example             # Environment variables template
├── package.json             # Root package.json with scripts
└── README.md               # This file
```

## 🛠️ Development

### Frontend Development
```bash
cd frontend
npm run dev
# Runs on http://localhost:3000
```

### Backend Development
```bash
cd backend
npm run dev
# Runs on http://localhost:3001
```

### Firebase Functions Development
```bash
cd firebase/functions
npm run serve
# Runs Firebase emulator
```

## 🚀 Deployment

### Deploy to Firebase Hosting
```bash
# Build frontend
cd frontend
npm run build
npm run export

# Deploy everything
cd ../firebase
firebase deploy
```

### Deploy Backend to Google Cloud Run
```bash
cd backend
npm run build

# Create Docker image (create Dockerfile first)
gcloud builds submit --tag gcr.io/ai-artisan-hub/backend

# Deploy to Cloud Run
gcloud run deploy backend \
  --image gcr.io/ai-artisan-hub/backend \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated
```

## 🧪 Testing

### Frontend Testing
```bash
cd frontend
npm test
```

### Backend Testing
```bash
cd backend
npm test
```

### Firebase Functions Testing
```bash
cd firebase/functions
npm test
```

## 📱 API Documentation

### Authentication Endpoints
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/profile` - Get user profile

### Product Endpoints
- `GET /api/products` - Get all products
- `POST /api/products` - Create new product
- `GET /api/products/:id` - Get product by ID
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product

### AI Endpoints
- `POST /api/ai/generate-content` - Generate product content
- `POST /api/ai/translate` - Translate text
- `POST /api/ai/speech-to-text` - Convert speech to text
- `POST /api/ai/analyze-image` - Analyze product images

### Payment Endpoints
- `POST /api/payments/create-order` - Create payment order
- `POST /api/payments/verify` - Verify payment
- `GET /api/payments/orders` - Get payment orders

## 🔒 Security

### Firebase Security Rules
- **Firestore**: Users can only access their own data
- **Storage**: Users can only upload to their own folders
- **Functions**: Authenticated access for sensitive operations

### API Security
- **Helmet.js**: Security headers
- **CORS**: Cross-origin request protection
- **Rate Limiting**: API rate limiting (implement with express-rate-limit)
- **Input Validation**: Request validation middleware

## 🌐 Internationalization

The application supports multiple languages through Google Cloud Translation API:

- **Hindi** (hi)
- **English** (en)
- **Bengali** (bn)
- **Tamil** (ta)
- **Telugu** (te)
- **Marathi** (mr)
- **Gujarati** (gu)
- **Kannada** (kn)
- **Malayalam** (ml)
- **Punjabi** (pa)

## 📊 Analytics and Monitoring

### Built-in Analytics
- Sales performance tracking
- Product view analytics
- User engagement metrics
- AI-generated insights and predictions

### Google Cloud Monitoring
- Application performance monitoring
- Error tracking and alerting
- Resource usage optimization

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📋 Todo / Roadmap

- [ ] Implement AR product preview with Scene Viewer
- [ ] Add social media auto-posting functionality
- [ ] Implement real-time chat between buyers and artisans
- [ ] Add advanced search with AI-powered recommendations
- [ ] Implement inventory management system
- [ ] Add multi-vendor marketplace features
- [ ] Implement loyalty program and rewards
- [ ] Add advanced analytics dashboard

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Google Cloud Platform** for AI/ML services
- **Firebase** for backend infrastructure
- **Next.js** for the amazing React framework
- **Tailwind CSS** for beautiful styling
- **Framer Motion** for smooth animations

## 📞 Support

For support, email support@aiartisanhub.com or join our [Discord community](https://discord.gg/aiartisanhub).

## 🔗 Links

- [Live Demo](https://ai-artisan-hub.web.app)
- [API Documentation](https://api.aiartisanhub.com/docs)
- [User Guide](https://docs.aiartisanhub.com)
- [Community Forum](https://community.aiartisanhub.com)

---

**Built with ❤️ for local artisans and their amazing crafts**