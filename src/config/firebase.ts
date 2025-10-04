import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, FacebookAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyB1bSKDI-g83rr3v1BpPaELJUhF7yX_e8k",
  authDomain: "spartan-62cd1.firebaseapp.com",
  projectId: "spartan-62cd1",
  storageBucket: "spartan-62cd1.firebasestorage.app",
  messagingSenderId: "385033968866",
  appId: "1:385033968866:web:5229b345c7c426e925d2bb",
  measurementId: "G-K48HRVRG3L"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const googleProvider = new GoogleAuthProvider();
export const facebookProvider = new FacebookAuthProvider();
