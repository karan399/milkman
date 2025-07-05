import React, { useState, useEffect } from 'react';
import { X, MapPin, Home, Briefcase, Plus, Navigation } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface AddressModalProps {
  isOpen: boolean;
  onClose: () => void;
  editAddress?: any;
}

const AddressModal: React.FC<AddressModalProps> = ({ isOpen, onClose, editAddress }) => {
  const [formData, setFormData] = useState({
    type: 'home' as 'home' | 'work' | 'other',
    name: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    landmark: '',
    isDefault: false,
  });
  const [isCheckingDelivery, setIsCheckingDelivery] = useState(false);
  const [deliveryAvailable, setDeliveryAvailable] = useState<boolean | null>(null);
  const [error, setError] = useState('');

  const { addAddress, updateAddress, checkDeliveryAvailability, getCurrentLocation, currentLocation } = useAuth();

  useEffect(() => {
    if (editAddress) {
      setFormData(editAddress);
    } else {
      setFormData({
        type: 'home',
        name: '',
        address: '',
        city: '',
        state: '',
        pincode: '',
        landmark: '',
        isDefault: false,
      });
    }
  }, [editAddress, isOpen]);

  if (!isOpen) return null;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));

    // Check delivery availability when pincode changes
    if (name === 'pincode' && value.length === 6) {
      checkDelivery(value);
    }
  };

  const checkDelivery = async (pincode: string) => {
    setIsCheckingDelivery(true);
    setDeliveryAvailable(null);
    
    try {
      const available = await checkDeliveryAvailability(pincode);
      setDeliveryAvailable(available);
    } catch (error) {
      console.error('Error checking delivery:', error);
    } finally {
      setIsCheckingDelivery(false);
    }
  };

  const handleUseCurrentLocation = async () => {
    try {
      await getCurrentLocation();
      if (currentLocation) {
        setFormData(prev => ({
          ...prev,
          address: currentLocation.address || 'Current Location',
          city: 'Mumbai', // Demo
          state: 'Maharashtra', // Demo
        }));
      }
    } catch (error) {
      setError('Unable to get current location. Please enter manually.');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.name || !formData.address || !formData.city || !formData.pincode) {
      setError('Please fill in all required fields');
      return;
    }

    if (formData.pincode.length !== 6) {
      setError('Please enter a valid 6-digit pincode');
      return;
    }

    if (deliveryAvailable === false) {
      setError('Sorry, we don\'t deliver to this pincode yet');
      return;
    }

    try {
      if (editAddress) {
        updateAddress(editAddress.id, formData);
      } else {
        addAddress(formData);
      }
      onClose();
    } catch (error) {
      setError('Failed to save address. Please try again.');
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'home': return <Home className="h-5 w-5" />;
      case 'work': return <Briefcase className="h-5 w-5" />;
      default: return <MapPin className="h-5 w-5" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onClose}></div>
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">
                {editAddress ? 'Edit Address' : 'Add New Address'}
              </h2>
              <button
                onClick={onClose}
                className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Address Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Address Type
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { value: 'home', label: 'Home', icon: Home },
                    { value: 'work', label: 'Work', icon: Briefcase },
                    { value: 'other', label: 'Other', icon: MapPin },
                  ].map(({ value, label, icon: Icon }) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, type: value as any }))}
                      className={`p-3 border rounded-lg flex flex-col items-center space-y-1 transition-colors ${
                        formData.type === value
                          ? 'border-orange-500 bg-orange-50 text-orange-600'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                      <span className="text-xs font-medium">{label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Address Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Address Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="e.g., Home, Office, Mom's Place"
                  required
                />
              </div>

              {/* Current Location Button */}
              <button
                type="button"
                onClick={handleUseCurrentLocation}
                className="w-full flex items-center justify-center space-x-2 py-2 text-orange-600 border border-orange-200 rounded-lg hover:bg-orange-50 transition-colors"
              >
                <Navigation className="h-4 w-4" />
                <span className="text-sm font-medium">Use Current Location</span>
              </button>

              {/* Address */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Complete Address *
                </label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="House/Flat/Office No., Building Name, Street Name"
                  required
                />
              </div>

              {/* City and State */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    City *
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="City"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    State *
                  </label>
                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="State"
                    required
                  />
                </div>
              </div>

              {/* Pincode */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Pincode *
                </label>
                <input
                  type="text"
                  name="pincode"
                  value={formData.pincode}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="6-digit pincode"
                  maxLength={6}
                  required
                />
                {isCheckingDelivery && (
                  <p className="text-sm text-gray-500 mt-1">Checking delivery availability...</p>
                )}
                {deliveryAvailable === true && (
                  <p className="text-sm text-green-600 mt-1">✓ Delivery available in this area</p>
                )}
                {deliveryAvailable === false && (
                  <p className="text-sm text-red-600 mt-1">✗ Sorry, we don't deliver to this area yet</p>
                )}
              </div>

              {/* Landmark */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Landmark (Optional)
                </label>
                <input
                  type="text"
                  name="landmark"
                  value={formData.landmark}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="Nearby landmark for easy delivery"
                />
              </div>

              {/* Default Address */}
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="isDefault"
                  checked={formData.isDefault}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                />
                <label className="ml-2 text-sm text-gray-700">
                  Set as default delivery address
                </label>
              </div>

              {error && (
                <div className="text-red-600 text-sm bg-red-50 p-3 rounded-lg">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={deliveryAvailable === false}
                className="w-full bg-orange-600 text-white py-3 rounded-lg font-semibold hover:bg-orange-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {editAddress ? 'Update Address' : 'Save Address'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddressModal;