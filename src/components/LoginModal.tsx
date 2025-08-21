import React, { useState } from 'react';
import { X, Phone, Shield, CheckCircle, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { getEmailValidationError } from '../lib/utils';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose }) => {
  const [step, setStep] = useState<'phone' | 'otp' | 'profile'>('phone');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [profile, setProfile] = useState({ name: '', email: '' });
  const [emailError, setEmailError] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [attemptsLeft, setAttemptsLeft] = useState(3);
  const [isRealSMS, setIsRealSMS] = useState(false);
  const { login, verifyOTP, updateProfile, isLoading } = useAuth();

  if (!isOpen) return null;

  const formatPhoneNumber = (value: string) => {
    // Remove all non-digits
    const digits = value.replace(/\D/g, '');
    
    // Limit to 10 digits
    const limited = digits.slice(0, 10);
    
    // Format as XXX-XXX-XXXX
    if (limited.length >= 6) {
      return `${limited.slice(0, 3)}-${limited.slice(3, 6)}-${limited.slice(6)}`;
    } else if (limited.length >= 3) {
      return `${limited.slice(0, 3)}-${limited.slice(3)}`;
    }
    return limited;
  };

  const getCleanPhoneNumber = (formattedPhone: string) => {
    return formattedPhone.replace(/\D/g, '');
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    
    // Allow backspace and delete to work properly
    if (e.nativeEvent.inputType === 'deleteContentBackward' || 
        e.nativeEvent.inputType === 'deleteContentForward') {
      // For delete operations, work with the raw value
      const digits = value.replace(/\D/g, '');
      setPhone(formatPhoneNumber(digits));
    } else {
      // For regular input, format the number
      setPhone(formatPhoneNumber(value));
    }
  };

  const handlePhoneSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    const cleanPhone = getCleanPhoneNumber(phone);
    
    if (cleanPhone.length !== 10) {
      setError('Please enter a valid 10-digit phone number');
      return;
    }

    try {
      const response = await login(`+91${cleanPhone}`);
      setStep('otp');
      setAttemptsLeft(3);
      
      // Check if real SMS was sent or demo mode
      setIsRealSMS(!response?.demo_mode);
    } catch (err: any) {
      console.error('Login error:', err);
      setError(err.message || 'Failed to send OTP. Please try again.');
    }
  };

  const handleOTPSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (otp.length !== 6) {
      setError('Please enter a valid 6-digit OTP');
      return;
    }

    try {
      await verifyOTP(otp);
      setStep('profile');
    } catch (err: any) {
      const errorMessage = err.message || 'Invalid OTP. Please try again.';
      setError(errorMessage);
      
      // Extract attempts left from error message if available
      if (errorMessage.includes('attempts')) {
        const match = errorMessage.match(/(\d+)/);
        if (match) {
          setAttemptsLeft(parseInt(match[1]));
        }
      } else {
        setAttemptsLeft(prev => Math.max(0, prev - 1));
      }
    }
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate email
    const emailValidationError = getEmailValidationError(profile.email);
    if (emailValidationError) {
      setEmailError(emailValidationError);
      return;
    }
    
    setEmailError(null);
    
    if (profile.name.trim()) {
      try {
        await updateProfile(profile);
      } catch (err) {
        console.error('Profile update failed:', err);
      }
    }
    
    handleClose();
  };

  const handleClose = () => {
    onClose();
    setStep('phone');
    setPhone('');
    setOtp('');
    setProfile({ name: '', email: '' });
    setError('');
    setEmailError(null);
    setAttemptsLeft(3);
  };

  const handleResendOTP = async () => {
    setError('');
    setOtp('');
    setAttemptsLeft(3);
    setIsRealSMS(false);
    
    try {
      const cleanPhone = getCleanPhoneNumber(phone);
      const response = await login(`+91${cleanPhone}`);
      setIsRealSMS(!response?.demo_mode);
    } catch (err: any) {
      setError(err.message || 'Failed to resend OTP. Please try again.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 bg-black bg-opacity-50" onClick={handleClose}></div>
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl max-w-md w-full p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              {step === 'phone' && 'Login to Mithai Bhandar'}
              {step === 'otp' && 'Verify OTP'}
              {step === 'profile' && 'Complete Profile'}
            </h2>
            <button
              onClick={handleClose}
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {step === 'phone' && (
            <form onSubmit={handlePhoneSubmit} className="space-y-6">
              <div className="text-center mb-6">
                <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Phone className="h-8 w-8 text-orange-600" />
                </div>
                <p className="text-gray-600">
                  Enter your phone number to receive an OTP via SMS
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500">
                    +91
                  </span>
                  <input
                    type="tel"
                    value={phone}
                    onChange={handlePhoneChange}
                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="XXX-XXX-XXXX"
                    required
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  We'll send you a 6-digit verification code via SMS
                </p>
              </div>

              {error && (
                <div className="flex items-center space-x-2 text-red-600 text-sm bg-red-50 p-3 rounded-lg">
                  <AlertCircle className="h-4 w-4 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading || getCleanPhoneNumber(phone).length !== 10}
                className="w-full bg-orange-600 text-white py-3 rounded-lg font-semibold hover:bg-orange-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Sending SMS...
                  </>
                ) : (
                  'Send OTP via SMS'
                )}
              </button>

              <p className="text-xs text-gray-500 text-center">
                By continuing, you agree to our Terms of Service and Privacy Policy
              </p>
            </form>
          )}

          {step === 'otp' && (
            <form onSubmit={handleOTPSubmit} className="space-y-6">
              <div className="text-center mb-6">
                <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="h-8 w-8 text-green-600" />
                </div>
                <p className="text-gray-600">
                  We've sent a 6-digit OTP to +91 {phone}
                </p>
                <p className="text-sm text-gray-500 mt-2">
                  {isRealSMS ? (
                    <span className="text-green-600 font-medium">
                      ✓ SMS sent to your phone - Check your messages
                    </span>
                  ) : (
                    'Check your SMS messages for the verification code'
                  )}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Enter OTP
                </label>
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-center text-2xl tracking-widest"
                  placeholder="000000"
                  maxLength={6}
                  required
                />
                <div className="flex justify-between items-center mt-2">
                  <p className="text-xs text-gray-500">
                    {attemptsLeft > 0 ? `${attemptsLeft} attempts remaining` : 'No attempts left'}
                  </p>
                  <button
                    type="button"
                    onClick={handleResendOTP}
                    disabled={isLoading}
                    className="text-xs text-orange-600 hover:text-orange-700 transition-colors disabled:opacity-50"
                  >
                    Resend OTP
                  </button>
                </div>
              </div>

              {error && (
                <div className="flex items-center space-x-2 text-red-600 text-sm bg-red-50 p-3 rounded-lg">
                  <AlertCircle className="h-4 w-4 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading || otp.length !== 6 || attemptsLeft === 0}
                className="w-full bg-orange-600 text-white py-3 rounded-lg font-semibold hover:bg-orange-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Verifying...
                  </>
                ) : (
                  'Verify OTP'
                )}
              </button>

              <button
                type="button"
                onClick={() => setStep('phone')}
                className="w-full text-orange-600 py-2 font-medium hover:text-orange-700 transition-colors"
              >
                Change Phone Number
              </button>
            </form>
          )}

          {step === 'profile' && (
            <form onSubmit={handleProfileSubmit} className="space-y-6">
              <div className="text-center mb-6">
                <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="h-8 w-8 text-blue-600" />
                </div>
                <p className="text-gray-600">
                  Welcome! Complete your profile to get personalized experience
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  value={profile.name}
                  onChange={(e) => setProfile(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="Enter your full name"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={profile.email}
                  onChange={(e) => {
                    const email = e.target.value;
                    setProfile(prev => ({ ...prev, email }));
                    setEmailError(getEmailValidationError(email));
                  }}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                    emailError ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="your@email.com"
                  required
                />
                {emailError && (
                  <p className="text-red-500 text-sm mt-1">{emailError}</p>
                )}
              </div>

              <button
                type="submit"
                className="w-full bg-orange-600 text-white py-3 rounded-lg font-semibold hover:bg-orange-700 transition-colors"
              >
                Complete Setup
              </button>

              <button
                type="button"
                onClick={handleClose}
                className="w-full text-gray-600 py-2 font-medium hover:text-gray-700 transition-colors"
              >
                Skip for now
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoginModal;