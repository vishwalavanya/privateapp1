import { useEffect, useState } from "react";
import {
  collection,
  addDoc,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp,
  deleteDoc,
  getDocs
} from "firebase/firestore";
import { db } from "../firebase";

export function useChat(collectionName: string, nickname?: string) {
  const [msgs, setMsgs] = useState<any[]>([]);

  // Realtime listener
  useEffect(() => {
    const q = query(collection(db, collectionName), orderBy("ts", "asc"));
    const unsubscribe = onSnapshot(q, snap => {
      let allMsgs = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      
      // Filter messages based on user's clear timestamp
      if (nickname) {
        const clearedUntil = localStorage.getItem(`clearedUntil_${nickname}`);
        if (clearedUntil) {
          allMsgs = allMsgs.filter(msg => {
            if (msg.ts && msg.ts.toMillis) {
              return msg.ts.toMillis() > Number(clearedUntil);
            }
            return true;
          });
        }
      }
      
      setMsgs(allMsgs);
    });
    
    return unsubscribe;
  }, [collectionName, nickname]);

  // Send message
  const send = async (text: string, type: string = 'text', imageUrl?: string, fileName?: string, to?: string) => {
    const messageData: any = {
      by: nickname || "Anonymous",
      type,
      ts: serverTimestamp(),
      to: to || "all"
    };

    if (type === 'image') {
      messageData.imageUrl = imageUrl;
      messageData.fileName = fileName;
      messageData.text = '';
    } else {
      messageData.text = text;
    }

    await addDoc(collection(db, collectionName), messageData);
  };

  // Clear chat (only for current user)
  const clear = async () => {
    if (nickname) {
      localStorage.setItem(`clearedUntil_${nickname}`, Date.now().toString());
      // Trigger a re-filter of messages
      const clearedUntil = localStorage.getItem(`clearedUntil_${nickname}`);
      if (clearedUntil) {
        setMsgs(prevMsgs => 
          prevMsgs.filter(msg => {
            if (msg.ts && msg.ts.toMillis) {
              return msg.ts.toMillis() > Number(clearedUntil);
            }
            return true;
          })
        );
      }
    }
  };

  return { msgs, send, clear };
}