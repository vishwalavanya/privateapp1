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
// 4) Helper: Get / refresh the FCM token
//    • Prompts user for notification permission if needed
//    • Returns null if permission denied
// ---------------------------------------------------------------------------
export async function requestToken(): Promise<string | null> {
  try {
    // Ask permission if we don't have it yet
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
// 5) Helper: foreground message listener
//    Usage:  const unsub = onForegroundMessage(payload => { ... });
// ---------------------------------------------------------------------------
export const onForegroundMessage = (cb: (payload: any) => void) =>
  onMessage(messaging, cb);