// src/api/firebase.js

/* eslint-disable */
import { initializeApp } from "firebase/app";
import { getAuth, setPersistence, browserLocalPersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getFunctions, httpsCallable } from "firebase/functions";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBLDZNp9PMaCow_5WFdQI-v3JiHXz64XAk",
  authDomain: "ct216project-75856.firebaseapp.com",
  projectId: "ct216project-75856",
  storageBucket: "ct216project-75856.firebasestorage.app",
  messagingSenderId: "207415672997",
  appId: "1:207415672997:web:0dc8d4bde98759212b0d4c",
  measurementId: "G-MMRT5TYRSS"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore and Firebase Auth
const db = getFirestore(app);
const auth = getAuth(app);
setPersistence(auth, browserLocalPersistence); // Set persistence to local, saving user login across sessions

// Initialize Firebase Functions
const functions = getFunctions(app);
export const createUser = httpsCallable(functions, 'createUser');

// Export Firebase services
export { auth, db, functions };

export default app;
