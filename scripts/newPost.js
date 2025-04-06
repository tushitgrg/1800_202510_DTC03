/**
 * Creates a new post in the Firestore "posts" collection.
 *
 * This asynchronous function is triggered by a button click event. It prevents the default form submission,
 * collects post details from the input fields (title, category, content), and then waits for an authenticated user.
 * Once the user is authenticated, it creates a new post document with the provided details, and then redirects
 * the user to the post detail page using the new document's ID.
 *
 * @param {Event} e - The event object from the button click.
 */
const Createpost = async (e) => {
  e.preventDefault(); // Prevent default form submission behavior

  // Retrieve input elements for the post details
  const titleInput = document.getElementById("post-title");
  const catInput = document.getElementById("post-category");
  const contentInput = document.getElementById("post-content");

  // Check if the user is authenticated and then create the post
  firebase.auth().onAuthStateChanged(async (user) => {
    if (!user) {
      alert("Please sign in to create a post.");
      return;
    }
    // Add a new post document to the "posts" collection in Firestore
    const docref = await db.collection("posts").add({
      category: catInput.value.split(","), // Split comma-separated categories into an array
      content: contentInput.value,
      is_reply: false,
      username: user.displayName,
      postedAt: firebase.firestore.FieldValue.serverTimestamp(),
      likes: 0,
      liked_by: [],
      userid: user.uid,
      replies: [""],
      title: titleInput.value,
    });
    // Redirect to the post detail page using the new document's ID
    window.location.href = `/forum/post.html?id=${docref.id}`;
  });
};

// Add an event listener to wait for the DOM to load, then attach a click event listener to the "Createpostbtn"
window.addEventListener("DOMContentLoaded", () => {
  document
    .getElementById("Createpostbtn")
    .addEventListener("click", async (e) => {
      await Createpost(e);
    });
});
