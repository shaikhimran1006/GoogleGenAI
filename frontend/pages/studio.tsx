import { NextPage } from 'next';
import Head from 'next/head';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ImageUploadStudio from '../components/ImageUploadStudio';

const StudioPage: NextPage = () => {
  return (
    <>
      <Head>
        <title>AI Marketing Studio - Stan It Care</title>
        <meta name="description" content="Upload images, generate AI variations, and create marketing content with our AI-powered studio" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Header />
        
        <main className="flex-grow py-8">
          <ImageUploadStudio />
        </main>

        <Footer />
      </div>
    </>
  );
};

export default StudioPage;