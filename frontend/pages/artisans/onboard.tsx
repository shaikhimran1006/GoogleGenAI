import { useState } from 'react';
import Head from 'next/head';
import { motion } from 'framer-motion';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import OnboardForm from '../../components/OnboardForm';

export default function ArtisanOnboard() {
  const [isComplete, setIsComplete] = useState(false);
  const [artisanData, setArtisanData] = useState(null);

  const handleFormSubmit = (data: any) => {
    setArtisanData(data);
    setIsComplete(true);
  };

  return (
    <>
      <Head>
        <title>Join as Artisan - Stan It Care</title>
        <meta name="description" content="Join Stan It Care as an artisan and share your craft with the world." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <Header />

      <main className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {!isComplete ? (
            <>
              <div className="text-center mb-12">
                <h1 className="text-4xl font-bold text-gray-900 mb-4">
                  Join Our Artisan Community
                </h1>
                <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                  Share your craft with the world and connect with customers who 
                  appreciate authentic handmade products.
                </p>
              </div>

              <OnboardForm onSubmit={handleFormSubmit} />
            </>
          ) : (
            <motion.div
              className="text-center"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <div className="card p-8 max-w-2xl mx-auto">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  Welcome to Stan It Care!
                </h2>
                
                <p className="text-lg text-gray-600 mb-8">
                  Thank you for joining our artisan community. Your profile has been created successfully.
                </p>

                {artisanData && (
                  <div className="bg-gray-50 rounded-lg p-6 mb-8 text-left">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      Your Artisan Profile Preview
                    </h3>
                    <div className="space-y-3">
                      <div>
                        <span className="font-medium text-gray-700">Name:</span>
                        <span className="ml-2 text-gray-900">{(artisanData as any).name}</span>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Language:</span>
                        <span className="ml-2 text-gray-900">{(artisanData as any).language}</span>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Location:</span>
                        <span className="ml-2 text-gray-900">{(artisanData as any).location}</span>
                      </div>
                      {(artisanData as any).bio && (
                        <div>
                          <span className="font-medium text-gray-700">Bio:</span>
                          <p className="mt-1 text-gray-900">{(artisanData as any).bio}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
                  <h4 className="font-medium text-blue-800 mb-2">Next Steps</h4>
                  <ul className="text-sm text-blue-700 text-left space-y-1">
                    <li>• Upload your first product to showcase your craft</li>
                    <li>• Complete your profile with more details</li>
                    <li>• Explore the dashboard to track your progress</li>
                  </ul>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button
                    onClick={() => {
                      setIsComplete(false);
                      setArtisanData(null);
                    }}
                    className="px-6 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
                  >
                    Edit Profile
                  </button>
                  <a href="/products/upload" className="btn-primary">
                    Upload Product
                  </a>
                  <a href="/dashboard" className="btn-secondary">
                    Go to Dashboard
                  </a>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </main>

      <Footer />
    </>
  );
}