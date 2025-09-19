// API service for connecting frontend to backend
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3005';

// Generic API request handler
async function apiRequest(endpoint: string, options: RequestInit = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const config: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, config);
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('API Request failed:', error);
    throw error;
  }
}

// Product API methods
export const productAPI = {
  // Get all products
  getAll: () => apiRequest('/api/products'),
  
  // Get product by slug
  getBySlug: (slug: string) => apiRequest(`/api/products/${slug}`),
  
  // Get products by category
  getByCategory: (category: string) => apiRequest(`/api/products?category=${category}`),
  
  // Upload product images and create product
  uploadProduct: async (formData: FormData) => {
    return apiRequest('/api/products/upload', {
      method: 'POST',
      headers: {}, // Don't set Content-Type for FormData
      body: formData,
    });
  },
  
  // Generate marketing content for product
  generateMarketing: (productId: string) => 
    apiRequest(`/api/products/${productId}/generate-marketing`, { method: 'POST' }),
};

// Artisan API methods
export const artisanAPI = {
  // Get all artisans
  getAll: () => apiRequest('/api/artisans'),
  
  // Get artisan by ID
  getById: (id: string) => apiRequest(`/api/artisans/${id}`),
  
  // Create new artisan profile
  create: (artisanData: any) => apiRequest('/api/artisans', {
    method: 'POST',
    body: JSON.stringify(artisanData),
  }),
  
  // Update artisan profile
  update: (id: string, artisanData: any) => apiRequest(`/api/artisans/${id}`, {
    method: 'PUT',
    body: JSON.stringify(artisanData),
  }),
};

// Image API methods
export const imageAPI = {
  // Upload multiple images
  uploadMultiple: async (formData: FormData) => {
    return apiRequest('/api/images/upload', {
      method: 'POST',
      headers: {}, // Don't set Content-Type for FormData
      body: formData,
    });
  },
  
  // Generate additional images using AI
  generateFromImages: (imageIds: string[]) => 
    apiRequest('/api/images/generate', {
      method: 'POST',
      body: JSON.stringify({ imageIds }),
    }),
};

// Social Media API methods
export const socialAPI = {
  // Generate social media posts
  generatePosts: (productId: string, platforms: string[]) =>
    apiRequest('/api/social/generate', {
      method: 'POST',
      body: JSON.stringify({ productId, platforms }),
    }),
  
  // Share to social platforms
  share: (postId: string, platform: string) =>
    apiRequest('/api/social/share', {
      method: 'POST',
      body: JSON.stringify({ postId, platform }),
    }),
};

// Marketing API methods
export const marketingAPI = {
  // Generate product description using AI
  generateDescription: (images: string[], basicInfo: any) =>
    apiRequest('/api/marketing/description', {
      method: 'POST',
      body: JSON.stringify({ images, basicInfo }),
    }),
  
  // Generate complete marketing package
  generatePackage: (productId: string) =>
    apiRequest(`/api/marketing/package/${productId}`, {
      method: 'POST',
    }),
};

export default {
  productAPI,
  artisanAPI,
  imageAPI,
  socialAPI,
  marketingAPI,
};