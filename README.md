# 🧭 Anime Navigator — Personal Watchlist & Web Launcher

A high-performance, pure glassmorphism anime watchlist and web navigator featuring fullscreen live MP4 video wallpapers, instant direct streaming links, and persistent browser storage..

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
- **💾 LocalStorage Data Persistence**: All added anime bookmarks and selected wallpaper preferences are saved automatically in your browser (`localStorage`), keeping them intact even after exiting the site..

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

### Phase 6: Home Install Banner & Universal Device Support
- **User Request**: Add an install button in home until the website is installed as an app.
- **Implementation**:
  - **Sleek Glass Home Install Banner**: Prominently displayed beneath the search bar on the home screen until the user installs the app.
  - **Device & OS Detection**: Tailored step-by-step guidance modal for iOS Safari (Share &rarr; Add to Home Screen), Android Chrome (Menu &rarr; Install app), and Desktop (address bar install icon).
  - **State Persistence**: Dynamically hides across the entire app once installed (`display-mode: standalone`, `navigator.standalone`, or localStorage persistence) or dismissed for the session.

### Phase 7: Comprehensive SEO Optimization, Sitemap & User Documentation
- **User Request**: Add clear optimized SEO with proper keywords and sitemap.xml, etc. and clear documentation and user guide too.
- **Implementation**:
  - **SEO Metadata Suite**: Semantic `<title>`, meta description, targeted keywords, author, robots directive, and canonical link tags.
  - **Social Sharing Previews**: Complete Open Graph (`og:*`) and Twitter Card (`twitter:*`) tags with 512px emblem preview.
  - **Rich Snippets JSON-LD**: Schema.org `@graph` featuring `WebApplication` (software version, pricing, features) and `FAQPage` (SEO-indexable FAQ accordions).
  - **Crawler Directives**: Valid XML [`sitemap.xml`](file:///d:/from-c-drive/OneDrive/Desktop/my-anime-list/sitemap.xml) declaring home and deep-linked category routes, paired with a standard [`robots.txt`](file:///d:/from-c-drive/OneDrive/Desktop/my-anime-list/robots.txt).
  - **Server Headers**: Configured [`_headers`](file:///d:/from-c-drive/OneDrive/Desktop/my-anime-list/_headers) and [`vercel.json`](file:///d:/from-c-drive/OneDrive/Desktop/my-anime-list/vercel.json) with exact MIME types (`application/xml`, `text/plain`) and cache-control rules.
  - **Interactive User Guide**: Integrated in-app modal accessible from the footer (`User Guide`) + standalone comprehensive [`USER_GUIDE.md`](file:///d:/from-c-drive/OneDrive/Desktop/my-anime-list/USER_GUIDE.md).

### Phase 8: ANIBOT — Local AI Anime Companion & Mascot
- **User Request**: Build ANIBOT — Local AI Companion for My Anime List (chibi anime cat-girl mascot, live data queries, website guide, creator FAQ, zero-paid API local architecture, and optional Ollama support).
- **Implementation**:
  - **Original Kawaii Vector Mascot (`scripts/anibot-mascot.js`)**: Chibi cat-girl with white/cream hair, sunshine-yellow highlights, golden star hair clip, and dynamic SVG facial expressions (`happy`, `talking`, `thinking`, `celebrate`, `sleepy`, `wink`).
  - **Centralized Knowledge Base (`scripts/anibot-knowledge.js`)**: Verified creator info (Kishore / V. Kishore), verified features, privacy guarantees, and step-by-step how-to tutorials.
  - **Safe Data Adapter & Intent Engine (`scripts/anibot-service.js`)**: Real-time read-only access to user bookmarks, statistics calculations, intent parsing (`GET_ANIME_COUNT`, `GET_ANIME_BY_STATUS`, `GET_ANIME_LIST`, `WEBSITE_HOW_TO`, `WEBSITE_FAQ`), and optional local Ollama LLM support with seamless deterministic fallback.
  - **Polished Glass Chat UI (`scripts/anibot-ui.js` & `anibot.css`)**: Floating mascot launcher button with idle ear-twitch animations, speech bubble teaser, glassmorphic chat window, quick suggestion chips, message history, auto-scroll, and interactive action buttons (e.g. `[+ Add Anime Now]`, `[👀 Open Watching]`, `[💾 Backup]`).

---

## 📖 Documentation & User Guide

For detailed walkthroughs, installation tutorials across iOS/Android/Desktop, keyboard shortcuts, and backup tips:
👉 **[Read the Full User Guide (USER_GUIDE.md)](file:///d:/from-c-drive/OneDrive/Desktop/my-anime-list/USER_GUIDE.md)**

---

## ⚙️ Technical Architecture & File Structure

```
my-anime-list/
├── index.html          # Semantic HTML5, SEO meta, JSON-LD, modals & App Shell
├── style.css           # Glassmorphism design system, responsive layout & guide styles
├── anibot.css          # ANIBOT mascot animations, chat glass panel & responsive drawer
├── app.js              # PWA lifecycle, Service Worker, state, SEO & backup engine
├── sw.js               # Service Worker: App Shell pre-caching, offline sync & runtime cache
├── sitemap.xml         # XML Sitemap for search engines (Google, Bing, DuckDuckGo)
├── robots.txt          # Web crawler indexation rules and sitemap location
├── USER_GUIDE.md       # Comprehensive user manual, installation steps & FAQ
├── manifest.webmanifest# Standard PWA Web App Manifest (standalone, shortcuts, icons)
├── manifest.json       # Manifest compatibility alias
├── _headers            # Security headers, MIME types & Service Worker cache control
├── vercel.json         # Vercel deployment, MIME types & PWA cache headers
├── assets/
│   ├── icons/          # PWA icons (192x192, 512x512, maskable, apple-touch, SVG)
│   ├── Screenshot*.png # Application previews for desktop/mobile install prompt
└── scripts/
    ├── anibot-mascot.js   # Original vector chibi anime mascot generator & expressions
    ├── anibot-knowledge.js# Verified website knowledge base, FAQs & how-to tutorials
    ├── anibot-service.js  # Safe data adapter, intent recognizer & Ollama connector
    ├── anibot-ui.js       # Floating launcher, chat panel, message stream & actions
    └── generate-icons.js  # Procedural icon generator script
```

---

## 🚀 How to Run & Test Locally

1. Launch a local HTTP development server (Service Workers require `http://localhost` or `https://`):
   ```bash
   npx serve .
   ```
2. Open `http://localhost:3000` in Chrome, Edge, or mobile browser.
3. Test SEO & PWA Features:
   - Check `<head>` for OpenGraph, Twitter Cards, and Schema.org JSON-LD structured data.
   - Access `http://localhost:3000/sitemap.xml` and `http://localhost:3000/robots.txt`.
   - Click **Install App** or the **Home Install Banner**.
   - Click **User Guide** in the footer to review the in-app documentation.
   - Go to DevTools -> Application -> Service Workers / Manifest to audit PWA compliance.
   - Toggle **Offline** mode in Network tab to verify full offline accessibility!
   - Open **Data** to test JSON Export & Import backup.

---

## 📄 License

Open source personal project crafted with HTML5, Vanilla CSS, and JavaScript.
