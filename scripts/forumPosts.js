let currentPage = 1; // this will help us keep track of the current page of data
let loading = false; // this will prevent multiple fetches of data at the same time
const contentDiv = document.getElementById('content'); // our post will be dynamically loaded here
const loadingDiv = document.getElementById('loading'); // this will be our target element

const defaultPosts = new Array(100).fill({ title: "Post title", body: "Post body" })

const delay = (time) => new Promise((resolve, reject) => setTimeout(resolve, time))

const getPosts = async (page) => {
    // try {
    //     let response = await fetch(`https://jsonplaceholder.typicode.com/posts?_limit=10&_page=${page}`);
    //     if (!response.ok) {
    //         throw new Error("HTTP error! Status: " + response.status);
    //     }
    //     return await response.json();
    // } catch (e) {
    //     throw new Error("Failed to fetch services: " + e.message);
    // }
    await delay(1000)
    return defaultPosts
}

const appendData = (data) => {
    data.forEach(item => {
        const div = document.createElement('div');
        div.className = 'item bg-yellow-500';
        div.innerHTML = `<p>${item.username}</p><h3>${item.title}</h3><p>${item.content}</p>`;
        contentDiv.appendChild(div);
    })
}

const observer = new IntersectionObserver(async (entries) => {
    if (entries[0].isIntersecting && !loading) {

        console.log(entries)

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
            console.log('posts not found or undefined');
        }
    } catch (e) {
        console.log(e.message);
    }
});

