import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, initializeAuth, getReactNativePersistence } from 'firebase/auth';
import { getFirestore, collection, addDoc, doc, getDoc, updateDoc, setDoc } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import AsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: "process.env.REACT_APP_FIREBASE_API_KEY",
  projectId: "process.env.REACT_APP_FIREBASE_AUTH_DOMAIN",
  storageBucket: "process.env.REACT_APP_FIREBASE_STORAGE_BUCKET",
  messagingSenderId: "process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID",
  appId: "process.env.REACT_APP_FIREBASE_APP_ID"
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Initialize Firebase Auth with persistence
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage)
});

// Initialize Firestore
const db = getFirestore(app);

// Initialize Storage
const storage = getStorage(app);

export { auth, db, storage, collection, addDoc, doc, getDoc, updateDoc, setDoc };
