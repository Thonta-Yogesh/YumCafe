import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, OAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyD_BNigs4HEdSH9fowLlBStKHu7iTzlGE0",
  authDomain: "yumcafe-989.firebaseapp.com",
  projectId: "yumcafe-989",
  storageBucket: "yumcafe-989.firebasestorage.app",
  messagingSenderId: "585239450984",
  appId: "1:585239450984:web:0571433a288f260cf232dd",
  measurementId: "G-Y9C0N1CHDD"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

// Providers
export const googleProvider = new GoogleAuthProvider();
export const outlookProvider = new OAuthProvider('microsoft.com');
