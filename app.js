/* ==========================================================================
   ANIME NAVIGATOR - PROGRESSIVE WEB APP & PERFORMANCE ENGINE (app.js)
   Features: PWA Service Worker Registration, Offline State, App Install Flow,
             JSON Backup/Restore, Reactive Categories, Defensive Validation
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
  "assets/Screenshot 2026-08-28 210335.png",
  "assets/Screenshot 2026-08-28 210417.png",
  "assets/Screenshot 2026-08-28 210444.png"
];

const DEFAULT_ANIME_LIST = [
  {
    id: "nav-demo-1",
    title: "Solo Leveling",
    poster: "https://images.unsplash.com/photo-1578632767115-351597cf2477?q=80&w=800&auto=format&fit=crop",
    status: "Watching",
    link: "https://hianime.to/watch/solo-leveling-18718"
  },
  {
    id: "nav-demo-2",
    title: "Jujutsu Kaisen",
    poster: "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?q=80&w=800&auto=format&fit=crop",
    status: "Watching",
    link: "https://hianime.to/watch/jujutsu-kaisen-534"
  },
  {
    id: "nav-demo-3",
    title: "Demon Slayer",
    poster: "https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=800&auto=format&fit=crop",
    status: "Going to watch",
    link: "https://hianime.to/watch/demon-slayer-kimetsu-no-yaiba-47"
  },
  {
    id: "nav-demo-4",
    title: "Attack on Titan",
    poster: "https://images.unsplash.com/photo-1563089145-599997674d42?q=80&w=800&auto=format&fit=crop",
    status: "Completed",
    link: "https://hianime.to/watch/attack-on-titan-112"
  }
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

    this.deferredPrompt = null;
    this.swRegistration = null;
    this.toastTimer = null;

    this.initElements();
    this.initWallpaperBackground();
    this.initPWA();
    this.handleInitialQueryParams();
    this.initEventListeners();
    this.render();
  }

  loadState() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_ANIME_LIST));
        return DEFAULT_ANIME_LIST;
      }

      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed) || parsed.length === 0) {
        return [];
      }

      const sanitized = [];
      for (const item of parsed) {
        const valid = validateAnimeItem(item);
        if (valid) sanitized.push(valid);
      }
      return sanitized;
    } catch (e) {
      console.error("Failed to load or parse localStorage data:", e);
      return DEFAULT_ANIME_LIST;
    }
  }

  saveState() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.animeList));
    } catch (e) {
      if (e.name === "QuotaExceededError") {
        alert("Browser storage limit reached. Please remove some bookmarks or export a backup.");
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
    this.bgWallpaper = document.getElementById("bg-wallpaper");

    // Modals
    this.addModal = document.getElementById("add-modal");
    this.editModal = document.getElementById("edit-modal");
    this.backupModal = document.getElementById("backup-modal");
    this.privacyModal = document.getElementById("privacy-modal");
    this.termsModal = document.getElementById("terms-modal");
    this.guideModal = document.getElementById("guide-modal");
    this.openGuideModalBtn = document.getElementById("open-guide-modal-btn");

    // Form Feedback Elements
    this.addErrorMsg = document.getElementById("add-error-msg");
    this.editErrorMsg = document.getElementById("edit-error-msg");
    this.backupErrorMsg = document.getElementById("backup-error-msg");
    this.backupSuccessMsg = document.getElementById("backup-success-msg");

    // PWA & Connection Elements
    this.installPwaBtn = document.getElementById("install-pwa-btn");
    this.installPwaFooterBtn = document.getElementById("install-pwa-footer-btn");
    this.homeInstallBanner = document.getElementById("home-install-banner");
    this.homeInstallActionBtn = document.getElementById("home-install-action-btn");
    this.homeDismissBannerBtn = document.getElementById("home-dismiss-banner-btn");

    this.installGuideModal = document.getElementById("install-guide-modal");
    this.installGuideBody = document.getElementById("install-guide-body");
    this.installModalActionBtn = document.getElementById("install-modal-action-btn");
    this.closeInstallGuideBtn = document.getElementById("close-install-guide-btn");
    this.closeInstallGuideModal = document.getElementById("close-install-guide-modal");

    this.connPill = document.getElementById("connection-status-pill");
    this.connStatusText = document.getElementById("connection-status-text");
    this.pwaToast = document.getElementById("pwa-update-toast");
    this.pwaStatusToast = document.getElementById("pwa-status-toast");
    this.pwaStorageEstimate = document.getElementById("pwa-storage-estimate");
    this.pwaTotalCount = document.getElementById("pwa-total-count");
    this.importJsonInput = document.getElementById("import-json-input");
  }

  initWallpaperBackground() {
    if (!this.bgWallpaper) return;
    const targetSrc = WALLPAPERS[this.currentWallpaperIndex % WALLPAPERS.length];
    this.bgWallpaper.style.backgroundImage = `url("${encodeURI(targetSrc)}")`;
  }

  toggleWallpaper() {
    this.currentWallpaperIndex = (this.currentWallpaperIndex + 1) % WALLPAPERS.length;
    try {
      localStorage.setItem(WALLPAPER_KEY, this.currentWallpaperIndex.toString());
    } catch (e) { }

    if (this.bgWallpaper) {
      this.bgWallpaper.style.opacity = "0.3";
      setTimeout(() => {
        const nextWallpaper = WALLPAPERS[this.currentWallpaperIndex % WALLPAPERS.length];
        this.bgWallpaper.style.backgroundImage = `url("${encodeURI(nextWallpaper)}")`;
        this.bgWallpaper.style.opacity = "1";
      }, 200);
    }
  }

  // CHECK IF APP IS INSTALLED
  isAppInstalled() {
    // 1. Standard display-mode check (Chrome, Edge, Android PWA)
    const isStandalone = window.matchMedia && window.matchMedia("(display-mode: standalone)").matches;
    // 2. iOS Safari standalone check
    const isIosStandalone = window.navigator.standalone === true;
    // 3. Android WebAPK / TWA referrer
    const isTwa = document.referrer && document.referrer.includes("android-app://");
    // 4. Stored user state if previously installed in this browser
    const isStoredInstalled = localStorage.getItem("anime_navigator_is_installed") === "true";

    return Boolean(isStandalone || isIosStandalone || isTwa || isStoredInstalled);
  }

  // UPDATE VISIBILITY OF INSTALL BUTTONS & HOME BANNER
  updateInstallUiState() {
    const installed = this.isAppInstalled();

    if (installed) {
      if (this.homeInstallBanner) this.homeInstallBanner.style.display = "none";
      if (this.installPwaBtn) this.installPwaBtn.style.display = "none";
      if (this.installPwaFooterBtn) this.installPwaFooterBtn.style.display = "none";
      return;
    }

    // Website is not yet installed:
    // Header & footer install buttons are always visible until installed
    if (this.installPwaBtn) this.installPwaBtn.style.display = "inline-flex";
    if (this.installPwaFooterBtn) this.installPwaFooterBtn.style.display = "inline-flex";

    // Show Home Install Banner only on Home tab (if not dismissed for this session)
    const isHomeTab = this.currentNav === "Home";
    const isDismissed = sessionStorage.getItem("pwa_banner_dismissed") === "true";

    if (this.homeInstallBanner) {
      this.homeInstallBanner.style.display = (isHomeTab && !isDismissed) ? "flex" : "none";
    }
  }

  // PROGRESSIVE WEB APP (PWA) INITIALIZATION
  initPWA() {
    // 1. Register Service Worker with Auto Update Detection
    if ("serviceWorker" in navigator) {
      window.addEventListener("load", () => {
        navigator.serviceWorker.register("./sw.js")
          .then((reg) => {
            this.swRegistration = reg;
            console.log("[PWA] Service Worker registered with scope:", reg.scope);

            if (reg.waiting) {
              this.showUpdateToast(reg.waiting);
            }

            reg.addEventListener("updatefound", () => {
              const newWorker = reg.installing;
              if (!newWorker) return;

              newWorker.addEventListener("statechange", () => {
                if (newWorker.state === "installed" && navigator.serviceWorker.controller) {
                  this.showUpdateToast(newWorker);
                }
              });
            });
          })
          .catch((err) => {
            console.warn("[PWA] Service Worker registration failed:", err);
          });

        let refreshing = false;
        navigator.serviceWorker.addEventListener("controllerchange", () => {
          if (!refreshing) {
            refreshing = true;
            window.location.reload();
          }
        });
      });
    }

    // 2. Install Prompt Listener (beforeinstallprompt)
    window.addEventListener("beforeinstallprompt", (e) => {
      e.preventDefault();
      this.deferredPrompt = e;
      this.updateInstallUiState();
    });

    // 3. App Installed Listener
    window.addEventListener("appinstalled", () => {
      localStorage.setItem("anime_navigator_is_installed", "true");
      this.deferredPrompt = null;
      this.updateInstallUiState();
      if (this.installGuideModal) this.installGuideModal.classList.remove("active");
      this.showStatusToast("🎉 Anime Navigator successfully installed!");
    });

    // 4. Standalone Display Mode Change Listener
    try {
      window.matchMedia("(display-mode: standalone)").addEventListener("change", (e) => {
        if (e.matches) {
          localStorage.setItem("anime_navigator_is_installed", "true");
        }
        this.updateInstallUiState();
      });
    } catch (e) { }

    // 5. Initial Install UI Setup
    this.updateInstallUiState();

    // 6. Online / Offline Monitoring
    this.updateOnlineStatus();
    window.addEventListener("online", () => {
      this.updateOnlineStatus();
      this.showStatusToast("🟢 Back online. Direct streaming links active.");
    });
    window.addEventListener("offline", () => {
      this.updateOnlineStatus();
      this.showStatusToast("🟡 Offline mode. Accessing cached watchlist.");
    });
  }

  // PWA INSTALL TRIGGER (DIRECT OR SMART GUIDE)
  async promptInstall() {
    if (this.deferredPrompt) {
      try {
        this.deferredPrompt.prompt();
        const { outcome } = await this.deferredPrompt.userChoice;
        console.log("[PWA] User response to install:", outcome);
        if (outcome === "accepted") {
          localStorage.setItem("anime_navigator_is_installed", "true");
          this.deferredPrompt = null;
          this.updateInstallUiState();
          if (this.installGuideModal) this.installGuideModal.classList.remove("active");
          this.showStatusToast("🎉 Anime Navigator installed as an app!");
        }
      } catch (err) {
        this.openInstallGuideModal();
      }
    } else {
      this.openInstallGuideModal();
    }
  }

  // SMART INSTALL GUIDE MODAL FOR ALL PLATFORMS
  openInstallGuideModal() {
    if (!this.installGuideModal || !this.installGuideBody) return;

    const ua = navigator.userAgent || "";
    const isIOS = /iPad|iPhone|iPod/.test(ua) && !window.MSStream;
    const isAndroid = /Android/.test(ua);

    let deviceTag = `<span class="guide-device-tag"><i class="fa-solid fa-desktop"></i> Desktop Browser</span>`;
    let stepsHtml = "";

    if (isIOS) {
      deviceTag = `<span class="guide-device-tag"><i class="fa-brands fa-apple"></i> iOS Safari</span>`;
      stepsHtml = `
        <div class="guide-step-item">
          <div class="guide-step-num">1</div>
          <div class="guide-step-text">Tap the <strong>Share</strong> button <i class="fa-solid fa-arrow-up-from-bracket" style="color:#38bdf8;"></i> in the Safari toolbar.</div>
        </div>
        <div class="guide-step-item">
          <div class="guide-step-num">2</div>
          <div class="guide-step-text">Scroll down the share sheet and tap <strong>Add to Home Screen</strong> <i class="fa-solid fa-square-plus" style="color:#a855f7;"></i>.</div>
        </div>
        <div class="guide-step-item">
          <div class="guide-step-num">3</div>
          <div class="guide-step-text">Tap <strong>Add</strong> in the top right corner. Anime Navigator will appear on your home screen!</div>
        </div>
      `;
    } else if (isAndroid) {
      deviceTag = `<span class="guide-device-tag"><i class="fa-brands fa-android"></i> Android Chrome / Browser</span>`;
      stepsHtml = `
        <div class="guide-step-item">
          <div class="guide-step-num">1</div>
          <div class="guide-step-text">Tap the browser menu <strong>(⋮)</strong> in the top right corner.</div>
        </div>
        <div class="guide-step-item">
          <div class="guide-step-num">2</div>
          <div class="guide-step-text">Select <strong>Install app</strong> or <strong>Add to Home screen</strong>.</div>
        </div>
        <div class="guide-step-item">
          <div class="guide-step-num">3</div>
          <div class="guide-step-text">Confirm the prompt to install Anime Navigator as a native standalone app.</div>
        </div>
      `;
    } else {
      stepsHtml = `
        <div class="guide-step-item">
          <div class="guide-step-num">1</div>
          <div class="guide-step-text">Look for the <strong>Install</strong> icon <i class="fa-solid fa-download" style="color:#38bdf8;"></i> on the right side of your browser's address bar.</div>
        </div>
        <div class="guide-step-item">
          <div class="guide-step-num">2</div>
          <div class="guide-step-text">Or open browser menu <strong>(⋮)</strong> &rarr; Select <strong>Install Anime Navigator</strong>.</div>
        </div>
        <div class="guide-step-item">
          <div class="guide-step-num">3</div>
          <div class="guide-step-text">Click <strong>Install</strong> to launch Anime Navigator in its own dedicated, borderless glass window.</div>
        </div>
      `;
    }

    this.installGuideBody.innerHTML = `
      ${deviceTag}
      <div class="install-guide-steps">
        ${stepsHtml}
      </div>
    `;

    if (this.installModalActionBtn) {
      if (this.deferredPrompt) {
        this.installModalActionBtn.style.display = "inline-flex";
        this.installModalActionBtn.onclick = () => this.promptInstall();
      } else {
        this.installModalActionBtn.style.display = "none";
      }
    }

    this.installGuideModal.classList.add("active");
  }

  showUpdateToast(worker) {
    if (!this.pwaToast) return;
    this.pwaToast.style.display = "flex";

    const reloadBtn = document.getElementById("pwa-update-reload-btn");
    const dismissBtn = document.getElementById("pwa-update-dismiss-btn");

    if (reloadBtn) {
      reloadBtn.onclick = () => {
        worker.postMessage({ type: "SKIP_WAITING" });
        this.pwaToast.style.display = "none";
      };
    }

    if (dismissBtn) {
      dismissBtn.onclick = () => {
        this.pwaToast.style.display = "none";
      };
    }
  }

  updateOnlineStatus() {
    const isOnline = navigator.onLine;
    if (!this.connPill) return;

    if (isOnline) {
      this.connPill.className = "connection-pill online";
      if (this.connStatusText) this.connStatusText.textContent = "Online";
    } else {
      this.connPill.className = "connection-pill offline";
      if (this.connStatusText) this.connStatusText.textContent = "Offline";
    }
  }

  showStatusToast(msg) {
    if (!this.pwaStatusToast) return;
    this.pwaStatusToast.textContent = msg;
    this.pwaStatusToast.style.display = "flex";

    clearTimeout(this.toastTimer);
    this.toastTimer = setTimeout(() => {
      if (this.pwaStatusToast) {
        this.pwaStatusToast.style.display = "none";
      }
    }, 4500);
  }

  handleInitialQueryParams() {
    try {
      const params = new URLSearchParams(window.location.search);
      const action = params.get("action");
      const category = params.get("category");

      if (action === "add") {
        setTimeout(() => {
          this.clearError(this.addErrorMsg);
          this.addModal.classList.add("active");
        }, 250);
      } else if (category && ALLOWED_CATEGORIES.includes(category)) {
        this.currentNav = category;
        document.querySelectorAll(".nav-link").forEach((el) => {
          el.classList.toggle("active", el.getAttribute("data-nav") === category);
        });
      }
    } catch (e) {
      console.warn("Failed to parse URL query params:", e);
    }
  }

  // Switch category navigation programmatically
  switchNav(category) {
    const validNav = ALLOWED_CATEGORIES.includes(category) ? category : "Home";
    this.currentNav = validNav;
    document.querySelectorAll(".nav-link").forEach(el => {
      const match = validNav === "Home" ? el.id === "nav-home" : el.getAttribute("data-nav") === validNav;
      el.classList.toggle("active", Boolean(match));

    });
    this.updateInstallUiState();
    this.render();
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
      this.updateInstallUiState();
      this.render();
    });

    // Brand Home Link
    document.getElementById("brand-home-btn").addEventListener("click", (e) => {
      e.preventDefault();
      document.querySelectorAll(".nav-link").forEach(el => el.classList.remove("active"));
      document.getElementById("nav-home").classList.add("active");
      this.currentNav = "Home";
      this.updateInstallUiState();
      this.render();
    });

    // Wallpaper Button
    const wallpaperBtn = document.getElementById("toggle-wallpaper-btn");
    if (wallpaperBtn) {
      wallpaperBtn.addEventListener("click", () => this.toggleWallpaper());
    }

    // PWA Install Buttons
    if (this.installPwaBtn) {
      this.installPwaBtn.addEventListener("click", () => this.promptInstall());
    }
    if (this.installPwaFooterBtn) {
      this.installPwaFooterBtn.addEventListener("click", () => this.promptInstall());
    }

    // Home Install Banner Buttons
    if (this.homeInstallActionBtn) {
      this.homeInstallActionBtn.addEventListener("click", () => this.promptInstall());
    }
    if (this.homeDismissBannerBtn) {
      this.homeDismissBannerBtn.addEventListener("click", () => {
        sessionStorage.setItem("pwa_banner_dismissed", "true");
        if (this.homeInstallBanner) {
          this.homeInstallBanner.style.display = "none";
        }
      });
    }

    // Install Guide Modal Close Buttons
    if (this.closeInstallGuideBtn) {
      this.closeInstallGuideBtn.addEventListener("click", () => {
        if (this.installGuideModal) this.installGuideModal.classList.remove("active");
      });
    }
    if (this.closeInstallGuideModal) {
      this.closeInstallGuideModal.addEventListener("click", () => {
        if (this.installGuideModal) this.installGuideModal.classList.remove("active");
      });
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

    // Backup & Data Manager Buttons
    const backupBtn = document.getElementById("open-backup-modal-btn");
    if (backupBtn) {
      backupBtn.addEventListener("click", () => this.openBackupModal());
    }
    const backupFooterBtn = document.getElementById("open-backup-modal-btn-footer");
    if (backupFooterBtn) {
      backupFooterBtn.addEventListener("click", () => this.openBackupModal());
    }
    document.getElementById("close-backup-modal").addEventListener("click", () => {
      this.backupModal.classList.remove("active");
    });

    document.getElementById("export-json-btn").addEventListener("click", () => {
      this.exportBackup();
    });

    document.getElementById("import-json-btn").addEventListener("click", () => {
      if (this.importJsonInput) this.importJsonInput.click();
    });

    if (this.importJsonInput) {
      this.importJsonInput.addEventListener("change", (e) => {
        if (e.target.files && e.target.files[0]) {
          this.importBackupFile(e.target.files[0]);
          e.target.value = "";
        }
      });
    }

    document.getElementById("clear-all-data-btn").addEventListener("click", () => {
      this.clearAllSavedData();
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

    // User Guide Modal
    if (this.openGuideModalBtn) {
      this.openGuideModalBtn.addEventListener("click", () => {
        if (this.guideModal) this.guideModal.classList.add("active");
      });
    }
    const closeGuideModal = document.getElementById("close-guide-modal");
    if (closeGuideModal) {
      closeGuideModal.addEventListener("click", () => {
        if (this.guideModal) this.guideModal.classList.remove("active");
      });
    }
    const closeGuideModalBtn = document.getElementById("close-guide-modal-btn");
    if (closeGuideModalBtn) {
      closeGuideModalBtn.addEventListener("click", () => {
        if (this.guideModal) this.guideModal.classList.remove("active");
      });
    }

    // Close modals on backdrop click
    const allModals = [this.addModal, this.editModal, this.backupModal, this.privacyModal, this.termsModal, this.installGuideModal, this.guideModal];
    allModals.forEach(modal => {
      if (!modal) return;
      modal.addEventListener("click", (e) => {
        if (e.target === modal) modal.classList.remove("active");
      });
    });

    // Close modals on Escape key press
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        allModals.forEach(modal => {
          if (modal && modal.classList.contains("active")) {
            modal.classList.remove("active");
          }
        });
      }
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

  // DEFENSIVE DOM CONSTRUCTION (XSS PREVENTION & HIGH PERFORMANCE RENDERING)
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
      img.setAttribute("decoding", "async");
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
          if (!navigator.onLine) {
            this.showStatusToast("⚠️ You are offline. Launching external watch links requires active internet.");
          }
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
    this.showStatusToast(`Saved "${newAnime.title}" to ${newAnime.status}`);
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
    this.showStatusToast(`Updated "${anime.title}"`);
  }

  handleDelete() {
    const id = document.getElementById("edit-id").value;
    const anime = this.animeList.find(a => a.id === id);

    if (anime && confirm(`Are you sure you want to remove "${anime.title}" from your watchlist?`)) {
      this.animeList = this.animeList.filter(a => a.id !== id);
      this.saveState();
      this.render();
      this.editModal.classList.remove("active");
      this.showStatusToast(`Removed "${anime.title}"`);
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

  // -----------------------------------------------------------
  // BACKUP, RESTORE & STORAGE QUOTA MANAGEMENT
  // -----------------------------------------------------------
  openBackupModal() {
    this.clearError(this.backupErrorMsg);
    if (this.backupSuccessMsg) {
      this.backupSuccessMsg.textContent = "";
      this.backupSuccessMsg.style.display = "none";
    }
    if (this.pwaTotalCount) {
      this.pwaTotalCount.textContent = `${this.animeList.length} items`;
    }
    this.calculateStorageEstimate();
    this.backupModal.classList.add("active");
  }

  async calculateStorageEstimate() {
    if (!this.pwaStorageEstimate) return;
    if ("storage" in navigator && "estimate" in navigator.storage) {
      try {
        const { quota, usage } = await navigator.storage.estimate();
        const usedMb = (usage / (1024 * 1024)).toFixed(2);
        const quotaMb = (quota / (1024 * 1024)).toFixed(0);
        this.pwaStorageEstimate.textContent = `${usedMb} MB used (of ~${quotaMb} MB)`;
      } catch (e) {
        this.pwaStorageEstimate.textContent = "Available";
      }
    } else {
      const bytes = new Blob([JSON.stringify(this.animeList)]).size;
      this.pwaStorageEstimate.textContent = `~${(bytes / 1024).toFixed(1)} KB (LocalStorage)`;
    }
  }

  exportBackup() {
    try {
      const exportPayload = {
        app: "Anime Navigator",
        version: "4.0",
        exportedAt: new Date().toISOString(),
        totalCount: this.animeList.length,
        animeList: this.animeList
      };

      const jsonStr = JSON.stringify(exportPayload, null, 2);
      const blob = new Blob([jsonStr], { type: "application/json;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      const dateStr = new Date().toISOString().split("T")[0];
      a.href = url;
      a.download = `anime-navigator-backup-${dateStr}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      this.showBackupSuccess(`Exported ${this.animeList.length} bookmarks successfully!`);
    } catch (e) {
      this.showError(this.backupErrorMsg, "Failed to export watchlist: " + e.message);
    }
  }

  importBackupFile(file) {
    if (!file) return;
    this.clearError(this.backupErrorMsg);

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const parsed = JSON.parse(e.target.result);
        const items = Array.isArray(parsed) ? parsed : (Array.isArray(parsed.animeList) ? parsed.animeList : null);

        if (!items) {
          this.showError(this.backupErrorMsg, "Invalid JSON backup file. No anime items found.");
          return;
        }

        const validItems = [];
        for (const item of items) {
          const validated = validateAnimeItem(item);
          if (validated) validItems.push(validated);
        }

        if (validItems.length === 0) {
          this.showError(this.backupErrorMsg, "No valid anime bookmarks found in the imported file.");
          return;
        }

        const shouldReplace = confirm(
          `Found ${validItems.length} bookmarks in backup file.\n\n` +
          `• Click 'OK' to REPLACE your current list.\n` +
          `• Click 'Cancel' to MERGE with current list without duplicates.`
        );

        if (shouldReplace) {
          this.animeList = validItems.slice(0, MAX_WATCHLIST_LIMIT);
        } else {
          // Merge: avoid duplicates by matching title and link
          const existingMap = new Set(this.animeList.map(a => a.title.toLowerCase() + "||" + a.link));
          for (const item of validItems) {
            const key = item.title.toLowerCase() + "||" + item.link;
            if (!existingMap.has(key) && this.animeList.length < MAX_WATCHLIST_LIMIT) {
              existingMap.add(key);
              this.animeList.push(item);
            }
          }
        }

        this.saveState();
        this.render();
        this.calculateStorageEstimate();
        if (this.pwaTotalCount) {
          this.pwaTotalCount.textContent = `${this.animeList.length} items`;
        }
        this.showBackupSuccess(`Import complete! Watchlist now has ${this.animeList.length} anime entries.`);
      } catch (err) {
        this.showError(this.backupErrorMsg, "Could not parse JSON file: " + err.message);
      }
    };
    reader.readAsText(file);
  }

  showBackupSuccess(msg) {
    if (!this.backupSuccessMsg) return;
    this.backupSuccessMsg.textContent = msg;
    this.backupSuccessMsg.style.display = "block";
  }

  clearAllSavedData() {
    if (confirm("Are you sure you want to delete ALL saved anime bookmarks? This cannot be undone unless you have a backup file.")) {
      this.animeList = [];
      this.saveState();
      this.render();
      this.calculateStorageEstimate();
      if (this.pwaTotalCount) {
        this.pwaTotalCount.textContent = "0 items";
      }
      this.showBackupSuccess("All watchlist data has been cleared.");
    }
  }
}

document.addEventListener("DOMContentLoaded", () => {
  window.animeNavigator = new AnimeNavigator();
});
