import { useState } from 'react';
import { motion } from 'framer-motion';

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

interface UploadFormProps {
  onSubmit: (productData: Omit<Product, 'id' | 'createdAt'>) => void;
}

const UploadForm: React.FC<UploadFormProps> = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    title: '',
    shortDescription: '',
    longDescription: '',
    price: '',
    category: '',
    stock: '',
    artisanId: 'artisan_1', // Default for demo
    images: [] as File[],
  });

  const categories = [
    'Textiles', 'Home Decor', 'Jewelry', 'Pottery', 'Woodwork', 
    'Metalwork', 'Paintings', 'Sculptures', 'Other'
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      setFormData(prev => ({ ...prev, images: filesArray }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const productData = {
      title: formData.title,
      slug: formData.title.toLowerCase().replace(/\s+/g, '-'),
      shortDescription: formData.shortDescription,
      longDescription: formData.longDescription,
      price: parseFloat(formData.price),
      currency: 'INR',
      images: formData.images.map((_, index) => `/images/products/uploaded-${Date.now()}-${index}.jpg`),
      artisanId: formData.artisanId,
      category: formData.category,
      stock: parseInt(formData.stock),
    };

    onSubmit(productData);
    
    // Reset form
    setFormData({
      title: '',
      shortDescription: '',
      longDescription: '',
      price: '',
      category: '',
      stock: '',
      artisanId: 'artisan_1',
      images: [],
    });
  };

  return (
    <motion.div
      className="max-w-2xl mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="card p-6">
        <h3 className="text-2xl font-bold mb-6">Upload New Product</h3>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Product Title *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category *
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              required
            >
              <option value="">Select Category</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Short Description *
            </label>
            <input
              type="text"
              name="shortDescription"
              value={formData.shortDescription}
              onChange={handleInputChange}
              placeholder="Brief description for product cards"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Detailed Description
            </label>
            <textarea
              name="longDescription"
              value={formData.longDescription}
              onChange={handleInputChange}
              rows={4}
              placeholder="Detailed description of your product, materials used, crafting process..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            ></textarea>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Price (INR) *
              </label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                min="1"
                step="0.01"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Stock Quantity *
              </label>
              <input
                type="number"
                name="stock"
                value={formData.stock}
                onChange={handleInputChange}
                min="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Product Images (2-3 recommended)
            </label>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
            <p className="text-sm text-gray-500 mt-1">
              Select 2-3 high-quality images of your product
            </p>
            {formData.images.length > 0 && (
              <div className="mt-2">
                <p className="text-sm text-green-600">
                  {formData.images.length} file(s) selected
                </p>
              </div>
            )}
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
            <h4 className="font-medium text-blue-800 mb-2">📝 Note</h4>
            <p className="text-sm text-blue-700">
              This is a UI demonstration. In the real application, images would be uploaded 
              to cloud storage and the product data would be saved to a database.
            </p>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="btn-primary"
              disabled={!formData.title || !formData.category || !formData.price || !formData.stock}
            >
              Upload Product
            </button>
          </div>
        </form>
      </div>
    </motion.div>
  );
};

export default UploadForm;