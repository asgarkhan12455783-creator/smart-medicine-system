import {
    initializeApp
} from "https://www.gstatic.com/firebasejs/12.13.0/firebase-app.js";

import {
    getFirestore
} from "https://www.gstatic.com/firebasejs/12.13.0/firebase-firestore.js";

import {
    getAuth
} from "https://www.gstatic.com/firebasejs/12.13.0/firebase-auth.js";


const firebaseConfig = {

    apiKey: "AIzaSyBOXAYel4xvnXSv31GGhhy4bzSbPLgblNw",

    authDomain:
        "smart-medicine-system-d8b6c.firebaseapp.com",

    projectId:
        "smart-medicine-system-d8b6c",

    storageBucket:
        "smart-medicine-system-d8b6c.firebasestorage.app",

    messagingSenderId:
        "257438247903",

    appId:
        "1:257438247903:web:dae15d7f02339e3e0fb26a"

};


const app =
    initializeApp(firebaseConfig);


const db =
    getFirestore(app, "aban");


const auth =
    getAuth(app);


export {
    db,
    auth
};
