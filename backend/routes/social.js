const express = require('express');
const { v4: uuidv4 } = require('uuid');
const router = express.Router();

// Generate social media posts
router.post('/generate', async (req, res) => {
  try {
    const { productId, platforms } = req.body;

    if (!productId || !platforms || !Array.isArray(platforms)) {
      return res.status(400).json({ 
        error: 'Product ID and platforms array are required' 
      });
    }

    const supportedPlatforms = ['instagram', 'facebook', 'whatsapp', 'twitter'];
    const validPlatforms = platforms.filter(p => supportedPlatforms.includes(p.toLowerCase()));

    if (validPlatforms.length === 0) {
      return res.status(400).json({ 
        error: 'No valid platforms specified',
        supportedPlatforms 
      });
    }

    // Generate platform-specific posts
    const posts = {};

    for (const platform of validPlatforms) {
      const postId = uuidv4();
      
      switch (platform.toLowerCase()) {
        case 'instagram':
          posts.instagram = {
            id: postId,
            platform: 'instagram',
            content: {
              caption: "✨ Discover authentic handcrafted beauty! 🎨\n\nEach piece tells a story of tradition, skill, and cultural heritage. Made by talented Indian artisans who pour their heart into every detail.\n\n#HandmadeInIndia #TraditionalCrafts #ArtisanMade #CulturalHeritage #IndianArt #SustainableShopping #AuthenticCrafts #ArtLovers #HandcraftedWithLove #SupportArtisans",
              hashtags: ["#HandmadeInIndia", "#TraditionalCrafts", "#ArtisanMade", "#CulturalHeritage", "#IndianArt", "#SustainableShopping"],
              cta: "Shop now ➡️ Link in bio",
              imageAspectRatio: "1:1",
              storyVersion: "🎨 Authentic artisan crafts ✨ Swipe up to shop!"
            },
            shareUrl: `https://www.instagram.com/create/story/?media=${encodeURIComponent('product-image-url')}&caption=${encodeURIComponent('Authentic handcrafted beauty! 🎨')}`
          };
          break;

        case 'facebook':
          posts.facebook = {
            id: postId,
            platform: 'facebook',
            content: {
              text: "🎨 Support Traditional Artisans & Discover Authentic Beauty!\n\nEvery handcrafted piece in our collection tells a unique story of skill, tradition, and cultural pride. When you choose our artisan-made products, you're not just buying something beautiful – you're supporting talented craftspeople and helping preserve centuries-old traditions.\n\n✨ What makes our products special:\n• 100% handcrafted by skilled artisans\n• Authentic traditional techniques\n• Premium quality materials\n• Unique cultural significance\n• Supporting artisan communities\n\nBring home a piece of India's rich artistic heritage today!",
              cta: "Shop Now",
              linkDescription: "Explore our exclusive collection of handcrafted treasures",
              targetAudience: "Art enthusiasts, cultural collectors, conscious consumers"
            },
            shareUrl: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent('product-url')}`
          };
          break;

        case 'whatsapp':
          posts.whatsapp = {
            id: postId,
            platform: 'whatsapp',
            content: {
              message: "🎨 *Check out this incredible handcrafted piece!*\n\nMade by talented Indian artisans using traditional techniques passed down through generations. The attention to detail and cultural authenticity is absolutely stunning! ✨\n\n*Perfect for:*\n• Art lovers & collectors\n• Unique home decor\n• Meaningful gifts\n• Supporting artisan communities\n\nWhat do you think? Would love to hear your thoughts! 😊\n\n👆 Tap to see more details",
              mediaType: "image",
              businessMessage: true
            },
            shareUrl: `https://wa.me/?text=${encodeURIComponent('🎨 Check out this amazing handcrafted piece! Made by traditional Indian artisans. Perfect for art lovers! [product-url]')}`
          };
          break;

        case 'twitter':
          posts.twitter = {
            id: postId,
            platform: 'twitter',
            content: {
              tweet: "🎨 Authentic artisan crafts that tell stories of heritage & skill ✨\n\nSupport traditional Indian artisans & bring home unique handcrafted beauty\n\n#HandmadeInIndia #ArtisanMade #CulturalHeritage #SustainableShopping\n\n🛒 Shop now:",
              hashtags: ["#HandmadeInIndia", "#ArtisanMade", "#CulturalHeritage", "#SustainableShopping"],
              characterCount: 280,
              mediaAttachment: true
            },
            shareUrl: `https://twitter.com/intent/tweet?text=${encodeURIComponent('🎨 Authentic artisan crafts that tell stories of heritage & skill ✨')}&url=${encodeURIComponent('product-url')}&hashtags=HandmadeInIndia,ArtisanMade`
          };
          break;
      }
    }

    res.json({
      success: true,
      productId,
      posts,
      generatedAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // 24 hours
    });

  } catch (error) {
    console.error('Social media generation error:', error);
    res.status(500).json({ 
      error: 'Failed to generate social media posts',
      details: error.message 
    });
  }
});

