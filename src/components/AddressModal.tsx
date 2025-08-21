import React, { useState, useEffect } from 'react';
import { X, MapPin, Home, Briefcase, Plus, Navigation } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import MapPickerModal from './MapPickerModal';

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
    houseNumber: '',
    isDefault: false,
  });
  const [isCheckingDelivery, setIsCheckingDelivery] = useState(false);
  const [deliveryAvailable, setDeliveryAvailable] = useState<boolean | null>(null);
  const [error, setError] = useState('');
  const [showMapModal, setShowMapModal] = useState(false);
  const [mapInitialPos, setMapInitialPos] = useState<{ lat: number; lng: number }>({ lat: 28.6139, lng: 77.2090 }); // Default: Delhi

  const { addAddress, updateAddress, checkDeliveryAvailability, getCurrentLocation, setManualLocation, currentLocation } = useAuth();

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
        houseNumber: '',
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
      const pos = await getCurrentLocation();
      // Use returned coords immediately for accuracy
      setMapInitialPos({ lat: pos.lat, lng: pos.lng });
      setShowMapModal(true);
    } catch (error) {
      console.error('Location error:', error);
      setMapInitialPos({ lat: 28.6139, lng: 77.2090 });
      setShowMapModal(true);
    }
  };

  const handleMapSelect = (address: string, coordinates: { lat: number; lng: number }, geoapifyProps: any) => {
    console.log('📍 MapPicker result:', { address, coordinates, geoapifyProps });
    
    setFormData(prev => ({
      ...prev,
      address: address || '',
      city: geoapifyProps?.city || '',
      state: geoapifyProps?.state || '',
      pincode: geoapifyProps?.pincode || '',
      landmark: geoapifyProps?.landmark || '',
      houseNumber: geoapifyProps?.houseNumber || '',
    }));
    setShowMapModal(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.name || !formData.address || !formData.city || !formData.state || !formData.pincode) {
      setError('Please fill in all required fields (Name, Address, City, State, Pincode)');
      return;
    }

    if (formData.pincode.length !== 6) {
      setError('Please enter a valid 6-digit pincode');
      return;
    }

    try {
      if (editAddress) {
        await updateAddress(editAddress.id, formData);
      } else {
        await addAddress(formData);
      }
      setError('');
      onClose();
    } catch (error: any) {
      console.error('❌ Save address error:', error);
      if (error.message?.includes('not authenticated')) {
        setError('Please log in again to save your address');
      } else if (error.message?.includes('row-level security')) {
        setError('Permission denied. Please try logging in again.');
      } else {
        setError('Failed to save address. Please try again.');
      }
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'home': return <Home className="h-5 w-5" />;
      case 'work': return <Briefcase className="h-5 w-5" />;
      default: return <MapPin className="h-5 w-5" />;
    }
  };

  const isPincodeMissing = !formData.pincode || formData.pincode.length !== 6;
  const isAnyRequiredFieldMissing = !formData.name || !formData.address || !formData.city || !formData.state || isPincodeMissing;

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
              <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                <X className="h-6 w-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Address Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Address Type</label>
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
                        formData.type === value ? 'border-orange-500 bg-orange-50 text-orange-600' : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                      <span className="text-xs font-medium">{label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Current Location Button */}
              <button
                type="button"
                onClick={handleUseCurrentLocation}
                className="w-full flex items-center justify-center space-x-2 py-2 text-orange-600 border border-orange-200 rounded-lg hover:bg-orange-50 transition-colors"
              >
                <Navigation className="h-4 w-4" />
                <span className="text-sm font-medium">Use Current Location & Search Address</span>
              </button>

              {/* Address Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Address *</label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="House number, street, area"
                  required
                />
              </div>

              {/* City, State, Pincode Fields */}
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">City *</label>
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">State *</label>
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
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Pincode *</label>
                  <input
                    type="text"
                    name="pincode"
                    value={formData.pincode}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="Pincode"
                    required
                  />
                </div>
              </div>

              {/* Landmark Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Landmark (Optional)</label>
                <input
                  type="text"
                  name="landmark"
                  value={formData.landmark}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="e.g., Near Metro Station, Opposite Mall"
                />
              </div>

              {isPincodeMissing && (
                <div className="text-orange-600 text-sm bg-orange-50 p-2 rounded-lg mb-2">We couldn’t detect your pincode. Please enter it manually.</div>
              )}
              {isAnyRequiredFieldMissing && (
                <div className="text-red-600 text-sm bg-red-50 p-2 rounded-lg mb-2">Please fill in all required address fields.</div>
              )}

              {/* Default Address Checkbox */}
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name="isDefault"
                  checked={formData.isDefault}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
                />
                <label className="text-sm text-gray-700">Set as default address</label>
              </div>

              {error && <div className="text-red-600 text-sm bg-red-50 p-2 rounded-lg">{error}</div>}

              <button type="submit" className="w-full bg-orange-600 text-white py-3 rounded-lg font-semibold hover:bg-orange-700 transition-colors" disabled={isAnyRequiredFieldMissing || deliveryAvailable === false}>
                {editAddress ? 'Update Address' : 'Save Address'}
              </button>
            </form>
          </div>
        </div>

        <MapPickerModal isOpen={showMapModal} onClose={() => setShowMapModal(false)} initialPosition={mapInitialPos} onSelect={handleMapSelect} />
      </div>
    </div>
  );
};

export default AddressModal;