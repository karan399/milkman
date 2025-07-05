import React, { useState } from 'react';
import { ShoppingCart, Menu, X, User, LogIn } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import CartModal from './CartModal';
import CheckoutModal from './CheckoutModal';
import LoginModal from './LoginModal';
import ProfileModal from './ProfileModal';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  
  const { getTotalItems } = useCart();
  const { user, isAuthenticated } = useAuth();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleCart = () => setIsCartOpen(!isCartOpen);
  const openCheckout = () => setIsCheckoutOpen(true);
  const closeCheckout = () => setIsCheckoutOpen(false);

  const handleAuthClick = () => {
    if (isAuthenticated) {
      setIsProfileOpen(true);
    } else {
      setIsLoginOpen(true);
    }
  };

  return (
    <>
      <header className="bg-white shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex-shrink-0">
              <h1 className="text-2xl font-bold text-orange-600">
                Mithai Bhandar
              </h1>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-8">
              <a href="#home" className="text-gray-700 hover:text-orange-600 transition-colors">
                Home
              </a>
              <a href="#categories" className="text-gray-700 hover:text-orange-600 transition-colors">
                Sweets
              </a>
              <a href="#about" className="text-gray-700 hover:text-orange-600 transition-colors">
                About
              </a>
              <a href="#contact" className="text-gray-700 hover:text-orange-600 transition-colors">
                Contact
              </a>
            </nav>

            {/* User Actions */}
            <div className="flex items-center space-x-4">
              {/* Auth Button */}
              <button
                onClick={handleAuthClick}
                className="flex items-center space-x-2 text-gray-700 hover:text-orange-600 transition-colors"
              >
                {isAuthenticated ? (
                  <>
                    <User className="h-6 w-6" />
                    <span className="hidden sm:block text-sm font-medium">
                      {user?.name || 'Profile'}
                    </span>
                  </>
                ) : (
                  <>
                    <LogIn className="h-6 w-6" />
                    <span className="hidden sm:block text-sm font-medium">Login</span>
                  </>
                )}
              </button>

              {/* Cart Button */}
              <button
                onClick={toggleCart}
                className="relative p-2 text-gray-700 hover:text-orange-600 transition-colors"
              >
                <ShoppingCart className="h-6 w-6" />
                {getTotalItems() > 0 && (
                  <span className="absolute -top-1 -right-1 bg-orange-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {getTotalItems()}
                  </span>
                )}
              </button>

              {/* Mobile menu button */}
              <button
                onClick={toggleMenu}
                className="md:hidden p-2 text-gray-700 hover:text-orange-600 transition-colors"
              >
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="md:hidden">
              <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t">
                <a
                  href="#home"
                  className="block px-3 py-2 text-gray-700 hover:text-orange-600 transition-colors"
                  onClick={toggleMenu}
                >
                  Home
                </a>
                <a
                  href="#categories"
                  className="block px-3 py-2 text-gray-700 hover:text-orange-600 transition-colors"
                  onClick={toggleMenu}
                >
                  Sweets
                </a>
                <a
                  href="#about"
                  className="block px-3 py-2 text-gray-700 hover:text-orange-600 transition-colors"
                  onClick={toggleMenu}
                >
                  About
                </a>
                <a
                  href="#contact"
                  className="block px-3 py-2 text-gray-700 hover:text-orange-600 transition-colors"
                  onClick={toggleMenu}
                >
                  Contact
                </a>
                <button
                  onClick={() => {
                    handleAuthClick();
                    toggleMenu();
                  }}
                  className="block w-full text-left px-3 py-2 text-gray-700 hover:text-orange-600 transition-colors"
                >
                  {isAuthenticated ? 'My Account' : 'Login'}
                </button>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Modals */}
      <CartModal 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)} 
        onCheckout={openCheckout}
      />
      <CheckoutModal 
        isOpen={isCheckoutOpen} 
        onClose={closeCheckout} 
      />
      <LoginModal 
        isOpen={isLoginOpen} 
        onClose={() => setIsLoginOpen(false)} 
      />
      <ProfileModal 
        isOpen={isProfileOpen} 
        onClose={() => setIsProfileOpen(false)} 
      />
    </>
  );
};

export default Header;