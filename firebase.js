// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAZgq-vlCrjYNPmqEQ0SKgUrT8UCBh7q9I",
  authDomain: "crossrealityblackjack.firebaseapp.com",
  projectId: "crossrealityblackjack",
  storageBucket: "crossrealityblackjack.firebasestorage.app",
  messagingSenderId: "202209416084",
  appId: "1:202209416084:web:209768afeed71e77193581",
  measurementId: "G-TL60285YEJ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);