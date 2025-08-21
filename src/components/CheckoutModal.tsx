import React, { useState, useEffect } from 'react';
import { X, CheckCircle, AlertCircle } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CheckoutModal: React.FC<CheckoutModalProps> = ({ isOpen, onClose }) => {
  const cartContext = useCart();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
  });
  const [errors, setErrors] = useState<{ name?: string; phone?: string; address?: string }>({});

  // reset modal state when closed
  useEffect(() => {
    if (!isOpen) {
      setIsProcessing(false);
      setIsSuccess(false);
      setFormData({ name: '', phone: '', address: '' });
      setErrors({});
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Guard against invalid context
  if (!cartContext?.items) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onClose}></div>
        <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 text-center">
          <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Checkout Unavailable</h2>
          <p className="text-gray-500 mb-4">The checkout is currently unavailable. Please refresh the page and try again.</p>
          <button onClick={onClose} className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors">Close</button>
        </div>
      </div>
    );
  }

  // Allow opening checkout even if cart is empty so the sweet note is visible

  const items = cartContext.items || [];

  const getTotalPrice = () => cartContext.getTotalPrice?.() ?? 0;
  const getTotalItems = () => cartContext.getTotalItems?.() ?? 0;
  const clearCart = () => cartContext.clearCart?.();

  // Ensure only valid items
  const validItems = items.filter(
    (item) =>
      item &&
      item.id &&
      item.name &&
      typeof item.price === 'number' &&
      typeof item.quantity === 'number' &&
      item.quantity > 0
  );

  const hasValidItems = validItems.length > 0;

  // Validation
  const validateForm = () => {
    const newErrors: typeof errors = {};
    if (!formData.name.trim() || formData.name.trim().length < 2) {
      newErrors.name = 'Please enter a valid full name.';
    }
    if (!/^\d{10}$/.test(formData.phone)) {
      newErrors.phone = 'Enter a valid 10-digit phone number.';
    }
    if (!formData.address.trim() || formData.address.trim().length < 10) {
      newErrors.address = 'Please enter a complete address.';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Live validation: clear error if fixed
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handlePlaceOrder = () => {
    if (!validateForm()) return;

    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);
      clearCart();
    }, 1500);
  };

  const goHome = () => {
    setIsSuccess(false);
    onClose();
    navigate('/');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (isSuccess) {
    return (
      <div className="fixed inset-0 z-50 overflow-hidden">
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>
        <div className="absolute inset-0 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full text-center">
            <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="h-10 w-10 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">Order Placed!</h2>
            <p className="text-gray-600 mb-6">
              Thank you for choosing us. No online payment needed — please pay in cash upon delivery.
            </p>
            <div className="bg-orange-50 rounded-lg p-4 text-left mb-6">
              <p className="text-sm text-orange-800">
                Sweet note: We prepare your order fresh with love. Your treats will be on their way shortly!
              </p>
            </div>
            <button onClick={goHome} className="w-full bg-orange-600 text-white py-3 rounded-lg font-semibold hover:bg-orange-700 transition-colors">
              Go to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onClose}></div>
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          <div className="flex flex-col lg:flex-row">
            {/* Order Summary */}
            <div className="lg:w-2/5 bg-gray-50 p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Order Summary</h2>
                <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="space-y-4 mb-6">
                {hasValidItems ? (
                  validItems.map((item) => (
                    <div key={item.id} className="flex items-center space-x-3">
                      <img
                        src={item.image || '/images/logo.png'}
                        alt={item.name || 'Product'}
                        className="w-12 h-12 object-cover rounded-lg"
                        onError={(e) => {
                          if ((e.currentTarget as HTMLImageElement).src !== '/images/logo.png') {
                            (e.currentTarget as HTMLImageElement).src = '/images/logo.png';
                          }
                        }}
                      />
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900">{item.name || 'Unknown Product'}</h3>
                        <p className="text-sm text-gray-600">Qty: {item.quantity || 1}</p>
                      </div>
                      <p className="font-semibold text-gray-900">₹{(item.price || 0) * (item.quantity || 1)}</p>
                    </div>
                  ))
                ) : (
                  <div className="text-center text-gray-600">
                    Your cart is empty. Add some treats to proceed.
                  </div>
                )}
              </div>

              <div className="border-t pt-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600">Subtotal ({getTotalItems()} items)</span>
                  <span className="font-semibold">₹{getTotalPrice()}</span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600">Delivery</span>
                  <span className="font-semibold text-green-600">Free</span>
                </div>
                <div className="flex justify-between items-center text-lg font-bold border-t pt-2">
                  <span>Total</span>
                  <span className="text-orange-600">₹{getTotalPrice()}</span>
                </div>
              </div>
            </div>

            {/* Cash on Delivery Section */}
            <div className="lg:w-3/5 p-8">
              <div className="mb-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-1">Cash on Delivery</h3>
                <p className="text-gray-600">No online payment required. Pay in cash when your order arrives.</p>
              </div>

              <div className="mb-6 bg-orange-50 border border-orange-200 rounded-lg p-4">
                <p className="text-sm text-orange-800">
                  Sweet note: We’ll prepare your items fresh as soon as you place the order. Thank you for supporting local!
                </p>
              </div>

              {/* Contact Info */}
              <div className="mb-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Contact & Delivery Details</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                        errors.name ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Enter your full name"
                    />
                    {errors.name && <p className="text-sm text-red-500 mt-1">{errors.name}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone *</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                        errors.phone ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="10-digit phone number"
                    />
                    {errors.phone && <p className="text-sm text-red-500 mt-1">{errors.phone}</p>}
                  </div>
                </div>
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Address *</label>
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    rows={3}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                      errors.address ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Full delivery address"
                  />
                  {errors.address && <p className="text-sm text-red-500 mt-1">{errors.address}</p>}
                </div>
              </div>

              <button
                onClick={handlePlaceOrder}
                disabled={isProcessing || !hasValidItems}
                className="w-full bg-orange-600 text-white py-4 rounded-lg font-semibold hover:bg-orange-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {isProcessing ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Placing Order...
                  </>
                ) : (
                  hasValidItems ? `Place Order - Cash on Delivery (₹${getTotalPrice()})` : 'Add items to place order'
                )}
              </button>
              <p className="text-xs text-gray-500 mt-3 text-center">
                By placing this order, you agree to pay the total amount in cash upon delivery.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutModal;