// musicLogic.js

// Will need assistance with firebase storage and firestore!!!!!in lab tmr
const db = firebase.firestore();
const auth = firebase.auth();

// ✅ Load music by genre from Firestore
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

// ❤️ Save track to user's liked songs
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

// ➕ Add track to user's custom playlist
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

// 📂 Create a new empty playlist
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

// ▶️ Load user playlists
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

// 🔁 Init all genres and playlist section
firebase.auth().onAuthStateChanged((user) => {
  if (user) {
    loadUserPlaylists();
    ["lofi", "classical", "ambient", "nature"].forEach(loadTracksByGenre);
  }
});
