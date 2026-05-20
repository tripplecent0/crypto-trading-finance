import { auth, googleProvider, db } from "./firebase-config.js";
import { ref, onValue } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-database.js";
import { signInWithPopup, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

const profileBtn = document.getElementById('userMenuBtn');
const idDisplay = document.getElementById('display-user-id');

// Global element variables to update balances securely without breaking layouts
const balanceDisplay = document.querySelector('.text-emerald-400.text-3xl') || document.body;

if (profileBtn) {
    profileBtn.addEventListener('click', () => {
        if (!auth.currentUser) {
            // If user isn't logged in, clicking the badge pops up Google Login safely
            signInWithPopup(auth, googleProvider)
                .then((result) => console.log("User signed in:", result.user.email))
                .catch((err) => console.error("Login Error:", err));
        }
    });
}

// Watch the cloud user state live
onAuthStateChanged(auth, (user) => {
    if (user) {
        // Clean the email string so it can be used as a database path key safely
        const cleanId = user.email.replace(/[.#$[\]]/g, "_");
        
        // Show their real ID in the Account Profile dropdown menu container
        if (idDisplay) idDisplay.textContent = user.email;
        if (profileBtn) {
            const label = profileBtn.querySelector('span');
            if (label) label.textContent = "Connected Account";
        }

        // Listen for live database balance updates pushed by the Admin control panel
        const userDbRef = ref(db, 'users/' + cleanId);
        onValue(userDbRef, (snapshot) => {
            const data = snapshot.val();
            if (data && data.balance !== undefined) {
                // Dynamically updates the display text safely
                if (balanceDisplay) balanceDisplay.textContent = `$${parseFloat(data.balance).toFixed(2)}`;
            }
        });
    } else {
        if (idDisplay) idDisplay.textContent = "Click to Sign In with Gmail";
    }
});
