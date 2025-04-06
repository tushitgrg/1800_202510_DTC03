/* 
  This script handles the retrieval and display of a specific forum post along with its replies.
  It includes functions for fetching a post and its associated user data, toggling likes on posts
  and replies, appending the post and replies to the DOM, and adding new replies.
*/

// Get URL parameters and extract the post ID
const paramsString = window.location.search;
const searchParams = new URLSearchParams(paramsString);
const postid = searchParams.get("id");

/**
 * Retrieves a post by its ID from the Firestore "posts" collection,
 * along with the associated user data.
 *
 * @param {string} postid - The ID of the post to retrieve.
 * @returns {Promise<Object|undefined>} A promise that resolves to the post object,
 * or undefined if the post does not exist.
 */
const getPost = async (postid) => {
  try {
    // Retrieve the post document by its ID
    const doc = await db.collection("posts").doc(postid).get();

    if (!doc.exists) {
      console.warn(`Post with id ${postid} not found.`);
      return undefined;
    }

    // Get the post data and assign the post ID
    const data = doc.data();
    data.id = postid;

    // Retrieve the user document for the post's author
    const userDoc = await db.collection("users").doc(data.userid).get();
    data.user = userDoc.exists ? userDoc.data() : null;
    if (userDoc.data()) {
      if (userDoc.data().name) {
        data.username = userDoc.data().name;
      }
    }
    console.log(data);
    return data;
  } catch (error) {
    console.error("Error fetching post:", error);
    throw error;
  }
};

/**
 * Toggles the like state for a given post or reply.
 *
 * This function updates the UI by toggling the fill attribute of the like icon and
 * adjusts the displayed like count. It then updates the Firestore database to reflect
 * the change in the "liked_by" array and "likes" count.
 *
 * @param {Object} item1 - The post or reply object to be liked/unliked.
 */
const like = async (item1) => {
  // Toggle UI like state by changing SVG fill attribute and updating the like count
  if (
    document.getElementById(`svg${item1.id}`).getAttribute("fill") != "none"
  ) {
    document.getElementById(`svg${item1.id}`).setAttribute("fill", "none");
    document.getElementById(`span${item1.id}`).innerText =
      parseInt(document.getElementById(`span${item1.id}`).innerText) - 1;
  } else {
    document.getElementById(`svg${item1.id}`).setAttribute("fill", "violet");
    document.getElementById(`span${item1.id}`).innerText =
      parseInt(document.getElementById(`span${item1.id}`).innerText) + 1;
  }

  // Check if a user is authenticated before updating the like status in the database
  firebase.auth().onAuthStateChanged(async (user) => {
    if (!user) return;
    const item = await getPost(item1.id);
    const liked_by = item.liked_by;

    // Update the liked_by array and likes count based on whether the user already liked the item
    if (liked_by.includes(user.uid)) {
      liked_by.splice(liked_by.indexOf(user.uid), 1);
      await db
        .collection("posts")
        .doc(item.id)
        .update({
          likes: item.likes - 1,
          liked_by: liked_by,
        });
    } else {
      liked_by.push(user.uid);
      await db
        .collection("posts")
        .doc(item.id)
        .update({
          likes: item.likes + 1,
          liked_by: liked_by,
        });
    }
  });
};

/**
 * Loads the post and its replies, then appends them to the DOM.
 *
 * This function fetches the post using its ID, displays the post content,
 * retrieves all associated replies, and then appends both the post and replies to the page.
 */
const loadEverything = async () => {
  try {
    const post = await getPost(postid);
    if (post) {
      appendPost(post);
      const replies = await getallReplies(post);
      if (replies) {
        appendReplies(replies);
      }
    } else {
      console.log("Posts not found or undefined");
    }
  } catch (e) {
    console.log(e.message);
  }
};

// Load the post and replies once the DOM content has fully loaded
window.addEventListener("DOMContentLoaded", async () => {
  await loadEverything();
});

