/* ==========================================================================
   ANIME NAVIGATOR - SECURITY HARDENED LOGIC & ENGINE (app.js)
   ========================================================================== */

// CONSTANTS & ALLOWED SCHEMES
const STORAGE_KEY = "anime_navigator_list_v4";
const WALLPAPER_KEY = "anime_navigator_wallpaper_idx";
const MAX_TITLE_LEN = 150;
const MAX_URL_LEN = 2048;
const MAX_WATCHLIST_LIMIT = 500;

const ALLOWED_CATEGORIES = ["Watching", "Going to watch", "Ongoing-follow-up", "Completed"];

const DEFAULT_POSTER = "https://images.unsplash.com/photo-1578632767115-351597cf2477?q=80&w=800&auto=format&fit=crop";

const WALLPAPERS = [
  "assets/samurai-katana-in-forest-cinematic-4k-live-wallpaper.mp4",
  "assets/samurai-sun-live-wallpaper.mp4",
  "assets/fallen-angel-in-the-ruins-live-wallpaper.mp4",
  "assets/moonlit-sanctuary-tranquil-waterfall-torii-gate-4k-live-wallpaper.mp4"
];

// CENTRALIZED SECURE HTTPS URL PARSER
function isSafeHttpsUrl(value) {
  if (!value || typeof value !== "string") return false;
  const trimmed = value.trim();
  if (trimmed.length === 0 || trimmed.length > MAX_URL_LEN) return false;

  try {
    const parsed = new URL(trimmed);
    return parsed.protocol === "https:" && parsed.hostname.length > 0;
  } catch (e) {
    return false;
  }
}

// SAFE UUID GENERATOR
function generateSafeId() {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return "nav-" + Date.now() + "-" + Math.random().toString(36).substring(2, 9);
}

// STRICT SCHEMA VALIDATOR FOR LOCALSTORAGE DATA
function validateAnimeItem(item) {
  if (!item || typeof item !== "object") return null;

  const title = typeof item.title === "string" ? item.title.trim() : "";
  const poster = typeof item.poster === "string" ? item.poster.trim() : "";
  const status = typeof item.status === "string" ? item.status.trim() : "";
  const link = typeof item.link === "string" ? item.link.trim() : "";
  const id = typeof item.id === "string" && item.id.length > 0 ? item.id : generateSafeId();

  if (!title || title.length > MAX_TITLE_LEN) return null;
  if (!ALLOWED_CATEGORIES.includes(status)) return null;
  if (!isSafeHttpsUrl(link)) return null;

  const safePoster = isSafeHttpsUrl(poster) ? poster : DEFAULT_POSTER;

  return { id, title, poster: safePoster, status, link };
}

// ANIME NAVIGATOR MAIN APPLICATION CLASS
class AnimeNavigator {
  constructor() {
    this.animeList = this.loadState();
    this.currentNav = "Home";
    this.searchQuery = "";
    this.currentWallpaperIndex = this.loadWallpaperIndex();

    this.initElements();
    this.initVideoBackground();
    this.initEventListeners();
    this.render();
  }

