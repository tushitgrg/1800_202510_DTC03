var currentUser; // Points to the document of the user who is logged in

function populateUserInfo() {
    firebase.auth().onAuthStateChanged(user => {
        if (user) {
            currentUser = db.collection("users").doc(user.uid);
            currentUser.get()
                .then(userDoc => {
                    if (userDoc.exists) {
                        let data = userDoc.data();
                        console.log(data);
                        // Populate input fields
                        if (data.name) {
                            document.getElementById("nameInput").value = data.name;
                            document.getElementById("usernameDisplay").textContent = data.name;
                            document.getElementById("helloUser").textContent = "Hello " + data.name;
                        }
                        if (data.pronouns) {
                            document.getElementById("pronounsInput").value = data.pronouns;
                        }
                        if (data.age) {
                            document.getElementById("ageInput").value = data.age;
                        }
                        if (data.age && data.pronouns) {
                            document.getElementById("extraInfo").textContent = data.age + ", " + data.pronouns;
                        }
                        if (data.email) {
                            document.getElementById("emailInput").value = data.email;
                        }
                        if (data.aboutMe) {
                            document.getElementById("aboutMeInput").value = data.aboutMe;
                        }
                        if(data.avatar) {
                   document.getElementById("avatarImg").setAttribute("src",data.avatar)
                        }
                    }
                })
                .catch(error => console.error("Error getting user data:", error));
        } else {
            console.log("No user is signed in");
        }
    });
}

populateUserInfo();

function editUserInfo() {
    document.getElementById('nameInput').removeAttribute("disabled");
    document.getElementById('ageInput').removeAttribute("disabled");
    document.getElementById('pronounsInput').removeAttribute("disabled");
    document.getElementById('aboutMeInput').removeAttribute("disabled");
    document.getElementById("saveChangesButton").classList.remove("hidden");
    document.getElementById('avatarDiv').classList.remove("invisible");
    document.getElementById("avatarDiv").classList.add("block");
    
}

async function saveUserInfo() {
    let userName = document.getElementById('nameInput').value;
    let userPronouns = document.getElementById('pronounsInput').value;
    let userAge = document.getElementById('ageInput').value;
    let aboutMe = document.getElementById('aboutMeInput').value;
    const file = document.getElementById('avatarInput').files[0]
    const data = new FormData() //Get the File From Input const data = new FormData() 
  data.append('image', file) //Attach Image Here 
   data.append('api',"9e5c2b40-f9b9-4f8d-aa74-252cdfb76c8f") //Add your Api Key
  let resp =  await fetch(`https://webios.link/api/images/upload`,{ 
  method:'post', 
      body: data 
  }) 
   resp =await resp.json() 
   imageurl =`https://images.webios.link/${resp.fileid}`
    currentUser.update({
        name: userName,
        pronouns: userPronouns,
        age: userAge,
        aboutMe: aboutMe,
        avatar:imageurl
    })
    .then(() => {
        console.log("Document successfully updated!");
        document.getElementById("usernameDisplay").textContent = userName;
        document.getElementById("helloUser").textContent = "Hello " + userName;
        if (userAge && userPronouns) {
            document.getElementById("extraInfo").textContent = userAge + ", " + userPronouns;
        } 
        document.getElementById("avatarImg").setAttribute("src",imageurl)
    })
    .catch(error => console.error("Error updating document:", error));

    document.getElementById('nameInput').setAttribute("disabled", "true");
    document.getElementById('ageInput').setAttribute("disabled", "true");
    document.getElementById('pronounsInput').setAttribute("disabled", "true");
    document.getElementById('aboutMeInput').setAttribute("disabled", "true");
    document.getElementById("saveChangesButton").classList.add("hidden");
    document.getElementById("avatarDiv").classList.add("invisible");
    document.getElementById("avatarDiv").classList.remove("block");

}