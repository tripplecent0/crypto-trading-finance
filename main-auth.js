import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAuth, GoogleAuthProvider, signInWithPopup, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-database.js";

// 1. Direct configuration keys
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

// 2. Initialize Firebase instances directly inside this file
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();
const db = getDatabase(app);

// 3. Layout elements
const idDisplay = document.getElementById('display-user-id');
const balanceDisplay = document.querySelector('.text-emerald-400.text-3x1') || document.body;
const profileBtn = document.getElementById('userMenuBtn');

// 4. Click Handler for Google Sign In Popup
if (idDisplay) {
    idDisplay.addEventListener('click', () => {
        console.log("Login button clicked, launching popup...");
        signInWithPopup(auth, googleProvider)
            .then((result) => {
                console.log("User signed in successfully:", result.user.email);
            })
            .catch((err) => {
                console.error("Login Error details:", err);
            });
    });
}

// 5. Monitor authentication state
onAuthStateChanged(auth, (user) => {
    if (user) {
        const cleanId = user.email.replace(/[.#$[\]]/g, "_");
        if (idDisplay) idDisplay.textContent = user.email;
        
        if (profileBtn) {
            const label = profileBtn.querySelector('span');
            if (label) label.textContent = "Connected Account";
        }

        const userDbRef = ref(db, 'users/' + cleanId);
        onValue(userDbRef, (snapshot) => {
            const data = snapshot.val();
            if (data && data.balance !== undefined) {
                if (balanceDisplay) balanceDisplay.textContent = "$" + parseFloat(data.balance).toFixed(2);
            }
        });
    } else {
        if (idDisplay) idDisplay.textContent = "Click to Sign In with Gmail";
    }
});
