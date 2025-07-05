import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types
export interface UserProfile {
  id: string
  phone: string
  name?: string
  email?: string
  created_at: string
  updated_at: string
}

export interface UserAddress {
  id: string
  user_id: string
  type: 'home' | 'work' | 'other'
  name: string
  address: string
  city: string
  state: string
  pincode: string
  landmark?: string
  is_default: boolean
  coordinates?: { x: number; y: number }
  created_at: string
  updated_at: string
}

export interface OTPVerification {
  id: string
  phone: string
  otp_code: string
  expires_at: string
  verified: boolean
  attempts: number
  created_at: string
}