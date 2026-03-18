import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { getFirestore, doc, setDoc, getDoc, updateDoc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

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

// --- UI Animations ---
const wrapper = document.querySelector('.wrapper');
const btnPopup = document.querySelector('.btnLogin-popup');
const iconClose = document.querySelector('.icon-close');
const registerLink = document.querySelector('.register-link');
const loginLink = document.querySelector('.login-link');

if(btnPopup) btnPopup.onclick = () => wrapper.classList.add('active-popup');
if(iconClose) iconClose.onclick = () => wrapper.classList.remove('active-popup');
if(registerLink) registerLink.onclick = () => wrapper.classList.add('active');
if(loginLink) loginLink.onclick = () => wrapper.classList.remove('active');

// --- Helper: Professional Popups ---
const alertUser = (type, title, text) => {
    Swal.fire({ icon: type, title: title, text: text, background: '#1a1a2e', color: '#fff', confirmButtonColor: '#00f2fe' });
};

// --- Password Validator ---
const isPasswordSecure = (pass) => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return regex.test(pass);
};

// --- Registration Logic ---
const regForm = document.getElementById('registerForm');
if(regForm) {
    regForm.onsubmit = async (e) => {
        e.preventDefault();
        const name = document.getElementById('regName').value;
        const email = document.getElementById('regEmail').value;
        const pass = document.getElementById('regPass').value;

        if(!isPasswordSecure(pass)) {
            return alertUser('warning', 'Weak Password', 'Kam se kam 8 characters, ek Capital, ek Number aur ek Special character (@#$) hona chahiye!');
        }

        try {
            const res = await createUserWithEmailAndPassword(auth, email, pass);
            await setDoc(doc(db, "users", res.user.uid), {
                username: name, email: email, uid: res.user.uid, profilePic: ""
            });
            alertUser('success', 'Registration Done!', 'Ab aap login kar sakte hain.');
            wrapper.classList.remove('active');
        } catch (err) { alertUser('error', 'Failed', err.message); }
    };
}

// --- Login Logic ---
const logForm = document.getElementById('loginForm');
if(logForm) {
    logForm.onsubmit = (e) => {
        e.preventDefault();
        const email = document.getElementById('logEmail').value;
        const pass = document.getElementById('logPass').value;

        signInWithEmailAndPassword(auth, email, pass)
            .then(() => { window.location.href = "portfolio.html"; })
            .catch(() => alertUser('error', 'Login Failed', 'Email ID ya Password galat hai!'));
    };
}

// --- Auth Monitor & Profile Sync ---
onAuthStateChanged(auth, async (user) => {
    const isPortfolio = window.location.pathname.includes("portfolio.html");
    if (user && isPortfolio) {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
            const data = userDoc.data();
            document.getElementById('welcomeUser').innerText = `Welcome, ${data.username}!`;
            document.getElementById('userEmail').innerText = data.email;
            document.getElementById('userIdDisplay').innerText = user.uid;
            if (data.profilePic) document.getElementById('userDP').src = data.profilePic;
        }
        
        document.getElementById('btnUpdate').onclick = async () => {
            const url = document.getElementById('photoURL').value.trim();
            if(url) {
                await updateDoc(doc(db, "users", user.uid), { profilePic: url });
                alertUser('success', 'Profile Updated', 'Refresh karke check karein!');
                location.reload();
            }
        };
    } else if (!user && isPortfolio) {
        window.location.href = "index.html";
    }
});

// Logout
const btnLogout = document.getElementById('btnLogout');
if(btnLogout) btnLogout.onclick = () => signOut(auth).then(() => window.location.href = "index.html");
