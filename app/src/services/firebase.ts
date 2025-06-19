import { initializeApp } from 'firebase/app';
import { initializeAuth, getAuth, getReactNativePersistence } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getDatabase } from 'firebase/database';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.EXPO_PUBLIC_FIREBASE_DATABASE_URL,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

const isValidConfig = firebaseConfig.apiKey !== "demo-api-key" && firebaseConfig.projectId !== "demo-project";

if (!isValidConfig) {
  console.warn('Firebase is using demo configuration. Please set up your Firebase project and update environment variables.');
  console.warn('See .env.example for required environment variables.');
}

console.log(firebaseConfig)
const app = initializeApp(firebaseConfig);

let auth;
try {
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
  });
} catch (e: any) {
  if (e.code === 'auth/already-initialized') {
    auth = getAuth(app); // fallback if already initialized
  } else {
    throw e; // rethrow other errors
  }
}
const database = getDatabase(app);
const storage = getStorage(app);

export { app, auth, database, storage };
