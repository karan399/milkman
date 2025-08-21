import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import Header from './Header';
import Hero from './Hero';
import Footer from './Footer';
import ProductCard from './ProductCard';
import { products } from '../data/products';

const MenuPage: React.FC = () => {
  const navigate = useNavigate();
  
  // Group products by category
  const productsByCategory = products.reduce((acc, product) => {
    if (!acc[product.category]) {
      acc[product.category] = [];
    }
    acc[product.category].push(product);
    return acc;
  }, {} as Record<string, typeof products>);

  // Only show categories that have products
  const categoryOrder = ['Traditional', 'Dairy'];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header onShowAllProducts={() => {}} />
      
      {/* Menu Hero Section */}
      <section className="relative bg-gradient-to-r from-orange-50 to-yellow-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back to Home Button */}
          <div className="mb-8">
            <button
              onClick={() => navigate('/')}
              className="flex items-center text-orange-600 hover:text-orange-700 transition-colors font-medium"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              Back to Home
            </button>
          </div>
          
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Our Complete <span className="text-orange-600">Menu</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Explore our entire collection of authentic Indian sweets, from traditional favorites to premium delicacies
            </p>
            <div className="text-lg text-gray-700">
              <span className="font-semibold">{products.length} delicious sweets</span> across all categories
            </div>
          </div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute top-10 left-10 w-20 h-20 bg-orange-200 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute bottom-10 right-10 w-32 h-32 bg-yellow-200 rounded-full opacity-20 animate-pulse delay-1000"></div>
      </section>

      {/* Products by Category */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Complete Sweet Collection
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Browse through all our categories and discover your perfect sweet
            </p>
          </div>
          
          {categoryOrder.map((category) => {
            const categoryProducts = productsByCategory[category];
            if (!categoryProducts) return null;

            return (
              <div key={category} className="mb-16">
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    {category === 'Dairy' ? 'Dairy Delights' : `${category} Sweets`}
                  </h3>
                  <p className="text-gray-600">
                    {(categoryProducts?.length ?? 0)} delicious options
                  </p>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                  {categoryProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default MenuPage;
