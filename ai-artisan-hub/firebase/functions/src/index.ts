import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { VertexAI } from '@google-cloud/aiplatform';
import { TranslationServiceClient } from '@google-cloud/translate';
import { SpeechClient } from '@google-cloud/speech';
import { ImageAnnotatorClient } from '@google-cloud/vision';

admin.initializeApp();

const db = admin.firestore();
const vertex = new VertexAI({
  project: process.env.GOOGLE_CLOUD_PROJECT_ID!,
  location: 'us-central1',
});

const translate = new TranslationServiceClient();
const speech = new SpeechClient();
const vision = new ImageAnnotatorClient();

// Generate AI content for products
export const generateProductContent = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'Must be authenticated');
  }

  const { productData, contentType, language = 'en' } = data;

  try {
    const model = vertex.preview.getGenerativeModel({
      model: 'gemini-pro',
    });

    let prompt = '';
    switch (contentType) {
      case 'title':
        prompt = `Generate a compelling product title for this handcrafted item: ${JSON.stringify(productData)}. Make it SEO-friendly and appealing to customers. Maximum 60 characters.`;
        break;
      case 'description':
        prompt = `Write a detailed product description for this handcrafted item: ${JSON.stringify(productData)}. Include materials, craftsmanship details, cultural significance, and benefits. Make it engaging and informative.`;
        break;
      case 'story':
        prompt = `Write a compelling artisan story about the creation of this product: ${JSON.stringify(productData)}. Include cultural background, traditional techniques, and the artisan's passion. Make it authentic and emotional.`;
        break;
      case 'social':
        prompt = `Create engaging social media captions for Instagram, Facebook, and Twitter for this product: ${JSON.stringify(productData)}. Include relevant hashtags and call-to-action.`;
        break;
      default:
        throw new Error('Invalid content type');
    }

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const generatedContent = response.text();

    // Store the generated content
    await db.collection('ai_generated_content').add({
      userId: context.auth.uid,
      contentType,
      originalPrompt: prompt,
      generatedContent,
      language,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    return { content: generatedContent };
  } catch (error) {
    console.error('Error generating content:', error);
    throw new functions.https.HttpsError('internal', 'Failed to generate content');
  }
});

// Translate text using Google Cloud Translation
export const translateText = functions.https.onCall(async (data, context) => {
  const { text, targetLanguage, sourceLanguage = 'auto' } = data;

  try {
    const projectId = process.env.GOOGLE_CLOUD_PROJECT_ID!;
    const location = 'global';

    const request = {
      parent: `projects/${projectId}/locations/${location}`,
      contents: [text],
      mimeType: 'text/plain',
      sourceLanguageCode: sourceLanguage,
      targetLanguageCode: targetLanguage,
    };

    const [response] = await translate.translateText(request);
    const translation = response.translations?.[0];

    // Cache translation
    if (context.auth) {
      await db.collection('translations').add({
        originalText: text,
        translatedText: translation?.translatedText || '',
        sourceLanguage: translation?.detectedLanguageCode || sourceLanguage,
        targetLanguage,
        userId: context.auth.uid,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      });
    }

    return {
      translatedText: translation?.translatedText || '',
      detectedLanguage: translation?.detectedLanguageCode || sourceLanguage,
    };
  } catch (error) {
    console.error('Error translating text:', error);
    throw new functions.https.HttpsError('internal', 'Failed to translate text');
  }
});

// Process speech to text for voice onboarding
export const speechToText = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'Must be authenticated');
  }

  const { audioContent, languageCode = 'en-US' } = data;

  try {
    const request = {
      audio: { content: audioContent },
      config: {
        encoding: 'WEBM_OPUS' as const,
        sampleRateHertz: 48000,
        languageCode,
        enableAutomaticPunctuation: true,
        enableWordTimeOffsets: true,
      },
    };

    const [response] = await speech.recognize(request);
    const transcription = response.results
      ?.map(result => result.alternatives?.[0]?.transcript)
      .join('\n') || '';

    return { transcription };
  } catch (error) {
    console.error('Error processing speech:', error);
    throw new functions.https.HttpsError('internal', 'Failed to process speech');
  }
});

