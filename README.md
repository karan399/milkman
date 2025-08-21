# Mithai Bhandar - Indian Sweet Shop

A modern e-commerce web application for an Indian sweet shop built with React, TypeScript, Tailwind CSS, and Supabase.

## Features

- 🍬 Beautiful product catalog with authentic Indian sweets
- 🛒 Shopping cart functionality
- 📱 **Real SMS OTP authentication via Twilio**
- 📍 Address management with delivery area checking
- 💳 Secure checkout process
- 📱 Fully responsive design
- 🎨 Modern UI with smooth animations

## 📱 SMS Integration Setup (Real SMS)

To enable **real SMS OTP delivery** to customers, follow these steps:

### 1. Create a Twilio Account

1. Go to [Twilio Console](https://console.twilio.com/)
2. Sign up for a free account (includes $15 credit)
3. Verify your phone number during signup

### 2. Get Your Twilio Credentials

1. **Account SID**: Found on your Twilio Console Dashboard
2. **Auth Token**: Click "Show" next to Auth Token on Dashboard
3. **Phone Number**: Get a free Twilio phone number:
   - Go to Phone Numbers → Manage → Buy a number
   - Choose a number from your country
   - Complete the purchase (free with trial credit)

### 3. Configure Environment Variables

#### For Local Development:
Update your `.env` file:
```env
# Supabase Configuration
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here

# Twilio Configuration (for real SMS)
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=your_auth_token_here
TWILIO_PHONE_NUMBER=+1234567890
```

#### For Supabase Edge Functions:
1. Go to your Supabase Dashboard
2. Navigate to **Settings** → **Edge Functions**
3. Add these environment variables:

```
TWILIO_ACCOUNT_SID = ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN = your_auth_token_here
TWILIO_PHONE_NUMBER = +1234567890
```

### 4. How It Works Now

#### **With Twilio Setup (Production Mode):**
- ✅ **Real SMS** sent to customer's phone
- ✅ **No demo alerts** or console logs
- ✅ **Professional experience**
- ✅ **Works globally** (based on Twilio coverage)

#### **Without Twilio Setup (Demo Mode):**
- ⚠️ **Demo OTP** shown in console/alert
- ⚠️ **For development only**

### 5. Testing Real SMS

1. **Add Twilio credentials** to Supabase Edge Functions
2. **Enter your real phone number** in the app
3. **Click "Send OTP"** → Real SMS will be sent!
4. **Check your phone** for the SMS
5. **Enter the OTP** from SMS to login

### 6. Twilio Pricing

- **Free Trial**: $15 credit (sends ~500 SMS)
- **Pay-as-you-go**: ~$0.0075 per SMS (very affordable)
- **No monthly fees** for basic usage

### 7. International SMS

Twilio supports SMS to most countries worldwide. Check [Twilio's coverage](https://www.twilio.com/guidelines/sms) for your target markets.

## 🚀 Quick Setup Guide

### Step 1: Get Twilio Credentials
```bash
# 1. Sign up at https://console.twilio.com/
# 2. Get Account SID, Auth Token, and Phone Number
# 3. Copy credentials
```

### Step 2: Configure Supabase
```bash
# 1. Go to Supabase Dashboard → Settings → Edge Functions
# 2. Add environment variables:
#    TWILIO_ACCOUNT_SID
#    TWILIO_AUTH_TOKEN  
#    TWILIO_PHONE_NUMBER
```

### Step 3: Test
```bash
# 1. Enter your real phone number in the app
# 2. Click "Send OTP via SMS"
# 3. Check your phone for SMS
# 4. Enter OTP to login
```

## 🔧 Development vs Production

### Development Mode (No Twilio)
- Shows demo OTP in console
- No real SMS sent
- Perfect for testing

### Production Mode (With Twilio)
- Sends real SMS to customers
- No demo messages
- Professional experience

## 🛡️ Security Features

- Row Level Security (RLS) enabled on all tables
- Phone number-based authentication
- **Real SMS OTP verification**
- Secure session management
- Input validation and sanitization
- Rate limiting on OTP attempts

## 📊 SMS Analytics

With Twilio, you get:
- Delivery reports
- SMS analytics
- Error tracking
- Usage monitoring

## 🌍 Global Support

The SMS system works worldwide with Twilio's global infrastructure:
- 🇮🇳 India
- 🇺🇸 United States  
- 🇬🇧 United Kingdom
- 🇨🇦 Canada
- And 180+ more countries

## 💡 Pro Tips

1. **Test with your own number first**
2. **Monitor Twilio usage** in their console
3. **Set up billing alerts** to avoid surprises
4. **Use short, clear OTP messages**
5. **Consider SMS templates** for consistency

## 🆘 Troubleshooting

### SMS Not Received?
1. Check Twilio console for delivery status
2. Verify phone number format (+country code)
3. Check if number is on Twilio's blocked list
4. Ensure sufficient Twilio credit

### Still Getting Demo OTP?
1. Verify Twilio credentials in Supabase Edge Functions
2. Check environment variable names (exact match required)
3. Restart edge functions after adding variables

## Local Development

1. Clone the repository
2. Install dependencies: `npm install`
3. Set up your Supabase project and add environment variables
4. **Add Twilio credentials for real SMS**
5. Run the development server: `npm run dev`

## Deployment

The application can be deployed to Netlify or any static hosting service. Make sure to configure Twilio environment variables in your Supabase project.

## Tech Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS
- **Backend**: Supabase (PostgreSQL, Edge Functions)
- **SMS**: Twilio (real SMS delivery)
- **Icons**: Lucide React
- **Deployment**: Netlify

## Database Schema

The application uses the following main tables:
- `user_profiles` - User information
- `user_addresses` - User delivery addresses
- `otp_verifications` - OTP verification records

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly (including SMS functionality)
5. Submit a pull request

## License

This project is licensed under the MIT License.