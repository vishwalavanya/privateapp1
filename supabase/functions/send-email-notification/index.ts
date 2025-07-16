/*
  # Email Notification Function for Vishwa

  1. Purpose
    - Sends email notification to Vishwa when Ammu sends a message
    - Only triggers when Vishwa is offline/inactive
    - Uses EmailJS service for sending emails

  2. Trigger Conditions
    - Message sender is "Ammu"
    - Recipient is "Vishwa" 
    - Vishwa is currently offline/inactive

  3. Email Content
    - Subject: New message from Ammu
    - Body: Message preview and timestamp
*/

import { createClient } from 'npm:@supabase/supabase-js@2';

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

interface EmailRequest {
  senderName: string;
  messageText: string;
  timestamp: string;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const { senderName, messageText, timestamp }: EmailRequest = await req.json();

    // Only send email if Ammu is sending to Vishwa
    if (senderName !== 'Ammu') {
      return new Response(
        JSON.stringify({ success: false, message: 'Email notifications only for Ammu -> Vishwa' }),
        {
          headers: {
            'Content-Type': 'application/json',
            ...corsHeaders,
          },
        }
      );
    }

    // Check if Vishwa is currently active
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { data: vishwaStatus } = await supabase
      .from('users')
      .select('isActive')
      .eq('id', 'Vishwa')
      .single();

    // If Vishwa is active, don't send email
    if (vishwaStatus?.isActive) {
      return new Response(
        JSON.stringify({ success: false, message: 'Vishwa is currently active, no email sent' }),
        {
          headers: {
            'Content-Type': 'application/json',
            ...corsHeaders,
          },
        }
      );
    }

    // Send email using EmailJS service
    const emailData = {
      service_id: 'service_gk_study',
      template_id: 'template_message_notification',
      user_id: 'your_emailjs_user_id', // Replace with actual EmailJS user ID
      template_params: {
        to_email: 'vishwa@example.com', // Replace with Vishwa's actual email
        from_name: 'Ammu',
        message: messageText.substring(0, 100) + (messageText.length > 100 ? '...' : ''),
        timestamp: timestamp,
        subject: 'New message from Ammu - GK Study Portal'
      }
    };

    const emailResponse = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(emailData)
    });

    if (emailResponse.ok) {
      console.log('✅ Email notification sent to Vishwa');
      return new Response(
        JSON.stringify({ success: true, message: 'Email notification sent successfully' }),
        {
          headers: {
            'Content-Type': 'application/json',
            ...corsHeaders,
          },
        }
      );
    } else {
      throw new Error('Failed to send email via EmailJS');
    }

  } catch (error) {
    console.error('❌ Email notification error:', error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders,
        },
      }
    );
  }
});