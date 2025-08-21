import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ShoppingCart, Menu, X, User, LogIn } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import CartModal from './CartModal';
import CheckoutModal from './CheckoutModal';
import LoginModal from './LoginModal';
import ProfileModal from './ProfileModal';

interface HeaderProps {
  onShowAllProducts?: (show: boolean) => void;
}

const Header: React.FC<HeaderProps> = ({ onShowAllProducts }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();
  const cartContext = useCart();
  const { user, isAuthenticated } = useAuth();
  
  const getTotalItems = () => {
    try {
      return cartContext?.getTotalItems?.() || 0;
    } catch (error) {
      console.error('Error getting total items:', error);
      return 0;
    }
  };

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleCart = () => {
    setIsCartOpen(!isCartOpen);
  };
  const openCheckout = () => setIsCheckoutOpen(true);
  const closeCheckout = () => setIsCheckoutOpen(false);

  const handleAuthClick = () => {
    if (isAuthenticated) {
      setIsProfileOpen(true);
    } else {
      setIsLoginOpen(true);
    }
  };

  const handleHomeClick = () => {
    navigate('/');
    setIsMenuOpen(false);
  };

  const handleNavClick = (path: string) => {
    navigate(path);
    setIsMenuOpen(false);
  };

  const isActiveRoute = (path: string) => {
    return location.pathname === path;
  };

  return (
    <>
      <header className="bg-white shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex-shrink-0">
              <img 
                src="/images/logo.png" 
                alt="MilkMan" 
                className="h-14 w-14 md:h-16 md:w-16 object-contain hover:scale-105 transition-transform duration-200 cursor-pointer" 
                onClick={handleHomeClick}
              />
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-8">
              <a 
                onClick={handleHomeClick}
                className={`text-gray-700 hover:text-orange-600 transition-colors cursor-pointer ${
                  isActiveRoute('/') ? 'text-orange-600 font-semibold' : ''
                }`}
              >
                Home
              </a>
              <a 
                onClick={() => handleNavClick('/traditional')}
                className={`text-gray-700 hover:text-orange-600 transition-colors cursor-pointer ${
                  isActiveRoute('/traditional') ? 'text-orange-600 font-semibold' : ''
                }`}
              >
                Traditional
              </a>
              <a 
                onClick={() => handleNavClick('/dairy')}
                className={`text-gray-700 hover:text-orange-600 transition-colors cursor-pointer ${
                  isActiveRoute('/dairy') ? 'text-orange-600 font-semibold' : ''
                }`}
              >
                Dairy
              </a>
              
              <a 
                onClick={() => handleNavClick('/gift-box')}
                className={`text-gray-700 hover:text-orange-600 transition-colors cursor-pointer ${
                  isActiveRoute('/gift-box') ? 'text-orange-600 font-semibold' : ''
                }`}
              >
                Gift Box
              </a>
              <a 
                onClick={() => handleNavClick('/menu')}
                className={`text-gray-700 hover:text-orange-600 transition-colors cursor-pointer ${
                  isActiveRoute('/menu') ? 'text-orange-600 font-semibold' : ''
                }`}
              >
                Menu
              </a>
              <a 
                onClick={() => {
                  if (location.pathname === '/') {
                    document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' });
                  } else {
                    navigate('/');
                    setTimeout(() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' }), 50);
                  }
                }}
                className="text-gray-700 hover:text-orange-600 transition-colors cursor-pointer"
              >
                About
              </a>
              <a 
                onClick={() => {
                  if (location.pathname === '/') {
                    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
                  } else {
                    navigate('/');
                    setTimeout(() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' }), 50);
                  }
                }}
                className="text-gray-700 hover:text-orange-600 transition-colors cursor-pointer"
              >
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
                onClick={() => {
                  try {
                    toggleCart();
                  } catch (error) {
                    console.error('Error toggling cart:', error);
                    setIsCartOpen(true);
                  }
                }}
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
                  onClick={handleHomeClick}
                  className="block px-3 py-2 text-gray-700 hover:text-orange-600 transition-colors cursor-pointer"
                >
                  Home
                </a>
                <a
                  onClick={() => handleNavClick('/traditional')}
                  className="block px-3 py-2 text-gray-700 hover:text-orange-600 transition-colors cursor-pointer"
                >
                  Traditional
                </a>
                <a
                  onClick={() => handleNavClick('/dairy')}
                  className="block px-3 py-2 text-gray-700 hover:text-orange-600 transition-colors cursor-pointer"
                >
                  Dairy
                </a>
                
                <a
                  onClick={() => handleNavClick('/gift-box')}
                  className="block px-3 py-2 text-gray-700 hover:text-orange-600 transition-colors cursor-pointer"
                >
                  Gift Box
                </a>
                <a
                  onClick={() => handleNavClick('/menu')}
                  className="block px-3 py-2 text-gray-700 hover:text-orange-600 transition-colors cursor-pointer"
                >
                  Menu
                </a>
                <a
                  onClick={() => {
                    if (location.pathname !== '/') navigate('/');
                    setIsMenuOpen(false);
                    setTimeout(() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' }), 50);
                  }}
                  className="block px-3 py-2 text-gray-700 hover:text-orange-600 transition-colors cursor-pointer"
                >
                  About
                </a>
                <a
                  onClick={() => {
                    if (location.pathname !== '/') navigate('/');
                    setIsMenuOpen(false);
                    setTimeout(() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' }), 50);
                  }}
                  className="block px-3 py-2 text-gray-700 hover:text-orange-600 transition-colors cursor-pointer"
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