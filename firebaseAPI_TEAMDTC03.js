const firebaseConfig = {
    apiKey: "AIzaSyDPPKZTHh-CqtSsXeYXZJ4qSG75J1RUWvs",
    authDomain: "well-circle.firebaseapp.com",
    projectId: "well-circle",
    storageBucket: "well-circle.firebasestorage.app",
    messagingSenderId: "432988596812",
    appId: "1:432988596812:web:80313fb825a7bf2697e2e9",
    measurementId: "G-GSCM15TG4D"
  };

  // Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();