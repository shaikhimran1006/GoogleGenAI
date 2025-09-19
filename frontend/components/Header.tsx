import Link from 'next/link';
import { motion } from 'framer-motion';

const Header = () => {
  return (
    <motion.header 
      className="bg-white shadow-md sticky top-0 z-50"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center">
            <Link href="/" className="text-2xl font-bold text-primary-600">
              Stan It Care
            </Link>
          </div>
          
          <nav className="hidden md:flex space-x-8">
            <Link 
              href="/" 
              className="text-gray-600 hover:text-primary-600 transition-colors duration-200"
            >
              Home
            </Link>
            <Link 
              href="/products" 
              className="text-gray-600 hover:text-primary-600 transition-colors duration-200"
            >
              Products
            </Link>
            <Link 
              href="/artisans/onboard" 
              className="text-gray-600 hover:text-primary-600 transition-colors duration-200"
            >
              Join as Artisan
            </Link>
            <Link 
              href="/dashboard" 
              className="text-gray-600 hover:text-primary-600 transition-colors duration-200"
            >
              Dashboard
            </Link>
          </nav>

          <div className="flex items-center space-x-4">
            <Link 
              href="/artisans/onboard" 
              className="btn-primary hidden sm:inline-block"
            >
              Get Started
            </Link>
            
            {/* Mobile menu button */}
            <button className="md:hidden">
              <svg 
                className="w-6 h-6" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M4 6h16M4 12h16M4 18h16" 
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </motion.header>
  );
};

export default Header;