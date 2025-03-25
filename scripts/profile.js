var currentUser;

function getProfileIdFromURL() {
  const params = new URLSearchParams(window.location.search);
  return params.get("id"); // Extract 'id' from URL
}

function populateUserInfo() {
  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      let profileId = getProfileIdFromURL();
      let isOwnProfile = !profileId || profileId === user.uid;
      let userDocRef = isOwnProfile
        ? db.collection("users").doc(user.uid)
        : db.collection("users").doc(profileId);

      userDocRef
        .get()
        .then((userDoc) => {
          if (userDoc.exists) {
            let data = userDoc.data();
            document.getElementById("usernameDisplay").textContent =
              data.name || "Unknown";
            document.getElementById("helloUser").textContent =
              "Hello " + (data.name || "User");
            document.getElementById("extraInfo").textContent =
              (data.age || "N/A") + ", " + (data.pronouns || "N/A");
            document.getElementById("avatarImg").setAttribute(
              "src",
              data.avatar || "default-avatar.png"
            );

            // Populate input fields
            document.getElementById("nameInput").value = data.name || "";
            document.getElementById("pronounsInput").value =
              data.pronouns || "";
            document.getElementById("ageInput").value = data.age || "";
            document.getElementById("emailInput").value = data.email || "";
            document.getElementById("aboutMeInput").value = data.aboutMe || "";

            if (!isOwnProfile) {
              // Hide edit and save buttons
              document
                .querySelectorAll("[onclick='editUserInfo()']")
                .forEach((btn) => btn.classList.add("hidden"));
              document.getElementById("saveChangesButton").classList.add("hidden");
              document.getElementById("chart").classList.add("lg:hidden");
              document.getElementById("logout").classList.add("hidden", "sm:hidden", "md:hidden", "lg:hidden");
              document.getElementById("quizSection").classList.add("hidden", "sm:hidden", "md:hidden", "lg:hidden");
              document.getElementById("helloUser").textContent = data.name || "User";
              document.getElementById("welcomeHeader").classList.add("hidden");
              // Disable input fields
              document
                .querySelectorAll("input, textarea")
                .forEach((el) => el.setAttribute("disabled", "true"));

              // Hide avatar upload option
              document.getElementById("avatarDiv").classList.add("invisible");

            } else {
              currentUser = userDocRef;
              document.getElementById("avatarDiv").classList.remove("invisible");
            }
          } else {
            console.log("User profile not found.");
          }
        })
        .catch((error) => console.error("Error getting user data:", error));
    } else {
      console.log("No user is signed in");
    }
  });
}

populateUserInfo();
