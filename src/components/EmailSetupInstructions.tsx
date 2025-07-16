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
          <h4 className="font-medium mb-2">To complete email setup:</h4>
          <ol className="list-decimal list-inside space-y-2">
            <li>
              Create a free account at{' '}
              <a 
                href="https://www.emailjs.com/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 underline inline-flex items-center gap-1"
              >
                EmailJS.com <ExternalLink className="w-3 h-3" />
              </a>
            </li>
            <li>Create an email service (Gmail, Outlook, etc.)</li>
            <li>Create an email template with these variables:
              <ul className="list-disc list-inside ml-4 mt-1 text-xs">
                <li>to_email</li>
                <li>from_name</li>
                <li>message</li>
                <li>timestamp</li>
                <li>subject</li>
              </ul>
            </li>
            <li>Update the Edge Function with your EmailJS credentials</li>
            <li>Email configured for: vishwalavanya04@gmail.com ✅</li>
          </ol>
        </div>
        
        <div className="bg-green-100 rounded-xl p-3">
          <p className="text-green-800 font-medium">
            ✅ Current Status: Email function is deployed and ready. Complete EmailJS setup to activate.
          </p>
        </div>
      </div>
    </div>
  );
}

export default EmailSetupInstructions;