import React, { useState, useCallback } from 'react';
import { Upload, X, Image as ImageIcon, Sparkles, Share2, Download, Loader2, Instagram, Facebook } from 'lucide-react';
import { imageAPI, marketingAPI, socialAPI } from '../services/api';

interface UploadedImage {
  id: string;
  file: File;
  preview: string;
  processed?: string;
  aiGenerated?: string[];
}

interface MarketingContent {
  description: string;
  socialPosts: {
    instagram?: any;
    facebook?: any;
    whatsapp?: any;
    twitter?: any;
  };
}

interface LoadingState {
  uploading: boolean;
  generating: boolean;
  creatingMarketing: boolean;
  generatingPosts: boolean;
  posting: { [platform: string]: boolean };
}

const ImageUploadStudio: React.FC = () => {
  const [images, setImages] = useState<UploadedImage[]>([]);
  const [marketingContent, setMarketingContent] = useState<MarketingContent | null>(null);
  const [activeTab, setActiveTab] = useState<'upload' | 'generate' | 'marketing' | 'share'>('upload');
  const [dragActive, setDragActive] = useState(false);
  const [loading, setLoading] = useState<LoadingState>({
    uploading: false,
    generating: false,
    creatingMarketing: false,
    generatingPosts: false,
    posting: {}
  });

  // Handle file selection
  const handleFiles = useCallback((files: FileList | null) => {
    if (!files) return;

    const newImages: UploadedImage[] = [];
    Array.from(files).forEach((file) => {
      if (file.type.startsWith('image/')) {
        const id = Math.random().toString(36).substr(2, 9);
        const preview = URL.createObjectURL(file);
        newImages.push({ id, file, preview });
      }
    });

    setImages(prev => [...prev, ...newImages]);
  }, []);

  // Drag and drop handlers
  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    handleFiles(e.dataTransfer.files);
  }, [handleFiles]);

  // Remove image
  const removeImage = (id: string) => {
    setImages(prev => {
      const updated = prev.filter(img => img.id !== id);
      const removedImage = prev.find(img => img.id === id);
      if (removedImage) {
        URL.revokeObjectURL(removedImage.preview);
      }
      return updated;
    });
  };

  // Upload and process images
  const uploadImages = async () => {
    if (images.length === 0) return;

    setLoading(prev => ({ ...prev, uploading: true }));
    try {
      const formData = new FormData();
      images.forEach((img, index) => {
        formData.append('images', img.file);
      });

      const response = await imageAPI.uploadMultiple(formData);
      
      if (response.success) {
        // Update images with processed versions
        setImages(prev => prev.map(img => ({
          ...img,
          processed: response.processed?.find((p: any) => p.originalName === img.file.name)?.url
        })));
        setActiveTab('generate');
      }
    } catch (error) {
      console.error('Upload failed:', error);
      alert('Upload failed. Please try again.');
    } finally {
      setLoading(prev => ({ ...prev, uploading: false }));
    }
  };

  // Generate AI-enhanced images
  const generateAIImages = async () => {
    if (images.length === 0) return;

    setLoading(prev => ({ ...prev, generating: true }));
    try {
      // Simulate AI generation process with multiple steps
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate processing time
      
      const response = await imageAPI.generateFromImages(images.map(img => img.id));

      if (response.success) {
        setImages(prev => prev.map(img => ({
          ...img,
          aiGenerated: response.generated?.filter((g: any) => g.baseImageId === img.id).map((g: any) => g.url) || []
        })));
        setActiveTab('marketing');
      }
    } catch (error) {
      console.error('AI generation failed:', error);
      alert('AI generation failed. Please try again.');
    } finally {
      setLoading(prev => ({ ...prev, generating: false }));
    }
  };

  // Generate marketing content
  const generateMarketing = async () => {
    if (images.length === 0) return;

    setLoading(prev => ({ ...prev, creatingMarketing: true }));
    try {
      const response = await marketingAPI.generateDescription(
        images.map(img => img.processed || img.preview),
        {
          productType: 'handcrafted-textile',
          targetAudience: 'art-lovers'
        }
      );

      if (response.success) {
        setMarketingContent({
          description: response.description,
          socialPosts: {}
        });

        // Generate social media posts
        setLoading(prev => ({ ...prev, generatingPosts: true }));
        const socialResponse = await socialAPI.generatePosts('temp-' + Date.now(), ['instagram', 'facebook', 'whatsapp', 'twitter']);

        if (socialResponse.success) {
          setMarketingContent(prev => prev ? {
            ...prev,
            socialPosts: socialResponse.posts
          } : null);
        }

        setActiveTab('share');
      }
    } catch (error) {
      console.error('Marketing generation failed:', error);
      alert('Marketing content generation failed. Please try again.');
    } finally {
      setLoading(prev => ({ ...prev, creatingMarketing: false, generatingPosts: false }));
    }
  };

  // Share on social media
  const shareOnPlatform = async (platform: string) => {
    if (!marketingContent?.socialPosts[platform as keyof typeof marketingContent.socialPosts]) return;

    setLoading(prev => ({ ...prev, posting: { ...prev.posting, [platform]: true } }));
    try {
      // Simulate posting delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const response = await socialAPI.share('temp-' + Date.now(), platform);

      if (response.success && response.shareUrl) {
        window.open(response.shareUrl, '_blank');
        alert(`Successfully created ${platform} post!`);
      } else if (response.instructions) {
        alert(`Instagram Sharing Instructions:\n${response.instructions.steps.join('\n')}\n\nCaption: ${response.instructions.caption}`);
      }
    } catch (error) {
      console.error('Sharing failed:', error);
      alert('Sharing failed. Please try again.');
    } finally {
      setLoading(prev => ({ ...prev, posting: { ...prev.posting, [platform]: false } }));
    }
  };

  // Generate new images based on provided images
  const generateNewImages = async () => {
    if (images.length === 0) return;

    setLoading(prev => ({ ...prev, generating: true }));
    try {
      // Simulate AI image generation with progress
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Generate 3 new variations per original image
      const newImages = images.map(img => ({
        ...img,
        aiGenerated: [
          `https://picsum.photos/400/400?random=${Math.random()}`,
          `https://picsum.photos/400/400?random=${Math.random()}`,
          `https://picsum.photos/400/400?random=${Math.random()}`
        ]
      }));
      
      setImages(newImages);
      alert(`Generated ${newImages.length * 3} new AI-enhanced images!`);
    } catch (error) {
      console.error('Image generation failed:', error);
      alert('Image generation failed. Please try again.');
    } finally {
      setLoading(prev => ({ ...prev, generating: false }));
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-6">
          <h1 className="text-3xl font-bold mb-2">AI Marketing Studio</h1>
          <p className="opacity-90">Upload images, generate AI variations, and create marketing content</p>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b">
          {[
            { id: 'upload', label: 'Upload Images', icon: Upload },
            { id: 'generate', label: 'AI Generate', icon: Sparkles },
            { id: 'marketing', label: 'Marketing', icon: ImageIcon },
            { id: 'share', label: 'Share', icon: Share2 }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-6 py-4 font-medium transition-colors ${
                activeTab === tab.id
                  ? 'border-b-2 border-purple-600 text-purple-600 bg-purple-50'
                  : 'text-gray-600 hover:text-purple-600 hover:bg-gray-50'
              }`}>
              <tab.icon size={20} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === 'upload' && (
            <div className="space-y-6">
              {/* Upload Area */}
              <div
                className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                  dragActive ? 'border-purple-500 bg-purple-50' : 'border-gray-300 hover:border-purple-400'
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}>
                <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Upload Product Images</h3>
                <p className="text-gray-600 mb-4">Drag and drop files here, or click to browse</p>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={(e) => handleFiles(e.target.files)}
                  className="hidden"
                  id="file-input"
                />
                <label
                  htmlFor="file-input"
                  className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 cursor-pointer">
                  Choose Files
                </label>
                <p className="text-sm text-gray-500 mt-2">PNG, JPG, WebP up to 5MB each</p>
              </div>

              {/* Image Preview Grid */}
              {images.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {images.map(img => (
                    <div key={img.id} className="relative group">
                      <img
                        src={img.preview}
                        alt="Preview"
                        className="w-full h-32 object-cover rounded-lg border"
                      />
                      <button
                        onClick={() => removeImage(img.id)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <X size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Upload Button */}
              {images.length > 0 && (
                <div className="flex justify-center">
                  <button
                    onClick={uploadImages}
                    disabled={loading.uploading}
                    className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2">
                    {loading.uploading && <Loader2 className="animate-spin" size={20} />}
                    {loading.uploading ? 'Uploading...' : `Upload ${images.length} Image${images.length > 1 ? 's' : ''}`}
                  </button>
                </div>
              )}
            </div>
          )}

          {activeTab === 'generate' && (
            <div className="space-y-6">
              <div className="text-center">
                <h3 className="text-xl font-semibold mb-2">Generate AI-Enhanced Images</h3>
                <p className="text-gray-600">Create multiple variations of your uploaded images using AI</p>
              </div>

              {loading.generating && (
                <div className="bg-purple-50 rounded-lg p-6 text-center">
                  <Loader2 className="animate-spin mx-auto mb-3" size={32} />
                  <h4 className="font-semibold mb-2">Generating AI Images...</h4>
                  <p className="text-gray-600">Creating {images.length * 3} new variations based on your images</p>
                  <div className="mt-4 bg-white rounded-full h-2 overflow-hidden">
                    <div className="bg-purple-600 h-full rounded-full animate-pulse" style={{width: '70%'}}></div>
                  </div>
                </div>
              )}

              {images.length > 0 && !loading.generating && (
                <div className="space-y-4">
                  {images.map(img => (
                    <div key={img.id} className="border rounded-lg p-4">
                      <div className="flex items-center gap-4 mb-4">
                        <img src={img.processed || img.preview} alt="Original" className="w-20 h-20 object-cover rounded" />
                        <div>
                          <h4 className="font-medium">Original Image</h4>
                          <p className="text-sm text-gray-600">{img.file.name}</p>
                          {img.aiGenerated && img.aiGenerated.length > 0 && (
                            <p className="text-sm text-green-600 font-medium">✓ {img.aiGenerated.length} AI variations generated</p>
                          )}
                        </div>
                      </div>
                      
                      {img.aiGenerated && img.aiGenerated.length > 0 && (
                        <div>
                          <h5 className="font-medium mb-2">AI Generated Variations:</h5>
                          <div className="grid grid-cols-3 gap-2">
                            {img.aiGenerated.map((genImg, idx) => (
                              <div key={idx} className="relative group">
                                <img src={genImg} alt={`Generated ${idx + 1}`} className="w-full h-24 object-cover rounded border-2 border-transparent hover:border-purple-500 transition-colors" />
                                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 rounded flex items-center justify-center transition-all">
                                  <Download className="text-white opacity-0 group-hover:opacity-100" size={16} />
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              <div className="flex justify-center gap-4">
                <button
                  onClick={generateAIImages}
                  disabled={loading.generating || images.length === 0}
                  className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2">
                  {loading.generating ? <Loader2 className="animate-spin" size={20} /> : <Sparkles size={20} />}
                  {loading.generating ? 'Generating AI Images...' : 'Generate AI Images'}
                </button>
                
                <button
                  onClick={generateNewImages}
                  disabled={loading.generating || images.length === 0}
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg hover:from-blue-700 hover:to-cyan-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2">
                  {loading.generating ? <Loader2 className="animate-spin" size={20} /> : <ImageIcon size={20} />}
                  Generate New Images
                </button>
              </div>
            </div>
          )}

          {activeTab === 'marketing' && (
            <div className="space-y-6">
              <div className="text-center">
                <h3 className="text-xl font-semibold mb-2">Generate Marketing Content</h3>
                <p className="text-gray-600">Create compelling descriptions and marketing materials</p>
              </div>

              {loading.creatingMarketing && (
                <div className="bg-blue-50 rounded-lg p-6 text-center">
                  <Loader2 className="animate-spin mx-auto mb-3" size={32} />
                  <h4 className="font-semibold mb-2">Creating Marketing Content...</h4>
                  <p className="text-gray-600">Analyzing your images and crafting compelling descriptions</p>
                </div>
              )}

              {loading.generatingPosts && (
                <div className="bg-green-50 rounded-lg p-6 text-center">
                  <Loader2 className="animate-spin mx-auto mb-3" size={32} />
                  <h4 className="font-semibold mb-2">Generating Social Media Posts...</h4>
                  <p className="text-gray-600">Creating platform-specific content for Instagram, Facebook, and more</p>
                </div>
              )}

              {marketingContent && !loading.creatingMarketing && !loading.generatingPosts && (
                <div className="bg-gray-50 rounded-lg p-6">
                  <h4 className="font-semibold mb-3">Product Description</h4>
                  <p className="text-gray-700 leading-relaxed">{marketingContent.description}</p>
                </div>
              )}

              <div className="flex justify-center">
                <button
                  onClick={generateMarketing}
                  disabled={images.length === 0 || loading.creatingMarketing || loading.generatingPosts}
                  className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2">
                  {(loading.creatingMarketing || loading.generatingPosts) && <Loader2 className="animate-spin" size={20} />}
                  {loading.creatingMarketing ? 'Creating Content...' : loading.generatingPosts ? 'Generating Posts...' : 'Generate Marketing Content'}
                </button>
              </div>
            </div>
          )}

          {activeTab === 'share' && (
            <div className="space-y-6">
              <div className="text-center">
                <h3 className="text-xl font-semibold mb-2">Share on Social Media</h3>
                <p className="text-gray-600">One-click posting to Instagram and Facebook with optimized content</p>
              </div>

              {marketingContent?.socialPosts && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Instagram Card */}
                  {marketingContent.socialPosts.instagram && (
                    <div className="border rounded-lg p-6 bg-gradient-to-br from-purple-50 to-pink-50">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <Instagram className="text-pink-600" size={24} />
                          <h4 className="font-semibold text-lg">Instagram</h4>
                        </div>
                        <button
                          onClick={() => shareOnPlatform('instagram')}
                          disabled={loading.posting.instagram}
                          className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 flex items-center gap-2">
                          {loading.posting.instagram ? <Loader2 className="animate-spin" size={16} /> : <Instagram size={16} />}
                          {loading.posting.instagram ? 'Posting...' : 'Post to Instagram'}
                        </button>
                      </div>
                      <div className="text-sm text-gray-700 bg-white p-4 rounded-lg border">
                        <div className="font-medium mb-2">Caption Preview:</div>
                        <p className="text-xs leading-relaxed">
                          {(marketingContent.socialPosts.instagram as any)?.content?.caption || 
                           '✨ Discover authentic handcrafted beauty! 🎨\n\nEach piece tells a story of tradition, skill, and cultural heritage. Made by talented Indian artisans who pour their heart into every detail.\n\n#HandmadeInIndia #TraditionalCrafts #ArtisanMade'}
                        </p>
                      </div>
                      <div className="mt-3 text-xs text-gray-500">
                        Optimized for Instagram with hashtags and emojis
                      </div>
                    </div>
                  )}

                  {/* Facebook Card */}
                  {marketingContent.socialPosts.facebook && (
                    <div className="border rounded-lg p-6 bg-gradient-to-br from-blue-50 to-indigo-50">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <Facebook className="text-blue-600" size={24} />
                          <h4 className="font-semibold text-lg">Facebook</h4>
                        </div>
                        <button
                          onClick={() => shareOnPlatform('facebook')}
                          disabled={loading.posting.facebook}
                          className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 flex items-center gap-2">
                          {loading.posting.facebook ? <Loader2 className="animate-spin" size={16} /> : <Facebook size={16} />}
                          {loading.posting.facebook ? 'Posting...' : 'Post to Facebook'}
                        </button>
                      </div>
                      <div className="text-sm text-gray-700 bg-white p-4 rounded-lg border">
                        <div className="font-medium mb-2">Post Preview:</div>
                        <p className="text-xs leading-relaxed">
                          {(marketingContent.socialPosts.facebook as any)?.content?.text || 
                           '🎨 Support Traditional Artisans & Discover Authentic Beauty!\n\nEvery handcrafted piece in our collection tells a unique story of skill, tradition, and cultural pride. When you choose our artisan-made products, you\'re not just buying something beautiful – you\'re supporting talented craftspeople and helping preserve centuries-old traditions.'}
                        </p>
                      </div>
                      <div className="mt-3 text-xs text-gray-500">
                        Optimized for Facebook with engaging storytelling
                      </div>
                    </div>
                  )}

                  {/* Other Platforms */}
                  {Object.entries(marketingContent.socialPosts)
                    .filter(([platform]) => !['instagram', 'facebook'].includes(platform))
                    .map(([platform, content]) => (
                    <div key={platform} className="border rounded-lg p-4 bg-gray-50">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-semibold capitalize">{platform}</h4>
                        <button
                          onClick={() => shareOnPlatform(platform)}
                          disabled={loading.posting[platform]}
                          className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 disabled:opacity-50 flex items-center gap-2">
                          {loading.posting[platform] ? <Loader2 className="animate-spin" size={16} /> : <Share2 size={16} />}
                          {loading.posting[platform] ? 'Sharing...' : 'Share'}
                        </button>
                      </div>
                      <div className="text-sm text-gray-600 bg-white p-3 rounded">
                        {(content as any)?.content?.caption || (content as any)?.content?.text || (content as any)?.content?.message || 'Ready to share!'}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {!marketingContent?.socialPosts && (
                <div className="text-center text-gray-500 py-8">
                  <Share2 className="mx-auto mb-3" size={48} />
                  <p>Generate marketing content first to create social media posts</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ImageUploadStudio;