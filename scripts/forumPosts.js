let currentPage = 1; // Tracks the current page of data
let loading = false; // Prevents multiple fetches at the same time
const contentDiv = document.getElementById('content'); // Posts will be dynamically loaded here
const loadingDiv = document.getElementById('loading'); // Target element for infinite scrolling


const getPosts = async (page) => {
  // Simulated delay for loading effect
    let posts = []; // Initialize an empty array to hold the posts

    try {
        const querySnapshot = await db.collection("posts").get(); // Get all posts
        querySnapshot.forEach(doc => {
            const post = doc.data(); // Get post data
            console.log("Username:", post.username);
            console.log("Title:", post.title);
            console.log("Content:", post.content);
            

            // Add actual post data to the posts array
            posts.push(post);
        });

        // Now `posts` contains all the posts from the database
        console.log(posts); // Print all posts or use it elsewhere
        return posts

    } catch (error) {
        console.error("Error fetching posts:", error);
    }
};

const appendData = (data) => {
    data.forEach(item => {
        const div = document.createElement('div');
        div.className = 'bg-white shadow-md rounded-lg p-4 border border-gray-300 hover:shadow-lg transition-all duration-200';
        
        // Encode parameters to ensure special characters don't break the URL
        const postUrl = `post.html?username=${encodeURIComponent(item.username)}&title=${encodeURIComponent(item.title)}&content=${encodeURIComponent(item.content)}`;
        
        div.innerHTML = `
         <a href="${postUrl}" class="block">
           <div class="p-4 hover:bg-gray-50 transition cursor-pointer">
                <div class="flex items-start">
                    <img src="https://i.pravatar.cc/40?img=2" alt="User avatar" class="w-10 h-10 rounded-full mr-4">
                    <div class="flex-1">
                        <h4 class="text-lg font-medium text-gray-800">${item.title}</h4>
                        <div class="flex items-center text-sm text-gray-500 mt-1">
                            <span>Posted by <span class="text-indigo-600">${item.username}</span></span>
                            <span class="mx-2">•</span>
                            <span>Yesterday</span>
                            <span class="mx-2">•</span>
                            <span>${item.replies.length}</span>
                        </div>
                        <p class="text-gray-600 mt-2 line-clamp-2">${item.content.slice(0,100)}..</p>
                    </div>
                    <div class="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">
                        Tips
                    </div>
                </div>
            </div>
            </a>
          
        `;

        contentDiv.appendChild(div);
    });
};


const observer = new IntersectionObserver(async (entries) => {
    if (entries[0].isIntersecting && !loading) {
        loading = true;
        currentPage++;
        try {
            const data = await getPosts(currentPage);
            appendData(data);
        } catch (e) {
            console.log(e.message);
        }
        loading = false;
    }
}, { threshold: 1.0 });

observer.observe(loadingDiv);

window.addEventListener('DOMContentLoaded', async () => {
    try {
        const posts = await getPosts(currentPage);
        if (posts) {
            appendData(posts);
        } else {
            console.log('Posts not found or undefined');
        }
    } catch (e) {
        console.log(e.message);
    }
});

// Fetch and display comments
const loadComments = async () => {
    const commentsList = document.getElementById('comment-list');
    commentsList.innerHTML = ''; // Clear existing comments

    try {
        const commentsSnapshot = await db.collection("posts").doc(postId).collection("comments").get();
        commentsSnapshot.forEach(doc => {
            const commentData = doc.data();
            const commentDiv = document.createElement('div');
            commentDiv.className = 'bg-gray-100 p-4 rounded-lg';

            commentDiv.innerHTML = `
                <p class="text-sm text-gray-500">Comment by u/${commentData.username} on ${commentData.createdAt.toDate().toLocaleString()}</p>
                <p class="text-gray-700 mt-2">${commentData.content}</p>
            `;
            commentsList.appendChild(commentDiv);
        });
    } catch (error) {
        console.error("Error fetching comments:", error);
    }
};

// Add a new comment to Firestore
const addComment = async (event) => {
    event.preventDefault(); // Prevent form submission

    const commentInput = document.getElementById('comment-input');
    const commentContent = commentInput.value.trim();

    if (commentContent) {
        const user = firebase.auth().currentUser;

        try {
            await db.collection("posts").doc(postId).collection("comments").add({
                username: user ? user.displayName : "Anonymous", // Use logged-in user's name
                content: commentContent,
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            });

            commentInput.value = ''; // Clear the input field
            loadComments(); // Reload the comments after adding
        } catch (error) {
            console.error("Error adding comment:", error);
        }
    }
};

// Event listener for comment form submission
document.getElementById('comment-form').addEventListener('submit', addComment);

// Load comments when the page is loaded
window.addEventListener('DOMContentLoaded', loadComments);