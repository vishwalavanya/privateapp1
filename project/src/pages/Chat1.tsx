import React, { useState, useEffect, useRef } from 'react';
import { BookOpen, Send, LogOut } from 'lucide-react';
import { useChat } from '../hooks/useChat';
import RobotCloud from '../components/RobotCloud';
import { aiResponses } from '../data/aiResponses';

interface Chat1Props {
  nickname: string;
  onLogout: () => void;
}

function Chat1({ nickname, onLogout }: Chat1Props) {
  const [message, setMessage] = useState('');
  const { msgs, send } = useChat('publicMessages', nickname);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [msgs]);

  const getAIResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase().trim();

    if (aiResponses[lowerMessage]) {
      return aiResponses[lowerMessage];
    }

    for (const [key, value] of Object.entries(aiResponses)) {
      if (lowerMessage.includes(key) || key.includes(lowerMessage)) {
        return value;
      }
    }

    return "Hmm… I'm thinking of your answer 🤖";
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      const userMessage = message.trim();
      await send(userMessage, 'user');

      setTimeout(async () => {
        const aiResponse = getAIResponse(userMessage);
        await send(aiResponse, 'ai');
      }, 1000);

      setMessage('');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
      {/* Header */}
      <div className="bg-white/90 backdrop-blur-sm border-b border-green-200 px-4 py-3 sticky top-0 z-20 shadow-sm">
        <div className="flex items-center justify-between max-w-2xl mx-auto">
          <div className="flex items-center gap-3">
            <BookOpen className="w-6 h-6 text-green-600" />
            <h1 className="text-xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
              GK Study Portal 📚
            </h1>
          </div>
          <button
            onClick={onLogout}
            className="flex items-center gap-2 px-3 py-2 rounded-full text-sm font-medium bg-gray-100 text-gray-600 hover:bg-gray-200 transition-all"
          >
            <LogOut className="w-4 h-4" />
            Exit
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="max-w-2xl mx-auto p-4 pb-24">
        <div className="space-y-6">
          {msgs.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📚💡</div>
              <p className="text-gray-500 italic">
                Welcome to GK Study Portal! Ask me anything about general knowledge, word meanings, and more...
              </p>
            </div>
          ) : (
            msgs.map((msg: any) => (
              <div key={msg.id} className={`flex ${msg.type === 'ai' ? 'justify-start' : 'justify-end'} mb-6`}>
                <RobotCloud
                  text={msg.text}
                  isOwn={msg.type === 'user'}
                  isAI={msg.type === 'ai'}
                  isUser={msg.type === 'user'}
                />
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Message Input */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-sm border-t border-green-200 p-4">
        <form onSubmit={handleSendMessage} className="max-w-2xl mx-auto">
          <div className="flex gap-3 items-end">
            <div className="flex-1">
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Ask me anything..."
                className="w-full px-4 py-3 rounded-2xl border border-green-200 focus:border-green-400 focus:ring-2 focus:ring-green-100 outline-none resize-none transition-all"
                rows={1}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage(e);
                  }
                }}
              />
            </div>
            <button
              type="submit"
              disabled={!message.trim()}
              className="bg-gradient-to-r from-green-500 to-emerald-500 text-white p-3 rounded-2xl hover:from-green-600 hover:to-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </form>
      </div>

      {/* Floating Study Icons */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-20 left-5 text-green-200 text-2xl animate-bounce">📚</div>
        <div className="absolute top-40 right-8 text-emerald-200 text-xl animate-pulse">🧠</div>
        <div className="absolute bottom-32 left-12 text-teal-300 text-3xl animate-bounce">💡</div>
        <div className="absolute top-60 right-20 text-green-300 text-2xl animate-pulse">📖</div>
        <div className="absolute bottom-60 left-20 text-emerald-300 text-xl animate-bounce">🎓</div>
      </div>
    </div>
  );
}

export default Chat1;
