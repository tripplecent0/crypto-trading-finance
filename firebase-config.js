// Import the core Firebase SDK modules directly from the cloud CDN network
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { getDatabase, ref, set, onValue } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-database.js";

// Your custom structural Firebase credential keys mapped precisely from your screenshot
const firebaseConfig = {
  apiKey: "AIzaSyBkbchDPs4f0i2GaFprXr3C-XGOoim0uVA",
  authDomain: "apex-trade-assist.firebaseapp.com",
  projectId: "apex-trade-assist",
  storageBucket: "apex-trade-assist.firebasestorage.app",
  messagingSenderId: "767565809694",
  appId: "1:767565809694:web:8ca9a947e743ff1c20060f",
  measurementId: "G-837684V50M"
};

// Initialize Firebase App Instance
const app = initializeApp(firebaseConfig);

// Export instances to be consumed by both main dashboard and administrative controllers
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getDatabase(app);

console.log("Firebase Global Cluster connected successfully.");
