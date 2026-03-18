import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { getFirestore, doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

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

// UI Actions
btnPopup.onclick = () => { wrapper.classList.add('active-popup'); wrapper.classList.remove('active'); };
iconClose.onclick = () => wrapper.classList.remove('active-popup');
registerLink.onclick = () => wrapper.classList.add('active');
loginLink.onclick = () => wrapper.classList.remove('active');

const showMsg = (icon, title) => Swal.fire({ icon, title, background: '#1e293b', color: '#fff', timer: 2000, showConfirmButton: false });

// Register Logic
document.getElementById('registerForm').onsubmit = async (e) => {
    e.preventDefault();
    const name = document.getElementById('regName').value;
    const email = document.getElementById('regEmail').value;
    const pass = document.getElementById('regPass').value;

    try {
        const res = await createUserWithEmailAndPassword(auth, email, pass);
        await setDoc(doc(db, "users", res.user.uid), { username: name, email, uid: res.user.uid });
        showMsg('success', 'Account Created! Opening Login...');
        // Wait then switch
        setTimeout(() => { wrapper.classList.remove('active'); }, 1500);
    } catch (err) { showMsg('error', 'Failed! Check Connection.'); }
};

// Login Logic
document.getElementById('loginForm').onsubmit = async (e) => {
    e.preventDefault();
    try {
        await signInWithEmailAndPassword(auth, document.getElementById('logEmail').value, document.getElementById('logPass').value);
        showMsg('success', 'Welcome Back!');
        setTimeout(() => { window.location.href = "portfolio.html"; }, 1000);
    } catch (err) { showMsg('error', 'Invalid Credentials!'); }
};

// Auto-Sync Profile Data (for portfolio.html)
onAuthStateChanged(auth, async (user) => {
    if (user && window.location.pathname.includes("portfolio.html")) {
        const docSnap = await getDoc(doc(db, "users", user.uid));
        if (docSnap.exists()) {
            document.getElementById('userName').innerText = docSnap.data().username;
            document.getElementById('userEmail').innerText = docSnap.data().email;
        }
    } else if (!user && window.location.pathname.includes("portfolio.html")) {
        window.location.href = "index.html";
    }
});

// Logout
const logOutBtn = document.getElementById('btnLogout');
if(logOutBtn) logOutBtn.onclick = () => signOut(auth).then(() => window.location.href = "index.html");
