// musicLogic.js

// Firebase Firestore and Authentication references
const db = firebase.firestore();
const auth = firebase.auth();

/**
 * Loads music tracks by genre from Firestore and displays them.
 *
 * This function queries the "music" collection for documents that match the specified genre.
 * It then creates a card for each track with an audio player and action buttons (like and add to playlist),
 * and appends the card to the corresponding genre container in the DOM.
 *
 * @param {string} genre - The genre of music tracks to load.
 */
function loadTracksByGenre(genre) {
  const genreTab = document.getElementById(genre + "-tracks");
  if (!genreTab) return;
  genreTab.innerHTML = "";

  db.collection("music")
    .where("genre", "==", genre)
    .get()
    .then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        const card = document.createElement("div");
        card.className = "col-md-4 mb-4";
        card.innerHTML = `
          <div class="card p-3 rounded-xl shadow">
            <h3 class="mb-2">${data.title}</h3>
            <audio controls class="w-100">
              <source src="https://firebasestorage.googleapis.com/v0/b/YOUR_BUCKET_NAME/o/${encodeURIComponent(data.storagePath)}?alt=media" type="audio/mpeg">
            </audio>
            <button class="btn btn-sm btn-outline-light mt-2" onclick="likeTrack('${data.title}', '${genre}', '${data.storagePath}')">❤️ Like</button>
            <button class="btn btn-sm btn-outline-light mt-2" onclick="addToPlaylist('${data.title}', '${genre}', '${data.storagePath}')">➕ Add to Playlist</button>
          </div>
        `;
        genreTab.appendChild(card);
      });
    })
    .catch((error) => {
      console.error("Error loading music:", error);
    });
}

/**
 * Saves a track to the user's liked songs collection in Firestore.
 *
 * This function adds the selected track to the current user's "likedTracks" subcollection.
 * If the user is not signed in, an alert prompts them to sign in.
 *
 * @param {string} title - The title of the track.
 * @param {string} genre - The genre of the track.
 * @param {string} storagePath - The storage path of the track in Firebase Storage.
 */
function likeTrack(title, genre, storagePath) {
  const user = auth.currentUser;
  if (!user) return alert("Please sign in to like songs.");

  db.collection("users")
    .doc(user.uid)
    .collection("likedTracks")
    .add({
      title,
      genre,
      storagePath,
      likedAt: firebase.firestore.Timestamp.now(),
    })
    .then(() => console.log("✅ Track liked."))
    .catch((err) => console.error("❌ Like failed:", err));
}

/**
 * Adds a track to a user's custom playlist in Firestore.
 *
 * This function prompts the user for the playlist name, then adds the track to the
 * specified playlist's "tracks" subcollection in Firestore. If the user is not signed in,
 * an alert prompts them to sign in.
 *
 * @param {string} title - The title of the track.
 * @param {string} genre - The genre of the track.
 * @param {string} storagePath - The storage path of the track in Firebase Storage.
 */
function addToPlaylist(title, genre, storagePath) {
  const playlistName = prompt("Which playlist?");
  if (!playlistName) return;
  const user = auth.currentUser;
  if (!user) return alert("Please sign in to use playlists.");

  db.collection("users")
    .doc(user.uid)
    .collection("playlists")
    .doc(playlistName)
    .collection("tracks")
    .add({
      title,
      genre,
      storagePath,
      addedAt: firebase.firestore.Timestamp.now(),
    })
    .then(() => console.log("✅ Track added to playlist."))
    .catch((err) => console.error("❌ Playlist add failed:", err));
}

/**
 * Creates a new empty playlist for the current user in Firestore.
 *
 * The function retrieves the playlist name from an input field, validates the input,
 * and then creates a new document in the user's "playlists" subcollection. Upon successful
 * creation, it updates the UI to display the new playlist.
 */
function createPlaylist() {
  const name = document.getElementById("playlistName").value.trim();
  const user = auth.currentUser;
  if (!name || !user) return alert("Login and name your playlist.");

  db.collection("users")
    .doc(user.uid)
    .collection("playlists")
    .doc(name)
    .set({ createdAt: firebase.firestore.Timestamp.now() })
    .then(() => {
      const container = document.getElementById("user-playlists");
      const div = document.createElement("div");
      div.className = "card p-3 mt-2";
      div.textContent = name;
      container.appendChild(div);
    });
}

/**
 * Loads the current user's playlists from Firestore and displays them.
 *
 * This function retrieves all documents from the user's "playlists" subcollection and
 * creates a card element for each playlist, displaying it in the UI.
 */
function loadUserPlaylists() {
  const user = auth.currentUser;
  if (!user) return;

  const container = document.getElementById("user-playlists");
  container.innerHTML = "";

  db.collection("users")
    .doc(user.uid)
    .collection("playlists")
    .get()
    .then((snap) => {
      snap.forEach((doc) => {
        const div = document.createElement("div");
        div.className = "card p-3 mt-2";
        div.textContent = doc.id;
        container.appendChild(div);
      });
    });
}

// Initialize genres and user playlists when authentication state changes
firebase.auth().onAuthStateChanged((user) => {
  if (user) {
    loadUserPlaylists();
    ["lofi", "classical", "ambient", "nature"].forEach(loadTracksByGenre);
  }
});
