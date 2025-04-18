// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
const firebaseConfig = {
  apiKey: "AIzaSyAxm7qtwA-HnVlbNa0nbvkJ2GVDku38VIQ",
  authDomain: "careerpathnavigator-8783c.firebaseapp.com",
  projectId: "careerpathnavigator-8783c",
  storageBucket: "careerpathnavigator-8783c.firebasestorage.app",
  messagingSenderId: "411185912011",
  appId: "1:411185912011:web:03fb1b13a0aae0fe33634e",
  measurementId: "G-F14VF8W9RJ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
let analytics;
if (typeof window !== "undefined") {
  analytics = getAnalytics(app);
}
const firestore = getFirestore(app);
const auth = getAuth(app); 
const db = getFirestore(app); // Initialize Firestore
export { app, analytics, firestore, auth , db};