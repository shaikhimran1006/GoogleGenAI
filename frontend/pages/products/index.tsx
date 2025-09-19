import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import ProductList from '../../components/ProductList';
import UploadForm from '../../components/UploadForm';
import productsData from '../../data/products.json';

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

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');

  const categories = ['All', 'Textiles', 'Home Decor', 'Jewelry', 'Pottery', 'Woodwork', 'Other'];

  useEffect(() => {
    setProducts(productsData);
  }, []);

  const handleProductUpload = (newProductData: Omit<Product, 'id' | 'createdAt'>) => {
    const newProduct: Product = {
      ...newProductData,
      id: `prod_${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0],
    };
    
    setProducts(prev => [newProduct, ...prev]);
    setShowUploadForm(false);
  };

  const filteredProducts = selectedCategory === '' || selectedCategory === 'All'
    ? products
    : products.filter(product => product.category === selectedCategory);

  return (
    <>
      <Head>
        <title>Products - Stan It Care</title>
        <meta name="description" content="Discover authentic handcrafted products from Indian artisans." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <Header />

      <main className="min-h-screen bg-gray-50">
        {!showUploadForm ? (
          <>
            {/* Header Section */}
            <section className="bg-white border-b">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                      Handcrafted Products
                    </h1>
                    <p className="text-gray-600">
                      Discover authentic products made by skilled Indian artisans
                    </p>
                  </div>
                  
                  <div className="mt-4 md:mt-0 flex flex-col sm:flex-row gap-3">
                    <button
                      onClick={() => setShowUploadForm(true)}
                      className="btn-primary"
                    >
                      Upload Product
                    </button>
                    <Link href="/dashboard" className="btn-secondary">
                      Dashboard
                    </Link>
                  </div>
                </div>
              </div>
            </section>

            {/* Filters Section */}
            <section className="bg-white border-b">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                <div className="flex flex-wrap gap-2">
                  {categories.map((category) => (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category === 'All' ? '' : category)}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                        (selectedCategory === '' && category === 'All') || selectedCategory === category
                          ? 'bg-primary-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
                
                <div className="mt-4 text-sm text-gray-600">
                  Showing {filteredProducts.length} products
                </div>
              </div>
            </section>

            {/* Products Section */}
            <section className="py-8">
              <ProductList products={filteredProducts} title="" />
            </section>
          </>
        ) : (
          <section className="py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="mb-6">
                <button
                  onClick={() => setShowUploadForm(false)}
                  className="flex items-center text-gray-600 hover:text-gray-900"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  Back to Products
                </button>
              </div>
              
              <UploadForm onSubmit={handleProductUpload} />
            </div>
          </section>
        )}
      </main>

      <Footer />
    </>
  );
}