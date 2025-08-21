import { createClient } from 'npm:@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, accept-profile',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
}

interface SendOTPRequest {
  phone: string
}

Deno.serve(async (req) => {
  console.log('Running send-otp-v2 function');

  // ✅ Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { phone }: SendOTPRequest = await req.json()

    if (!phone || phone.length < 10) {
      return new Response(
        JSON.stringify({ error: 'Valid phone number is required' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    }

    const otpCode = Math.floor(100000 + Math.random() * 900000).toString()
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000).toISOString()

    await supabase.from('otp_verifications').delete().eq('phone', phone)

    const { error: insertError } = await supabase.from('otp_verifications').insert({
      phone,
      otp_code: otpCode,
      expires_at: expiresAt,
      verified: false,
      attempts: 0,
    })

    if (insertError) {
      console.error('Database error:', insertError)
      return new Response(
        JSON.stringify({ error: 'Failed to generate OTP' }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    }

    const twilioAccountSid = Deno.env.get('TWILIO_ACCOUNT_SID')
    const twilioAuthToken = Deno.env.get('TWILIO_AUTH_TOKEN')
    const twilioPhoneNumber = Deno.env.get('TWILIO_PHONE_NUMBER')

    if (twilioAccountSid && twilioAuthToken && twilioPhoneNumber) {
      try {
        const twilioUrl = `https://api.twilio.com/2010-04-01/Accounts/${twilioAccountSid}/Messages.json`

        const formData = new URLSearchParams()
        formData.append('From', twilioPhoneNumber)
        formData.append('To', phone)
        formData.append(
          'Body',
          `Your Mithai Bhandar OTP is: ${otpCode}. Valid for 5 minutes. Do not share this code with anyone.`
        )

        const twilioResponse = await fetch(twilioUrl, {
          method: 'POST',
          headers: {
            Authorization: `Basic ${btoa(`${twilioAccountSid}:${twilioAuthToken}`)}`,
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: formData,
        })

        if (!twilioResponse.ok) {
          const errorData = await twilioResponse.text()
          console.error('Twilio error:', errorData)
          throw new Error('Failed to send SMS')
        }

        console.log(`SMS sent successfully to ${phone}`)

        return new Response(
          JSON.stringify({
            success: true,
            message: 'OTP sent successfully via SMS',
          }),
          {
            status: 200,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          }
        )
      } catch (smsError) {
        console.error('SMS sending failed:', smsError)
      }
    }

    console.log(`Demo OTP for ${phone}: ${otpCode}`)

    return new Response(
      JSON.stringify({
        success: true,
        message: 'OTP sent successfully',
        debug_otp: !twilioAccountSid ? otpCode : undefined,
        demo_mode: !twilioAccountSid,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  }
})
