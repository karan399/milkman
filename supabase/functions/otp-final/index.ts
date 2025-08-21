import { createClient } from 'npm:@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

interface SendOTPRequest {
  phone: string;
}

Deno.serve(async (req) => {
  console.log('Edge function called');
  if (req.method === 'OPTIONS') {
    console.log('OPTIONS preflight');
    return new Response('ok', { status: 200, headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('my_supabase_url') ?? '';
    const supabaseKey = Deno.env.get('my_service_role_key') ?? '';

    if (!supabaseUrl || !supabaseKey) {
      console.error('❌ Missing environment variables');
      return new Response(JSON.stringify({ error: 'Server configuration error' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log('ENV:', { supabaseUrl, supabaseKey });
    console.log("🔐 URL:", supabaseUrl.slice(0, 10), "..."); 
    console.log("🔐 KEY:", supabaseKey.slice(0, 10), "...");
    console.log('MY_SUPABASE_URL:', supabaseUrl.slice(0, 20));
    console.log('my_service_role_key:', supabaseKey.slice(0, 10));

    const supabase = createClient(supabaseUrl, supabaseKey);

    const { phone }: SendOTPRequest = await req.json();
    
    console.log("📱 Received phone:", phone);
    
    // Improved phone number validation
    if (!phone || typeof phone !== 'string') {
      console.error('❌ Invalid phone input:', phone);
      return new Response(JSON.stringify({ error: 'Phone number is required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Remove any non-digit characters and validate length
    const cleanPhone = phone.replace(/\D/g, '');
    console.log("🧹 Cleaned phone:", cleanPhone);
    
    if (cleanPhone.length < 10 || cleanPhone.length > 15) {
      console.error('❌ Invalid phone length:', cleanPhone.length);
      return new Response(JSON.stringify({ error: 'Invalid phone number format' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Use the cleaned phone number for all operations
    const phoneToUse = cleanPhone;
    console.log("📞 Using phone:", phoneToUse);

    // Clean up old OTPs for this phone number
    console.log("🗑️ Cleaning up old OTPs...");
    const { error: deleteError } = await supabase
      .from('otp_verifications')
      .delete()
      .eq('phone', phoneToUse);

    if (deleteError) {
      console.error('❌ Delete error:', deleteError);
      // Don't return error here, continue with OTP generation
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000).toISOString();

    console.log("🔢 Generated OTP:", otp);
    console.log("⏰ Expires at:", expiresAt);

    const { error } = await supabase
      .from('otp_verifications')
      .insert({ 
        phone: phoneToUse, 
        otp_code: otp, 
        expires_at: expiresAt, 
        verified: false, 
        attempts: 0 
      });

    if (error) {
      console.error('❌ Insert error:', error);
      return new Response(JSON.stringify({ error: 'Failed to generate OTP', details: error }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log(`✅ OTP generated for ${phoneToUse}: ${otp}`);

    // Send SMS via Twilio
    const twilioAccountSid = Deno.env.get('TWILIO_ACCOUNT_SID');
    const twilioAuthToken = Deno.env.get('TWILIO_AUTH_TOKEN');
    const twilioPhoneNumber = Deno.env.get('TWILIO_PHONE_NUMBER');

    if (twilioAccountSid && twilioAuthToken && twilioPhoneNumber) {
      try {
        const twilioUrl = `https://api.twilio.com/2010-04-01/Accounts/${twilioAccountSid}/Messages.json`;

        // Ensure phone number has country code for Twilio
        const phoneForTwilio = phoneToUse.startsWith('91') ? `+${phoneToUse}` : phoneToUse;
        console.log("📞 Phone for Twilio:", phoneForTwilio);
        
        const formData = new URLSearchParams();
        formData.append('From', twilioPhoneNumber);
        formData.append('To', phoneForTwilio);
        formData.append(
          'Body',
          `Your Mithai Bhandar OTP is: ${otp}. Valid for 5 minutes. Do not share this code with anyone.`
        );

        const twilioResponse = await fetch(twilioUrl, {
          method: 'POST',
          headers: {
            Authorization: `Basic ${btoa(`${twilioAccountSid}:${twilioAuthToken}`)}`,
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: formData,
        });

        if (!twilioResponse.ok) {
          const errorData = await twilioResponse.text();
          console.error('Twilio error:', errorData);
          throw new Error('Failed to send SMS');
        }

        console.log(`SMS sent successfully to ${phoneToUse}`);

        return new Response(JSON.stringify({ 
          success: true, 
          message: 'OTP sent successfully via SMS',
          debug_otp: otp 
        }), {
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      } catch (smsError) {
        console.error('SMS sending failed:', smsError);
        // Return success anyway since OTP is stored in database
        return new Response(JSON.stringify({ 
          success: true, 
          message: 'OTP generated successfully (SMS failed)',
          debug_otp: otp 
        }), {
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
    }

    // If Twilio credentials are not set, return demo mode
    console.log(`Demo OTP for ${phoneToUse}: ${otp}`);
    return new Response(JSON.stringify({ 
      success: true, 
      message: 'OTP generated successfully',
      debug_otp: otp,
      demo_mode: true
    }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (err) {
    console.error('🔥 Server error:', err);
    return new Response(JSON.stringify({ error: 'Internal server error', details: err }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
