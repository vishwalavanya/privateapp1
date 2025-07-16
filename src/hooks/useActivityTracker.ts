@@ .. @@
 import { useEffect, useState } from 'react';
-import { doc, setDoc, onSnapshot } from 'firebase/firestore';
+import { doc, setDoc, onSnapshot, getDoc } from 'firebase/firestore';
 import { db } from '../firebase';
@@ .. @@
     const updateActivity = async (active: boolean) => {
       try {
-        await setDoc(doc(db, 'users', nickname), {
+        // Store activity in Firestore users collection
+        await setDoc(doc(db, 'users', nickname), {
           isActive: active,
-          lastSeen: new Date()
+          lastSeen: new Date(),
+          id: nickname
         }, { merge: true });
         
         setIsActive(active);
@@ .. @@