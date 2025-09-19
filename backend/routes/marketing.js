const express = require('express');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const router = express.Router();

// Initialize Google AI (you'll need to set GOOGLE_AI_API_KEY in .env)
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY || 'your-api-key-here');

// Generate product description using AI
router.post('/description', async (req, res) => {
  try {
    const { images, basicInfo } = req.body;

    if (!images || images.length === 0) {
      return res.status(400).json({ error: 'At least one image is required' });
    }

    // Create prompt for AI description generation
    const prompt = `
    Create a compelling product description for a handcrafted item based on the following information:
    
    Product Category: ${basicInfo?.category || 'Handcrafted Item'}
    Artisan Location: ${basicInfo?.location || 'India'}
    Price Range: ${basicInfo?.priceRange || 'Premium'}
    Target Audience: Art enthusiasts, cultural collectors, gift buyers
    
    Please generate:
    1. A catchy product title (max 60 characters)
    2. A short description (max 150 characters for product cards)
    3. A detailed description (2-3 paragraphs highlighting craftsmanship, cultural significance, and uniqueness)
    4. Key features (3-5 bullet points)
    5. Care instructions
    6. Gift recommendation text
    
    Make it authentic, emphasizing the artisan's skill and cultural heritage. Use warm, engaging language that connects with buyers emotionally.
    
    Format the response as JSON with the following structure:
    {
      "title": "...",
      "shortDescription": "...",
      "longDescription": "...",
      "features": ["...", "...", "..."],
      "careInstructions": "...",
      "giftText": "..."
    }
    `;

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    let generatedContent = response.text();

    // Try to parse JSON response
    try {
      // Clean up the response to extract JSON
      const jsonMatch = generatedContent.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        generatedContent = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('No JSON found in response');
      }
    } catch (parseError) {
      // If JSON parsing fails, create structured response manually
      generatedContent = {
        title: "Handcrafted Artisan Masterpiece",
        shortDescription: "Authentic handcrafted item showcasing traditional Indian artistry and cultural heritage.",
        longDescription: "This exquisite handcrafted piece represents the finest in traditional Indian artistry. Each item is meticulously created by skilled artisans who have inherited their craft through generations, ensuring authenticity and unparalleled quality. The intricate details and cultural significance make this not just a purchase, but an investment in preserving traditional craftsmanship.",
        features: [
          "100% handcrafted by traditional artisans",
          "Authentic materials and techniques",
          "Unique cultural significance",
          "Supporting artisan communities",
          "Premium quality craftsmanship"
        ],
        careInstructions: "Handle with care. Clean gently with soft cloth. Store in dry place away from direct sunlight.",
        giftText: "Perfect gift for art lovers, cultural enthusiasts, and anyone who appreciates authentic handcrafted beauty."
      };
    }

    res.json({
      success: true,
      generated: generatedContent,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Description generation error:', error);
    res.status(500).json({ 
      error: 'Failed to generate description',
      details: error.message 
    });
  }
});

// Generate complete marketing package
router.post('/package/:productId', async (req, res) => {
  try {
    const { productId } = req.params;
    
    // This would fetch product details from database
    const productInfo = {
      id: productId,
      category: 'Textiles', // Would come from database
      artisan: 'Traditional Artisan', // Would come from database
      location: 'India' // Would come from database
    };

    const prompt = `
    Create a complete marketing package for a handcrafted product:
    
    Product ID: ${productId}
    Category: ${productInfo.category}
    Artisan: ${productInfo.artisan}
    Location: ${productInfo.location}
    
    Generate:
    1. SEO-optimized product title
    2. Meta description for website
    3. Instagram post caption (with hashtags)
    4. Facebook post text
    5. WhatsApp sharing message
    6. Email marketing subject line
    7. Product story (emotional connection)
    8. Call-to-action texts
    
    Make it culturally authentic and emotionally engaging.
    
    Format as JSON with keys: seoTitle, metaDescription, instagramCaption, facebookPost, whatsappMessage, emailSubject, productStory, callToActions (array).
    `;

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    let marketingPackage = response.text();

    // Try to parse JSON response
    try {
      const jsonMatch = marketingPackage.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        marketingPackage = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('No JSON found in response');
      }
    } catch (parseError) {
      // Fallback structured response
      marketingPackage = {
        seoTitle: "Authentic Handcrafted Masterpiece - Traditional Indian Artistry",
        metaDescription: "Discover authentic handcrafted items made by traditional Indian artisans. Premium quality, cultural heritage, and unique artistry in every piece.",
        instagramCaption: "✨ Discover the magic of traditional craftsmanship! Each piece tells a story of heritage and skill. 🎨 #HandmadeInIndia #TraditionalCrafts #ArtisanMade #CulturalHeritage #SustainableShopping #IndianArt",
        facebookPost: "Support traditional artisans and bring home a piece of cultural heritage! Our handcrafted items are more than products - they're stories of skill, tradition, and artistry passed down through generations. Every purchase supports artisan communities and preserves ancient crafts.",
        whatsappMessage: "🎨 Check out this amazing handcrafted piece! Made by traditional Indian artisans with incredible skill and attention to detail. Perfect for art lovers and anyone who appreciates authentic craftsmanship. What do you think?",
        emailSubject: "Exclusive Handcrafted Treasures - Limited Artisan Collection",
        productStory: "Behind every piece lies a story of dedication, inherited skill, and cultural pride. Our artisans have mastered their craft through generations, creating not just products, but pieces of living heritage that connect us to India's rich artistic traditions.",
        callToActions: [
          "Shop Now - Limited Pieces Available",
          "Support Artisan Communities Today",
          "Add to Cart - Free Shipping",
          "Discover Your Cultural Connection",
          "Gift Authentic Artistry"
        ]
      };
    }

    res.json({
      success: true,
      productId: productId,
      marketingPackage,
      generatedAt: new Date().toISOString()
    });

  } catch (error) {
    console.error('Marketing package generation error:', error);
    res.status(500).json({ 
      error: 'Failed to generate marketing package',
      details: error.message 
    });
  }
});

module.exports = router;