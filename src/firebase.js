import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-app.js";
import {
  getFirestore,
  doc,
  setDoc,
  deleteDoc,
  collectionGroup,
  onSnapshot,
} from "https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyCNYgDt8mPkxvw-ab-KKAVYhHz_utF5700",
  authDomain: "study-streak-tracker-3216c.firebaseapp.com",
  projectId: "study-streak-tracker-3216c",
  storageBucket: "study-streak-tracker-3216c.firebasestorage.app",
  messagingSenderId: "6006532674",
  appId: "1:6006532674:web:31862c852d4f8277239bdb",
};

const app = initializeApp(firebaseConfig);
const db  = getFirestore(app);

// study_entries/{date}/users/{userId} → { status, note }

export function saveEntry(date, userId, status, note) {
  return setDoc(doc(db, "study_entries", date, "users", userId), { status, note });
}

export function clearEntry(date, userId) {
  return deleteDoc(doc(db, "study_entries", date, "users", userId));
}

export function subscribeAll(onChange) {
  return onSnapshot(collectionGroup(db, "users"), (snap) => {
    const map = {};
    snap.forEach((d) => {
      const userId = d.id;
      const date   = d.ref.parent.parent.id;
      if (!map[date]) map[date] = {};
      map[date][userId] = d.data();
    });
    onChange(map);
  });
}
