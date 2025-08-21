import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Gift, Heart, X } from 'lucide-react';
import { products } from '../data/products';
import ProductCard from './ProductCard';

interface CategoriesProps {
  onShowAllProducts: (show: boolean) => void;
}

const categories = [
  {
    id: 1,
    name: 'Traditional',
    displayName: 'Traditional Sweets',
    description: 'Classic favorites like Gulab Jamun, Rasgulla, and Kaju Katli',
    icon: Heart,
    image: '/images/Traditional.png',
    alt: 'Traditional Sweets',
    path: '/traditional'
  },
  {
    id: 2,
    name: 'Dairy',
    displayName: 'Dairy Delights',
    description: 'Fresh, rich, and creamy dairy essentials: milk, paneer, ghee, and more.',
    icon: Sparkles,
    image: '/images/DairyProducts.jpg',
    alt: 'Dairy Delights',
    path: '/dairy'
  },
  
  {
    id: 4,
    name: 'Gift Box',
    displayName: 'Gift Boxes',
    description: 'Create your custom gift box with traditional sweets',
    icon: Gift,
    image: '/images/giftBox.webp',
    alt: 'Gift Boxes',
    path: '/gift-box'
  }
];

const Categories: React.FC<CategoriesProps> = ({ onShowAllProducts }) => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showAllProducts, setShowAllProducts] = useState(false);

  const handleCategoryClick = (category: typeof categories[0]) => {
    navigate(category.path);
  };

  const handleShowAllProducts = () => {
    setShowAllProducts(true);
    setSelectedCategory(null);
    onShowAllProducts(false);
  };

  const handleClose = () => {
    setSelectedCategory(null);
    setShowAllProducts(false);
    onShowAllProducts(true);
  };

  const getFilteredProducts = () => {
    if (showAllProducts) {
      // Show all products in order: Traditional, Dairy
      const order = ['Traditional', 'Dairy'];
      return order.flatMap(category => 
        products.filter(product => product.category === category)
      );
    }
    
    if (selectedCategory) {
      return products.filter(product => product.category === selectedCategory);
    }
    
    return [];
  };

  const filteredProducts = getFilteredProducts();

  // Listen for custom event to show all products from Hero buttons
  React.useEffect(() => {
    const handleShowAllProductsEvent = () => {
      handleShowAllProducts();
    };

    const handleResetToHome = () => {
      setSelectedCategory(null);
      setShowAllProducts(false);
    };

    window.addEventListener('showAllProducts', handleShowAllProductsEvent);
    window.addEventListener('resetToHome', handleResetToHome);
    
    return () => {
      window.removeEventListener('showAllProducts', handleShowAllProductsEvent);
      window.removeEventListener('resetToHome', handleResetToHome);
    };
  }, []);

  return (
    <section id="categories" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            What We Offer
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
            Discover our wide range of authentic Indian sweets and fresh dairy products, each crafted with love and tradition
          </p>
          <div className="w-24 h-1 bg-orange-500 mx-auto rounded-full"></div>
        </div>

        {/* Category Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 mb-12 max-w-6xl mx-auto">
          {categories.map((category) => {
            const IconComponent = category.icon;
            return (
              <div
                key={category.id}
                className="group bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer h-full flex flex-col"
                onClick={() => handleCategoryClick(category)}
              >
                <div className="relative h-52 overflow-hidden">
                  <img
                    src={category.image}
                    alt={category.alt}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                  <div className="absolute bottom-4 left-4 text-white">
                    <div className="bg-orange-500/80 backdrop-blur-sm rounded-lg p-2">
                      <IconComponent className="h-6 w-6" />
                    </div>
                  </div>
                </div>
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      {category.displayName}
                    </h3>
                    <p className="text-gray-600 text-sm">
                      {category.description}
                    </p>
                  </div>
                  <button className="mt-4 text-orange-600 font-semibold hover:text-orange-700 transition-colors">
                    Explore →
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Products Display */}
        {(selectedCategory || showAllProducts) && (
          <div className="mt-12">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-2xl font-bold text-gray-900">
                {showAllProducts ? 'All Products' : `${selectedCategory} Products`}
              </h3>
              <button
                onClick={handleClose}
                className="bg-gray-200 text-gray-700 p-2 rounded-full hover:bg-gray-300 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default Categories;