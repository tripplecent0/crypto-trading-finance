import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAuth, GoogleAuthProvider } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyBkbchDPs4f0i2GaFprXr3C-XGooim0uVA",
  authDomain: "apex-trade-assist.firebaseapp.com",
  databaseURL: "https://apex-trade-assist-default-rtdb.firebaseio.com",
  projectId: "apex-trade-assist",
  storageBucket: "apex-trade-assist.firebasestorage.app",
  messagingSenderId: "767565809694",
  appId: "1:767565809694:web:8ca9a947e743ff1c20060f",
  measurementId: "G-837684V50M"
};

// Initialize Firebase App Instance
const app = initializeApp(firebaseConfig);

// Setup and EXPORT the services so main-auth.js can use them
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getDatabase(app);
