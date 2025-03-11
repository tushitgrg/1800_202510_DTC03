const firebaseConfig = {
  apiKey: "AIzaSyC46I7D7OqVNaIxh3CSBHbotWZ1ET72v-A",
  authDomain: "wellcircle-52e5e.firebaseapp.com",
  projectId: "wellcircle-52e5e",
  storageBucket: "wellcircle-52e5e.firebasestorage.app",
  messagingSenderId: "932065768756",
  appId: "1:932065768756:web:03f87e42c7a45771682161",
  measurementId: "G-G9JDFSSRTF"
};


// Initialize Firebase
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const db = firebase.firestore();
const auth = firebase.auth();

// Get login.html elements
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const errorMessage = document.getElementById("errorMessage");

// 🔹 Handle Login 
document.getElementById("signInButton").addEventListener("click", async function (e) {
  e.preventDefault();
  const email = emailInput.value.trim();
  const password = passwordInput.value.trim();

  if (!email || !password) {
      errorMessage.innerText = "Please enter both email and password.";
      return;
  }

  try {
      const userCredential = await auth.signInWithEmailAndPassword(email, password);
      console.log("✅ User signed in:", userCredential.user);

      // 🔹 Fetch user data from Firestore
      const userDoc = await db.collection("users").doc(userCredential.user.uid).get();
      if (userDoc.exists) {
          console.log("📄 User Data:", userDoc.data());
      } else {
          console.warn("⚠️ No Firestore data found for user.");
      }

      window.location.href = "/main.html"; // Redirect after successful login
  } catch (error) {
      console.error("❌ Login Error:", error.message);
      errorMessage.innerText = error.message;
  }
});

// 🔹 Handle Sign-Up (Creates User + Adds to Firestore)
document.getElementById("signUpButton").addEventListener("click", async function (e) {
  e.preventDefault();
  const email = emailInput.value.trim();
  const password = passwordInput.value.trim();

  if (!email || !password) {
      errorMessage.innerText = "Please enter both email and password.";
      return;
  }

  try {
      // 🔹 Create user in Firebase Authentication
      const userCredential = await auth.createUserWithEmailAndPassword(email, password);
      const user = userCredential.user;
      console.log("✅ User registered:", user);

      // 🔹 Store user info in Firestore (users collection)
      await db.collection("users").doc(user.uid).set({
          email: user.email,
          createdAt: firebase.firestore.Timestamp.now()
      });

      console.log("✅ User added to Firestore");
      window.location.href = "/main.html"; // Redirect after successful registration
  } catch (error) {
      console.error("❌ Sign-up Error:", error.message);
      errorMessage.innerText = error.message;
  }
});