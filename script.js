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

// Selectors
const wrapper = document.getElementById('mainWrapper');
const btnLoginPopup = document.getElementById('openLogin');
const btnClose = document.getElementById('closeBtn');
const toRegister = document.getElementById('toRegister');
const toLogin = document.getElementById('toLogin');

// UI Controls
if(btnLoginPopup) btnLoginPopup.onclick = () => { wrapper.classList.add('active-popup'); wrapper.classList.remove('active'); };
if(btnClose) btnClose.onclick = () => wrapper.classList.remove('active-popup');

// Transition Fix
if(toRegister) toRegister.onclick = () => wrapper.classList.add('active');
if(toLogin) toLogin.onclick = () => wrapper.classList.remove('active');

const showAlert = (icon, title) => Swal.fire({ icon, title, background: '#1e293b', color: '#fff', timer: 2000, showConfirmButton: false });

// Register Logic
document.getElementById('registerForm').onsubmit = async (e) => {
    e.preventDefault();
    const name = document.getElementById('regName').value;
    const email = document.getElementById('regEmail').value;
    const pass = document.getElementById('regPass').value;

    try {
        const res = await createUserWithEmailAndPassword(auth, email, pass);
        await setDoc(doc(db, "users", res.user.uid), { username: name, email, uid: res.user.uid });
        
        showAlert('success', 'Registration Successful!');
        
        // FIX: Turant login form par switch karega
        setTimeout(() => { 
            wrapper.classList.remove('active'); 
            document.getElementById('registerForm').reset();
        }, 1500);
    } catch (err) { showAlert('error', 'Registration Failed!'); }
};

// Login Logic
document.getElementById('loginForm').onsubmit = async (e) => {
    e.preventDefault();
    const email = document.getElementById('logEmail').value;
    const pass = document.getElementById('logPass').value;

    try {
        await signInWithEmailAndPassword(auth, email, pass);
        showAlert('success', 'Welcome Back! Redirecting...');
        setTimeout(() => { window.location.href = "portfolio.html"; }, 1500);
    } catch (err) { showAlert('error', 'Invalid Credentials!'); }
};
