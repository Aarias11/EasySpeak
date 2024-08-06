import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, initializeAuth, getReactNativePersistence } from 'firebase/auth';
import { getFirestore, collection, addDoc, doc, getDoc } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import AsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: "AIzaSyD3eaKiKMKiiySLyG3m1u2osyi6KTdTW6w",
  authDomain: "translateapp-80ee7.firebaseapp.com",
  projectId: "translateapp-80ee7",
  storageBucket: "translateapp-80ee7.appspot.com",
  messagingSenderId: "833551599501",
  appId: "1:833551599501:web:3118e80c0b785c36811fc4"
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

export { auth, db, storage, collection, addDoc, doc, getDoc };
