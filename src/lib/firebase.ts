
// Import the functions you need from the SDKs you need
import { initializeApp, getApps, type FirebaseApp } from "firebase/app";
import { getAuth, browserLocalPersistence, indexedDBLocalPersistence, browserSessionPersistence } from "firebase/auth";
import { getAnalytics, type Analytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore"; // Added Firestore

// Your web app's Firebase configuration (Hardcoded as per user request from previous step)
// IMPORTANT: This configuration was hardcoded based on a previous request.
// For better practice, especially if deploying or sharing, consider moving sensitive
// parts back to environment variables (.env.local).
const firebaseConfig = {
  apiKey: "AIzaSyAgXONsmCvlu4QVej9S0Ja2_RiazF94Urw",
  authDomain: "bandtrack-lite.firebaseapp.com",
  projectId: "bandtrack-lite",
  storageBucket: "bandtrack-lite.firebasestorage.app",
  messagingSenderId: "654934617211",
  appId: "1:654934617211:web:7093f8a0afe28f69c746de",
  measurementId: "G-XN07YZDNCY"
};

// Initialize Firebase
let app: FirebaseApp;
let analytics: Analytics | undefined;

if (!getApps().length) {
  try {
    app = initializeApp(firebaseConfig);
    if (typeof window !== 'undefined') {
      analytics = getAnalytics(app);
    }
  } catch (error) {
    console.error("Firebase initializeApp error:", error);
    throw new Error("Could not initialize Firebase. Please check your configuration. Error: " + (error as Error).message);
  }
} else {
  app = getApps()[0];
  if (typeof window !== 'undefined' && !analytics) {
    analytics = getAnalytics(app);
  }
}

const auth = getAuth(app);
const db = getFirestore(app); // Initialized Firestore

if (typeof window !== 'undefined') {
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
}

export { app, auth, analytics, db }; // Export db
