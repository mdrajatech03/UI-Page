import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
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

// UI Logic
const wrapper = document.querySelector('.wrapper');
const loginLink = document.querySelector('.login-link');
const registerLink = document.querySelector('.register-link');
const btnPopup = document.querySelector('.btnLogin-popup');
const iconClose = document.querySelector('.icon-close');

btnPopup.onclick = () => wrapper.classList.add('active-popup');
iconClose.onclick = () => wrapper.classList.remove('active-popup');
registerLink.onclick = () => wrapper.classList.add('active');
loginLink.onclick = () => wrapper.classList.remove('active');

// Toast Function
const alertBox = (icon, title) => {
    Swal.fire({ icon, title, background: '#1e293b', color: '#fff', timer: 2000, showConfirmButton: false });
};

// Registration Logic
document.getElementById('registerForm').onsubmit = async (e) => {
    e.preventDefault();
    const name = document.getElementById('regName').value;
    const email = document.getElementById('regEmail').value;
    const pass = document.getElementById('regPass').value;

    try {
        const res = await createUserWithEmailAndPassword(auth, email, pass);
        await setDoc(doc(db, "users", res.user.uid), { username: name, email, uid: res.user.uid });
        alertBox('success', 'Registration Successful! Ab Login Karein.');
        wrapper.classList.remove('active'); // Wapas login page par bhej dega
    } catch (err) { alertBox('error', 'Registration Failed!'); }
};

// Login Logic
document.getElementById('loginForm').onsubmit = (e) => {
    e.preventDefault();
    const email = document.getElementById('logEmail').value;
    const pass = document.getElementById('logPass').value;

    signInWithEmailAndPassword(auth, email, pass)
        .then(() => {
            alertBox('success', 'Welcome Back!');
            setTimeout(() => { window.location.href = "portfolio.html"; }, 1500);
        })
        .catch(() => alertBox('error', 'Invalid Email or Password!'));
};
