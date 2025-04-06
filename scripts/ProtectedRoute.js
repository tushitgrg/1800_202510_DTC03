/**
 * Monitors the Firebase authentication state.
 *
 * This function listens for changes in the user's authentication state.
 * If no user is currently signed in, it redirects the browser to the login page.
 */
firebase.auth().onAuthStateChanged(function (user) {
  if (!user) {
    // If the user is not authenticated, redirect to the login page.
    window.location.href = "/user/login.html";
  }
});
