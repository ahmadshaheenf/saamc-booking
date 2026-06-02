const firebaseConfig = {
    apiKey: "AIzaSyAHfr3KUAbq3NQWmJoq90lLoaMIPF5A3xY",
    authDomain: "saamc-19587.firebaseapp.com",
    projectId: "saamc-19587",
    storageBucket: "saamc-19587.firebasestorage.app",
    messagingSenderId: "925515005634",
    appId: "1:925515005634:web:f84f8d1f404fa3019c855b",
    measurementId: "G-0CMFTEN1M8"
};

function isFirebaseConfigReady(config) {
    return Boolean(
        config.apiKey &&
        config.projectId &&
        !config.apiKey.startsWith("PASTE_") &&
        !config.projectId.startsWith("PASTE_")
    );
}

window.firebaseConfig = firebaseConfig;
window.isFirebaseReady = false;
window.db = null;

if (window.firebase && isFirebaseConfigReady(firebaseConfig)) {
    firebase.initializeApp(firebaseConfig);
    window.db = firebase.firestore();
    window.isFirebaseReady = true;
} else {
    console.warn("Firebase is not configured yet. Paste your Firebase web app config in firebase-config.js.");
}
