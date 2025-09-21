
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_APIKEY,
  authDomain: "vingo-food-delivery-cad4c.firebaseapp.com",
  projectId: "vingo-food-delivery-cad4c",
  storageBucket: "vingo-food-delivery-cad4c.firebasestorage.app",
  messagingSenderId: "85505579607",
  appId: "1:85505579607:web:5a8b4956aad4f31d636112"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app)

export { app, auth }