/**
 * Appends a post to the forum section of the page.
 *
 * This function dynamically creates and inserts HTML elements to display the post's details,
 * such as title, author, content, like button, and share button.
 *
 * @param {Object} item - The post object to be appended.
 */
const appendPost = (item) => {
  const milliseconds =
    item.postedAt.seconds * 1000 + Math.floor(item.postedAt.nanoseconds / 1e6);
  let avatar = `/images/pfp.jpg`;
  if (item.user && item.user.avatar) {
    avatar = item.user.avatar;
  }

  // Create a Date object from the Firestore timestamp
  const date = new Date(milliseconds);

  // Build the HTML for the post
  const html = ` <div class="p-6">
            <div class="flex justify-between items-start mb-4">
                <h2 class="text-2xl font-bold text-gray-800">${item.title}</h2>
                <div class="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
                    General
                </div>
            </div>
            
            <div class="flex items-center mb-6">
                <img src="${avatar}" alt="User avatar" class="w-10 h-10 rounded-full mr-3">
                <div>
                  <a href="/user/index.html?id=${item.userid}">     
                    <div class="font-medium text-indigo-600">${item.username}</div> 
                  </a>
                    <div class="text-sm text-gray-500">Posted ${date.toDateString()}</div>
                </div>
            </div>
            
            <div class="prose max-w-none text-gray-700">
                <p>${item.content}</p>
            </div>
            
            <div class="flex gap-3 items-center mt-6 space-x-4">
                <button class="flex items-center text-gray-500 hover:text-indigo-600" id=btn${item.id}>
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1" fill="none" id=svg${item.id} viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                    </svg>
                     <span id=span${item.id}> ${item.likes} </span> &nbsp Likes
                </button>
                <button id="sharebtn" class="flex items-center text-gray-500 hover:text-indigo-600">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                    </svg>
                    Share
                </button>
            </div>
        </div>`;
  // Insert the post HTML into the forum section element
  document.getElementById("forumsection").innerHTML = html;

  // Set up share data and add event listener for share functionality
  const shareData = {
    title: item.title,
    text: item.content.slice(0, 100),
    url: window.location.href,
  };
  document.getElementById("sharebtn").addEventListener("click", async () => {
    await navigator.share(shareData);
  });

  // Highlight the like button if the current user has already liked the post
  firebase.auth().onAuthStateChanged(async (user) => {
    if (item.liked_by.includes(user.uid)) {
      document.getElementById(`svg${item.id}`).setAttribute("fill", "violet");
    }
  });

  // Add an event listener to the like button to trigger the like function
  document.getElementById(`btn${item.id}`).addEventListener("click", () => {
    like(item);
  });
};

/**
 * Retrieves all replies associated with a given post.
 *
 * This function fetches reply documents from Firestore based on the reply IDs stored
 * in the post object, enriches each reply with its corresponding user data, and returns
 * an array of reply objects.
 *
 * @param {Object} item - The post object containing a replies array.
 * @returns {Promise<Array>} A promise that resolves to an array of valid reply objects.
 */
async function getallReplies(item) {
  try {
    // Ensure the replies array exists and filter out any falsy values
    const replyIds = Array.isArray(item.replies)
      ? item.replies.filter(Boolean)
      : [];

    // Map each reply ID to a promise that fetches the reply and its associated user data
    const replyPromises = replyIds.map(async (replyId) => {
      const doc = await db.collection("posts").doc(replyId).get();
      if (doc.exists) {
        const data = doc.data();
        data.id = replyId;
        // Fetch the user data for the reply's author
        const userDoc = await db.collection("users").doc(data.userid).get();
        data.user = userDoc.exists ? userDoc.data() : null;
        if (userDoc.data()) {
          if (userDoc.data().name) {
            data.username = userDoc.data().name;
          }
        }
        return data;
      }
      return null; // Return null for non-existent replies
    });

    // Wait for all reply promises to resolve and filter out any null responses
    const replies = await Promise.all(replyPromises);
    const validReplies = replies.filter((reply) => reply !== null);

    console.log(validReplies);
    return validReplies;
  } catch (error) {
    console.error("Error fetching replies:", error);
    throw error;
  }
}

