import React, { createContext, useContext, useReducer, ReactNode, useEffect } from 'react';
import { supabase } from '../lib/supabase';

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
  getCurrentLocation: () => Promise<void>;
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
  '400001', '400002', '400003', '400004', '400005', '400006', '400007', '400008',
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
    const response = await fetch('https://jacricvdggrwyvjwgcbu.functions.supabase.co/otp-final', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({ phone }),
});


    const result = await response.json();

    if (!response.ok) {
      console.error('OTP API Error:', result);
      throw new Error(result?.error || 'Failed to send OTP');
    }

    if (LOG_OTP_TO_CONSOLE && result?.debug_otp) {
      console.log(`🔐 Debug OTP for ${phone}: ${result.debug_otp}`);
    }

    return result;

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
      // First try database verification
      try {
        const { data: otpRecord, error: fetchError } = await supabase
          .from('otp_verifications')
          .select('*')
          .eq('phone', pendingPhone)
          .eq('verified', false)
          .order('created_at', { ascending: false })
          .limit(1)
          .single();

        if (!fetchError && otpRecord) {
          // Database verification
          if (new Date() > new Date(otpRecord.expires_at)) {
            throw new Error('OTP has expired. Please request a new one.');
          }

          if (otpRecord.attempts >= 3) {
            throw new Error('Too many failed attempts. Please request a new OTP.');
          }

          if (otpRecord.otp_code !== otp) {
            await supabase
              .from('otp_verifications')
              .update({ attempts: otpRecord.attempts + 1 })
              .eq('id', otpRecord.id);

            throw new Error(`Invalid OTP. ${3 - (otpRecord.attempts + 1)} attempts remaining.`);
          }

          // Mark OTP as verified
          await supabase
            .from('otp_verifications')
            .update({ verified: true })
            .eq('id', otpRecord.id);

        } else {
          throw new Error('Database verification failed');
        }
      } catch (dbError) {
        console.warn('Database verification failed, trying fallback:', dbError);
        
        // Fallback: Check localStorage
        const fallbackOTPData = localStorage.getItem(`otp_${pendingPhone}`);
        if (!fallbackOTPData) {
          throw new Error('No valid OTP found for this phone number');
        }

        const fallbackOTP = JSON.parse(fallbackOTPData);
        
        if (new Date() > new Date(fallbackOTP.expires_at)) {
          localStorage.removeItem(`otp_${pendingPhone}`);
          throw new Error('OTP has expired. Please request a new one.');
        }

        if (fallbackOTP.attempts >= 3) {
          throw new Error('Too many failed attempts. Please request a new OTP.');
        }

        if (fallbackOTP.otp_code !== otp) {
          fallbackOTP.attempts += 1;
          localStorage.setItem(`otp_${pendingPhone}`, JSON.stringify(fallbackOTP));
          throw new Error(`Invalid OTP. ${3 - fallbackOTP.attempts} attempts remaining.`);
        }

        // Mark as verified in localStorage
        fallbackOTP.verified = true;
        localStorage.setItem(`otp_${pendingPhone}`, JSON.stringify(fallbackOTP));
      }

      // Create or get user profile
      let userProfile;
      
      try {
        // Try to get existing user from database
        const { data: existingUser } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('phone', pendingPhone)
          .single();

        if (existingUser) {
          userProfile = existingUser;
        } else {
          // Create new user in database
          const { data: newUser, error: createError } = await supabase
            .from('user_profiles')
            .insert({ phone: pendingPhone })
            .select()
            .single();

          if (createError) {
            throw new Error('Database user creation failed');
          }
          userProfile = newUser;
        }
      } catch (dbError) {
        console.warn('Database user operations failed, using fallback:', dbError);
        
        // Fallback: Create user profile in localStorage
        userProfile = {
          id: `user_${Date.now()}`,
          phone: pendingPhone,
          name: null,
          email: null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
      }

      const user: User = {
        id: userProfile.id,
        phone: userProfile.phone,
        name: userProfile.name,
        email: userProfile.email,
        addresses: [],
        isVerified: true,
      };

      // Create session token
      const sessionToken = btoa(JSON.stringify({
        userId: userProfile.id,
        phone: userProfile.phone,
        timestamp: Date.now()
      }));

      localStorage.setItem('mithai_user', JSON.stringify(user));
      localStorage.setItem('mithai_session', sessionToken);
      
      // Clean up OTP data
      localStorage.removeItem(`otp_${pendingPhone}`);
      
      dispatch({ type: 'LOGIN_SUCCESS', payload: user });
      setPendingPhone('');
      setDemoOTP('');

    } catch (error) {
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
    if (!state.user) return;

    try {
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

      if (error) throw error;

      await fetchAddresses();

    } catch (error) {
      console.error('Add address error:', error);
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

  const getCurrentLocation = async (): Promise<void> => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          
          // In production, you would use a reverse geocoding service
          const address = 'Current Location, Mumbai, Maharashtra';
          
          dispatch({
            type: 'SET_CURRENT_LOCATION',
            payload: { lat: latitude, lng: longitude, address },
          });
          resolve();
        },
        (error) => {
          reject(error);
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 300000 }
      );
    });
  };

  const checkDeliveryAvailability = async (pincode: string): Promise<boolean> => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    return DELIVERY_AREAS.includes(pincode);
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