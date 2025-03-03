let currentPage = 1; // Tracks the current page of data
let loading = false; // Prevents multiple fetches at the same time
const contentDiv = document.getElementById('content'); // Posts will be dynamically loaded here
const loadingDiv = document.getElementById('loading'); // Target element for infinite scrolling

const defaultPosts = new Array(10).fill({
    username: "User123",
    title: "Post title",
    content: "Post body"
});

const delay = (time) => new Promise((resolve) => setTimeout(resolve, time));

const getPosts = async (page) => {
    await delay(1000); // Simulated delay for loading effect
    return defaultPosts;
};

const appendData = (data) => {
    data.forEach(item => {
        const div = document.createElement('div');
        div.className = 'bg-white shadow-md rounded-lg p-4 border border-gray-300 hover:shadow-lg transition-all duration-200';

        div.innerHTML = `
            <p class="text-sm text-gray-500">Posted by u/${item.username}</p>
            <h3 class="text-lg font-bold text-gray-900 mt-1">${item.title}</h3>
            <p class="text-gray-700 mt-2">${item.content}</p>
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
