import { createClient } from 'npm:@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

interface VerifyOTPRequest {
  phone: string
  otp: string
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { phone, otp }: VerifyOTPRequest = await req.json()

    if (!phone || !otp) {
      return new Response(
        JSON.stringify({ error: 'Phone number and OTP are required' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Get the latest OTP record for this phone number
    const { data: otpRecord, error: fetchError } = await supabase
      .from('otp_verifications')
      .select('*')
      .eq('phone', phone)
      .eq('verified', false)
      .order('created_at', { ascending: false })
      .limit(1)
      .single()

    if (fetchError || !otpRecord) {
      return new Response(
        JSON.stringify({ error: 'No valid OTP found for this phone number' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Check if OTP has expired
    if (new Date() > new Date(otpRecord.expires_at)) {
      return new Response(
        JSON.stringify({ error: 'OTP has expired. Please request a new one.' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Check if too many attempts
    if (otpRecord.attempts >= 3) {
      return new Response(
        JSON.stringify({ error: 'Too many failed attempts. Please request a new OTP.' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Verify OTP
    if (otpRecord.otp_code !== otp) {
      // Increment attempts
      await supabase
        .from('otp_verifications')
        .update({ attempts: otpRecord.attempts + 1 })
        .eq('id', otpRecord.id)

      return new Response(
        JSON.stringify({ 
          error: 'Invalid OTP', 
          attemptsLeft: 3 - (otpRecord.attempts + 1) 
        }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Mark OTP as verified
    await supabase
      .from('otp_verifications')
      .update({ verified: true })
      .eq('id', otpRecord.id)

    // Check if user profile exists
    const { data: existingUser } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('phone', phone)
      .single()

    let userProfile = existingUser

    // Create user profile if doesn't exist
    if (!existingUser) {
      const { data: newUser, error: createError } = await supabase
        .from('user_profiles')
        .insert({ phone })
        .select()
        .single()

      if (createError) {
        console.error('Error creating user profile:', createError)
        return new Response(
          JSON.stringify({ error: 'Failed to create user profile' }),
          { 
            status: 500, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        )
      }

      userProfile = newUser
    }

    // Get user addresses
    const { data: addresses } = await supabase
      .from('user_addresses')
      .select('*')
      .eq('user_id', userProfile.id)
      .order('created_at', { ascending: false })

    // Create session token (in production, use proper JWT)
    const sessionToken = btoa(JSON.stringify({
      userId: userProfile.id,
      phone: userProfile.phone,
      timestamp: Date.now()
    }))

    return new Response(
      JSON.stringify({
        success: true,
        user: {
          id: userProfile.id,
          phone: userProfile.phone,
          name: userProfile.name,
          email: userProfile.email,
          addresses: addresses || [],
          isVerified: true
        },
        sessionToken
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})