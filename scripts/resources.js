document.addEventListener("DOMContentLoaded", () => {
  // Get DOM elements for articles grid, videos grid, and filter buttons.
  const articlesGrid = document.getElementById("articles-grid");
  const videosGrid = document.getElementById("videos-grid");
  const filterButtons = document.querySelectorAll(".category-btn");

  /**
   * Sets the visibility of content cards based on the selected category.
   *
   * This function toggles the display of the "recent" and "videos" sections and
   * filters all sections with the class "category-section" by matching the provided category.
   * It also updates the styling of the filter buttons to highlight the active category.
   *
   * @param {string} category - The category to filter by ("all" shows all sections).
   */
  function setCardVisibility(category) {
    const recentSection = document.getElementById("recent-section");
    const videosSection = document.getElementById("videos-section");

    // Show both sections if "all" is selected; otherwise, hide them.
    if (category === "all") {
      if (recentSection) recentSection.style.display = "block";
      if (videosSection) videosSection.style.display = "block";
    } else {
      if (recentSection) recentSection.style.display = "none";
      if (videosSection) videosSection.style.display = "none";
    }

    // Filter content sections based on their data-category attribute.
    const allSections = document.querySelectorAll(".category-section");
    allSections.forEach((section) => {
      const sectionCategory = section
        .getAttribute("data-category")
        .toLowerCase();
      section.style.display =
        category === "all" || sectionCategory === category ? "block" : "none";
    });

    // Remove active button styling from all filter buttons.
    filterButtons.forEach((btn) => {
      btn.classList.remove("btn-primary", "text-white");
    });
    // Add active button styling to the button corresponding to the selected category.
    const activeBtn = document.querySelector(`[data-category="${category}"]`);
    if (activeBtn) {
      activeBtn.classList.add("btn-primary", "text-white");
    }
  }

  // Attach click event listeners to filter buttons.
  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const selectedCategory = button
        .getAttribute("data-category")
        .toLowerCase();
      setCardVisibility(selectedCategory);
    });
  });

  // Load blog articles from Firestore ("resources" collection).
  db.collection("resources")
    .get()
    .then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        const item = doc.data();
        // Create a new article card.
        const colDiv = document.createElement("div");
        colDiv.className = "col-md-6 col-lg-4 article-card";
        colDiv.setAttribute("data-category", item.category.toLowerCase());
        colDiv.style.display = "block";

        // Set the HTML content of the article card.
        colDiv.innerHTML = `
            <div class="card h-100 border-0 shadow-sm">
              <img src="${item.imageUrl}" alt="${item.title}" class="article-img card-img-top" />
              <div class="card-body">
                <h5 class="article-title">${item.title}</h5>
                <p class="article-text">${item.description}</p>
                <a href="${item.articleLink}" target="_blank" class="read-more" style="color:blue">Read More</a>
              </div>
            </div>
          `;
        // Append the card to the appropriate category grid.
        const categoryId =
          item.category.toLowerCase().replace(/\s/g, "-") + "-grid";
        const targetGrid = document.getElementById(categoryId);
        if (targetGrid) {
          targetGrid.appendChild(colDiv);
        }

        // Also append the card to the "recent" grid if marked as recent.
        if (item.recent) {
          const recentGrid = document.getElementById("recent-grid");
          if (recentGrid) {
            recentGrid.appendChild(colDiv.cloneNode(true));
          }
        }
      });
    })
    .catch((error) => {
      console.error("❌ Error loading resources.json:", error);
      articlesGrid.innerHTML =
        '<div class="text-center text-danger">Failed to load articles.</div>';
    });

  // Load videos from Firestore ("videos" collection).
  db.collection("videos")
    .get()
    .then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        const video = doc.data();
        // Create a new video card.
        const colDiv = document.createElement("div");
        colDiv.className = "col-md-6 col-lg-4 video-card";
        colDiv.setAttribute("data-category", video.category.toLowerCase());
        colDiv.style.display = "block";

        // Set the HTML content of the video card.
        colDiv.innerHTML = `
            <div class="card h-100 border-0 shadow-sm">
              <div class="ratio ratio-16x9">
                <iframe src="${video.videoUrl}" title="${video.title}" allowfullscreen></iframe>
              </div>
              <div class="card-body">
                <h5 class="article-title">${video.title}</h5>
                <p class="article-text">${video.description}</p>
              </div>
            </div>
          `;
        videosGrid.appendChild(colDiv);
      });
    })
    .catch((error) => {
      console.error("❌ Error loading videos.json:", error);
      videosGrid.innerHTML =
        '<div class="text-center text-danger">Failed to load videos.</div>';
    });

  // Set default visibility to show all categories.
  setCardVisibility("all");
});
