// @ts-nocheck
import { createClient } from 'npm:@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, accept-profile',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
}

interface ContactPayload {
  name: string
  email: string
  message: string
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { status: 200, headers: corsHeaders })
  }

  try {
    if (req.method !== 'POST') {
      return new Response(JSON.stringify({ error: 'Method not allowed' }), {
        status: 405,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const { name, email, message }: ContactPayload = await req.json()

    if (!name || !email || !message) {
      return new Response(JSON.stringify({ error: 'Missing fields' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    // Optional: store the message
    const supabaseUrl = Deno.env.get('my_supabase_url') ?? ''
    const serviceKey = Deno.env.get('my_service_role_key') ?? ''
    const supabase = createClient(supabaseUrl, serviceKey)

    // Table is optional; if you didn't run the SQL migration, skip silently
    try {
      await supabase.from('contact_messages').insert({ name, email, message })
    } catch (e) {
      console.warn('contact_messages insert skipped/failed (table might not exist).')
    }

    // Send email via Resend (preferred) or SMTP-like webhook
    const resendKey = Deno.env.get('RESEND_API_KEY')
    const toEmail = Deno.env.get('CONTACT_TO_EMAIL')
    const fromEmail = Deno.env.get('CONTACT_FROM_EMAIL') || 'no-reply@supabase.fun'

    if (resendKey && toEmail) {
      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${resendKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          from: `Mithai Bhandar <${fromEmail}>`,
          to: [toEmail],
          subject: 'New Contact Message',
          html: `<h2>New Contact Message</h2><p><b>Name:</b> ${name}</p><p><b>Email:</b> ${email}</p><p><b>Message:</b><br/>${message.replaceAll('\n','<br/>')}</p>`
        })
      })

      if (!res.ok) {
        const txt = await res.text()
        console.error('Resend error', txt)
      }
    } else {
      console.log('Contact message (no email provider configured):', { name, email, message })
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (error) {
    console.error(error)
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})