// One-click share functionality
router.post('/share', async (req, res) => {
  try {
    const { postId, platform, productUrl, customMessage } = req.body;

    if (!postId || !platform) {
      return res.status(400).json({ 
        error: 'Post ID and platform are required' 
      });
    }

    const baseUrl = req.protocol + '://' + req.get('host');
    const fullProductUrl = productUrl || `${baseUrl}/products/${postId}`;

    let shareUrl;
    
    switch (platform.toLowerCase()) {
      case 'instagram':
        // Instagram doesn't support direct sharing via URL, provide instructions
        shareUrl = null;
        break;

      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(fullProductUrl)}&quote=${encodeURIComponent(customMessage || 'Check out this amazing handcrafted piece!')}`;
        break;

      case 'whatsapp':
        const whatsappText = customMessage || '🎨 Check out this incredible handcrafted piece! Made by talented Indian artisans. Perfect for art lovers!';
        shareUrl = `https://wa.me/?text=${encodeURIComponent(whatsappText + ' ' + fullProductUrl)}`;
        break;

      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(customMessage || '🎨 Authentic artisan crafts!')}&url=${encodeURIComponent(fullProductUrl)}&hashtags=HandmadeInIndia,ArtisanMade`;
        break;

      case 'linkedin':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(fullProductUrl)}`;
        break;

      case 'pinterest':
        shareUrl = `https://pinterest.com/pin/create/button/?url=${encodeURIComponent(fullProductUrl)}&description=${encodeURIComponent(customMessage || 'Beautiful handcrafted artisan piece')}`;
        break;

      default:
        return res.status(400).json({ 
          error: 'Unsupported platform',
          supportedPlatforms: ['facebook', 'whatsapp', 'twitter', 'linkedin', 'pinterest', 'instagram']
        });
    }

    const response = {
      success: true,
      postId,
      platform,
      shareUrl,
      sharedAt: new Date().toISOString()
    };

    // Special handling for Instagram
    if (platform.toLowerCase() === 'instagram') {
      response.instructions = {
        method: 'manual',
        steps: [
          '1. Save the product image to your device',
          '2. Open Instagram app',
          '3. Create a new post or story',
          '4. Upload the saved image',
          '5. Copy and paste the provided caption',
          '6. Add relevant hashtags and share!'
        ],
        caption: '✨ Discover authentic handcrafted beauty! 🎨 Each piece tells a story of tradition, skill, and cultural heritage. #HandmadeInIndia #TraditionalCrafts #ArtisanMade'
      };
    }

    res.json(response);

  } catch (error) {
    console.error('Social sharing error:', error);
    res.status(500).json({ 
      error: 'Failed to create share URL',
      details: error.message 
    });
  }
});

// Get social media analytics (placeholder)
router.get('/analytics/:productId', (req, res) => {
  const { productId } = req.params;
  
  // This would integrate with social media APIs to get real analytics
  res.json({
    productId,
    analytics: {
      totalShares: Math.floor(Math.random() * 100),
      platforms: {
        facebook: Math.floor(Math.random() * 30),
        whatsapp: Math.floor(Math.random() * 40),
        instagram: Math.floor(Math.random() * 50),
        twitter: Math.floor(Math.random() * 20)
      },
      engagement: {
        likes: Math.floor(Math.random() * 200),
        comments: Math.floor(Math.random() * 50),
        views: Math.floor(Math.random() * 1000)
      },
      periodStart: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      periodEnd: new Date().toISOString()
    },
    lastUpdated: new Date().toISOString()
  });
});

module.exports = router;