// Analyze product images
export const analyzeProductImage = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'Must be authenticated');
  }

  const { imageUrl } = data;

  try {
    const [result] = await vision.annotateImage({
      image: { source: { imageUri: imageUrl } },
      features: [
        { type: 'LABEL_DETECTION', maxResults: 10 },
        { type: 'OBJECT_LOCALIZATION', maxResults: 10 },
        { type: 'IMAGE_PROPERTIES' },
        { type: 'SAFE_SEARCH_DETECTION' },
      ],
    });

    const labels = result.labelAnnotations?.map(label => ({
      description: label.description,
      score: label.score,
    })) || [];

    const objects = result.localizedObjectAnnotations?.map(obj => ({
      name: obj.name,
      score: obj.score,
    })) || [];

    const safeSearch = result.safeSearchAnnotation;
    const imageProperties = result.imagePropertiesAnnotation;

    return {
      labels,
      objects,
      safeSearch,
      imageProperties,
    };
  } catch (error) {
    console.error('Error analyzing image:', error);
    throw new functions.https.HttpsError('internal', 'Failed to analyze image');
  }
});

// Generate analytics insights
export const generateAnalytics = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'Must be authenticated');
  }

  const { artisanId, period = 'monthly' } = data;

  // Verify user owns this artisan profile
  const artisanDoc = await db.collection('artisans').doc(artisanId).get();
  if (!artisanDoc.exists || artisanDoc.data()?.userId !== context.auth.uid) {
    throw new functions.https.HttpsError('permission-denied', 'Access denied');
  }

  try {
    // Get sales data
    const ordersQuery = await db
      .collection('orders')
      .where('artisanId', '==', artisanId)
      .where('status', '==', 'completed')
      .get();

    const orders = ordersQuery.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    // Get product views
    const productsQuery = await db
      .collection('products')
      .where('artisanId', '==', artisanId)
      .get();

    const products = productsQuery.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    // Calculate metrics
    const totalSales = orders.length;
    const totalRevenue = orders.reduce((sum, order: any) => sum + order.totalAmount, 0);
    const totalViews = products.reduce((sum, product: any) => sum + (product.views || 0), 0);

    // Generate AI predictions
    const model = vertex.preview.getGenerativeModel({
      model: 'gemini-pro',
    });

    const analyticsPrompt = `
      Analyze this artisan's performance data and provide insights:
      - Total Sales: ${totalSales}
      - Total Revenue: $${totalRevenue}
      - Total Product Views: ${totalViews}
      - Number of Products: ${products.length}
      - Period: ${period}
      
      Provide:
      1. Performance insights
      2. Predicted next period sales (number)
      3. Trend direction (up/down/stable)
      4. Confidence level (0-100)
      5. Recommendations for improvement
    `;

    const result = await model.generateContent(analyticsPrompt);
    const response = await result.response;
    const insights = response.text();

    const analyticsData = {
      period,
      metrics: {
        sales: totalSales,
        revenue: totalRevenue,
        views: totalViews,
        orders: orders.length,
        products: products.length,
      },
      insights,
      generatedAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    // Store analytics
    await db.collection('analytics').doc(artisanId).set(analyticsData, { merge: true });

    return analyticsData;
  } catch (error) {
    console.error('Error generating analytics:', error);
    throw new functions.https.HttpsError('internal', 'Failed to generate analytics');
  }
});

// Handle new user registration
export const onUserCreate = functions.auth.user().onCreate(async (user) => {
  try {
    await db.collection('users').doc(user.uid).set({
      email: user.email,
      name: user.displayName || '',
      phoneNumber: user.phoneNumber || '',
      profileImage: user.photoURL || '',
      role: 'buyer', // Default role
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });
  } catch (error) {
    console.error('Error creating user document:', error);
  }
});

// Clean up user data on deletion
export const onUserDelete = functions.auth.user().onDelete(async (user) => {
  try {
    const batch = db.batch();

    // Delete user document
    batch.delete(db.collection('users').doc(user.uid));

    // Delete artisan profile if exists
    const artisanDoc = await db.collection('artisans').doc(user.uid).get();
    if (artisanDoc.exists) {
      batch.delete(artisanDoc.ref);
    }

    // Mark products as inactive
    const productsQuery = await db.collection('products').where('artisanId', '==', user.uid).get();
    productsQuery.docs.forEach(doc => {
      batch.update(doc.ref, { isActive: false });
    });

    await batch.commit();
  } catch (error) {
    console.error('Error cleaning up user data:', error);
  }
});