import { Unsubscribe } from '@firebase/util';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, onSnapshot, Timestamp } from "firebase/firestore";

// TODO: Replace the following with your app's Firebase project configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

export type ChatData = {
  msg: string;
  user: string;
  date: Timestamp;
}

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export const addData = async (text: string, user: string) => {
  const docRef = await addDoc(collection(db, "chats"), {
    msg: text,
    user: user,
    date: Timestamp.now()
  });
  console.log("Document written with ID: ", docRef.id);
} 

export const onSnapshotTest = (cb: (id: string, data: ChatData) => void) => {
  const q = collection(db, "chats");
  // firestore組み込みのonSnapShotメソッドは必ずunsubscribeを返す
  // unscribeを呼ぶことでリスナーを解除できるので、忘れずに呼ぶこと
  const unsubscribe: Unsubscribe = onSnapshot(q, (querySnapshot) => {
    querySnapshot.docChanges().forEach((change) => {
      if(change.type === "added") {
        cb(change.doc.id, change.doc.data() as ChatData);
      }
    });
  });

  return unsubscribe;
}


