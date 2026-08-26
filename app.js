/* ==========================================================================
   ANIME VAULT - INTERACTIVE ENGINE & DATA STORE (app.js)
   ========================================================================== */

// HIGH QUALITY ANIME ARTWORK FALLBACK LIST
const FALLBACK_POSTERS = [
  "https://images.unsplash.com/photo-1578632767115-351597cf2477?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1563089145-599997674d42?q=80&w=800&auto=format&fit=crop"
];

// INITIAL MOCK DATASET
const INITIAL_ANIME_DATA = [
  {
    id: "anime-1",
    title: "Solo Leveling",
    status: "Watching",
    genre: "Fantasy",
    rating: 9.4,
    currentEp: 10,
    totalEp: 12,
    studio: "A-1 Pictures",
    poster: "https://images.unsplash.com/photo-1578632767115-351597cf2477?q=80&w=800&auto=format&fit=crop",
    banner: "assets/hero_banner.png",
    synopsis: "In a world where hunters must battle deadly monsters, Sung Jinwoo ascends from the weakest E-rank hunter to the legendary Shadow Monarch.",
    trailerUrl: "https://www.youtube.com/embed/92b2X6j4p_8"
  },
  {
    id: "anime-2",
    title: "Jujutsu Kaisen Season 2",
    status: "Watching",
    genre: "Action",
    rating: 9.2,
    currentEp: 18,
    totalEp: 23,
    studio: "MAPPA",
    poster: "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?q=80&w=800&auto=format&fit=crop",
    banner: "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?q=80&w=1200&auto=format&fit=crop",
    synopsis: "The Shibuya Incident arc unfolds as Gojo Satoru faces an unprecedented trap set by Geto Suguru and curse spirits.",
    trailerUrl: "https://www.youtube.com/embed/pkNE4q5aDCA"
  },
  {
    id: "anime-3",
    title: "Demon Slayer: Hashira Training",
    status: "Watching",
    genre: "Action",
    rating: 9.0,
    currentEp: 6,
    totalEp: 8,
    studio: "ufotable",
    poster: "https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=800&auto=format&fit=crop",
    banner: "https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=1200&auto=format&fit=crop",
    synopsis: "Tanjiro visits Stone Hashira Himejima for intensive training to become a Hashira before the final battle against Muzan.",
    trailerUrl: "https://www.youtube.com/embed/1PjZ3n0cK3k"
  },
  {
    id: "anime-4",
    title: "Frieren: Beyond Journey's End",
    status: "Completed",
    genre: "Fantasy",
    rating: 9.5,
    currentEp: 28,
    totalEp: 28,
    studio: "Madhouse",
    poster: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=800&auto=format&fit=crop",
    banner: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1200&auto=format&fit=crop",
    synopsis: "An elven mage explores the meaning of life, friendship, and human mortality years after defeating the Demon King.",
    trailerUrl: "https://www.youtube.com/embed/qgQunDpx8r0"
  },
  {
    id: "anime-5",
    title: "Chainsaw Man: Reze Arc",
    status: "Going to watch",
    genre: "Action",
    rating: 9.1,
    currentEp: 0,
    totalEp: 1,
    studio: "MAPPA",
    poster: "https://images.unsplash.com/photo-1563089145-599997674d42?q=80&w=800&auto=format&fit=crop",
    banner: "https://images.unsplash.com/photo-1563089145-599997674d42?q=80&w=1200&auto=format&fit=crop",
    synopsis: "Denji encounters Reze at a telephone booth on a rainy day, oblivious to the high-stakes explosive conflict ahead.",
    trailerUrl: "https://www.youtube.com/embed/v4yLeN79z0"
  },
  {
    id: "anime-6",
    title: "Attack on Titan: Final Season",
    status: "Completed",
    genre: "Action",
    rating: 9.6,
    currentEp: 89,
    totalEp: 89,
    studio: "MAPPA / WIT",
    poster: "https://images.unsplash.com/photo-1578632767115-351597cf2477?q=80&w=800&auto=format&fit=crop",
    banner: "assets/hero_banner.png",
    synopsis: "Eren Jaeger initiates the Rumbling to protect Eldia, setting the stage for the climactic battle against his former comrades.",
    trailerUrl: "https://www.youtube.com/embed/M_OauHnAFc8"
  },
  {
    id: "anime-7",
    title: "One Piece: Egghead Arc",
    status: "Ongoing-follow-up",
    genre: "Action",
    rating: 8.9,
    currentEp: 1105,
    totalEp: 1120,
    studio: "Toei Animation",
    poster: "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?q=80&w=800&auto=format&fit=crop",
    banner: "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?q=80&w=1200&auto=format&fit=crop",
    synopsis: "Luffy and the Straw Hat Pirates navigate Egghead Island, encountering Dr. Vegapunk and secrets of the Void Century.",
    trailerUrl: "https://www.youtube.com/embed/AQQlZqWjJAs"
  },
  {
    id: "anime-8",
    title: "Bleach: Thousand-Year Blood War",
    status: "Ongoing-follow-up",
    genre: "Supernatural",
    rating: 9.1,
    currentEp: 26,
    totalEp: 52,
    studio: "Studio Pierrot",
    poster: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=800&auto=format&fit=crop",
    banner: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1200&auto=format&fit=crop",
    synopsis: "The thousand-year battle between Soul Reapers and Quincy forces erupts as Yhwach leads the Wandenreich.",
    trailerUrl: "https://www.youtube.com/embed/78WIYk4y70"
  },
  {
    id: "anime-9",
    title: "Cyberpunk: Edgerunners",
    status: "Completed",
    genre: "Sci-Fi",
    rating: 9.0,
    currentEp: 10,
    totalEp: 10,
    studio: "Studio Trigger",
    poster: "https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=800&auto=format&fit=crop",
    banner: "https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=1200&auto=format&fit=crop",
    synopsis: "A street kid trying to survive in a technology and body modification-obsessed city of the future becomes a mercenary outlaw.",
    trailerUrl: "https://www.youtube.com/embed/JtqIas3bYhg"
  },
  {
    id: "anime-10",
    title: "Kaiju No. 8",
    status: "Going to watch",
    genre: "Sci-Fi",
    rating: 8.7,
    currentEp: 0,
    totalEp: 12,
    studio: "Production I.G",
    poster: "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?q=80&w=800&auto=format&fit=crop",
    banner: "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?q=80&w=1200&auto=format&fit=crop",
    synopsis: "Kafka Hibino gains the ability to transform into a monster after a kaiju enters his body, joining the Defense Force.",
    trailerUrl: "https://www.youtube.com/embed/5aCsyzE3g_0"
  },
  {
    id: "anime-11",
    title: "Steins;Gate",
    status: "Completed",
    genre: "Sci-Fi",
    rating: 9.5,
    currentEp: 24,
    totalEp: 24,
    studio: "White Fox",
    poster: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=800&auto=format&fit=crop",
    banner: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=1200&auto=format&fit=crop",
    synopsis: "Self-proclaimed mad scientist Rintaro Okabe accidentally discovers time travel via a modified microwave.",
    trailerUrl: "https://www.youtube.com/embed/27OZcJjW2Lw"
  },
  {
    id: "anime-12",
    title: "Spy x Family Season 2",
    status: "Going to watch",
    genre: "Slice of Life",
    rating: 8.6,
    currentEp: 0,
    totalEp: 12,
    studio: "CloverWorks",
    poster: "https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=800&auto=format&fit=crop",
    banner: "https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=1200&auto=format&fit=crop",
    synopsis: "Spy Twilight continues Operation Strix alongside his telepathic daughter Anya and assassin wife Yor.",
    trailerUrl: "https://www.youtube.com/embed/_INAsOMsky4"
  }
];

