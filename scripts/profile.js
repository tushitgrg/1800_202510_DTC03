// Global variable to hold the current user's Firestore document reference
var currentUser;

/**
 * Extracts the profile ID from the URL's query parameters.
 *
 * @returns {string|null} The profile ID if present; otherwise, null.
 */
function getProfileIdFromURL() {
  const params = new URLSearchParams(window.location.search);
  return params.get("id"); // Extract 'id' from URL
}

/**
 * Populates the user profile information on the page.
 *
 * This function listens for changes in authentication state. When a user is signed in,
 * it determines whether the profile being viewed belongs to the current user or another user.
 * It then retrieves the appropriate user document from Firestore and populates UI elements
 * with user data (e.g., name, avatar, age, pronouns). If viewing another user's profile,
 * edit functionalities are disabled and certain elements are hidden.
 */
function populateUserInfo() {
  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      let profileId = getProfileIdFromURL();
      let isOwnProfile = !profileId || profileId === user.uid;
      console.log(profileId);
      console.log(isOwnProfile);

      // Determine which user document to fetch: current user or another user's profile
      let userDocRef = isOwnProfile
        ? db.collection("users").doc(user.uid)
        : db.collection("users").doc(profileId);

      // Retrieve the user document from Firestore
      userDocRef
        .get()
        .then((userDoc) => {
          if (userDoc.exists) {
            let data = userDoc.data();
            // Populate display elements with user data
            document.getElementById("usernameDisplay").textContent =
              data.name || "Unknown";
            document.getElementById("helloUser").textContent =
              "Hello " + (data.name || "User");
            document.getElementById("extraInfo").textContent =
              (data.age || "") + ", " + (data.pronouns || "");
            document
              .getElementById("avatarImg")
              .setAttribute("src", data.avatar || "/images/pfp.jpg");

            // Populate input fields for editing purposes
            document.getElementById("nameInput").value = data.name || "";
            document.getElementById("pronounsInput").value =
              data.pronouns || "";
            document.getElementById("ageInput").value = data.age || "";
            document.getElementById("emailInput").value = data.email || "";
            document.getElementById("aboutMeInput").value = data.aboutMe || "";

            if (!isOwnProfile) {
              // Hide edit and save buttons when viewing someone else's profile
              document
                .querySelectorAll("[onclick='editUserInfo()']")
                .forEach((btn) => btn.classList.add("hidden"));
              document
                .getElementById("saveChangesButton")
                .classList.add("hidden");
              // Hide chart, logout, and quiz sections for other profiles
              // document.getElementById("chart").classList.add("lg:hidden");
              document
                .getElementById("logout")
                .classList.add("hidden", "sm:hidden", "md:hidden", "lg:hidden");
              document
                .getElementById("quizSection")
                .classList.add("hidden", "sm:hidden", "md:hidden", "lg:hidden");
              document.getElementById("helloUser").textContent =
                data.name || "User";
              document.getElementById("welcomeHeader").classList.add("hidden");
              document.getElementById("aboutMeInput").placeholder =
                "Nothing here yet!";
              document.getElementById("pronounsInput").placeholder =
                "Nothing here yet!";
              document.getElementById("ageInput").placeholder =
                "Nothing here yet!";
              document.getElementById("emailInput").placeholder =
                "Nothing here yet!";
              document.getElementById("emailInput").value = "Private!";
              document.getElementById("nameInput").placeholder =
                "Nothing here yet!";
              // Show the chat button and set its link to open a chat with this user
              document.getElementById("chatButton").classList.remove("hidden");
              document
                .getElementById("chatButton")
                .setAttribute("href", "/chat/open.html?id=" + profileId);
              // Disable all input fields so they cannot be edited
              document
                .querySelectorAll("input, textarea")
                .forEach((el) => el.setAttribute("disabled", "true"));

              // Hide avatar upload option for other profiles
              document.getElementById("avatarDiv").classList.add("invisible");
            } else {
              // If it's the current user's profile, store the document reference for later updates
              currentUser = userDocRef;
              document
                .getElementById("avatarDiv")
                .classList.remove("invisible");
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

// Immediately populate user information on page load
populateUserInfo();

/**
 * Enables editing mode for the user's profile.
 *
 * This function removes the disabled attribute from input fields and reveals
 * the save button and avatar input, allowing the user to update their profile details.
 */
function editUserInfo() {
  document.getElementById("nameInput").removeAttribute("disabled");
  document.getElementById("ageInput").removeAttribute("disabled");
  document.getElementById("pronounsInput").removeAttribute("disabled");
  document.getElementById("aboutMeInput").removeAttribute("disabled");
  document.getElementById("saveChangesButton").classList.remove("hidden");
  document.getElementById("avatarInput").classList.remove("hidden");
  document.getElementById("avatarInput").classList.add("block");
}

/**
 * Saves the updated user profile information to Firestore.
 *
 * This asynchronous function retrieves updated values from input fields and uploads a new avatar image if provided.
 * It then updates the user's Firestore document with the new data. Upon success, the UI is updated to reflect
 * the changes, and the editing interface is disabled.
 */
async function saveUserInfo() {
  let userName = document.getElementById("nameInput").value;
  let userPronouns = document.getElementById("pronounsInput").value;
  let userAge = document.getElementById("ageInput").value;
  let aboutMe = document.getElementById("aboutMeInput").value;
  const file = document.getElementById("avatarInput").files[0];
  const data = new FormData(); // Create a FormData object to hold the image file
  data.append("image", file); // Attach the selected image file
  data.append("api", "9e5c2b40-f9b9-4f8d-aa74-252cdfb76c8f"); // Add your API key for image upload

  // Upload the image to the external API
  let resp = await fetch(`https://webios.link/api/images/upload`, {
    method: "post",
    body: data,
  });
  resp = await resp.json();
  let imageurl = undefined;

  // Prepare the data to update the user's profile
  const updateData = {
    name: userName,
    pronouns: userPronouns,
    age: userAge,
    aboutMe: aboutMe,
  };
  // If an image was successfully uploaded, include the new avatar URL
  if (resp.fileid) {
    updateData.avatar = `https://images.webios.link/${resp.fileid}`;
  }

  // Update the current user's Firestore document with the new data
  currentUser
    .update(updateData)
    .then(() => {
      // Update UI elements to reflect the updated profile
      document.getElementById("usernameDisplay").textContent = userName;
      document.getElementById("helloUser").textContent = "Hello " + userName;
      if (userAge && userPronouns) {
        document.getElementById("extraInfo").textContent =
          userAge + ", " + userPronouns;
      }
      if (resp.fileid) {
        document
          .getElementById("avatarImg")
          .setAttribute("src", updateData.avatar);
      }
    })
    .catch((error) => console.error("Error updating document:", error));

  // Disable input fields and hide the save button and avatar input after saving
  document.getElementById("nameInput").setAttribute("disabled", "true");
  document.getElementById("ageInput").setAttribute("disabled", "true");
  document.getElementById("pronounsInput").setAttribute("disabled", "true");
  document.getElementById("aboutMeInput").setAttribute("disabled", "true");
  document.getElementById("saveChangesButton").classList.add("hidden");
  document.getElementById("avatarInput").classList.remove("block");
  document.getElementById("avatarInput").value = "";
  document.getElementById("avatarInput").classList.add("hidden");
}
