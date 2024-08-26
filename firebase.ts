// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC526oRh5UfgevhTkFub_GhNysznu4900M",
  authDomain: "hackathon3-b37de.firebaseapp.com",
  projectId: "hackathon3-b37de",
  storageBucket: "hackathon3-b37de.appspot.com",
  messagingSenderId: "682797158576",
  appId: "1:682797158576:web:0fbcfae2ae2ff861572b75",
  measurementId: "G-2Q6L40W0Z5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
// const analytics = getAnalytics(app);

export { db };