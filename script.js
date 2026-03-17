import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { getFirestore, doc, setDoc, getDoc, updateDoc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

// --- 1. Firebase Configuration ---
const firebaseConfig = {
  apiKey: "AIzaSyCMwFJfbkdFjxWzNhMccXs9FbhqntSKdRM",
  authDomain: "portfolio-auth-19a5e.firebaseapp.com",
  projectId: "portfolio-auth-19a5e",
  storageBucket: "portfolio-auth-19a5e.firebasestorage.app",
  messagingSenderId: "211741915178",
  appId: "1:211741915178:web:b96f48f37ef2477b83ab53"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// --- 2. UI Elements & Popup Logic (Fix for Button Not Opening) ---
const wrapper = document.querySelector('.wrapper');
const loginLink = document.querySelector('.login-link');
const registerLink = document.querySelector('.register-link');
const btnPopup = document.querySelector('.btnLogin-popup');
const iconClose = document.querySelector('.icon-close');

if (btnPopup) btnPopup.onclick = () => wrapper.classList.add('active-popup');
if (iconClose) iconClose.onclick = () => wrapper.classList.remove('active-popup');
if (registerLink) registerLink.onclick = () => wrapper.classList.add('active');
if (loginLink) loginLink.onclick = () => wrapper.classList.remove('active');

// Toast Notification
const showToast = (icon, title) => {
    Swal.mixin({
        toast: true, position: 'top-end', showConfirmButton: false, timer: 2000, timerProgressBar: true
    }).fire({ icon, title });
};

// --- 3. Registration Logic ---
const registerForm = document.querySelector('.form-box.register form');
if (registerForm) {
    registerForm.onsubmit = async (e) => {
        e.preventDefault();
        const username = registerForm.querySelector('input[type="text"]').value;
        const email = registerForm.querySelector('input[type="email"]').value;
        const password = document.getElementById('regPass').value;
        try {
            const result = await createUserWithEmailAndPassword(auth, email, password);
            await setDoc(doc(db, "users", result.user.uid), {
                username, email, createdAt: new Date()
            });
            showToast('success', 'Account Created!');
            wrapper.classList.remove('active');
        } catch (err) { showToast('error', 'Registration Failed!'); }
    };
}

// --- 4. Login Logic (Redirection Fix) ---
const loginForm = document.querySelector('.form-box.login form');
if (loginForm) {
    loginForm.onsubmit = (e) => {
        e.preventDefault();
        const email = loginForm.querySelector('input[type="email"]').value;
        const password = document.getElementById('logPass').value;
        signInWithEmailAndPassword(auth, email, password)
            .then(() => {
                showToast('success', 'Login Ho Gaya!');
                setTimeout(() => { window.location.href = "portfolio.html"; }, 1500);
            })
            .catch(() => showToast('error', 'Galat Email ya Password!'));
    };
}

// --- 5. Auth State & Profile Update ---
onAuthStateChanged(auth, async (user) => {
    const isPortfolio = window.location.pathname.includes("portfolio.html");
    if (user && isPortfolio) {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
            const data = userDoc.data();
            document.getElementById('welcomeMessage').innerText = `Welcome, ${data.username}!`;
            document.getElementById('userEmailDisplay').innerText = data.email;
            if (data.profilePic) document.getElementById('userDP').src = data.profilePic;
        }
        // Photo Update Logic
        const btnUpdate = document.getElementById('btnUpdatePhoto');
        if(btnUpdate) {
            btnUpdate.onclick = async () => {
                const url = document.getElementById('photoURLInput').value;
                if (url) {
                    await updateDoc(doc(db, "users", user.uid), { profilePic: url });
                    document.getElementById('userDP').src = url;
                    showToast('success', 'Photo Updated!');
                }
            };
        }
    } else if (!user && isPortfolio) {
        window.location.href = "index.html";
    }
});

// --- 6. Logout Logic (404 Fix) ---
const btnLogout = document.getElementById('btnLogout');
if (btnLogout) {
    btnLogout.onclick = () => {
        signOut(auth).then(() => {
            showToast('info', 'Logged Out!');
            setTimeout(() => { window.location.href = "index.html"; }, 1000);
        });
    };
}
