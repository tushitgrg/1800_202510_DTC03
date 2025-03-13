const contentDiv = document.getElementById('content');
const getPosts = async () => {
    // Simulated delay for loading effect
      let posts = []; // Initialize an empty array to hold the posts
  
      try {
          const querySnapshot = await db.collection("posts").get(); // Get all posts
          querySnapshot.forEach(doc => {
              const post = doc.data(); // Get post data
             console.log(post)
  if(!post.is_reply){
    posts.push(post);
  }
              // Add actual post data to the posts array
             
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
        const milliseconds = item.postedAt.seconds * 1000 + Math.floor(item.postedAt.nanoseconds / 1e6);

// Create a Date object
const date = new Date(milliseconds);

        const div = document.createElement('div');
        div.className = 'bg-white shadow-md rounded-lg p-4 border border-gray-300 hover:shadow-lg transition-all duration-200';
        
        // Encode parameters to ensure special characters don't break the URL
        const postUrl = `post.html?username=${encodeURIComponent(item.username)}&title=${encodeURIComponent(item.title)}&content=${encodeURIComponent(item.content)}`;
        let tagshtml = ""
        item.category.forEach((i)=>{
            tagshtml+= `
             <div class="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">
                        ${i}
                    </div>
            `
        })
        div.innerHTML = `
         <a href="${postUrl}" class="block">
           <div class="p-4 hover:bg-gray-50 transition cursor-pointer">
                <div class="flex items-start">
                    <img src="https://avatar.iran.liara.run/public/${Math.floor(Math.random()*10)}" alt="User avatar" class="w-10 h-10 rounded-full mr-4">
                    <div class="flex-1">
                        <h4 class="text-lg font-medium text-gray-800">${item.title}</h4>
                        <div class="flex items-center flex-wrap text-sm text-gray-500 mt-1">
                            <span>Posted by <span class="text-indigo-600">${item.username}</span></span>
                            <span class="mx-2">•</span>
                            <span>${date.toDateString()}</span>
                            <span class="mx-2">•</span>
                            <span>${item.replies.length-1} replies</span>
                        </div>
                        <p class="text-gray-600 mt-2 line-clamp-2">${item.content.slice(0,100)}..</p>
                    </div>
                    <div class="flex flex-wrap gap-2">
                   ${tagshtml}
                   </div>
                </div>
            </div>
            </a>
          
        `;

        contentDiv.appendChild(div);
    });
};
  window.addEventListener('DOMContentLoaded', async () => {
    try {
        const posts = await getPosts();
        if (posts) {
            appendData(posts);
        } else {
            console.log('Posts not found or undefined');
        }
    } catch (e) {
        console.log(e.message);
    }
});