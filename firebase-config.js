// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBOXAYel4xvnXSv31GGhhy4bzSbPLgblNw",
  authDomain: "smart-medicine-system-d8b6c.firebaseapp.com",
  projectId: "smart-medicine-system-d8b6c",
  storageBucket: "smart-medicine-system-d8b6c.firebasestorage.app",
  messagingSenderId: "257438247903",
  appId: "1:257438247903:web:dae15d7f02339e3e0fb26a",
  measurementId: "G-0WFQJ9VRR0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
