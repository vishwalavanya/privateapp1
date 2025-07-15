import React, { useState, useEffect } from 'react';
import { Heart, BookOpen } from 'lucide-react';
import Chat1 from './pages/Chat1';
import Chat2 from './pages/Chat2';
import { requestToken, onForegroundMessage } from './firebase';

type Page = 'login' | 'chat1' | 'chat2';
type Nickname = 'Vishwa' | 'Ammu' | string;

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('login');
  const [nickname, setNickname] = useState<Nickname>('');
  const [inputNickname, setInputNickname] = useState('');

  // Handle notification clicks - always redirect to login
  useEffect(() => {
    const handleNotificationClick = () => {
      setCurrentPage('login');
      setNickname('');
      setInputNickname('');
    };

    // Listen for notification clicks
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.addEventListener('message', handleNotificationClick);
    }

    return () => {
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.removeEventListener('message', handleNotificationClick);
      }
    };
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedNickname = inputNickname.trim().toLowerCase();
    
    if (trimmedNickname === 'vishwa' || trimmedNickname === 'ammu') {
      // Store original case for display
      setNickname(trimmedNickname === 'vishwa' ? 'Vishwa' : 'Ammu');
      setCurrentPage('chat2');
    } else {
      setNickname(inputNickname.trim());
      setCurrentPage('chat1');
    }
  };

  const handleLogout = () => {
    setCurrentPage('login');
    setNickname('');
    setInputNickname('');
  };

  // Login Screen
  if (currentPage === 'login') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-rose-50 to-red-50 
                      flex items-center justify-center p-4 relative overflow-hidden">
        {/* Floating Hearts Background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-10 left-10 text-blue-200 text-4xl animate-pulse">📚</div>
          <div className="absolute top-32 right-20 text-green-200 text-3xl animate-bounce">🧠</div>
          <div className="absolute bottom-40 left-32 text-purple-300 text-5xl animate-pulse">💡</div>
          <div className="absolute bottom-20 right-16 text-indigo-300 text-2xl animate-bounce">🎓</div>
          <div className="absolute top-1/2 left-1/4 text-teal-300 text-3xl animate-pulse">📖</div>
        </div>
        
        <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-8 w-full max-w-md 
                        border border-pink-200 relative z-10">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-2 mb-4">
              <BookOpen className="w-8 h-8 text-green-500" />
              <BookOpen className="w-8 h-8 text-blue-500" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-green-600 
                           bg-clip-text text-transparent mb-2">
              GK Study Portal
            </h1>
            <p className="text-gray-600">
              Enter your study name to continue
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Study Nickname
              </label>
              <input
                type="text"
                value={inputNickname}
                onChange={(e) => setInputNickname(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl border border-blue-200 
                           focus:border-blue-400 focus:ring-2 focus:ring-blue-100 
                           outline-none transition-all"
                placeholder="Enter your nickname..."
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-500 to-green-500 
                         text-white py-3 rounded-2xl font-medium 
                         hover:from-blue-600 hover:to-green-600 
                         transform hover:scale-105 transition-all duration-200 
                         shadow-lg hover:shadow-xl"
            >
              Start Study Session 📚
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Chat Pages
  if (currentPage === 'chat1') {
    return <Chat1 nickname={nickname} onLogout={handleLogout} />;
  }

  if (currentPage === 'chat2') {
    return <Chat2 nickname={nickname as 'Vishwa' | 'Ammu'} onLogout={handleLogout} />;
  }

  return null;
}

export default App;