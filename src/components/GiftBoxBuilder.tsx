import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Minus, ShoppingCart, X } from 'lucide-react';
import Header from './Header';
import Footer from './Footer';
import { products } from '../data/products';
import { useCart } from '../context/CartContext';

interface SelectedSweet {
  product: typeof products[0];
  quantity: number;
}

const GiftBoxBuilder: React.FC = () => {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [selectedSweets, setSelectedSweets] = useState<SelectedSweet[]>([]);
  const [showCart, setShowCart] = useState(false);
  const [giftBoxName, setGiftBoxName] = useState('');
  const [recipientName, setRecipientName] = useState('');
  const [message, setMessage] = useState('');

  // Get only traditional sweets, excluding specific ones for gift boxes
  const excludedSweets = ['Gulab Jamun', 'Rasmalai', 'Rasgulla', 'Sponch'];
  const traditionalSweets = products.filter(product => 
    product.category === 'Traditional' && 
    !excludedSweets.includes(product.name)
  );

  const handleAddSweet = (product: typeof products[0]) => {
    if (selectedSweets.length >= 4) {
      alert('You can only select up to 4 sweets for your gift box!');
      return;
    }

    const existingSweet = selectedSweets.find(sweet => sweet.product.id === product.id);
    if (existingSweet) {
      setSelectedSweets(prev => 
        prev.map(sweet => 
          sweet.product.id === product.id 
            ? { ...sweet, quantity: Math.min(sweet.quantity + 1, 2) }
            : sweet
        )
      );
    } else {
      setSelectedSweets(prev => [...prev, { product, quantity: 1 }]);
    }
  };

  const handleRemoveSweet = (productId: number) => {
    setSelectedSweets(prev => prev.filter(sweet => sweet.product.id !== productId));
  };

  const handleQuantityChange = (productId: number, newQuantity: number) => {
    if (newQuantity < 1 || newQuantity > 2) return;
    
    setSelectedSweets(prev => 
      prev.map(sweet => 
        sweet.product.id === productId 
          ? { ...sweet, quantity: newQuantity }
          : sweet
      )
    );
  };

  const getTotalPrice = () => {
    return selectedSweets.reduce((total, sweet) => {
      return total + (sweet.product.price * sweet.quantity);
    }, 0);
  };

  const getTotalItems = () => {
    return selectedSweets.reduce((total, sweet) => total + sweet.quantity, 0);
  };

  const handleAddToCart = () => {
    if (selectedSweets.length === 0) {
      alert('Please select at least one sweet for your gift box!');
      return;
    }

    if (selectedSweets.length < 4) {
      alert('Please select exactly 4 sweets for your gift box!');
      return;
    }

    // Create a custom gift box product
    const giftBoxProduct = {
      id: Date.now(), // Unique ID for the custom gift box
      name: giftBoxName || 'Custom Gift Box',
      description: `Custom gift box containing: ${selectedSweets.map(s => `${s.quantity}x ${s.product.name}`).join(', ')}`,
      price: getTotalPrice(),
      image: '/images/giftBox.webp',
      category: 'Gift Box',
      rating: 4.8,
      unit: 'per box',
      popular: true,
      customGiftBox: true,
      selectedSweets: selectedSweets
    };

    addToCart(giftBoxProduct);
    setShowCart(true);
  };

  const handleCloseCart = () => {
    setShowCart(false);
  };

  const handleCheckout = () => {
    navigate('/checkout');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header onShowAllProducts={() => {}} />
      
      {/* Hero Section */}
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
                src="/images/giftBox.webp" 
                alt="Custom Gift Box"
                className="w-32 h-32 mx-auto rounded-full object-cover shadow-lg"
              />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Build Your <span className="text-orange-600">Custom Gift Box</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Create a personalized gift box by selecting 4 of your favorite traditional sweets
            </p>
            <div className="text-lg text-gray-700">
              <span className="font-semibold">{traditionalSweets.length} traditional sweets</span> to choose from
            </div>
          </div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute top-10 left-10 w-20 h-20 bg-orange-200 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute bottom-10 right-10 w-32 h-32 bg-yellow-200 rounded-full opacity-20 animate-pulse delay-1000"></div>
      </section>

      {/* Gift Box Builder Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            
            {/* Left Column - Sweet Selection */}
            <div className="lg:col-span-2">
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  Select Your Sweets
                </h2>
                <p className="text-gray-600">
                  Choose exactly 4 sweets for your gift box. You can select up to 2 of each sweet.
                </p>
                <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                  <p className="text-blue-800 text-sm">
                    <strong>Progress:</strong> {selectedSweets.length}/4 sweets selected
                  </p>
                  {selectedSweets.length === 4 && (
                    <p className="text-green-600 text-sm mt-1">
                      ✓ Perfect! You've selected 4 sweets. You can now customize your gift box.
                    </p>
                  )}
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {traditionalSweets.map((sweet) => {
                  const selectedSweet = selectedSweets.find(s => s.product.id === sweet.id);
                  const isSelected = !!selectedSweet;
                  const isDisabled = !isSelected && selectedSweets.length >= 4;

                  return (
                    <div 
                      key={sweet.id} 
                      className={`border-2 rounded-lg p-4 transition-all duration-200 ${
                        isSelected 
                          ? 'border-orange-500 bg-orange-50' 
                          : isDisabled 
                            ? 'border-gray-200 bg-gray-50 opacity-60' 
                            : 'border-gray-200 bg-white hover:border-orange-300 hover:shadow-md'
                      }`}
                    >
                      <div className="flex items-start space-x-4">
                        <img
                          src={sweet.image}
                          alt={sweet.name}
                          className="w-20 h-20 object-cover rounded-lg"
                        />
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 mb-1">{sweet.name}</h3>
                          <p className="text-sm text-gray-600 mb-2">{sweet.description}</p>
                          <p className="text-orange-600 font-semibold">₹{sweet.price}</p>
                          
                          {isSelected ? (
                            <div className="flex items-center space-x-2 mt-3">
                              <button
                                onClick={() => handleQuantityChange(sweet.id, selectedSweet.quantity - 1)}
                                disabled={selectedSweet.quantity <= 1}
                                className="p-1 text-gray-500 hover:text-gray-700 disabled:opacity-50"
                              >
                                <Minus className="h-4 w-4" />
                              </button>
                              <span className="w-8 text-center font-semibold">{selectedSweet.quantity}</span>
                              <button
                                onClick={() => handleQuantityChange(sweet.id, selectedSweet.quantity + 1)}
                                disabled={selectedSweet.quantity >= 2}
                                className="p-1 text-gray-500 hover:text-gray-700 disabled:opacity-50"
                              >
                                <Plus className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => handleRemoveSweet(sweet.id)}
                                className="ml-2 p-1 text-red-500 hover:text-red-700"
                              >
                                <X className="h-4 w-4" />
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => handleAddSweet(sweet)}
                              disabled={isDisabled}
                              className={`mt-3 px-4 py-2 rounded-lg font-medium transition-colors ${
                                isDisabled
                                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                  : 'bg-orange-600 text-white hover:bg-orange-700'
                              }`}
                            >
                              {isDisabled ? 'Max Reached' : 'Add Sweet'}
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right Column - Gift Box Details & Cart */}
            <div className="lg:col-span-1">
              <div className="sticky top-24">
                {/* Gift Box Customization */}
                <div className="bg-gray-50 rounded-lg p-6 mb-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">
                    Customize Your Gift Box
                  </h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Gift Box Name
                      </label>
                      <input
                        type="text"
                        value={giftBoxName}
                        onChange={(e) => setGiftBoxName(e.target.value)}
                        placeholder="e.g., Birthday Special"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Recipient Name
                      </label>
                      <input
                        type="text"
                        value={recipientName}
                        onChange={(e) => setRecipientName(e.target.value)}
                        placeholder="Who is this for?"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Personal Message
                      </label>
                      <textarea
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Add a personal note..."
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>

                {/* Selected Sweets Summary */}
                <div className="bg-white border rounded-lg p-6 mb-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">
                    Your Gift Box ({selectedSweets.length}/4)
                  </h3>
                  
                  {selectedSweets.length === 0 ? (
                    <p className="text-gray-500 text-center py-8">
                      No sweets selected yet
                    </p>
                  ) : (
                    <div className="space-y-3">
                      {selectedSweets.map((sweet) => (
                        <div key={sweet.product.id} className="flex justify-between items-center">
                          <div className="flex items-center space-x-3">
                            <img
                              src={sweet.product.image}
                              alt={sweet.product.name}
                              className="w-10 h-10 object-cover rounded"
                            />
                            <div>
                              <p className="font-medium text-gray-900">{sweet.product.name}</p>
                              <p className="text-sm text-gray-600">Qty: {sweet.quantity}</p>
                            </div>
                          </div>
                          <p className="font-semibold text-gray-900">
                            ₹{sweet.product.price * sweet.quantity}
                          </p>
                        </div>
                      ))}
                      
                      <div className="border-t pt-3">
                        <div className="flex justify-between items-center font-semibold">
                          <span>Total:</span>
                          <span className="text-orange-600">₹{getTotalPrice()}</span>
                        </div>
                        <div className="text-sm text-gray-600">
                          {getTotalItems()} items
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Add to Cart Button */}
                <button
                  onClick={handleAddToCart}
                  disabled={selectedSweets.length !== 4}
                  className={`w-full py-3 px-6 rounded-lg font-semibold text-lg transition-colors ${
                    selectedSweets.length === 4
                      ? 'bg-orange-600 text-white hover:bg-orange-700'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  {selectedSweets.length === 4 ? 'Add Gift Box to Cart' : 'Select 4 Sweets'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Cart Modal */}
      {showCart && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black bg-opacity-50" onClick={handleCloseCart}></div>
          <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <ShoppingCart className="h-10 w-10 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Gift Box Added!</h2>
            <p className="text-gray-600 mb-6">
              Your custom gift box has been added to the cart successfully!
            </p>
            <div className="flex space-x-3 justify-center">
              <button
                onClick={handleCloseCart}
                className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors"
              >
                Continue Shopping
              </button>
              <button
                onClick={handleCheckout}
                className="bg-orange-600 text-white px-6 py-3 rounded-lg hover:bg-orange-700 transition-colors"
              >
                Go to Checkout
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default GiftBoxBuilder;
