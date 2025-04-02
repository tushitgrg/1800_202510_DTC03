function renderPage() {
  try {
    firebase.auth().onAuthStateChanged(function (user) {
      if (user) {
        console.log($("#header").load("/components/login_header.html"));
        console.log($("#footer").load("/components/footer.html"));
      } else {
        // No user is signed in.
        console.log($("#header").load("/components/header.html"));
        console.log($("#footer").load("/components/footer.html"));
      }
    });
  } catch (e) {
    console.log($("#header").load("/components/header.html"));
    console.log($("#footer").load("/components/footer.html"));
  }
}

function logout() {
  firebase
    .auth()
    .signOut()
    .then(() => {
      // Sign-out successful.
      console.log("logging out user");
    })
    .catch((error) => {
      // An error happened.
    });
}

renderPage();
