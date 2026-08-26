/* ==========================================================================
   ANIME NAVIGATOR - APPLICATION LOGIC & STATE (app.js)
   ========================================================================== */

const WALLPAPERS = [
  "assets/samurai-katana-in-forest-cinematic-4k-live-wallpaper.mp4",
  "assets/samurai-sun-live-wallpaper.mp4",
  "assets/fallen-angel-in-the-ruins-live-wallpaper.mp4",
  "assets/moonlit-sanctuary-tranquil-waterfall-torii-gate-4k-live-wallpaper.mp4"
];

// Empty default dataset - no mock cards as requested by user
const INITIAL_NAVIGATOR_DATA = [];

class AnimeNavigator {
  constructor() {
    this.animeList = this.loadState();
    this.currentNav = "Home";
    this.searchQuery = "";
    this.currentWallpaperIndex = parseInt(localStorage.getItem("anime_navigator_wallpaper_idx")) || 0;

    this.initElements();
    this.initVideoBackground();
    this.initEventListeners();
    this.render();
  }

  loadState() {
    const saved = localStorage.getItem("anime_navigator_list_v4");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Failed to parse saved navigator state:", e);
      }
    }
    return [...INITIAL_NAVIGATOR_DATA];
  }

  saveState() {
    localStorage.setItem("anime_navigator_list_v4", JSON.stringify(this.animeList));
    this.updateHeaderBadges();
  }

  initElements() {
    this.animeGrid = document.getElementById("anime-grid");
    this.searchInput = document.getElementById("search-input");
    this.headerNav = document.getElementById("header-nav");
    this.activeListCount = document.getElementById("active-list-count");
    this.bgVideo = document.getElementById("bg-video");
    this.bgVideoSrc = document.getElementById("bg-video-src");

    // Modals
    this.addModal = document.getElementById("add-modal");
    this.editModal = document.getElementById("edit-modal");
  }

  initVideoBackground() {
    if (!this.bgVideo || !this.bgVideoSrc) return;

    // Set active wallpaper source
    const targetSrc = WALLPAPERS[this.currentWallpaperIndex % WALLPAPERS.length];
    if (this.bgVideoSrc.getAttribute("src") !== targetSrc) {
      this.bgVideoSrc.setAttribute("src", targetSrc);
      this.bgVideo.load();
    }

    // Force video playback
    this.bgVideo.play().catch(err => {
      console.log("Auto-play prevented or suspended:", err);
    });
  }

  toggleWallpaper() {
    this.currentWallpaperIndex = (this.currentWallpaperIndex + 1) % WALLPAPERS.length;
    localStorage.setItem("anime_navigator_wallpaper_idx", this.currentWallpaperIndex);

    if (this.bgVideo && this.bgVideoSrc) {
      this.bgVideo.style.opacity = "0.2";
      setTimeout(() => {
        this.bgVideoSrc.setAttribute("src", WALLPAPERS[this.currentWallpaperIndex]);
        this.bgVideo.load();
        this.bgVideo.play().catch(e => console.log(e));
        this.bgVideo.style.opacity = "1";
      }, 250);
    }
  }

  initEventListeners() {
    // Header Nav Tabs
    this.headerNav.addEventListener("click", (e) => {
      const link = e.target.closest(".nav-link");
      if (!link) return;

      document.querySelectorAll(".nav-link").forEach(el => el.classList.remove("active"));
      link.classList.add("active");

      this.currentNav = link.getAttribute("data-nav");
      this.render();
    });

    // Brand Home Link
    document.getElementById("brand-home-btn").addEventListener("click", (e) => {
      e.preventDefault();
      document.querySelectorAll(".nav-link").forEach(el => el.classList.remove("active"));
      document.getElementById("nav-home").classList.add("active");
      this.currentNav = "Home";
      this.render();
    });

    // Wallpaper Switcher Button
    const wallpaperBtn = document.getElementById("toggle-wallpaper-btn");
    if (wallpaperBtn) {
      wallpaperBtn.addEventListener("click", () => this.toggleWallpaper());
    }

    // Search Input
    this.searchInput.addEventListener("input", (e) => {
      this.searchQuery = e.target.value.toLowerCase().trim();
      this.render();
    });

    // Quick Add Modal Buttons
    document.getElementById("open-add-modal-btn").addEventListener("click", () => {
      this.addModal.classList.add("active");
    });

    document.getElementById("close-add-modal").addEventListener("click", () => {
      this.addModal.classList.remove("active");
    });

    document.getElementById("add-anime-form").addEventListener("submit", (e) => {
      e.preventDefault();
      this.handleAddAnime();
    });

    // Edit Modal Buttons
    document.getElementById("close-edit-modal").addEventListener("click", () => {
      this.editModal.classList.remove("active");
    });

    document.getElementById("edit-anime-form").addEventListener("submit", (e) => {
      e.preventDefault();
      this.handleEditSave();
    });

    document.getElementById("delete-anime-btn").addEventListener("click", () => {
      this.handleDelete();
    });
  }

  getFilteredList() {
    return this.animeList.filter(anime => {
      if (this.currentNav !== "Home" && anime.status !== this.currentNav) {
        return false;
      }
      if (this.searchQuery && !anime.title.toLowerCase().includes(this.searchQuery)) {
        return false;
      }
      return true;
    });
  }

  render() {
    const filtered = this.getFilteredList();
    this.updateHeaderBadges();

    this.activeListCount.textContent = `Showing ${filtered.length} Saved Anime`;

    if (filtered.length === 0) {
      this.animeGrid.innerHTML = `
        <div class="empty-state">
          <i class="fa-solid fa-folder-open" style="font-size:2.5rem; color:var(--text-dim); margin-bottom:1rem;"></i>
          <h3>Your Anime List is Empty</h3>
          <p style="color:var(--text-muted); margin-top:0.5rem;">Click "+ Quick Add" in the top header to save your anime links.</p>
        </div>
      `;
      return;
    }

    this.animeGrid.innerHTML = filtered.map(anime => `
      <div class="anime-card" data-id="${anime.id}" data-link="${anime.link}">
        <div class="card-poster-wrap">
          <span class="status-badge" data-status="${anime.status}">${anime.status}</span>
          <button class="btn-edit-item" title="Edit entry" data-id="${anime.id}">
            <i class="fa-solid fa-pen"></i>
          </button>
          <img src="${anime.poster}" alt="${anime.title}" class="card-poster" loading="lazy" onerror="this.onerror=null; this.src='https://images.unsplash.com/photo-1578632767115-351597cf2477?q=80&w=800&auto=format&fit=crop';">
        </div>
        
        <div class="card-body">
          <h3 class="anime-title" title="${anime.title}">${anime.title}</h3>
          <i class="fa-solid fa-arrow-up-right-from-square launch-icon"></i>
        </div>
      </div>
    `).join("");

    this.attachCardEvents();
  }

  attachCardEvents() {
    document.querySelectorAll(".anime-card").forEach(card => {
      const editBtn = card.querySelector(".btn-edit-item");
      if (editBtn) {
        editBtn.addEventListener("click", (e) => {
          e.stopPropagation();
          const id = editBtn.getAttribute("data-id");
          this.openEditModal(id);
        });
      }

      card.addEventListener("click", () => {
        const link = card.getAttribute("data-link");
        if (link) {
          window.open(link, "_blank");
        }
      });
    });
  }

  handleAddAnime() {
    const title = document.getElementById("add-title").value.trim();
    let poster = document.getElementById("add-poster").value.trim();
    const status = document.getElementById("add-status").value;
    const link = document.getElementById("add-link").value.trim();

    if (!poster) {
      poster = "https://images.unsplash.com/photo-1578632767115-351597cf2477?q=80&w=800&auto=format&fit=crop";
    }

    const newAnime = {
      id: "nav-" + Date.now(),
      title,
      poster,
      status,
      link
    };

    this.animeList.unshift(newAnime);
    this.saveState();
    this.render();

    document.getElementById("add-anime-form").reset();
    this.addModal.classList.remove("active");
  }

  openEditModal(id) {
    const anime = this.animeList.find(a => a.id === id);
    if (!anime) return;

    document.getElementById("edit-id").value = anime.id;
    document.getElementById("edit-title").value = anime.title;
    document.getElementById("edit-poster").value = anime.poster;
    document.getElementById("edit-status").value = anime.status;
    document.getElementById("edit-link").value = anime.link;

    this.editModal.classList.add("active");
  }

  handleEditSave() {
    const id = document.getElementById("edit-id").value;
    const anime = this.animeList.find(a => a.id === id);

    if (anime) {
      anime.title = document.getElementById("edit-title").value.trim();
      anime.poster = document.getElementById("edit-poster").value.trim() || anime.poster;
      anime.status = document.getElementById("edit-status").value;
      anime.link = document.getElementById("edit-link").value.trim();

      this.saveState();
      this.render();
    }

    this.editModal.classList.remove("active");
  }

  handleDelete() {
    const id = document.getElementById("edit-id").value;
    if (confirm("Are you sure you want to remove this anime bookmark?")) {
      this.animeList = this.animeList.filter(a => a.id !== id);
      this.saveState();
      this.render();
      this.editModal.classList.remove("active");
    }
  }

  updateHeaderBadges() {
    const counts = {
      Watching: 0,
      "Going to watch": 0,
      "Ongoing-follow-up": 0,
      Completed: 0
    };

    this.animeList.forEach(a => {
      if (counts[a.status] !== undefined) {
        counts[a.status]++;
      }
    });

    document.getElementById("count-watching").textContent = counts["Watching"];
    document.getElementById("count-going").textContent = counts["Going to watch"];
    document.getElementById("count-ongoing").textContent = counts["Ongoing-follow-up"];
    document.getElementById("count-completed").textContent = counts["Completed"];
  }
}

document.addEventListener("DOMContentLoaded", () => {
  window.animeNavigator = new AnimeNavigator();
});
