import React from 'react';
import { Mail, ExternalLink } from 'lucide-react';

function EmailSetupInstructions() {
  return (
    <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6 mb-6">
      <div className="flex items-center gap-3 mb-4">
        <Mail className="w-6 h-6 text-blue-600" />
        <h3 className="text-lg font-semibold text-blue-800">Email Notification Setup</h3>
      </div>
      
      <div className="space-y-4 text-sm text-blue-700">
        <p>
          <strong>Email notifications are configured for Vishwa only.</strong> When Ammu sends a message and Vishwa is offline, an email will be sent automatically.
        </p>
        
        <div className="bg-white/50 rounded-xl p-4">
          <h4 className="font-medium mb-2">✅ Your EmailJS credentials are configured!</h4>
          <ol className="list-decimal list-inside space-y-2">
            <li>✅ Service ID: service_o897y5t</li>
            <li>✅ Public Key: bKbS9L0kF8g2CSGP-</li>
            <li>✅ Email: vishwalavanya04@gmail.com</li>
            <li>📝 Create email template named "template_message_notification" with these variables:
              <ul className="list-disc list-inside ml-4 mt-1 text-xs">
                <li>to_email</li>
                <li>to_name</li>
                <li>from_name</li>
                <li>message</li>
                <li>timestamp</li>
                <li>subject</li>
              </ul>
            </li>
          </ol>
        </div>
        
        <div className="bg-yellow-100 rounded-xl p-3">
          <p className="text-green-800 font-medium">
            ⚠️ Final Step: Create email template "template_message_notification" in your EmailJS dashboard to activate notifications.
          </p>
        </div>
      </div>
    </div>
  );
}

export default EmailSetupInstructions;