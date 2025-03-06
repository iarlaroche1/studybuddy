// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, setPersistence, browserLocalPersistence } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
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


// initialise firebase auth
// eslint-disable-next-line
const auth = getAuth(app);
setPersistence(auth, browserLocalPersistence); // set persistence to local, saving user login across sessions

export default app;