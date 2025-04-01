const auth = firebase.auth();

// Get login.html elements
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const firstNameinput = document.getElementById("firstName");
const lastNameinput = document.getElementById("lastName");
const errorMessage = document.getElementById("errorMessage");

// 🔹 Handle Login
document
  .getElementById("signInButton")
  .addEventListener("click", async function (e) {
    e.preventDefault();
    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();

    if (!email || !password) {
      errorMessage.innerText = "Please enter both email and password.";
      return;
    }

    try {
      const userCredential = await auth.signInWithEmailAndPassword(
        email,
        password,
      );
      console.log("✅ User signed in:", userCredential.user);

      // 🔹 Fetch user data from Firestore
      const userDoc = await db
        .collection("users")
        .doc(userCredential.user.uid)
        .get();
      if (userDoc.exists) {
        console.log("📄 User Data:", userDoc.data());
      } else {
        console.warn("⚠️ No Firestore data found for user.");
      }

      window.location.href = "/forum";
    } catch (error) {
      console.error("❌ Login Error:", error.message);
      errorMessage.innerText = error.message;
    }
  });

// 🔹 Handle Sign-Up (Creates User + Adds to Firestore)
document
  .getElementById("signUpButton")
  .addEventListener("click", async function (e) {
    e.preventDefault();
    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();
    const firstName = firstNameinput.value.trim();
    const lastName = lastNameinput.value.trim();

    if (!email || !password || !firstName || !lastName) {
      errorMessage.innerText = "Please enter all fields!";
      return;
    }

    try {
      // 🔹 Create user in Firebase Authentication
      const userCredential = await auth.createUserWithEmailAndPassword(
        email,
        password,
      );
      const user = userCredential.user;
      await user.updateProfile({
        displayName: `${firstName} ${lastName}`,
      });
      console.log("✅ User registered:", user);

      // 🔹 Store user info in Firestore (users collection)
      await db
        .collection("users")
        .doc(user.uid)
        .set({
          email: user.email,
          name: `${firstName} ${lastName}`,
          createdAt: firebase.firestore.Timestamp.now(),
        });

      console.log("✅ User added to Firestore");
      window.location.href = "/forum"; // Redirect after successful registration
    } catch (error) {
      console.error("❌ Sign-up Error:", error.message);
      errorMessage.innerText = error.message;
    }
  });
