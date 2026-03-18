import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { getFirestore, doc, setDoc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

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

const wrapper = document.querySelector('.wrapper');
const btnPopup = document.querySelector('.btnLogin-popup');
const iconClose = document.querySelector('.icon-close');
const registerLink = document.querySelector('.register-link');
const loginLink = document.querySelector('.login-link');

// Popup Open/Close
btnPopup.onclick = () => { wrapper.classList.add('active-popup'); wrapper.classList.remove('active'); };
iconClose.onclick = () => wrapper.classList.remove('active-popup');

// Slide Toggle
registerLink.onclick = () => wrapper.classList.add('active');
loginLink.onclick = () => wrapper.classList.remove('active');

// Firebase Registration Fix
document.getElementById('registerForm').onsubmit = async (e) => {
    e.preventDefault();
    const name = document.getElementById('regName').value;
    const email = document.getElementById('regEmail').value;
    const pass = document.getElementById('regPass').value;

    try {
        const res = await createUserWithEmailAndPassword(auth, email, pass);
        await setDoc(doc(db, "users", res.user.uid), { username: name, email: email });
        
        Swal.fire({ icon: 'success', title: 'Done!', text: 'Account Created. Switching to Login...', timer: 2000, showConfirmButton: false });

        // YE RAHA FIX: Pehle form reset, phir 1.5s baad slide back
        document.getElementById('registerForm').reset();
        setTimeout(() => {
            wrapper.classList.remove('active');
        }, 1500);

    } catch (err) { Swal.fire('Error', 'Failed!', 'error'); }
};

// Login Logic
document.getElementById('loginForm').onsubmit = async (e) => {
    e.preventDefault();
    const email = document.getElementById('logEmail').value;
    const pass = document.getElementById('logPass').value;

    try {
        await signInWithEmailAndPassword(auth, email, pass);
        Swal.fire('Success', 'Logging in...', 'success');
        setTimeout(() => { window.location.href = "portfolio.html"; }, 1500);
    } catch (err) { Swal.fire('Error', 'Wrong Credentials!', 'error'); }
};
