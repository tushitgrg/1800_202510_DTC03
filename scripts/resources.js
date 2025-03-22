document.addEventListener("DOMContentLoaded", () => {
    const articlesGrid = document.getElementById("articles-grid");
    const videosGrid = document.getElementById("videos-grid");
    const filterButtons = document.querySelectorAll(".category-btn");
  
    function setCardVisibility(category) {
      const allCards = document.querySelectorAll(".article-card, .video-card");
  
      allCards.forEach((card) => {
        const cardCategory = card.getAttribute("data-category").toLowerCase();
        card.style.display =
          category === "all" || cardCategory === category ? "block" : "none";
      });
  
      filterButtons.forEach((btn) => {
        btn.classList.remove("btn-success", "text-white");
      });
      const activeBtn = document.querySelector(`[data-category="${category}"]`);
      if (activeBtn) {
        activeBtn.classList.add("btn-success", "text-white");
      }
    }
  
    filterButtons.forEach((button) => {
      button.addEventListener("click", () => {
        const selectedCategory = button.getAttribute("data-category").toLowerCase();
        setCardVisibility(selectedCategory);
      });
    });
  
    // Load blog articles
    fetch("resources.json")
      .then((res) => res.json())
      .then((data) => {
        data.forEach((item) => {
          const colDiv = document.createElement("div");
          colDiv.className = "col-md-6 col-lg-4 article-card";
          colDiv.setAttribute("data-category", item.category.toLowerCase());
          colDiv.style.display = "block";
  
          colDiv.innerHTML = `
            <div class="card h-100 border-0 shadow-sm">
              <img src="${item.imageUrl}" alt="${item.title}" class="article-img card-img-top" />
              <div class="card-body">
                <h5 class="article-title">${item.title}</h5>
                <p class="article-text">${item.description}</p>
                <a href="${item.articleLink}" target="_blank" class="read-more">Read More</a>
              </div>
            </div>
          `;
          // Append to the appropriate category grid
          const categoryId = item.category.toLowerCase().replace(/\s/g, "-") + "-grid";
          const targetGrid = document.getElementById(categoryId);
          if (targetGrid) {
            targetGrid.appendChild(colDiv);
          }

          // Also append to "recent" if marked as recent
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
        articlesGrid.innerHTML = '<div class="text-center text-danger">Failed to load articles.</div>';
      });
  
    // Load videos
    fetch("videos.json")
      .then((res) => res.json())
      .then((data) => {
        data.forEach((video) => {
          const colDiv = document.createElement("div");
          colDiv.className = "col-md-6 col-lg-4 video-card";
          colDiv.setAttribute("data-category", video.category.toLowerCase());
          colDiv.style.display = "block";
  
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
        videosGrid.innerHTML = '<div class="text-center text-danger">Failed to load videos.</div>';
      });
  
    // Show all by default
    setCardVisibility("all");
  });