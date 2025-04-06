// Initialize Firebase Authentication
const auth = firebase.auth();

// Get references to login.html elements
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const firstNameinput = document.getElementById("firstName");
const lastNameinput = document.getElementById("lastName");
const errorMessage = document.getElementById("errorMessage");

/**
 * Event handler for user login.
 *
 * This function is triggered when the sign-in button is clicked. It prevents the default form
 * submission behavior, retrieves the email and password values from the input fields, validates them,
 * and then attempts to sign in the user using Firebase Authentication. Upon successful sign-in,
 * it fetches the user's additional data from Firestore and redirects the user to the forum page.
 *
 * If any errors occur during the process, an error message is displayed to the user.
 *
 * @param {Event} e - The click event object.
 */
document
  .getElementById("signInButton")
  .addEventListener("click", async function (e) {
    e.preventDefault(); // Prevent default form submission
    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();

    // Validate that both email and password are provided
    if (!email || !password) {
      errorMessage.innerText = "Please enter both email and password.";
      return;
    }

    try {
      // Attempt to sign in the user with the provided credentials
      const userCredential = await auth.signInWithEmailAndPassword(
        email,
        password,
      );
      console.log("✅ User signed in:", userCredential.user);

      // Fetch user data from Firestore using the user's UID
      const userDoc = await db
        .collection("users")
        .doc(userCredential.user.uid)
        .get();
      if (userDoc.exists) {
        console.log("📄 User Data:", userDoc.data());
      } else {
        console.warn("⚠️ No Firestore data found for user.");
      }

      // Redirect to the forum page after successful login
      window.location.href = "/forum";
    } catch (error) {
      // Handle errors and display error messages
      console.error("❌ Login Error:", error.message);
      errorMessage.innerText = error.message;
    }
  });

/**
 * Event handler for user sign-up.
 *
 * This function is triggered when the sign-up button is clicked. It prevents the default form
 * submission behavior, retrieves the email, password, first name, and last name values from the input fields,
 * validates them, and then attempts to create a new user using Firebase Authentication.
 * After creating the user, it updates the user's profile with their display name and stores additional
 * user information in Firestore. Finally, it redirects the user to the forum page.
 *
 * If any errors occur during the process, an error message is displayed to the user.
 *
 * @param {Event} e - The click event object.
 */
document
  .getElementById("signUpButton")
  .addEventListener("click", async function (e) {
    e.preventDefault(); // Prevent default form submission
    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();
    const firstName = firstNameinput.value.trim();
    const lastName = lastNameinput.value.trim();

    // Validate that all fields are provided
    if (!email || !password || !firstName || !lastName) {
      errorMessage.innerText = "Please enter all fields!";
      return;
    }

    try {
      // Create a new user with the provided email and password using Firebase Authentication
      const userCredential = await auth.createUserWithEmailAndPassword(
        email,
        password,
      );
      const user = userCredential.user;

      // Update the user's profile with their display name (first name and last name)
      await user.updateProfile({
        displayName: `${firstName} ${lastName}`,
      });
      console.log("✅ User registered:", user);

      // Store user information in the Firestore 'users' collection
      await db
        .collection("users")
        .doc(user.uid)
        .set({
          email: user.email,
          name: `${firstName} ${lastName}`,
          createdAt: firebase.firestore.Timestamp.now(),
        });

      console.log("✅ User added to Firestore");
      // Redirect to the forum page after successful registration
      window.location.href = "/forum";
    } catch (error) {
      // Handle errors and display error messages
      console.error("❌ Sign-up Error:", error.message);
      errorMessage.innerText = error.message;
    }
  });
