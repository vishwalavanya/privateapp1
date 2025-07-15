import { useEffect, useState } from 'react';
import { doc, setDoc, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';

export function useActivityTracker(nickname: string) {
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    let activityTimer: NodeJS.Timeout;

    const updateActivity = async (active: boolean) => {
      try {
        await setDoc(doc(db, 'users', nickname), {
          isActive: active,
          lastSeen: new Date()
        }, { merge: true });
        
        setIsActive(active);
        
        if (nickname === 'Vishwa') {
          console.log(`👤 Vishwa is now ${active ? 'ACTIVE (in chat - no emails will be sent)' : 'INACTIVE (not in chat - emails will be sent)'}`);
        } else {
          console.log(`👤 ${nickname} is now ${active ? 'ACTIVE' : 'INACTIVE'}`);
        }
      } catch (error) {
        console.error('Error updating activity:', error);
      }
    };

    const resetTimer = () => {
      clearTimeout(activityTimer);
      updateActivity(true);
      
      activityTimer = setTimeout(() => {
        updateActivity(false);
      }, 30000); // 30 seconds of inactivity
    };

    // Initial activity
    updateActivity(true);

    // Activity listeners
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];
    events.forEach(event => {
      document.addEventListener(event, resetTimer, true);
    });

    // Cleanup on unmount
    return () => {
      clearTimeout(activityTimer);
      updateActivity(false);
      events.forEach(event => {
        document.removeEventListener(event, resetTimer, true);
      });
    };
  }, [nickname]);

  return { isActive };
}