  loadState() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return [];
      
      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed)) return [];

      const sanitized = [];
      for (const item of parsed) {
        const valid = validateAnimeItem(item);
        if (valid) sanitized.push(valid);
      }
      return sanitized;
    } catch (e) {
      console.error("Failed to load or parse localStorage data:", e);
      return [];
    }
  }

  saveState() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.animeList));
    } catch (e) {
      if (e.name === "QuotaExceededError") {
        alert("Browser storage limit reached. Please remove some bookmarks.");
      } else {
        console.error("Failed to save state to localStorage:", e);
      }
    }
    this.updateHeaderBadges();
  }

  loadWallpaperIndex() {
    try {
      const val = localStorage.getItem(WALLPAPER_KEY);
      const parsed = parseInt(val, 10);
      return isNaN(parsed) || parsed < 0 ? 0 : parsed % WALLPAPERS.length;
    } catch (e) {
      return 0;
    }
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
    this.privacyModal = document.getElementById("privacy-modal");
    this.termsModal = document.getElementById("terms-modal");

    // Error message containers
    this.addErrorMsg = document.getElementById("add-error-msg");
    this.editErrorMsg = document.getElementById("edit-error-msg");
  }

  initVideoBackground() {
    if (!this.bgVideo || !this.bgVideoSrc) return;

    const targetSrc = WALLPAPERS[this.currentWallpaperIndex % WALLPAPERS.length];
    if (this.bgVideoSrc.getAttribute("src") !== targetSrc) {
      this.bgVideoSrc.setAttribute("src", targetSrc);
      this.bgVideo.load();
    }

    this.bgVideo.play().catch(err => {
      // Auto-play muted handling
    });
  }

  toggleWallpaper() {
    this.currentWallpaperIndex = (this.currentWallpaperIndex + 1) % WALLPAPERS.length;
    try {
      localStorage.setItem(WALLPAPER_KEY, this.currentWallpaperIndex.toString());
    } catch (e) {
      // Ignore storage write failure
    }

    if (this.bgVideo && this.bgVideoSrc) {
      this.bgVideo.style.opacity = "0.2";
      setTimeout(() => {
        this.bgVideoSrc.setAttribute("src", WALLPAPERS[this.currentWallpaperIndex]);
        this.bgVideo.load();
        this.bgVideo.play().catch(() => {});
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

      const navAttr = link.getAttribute("data-nav");
      this.currentNav = ALLOWED_CATEGORIES.includes(navAttr) ? navAttr : "Home";
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

    // Wallpaper Button
    const wallpaperBtn = document.getElementById("toggle-wallpaper-btn");
    if (wallpaperBtn) {
      wallpaperBtn.addEventListener("click", () => this.toggleWallpaper());
    }

    // Search Input
    this.searchInput.addEventListener("input", (e) => {
      this.searchQuery = e.target.value.toLowerCase().trim().slice(0, MAX_TITLE_LEN);
      this.render();
    });

    // Quick Add Modal Buttons
    document.getElementById("open-add-modal-btn").addEventListener("click", () => {
      this.clearError(this.addErrorMsg);
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

    // Privacy & Terms Modals
    const privacyBtn = document.getElementById("open-privacy-modal-btn");
    if (privacyBtn) {
      privacyBtn.addEventListener("click", () => this.privacyModal.classList.add("active"));
    }
    document.getElementById("close-privacy-modal").addEventListener("click", () => {
      this.privacyModal.classList.remove("active");
    });

    const termsBtn = document.getElementById("open-terms-modal-btn");
    if (termsBtn) {
      termsBtn.addEventListener("click", () => this.termsModal.classList.add("active"));
    }
    document.getElementById("close-terms-modal").addEventListener("click", () => {
      this.termsModal.classList.remove("active");
    });

    // Close modals on backdrop click
    [this.addModal, this.editModal, this.privacyModal, this.termsModal].forEach(modal => {
      if (!modal) return;
      modal.addEventListener("click", (e) => {
        if (e.target === modal) modal.classList.remove("active");
      });
    });
  }

  showError(container, msg) {
    if (!container) return;
    container.textContent = msg;
    container.style.display = "flex";
  }

  clearError(container) {
    if (!container) return;
    container.textContent = "";
    container.style.display = "none";
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

  // DEFENSIVE DOM CONSTRUCTION (XSS PREVENTION)
  render() {
    const filtered = this.getFilteredList();
    this.updateHeaderBadges();

    this.activeListCount.textContent = `Showing ${filtered.length} Saved Anime`;
    this.animeGrid.innerHTML = "";

    if (filtered.length === 0) {
      const emptyDiv = document.createElement("div");
      emptyDiv.className = "empty-state";

      const icon = document.createElement("i");
      icon.className = "fa-solid fa-folder-open";
      icon.style.cssText = "font-size:2.5rem; color:var(--text-dim); margin-bottom:1rem;";

      const h3 = document.createElement("h3");
      h3.textContent = "Your Anime List is Empty";

      const p = document.createElement("p");
      p.style.cssText = "color:var(--text-muted); margin-top:0.5rem;";
      p.textContent = 'Click "+ Quick Add" in the top header to save your anime links.';

      emptyDiv.appendChild(icon);
      emptyDiv.appendChild(h3);
      emptyDiv.appendChild(p);

      this.animeGrid.appendChild(emptyDiv);
      return;
    }

    filtered.forEach(anime => {
      const card = document.createElement("div");
      card.className = "anime-card";
      card.setAttribute("data-id", anime.id);

      const posterWrap = document.createElement("div");
      posterWrap.className = "card-poster-wrap";

      const badge = document.createElement("span");
      badge.className = "status-badge";
      badge.setAttribute("data-status", anime.status);
      badge.textContent = anime.status;

      const editBtn = document.createElement("button");
      editBtn.className = "btn-edit-item";
      editBtn.title = "Edit entry";
      editBtn.setAttribute("aria-label", `Edit ${anime.title}`);

      const editIcon = document.createElement("i");
      editIcon.className = "fa-solid fa-pen";
      editBtn.appendChild(editIcon);

      const img = document.createElement("img");
      img.className = "card-poster";
      img.src = anime.poster;
      img.alt = anime.title;
      img.loading = "lazy";
      img.setAttribute("referrerpolicy", "no-referrer");
      img.onerror = () => { img.src = DEFAULT_POSTER; };

      posterWrap.appendChild(badge);
      posterWrap.appendChild(editBtn);
      posterWrap.appendChild(img);

      const body = document.createElement("div");
      body.className = "card-body";

      const h3 = document.createElement("h3");
      h3.className = "anime-title";
      h3.textContent = anime.title;
      h3.title = anime.title;

      const launchIcon = document.createElement("i");
      launchIcon.className = "fa-solid fa-arrow-up-right-from-square launch-icon";

      body.appendChild(h3);
      body.appendChild(launchIcon);

      card.appendChild(posterWrap);
      card.appendChild(body);

      // Edit Button Action
      editBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        this.openEditModal(anime.id);
      });

      // Card Click Safe Window Launch
      card.addEventListener("click", () => {
        if (isSafeHttpsUrl(anime.link)) {
          window.open(anime.link, "_blank", "noopener,noreferrer");
        } else {
          alert("Unable to open link. Please edit the bookmark and verify the URL.");
        }
      });

      this.animeGrid.appendChild(card);
    });
  }

  handleAddAnime() {
    this.clearError(this.addErrorMsg);

    if (this.animeList.length >= MAX_WATCHLIST_LIMIT) {
      this.showError(this.addErrorMsg, `Watchlist limit reached (${MAX_WATCHLIST_LIMIT} entries maximum).`);
      return;
    }

    const title = document.getElementById("add-title").value.trim().slice(0, MAX_TITLE_LEN);
    let poster = document.getElementById("add-poster").value.trim().slice(0, MAX_URL_LEN);
    const status = document.getElementById("add-status").value;
    const link = document.getElementById("add-link").value.trim().slice(0, MAX_URL_LEN);

    if (!title) {
      this.showError(this.addErrorMsg, "Anime title is required.");
      return;
    }

    if (!ALLOWED_CATEGORIES.includes(status)) {
      this.showError(this.addErrorMsg, "Invalid category selected.");
      return;
    }

    if (!isSafeHttpsUrl(link)) {
      this.showError(this.addErrorMsg, "Invalid watch link. Only secure HTTPS URLs are allowed.");
      return;
    }

    if (poster.length > 0 && !isSafeHttpsUrl(poster)) {
      this.showError(this.addErrorMsg, "Invalid poster image URL. Only secure HTTPS image URLs are allowed.");
      return;
    }

    if (!poster) {
      poster = DEFAULT_POSTER;
    }

    // Duplicate Check
    const duplicate = this.animeList.find(a => a.title.toLowerCase() === title.toLowerCase() && a.link === link);
    if (duplicate) {
      this.showError(this.addErrorMsg, "This anime bookmark already exists in your list.");
      return;
    }

    const newAnime = {
      id: generateSafeId(),
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
    this.clearError(this.editErrorMsg);
    const anime = this.animeList.find(a => a.id === id);
    if (!anime) return;

    document.getElementById("edit-id").value = anime.id;
    document.getElementById("edit-title").value = anime.title;
    document.getElementById("edit-poster").value = anime.poster === DEFAULT_POSTER ? "" : anime.poster;
    document.getElementById("edit-status").value = anime.status;
    document.getElementById("edit-link").value = anime.link;

    this.editModal.classList.add("active");
  }

  handleEditSave() {
    this.clearError(this.editErrorMsg);
    const id = document.getElementById("edit-id").value;
    const anime = this.animeList.find(a => a.id === id);

    if (!anime) return;

    const title = document.getElementById("edit-title").value.trim().slice(0, MAX_TITLE_LEN);
    let poster = document.getElementById("edit-poster").value.trim().slice(0, MAX_URL_LEN);
    const status = document.getElementById("edit-status").value;
    const link = document.getElementById("edit-link").value.trim().slice(0, MAX_URL_LEN);

    if (!title) {
      this.showError(this.editErrorMsg, "Anime title is required.");
      return;
    }

    if (!ALLOWED_CATEGORIES.includes(status)) {
      this.showError(this.editErrorMsg, "Invalid category selected.");
      return;
    }

    if (!isSafeHttpsUrl(link)) {
      this.showError(this.editErrorMsg, "Invalid watch link. Only secure HTTPS URLs are allowed.");
      return;
    }

    if (poster.length > 0 && !isSafeHttpsUrl(poster)) {
      this.showError(this.editErrorMsg, "Invalid poster image URL. Only secure HTTPS image URLs are allowed.");
      return;
    }

    anime.title = title;
    anime.poster = poster ? poster : DEFAULT_POSTER;
    anime.status = status;
    anime.link = link;

    this.saveState();
    this.render();

    this.editModal.classList.remove("active");
  }

  handleDelete() {
    const id = document.getElementById("edit-id").value;
    const anime = this.animeList.find(a => a.id === id);

    if (anime && confirm(`Are you sure you want to remove "${anime.title}" from your watchlist?`)) {
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

    document.getElementById("count-watching").textContent = counts["Watching"].toString();
    document.getElementById("count-going").textContent = counts["Going to watch"].toString();
    document.getElementById("count-ongoing").textContent = counts["Ongoing-follow-up"].toString();
    document.getElementById("count-completed").textContent = counts["Completed"].toString();
  }
}

document.addEventListener("DOMContentLoaded", () => {
  window.animeNavigator = new AnimeNavigator();
});
