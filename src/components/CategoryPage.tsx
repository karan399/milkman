<<<<<<< HEAD
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import Header from './Header';
import Hero from './Hero';
import Footer from './Footer';
import ProductCard from './ProductCard';
import { products } from '../data/products';

interface CategoryPageProps {
  category: string;
  categoryTitle: string;
  categoryDescription: string;
  categoryImage: string;
  itemLabelPlural?: string;
}

const CategoryPage: React.FC<CategoryPageProps> = ({ 
  category, 
  categoryTitle, 
  categoryDescription, 
  categoryImage,
  itemLabelPlural = 'sweets'
}) => {
  const navigate = useNavigate();
  const categoryProducts = products.filter(product => product.category === category);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header onShowAllProducts={() => {}} />
      
      {/* Category Hero Section */}
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
            <div className="mb-8">
              <img 
                src={categoryImage} 
                alt={categoryTitle}
                className="w-32 h-32 mx-auto rounded-full object-cover shadow-lg"
              />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              {categoryTitle}
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
              {categoryDescription}
            </p>
            <div className="text-lg text-gray-700">
              <span className="font-semibold">{categoryProducts.length} {itemLabelPlural}</span> available
            </div>
          </div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute top-10 left-10 w-20 h-20 bg-orange-200 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute bottom-10 right-10 w-32 h-32 bg-yellow-200 rounded-full opacity-20 animate-pulse delay-1000"></div>
      </section>

      {/* Products Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Explore Our {categoryTitle}
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Discover the authentic taste and quality of our carefully crafted {itemLabelPlural}
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {categoryProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default CategoryPage;
=======
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import Header from './Header';
import Hero from './Hero';
import Footer from './Footer';
import ProductCard from './ProductCard';
import { products } from '../data/products';

interface CategoryPageProps {
  category: string;
  categoryTitle: string;
  categoryDescription: string;
  categoryImage: string;
  itemLabelPlural?: string;
}

const CategoryPage: React.FC<CategoryPageProps> = ({ 
  category, 
  categoryTitle, 
  categoryDescription, 
  categoryImage,
  itemLabelPlural = 'sweets'
}) => {
  const navigate = useNavigate();
  const categoryProducts = products.filter(product => product.category === category);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header onShowAllProducts={() => {}} />
      
      {/* Category Hero Section */}
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
            <div className="mb-8">
              <img 
                src={categoryImage} 
                alt={categoryTitle}
                className="w-32 h-32 mx-auto rounded-full object-cover shadow-lg"
              />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              {categoryTitle}
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
              {categoryDescription}
            </p>
            <div className="text-lg text-gray-700">
              <span className="font-semibold">{categoryProducts.length} {itemLabelPlural}</span> available
            </div>
          </div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute top-10 left-10 w-20 h-20 bg-orange-200 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute bottom-10 right-10 w-32 h-32 bg-yellow-200 rounded-full opacity-20 animate-pulse delay-1000"></div>
      </section>

      {/* Products Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Explore Our {categoryTitle}
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Discover the authentic taste and quality of our carefully crafted {itemLabelPlural}
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {categoryProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default CategoryPage;
>>>>>>> 0f2845e6b5b2b482e8c9f5bbce87ea359dbc2bbc
