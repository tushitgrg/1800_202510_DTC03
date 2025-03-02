const email = document.getElementById("email");
const password = document.getElementById("password");
const signInButton = document.getElementById("signInButton");


signInButton.addEventListener("click", function(e) {
    e.preventDefault()
 
    firebase.auth().signInWithEmailAndPassword(email.value, password.value)
    .then(function() {
      window.location.href = "/main.html";
    })
    .catch(function(error) {
     
      if (error.code === "auth/user-not-found") {
    
        firebase.auth().createUserWithEmailAndPassword(email.value, password.value)
          .then(function() {
            window.location.href = "/main.html";
          })
          .catch(function(createError) {
            alert(createError.message);
          });
      } else {
        alert(error.message);
      }
    });
});