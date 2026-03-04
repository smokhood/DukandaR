// Firebase Configuration and Initialization for DukandaR
import { FirebaseApp, getApps, initializeApp } from 'firebase/app';
import { Auth, getAuth } from 'firebase/auth';
import {
    Firestore,
    initializeFirestore,
    persistentLocalCache,
    persistentMultipleTabManager,
} from 'firebase/firestore';
import { FirebaseStorage, getStorage } from 'firebase/storage';

// Firebase configuration from environment variables
const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
};

// Initialize Firebase app (prevent duplicate initialization)
let app: FirebaseApp;
if (getApps().length === 0) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApps()[0];
}

// Initialize Firebase Auth
export const auth: Auth = getAuth(app);

// Initialize Firestore with offline persistence
export const db: Firestore = initializeFirestore(app, {
  localCache: persistentLocalCache({
    tabManager: persistentMultipleTabManager(),
  }),
});

// Initialize Firebase Storage
export const storage: FirebaseStorage = getStorage(app);

// Export the app instance
export { app };

// Re-export commonly used Firestore functions
    export {
        addDoc, arrayRemove, arrayUnion, collection, deleteDoc, doc, GeoPoint, getDoc, getDocs, increment, limit,
        onSnapshot, orderBy, query, serverTimestamp, setDoc, Timestamp, updateDoc, where, writeBatch
    } from 'firebase/firestore';

// Re-export Firebase Auth functions
export {
    onAuthStateChanged, PhoneAuthProvider,
    signInWithCredential, signInWithPhoneNumber, signOut
} from 'firebase/auth';

// Re-export Firebase Storage functions
export {
    deleteObject, getDownloadURL, ref as storageRef,
    uploadBytes,
    uploadBytesResumable
} from 'firebase/storage';

