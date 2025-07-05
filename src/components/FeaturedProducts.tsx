import React from 'react';
import ProductCard from './ProductCard';
import { products } from '../data/products';

const FeaturedProducts: React.FC = () => {
  const featuredProducts = products.slice(0, 8);

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Featured Sweets
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Our most popular and beloved sweets, made fresh daily with authentic recipes
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        <div className="text-center mt-12">
          <button className="bg-orange-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-orange-700 transition-colors shadow-lg">
            View All Sweets
          </button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;