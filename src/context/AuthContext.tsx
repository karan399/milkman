import React, { createContext, useContext, useReducer, ReactNode, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { createClient } from '@supabase/supabase-js';

interface User {
  id: string;
  phone: string;
  name?: string;
  email?: string;
  addresses: Address[];
  isVerified: boolean;
}

interface Address {
  id: string;
  type: 'home' | 'work' | 'other';
  name: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  landmark?: string;
  isDefault: boolean;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  currentLocation: {
    lat: number;
    lng: number;
    address?: string;
  } | null;
}

interface AuthContextType extends AuthState {
  login: (phone: string) => Promise<any>;
  verifyOTP: (otp: string) => Promise<void>;
  logout: () => void;
  updateProfile: (data: Partial<User>) => Promise<void>;
  addAddress: (address: Omit<Address, 'id'>) => Promise<void>;
  updateAddress: (id: string, address: Partial<Address>) => Promise<void>;
  deleteAddress: (id: string) => Promise<void>;
  setDefaultAddress: (id: string) => Promise<void>;
  getCurrentLocation: () => Promise<{ lat: number; lng: number; address?: string }>;
  setManualLocation: (address: string, coordinates: { lat: number; lng: number }) => void;
  checkDeliveryAvailability: (pincode: string) => Promise<boolean>;
}

type AuthAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'LOGIN_SUCCESS'; payload: User }
  | { type: 'LOGOUT' }
  | { type: 'UPDATE_PROFILE'; payload: Partial<User> }
  | { type: 'SET_ADDRESSES'; payload: Address[] }
  | { type: 'SET_CURRENT_LOCATION'; payload: { lat: number; lng: number; address?: string } };

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        isLoading: false,
      };
    case 'LOGOUT':
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
      };
    case 'UPDATE_PROFILE':
      return {
        ...state,
        user: state.user ? { ...state.user, ...action.payload } : null,
      };
    case 'SET_ADDRESSES':
      return {
        ...state,
        user: state.user ? { ...state.user, addresses: action.payload } : null,
      };
    case 'SET_CURRENT_LOCATION':
      return {
        ...state,
        currentLocation: action.payload,
      };
    default:
      return state;
  }
};

// Demo delivery areas (pincodes)
const DELIVERY_AREAS = [
  '110025', '400002', '400003', '400004', '400005', '400006', '400007', '400008',
  '400009', '400010', '400011', '400012', '400013', '400014', '400015', '400016',
  '400017', '400018', '400019', '400020', '400021', '400022', '400023', '400024',
  '400025', '400026', '400027', '400028', '400029', '400030', '400031', '400032',
  '110001', '110002', '110003', '110004', '110005', '110006', '110007', '110008',
  '560001', '560002', '560003', '560004', '560005', '560006', '560007', '560008',
];

