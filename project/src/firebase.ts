// src/firebase.ts
// ----------------------------------------------------------------------------
//  Firebase core setup  |  Firestore  |  Storage  |  Cloud‑Messaging helpers
// ----------------------------------------------------------------------------
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import {
  getMessaging,
  getToken,
  onMessage,
  Messaging,
} from 'firebase/messaging';

// ---------------------------------------------------------------------------
// 1) Firebase project config
// ---------------------------------------------------------------------------
const firebaseConfig = {
  apiKey: 'AIzaSyCJB10ot9q_6KpI_borDB987gZWuidX40I',
  authDomain: 'vishwanavya-72a92.firebaseapp.com',
  projectId: 'vishwanavya-72a92',
  storageBucket: 'vishwanavya-72a92.appspot.com',
  messagingSenderId: '34331683691',
  appId: '1:34331683691:web:09cd70702c7f70dd83fa2e',
};

// ---------------------------------------------------------------------------
// 2) Initialise SDKs
// ---------------------------------------------------------------------------
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const messaging: Messaging = getMessaging(app);

// ---------------------------------------------------------------------------
// 3) Register service‑worker (runs once).  Works on https:// or localhost.
// ---------------------------------------------------------------------------
const swPromise: Promise<ServiceWorkerRegistration | null> = (async () => {
  // Skip Service Worker registration in StackBlitz environment
  if (window.location.hostname.includes('stackblitz') || 
      window.location.hostname.includes('webcontainer')) {
    console.log('⚠️ Service Worker skipped: Not supported in StackBlitz environment');
    return null;
  }
  
  if (!('serviceWorker' in navigator)) return null;
  try {
    const reg = await navigator.serviceWorker.register(
      '/firebase-messaging-sw.js'
    );
    console.log('✅ firebase-messaging-sw.js registered:', reg.scope);
    return reg;
  } catch (err) {
    console.error('❌ SW registration failed:', err);
    return null;
  }
})();

// ---------------------------------------------------------------------------
// 4) Public VAPID key (from Firebase Console → Cloud Messaging)
// ---------------------------------------------------------------------------
const VAPID_KEY =
  'BCDcA3m_WEZAPxGdHl9SRetRRagpM7pBDcjTkKmwkXLrHsiXseSskWKbfy6zwLvhVoCT8xe6j9ZeQt5dHaWPLh4';

// ---------------------------------------------------------------------------
// 5) Helper: Get / refresh the FCM token
//    • Prompts user for notification permission if needed
//    • Returns null if permission denied
// ---------------------------------------------------------------------------
export async function requestFCMToken(): Promise<string | null> {
  try {
    // Ask permission if we don’t have it yet
    if (Notification.permission === 'default') {
      const result = await Notification.requestPermission();
      if (result !== 'granted') return null;
    }
    if (Notification.permission !== 'granted') return null;

    // Ensure service‑worker is ready
    const registration = await swPromise;
    if (!registration) throw new Error('Service‑worker not registered');

    // Fetch (or re‑use cached) token
    const token = await getToken(messaging, {
      vapidKey: VAPID_KEY,
      serviceWorkerRegistration: registration,
    });

    if (token) {
      console.log('🎯 FCM token:', token);
      return token;
    }
    console.warn('⚠️ getToken returned null');
    return null;
  } catch (err) {
    console.error('❌ FCM token error:', err);
    return null;
  }
}

// ---------------------------------------------------------------------------
// 6) Helper: foreground message listener
//    Usage:  const unsub = onForegroundMessage(payload => { ... });
// ---------------------------------------------------------------------------
export const onForegroundMessage = (cb: (payload: any) => unknown) =>
  onMessage(messaging, cb);
