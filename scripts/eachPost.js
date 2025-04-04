const paramsString = window.location.search;
const searchParams = new URLSearchParams(paramsString);
const postid = searchParams.get("id");

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

const like = async (item1) => {
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
  firebase.auth().onAuthStateChanged(async (user) => {
    if (!user) return;
    const item = await getPost(item1.id);
    const liked_by = item.liked_by;

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
window.addEventListener("DOMContentLoaded", async () => {
  await loadEverything();
});

const appendPost = (item) => {
  const milliseconds =
    item.postedAt.seconds * 1000 + Math.floor(item.postedAt.nanoseconds / 1e6);
  let avatar = `/images/pfp.jpg`;
  if (item.user) {
    if (item.user.avatar) {
      avatar = item.user.avatar;
    }
  }

  // Create a Date object
  const date = new Date(milliseconds);

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

                <a href="/user/index.html?id=${item.userid}">     <div class="font-medium text-indigo-600">${item.username}</div> </a>
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
  document.getElementById("forumsection").innerHTML = html;
  const shareData = {
    title: item.title,
    text: item.content.slice(0, 100),
    url: window.location.href,
  };
  document.getElementById("sharebtn").addEventListener("click", async () => {
    await navigator.share(shareData);
  });
  firebase.auth().onAuthStateChanged(async (user) => {
    if (item.liked_by.includes(user.uid)) {
      document.getElementById(`svg${item.id}`).setAttribute("fill", "violet");
    }
  });

  document.getElementById(`btn${item.id}`).addEventListener("click", () => {
    like(item);
  });
};

// async function getallReplies(item) {
//     let replies = []
//     const itemReplies = item.replies
//     for (let i = 0; i < itemReplies.length; i++) {
//         if (!itemReplies[i]) continue
//         await db.collection("posts").doc(itemReplies[i]).get().then((doc) => {
//             dt = doc.data()
//             dt.id = itemReplies[i]
//             replies.push(dt)

//         })
//     }
//     console.log(replies)
//     return replies

// }

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

    // Wait for all reply promises to resolve
    const replies = await Promise.all(replyPromises);
    // Filter out any null responses (replies that didn't exist)
    const validReplies = replies.filter((reply) => reply !== null);

    console.log(validReplies);
    return validReplies;
  } catch (error) {
    console.error("Error fetching replies:", error);
    throw error;
  }
}

const appendReplies = (replies) => {
  let html = `<div class="space-y-6" id="allreplies">`;
  for (let i = 0; i < replies.length; i++) {
    let item = replies[i];
    const milliseconds =
      item.postedAt.seconds * 1000 +
      Math.floor(item.postedAt.nanoseconds / 1e6);
    const date = new Date(milliseconds);
    let avatar = `/images/pfp.jpg`;
    if (item.user) {
      if (item.user.avatar) {
        avatar = item.user.avatar;
      }
    }
    html += `
        <div class="bg-white rounded-lg shadow-md p-6">
          <div class="flex items-start">
            <img src="${avatar}" alt="User avatar" class="w-10 h-10 rounded-full mr-4">
            <div class="flex-1">
              <div class="flex items-center justify-between mb-2">
                <div>
                   <a href="/user/index.html?id=${item.userid}">     <div class="font-medium text-indigo-600">${item.username}</div> </a>
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
  document.getElementById("repliessection").innerHTML = html;

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
document.getElementById("addReplyBtn").addEventListener("click", async (e) => {
  e.preventDefault();
  firebase.auth().onAuthStateChanged(async (user) => {
    console.log(user);
    let val = document.getElementById("comment").value;
    if (val) {
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

      const post = await getPost(postid);
      const replies = post.replies;
      replies.push(docref.id);
      db.collection("posts").doc(postid).update({
        replies: replies,
      });
      document.getElementById("comment").value = "";
      await loadEverything();
    }
  });
});
