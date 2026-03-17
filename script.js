// 1. Firebase Libraries Import
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { getFirestore, doc, setDoc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

// 2. Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyCMwFJfbkdFjxWzNhMccXs9FbhqntSKdRM",
  authDomain: "portfolio-auth-19a5e.firebaseapp.com",
  projectId: "portfolio-auth-19a5e",
  storageBucket: "portfolio-auth-19a5e.firebasestorage.app",
  messagingSenderId: "211741915178",
  appId: "1:211741915178:web:b96f48f37ef2477b83ab53",
  measurementId: "G-NXB4LBKFX2"
};

// Initialize Firebase & Services
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// 3. UI Selectors
const wrapper = document.querySelector('.wrapper');
const loginLink = document.querySelector('.register-link');
const registerLink = document.querySelector('.login-link');
const btnPopup = document.querySelector('.btnLogin-popup');
const iconClose = document.querySelector('.icon-close');

// 4. UI Toggle Logic
loginLink.onclick = () => wrapper.classList.add('active');
registerLink.onclick = () => wrapper.classList.remove('active');
btnPopup.onclick = () => wrapper.classList.add('active-popup');
iconClose.onclick = () => wrapper.classList.remove('active-popup');

// 5. Password Show/Hide
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

// 6. Registration Logic (Auth + Database Connect)
const registerForm = document.querySelector('.form-box.register form');
registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = registerForm.querySelector('input[type="text"]').value;
    const email = registerForm.querySelector('input[type="email"]').value;
    const password = document.getElementById('regPass').value;

    try {
        // Step A: Authentication mein account banana
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Step B: Database (Firestore) mein user details save karna
        await setDoc(doc(db, "users", user.uid), {
            username: username,
            email: email,
            createdAt: new Date()
        });

        alert("Account Created & Data Saved! Swagat hai Raja Tech mein.");
        wrapper.classList.remove('active');
    } catch (error) {
        alert("Registration Error: " + error.message);
    }
});

// 7. Login Logic (Improved Error Messages)
const loginForm = document.querySelector('.form-box.login form');
if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = loginForm.querySelector('input[type="email"]').value;
        const password = document.getElementById('logPass').value;

        signInWithEmailAndPassword(auth, email, password)
            .then(() => {
                alert("Login Successful! Raja Tech mein aapka swagat hai.");
                window.location.href = "index.html"; 
            })
            .catch((error) => {
                const errorCode = error.code;
                
                // Custom Messages based on Error Code
                if (errorCode === 'auth/invalid-credential') {
                    alert("⚠️ Galat Email ya Password! Kirpya sahi details bharein.");
                } else if (errorCode === 'auth/user-not-found') {
                    alert("⚠️ Is Email se koi account nahi mila. Pehle Register karein.");
                } else if (errorCode === 'auth/wrong-password') {
                    alert("⚠️ Password galat hai! Dubara koshish karein.");
                } else if (errorCode === 'auth/invalid-email') {
                    alert("⚠️ Email format galat hai (e.g. name@gmail.com).");
                } else {
                    alert("⚠️ Kuch gadbad hui: " + error.message);
                }
            });
    });
}