/**
 * Appends an array of replies to the replies section in the DOM.
 *
 * This function generates HTML for each reply, inserts it into the DOM, and sets up
 * event listeners for like functionality on each reply.
 *
 * @param {Array} replies - An array of reply objects to be displayed.
 */
const appendReplies = (replies) => {
  let html = `<div class="space-y-6" id="allreplies">`;
  for (let i = 0; i < replies.length; i++) {
    let item = replies[i];
    const milliseconds =
      item.postedAt.seconds * 1000 +
      Math.floor(item.postedAt.nanoseconds / 1e6);
    const date = new Date(milliseconds);
    let avatar = `/images/pfp.jpg`;
    if (item.user && item.user.avatar) {
      avatar = item.user.avatar;
    }
    html += `
        <div class="bg-white rounded-lg shadow-md p-6">
          <div class="flex items-start">
            <img src="${avatar}" alt="User avatar" class="w-10 h-10 rounded-full mr-4">
            <div class="flex-1">
              <div class="flex items-center justify-between mb-2">
                <div>
                   <a href="/user/index.html?id=${item.userid}">     
                     <div class="font-medium text-indigo-600">${item.username}</div> 
                   </a>
                  <span class="text-sm text-gray-500 ml-2">${date.toDateString()}</span>
                </div>
                <button class="text-gray-400 hover:text-gray-600">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z" />
                  </svg>
                </button>
              </div>
              <div class="prose text-gray-700">
                <p>${item.content}</p>
              </div>
              <div class="flex items-center mt-4 gap-3 space-x-4">
                <button class="flex items-center text-gray-500 hover:text-indigo-600 text-sm" id="btn${item.id}">
                  <svg xmlns="http://www.w3.org/2000/svg" id="svg${item.id}" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                  </svg>
                  <span id="span${item.id}">${item.likes}</span> &nbsp; Likes
                </button>
              </div>
            </div>
          </div>
        </div>`;
  }
  html += `</div>`;
  // Insert the replies HTML into the replies section element
  document.getElementById("repliessection").innerHTML = html;

  // For each reply, check if the current user has liked it and add event listener for liking
  replies.forEach((item) => {
    firebase.auth().onAuthStateChanged(async (user) => {
      if (item.liked_by.includes(user.uid)) {
        document.getElementById(`svg${item.id}`).setAttribute("fill", "violet");
      }
    });
    document.getElementById(`btn${item.id}`).addEventListener("click", () => {
      like(item);
    });
  });
};

/**
 * Adds fake replies to the Firestore "posts" collection.
 *
 * This function is used for testing purposes and creates several fake reply documents.
 */
const addFakeReplies = async () => {
  let postref = db.collection("posts");

  for (let i = 0; i < 6; i++) {
    postref.add({
      category: "Tag",
      content: `Reply ${i}`,
      is_reply: true,
      username: `user ${i}`,
      postedAt: firebase.firestore.FieldValue.serverTimestamp(),
    });
  }
};

// Add event listener for the "addReplyBtn" to handle adding a new reply
document.getElementById("addReplyBtn").addEventListener("click", async (e) => {
  e.preventDefault();
  firebase.auth().onAuthStateChanged(async (user) => {
    console.log(user);
    let val = document.getElementById("comment").value;
    if (val) {
      // Create a new reply document in Firestore
      const docref = await db.collection("posts").add({
        category: "reply",
        content: val,
        is_reply: true,
        username: user.displayName,
        postedAt: firebase.firestore.FieldValue.serverTimestamp(),
        likes: 0,
        liked_by: [],
        userid: user.uid,
      });

      // Retrieve the current post, update its replies array with the new reply ID, and update Firestore
      const post = await getPost(postid);
      const replies = post.replies;
      replies.push(docref.id);
      db.collection("posts").doc(postid).update({
        replies: replies,
      });
      // Clear the comment input field
      document.getElementById("comment").value = "";
      // Reload the post and replies to reflect the new addition
      await loadEverything();
    }
  });
});
