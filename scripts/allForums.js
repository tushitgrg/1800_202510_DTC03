// Get the content container element from the DOM
const contentDiv = document.getElementById("content");

/**
 * Retrieves posts from the "posts" collection in the database.
 *
 * This asynchronous function fetches all posts, retrieves the corresponding
 * user data for each post, assigns the post's ID, and filters out posts that
 * are replies. It logs the posts to the console and returns an array of post objects.
 *
 * @returns {Promise<Array>} A promise that resolves to an array of post objects.
 */
const getPosts = async () => {
  try {
    // Retrieve all documents from the "posts" collection
    const querySnapshot = await db.collection("posts").get();

    // Map each document to a promise that enriches the post with user data
    const postPromises = querySnapshot.docs.map(async (doc) => {
      let post = doc.data();
      // Retrieve the user document corresponding to the post's userid
      const userDoc = await db.collection("users").doc(post.userid).get();

      // Add the post's ID and user data to the post object
      post.id = doc.id;
      post.user = userDoc.data();

      // If user data exists, add the user's name as the username
      if (userDoc.data()) {
        if (userDoc.data().name) {
          post.username = userDoc.data().name;
        }
      }

      // Return the post if it is not a reply; otherwise, return null
      return !post.is_reply ? post : null;
    });

    // Wait for all promises to resolve and filter out any null results (replies)
    const posts = (await Promise.all(postPromises)).filter(
      (post) => post !== null,
    );

    console.log(posts);
    return posts;
  } catch (error) {
    // Log any errors encountered during the fetch process
    console.error("Error fetching posts: ", error);
    throw error;
  }
};

/**
 * Appends post data to the DOM.
 *
 * This function takes an array of post objects and dynamically creates
 * HTML elements to display each post's details, including the avatar, title,
 * metadata (posted by, date, and number of replies), a content preview, and category tags.
 * It then appends these elements to the content container in the DOM.
 *
 * @param {Array} data - An array of post objects to be rendered.
 */
const appendData = (data) => {
  data.forEach((item) => {
    // Convert Firestore timestamp to JavaScript Date object
    const milliseconds =
      item.postedAt.seconds * 1000 +
      Math.floor(item.postedAt.nanoseconds / 1e6);
    const date = new Date(milliseconds);

    // Set a default avatar image; override if the user has a custom avatar
    let avatar = `/images/pfp.jpg`;
    if (item.user && item.user.avatar) {
      avatar = item.user.avatar;
    }

    // Generate the URL for the post's detail page using the post ID
    const postUrl = `/forum/post.html?id=${item.id}`;

    // Build HTML for each category tag associated with the post
    let tagshtml = "";
    item.category.forEach((i) => {
      tagshtml += `
             <div class="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">
                ${i}
             </div>
            `;
    });

    // Create an anchor element to wrap the post content for clickable navigation
    const anchor = document.createElement("a");
    anchor.href = postUrl;
    anchor.className = "block hover:bg-gray-50 transition cursor-pointer";

    // Create a container div for the post content with styling classes
    const div = document.createElement("div");
    div.className =
      "bg-white shadow-md rounded-lg p-4 border border-gray-300 hover:shadow-lg transition-all duration-200";

    // Populate the container div with the post's HTML content
    div.innerHTML = `
            <div class="p-4">
                <div class="flex items-start">
                    <img src="${avatar}" alt="User avatar" class="w-10 h-10 rounded-full mr-4">
                    <div class="flex-1">
                        <h4 class="text-lg font-medium text-gray-800">${item.title}</h4>
                        <div class="flex items-center flex-wrap text-sm text-gray-500 mt-1">
                            <span class="hover:underline">Posted by <a href="/user/index.html?id=${item.userid}" style="color:#3949AB" class="text-indigo-600 ">${item.username}</a></span> 
                            <span class="mx-2">•</span>
                            <span>${date.toDateString()}</span>
                            <span class="mx-2">•</span>
                            <span>${item.replies.length - 1} replies</span>
                        </div>
                        <p class="text-gray-600 mt-2 line-clamp-2">${item.content.slice(0, 100)}..</p>
                    </div>
                    <div class="md:flex hidden flex-wrap gap-2">
                        ${tagshtml}
                    </div>
                </div>
            </div>
        `;
    // Append the content container to the anchor, then add it to the main contentDiv
    anchor.appendChild(div);
    contentDiv.appendChild(anchor);
  });
};

// Event listener for when the DOM content has fully loaded
window.addEventListener("DOMContentLoaded", async () => {
  try {
    // Fetch posts from the database
    const posts = await getPosts();
    if (posts) {
      // Render the posts on the page
      appendData(posts);
    } else {
      console.log("Posts not found or undefined");
    }
  } catch (e) {
    // Log any errors encountered during initialization
    console.log(e.message);
  }
});
