import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import Modal from '../../components/Modal';
import productsData from '../../data/products.json';
import artisansData from '../../data/artisans.json';

interface Product {
  id: string;
  title: string;
  slug: string;
  shortDescription: string;
  longDescription: string;
  price: number;
  currency: string;
  images: string[];
  artisanId: string;
  category: string;
  createdAt: string;
  stock: number;
}

interface Artisan {
  id: string;
  name: string;
  language: string;
  bio: string;
  profileImage: string;
  location: string;
  joinedAt: string;
}

export default function ProductDetail() {
  const router = useRouter();
  const { slug } = router.query;
  const [product, setProduct] = useState<Product | null>(null);
  const [artisan, setArtisan] = useState<Artisan | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [showARModal, setShowARModal] = useState(false);
  const [generatedCaption, setGeneratedCaption] = useState('');

  useEffect(() => {
    if (slug) {
      const foundProduct = productsData.find(p => p.slug === slug);
      if (foundProduct) {
        setProduct(foundProduct);
        const foundArtisan = artisansData.find(a => a.id === foundProduct.artisanId);
        setArtisan(foundArtisan || null);
      }
    }
  }, [slug]);

  const formatPrice = (price: number, currency: string) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: currency,
    }).format(price);
  };

  const generateCaption = () => {
    if (!product) return;
    
    // Mock AI caption generation
    const captions = [
      `Discover the beauty of ${product.title} - a masterpiece that tells the story of traditional Indian craftsmanship.`,
      `Handcrafted with love and centuries-old techniques, this ${product.title} brings authentic artisan skill to your home.`,
      `Experience the cultural richness of India through this exquisite ${product.title}, made by skilled artisan hands.`,
      `This ${product.title} represents hours of dedicated work and generations of craft knowledge passed down through time.`
    ];
    
    const randomCaption = captions[Math.floor(Math.random() * captions.length)];
    setGeneratedCaption(randomCaption);
  };

  if (!product) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Product not found</h1>
            <Link href="/products" className="btn-primary">
              Back to Products
            </Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Head>
        <title>{product.title} - Stan It Care</title>
        <meta name="description" content={product.shortDescription} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <Header />

      <main className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Breadcrumb */}
          <nav className="mb-8">
            <ol className="flex items-center space-x-2 text-sm text-gray-500">
              <li><Link href="/" className="hover:text-gray-700">Home</Link></li>
              <li>/</li>
              <li><Link href="/products" className="hover:text-gray-700">Products</Link></li>
              <li>/</li>
              <li className="text-gray-900">{product.title}</li>
            </ol>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Product Images */}
            <div>
              <motion.div 
                className="bg-white rounded-lg shadow-md overflow-hidden mb-4"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
              >
                <div className="aspect-square relative bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-400">Product Image Placeholder</span>
                </div>
              </motion.div>
              
              {product.images.length > 1 && (
                <div className="flex space-x-2">
                  {product.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImageIndex(index)}
                      className={`w-20 h-20 bg-gray-200 rounded-md flex items-center justify-center text-xs text-gray-400 ${
                        selectedImageIndex === index ? 'ring-2 ring-primary-500' : ''
                      }`}
                    >
                      Thumb {index + 1}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Details */}
            <div>
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <div className="bg-white rounded-lg shadow-md p-6">
                  <div className="mb-4">
                    <span className="inline-block bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
                      {product.category}
                    </span>
                  </div>
                  
                  <h1 className="text-3xl font-bold text-gray-900 mb-4">
                    {product.title}
                  </h1>
                  
                  <p className="text-xl text-gray-600 mb-6">
                    {product.shortDescription}
                  </p>
                  
                  <div className="text-3xl font-bold text-primary-600 mb-6">
                    {formatPrice(product.price, product.currency)}
                  </div>
                  
                  <div className="mb-6">
                    <div className="flex items-center mb-2">
                      <span className="text-sm text-gray-600">Stock:</span>
                      <span className={`ml-2 text-sm font-medium ${
                        product.stock < 5 ? 'text-red-600' : 'text-green-600'
                      }`}>
                        {product.stock} available
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-4 mb-8">
                    <button className="btn-primary flex-1">
                      Add to Cart
                    </button>
                    <button 
                      onClick={() => setShowARModal(true)}
                      className="btn-secondary"
                    >
                      AR Preview
                    </button>
                  </div>
                  
                  {artisan && (
                    <div className="border-t pt-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        Meet the Artisan
                      </h3>
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                          <span className="text-xs text-gray-400">Photo</span>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{artisan.name}</p>
                          <p className="text-sm text-gray-600">{artisan.location}</p>
                          <p className="text-xs text-gray-500">Speaks {artisan.language}</p>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 mt-3">
                        {artisan.bio}
                      </p>
                    </div>
                  )}
                </div>
              </motion.div>
            </div>
          </div>

          {/* Product Description */}
          <motion.div 
            className="mt-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  Product Details
                </h2>
                <button
                  onClick={generateCaption}
                  className="text-sm bg-blue-50 text-blue-600 hover:bg-blue-100 px-4 py-2 rounded-md transition-colors"
                >
                  Generate AI Caption
                </button>
              </div>
              
              {generatedCaption && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                  <h4 className="font-medium text-blue-800 mb-2">AI Generated Caption</h4>
                  <p className="text-sm text-blue-700">{generatedCaption}</p>
                </div>
              )}
              
              <div className="prose max-w-none">
                <p className="text-gray-700 leading-relaxed">
                  {product.longDescription}
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </main>

      {/* AR Modal */}
      <Modal
        isOpen={showARModal}
        onClose={() => setShowARModal(false)}
        title="AR Preview"
        size="lg"
      >
        <div className="text-center">
          <div className="w-full h-64 bg-gray-200 rounded-lg flex items-center justify-center mb-6">
            <div className="text-center">
              <div className="text-4xl mb-4">📱</div>
              <p className="text-gray-600">AR Preview Placeholder</p>
              <p className="text-sm text-gray-500 mt-2">
                This feature will allow customers to visualize the product in their space using AR technology.
              </p>
            </div>
          </div>
          
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h4 className="font-medium text-yellow-800 mb-2">🚀 Coming Soon</h4>
            <p className="text-sm text-yellow-700">
              AR preview functionality will be implemented to let customers see how products 
              look in their actual environment before purchasing.
            </p>
          </div>
        </div>
      </Modal>

      <Footer />
    </>
  );
}