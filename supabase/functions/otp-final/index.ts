import { createClient } from 'npm:@supabase/supabase-js@2';

console.log("📡 Supabase URL:", Deno.env.get("PRIVATE_SUPABASE_URL"));
console.log("🔑 Service Role Key:", Deno.env.get("PRIVATE_SERVICE_ROLE_KEY")?.slice(0, 10) + "...");

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, accept-profile',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { status: 200, headers: corsHeaders });
  }

  console.log("🔍 PRIVATE_SUPABASE_URL:", Deno.env.get("PRIVATE_SUPABASE_URL"));
  console.log("🔍 PRIVATE_SERVICE_ROLE_KEY:", Deno.env.get("PRIVATE_SERVICE_ROLE_KEY")?.slice(0, 10) + "...");

  try {
    const supabase = createClient(
      Deno.env.get('PROJECT_DB_URL') ?? '',
      Deno.env.get('PROJECT_DB_KEY') ?? ''
    );

    const { phone } = await req.json();

    if (!phone || phone.length < 10) {
      return new Response(JSON.stringify({ error: 'Invalid phone number' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000).toISOString();

    const { error } = await supabase
      .from('otp_verifications')
      .insert({
        phone,
        otp_code: otp,
        expires_at: expiresAt,
        verified: false,
        attempts: 0,
      });

    if (error) {
      console.error('❌ DB insert failed:', error);
      return new Response(JSON.stringify({ error: 'Failed to generate OTP' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // --- Twilio Integration (Deno HTTP API) ---
    const accountSid = Deno.env.get("TWILIO_ACCOUNT_SID");
    const authToken = Deno.env.get("TWILIO_AUTH_TOKEN");
    const fromNumber = Deno.env.get("TWILIO_PHONE_NUMBER");

    if (!accountSid || !authToken || !fromNumber) {
      console.error("❌ Twilio environment variables not set");
      return new Response(JSON.stringify({ error: "Twilio configuration error" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const twilioUrl = `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`;

    const formData = new URLSearchParams();
    formData.append("To", phone);
    formData.append("From", fromNumber);
    formData.append("Body", `Your OTP for Mithai Bhandar is ${otp}`);

    const twilioResponse = await fetch(twilioUrl, {
      method: "POST",
      headers: {
        Authorization: "Basic " + btoa(`${accountSid}:${authToken}`),
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: formData.toString(),
    });

    if (!twilioResponse.ok) {
      const errorDetails = await twilioResponse.text();
      console.error("❌ Twilio SMS send failed:", errorDetails);
      return new Response(JSON.stringify({ error: "Failed to send OTP SMS" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    // --- End Twilio Integration ---

    return new Response(
      JSON.stringify({
        success: true,
        message: 'OTP generated and sent successfully',
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (err) {
    console.error('❌ Unexpected error:', err);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
