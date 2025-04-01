const contentDiv = document.getElementById("content");
const getPosts = async () => {
  try {
    const querySnapshot = await db.collection("posts").get();

    const postPromises = querySnapshot.docs.map(async (doc) => {
      let post = doc.data();
      const userDoc = await db.collection("users").doc(post.userid).get();

      post.id = doc.id;
      post.user = userDoc.data();
      if (userDoc.data()) {
        if (userDoc.data().name) {
          post.username = userDoc.data().name;
        }
      }

      return !post.is_reply ? post : null;
    });

    // Wait for all promises to resolve and filter out any null results
    const posts = (await Promise.all(postPromises)).filter(
      (post) => post !== null,
    );

    console.log(posts);
    return posts;
  } catch (error) {
    console.error("Error fetching posts: ", error);
    throw error;
  }
};
const appendData = (data) => {
  data.forEach((item) => {
    const milliseconds =
      item.postedAt.seconds * 1000 +
      Math.floor(item.postedAt.nanoseconds / 1e6);
    const date = new Date(milliseconds);

    let avatar = `/images/pfp.jpg`;
    if (item.user && item.user.avatar) {
      avatar = item.user.avatar;
    }

    const postUrl = `/forum/post.html?id=${item.id}`;
    let tagshtml = "";
    item.category.forEach((i) => {
      tagshtml += `
             <div class="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">
                ${i}
             </div>
            `;
    });

    const anchor = document.createElement("a");
    anchor.href = postUrl;
    anchor.className = "block hover:bg-gray-50 transition cursor-pointer";
    const div = document.createElement("div");
    div.className =
      "bg-white shadow-md rounded-lg p-4 border border-gray-300 hover:shadow-lg transition-all duration-200";

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
    anchor.appendChild(div);
    contentDiv.appendChild(anchor);
  });
};

window.addEventListener("DOMContentLoaded", async () => {
  try {
    const posts = await getPosts();
    if (posts) {
      appendData(posts);
    } else {
      console.log("Posts not found or undefined");
    }
  } catch (e) {
    console.log(e.message);
  }
});
