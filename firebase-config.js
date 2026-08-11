// Firebase App
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";

// Firebase Firestore
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBOXAYel4xvnXSv31GGhhy4bzSbPLgblNw",
  authDomain: "smart-medicine-system-d8b6c.firebaseapp.com",
  projectId: "smart-medicine-system-d8b6c",
  storageBucket: "smart-medicine-system-d8b6c.firebasestorage.app",
  messagingSenderId: "257438247903",
  appId: "1:257438247903:web:dae15d7f02339e3e0fb26a"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore database "aban"
const db = getFirestore(app, "aban");

// Export Firestore
export { db };
