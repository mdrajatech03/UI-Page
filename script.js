import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { getFirestore, doc, setDoc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

// --- Your Configuration ---
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

// UI Selectors
const wrapper = document.querySelector('.wrapper');
const btnPopup = document.querySelector('.btnLogin-popup');
const iconClose = document.querySelector('.icon-close');
const registerLink = document.querySelector('.register-link');
const loginLink = document.querySelector('.login-link');

// Open/Close Popup
if(btnPopup) {
    btnPopup.onclick = () => {
        wrapper.classList.add('active-popup');
        wrapper.classList.remove('active'); // Start with Login
    };
}
if(iconClose) iconClose.onclick = () => wrapper.classList.remove('active-popup');

// Switch between Login & Register
if(registerLink) {
    registerLink.onclick = (e) => {
        e.preventDefault();
        wrapper.classList.add('active');
    };
}
if(loginLink) {
    loginLink.onclick = (e) => {
        e.preventDefault();
        wrapper.classList.remove('active');
    };
}

// Helper: Toast Popups
const toast = (icon, title) => {
    Swal.fire({ icon, title, background: '#1e293b', color: '#fff', timer: 2000, showConfirmButton: false });
};

// --- Firebase Registration ---
const regForm = document.getElementById('registerForm');
if(regForm) {
    regForm.onsubmit = async (e) => {
        e.preventDefault();
        const name = document.getElementById('regName').value;
        const email = document.getElementById('regEmail').value;
        const pass = document.getElementById('regPass').value;

        try {
            const res = await createUserWithEmailAndPassword(auth, email, pass);
            await setDoc(doc(db, "users", res.user.uid), { username: name, email, uid: res.user.uid });
            toast('success', 'Registration Done! Please Login.');
            wrapper.classList.remove('active'); // Switch to login form
        } catch (err) { toast('error', 'Registration Failed!'); }
    };
}

// --- Firebase Login ---
const logForm = document.getElementById('loginForm');
if(logForm) {
    logForm.onsubmit = async (e) => {
        e.preventDefault();
        const email = document.getElementById('logEmail').value;
        const pass = document.getElementById('logPass').value;

        try {
            await signInWithEmailAndPassword(auth, email, pass);
            toast('success', 'Logging in...');
            setTimeout(() => { window.location.href = "portfolio.html"; }, 1500);
        } catch (err) { toast('error', 'Wrong Email/Password!'); }
    };
}
