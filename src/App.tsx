@@ .. @@
 import React, { useState, useEffect } from 'react';
 import { Heart, BookOpen } from 'lucide-react';
 import Chat1 from './pages/Chat1';
 import Chat2 from './pages/Chat2';
-import { requestToken, onForegroundMessage } from './firebase';
+import { requestToken, onForegroundMessage } from './firebase';

@@ .. @@
   // Handle notification clicks - always redirect to login
   useEffect(() => {
+    // Request notification permission and token
+    const initializeNotifications = async () => {
+      try {
+        const token = await requestToken();
+        if (token) {
+          console.log('FCM token obtained:', token);
+        }
+      } catch (error) {
+        console.error('Error initializing notifications:', error);
+      }
+    };
+
+    initializeNotifications();
+
     const handleNotificationClick = () => {
       setCurrentPage('login');
       setNickname('');
       setInputNickname('');
     };

     // Listen for notification clicks
     if ('serviceWorker' in navigator) {
       navigator.serviceWorker.addEventListener('message', handleNotificationClick);
     }

+    // Listen for foreground messages
+    const unsubscribe = onForegroundMessage((payload) => {
+      console.log('Foreground message received:', payload);
+      // Handle the message as needed
+    });

     return () => {
       if ('serviceWorker' in navigator) {
         navigator.serviceWorker.removeEventListener('message', handleNotificationClick);
       }
+      unsubscribe();
     };
   }, []);