import React from 'react';
import { useNavigate } from 'react-router-dom';

interface HeroProps {
  onShowAllProducts: (show: boolean) => void;
}

const Hero: React.FC<HeroProps> = ({ onShowAllProducts }) => {
  const navigate = useNavigate();

  const handleViewMenu = () => {
    navigate('/menu');
  };

  const handleOrderNow = () => {
    navigate('/menu');
  };

  return (
    <section id="home" className="relative bg-gradient-to-r from-orange-50 to-yellow-50 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
           <span className="text-orange-600">MILK MAN</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Experience the rich flavors and traditional recipes passed down through generations. 
            Made fresh daily with the finest ingredients.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={handleOrderNow}
              className="bg-orange-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-orange-700 transition-colors shadow-lg"
            >
              Order Now
            </button>
            <button 
              onClick={handleViewMenu}
              className="border-2 border-orange-600 text-orange-600 px-8 py-3 rounded-lg font-semibold hover:bg-orange-600 hover:text-white transition-colors"
            >
              View Menu
            </button>
          </div>
        </div>
      </div>
      
      {/* Decorative elements */}
      <div className="absolute top-10 left-10 w-20 h-20 bg-orange-200 rounded-full opacity-20 animate-pulse"></div>
      <div className="absolute bottom-10 right-10 w-32 h-32 bg-yellow-200 rounded-full opacity-20 animate-pulse delay-1000"></div>
    </section>
  );
};

export default Hero;