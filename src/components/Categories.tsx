import React from 'react';
import { Sparkles, Gift, Crown, Heart } from 'lucide-react';

const categories = [
  {
    id: 1,
    name: 'Traditional Sweets',
    description: 'Classic favorites like Gulab Jamun, Rasgulla, and Kaju Katli',
    icon: Heart,
    image: 'https://images.pexels.com/photos/6212166/pexels-photo-6212166.jpeg?auto=compress&cs=tinysrgb&w=400'
  },
  {
    id: 2,
    name: 'Festival Specials',
    description: 'Special sweets for Diwali, Holi, and other celebrations',
    icon: Sparkles,
    image: 'https://images.pexels.com/photos/7937434/pexels-photo-7937434.jpeg?auto=compress&cs=tinysrgb&w=400'
  },
  {
    id: 3,
    name: 'Premium Collection',
    description: 'Luxury sweets with dry fruits and exotic ingredients',
    icon: Crown,
    image: 'https://images.pexels.com/photos/6212178/pexels-photo-6212178.jpeg?auto=compress&cs=tinysrgb&w=400'
  },
  {
    id: 4,
    name: 'Gift Boxes',
    description: 'Beautifully packaged sweet assortments for gifting',
    icon: Gift,
    image: 'https://images.pexels.com/photos/6212167/pexels-photo-6212167.jpeg?auto=compress&cs=tinysrgb&w=400'
  }
];

const Categories: React.FC = () => {
  return (
    <section id="categories" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Our Sweet Categories
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover our wide range of authentic Indian sweets, each crafted with love and tradition
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {categories.map((category) => {
            const IconComponent = category.icon;
            return (
              <div
                key={category.id}
                className="group bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                  <div className="absolute bottom-4 left-4 text-white">
                    <IconComponent className="h-6 w-6 mb-2" />
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {category.name}
                  </h3>
                  <p className="text-gray-600 text-sm">
                    {category.description}
                  </p>
                  <button className="mt-4 text-orange-600 font-semibold hover:text-orange-700 transition-colors">
                    Explore →
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Categories;