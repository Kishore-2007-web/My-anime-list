# 🧭 Anime Navigator — Personal Watchlist & Web Launcher

A high-performance, pure glassmorphism anime watchlist and web navigator featuring fullscreen live MP4 video wallpapers, instant direct streaming links, and persistent browser storage.

---

## 📌 Project Overview

**Anime Navigator** is designed specifically as a personal anime bookmark launcher. Instead of cluttered ratings and complex stats, it provides a clean, minimalist glass UI overlaying animated live video backgrounds. It allows you to organize your watchlist into custom categories and launch your favorite anime streaming websites (e.g. HiAnime, Crunchyroll) with a single click.

---

## ✨ Key Features

- **🎬 Full-Site Live Video Backgrounds**: Includes support for multiple 4K/HD live MP4 video wallpapers (`samurai-katana`, `samurai-sun`, `fallen-angel`, `moonlit-sanctuary`).
- **🔄 Live Wallpaper Switcher**: Click the **`Wallpaper`** button in the header to cycle through your video backgrounds seamlessly.
- **💎 Pure Glassmorphism Design**: Ultra-clear frosted glass containers (`backdrop-filter: blur(12px)`), translucent dark panels, and glowing borders designed so the background video shines through clearly.
- **⚡ One-Click Web Launcher**: Click any anime card to immediately open your saved watch link in a new browser tab.
- **📝 Simplified 4-Field Quick Add**:
  1. Anime Title
  2. Poster Image URL
  3. Category Status (`Watching`, `Going to watch`, `Ongoing-follow-up`, `Completed`)
  4. Website Watch Link
- **✏️ Edit & Delete Manager**: Hover over any card and click the pen icon to edit details or delete bookmarks.
- **🔍 Real-Time Search**: Search through your saved anime titles instantly.
- **💾 LocalStorage Data Persistence**: All added anime bookmarks and selected wallpaper preferences are saved automatically in your browser (`localStorage`), keeping them intact even after exiting the site.

---

## 📜 User Request & Iterative Design Journey

Below is the complete evolution of the project based on user requirements and feedback:

### Phase 1: Initial Vision & Dark Anime Theme
- **User Request**: Create a solid, black-themed animated anime list website with custom headers (`Home`, `Watching`, `Going to watch`, `Ongoing-follow-up`, `Completed`).
- **Implementation**: Built a pitch-black obsidian application with canvas particle physics, stats counters, hero banner, 3D card tilt effects, and mock anime items.

### Phase 2: Simplification into a Personal Navigator
- **User Feedback**: Clarified that the site is not for watching anime directly, but rather acting as a **personal anime navigator/bookmark launcher** to external watch sites.
- **Changes**:
  - Removed the Hero Banner, rating scores, progress bars, and genres from cards.
  - Set card clicks to immediately open the target streaming URL in a new tab (`window.open(link, '_blank')`).
  - Simplified the **Quick Add** modal down to strictly **4 essential fields** (Title, Poster URL, Category, Watch Link).
  - Switched the background to an MP4 video background layer with pure glass UI overlay.

### Phase 3: Full-Site Video Visibility & Live Wallpaper Switcher
- **User Feedback**: Make the video background cover the entire site, fix UI errors, and increase background video visibility.
- **Changes**:
  - Added user-uploaded 4K live video wallpapers (`assets/*.mp4`).
  - Increased video brightness (`brightness(1.0)`), lightened the dark overlay tint, and reduced glass blur so the animated samurai live wallpapers are bright and clearly visible.
  - Added a **`Wallpaper`** button in the header to cycle through all 4 live video wallpapers on the fly.

### Phase 4: Clean Start (Mock Cards Removed)
- **User Request**: Remove all default mock cards.
- **Changes**:
  - Cleared default mock items so the application starts fresh with `0 Saved Anime`.
  - Displayed a clean empty state prompt guiding users to add their custom anime bookmarks.

---

## ⚙️ Technical Architecture & File Structure

```
my-anime-list/
├── index.html          # Semantic HTML5 markup, video layer, glass header & modals
├── style.css           # Glassmorphism design system, fixed video layer, animations
├── app.js              # State engine, video background switcher & LocalStorage handler
├── assets/             # Live 4K MP4 video wallpapers
│   ├── samurai-katana-in-forest-cinematic-4k-live-wallpaper.mp4
│   ├── samurai-sun-live-wallpaper.mp4
│   ├── fallen-angel-in-the-ruins-live-wallpaper.mp4
│   └── moonlit-sanctuary-tranquil-waterfall-torii-gate-4k-live-wallpaper.mp4
└── README.md           # Documentation & project details
```

### Key Technical Implementation Details

1. **Video Background & Overlay (`style.css`)**:
   ```css
   .bg-video {
     position: fixed;
     inset: 0;
     width: 100vw;
     height: 100vh;
     object-fit: cover;
     z-index: -2;
     filter: brightness(1.0) contrast(1.05);
     pointer-events: none;
   }

   .video-overlay {
     position: fixed;
     inset: 0;
     background: radial-gradient(circle at center, rgba(0, 0, 0, 0.1) 0%, rgba(0, 0, 0, 0.45) 100%);
     z-index: -1;
     pointer-events: none;
   }
   ```

2. **LocalStorage Sync Engine (`app.js`)**:
   - `loadState()`: Loads saved JSON array from `localStorage` under key `anime_navigator_list_v4`.
   - `saveState()`: Automatically writes updated array to `localStorage` on any Add, Edit, or Delete action.
   - `toggleWallpaper()`: Saves active wallpaper index to `localStorage` (`anime_navigator_wallpaper_idx`).

---

## 🚀 How to Run Locally

1. Clone or navigate to the repository directory:
   ```bash
   cd d:\from-c-drive\OneDrive\Desktop\my-anime-list
   ```
2. Open `index.html` directly in any web browser, or launch a simple local development server:
   ```bash
   npx serve .
   ```
3. Open `http://localhost:8080` in your browser.

---

## 📄 License

Open source personal project crafted with HTML5, Vanilla CSS, and JavaScript..
