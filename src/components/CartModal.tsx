import React, { useEffect, useState } from 'react';
import { X, Minus, Plus, ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';

interface CartModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCheckout: () => void;
}

const CartModal: React.FC<CartModalProps> = ({ isOpen, onClose, onCheckout }) => {
  const cartContext = useCart();
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  // Safety check for cart context functions
  const items = cartContext?.items || [];
  const updateQuantity = cartContext?.updateQuantity || (() => {});
  const removeFromCart = cartContext?.removeFromCart || (() => {});
  const getTotalPrice = cartContext?.getTotalPrice || (() => 0);
  const getTotalItems = cartContext?.getTotalItems || (() => 0);

  // Add timeout mechanism to prevent hanging
  useEffect(() => {
    if (isOpen) {
      setIsLoading(true);
      setHasError(false);
      
      const timer = setTimeout(() => {
        setIsLoading(false);
        if (!items) {
          setHasError(true);
        }
      }, 300); // 300ms timeout

      return () => clearTimeout(timer);
    }
  }, [isOpen, items]);

  // Don't render if not open
  if (!isOpen) return null;

  // Check if cart context is valid
  if (!cartContext || !cartContext.items) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onClose}></div>
        <div className="relative bg-white p-6 rounded-lg shadow-xl max-w-md w-full mx-4">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Cart Unavailable</h2>
            <p className="text-gray-500 mb-4">The cart is currently unavailable. Please refresh the page and try again.</p>
            <button
              onClick={onClose}
              className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }

  const handleRetry = () => {
    setIsLoading(true);
    setHasError(false);
    // Force a re-render by updating the state
    setTimeout(() => setIsLoading(false), 500);
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onClose}></div>
        <div className="relative bg-white p-6 rounded-lg shadow-xl max-w-md w-full mx-4">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Loading Cart...</h2>
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600 mx-auto mb-4"></div>
            <p className="text-gray-500 mb-4">Please wait while we load your cart.</p>
            <button
              onClick={onClose}
              className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Show error state
  if (hasError || !items) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onClose}></div>
        <div className="relative bg-white p-6 rounded-lg shadow-xl max-w-md w-full mx-4">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Error Loading Cart</h2>
            <p className="text-gray-500 mb-4">There was an error loading your cart. Please try again.</p>
            <div className="flex space-x-3 justify-center">
              <button
                onClick={handleRetry}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Retry
              </button>
              <button
                onClick={onClose}
                className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const handleCheckout = () => {
    onClose();
    onCheckout();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end">
      <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onClose}></div>
      <div className="relative w-full max-w-md h-full bg-white shadow-xl transform transition-transform duration-300 ease-in-out">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b">
            <h2 className="text-xl font-semibold text-gray-900">Shopping Cart</h2>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto p-6 min-h-0">
            {items.length === 0 ? (
              <div className="text-center py-12">
                <ShoppingBag className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">Your cart is empty</p>
              </div>
            ) : (
              <div className="space-y-4">
                {items
                  .filter(item => item && item.id && item.name && typeof item.price === 'number')
                  .map((item) => {
                    return (
                      <div key={item.id} className="bg-gray-50 p-4 rounded-lg">
                        {/* Main Item */}
                        <div className="flex items-center space-x-4 mb-3">
                          <img
                            src={item.image || '/images/logo.png'}
                            alt={item.name || 'Product'}
                            className="w-16 h-16 object-cover rounded-lg"
                            onError={(e) => {
                              console.error('Image failed to load:', item.image);
                              e.currentTarget.src = '/images/logo.png'; // Fallback image
                            }}
                          />
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900">{item.name || 'Unknown Product'}</h3>
                            <p className="text-orange-600 font-semibold">₹{item.price || 0}</p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => {
                                try {
                                  updateQuantity(item.id, (item.quantity || 1) - 1);
                                } catch (error) {
                                  console.error('Error updating quantity:', error);
                                }
                              }}
                              className="p-1 text-gray-500 hover:text-gray-700 transition-colors"
                            >
                              <Minus className="h-4 w-4" />
                            </button>
                            <span className="w-8 text-center font-semibold">{item.quantity || 1}</span>
                            <button
                              onClick={() => {
                                try {
                                  updateQuantity(item.id, (item.quantity || 1) + 1);
                                } catch (error) {
                                  console.error('Error updating quantity:', error);
                                }
                              }}
                              className="p-1 text-gray-500 hover:text-gray-700 transition-colors"
                            >
                              <Plus className="h-4 w-4" />
                            </button>
                          </div>
                          <button
                            onClick={() => {
                              try {
                                removeFromCart(item.id);
                              } catch (error) {
                                console.error('Error removing item:', error);
                              }
                            }}
                            className="p-1 text-red-500 hover:text-red-700 transition-colors"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>

                        {/* Custom Gift Box Details */}
                        {item.customGiftBox && item.selectedSweets && (
                          <div className="ml-20 border-l-2 border-orange-200 pl-4">
                            <p className="text-sm text-gray-600 mb-2 font-medium">Contains:</p>
                            <div className="space-y-1">
                              {item.selectedSweets.map((sweet, index) => (
                                <div key={index} className="flex justify-between items-center text-sm">
                                  <span className="text-gray-700">
                                    {sweet.quantity}x {sweet.product.name}
                                  </span>
                                  <span className="text-gray-500">
                                    ₹{sweet.product.price * sweet.quantity}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
              </div>
            )}
          </div>

          {/* Footer */}
          {items.length > 0 && (
            <div className="border-t p-6">
              <div className="flex justify-between items-center mb-4">
                <span className="text-lg font-semibold text-gray-900">
                  Total ({getTotalItems()} items)
                </span>
                <span className="text-2xl font-bold text-orange-600">
                  ₹{getTotalPrice()}
                </span>
              </div>
              <button
                onClick={handleCheckout}
                className="w-full bg-orange-600 text-white py-3 rounded-lg font-semibold hover:bg-orange-700 transition-colors"
              >
                Proceed to Checkout
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CartModal;