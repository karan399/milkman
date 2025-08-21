import React, { useState } from 'react';
import { X, User, MapPin, Plus, Edit2, Trash2, Home, Briefcase } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import AddressModal from './AddressModal';
import { getEmailValidationError } from '../lib/utils';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ProfileModal: React.FC<ProfileModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'profile' | 'addresses'>('profile');
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [profileData, setProfileData] = useState({ name: '', email: '' });
  const [emailError, setEmailError] = useState<string | null>(null);

  const { user, updateProfile, deleteAddress, setDefaultAddress, logout } = useAuth();

  if (!isOpen || !user) return null;

  const handleProfileUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate email
    const emailValidationError = getEmailValidationError(profileData.email);
    if (emailValidationError) {
      setEmailError(emailValidationError);
      return;
    }
    
    setEmailError(null);
    updateProfile(profileData);
    onClose();
  };

  const handleEditAddress = (address: any) => {
    setEditingAddress(address);
    setIsAddressModalOpen(true);
  };

  const handleDeleteAddress = (addressId: string) => {
    if (confirm('Are you sure you want to delete this address?')) {
      deleteAddress(addressId);
    }
  };

  const getAddressIcon = (type: string) => {
    switch (type) {
      case 'home': return <Home className="h-4 w-4" />;
      case 'work': return <Briefcase className="h-4 w-4" />;
      default: return <MapPin className="h-4 w-4" />;
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-50 overflow-hidden">
        <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onClose}></div>
        <div className="absolute inset-0 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">My Account</h2>
                <button
                  onClick={onClose}
                  className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              {/* Tabs */}
              <div className="flex space-x-1 mb-6 bg-gray-100 p-1 rounded-lg">
                <button
                  onClick={() => setActiveTab('profile')}
                  className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                    activeTab === 'profile'
                      ? 'bg-white text-orange-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <User className="h-4 w-4 inline mr-2" />
                  Profile
                </button>
                <button
                  onClick={() => setActiveTab('addresses')}
                  className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                    activeTab === 'addresses'
                      ? 'bg-white text-orange-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <MapPin className="h-4 w-4 inline mr-2" />
                  Addresses
                </button>
              </div>

              {/* Profile Tab */}
              {activeTab === 'profile' && (
                <div className="space-y-6">
                  <div className="text-center">
                    <div className="bg-orange-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <User className="h-10 w-10 text-orange-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">{user.name || 'User'}</h3>
                    <p className="text-gray-600">{user.phone}</p>
                  </div>

                  <form onSubmit={handleProfileUpdate} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Full Name
                      </label>
                      <input
                        type="text"
                        value={profileData.name || user.name || ''}
                        onChange={(e) => setProfileData(prev => ({ ...prev, name: e.target.value }))}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        placeholder="Enter your full name"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        value={profileData.email || user.email || ''}
                        onChange={(e) => {
                          const email = e.target.value;
                          setProfileData(prev => ({ ...prev, email }));
                          setEmailError(getEmailValidationError(email));
                        }}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                          emailError ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="your@email.com"
                      />
                      {emailError && (
                        <p className="text-red-500 text-sm mt-1">{emailError}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        value={user.phone}
                        disabled
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
                      />
                      <p className="text-xs text-gray-500 mt-1">Phone number cannot be changed</p>
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-orange-600 text-white py-3 rounded-lg font-semibold hover:bg-orange-700 transition-colors"
                    >
                      Update Profile
                    </button>
                  </form>

                  <div className="pt-6 border-t">
                    <button
                      onClick={logout}
                      className="w-full text-red-600 py-2 font-medium hover:text-red-700 transition-colors"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              )}

              {/* Addresses Tab */}
              {activeTab === 'addresses' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900">Saved Addresses</h3>
                    <button
                      onClick={() => {
                        setEditingAddress(null);
                        setIsAddressModalOpen(true);
                      }}
                      className="flex items-center space-x-2 bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors"
                    >
                      <Plus className="h-4 w-4" />
                      <span>Add Address</span>
                    </button>
                  </div>

                  {user.addresses.length === 0 ? (
                    <div className="text-center py-12">
                      <MapPin className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500 mb-4">No addresses saved yet</p>
                      <button
                        onClick={() => {
                          setEditingAddress(null);
                          setIsAddressModalOpen(true);
                        }}
                        className="bg-orange-600 text-white px-6 py-2 rounded-lg hover:bg-orange-700 transition-colors"
                      >
                        Add Your First Address
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {user.addresses.map((address) => (
                        <div
                          key={address.id}
                          className={`p-4 border rounded-lg ${
                            address.isDefault ? 'border-orange-500 bg-orange-50' : 'border-gray-200'
                          }`}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-2">
                                {getAddressIcon(address.type)}
                                <span className="font-semibold text-gray-900">{address.name}</span>
                                {address.isDefault && (
                                  <span className="bg-orange-600 text-white text-xs px-2 py-1 rounded-full">
                                    Default
                                  </span>
                                )}
                              </div>
                              <p className="text-gray-600 text-sm mb-1">
                                {address.address}
                              </p>
                              <p className="text-gray-600 text-sm">
                                {address.city}, {address.state} - {address.pincode}
                              </p>
                              {address.landmark && (
                                <p className="text-gray-500 text-xs mt-1">
                                  Near {address.landmark}
                                </p>
                              )}
                            </div>
                            <div className="flex items-center space-x-2 ml-4">
                              <button
                                onClick={() => handleEditAddress(address)}
                                className="p-2 text-gray-400 hover:text-orange-600 transition-colors"
                              >
                                <Edit2 className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteAddress(address.id)}
                                className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                          {!address.isDefault && (
                            <button
                              onClick={() => setDefaultAddress(address.id)}
                              className="mt-2 text-sm text-orange-600 hover:text-orange-700 transition-colors"
                            >
                              Set as Default
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <AddressModal
        isOpen={isAddressModalOpen}
        onClose={() => {
          setIsAddressModalOpen(false);
          setEditingAddress(null);
        }}
        editAddress={editingAddress}
      />
    </>
  );
};

export default ProfileModal;