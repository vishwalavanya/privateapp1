import React, { useState, useEffect, useRef } from 'react';
import { BookOpen, Send, LogOut, Bell, BellOff, Plus, X, Mail, Mail as MailOff } from 'lucide-react';
import { useChat } from '../hooks/useChat';
import KissEmojiRain from '../components/KissEmojiRain';
import RobotCloud from '../components/RobotCloud';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage, db } from '../firebase';
import { doc, setDoc, onSnapshot } from 'firebase/firestore';

interface Chat2Props {
  nickname: 'Vishwa' | 'Ammu';
  onLogout: () => void;
}

function Chat2({ nickname, onLogout }: Chat2Props) {
  const [message, setMessage] = useState('');
  const [notificationsOn, setNotificationsOn] = useState(true);
  const [emailNotificationsOn, setEmailNotificationsOn] = useState(true);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [otherUserActive, setOtherUserActive] = useState(false);
  const [lastSeen, setLastSeen] = useState<string>('');
  const [showKissRain, setShowKissRain] = useState(false);

  const { msgs, send, clear } = useChat('privateMessages', nickname);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const otherUser = nickname === 'Vishwa' ? 'Ammu' : 'Vishwa';

  useEffect(() => {
    let activityTimer: NodeJS.Timeout;
    const updateActivity = async (active: boolean) => {
      try {
        await setDoc(doc(db, 'users', nickname), {
          isActive: active,
          lastSeen: new Date()
        }, { merge: true });
      } catch (error) {
        console.error('Error updating activity:', error);
      }
    };
    const resetTimer = () => {
      clearTimeout(activityTimer);
      updateActivity(true);
      activityTimer = setTimeout(() => updateActivity(false), 30000);
    };
    updateActivity(true);
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];
    events.forEach(event => document.addEventListener(event, resetTimer, true));
    return () => {
      clearTimeout(activityTimer);
      updateActivity(false);
      events.forEach(event => document.removeEventListener(event, resetTimer, true));
    };
  }, [nickname]);

  useEffect(() => {
    const unsubscribe = onSnapshot(doc(db, 'users', otherUser), (doc) => {
      if (doc.exists()) {
        const data = doc.data();
        setOtherUserActive(data.isActive || false);
        if (!data.isActive && data.lastSeen) {
          const lastSeenDate = data.lastSeen.toDate();
          const now = new Date();
          const diffInHours = (now.getTime() - lastSeenDate.getTime()) / (1000 * 60 * 60);
          if (diffInHours < 24) {
            setLastSeen(`last seen today at ${lastSeenDate.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}`);
          } else if (diffInHours < 48) {
            setLastSeen(`last seen yesterday at ${lastSeenDate.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}`);
          } else {
            setLastSeen(`last seen ${lastSeenDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit', hour12: true })}`);
          }
        }
      }
    });
    return () => unsubscribe();
  }, [otherUser]);

  useEffect(() => {
    const savedNotifications = localStorage.getItem(`notifications_${nickname}`);
    const savedEmailNotifications = localStorage.getItem(`emailNotifications_${nickname}`);
    if (savedNotifications === 'off') setNotificationsOn(false);
    if (savedEmailNotifications === 'off') setEmailNotificationsOn(false);
  }, [nickname]);

  const handleNotificationToggle = () => {
    const newState = !notificationsOn;
    setNotificationsOn(newState);
    localStorage.setItem(`notifications_${nickname}`, newState ? 'on' : 'off');
  };

  const handleEmailNotificationToggle = () => {
    const newState = !emailNotificationsOn;
    setEmailNotificationsOn(newState);
    localStorage.setItem(`emailNotifications_${nickname}`, newState ? 'on' : 'off');
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [msgs]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedImage) {
      await handleSendImage();
    } else if (message.trim()) {
      let textToSend = message.trim();
      if (nickname !== 'Vishwa' && nickname !== 'Ammu') {
        textToSend = `🤖 ${textToSend}`;
      }
      await send(textToSend, 'text');
      setMessage('');
    }
  };

  useEffect(() => {
    if (msgs.length > 0) {
      const latestMessage = msgs[msgs.length - 1];
      if (latestMessage.text?.includes('😘') && latestMessage.by === 'Vishwa' && nickname === 'Ammu') {
        setShowKissRain(true);
      }
    }
  }, [msgs, nickname]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSendImage = async () => {
    if (selectedImage && !isUploading) {
      setIsUploading(true);
      try {
        const timestamp = Date.now();
        const fileName = `${timestamp}_${selectedImage.name}`;
        const imageRef = ref(storage, `images/${fileName}`);
        const snapshot = await uploadBytes(imageRef, selectedImage);
        const downloadURL = await getDownloadURL(snapshot.ref);
        await send('', 'image', downloadURL, fileName);
        setSelectedImage(null);
        setImagePreview(null);
      } catch (error) {
        console.error('Error uploading image:', error);
        alert('Failed to upload image. Please try again.');
      } finally {
        setIsUploading(false);
      }
    }
  };

  const handleCancelImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
  };

  const formatMessageTime = (timestamp: any) => {
    if (!timestamp) return '';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
    if (diffInHours < 24) {
      return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
    } else if (diffInHours < 48) {
      return `Yesterday ${date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}`;
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit', hour12: true });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
      <KissEmojiRain show={showKissRain} onComplete={() => setShowKissRain(false)} />
      {/* Fixed Header */}
      <div className="fixed top-0 left-0 right-0 bg-white/90 backdrop-blur-sm border-b border-green-200 px-4 py-3 z-20 shadow-md">
        <div className="flex items-center justify-between max-w-4xl mx-auto">
          <div className="flex items-center gap-3">
            <BookOpen className="w-6 h-6 text-green-600" />
            <div>
              <h1 className="text-lg font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                GK Study Discussion
              </h1>
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <span className={`flex items-center gap-1 ${otherUserActive ? 'text-green-600' : 'text-gray-400'}`}>
                  <div className={`w-2 h-2 rounded-full ${otherUserActive ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                  {otherUser} {otherUserActive ? 'online' : lastSeen || 'offline'}
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={handleNotificationToggle} className={`p-2 rounded-full ${notificationsOn ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'}`}>
              {notificationsOn ? <Bell className="w-4 h-4" /> : <BellOff className="w-4 h-4" />}
            </button>
            <button onClick={handleEmailNotificationToggle} className={`p-2 rounded-full ${emailNotificationsOn ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'}`}>
              {emailNotificationsOn ? <Mail className="w-4 h-4" /> : <MailOff className="w-4 h-4" />}
            </button>
            <button onClick={clear} className="px-3 py-2 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
              🗑️
            </button>
            <button onClick={onLogout} className="flex items-center gap-2 px-3 py-2 rounded-full text-sm font-medium bg-gray-100 text-gray-600">
              <LogOut className="w-4 h-4" />
              Exit
            </button>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="pt-16 pb-32 max-w-4xl mx-auto p-4">
        <div className="space-y-2">
          {msgs.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📚💬</div>
              <p className="text-gray-500 italic">Start your study discussion here...</p>
            </div>
          ) : (
            msgs.map((msg: any) => (
              <RobotCloud
                key={msg.id}
                text={msg.text}
                imageUrl={msg.imageUrl}
                fileName={msg.fileName}
                isOwn={msg.by === nickname}
                isUser={msg.by === nickname}
                isAI={msg.by !== nickname && msg.text?.startsWith('🤖')}
                type={msg.type}
                currentUserNickname={nickname}
                timestamp={formatMessageTime(msg.ts)}
              />
            ))
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Image Preview Modal */}
      {imagePreview && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-4 max-w-md w-full">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium text-gray-800">Send Image</h3>
              <button onClick={handleCancelImage} className="p-1 hover:bg-gray-100 rounded-full">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <img src={imagePreview} alt="Preview" className="w-full h-auto rounded-xl mb-4 max-h-64 object-cover" />
            <div className="flex gap-3">
              <button onClick={handleCancelImage} className="flex-1 px-4 py-2 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50">Cancel</button>
              <button onClick={handleSendImage} disabled={isUploading} className="flex-1 px-4 py-2 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 text-white">
                {isUploading ? 'Sending...' : 'Send'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Input */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-sm border-t border-green-200 p-4">
        <form onSubmit={handleSendMessage} className="max-w-4xl mx-auto">
          <div className="flex gap-3 items-end">
            <button type="button" onClick={() => fileInputRef.current?.click()} className="bg-gradient-to-r from-green-500 to-emerald-500 text-white p-3 rounded-full">
              <Plus className="w-5 h-5" />
            </button>
            <div className="flex-1">
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your message..."
                className="w-full px-4 py-3 rounded-2xl border border-green-200 focus:ring-2 resize-none"
                rows={1}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage(e);
                  }
                }}
              />
            </div>
            <button type="submit" disabled={!message.trim() && !selectedImage} className="bg-gradient-to-r from-green-500 to-emerald-500 text-white p-3 rounded-full">
              <Send className="w-5 h-5" />
            </button>
          </div>
        </form>
        <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
      </div>
    </div>
  );
}

export default Chat2;
