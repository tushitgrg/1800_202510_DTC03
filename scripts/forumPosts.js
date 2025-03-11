let currentPage = 1; // Tracks the current page of data
let loading = false; // Prevents multiple fetches at the same time
const contentDiv = document.getElementById('content'); // Posts will be dynamically loaded here
const loadingDiv = document.getElementById('loading'); // Target element for infinite scrolling

const defaultPosts = new Array(10).fill({
    username: "User123",
    title: "Post title",
    content: "Post body"
});

const testPosts = async () => {
    let posts = []; // Initialize an empty array to hold the posts

    try {
        const querySnapshot = await db.collection("posts").get(); // Get all posts
        querySnapshot.forEach(doc => {
            const post = doc.data(); // Get post data
            console.log("Username:", post.username);
            console.log("Title:", post.title);
            console.log("Content:", post.content);

            // Add actual post data to the posts array
            posts.push({
                username: post.username,
                title: post.title,
                content: post.content
            });
        });

        // Now `posts` contains all the posts from the database
        console.log(posts); // Print all posts or use it elsewhere
        return posts

    } catch (error) {
        console.error("Error fetching posts:", error);
    }
};

testPosts();


const delay = (time) => new Promise((resolve) => setTimeout(resolve, time));

const getPosts = async (page) => {
    await delay(1000); // Simulated delay for loading effect
    let posts = []; // Initialize an empty array to hold the posts

    try {
        const querySnapshot = await db.collection("posts").get(); // Get all posts
        querySnapshot.forEach(doc => {
            const post = doc.data(); // Get post data
            console.log("Username:", post.username);
            console.log("Title:", post.title);
            console.log("Content:", post.content);

            // Add actual post data to the posts array
            posts.push({
                username: post.username,
                title: post.title,
                content: post.content
            });
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
                <p class="text-sm text-gray-500">Posted by u/${item.username}</p>
                <h3 class="text-lg font-bold text-gray-900 mt-1">${item.title}</h3>
                <p class="text-gray-700 mt-2">${item.content}</p>
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