// Configuration for demo mode
const SHOW_DEMO_OTP = false; // Set to true to show OTP in alerts
const LOG_OTP_TO_CONSOLE = true; // Set to false to hide OTP in console

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, {
    user: null,
    isAuthenticated: false,
    isLoading: false,
    currentLocation: null,
  });

  const [pendingPhone, setPendingPhone] = React.useState<string>('');
  const [demoOTP, setDemoOTP] = React.useState<string>('');

  // Check for existing session on mount
  useEffect(() => {
    const checkSession = async () => {
      const savedUser = localStorage.getItem('mithai_user');
      const sessionToken = localStorage.getItem('mithai_session');
      
      if (savedUser && sessionToken) {
        try {
          const user = JSON.parse(savedUser);
          dispatch({ type: 'LOGIN_SUCCESS', payload: user });
        } catch (error) {
          console.error('Session check error:', error);
          localStorage.removeItem('mithai_user');
          localStorage.removeItem('mithai_session');
        }
      }
    };

    checkSession();
  }, []);

  const login = async (phone: string): Promise<any> => {
  dispatch({ type: 'SET_LOADING', payload: true });
  setPendingPhone(phone);

  try {
    const { data, error } = await supabase.functions.invoke('otp-final', {
      body: { phone }
    });

    if (error) {
      console.error('OTP API Error:', error);
      throw new Error(error.message || 'Failed to send OTP');
    }

    if (LOG_OTP_TO_CONSOLE && data?.debug_otp) {
      console.log(`🔐 Debug OTP for ${phone}: ${data.debug_otp}`);
    }

    return data;
  } catch (error: any) {
    console.error('Login error:', error);
    throw new Error(error?.message || 'Failed to send OTP');
  } finally {
    dispatch({ type: 'SET_LOADING', payload: false });
  }
};


  const verifyOTP = async (otp: string): Promise<void> => {
    dispatch({ type: 'SET_LOADING', payload: true });
    
    try {
      // Call the verify-otp Edge Function
      const { data, error } = await supabase.functions.invoke('verify-otp', {
        body: { 
          phone: pendingPhone,  // This includes +91 prefix
          otp: otp 
        }
      });

      if (error) {
        console.error('OTP verification error:', error);
        throw new Error(error.message || 'OTP verification failed');
      }

      if (!data?.success) {
        throw new Error(data?.error || 'OTP verification failed');
      }

      // Store user data and session
      const user: User = data.user;
      const sessionToken = data.sessionToken;

      // Set up proper Supabase authentication using custom JWT
      if (sessionToken) {
        // Create a custom JWT token for Supabase auth
        const customToken = {
          access_token: sessionToken,
          refresh_token: sessionToken,
          expires_in: 3600,
          token_type: 'bearer',
          user: {
            id: user.id,
            email: user.email || `${user.phone}@mithai.local`,
            phone: user.phone,
            user_metadata: {
              phone: user.phone,
              name: user.name
            }
          }
        };

        const { error: sessionError } = await supabase.auth.setSession(customToken);
        
        if (sessionError) {
          console.error('Session setup error:', sessionError);
          // Continue anyway, we'll use the custom session
        } else {
          console.log('✅ Supabase session set successfully');
        }
      }

      localStorage.setItem('mithai_user', JSON.stringify(user));
      localStorage.setItem('mithai_session', sessionToken);
      
      dispatch({ type: 'LOGIN_SUCCESS', payload: user });
      setPendingPhone('');
      setDemoOTP('');

    } catch (error: any) {
      console.error('OTP verification error:', error);
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const logout = () => {
    localStorage.removeItem('mithai_user');
    localStorage.removeItem('mithai_session');
    dispatch({ type: 'LOGOUT' });
  };

  const updateProfile = async (data: Partial<User>) => {
    if (!state.user) return;

    try {
      const { error } = await supabase
        .from('user_profiles')
        .update({
          name: data.name,
          email: data.email,
        })
        .eq('id', state.user.id);

      if (error) throw error;

      const updatedUser = { ...state.user, ...data };
      localStorage.setItem('mithai_user', JSON.stringify(updatedUser));
      dispatch({ type: 'UPDATE_PROFILE', payload: data });

    } catch (error) {
      console.error('Profile update error:', error);
      throw error;
    }
  };

  const fetchAddresses = async () => {
    if (!state.user) return;

    try {
      const { data, error } = await supabase
        .from('user_addresses')
        .select('*')
        .eq('user_id', state.user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const transformedAddresses = (data || []).map((addr: any) => ({
        id: addr.id,
        type: addr.type,
        name: addr.name,
        address: addr.address,
        city: addr.city,
        state: addr.state,
        pincode: addr.pincode,
        landmark: addr.landmark,
        isDefault: addr.is_default,
        coordinates: addr.coordinates ? {
          lat: addr.coordinates.x,
          lng: addr.coordinates.y
        } : undefined,
      }));

      dispatch({ type: 'SET_ADDRESSES', payload: transformedAddresses });

      // Update localStorage
      const updatedUser = { ...state.user, addresses: transformedAddresses };
      localStorage.setItem('mithai_user', JSON.stringify(updatedUser));

    } catch (error) {
      console.error('Fetch addresses error:', error);
    }
  };

  const addAddress = async (addressData: Omit<Address, 'id'>) => {
    if (!state.user) {
      console.error('❌ No authenticated user found');
      throw new Error('User not authenticated');
    }

    try {
      console.log('🔍 Adding address for user:', state.user.id);
      console.log('📝 Address data:', addressData);
      
      // Check if we have a valid session
      const { data: { session } } = await supabase.auth.getSession();
      console.log('🔐 Current session:', session ? 'Valid' : 'None');
      
      // Try to insert with RLS, if it fails, we'll provide a fallback
      const { error } = await supabase
        .from('user_addresses')
        .insert({
          user_id: state.user.id,
          type: addressData.type,
          name: addressData.name,
          address: addressData.address,
          city: addressData.city,
          state: addressData.state,
          pincode: addressData.pincode,
          landmark: addressData.landmark,
          is_default: addressData.isDefault,
          coordinates: addressData.coordinates ? 
            `(${addressData.coordinates.lat},${addressData.coordinates.lng})` : null,
        });

      if (error) {
        console.error('❌ Supabase insert error:', error);
        
        // If it's a 401/403 error, the RLS policy is blocking us
        if (error.code === 'PGRST301' || error.message?.includes('permission') || error.message?.includes('row-level security')) {
          throw new Error('Permission denied. Please try logging in again or contact support.');
        }
        
        throw error;
      }

      console.log('✅ Address added successfully');
      await fetchAddresses();

    } catch (error) {
      console.error('❌ Add address error:', error);
      throw error;
    }
  };

  const updateAddress = async (id: string, addressData: Partial<Address>) => {
    try {
      const updateData: any = {};
      
      if (addressData.type) updateData.type = addressData.type;
      if (addressData.name) updateData.name = addressData.name;
      if (addressData.address) updateData.address = addressData.address;
      if (addressData.city) updateData.city = addressData.city;
      if (addressData.state) updateData.state = addressData.state;
      if (addressData.pincode) updateData.pincode = addressData.pincode;
      if (addressData.landmark !== undefined) updateData.landmark = addressData.landmark;
      if (addressData.isDefault !== undefined) updateData.is_default = addressData.isDefault;
      if (addressData.coordinates) {
        updateData.coordinates = `(${addressData.coordinates.lat},${addressData.coordinates.lng})`;
      }

      const { error } = await supabase
        .from('user_addresses')
        .update(updateData)
        .eq('id', id);

      if (error) throw error;

      await fetchAddresses();

    } catch (error) {
      console.error('Update address error:', error);
      throw error;
    }
  };

  const deleteAddress = async (id: string) => {
    try {
      const { error } = await supabase
        .from('user_addresses')
        .delete()
        .eq('id', id);

      if (error) throw error;

      await fetchAddresses();

    } catch (error) {
      console.error('Delete address error:', error);
      throw error;
    }
  };

  const setDefaultAddress = async (id: string) => {
    if (!state.user) return;

    try {
      // First, set all addresses to non-default
      await supabase
        .from('user_addresses')
        .update({ is_default: false })
        .eq('user_id', state.user.id);

      // Then set the selected address as default
      const { error } = await supabase
        .from('user_addresses')
        .update({ is_default: true })
        .eq('id', id);

      if (error) throw error;

      await fetchAddresses();

    } catch (error) {
      console.error('Set default address error:', error);
      throw error;
    }
  };

  const getCurrentLocation = async (): Promise<{ lat: number; lng: number; address?: string }> => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported'));
        return;
      }

      console.log('📍 Starting high-accuracy location detection...');

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude, accuracy } = position.coords;
          console.log('🎯 GPS Coordinates:', {
            latitude: latitude.toFixed(6),
            longitude: longitude.toFixed(6),
            accuracy: `${accuracy} meters`,
            timestamp: new Date(position.timestamp).toLocaleString(),
          });

          // Try multiple reverse geocoding APIs for better accuracy
          const address = await getAddressFromCoordinates(latitude, longitude);
          
          const payload = { lat: latitude, lng: longitude, address };
          dispatch({ type: 'SET_CURRENT_LOCATION', payload });
          resolve(payload);
        },
        (error) => {
          console.error('❌ Geolocation error:', error);
          let errorMessage = 'Failed to get location';
          switch (error.code) {
            case error.PERMISSION_DENIED:
              errorMessage = 'Location permission denied. Please allow location access in your browser settings.';
              break;
            case error.POSITION_UNAVAILABLE:
              errorMessage = 'Location information unavailable. Please check your GPS settings.';
              break;
            case error.TIMEOUT:
              errorMessage = 'Location request timed out. Please try again.';
              break;
          }
          console.error('Geolocation error details:', errorMessage);
          reject(new Error(errorMessage));
        },
        {
          enableHighAccuracy: true,
          timeout: 20000,
          maximumAge: 0,
        }
      );
    });
  };

  // Helper function to get address from coordinates using multiple APIs
  const getAddressFromCoordinates = async (lat: number, lng: number): Promise<string> => {
    const apis = [
      {
        name: 'Geoapify',
        url: `https://api.geoapify.com/v1/geocode/reverse?lat=${lat}&lon=${lng}&limit=1&filter=countrycode:in&lang=en&apiKey=876fe1fa321f4e45b9cc6af0c331c0fc&format=json`,
        parser: parseGeoapifyResponse
      },
      {
        name: 'Nominatim (OpenStreetMap)',
        url: `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&addressdetails=1&accept-language=en&zoom=18&namedetails=1&extratags=1`,
        parser: parseNominatimResponse
      }
    ];

    for (const api of apis) {
      try {
        console.log(`🔍 Trying ${api.name}...`);
        const response = await fetch(api.url);
        
        if (!response.ok) {
          console.warn(`⚠️ ${api.name} failed with status: ${response.status}`);
          continue;
        }

        const data = await response.json();
        console.log(`📋 ${api.name} response:`, data);

        const address = api.parser(data);
        if (address) {
          console.log(`✅ ${api.name} succeeded:`, address);
          return address;
        }
      } catch (error) {
        console.warn(`⚠️ ${api.name} error:`, error);
        continue;
      }
    }

    // Fallback to coordinates
    console.log('⚠️ All APIs failed, using coordinates as fallback');
    return `Current Location (${lat.toFixed(4)}, ${lng.toFixed(4)})`;
  };

  // Parse Geoapify response for Indian addresses
  const parseGeoapifyResponse = (data: any): string | null => {
    if (!data.features || data.features.length === 0) return null;

    const props = data.features[0].properties;
    console.log('🏠 Geoapify properties:', props);

    // Prefer the high-quality formatted address if available
    if (props.formatted) {
      return props.formatted;
    }

    // Build address components for Indian context
    const addressParts: string[] = [];
    
    // House number and street (Geoapify often uses 'housenumber')
    const houseNumber = props.housenumber || props.house_number;
    const street = props.street || props.road;
    if (houseNumber) addressParts.push(houseNumber);
    if (street) addressParts.push(street);
    
    // Neighborhood/Locality
    const locality = props.suburb || props.neighbourhood || props.quarter || props.city_district || props.district;
    if (locality) addressParts.push(locality);
    
    // City (handle multiple possible keys used in India)
    const city = props.city || props.town || props.village || props.county || props.district || props.state_district;
    if (city) addressParts.push(city);
    
    // State
    if (props.state) addressParts.push(props.state);
    
    // Pincode
    if (props.postcode) addressParts.push(props.postcode);

    if (addressParts.length === 0) return null;
    
    return addressParts.join(', ');
  };

  // Parse Nominatim response for Indian addresses
  const parseNominatimResponse = (data: any): string | null => {
    if (!data) return null;

    // Prefer display_name when present
    if (data.display_name) return data.display_name as string;

    if (!data.address) return null;

    console.log('🏠 Nominatim address:', data.address);

    const address = data.address as any;
    const addressParts: string[] = [];

    // House number and street
    if (address.house_number) addressParts.push(address.house_number);
    if (address.road) addressParts.push(address.road);
    
    // Neighborhood/Locality
    const locality = address.suburb || address.neighbourhood || address.quarter || address.city_district || address.district;
    if (locality) addressParts.push(locality);
    
    // City
    const city = address.city || address.town || address.village || address.county || address.district || address.state_district;
    if (city) addressParts.push(city);
    
    // State
    if (address.state) addressParts.push(address.state);
    
    // Pincode
    if (address.postcode) addressParts.push(address.postcode);

    if (addressParts.length === 0) return null;
    
    return addressParts.join(', ');
  };

  const checkDeliveryAvailability = async (pincode: string): Promise<boolean> => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    return DELIVERY_AREAS.includes(pincode);
  };

  const setManualLocation = (address: string, coordinates: { lat: number; lng: number }) => {
    dispatch({
      type: 'SET_CURRENT_LOCATION',
      payload: { lat: coordinates.lat, lng: coordinates.lng, address },
    });
  };

  const value: AuthContextType = {
    ...state,
    login,
    verifyOTP,
    logout,
    updateProfile,
    addAddress,
    updateAddress,
    deleteAddress,
    setDefaultAddress,
    getCurrentLocation,
    setManualLocation,
    checkDeliveryAvailability,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};