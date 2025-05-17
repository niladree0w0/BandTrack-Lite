
// Import the functions you need from the SDKs you need
import { initializeApp, getApps, type FirebaseApp } from "firebase/app";
import { getAuth, browserLocalPersistence, indexedDBLocalPersistence, browserSessionPersistence } from "firebase/auth";

// Your web app's Firebase configuration
// It's recommended to use environment variables for these
const firebaseApiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;

if (!firebaseApiKey || typeof firebaseApiKey !== 'string' || firebaseApiKey.trim() === '') {
  console.error(
    "Firebase API Key is MISSING or INVALID. \n" +
    "1. Ensure you have a '.env.local' file in the ROOT of your project (not inside 'src').\n" +
    "2. Ensure NEXT_PUBLIC_FIREBASE_API_KEY is correctly set in '.env.local' with the value from your Firebase project settings.\n" +
    "3. IMPORTANT: You MUST RESTART your Next.js development server after creating or modifying the '.env.local' file.\n" +
    "Received API Key: ", firebaseApiKey 
  );
  // Throw an error to prevent Firebase from initializing with an invalid key
  throw new Error(
    "Firebase Initialization Failed: API Key is missing or invalid. " +
    "Please check your '.env.local' file and restart your development server. " +
    "See the console for more detailed instructions."
  );
}

const firebaseConfig = {
  apiKey: firebaseApiKey,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID, // Optional
};

// Initialize Firebase
let app: FirebaseApp;
if (!getApps().length) {
  try {
    app = initializeApp(firebaseConfig);
  } catch (error) {
    console.error("Firebase initializeApp error:", error);
    // Prevent further errors if initialization fails critically
    throw new Error("Could not initialize Firebase. Please check your configuration and .env.local file. Error: " + (error as Error).message);
  }
} else {
  app = getApps()[0];
}

const auth = getAuth(app);

// Attempt to set persistence. Start with indexedDB, fall back to local, then session.
// This helps ensure session persistence across browser sessions.
auth.setPersistence(indexedDBLocalPersistence)
  .catch((error) => {
    console.warn("Firebase: Could not set indexedDB persistence. Trying localStorage.", (error as Error).message);
    return auth.setPersistence(browserLocalPersistence);
  })
  .catch((error) => {
    console.warn("Firebase: Could not set localStorage persistence. Trying session.", (error as Error).message);
    return auth.setPersistence(browserSessionPersistence);
  })
  .catch((error) => {
    console.error("Firebase: Could not set any persistence.", (error as Error).message);
  });


export { app, auth };
