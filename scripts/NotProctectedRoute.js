/**
 * Listens for authentication state changes and redirects the user.
 *
 * This function uses Firebase's onAuthStateChanged listener to monitor changes in the user's
 * authentication state. If a user is signed in, it automatically redirects the browser to the
 * "/forum" page.
 */
firebase.auth().onAuthStateChanged(function (user) {
  if (user) {
    window.location.href = "/forum";
  }
});
