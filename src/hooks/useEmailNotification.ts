import { useEffect } from 'react';

interface UseEmailNotificationProps {
  nickname: string;
  messages: any[];
}

export function useEmailNotification({ nickname, messages }: UseEmailNotificationProps) {
  useEffect(() => {
    if (messages.length === 0) return;

    const latestMessage = messages[messages.length - 1];
    
    // Only trigger for Ammu's messages
    if (latestMessage.by === 'Ammu' && nickname !== 'Ammu') {
      sendEmailNotification(latestMessage);
    }
  }, [messages, nickname]);

  const sendEmailNotification = async (message: any) => {
    try {
      const timestamp = message.ts ? 
        new Date(message.ts.toMillis()).toLocaleString() : 
        new Date().toLocaleString();

      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/send-email-notification`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          senderName: message.by,
          messageText: message.text || 'Image message',
          timestamp: timestamp
        })
      });

      const result = await response.json();
      
      if (result.success) {
        console.log('📧 Email notification sent to Vishwa');
      } else {
        console.log('📧 Email notification skipped:', result.message);
      }
    } catch (error) {
      console.error('❌ Failed to send email notification:', error);
    }
  };
}