import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { getDatabase, ref, set, onValue } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-database.js";
import { auth, googleProvider, db } from "./firebase-config.js";

// Global layout element references
const idDisplay = document.getElementById('display-user-id');
const balanceDisplay = document.querySelector('.text-emerald-400.text-3x1') || document.body;
const profileBtn = document.getElementById('userMenuBtn');

// 1. Google Login handler when clicking the emerald text
if (idDisplay) {
    idDisplay.addEventListener('click', () => {
        signInWithPopup(auth, googleProvider)
            .then((result) => {
                console.log("User signed in successfully:", result.user.email);
            })
            .catch((err) => {
                console.error("Login Error:", err);
            });
    });
}

// 2. Profile tracking and data sync
onAuthStateChanged(auth, (user) => {
    if (user) {
        // Safe string format key for database pathing
        const cleanId = user.email.replace(/[.#$[\]]/g, "_");

        if (idDisplay) idDisplay.textContent = user.email;
        
        if (profileBtn) {
            const label = profileBtn.querySelector('span');
            if (label) label.textContent = "Connected Account";
        }

        // Fetch user database balance parameters safely
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
