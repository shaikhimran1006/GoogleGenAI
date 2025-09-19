const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const sharp = require('sharp');
const router = express.Router();

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueName = uuidv4() + path.extname(file.originalname);
    cb(null, uniqueName);
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});

// Upload multiple images
router.post('/upload', upload.array('images', 10), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'No images uploaded' });
    }

    const processedImages = [];

    for (const file of req.files) {
      // Process image with Sharp (resize, optimize)
      const optimizedPath = path.join(uploadsDir, 'optimized_' + file.filename);
      
      await sharp(file.path)
        .resize(800, 600, { 
          fit: 'inside',
          withoutEnlargement: true 
        })
        .jpeg({ quality: 85 })
        .toFile(optimizedPath);

      processedImages.push({
        id: uuidv4(),
        originalName: file.originalname,
        filename: file.filename,
        optimizedFilename: 'optimized_' + file.filename,
        size: file.size,
        mimetype: file.mimetype,
        path: `/uploads/${file.filename}`,
        optimizedPath: `/uploads/optimized_${file.filename}`,
        uploadedAt: new Date().toISOString()
      });
    }

    res.json({
      success: true,
      message: `${processedImages.length} images uploaded successfully`,
      images: processedImages
    });

  } catch (error) {
    console.error('Image upload error:', error);
    res.status(500).json({ 
      error: 'Failed to upload images',
      details: error.message 
    });
  }
});

// Generate additional images using AI (placeholder for now)
router.post('/generate', async (req, res) => {
  try {
    const { imageIds, style = 'marketing', count = 3 } = req.body;

    if (!imageIds || !Array.isArray(imageIds)) {
      return res.status(400).json({ error: 'Image IDs array is required' });
    }

    // For now, return mock generated images
    // In a real implementation, this would use AI services like DALL-E, Midjourney, etc.
    const generatedImages = [];
    
    for (let i = 0; i < count; i++) {
      generatedImages.push({
        id: uuidv4(),
        originalImageId: imageIds[0], // Reference to source image
        style: style,
        filename: `generated_${uuidv4()}.jpg`,
        path: `/uploads/generated_${uuidv4()}.jpg`,
        status: 'processing', // In real implementation: processing -> completed
        createdAt: new Date().toISOString()
      });
    }

    res.json({
      success: true,
      message: 'AI image generation started',
      generatedImages,
      estimatedTime: '2-3 minutes'
    });

  } catch (error) {
    console.error('AI generation error:', error);
    res.status(500).json({ 
      error: 'Failed to generate images',
      details: error.message 
    });
  }
});

// Get image by ID
router.get('/:imageId', (req, res) => {
  const { imageId } = req.params;
  
  // This would typically fetch from database
  // For now, return a placeholder response
  res.json({
    id: imageId,
    status: 'completed',
    path: `/uploads/sample_${imageId}.jpg`,
    createdAt: new Date().toISOString()
  });
});

module.exports = router;