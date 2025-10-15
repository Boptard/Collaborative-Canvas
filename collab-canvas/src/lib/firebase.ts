import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID
};

// Debug: Log the config to check if env vars are loaded
console.log('Firebase Config:', {
  apiKey: firebaseConfig.apiKey ? 'Set (hidden)' : 'NOT SET',
  authDomain: firebaseConfig.authDomain ? 'Set' : 'NOT SET',
  projectId: firebaseConfig.projectId ? 'Set' : 'NOT SET',
  storageBucket: firebaseConfig.storageBucket ? 'Set' : 'NOT SET',
  messagingSenderId: firebaseConfig.messagingSenderId ? 'Set' : 'NOT SET',
  appId: firebaseConfig.appId ? 'Set' : 'NOT SET'
});

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);