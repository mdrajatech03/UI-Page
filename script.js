// 1. Firebase Libraries Import (Modules)
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

// 2. Firebase Configuration (Wahi jo aapne console se nikaali thi)
const firebaseConfig = {
  apiKey: "AIzaSyCMwFJfbkdFjxWzNhMccXs9FbhqntSKdRM",
  authDomain: "portfolio-auth-19a5e.firebaseapp.com",
  projectId: "portfolio-auth-19a5e",
  storageBucket: "portfolio-auth-19a5e.firebasestorage.app",
  messagingSenderId: "211741915178",
  appId: "1:211741915178:web:b96f48f37ef2477b83ab53",
  measurementId: "G-NXB4LBKFX2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// 3. UI Selectors
const wrapper = document.querySelector('.wrapper');
const loginLink = document.querySelector('.register-link');
const registerLink = document.querySelector('.login-link');
const btnPopup = document.querySelector('.btnLogin-popup');
const iconClose = document.querySelector('.icon-close');

// 4. UI Toggle Logic (Login/Register box switch karne ke liye)
loginLink.onclick = () => wrapper.classList.add('active');
registerLink.onclick = () => wrapper.classList.remove('active');
btnPopup.onclick = () => wrapper.classList.add('active-popup');
iconClose.onclick = () => wrapper.classList.remove('active-popup');

// 5. Password Show/Hide Toggle
document.querySelectorAll('.toggle-password').forEach(icon => {
    icon.onclick = function() {
        const input = document.getElementById(this.getAttribute('data-target'));
        if (input.type === 'password') {
            input.type = 'text';
            this.classList.replace('fa-eye-slash', 'fa-eye');
        } else {
            input.type = 'password';
            this.classList.replace('fa-eye', 'fa-eye-slash');
        }
    };
});

// 6. Registration Logic (New Account banane ke liye)
const registerForm = document.querySelector('.form-box.register form');
registerForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = registerForm.querySelector('input[type="email"]').value;
    const password = document.getElementById('regPass').value;

    createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            alert("Account Created Successfully! Raja Tech ki duniya mein swagat hai.");
            wrapper.classList.remove('active'); // Login box par wapas le jao
        })
        .catch((error) => {
            alert("Error: " + error.message);
        });
});

// 7. Login Logic (Existing User ke liye)
const loginForm = document.querySelector('.form-box.login form');
loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = loginForm.querySelector('input[type="email"]').value;
    const password = document.getElementById('logPass').value;

    signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            alert("Login Successful! Ab aap portfolio dekh sakte hain.");
            window.location.href = "index.html"; // Yahan apne portfolio file ka sahi naam likhein
        })
        .catch((error) => {
            alert("Galat Email ya Password! Phir se try karein.");
        });
});
