document.addEventListener("DOMContentLoaded", () => {
    const articlesGrid = document.getElementById("articles-grid");
    const videosGrid = document.getElementById("videos-grid");
    const filterButtons = document.querySelectorAll(".category-btn");
  
    function setCardVisibility(category) {
      const recentSection = document.getElementById("recent-section");
      const videosSection = document.getElementById("videos-section");
      
      if (category === "all") {
        if (recentSection) recentSection.style.display = "block";
        if (videosSection) videosSection.style.display = "block";
      } else {
        if (recentSection) recentSection.style.display = "none";
        if (videosSection) videosSection.style.display = "none";
      }
      
      const allSections = document.querySelectorAll(".category-section");

      allSections.forEach((section) => {
        const sectionCategory = section.getAttribute("data-category").toLowerCase();
        section.style.display =
          category === "all" || sectionCategory === category ? "block" : "none";
      });
  
      filterButtons.forEach((btn) => {
        btn.classList.remove("btn-primary", "text-white");
      });
      const activeBtn = document.querySelector(`[data-category="${category}"]`);
      if (activeBtn) {
        activeBtn.classList.add("btn-primary", "text-white");
      }
    }
  
    filterButtons.forEach((button) => {
      button.addEventListener("click", () => {
        const selectedCategory = button.getAttribute("data-category").toLowerCase();
        setCardVisibility(selectedCategory);
      });
    });
 // Get all posts
   
    
    // Load blog articles
    db.collection("resources").get().then((querySnapshot)=>{
      querySnapshot.forEach(doc => { item= doc.data()
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
                <a href="${item.articleLink}" target="_blank" class="read-more" style="color:blue">Read More</a>
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
    db.collection("videos").get().then((querySnapshot)=>{
      querySnapshot.forEach(doc => { video= doc.data()
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