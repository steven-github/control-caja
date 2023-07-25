// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// import { getDatabase } from "firebase/database";
import { getFirestore } from "firebase/firestore";
// import { getAnalytics } from "firebase/analytics";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDphPYuk2SEx2O8JVCQOdPb7WNVspiaFrg",
  authDomain: "control-caja-1c40f.firebaseapp.com",
  projectId: "control-caja-1c40f",
  storageBucket: "control-caja-1c40f.appspot.com",
  messagingSenderId: "637309864833",
  appId: "1:637309864833:web:d5bb3368f17e24ea35f680",
  measurementId: "G-BBN0VWE494",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);

// Initialize Realtime Database and get a reference to the service
export const db = getFirestore(app);
