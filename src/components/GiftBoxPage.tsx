<<<<<<< HEAD
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Gift, Sparkles, ArrowLeft } from 'lucide-react';
import Header from './Header';
import Footer from './Footer';

const GiftBoxPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50">
      <Header onShowAllProducts={() => {}} />
      
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-purple-50 to-pink-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back to Home Button */}
          <div className="mb-8">
            <button
              onClick={() => navigate('/')}
              className="flex items-center text-purple-600 hover:text-purple-700 transition-colors font-medium"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              Back to Home
            </button>
          </div>
          
          <div className="text-center">
            <div className="mb-8">
              <img 
                src="/images/giftBox.webp" 
                alt="Custom Gift Box"
                className="w-32 h-32 mx-auto rounded-full object-cover shadow-lg"
              />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Create Your <span className="text-purple-600">Custom Gift Box</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Design a personalized gift box by selecting 4 of your favorite traditional sweets. 
              Perfect for birthdays, anniversaries, or any special occasion.
            </p>
            <div className="text-lg text-gray-700">
              <span className="font-semibold">Build your perfect gift</span> with our traditional sweets collection
            </div>
          </div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute top-10 left-10 w-20 h-20 bg-purple-200 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute bottom-10 right-10 w-32 h-32 bg-pink-200 rounded-full opacity-20 animate-pulse delay-1000"></div>
      </section>

      {/* Custom Gift Box Builder Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-purple-100 rounded-full mb-6">
              <Plus className="h-10 w-10 text-purple-600" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
              Create your perfect gift box in just a few simple steps
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto mb-12">
            <div className="bg-white p-8 rounded-xl shadow-lg border border-purple-100">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Gift className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Choose Sweets</h3>
              <p className="text-gray-600">
                Select exactly 4 sweets from our traditional collection. You can choose up to 2 of each sweet for variety.
              </p>
            </div>
            
            <div className="bg-white p-8 rounded-xl shadow-lg border border-purple-100">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Sparkles className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Personalize</h3>
              <p className="text-gray-600">
                Add a custom name, recipient details, and a personal message to make it truly special.
              </p>
            </div>
            
            <div className="bg-white p-8 rounded-xl shadow-lg border border-purple-100">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Gift className="h-8 w-8 text-orange-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Ready to Gift</h3>
              <p className="text-gray-600">
                Your custom gift box is beautifully packaged and ready to bring joy to your loved ones.
              </p>
            </div>
          </div>
          
          <div className="text-center">
            <button
              onClick={() => navigate('/gift-box-builder')}
              className="bg-purple-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-purple-700 transition-colors shadow-lg text-lg"
            >
              Start Building Your Gift Box
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default GiftBoxPage;
=======
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Gift, Sparkles, ArrowLeft } from 'lucide-react';
import Header from './Header';
import Footer from './Footer';

const GiftBoxPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50">
      <Header onShowAllProducts={() => {}} />
      
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-purple-50 to-pink-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back to Home Button */}
          <div className="mb-8">
            <button
              onClick={() => navigate('/')}
              className="flex items-center text-purple-600 hover:text-purple-700 transition-colors font-medium"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              Back to Home
            </button>
          </div>
          
          <div className="text-center">
            <div className="mb-8">
              <img 
                src="/images/giftBox.webp" 
                alt="Custom Gift Box"
                className="w-32 h-32 mx-auto rounded-full object-cover shadow-lg"
              />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Create Your <span className="text-purple-600">Custom Gift Box</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Design a personalized gift box by selecting 4 of your favorite traditional sweets. 
              Perfect for birthdays, anniversaries, or any special occasion.
            </p>
            <div className="text-lg text-gray-700">
              <span className="font-semibold">Build your perfect gift</span> with our traditional sweets collection
            </div>
          </div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute top-10 left-10 w-20 h-20 bg-purple-200 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute bottom-10 right-10 w-32 h-32 bg-pink-200 rounded-full opacity-20 animate-pulse delay-1000"></div>
      </section>

      {/* Custom Gift Box Builder Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-purple-100 rounded-full mb-6">
              <Plus className="h-10 w-10 text-purple-600" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
              Create your perfect gift box in just a few simple steps
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto mb-12">
            <div className="bg-white p-8 rounded-xl shadow-lg border border-purple-100">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Gift className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Choose Sweets</h3>
              <p className="text-gray-600">
                Select exactly 4 sweets from our traditional collection. You can choose up to 2 of each sweet for variety.
              </p>
            </div>
            
            <div className="bg-white p-8 rounded-xl shadow-lg border border-purple-100">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Sparkles className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Personalize</h3>
              <p className="text-gray-600">
                Add a custom name, recipient details, and a personal message to make it truly special.
              </p>
            </div>
            
            <div className="bg-white p-8 rounded-xl shadow-lg border border-purple-100">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Gift className="h-8 w-8 text-orange-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Ready to Gift</h3>
              <p className="text-gray-600">
                Your custom gift box is beautifully packaged and ready to bring joy to your loved ones.
              </p>
            </div>
          </div>
          
          <div className="text-center">
            <button
              onClick={() => navigate('/gift-box-builder')}
              className="bg-purple-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-purple-700 transition-colors shadow-lg text-lg"
            >
              Start Building Your Gift Box
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default GiftBoxPage;
>>>>>>> 0f2845e6b5b2b482e8c9f5bbce87ea359dbc2bbc
