import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
apiKey: "AIzaSyBRkOfmzY5qO4XrIDgwxIMrWj6mmsNp2v0",
  authDomain: "expense-tracker-5f4f8.firebaseapp.com",
  projectId: "expense-tracker-5f4f8",
  storageBucket: "expense-tracker-5f4f8.firebasestorage.app",
  messagingSenderId: "854524853952",
  appId: "1:854524853952:web:78d6752c586a5a0a61f725",
};

const app = getApps().length === 0
  ? initializeApp(firebaseConfig)
  : getApp();

export const auth = getAuth(app);