// STATE MANAGEMENT CLASS
class AnimeApp {
  constructor() {
    this.animeList = this.loadState();
    this.currentNav = "Home";
    this.currentGenre = "All";
    this.currentSort = "rating-desc";
    this.searchQuery = "";
    this.viewMode = "grid";
    this.activeAnimeId = null;

    this.initElements();
    this.initCanvas();
    this.initEventListeners();
    this.initTheme();
    this.render();
    this.animateCounters();
  }

  loadState() {
    const saved = localStorage.getItem("anime_vault_list_v2");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Failed to parse saved state:", e);
      }
    }
    return [...INITIAL_ANIME_DATA];
  }

  saveState() {
    localStorage.setItem("anime_vault_list_v2", JSON.stringify(this.animeList));
    this.updateHeaderBadges();
    this.updateStats();
  }

  initElements() {
    this.animeGrid = document.getElementById("anime-grid");
    this.searchInput = document.getElementById("search-input");
    this.genreSelect = document.getElementById("genre-select");
    this.sortSelect = document.getElementById("sort-select");
    this.headerNav = document.getElementById("header-nav");
    this.sectionTitle = document.getElementById("section-header-title");
    this.activeListCount = document.getElementById("active-list-count");

    // Modals
    this.detailModal = document.getElementById("detail-modal");
    this.addModal = document.getElementById("add-modal");
  }

  // INTERACTIVE PARTICLE CANVAS PHYSICS
  initCanvas() {
    const canvas = document.getElementById("anime-canvas");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    window.addEventListener("resize", () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    });

    const particles = [];
    const particleCount = 45;

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 2.5 + 1,
        color: Math.random() > 0.4 ? "#a855f7" : "#06b6d4",
        vx: (Math.random() - 0.5) * 0.4,
        vy: -Math.random() * 0.6 - 0.2,
        alpha: Math.random() * 0.6 + 0.2,
        pulseSpeed: Math.random() * 0.02 + 0.005
      });
    }

    let mouse = { x: -1000, y: -1000 };
    window.addEventListener("mousemove", (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    });

    function draw() {
      ctx.clearRect(0, 0, width, height);

      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;

        p.alpha += Math.sin(Date.now() * p.pulseSpeed) * 0.01;
        if (p.alpha < 0.1) p.alpha = 0.1;
        if (p.alpha > 0.8) p.alpha = 0.8;

        if (p.y < 0) {
          p.y = height;
          p.x = Math.random() * width;
        }
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;

        const dx = mouse.x - p.x;
        const dy = mouse.y - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          p.x -= (dx / dist) * 1.5;
          p.y -= (dy / dist) * 1.5;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;
        ctx.shadowBlur = 10;
        ctx.shadowColor = p.color;
        ctx.fill();
        ctx.globalAlpha = 1;
      });

      requestAnimationFrame(draw);
    }

    draw();
  }

  initEventListeners() {
    // Header Navigation Tabs
    this.headerNav.addEventListener("click", (e) => {
      const link = e.target.closest(".nav-link");
      if (!link) return;
      
      document.querySelectorAll(".nav-link").forEach(el => el.classList.remove("active"));
      link.classList.add("active");

      this.currentNav = link.getAttribute("data-nav");
      this.render();
    });

    // Brand logo home link
    document.getElementById("brand-home-btn").addEventListener("click", (e) => {
      e.preventDefault();
      document.querySelectorAll(".nav-link").forEach(el => el.classList.remove("active"));
      document.getElementById("nav-home").classList.add("active");
      this.currentNav = "Home";
      this.render();
    });

    // Search Input
    this.searchInput.addEventListener("input", (e) => {
      this.searchQuery = e.target.value.toLowerCase().trim();
      this.render();
    });

    // Genre Selector
    this.genreSelect.addEventListener("change", (e) => {
      this.currentGenre = e.target.value;
      this.render();
    });

    // Sort Selector
    this.sortSelect.addEventListener("change", (e) => {
      this.currentSort = e.target.value;
      this.render();
    });

    // View Mode Toggle
    document.getElementById("view-grid-btn").addEventListener("click", () => {
      this.viewMode = "grid";
      document.getElementById("view-grid-btn").classList.add("active");
      document.getElementById("view-list-btn").classList.remove("active");
      this.animeGrid.classList.remove("list-view");
    });

    document.getElementById("view-list-btn").addEventListener("click", () => {
      this.viewMode = "list";
      document.getElementById("view-list-btn").classList.add("active");
      document.getElementById("view-grid-btn").classList.remove("active");
      this.animeGrid.classList.add("list-view");
    });

    // Theme Switcher Buttons
    document.querySelectorAll(".theme-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        const theme = btn.getAttribute("data-set-theme");
        document.body.setAttribute("data-theme", theme);
        document.querySelectorAll(".theme-btn").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        localStorage.setItem("anime_vault_theme", theme);
      });
    });

    // Add Anime Modal
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

    // Detail Modal Close
    document.getElementById("close-detail-modal").addEventListener("click", () => {
      this.detailModal.classList.remove("active");
      document.getElementById("detail-trailer-container").innerHTML = "";
    });

    // Detail Modal Input Updates
    document.getElementById("detail-status-select").addEventListener("change", (e) => {
      if (!this.activeAnimeId) return;
      const anime = this.animeList.find(a => a.id === this.activeAnimeId);
      if (anime) {
        anime.status = e.target.value;
        this.saveState();
        this.render();
      }
    });

    document.getElementById("detail-ep-input").addEventListener("change", (e) => {
      if (!this.activeAnimeId) return;
      const anime = this.animeList.find(a => a.id === this.activeAnimeId);
      if (anime) {
        let val = parseInt(e.target.value) || 0;
        val = Math.max(0, Math.min(anime.totalEp, val));
        anime.currentEp = val;
        if (anime.currentEp === anime.totalEp) {
          anime.status = "Completed";
          document.getElementById("detail-status-select").value = "Completed";
        }
        this.saveState();
        this.render();
      }
    });

    // Hero Section Buttons
    document.getElementById("hero-trailer-btn").addEventListener("click", () => {
      this.openDetailModal(this.animeList[0]);
    });

    document.getElementById("hero-details-btn").addEventListener("click", () => {
      this.openDetailModal(this.animeList[0]);
    });
  }

  initTheme() {
    const savedTheme = localStorage.getItem("anime_vault_theme");
    if (savedTheme) {
      document.body.setAttribute("data-theme", savedTheme);
      document.querySelectorAll(".theme-btn").forEach(b => {
        b.classList.toggle("active", b.getAttribute("data-set-theme") === savedTheme);
      });
    }
  }

  getFilteredList() {
    return this.animeList.filter(anime => {
      if (this.currentNav !== "Home" && anime.status !== this.currentNav) {
        return false;
      }
      if (this.currentGenre !== "All" && anime.genre !== this.currentGenre) {
        return false;
      }
      if (this.searchQuery) {
        const matchesTitle = anime.title.toLowerCase().includes(this.searchQuery);
        const matchesStudio = anime.studio && anime.studio.toLowerCase().includes(this.searchQuery);
        const matchesGenre = anime.genre.toLowerCase().includes(this.searchQuery);
        if (!matchesTitle && !matchesStudio && !matchesGenre) return false;
      }
      return true;
    }).sort((a, b) => {
      if (this.currentSort === "rating-desc") return b.rating - a.rating;
      if (this.currentSort === "title-asc") return a.title.localeCompare(b.title);
      if (this.currentSort === "progress-desc") return (b.currentEp / b.totalEp) - (a.currentEp / a.totalEp);
      if (this.currentSort === "episodes-desc") return b.totalEp - a.totalEp;
      return 0;
    });
  }

  render() {
    const filtered = this.getFilteredList();
    this.updateHeaderBadges();
    this.updateStats();

    this.sectionTitle.textContent = this.currentNav === "Home" ? "My Anime Library" : `${this.currentNav} Anime`;
    this.activeListCount.textContent = `Showing ${filtered.length} of ${this.animeList.length} Titles`;

    if (filtered.length === 0) {
      this.animeGrid.innerHTML = `
        <div class="empty-state">
          <i class="fa-solid fa-ghost empty-icon"></i>
          <h3>No Anime Found</h3>
          <p style="color:var(--text-muted); margin-top:0.5rem;">Try adjusting your search query or header tab filter.</p>
        </div>
      `;
      return;
    }

    this.animeGrid.innerHTML = filtered.map((anime, idx) => {
      const progressPercent = Math.round((anime.currentEp / anime.totalEp) * 100);
      const fallbackUrl = FALLBACK_POSTERS[idx % FALLBACK_POSTERS.length];
      return `
        <div class="anime-card" data-id="${anime.id}">
          <div class="card-poster-wrap">
            <span class="status-badge" data-status="${anime.status}">${anime.status}</span>
            <span class="rating-badge"><i class="fa-solid fa-star"></i> ${anime.rating}</span>
            <img src="${anime.poster}" alt="${anime.title}" class="card-poster" loading="lazy" onerror="this.onerror=null; this.src='${fallbackUrl}';">
            <div class="card-overlay">
              <button class="overlay-btn view-details-btn"><i class="fa-solid fa-eye"></i> View Details</button>
            </div>
          </div>
          
          <div class="card-body">
            <div>
              <h3 class="anime-title" title="${anime.title}">${anime.title}</h3>
              <div class="anime-meta">
                <span><i class="fa-solid fa-film"></i> ${anime.genre}</span>
                <span><i class="fa-solid fa-tv"></i> ${anime.studio}</span>
              </div>
            </div>

            <div class="episode-tracker">
              <div class="tracker-header">
                <span>Progress: ${anime.currentEp} / ${anime.totalEp} EP</span>
                <button class="ep-btn-plus" title="Increment watched episode" data-id="${anime.id}">+</button>
              </div>
              <div class="progress-bar-bg">
                <div class="progress-bar-fill" style="width: ${progressPercent}%;"></div>
              </div>
            </div>
          </div>
        </div>
      `;
    }).join("");

    this.attachCardEventListeners();
  }

  attachCardEventListeners() {
    // 3D Card Hover Tilt
    document.querySelectorAll(".anime-card").forEach(card => {
      card.addEventListener("mousemove", (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        const tiltX = (y / rect.height) * -12;
        const tiltY = (x / rect.width) * 12;
        card.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) translateY(-8px) scale(1.02)`;
      });

      card.addEventListener("mouseleave", () => {
        card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0) scale(1)`;
      });

      card.addEventListener("click", (e) => {
        if (e.target.closest(".ep-btn-plus")) return;
        const id = card.getAttribute("data-id");
        const anime = this.animeList.find(a => a.id === id);
        if (anime) this.openDetailModal(anime);
      });
    });

    // Episode Increment + Button
    document.querySelectorAll(".ep-btn-plus").forEach(btn => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        const id = btn.getAttribute("data-id");
        const anime = this.animeList.find(a => a.id === id);
        if (anime && anime.currentEp < anime.totalEp) {
          anime.currentEp += 1;
          if (anime.currentEp === anime.totalEp) {
            anime.status = "Completed";
          }
          this.saveState();
          this.render();
        }
      });
    });
  }

  openDetailModal(anime) {
    this.activeAnimeId = anime.id;
    const bannerImg = document.getElementById("detail-banner-img");
    const posterImg = document.getElementById("detail-poster-img");

    bannerImg.src = anime.banner || anime.poster;
    bannerImg.onerror = () => { bannerImg.src = "assets/hero_banner.png"; };
    
    posterImg.src = anime.poster;
    posterImg.onerror = () => { posterImg.src = "https://images.unsplash.com/photo-1578632767115-351597cf2477?q=80&w=800&auto=format&fit=crop"; };

    document.getElementById("detail-title").textContent = anime.title;
    document.getElementById("detail-synopsis").textContent = anime.synopsis;
    document.getElementById("detail-status-select").value = anime.status;
    document.getElementById("detail-ep-input").value = anime.currentEp;
    document.getElementById("detail-ep-total").textContent = `/ ${anime.totalEp}`;

    const statusBadge = document.getElementById("detail-status-badge");
    statusBadge.textContent = anime.status;
    statusBadge.setAttribute("data-status", anime.status);

    document.getElementById("detail-genres").innerHTML = `
      <span class="genre-tag"><i class="fa-solid fa-tag"></i> ${anime.genre}</span>
      <span class="genre-tag"><i class="fa-solid fa-building"></i> ${anime.studio}</span>
      <span class="genre-tag" style="color:#fde047;"><i class="fa-solid fa-star"></i> ${anime.rating} / 10</span>
    `;

    const trailerContainer = document.getElementById("detail-trailer-container");
    if (anime.trailerUrl) {
      trailerContainer.innerHTML = `<iframe src="${anime.trailerUrl}?autoplay=0" allowfullscreen></iframe>`;
    } else {
      trailerContainer.innerHTML = `<div style="padding:2rem; text-align:center; color:var(--text-dim);">No trailer video available</div>`;
    }

    this.detailModal.classList.add("active");
  }

  handleAddAnime() {
    const title = document.getElementById("add-title").value.trim();
    const status = document.getElementById("add-status").value;
    const genre = document.getElementById("add-genre").value;
    const currentEp = parseInt(document.getElementById("add-progress").value) || 0;
    const totalEp = parseInt(document.getElementById("add-total-ep").value) || 12;
    const rating = parseFloat(document.getElementById("add-rating").value) || 8.5;
    let poster = document.getElementById("add-poster").value.trim();
    const synopsis = document.getElementById("add-synopsis").value.trim() || "No synopsis provided.";

    if (!poster) {
      poster = "https://images.unsplash.com/photo-1578632767115-351597cf2477?q=80&w=800&auto=format&fit=crop";
    }

    const newAnime = {
      id: "anime-" + Date.now(),
      title,
      status,
      genre,
      rating,
      currentEp: Math.min(currentEp, totalEp),
      totalEp,
      studio: "Custom Entry",
      poster,
      banner: poster,
      synopsis,
      trailerUrl: ""
    };

    this.animeList.unshift(newAnime);
    this.saveState();
    this.render();

    document.getElementById("add-anime-form").reset();
    this.addModal.classList.remove("active");
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

  updateStats() {
    const totalTitles = this.animeList.length;
    const totalEpisodes = this.animeList.reduce((acc, curr) => acc + curr.currentEp, 0);
    const totalHours = Math.round((totalEpisodes * 24) / 60);
    const avgScore = (this.animeList.reduce((acc, curr) => acc + curr.rating, 0) / (totalTitles || 1)).toFixed(1);

    document.getElementById("stat-total").textContent = totalTitles;
    document.getElementById("stat-episodes").textContent = totalEpisodes;
    document.getElementById("stat-hours").textContent = `${totalHours}h`;
    document.getElementById("stat-score").textContent = avgScore;
  }

  animateCounters() {
    const statElements = [
      { id: "stat-total", target: this.animeList.length },
      { id: "stat-episodes", target: this.animeList.reduce((acc, curr) => acc + curr.currentEp, 0) }
    ];

    statElements.forEach(item => {
      const el = document.getElementById(item.id);
      if (!el) return;
      let start = 0;
      const duration = 1000;
      const stepTime = 30;
      const steps = duration / stepTime;
      const increment = item.target / steps;

      const timer = setInterval(() => {
        start += increment;
        if (start >= item.target) {
          el.textContent = item.target;
          clearInterval(timer);
        } else {
          el.textContent = Math.floor(start);
        }
      }, stepTime);
    });
  }
}

document.addEventListener("DOMContentLoaded", () => {
  window.animeApp = new AnimeApp();
});
