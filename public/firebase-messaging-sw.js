// Firebase Cloud Messaging Service Worker
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');

// Initialize Firebase in the service worker
const firebaseConfig = {
  apiKey: 'AIzaSyCJB10ot9q_6KpI_borDB987gZWuidX40I',
  authDomain: 'vishwanavya-72a92.firebaseapp.com',
  projectId: 'vishwanavya-72a92',
  storageBucket: 'vishwanavya-72a92.appspot.com',
  messagingSenderId: '34331683691',
  appId: '1:34331683691:web:09cd70702c7f70dd83fa2e',
};

firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();

// Handle background messages
messaging.onBackgroundMessage((payload) => {
  console.log('Received background message:', payload);
  
  const notificationTitle = payload.notification?.title || 'New Message';
  const notificationOptions = {
    body: payload.notification?.body || 'You have a new message',
    icon: '/vite.svg',
    badge: '/vite.svg',
    tag: 'message-notification',
    requireInteraction: true,
    actions: [
      {
        action: 'open',
        title: 'Open Chat'
      }
    ]
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  event.waitUntil(
    clients.openWindow('/')
  );
});