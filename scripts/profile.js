var currentUser; // Points to the document of the user who is logged in

function populateUserInfo() {
  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      currentUser = db.collection("users").doc(user.uid);
      currentUser
        .get()
        .then((userDoc) => {
          if (userDoc.exists) {
            let data = userDoc.data();
            // Populate input fields
            if (data.name) {
              document.getElementById("nameInput").value = data.name;
              document.getElementById("usernameDisplay").textContent =
                data.name;
              document.getElementById("helloUser").textContent =
                "Hello " + data.name;
            }
            if (data.pronouns) {
              document.getElementById("pronounsInput").value = data.pronouns;
            }
            if (data.age) {
              document.getElementById("ageInput").value = data.age;
            }
            if (data.age && data.pronouns) {
              document.getElementById("extraInfo").textContent =
                data.age + ", " + data.pronouns;
            }
            if (data.email) {
              document.getElementById("emailInput").value = data.email;
            }
            if (data.aboutMe) {
              document.getElementById("aboutMeInput").value = data.aboutMe;
            }
            if (data.avatar) {
              document
                .getElementById("avatarImg")
                .setAttribute("src", data.avatar);
            }
          }
        })
        .catch((error) => console.error("Error getting user data:", error));
    } else {
      console.log("No user is signed in");
    }
  });
}

populateUserInfo();

function editUserInfo() {
  document.getElementById("nameInput").removeAttribute("disabled");
  document.getElementById("ageInput").removeAttribute("disabled");
  document.getElementById("pronounsInput").removeAttribute("disabled");
  document.getElementById("aboutMeInput").removeAttribute("disabled");
  document.getElementById("saveChangesButton").classList.remove("hidden");
  document.getElementById("avatarDiv").classList.remove("invisible");
  document.getElementById("avatarDiv").classList.add("block");
}

async function saveUserInfo() {
  let userName = document.getElementById("nameInput").value;
  let userPronouns = document.getElementById("pronounsInput").value;
  let userAge = document.getElementById("ageInput").value;
  let aboutMe = document.getElementById("aboutMeInput").value;
  const file = document.getElementById("avatarInput").files[0];
  const data = new FormData(); //Get the File From Input const data = new FormData()
  data.append("image", file); //Attach Image Here
  data.append("api", "9e5c2b40-f9b9-4f8d-aa74-252cdfb76c8f"); //Add your Api Key
  let resp = await fetch(`https://webios.link/api/images/upload`, {
    method: "post",
    body: data,
  });
  resp = await resp.json();
  imageurl = `https://images.webios.link/${resp.fileid}`;
  currentUser
    .update({
      name: userName,
      pronouns: userPronouns,
      age: userAge,
      aboutMe: aboutMe,
      avatar: imageurl,
    })
    .then(() => {
      document.getElementById("usernameDisplay").textContent = userName;
      document.getElementById("helloUser").textContent = "Hello " + userName;
      if (userAge && userPronouns) {
        document.getElementById("extraInfo").textContent =
          userAge + ", " + userPronouns;
      }
      document.getElementById("avatarImg").setAttribute("src", imageurl);
    })
    .catch((error) => console.error("Error updating document:", error));

  document.getElementById("nameInput").setAttribute("disabled", "true");
  document.getElementById("ageInput").setAttribute("disabled", "true");
  document.getElementById("pronounsInput").setAttribute("disabled", "true");
  document.getElementById("aboutMeInput").setAttribute("disabled", "true");
  document.getElementById("saveChangesButton").classList.add("hidden");
  document.getElementById("avatarDiv").classList.add("invisible");
  document.getElementById("avatarDiv").classList.remove("block");
}

function loadChartData() {
  // Define color using Tailwind's indigo-600 (Hex: #4F46E5)
  const chartColor = "#4F46E5";

  // Simulated Data
  const data = [
    { date: new Date("2025-03-01"), mentalScore: 50 },
    { date: new Date("2025-03-05"), mentalScore: 55 },
    { date: new Date("2025-03-10"), mentalScore: 60 },
    { date: new Date("2025-03-15"), mentalScore: 58 },
    { date: new Date("2025-03-20"), mentalScore: 65 },
    { date: new Date("2025-03-25"), mentalScore: 70 },
  ];
  renderChart(data, chartColor);
}

// function loadChartData() {
//     const chartColor = "#4F46E5";
    
//     firebase.auth().onAuthStateChanged((user) => {
//       if (user) {
//         // Get all assessments for the current user, ordered by date
//         db.collection("assessments")
//           .where("user", "==", user.uid)
//           .orderBy("last_updated", "asc")
//           .get()
//           .then((querySnapshot) => {
//             const data = [];
//             console.log("Hello")
//             querySnapshot.forEach((doc) => {
//               const assessment = doc.data();
              
//               // Check if the required data exists
//               if (assessment.last_updated && assessment.ai && assessment.ai.dimensionScores && assessment.ai.dimensionScores.mental) {
//                 data.push({
//                   date: assessment.last_updated.toDate(), // Convert Firestore timestamp to Date
//                   mentalScore: assessment.ai.dimensionScores.mental
//                 });
//               }
//             });
            
//             if (data.length > 0) {
//               renderChart(data, chartColor);
//             } else {
//               // Display message if no valid data found
//               document.getElementById("mentalChart").innerHTML = 
//                 '<text x="50%" y="50%" text-anchor="middle" font-size="16px">No mental health assessment data available</text>';
//             }
//           })
//           .catch((error) => {
//             console.error("Error getting assessments:", error);
//             document.getElementById("mentalChart").innerHTML = 
//               '<text x="50%" y="50%" text-anchor="middle" font-size="16px">Error loading assessment data</text>';
//           });
//       } else {
//         console.log("No user is signed in");
//       }
//     });
//   }

function renderChart(data, chartColor) {
  const svg = d3.select("#mentalChart"),
    width = svg.node().clientWidth,
    height = svg.node().clientHeight,
    margin = { top: 20, right: 30, bottom: 40, left: 50 };

  const x = d3
    .scaleTime()
    .domain(d3.extent(data, (d) => d.date))
    .range([margin.left, width - margin.right]);

  const y = d3
    .scaleLinear()
    .domain([0, d3.max(data, (d) => d.mentalScore)])
    .nice()
    .range([height - margin.bottom, margin.top]);

  const line = d3
    .line()
    .x((d) => x(d.date))
    .y((d) => y(d.mentalScore))
    .curve(d3.curveMonotoneX);

  svg
    .append("g")
    .attr("transform", `translate(0,${height - margin.bottom})`)
    .call(d3.axisBottom(x).ticks(5));

  svg
    .append("g")
    .attr("transform", `translate(${margin.left},0)`)
    .call(d3.axisLeft(y));

  svg
    .append("path")
    .datum(data)
    .attr("fill", "none")
    .attr("stroke", chartColor) // Use the variable for stroke color
    .attr("stroke-width", 2)
    .attr("d", line);

  svg
    .selectAll(".dot")
    .data(data)
    .enter()
    .append("circle")
    .attr("class", "dot")
    .attr("cx", (d) => x(d.date))
    .attr("cy", (d) => y(d.mentalScore))
    .attr("r", 5)
    .attr("fill", chartColor); // Use the variable for dot color
}

loadChartData();
