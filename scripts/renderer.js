/**
 * Renders the page header and footer based on the user's authentication status.
 *
 * This function uses Firebase Authentication's onAuthStateChanged listener to check if a user is signed in.
 * - If a user is authenticated, it loads the logged-in header component ("login_header.html") and the common footer.
 * - If no user is signed in, it loads the default header component ("header.html") along with the common footer.
 * In case of any errors, it falls back to loading the default components.
 */
function renderPage() {
  try {
    firebase.auth().onAuthStateChanged(function (user) {
      if (user) {
        // User is signed in: load header for logged in users and the footer
        console.log($("#header").load("/components/login_header.html"));
        console.log($("#footer").load("/components/footer.html"));
      } else {
        // No user is signed in: load default header and footer
        console.log($("#header").load("/components/header.html"));
        console.log($("#footer").load("/components/footer.html"));
      }
    });
  } catch (e) {
    // In case of an error, load default header and footer as a fallback
    console.log($("#header").load("/components/header.html"));
    console.log($("#footer").load("/components/footer.html"));
  }
}

/**
 * Logs out the currently authenticated user.
 *
 * This function uses Firebase Authentication's signOut method to log the user out.
 * On successful sign-out, it logs a message to the console.
 * Any errors during the sign-out process are caught and logged.
 */
function logout() {
  firebase
    .auth()
    .signOut()
    .then(() => {
      // Sign-out successful.
      console.log("logging out user");
    })
    .catch((error) => {
      // An error occurred during sign-out.
      console.error("Error during sign-out:", error);
    });
}

// Render the page by loading the appropriate header and footer based on authentication status.
renderPage();
