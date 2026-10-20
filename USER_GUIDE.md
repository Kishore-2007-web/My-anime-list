# 🧭 Anime Navigator — Comprehensive User Guide & Documentation

Welcome to **Anime Navigator**, an ultra-clear glassmorphism personal anime watchlist manager, quick launcher, and Progressive Web App (PWA). This guide covers everything you need to know about setting up, installing, bookmarking, backing up, and customizing your anime experience.

---

## 📑 Table of Contents

1. [Introduction](#1-introduction)
2. [Quick Start: Adding Your First Bookmark](#2-quick-start-adding-your-first-bookmark)
3. [Managing Watchlist Categories](#3-managing-watchlist-categories)
4. [Editing, Updating & Removing Anime](#4-editing-updating--removing-anime)
5. [Progressive Web App (PWA) Installation](#5-progressive-web-app-pwa-installation)
   - [Desktop (Chrome, Edge, Brave)](#desktop-chrome-edge-brave)
   - [Android (Chrome, Firefox, Samsung Internet)](#android-chrome-firefox-samsung-internet)
   - [iOS & iPadOS (Safari)](#ios--ipados-safari)
6. [Offline Mode & Service Worker Caching](#6-offline-mode--service-worker-caching)
7. [Data Backup, Export & Cross-Device Sync](#7-data-backup-export--cross-device-sync)
8. [Dynamic Live Wallpapers](#8-dynamic-live-wallpapers)
9. [Keyboard Shortcuts & Pro Tips](#9-keyboard-shortcuts--pro-tips)
10. [Privacy & Security Architecture](#10-privacy--security-architecture)
11. [Troubleshooting & FAQ](#11-troubleshooting--faq)
12. [ANIBOT — Local AI Anime Companion](#12-anibot--local-ai-anime-companion)

---

## 1. Introduction

Anime Navigator was created to solve a common anime fan dilemma: keeping track of where you watch your shows across different streaming providers without dealing with heavy social media bloat, ad popups, or server-side account lock-in.

- **1-Click Web Launcher**: Rather than hosting media, Anime Navigator stores your direct episode or series URLs (e.g., Crunchyroll, HiAnime, Netflix) and launches them instantly in a private browser tab.
- **Pure Glassmorphism Aesthetics**: Built with frosted glass cards, dynamic background wallpapers, and responsive mobile-first controls.
- **Zero-Cloud Privacy**: 100% of your data remains saved locally on your device in your browser's persistent storage.

---

## 2. Quick Start: Adding Your First Bookmark

To add a new anime to your watchlist:

1. Click the **`+ Add Anime`** button in the header navigation (or click **Add Bookmark** in the empty state screen).
2. Complete the **4 essential fields**:
   - **Anime Title**: Enter the name of the show (e.g., `Solo Leveling`, `Frieren: Beyond Journey's End`).
   - **Poster Image URL (HTTPS)**: Paste any high-quality anime poster image URL. (If left blank, an elegant dark glass placeholder will be generated).
   - **Where to Add (Category)**: Choose one of the 4 watchlist categories (`Watching`, `Going to watch`, `Ongoing-follow-up`, `Completed`).
   - **Website Link (HTTPS)**: Paste the direct streaming or episode URL from your preferred website.
3. Click **`Save Bookmark`**.
4. Your new card will appear instantly in the active category with smooth entrance animations!

---

## 3. Managing Watchlist Categories

Anime Navigator organizes titles into 4 practical categories tailored to anime viewing habits:

| Category | Recommended Use Case |
| :--- | :--- |
| **👀 Watching** | Series you are actively watching right now. |
| **📌 Going to watch** | Upcoming backlog, anticipated releases, or recommended shows. |
| **⏳ Ongoing-follow-up** | Airing weekly releases that you follow episode-by-episode. |
| **✅ Completed** | Finished masterpieces and completed series. |

- **Category Badges**: The navigation header displays the exact count of items in each category in real time.
- **Quick Switch**: Click any category tab in the header or use the URL parameters (e.g., `?category=Watching`) to deep-link directly to that section.

---

## 4. Editing, Updating & Removing Anime

### Launching Streams
- Simply **click on any anime card** to open your saved stream URL directly in a secure new tab.

### Editing Details
- Hover over any card on desktop (or tap on mobile) and click the **Pencil icon (`✎`)** in the upper-right corner.
- The **Edit Anime** dialog allows you to:
  - Rename the title.
  - Update the poster URL.
  - Switch the category (e.g., move from *Watching* to *Completed*).
  - Update the episode or stream link.
- Click **`Save Changes`** to apply updates immediately.

### Deleting a Bookmark
- Inside the edit modal, click the red **`Delete`** button.
- Confirm the browser prompt to remove the anime from your list.

---

## 5. Progressive Web App (PWA) Installation

Anime Navigator is a certified Progressive Web App. Installing it gives you a dedicated app window without browser URL bars, desktop and home screen shortcuts, and fast native-like performance.

### Desktop (Chrome, Edge, Brave)
1. Navigate to the website.
2. An **Install App** button will automatically appear in the top banner and in the website footer.
3. Alternatively, click the **Install** icon in the right side of the browser's address bar (`Omnibox`).
4. Click **Install** when prompted.

### Android (Chrome, Firefox, Samsung Internet)
1. Open Anime Navigator in Google Chrome or your default Android browser.
2. Tap the **`Install Anime Navigator`** button in the homepage banner.
3. If prompted by the browser, tap **Install** or open the three-dot menu `(⋮)` and select **Add to Home screen** / **Install app**.
4. The Anime Navigator app icon will appear in your App Drawer and Home Screen.

### iOS & iPadOS (Safari)
1. Open the website in **Apple Safari**.
2. Tap the **Share** button (`⎋` with upward arrow) in the Safari bottom toolbar.
3. Scroll down and tap **Add to Home Screen**.
4. Tap **Add** in the upper right corner.
5. Launch Anime Navigator from your Home Screen in standalone fullscreen mode.

---

## 6. Offline Mode & Service Worker Caching

Anime Navigator includes an advanced **Service Worker (`sw.js`)** cache engine:

- **App Shell Pre-caching**: HTML, CSS, JavaScript, Web App Manifests, icons, and UI fonts are pre-cached upon first visit.
- **Offline Watchlist**: Even without an active internet connection, your entire catalog, card details, categories, and cached posters remain 100% accessible.
- **Live Connection Pill**: The top right indicator displays `🟢 Online` or `🟡 Offline` in real time with subtle alert toasts.
- **Automatic Background Updates**: When a new version is deployed, a floating toast will notify you with a single-click **Update** button.

---

## 7. Data Backup, Export & Cross-Device Sync

Because Anime Navigator prioritizes privacy and does not store your data on external tracking servers, you have full ownership of your data through portable JSON backups.

### Exporting Your Data
1. Click the **`Data`** button in the header (or **Backup & Restore** in the footer).
2. Click **`Export JSON`**.
3. A JSON backup file named `anime-navigator-backup-YYYY-MM-DD.json` will download to your device containing all your titles, links, posters, and category states.

### Importing on Another Device
1. Transfer or AirDrop/email your `.json` backup file to your second device (e.g., from PC to phone).
2. Open Anime Navigator on the new device and click **Data** &rarr; **Select File** under *Import Backup*.
3. Choose your backup JSON file.
4. Select your preferred restore mode:
   - **Merge**: Combines imported bookmarks with your existing list without creating duplicate titles.
   - **Replace**: Completely overwrites the local list with the imported backup.
5. All bookmarks and category counts will refresh immediately.

---

## 8. Dynamic Live Wallpapers

To change the site atmosphere:
- Click the **Wallpaper icon** (`🖼️`) in the top navigation bar.
- The site cycles smoothly through curated high-definition anime background themes.
- Your preferred wallpaper index is saved in your browser storage so your favorite theme is preserved every time you return.

---

## 9. Keyboard Shortcuts & Pro Tips

| Action | Shortcut / Tip |
| :--- | :--- |
| **Search Filter** | Click the search bar or type immediately to filter titles with real-time matching. |
| **Close Any Modal** | Press the <kbd>Esc</kbd> key on your keyboard. |
| **Deep Link Category** | Bookmark or share URL parameters like `?category=Watching` or `?category=Completed`. |
| **Auto Open Quick Add** | Navigate to `?action=add` to open the quick add dialog automatically. |

---

## 10. Privacy & Security Architecture

- **Zero Tracking**: No Google Analytics, Meta Pixels, ad networks, or fingerprinting scripts.
- **Strict Content Security Policy (CSP)**: High-grade security headers protect against cross-site scripting (XSS) and code injection.
- **Encrypted Origin**: Runs with HTTPS enforcement and HSTS security headers.
- **Isolated Links**: All external links are opened with `rel="noopener noreferrer"` preventing referrer leaks or opener exploitation.

---

## 11. Troubleshooting & FAQ

#### Q: Where are my streaming links stored?
**A:** Everything is stored in your device's browser `localStorage` under the key `anime_bookmarks_v1`. No third party has access to your bookmarks.

#### Q: Why didn't an image URL load?
**A:** Ensure the poster URL starts with `https://` and points directly to an image file (e.g., ending in `.jpg`, `.png`, or `.webp`). Some websites block hotlinking via `Referrer-Policy`; in such cases, use an image host like Imgur or an official anime database poster link (e.g., MyAnimeList or AniList).

#### Q: How do I clear all my bookmarks and start fresh?
**A:** Open the **Data** modal from the header and click the red **`Clear All Saved Anime`** button. (We recommend exporting a JSON backup first).

---

## 12. ANIBOT — Local AI Anime Companion

Meet **ANIBOT**, your cute original chibi anime cat-girl AI assistant and site mascot! 🐾✨

### Mascot & Personality
- Small chibi anime cat-girl with soft cream & sunshine-yellow hair, cute cat ears, and a signature star hair clip.
- Cheerful, friendly personality that occasionally uses cute expressions like *"Nyaa!"*, *"Sugoi!"*, and *"Senpai!"*.
- Responsive animated facial expressions: `happy`, `talking`, `thinking`, `celebrate`, and `sleepy`.

### What You Can Ask ANIBOT
- **Live Watchlist Queries**:
  - *"What anime have I added?"*
  - *"How many anime are in my list?"*
  - *"What am I watching right now?"*
  - *"Show completed anime"*
  - *"Which anime are in my backlog?"*
- **Interactive Website Guidance**:
  - *"How do I add an anime?"*
  - *"How to backup my data?"*
  - *"How to install the PWA?"*
  - *"How to change wallpapers?"*
  - *"Who created this website?"*
- **Interactive Action Buttons**:
  - When ANIBOT answers a question, it embeds clickable direct action buttons (e.g. `[+ Add Anime Now]`, `[👀 Open Watching]`, `[💾 Open Backup Manager]`, `[🖼️ Switch Wallpaper]`) so you can trigger real dashboard actions with one tap!
- **100% Private Local Intelligence**:
  - ANIBOT runs 100% client-side with zero external API dependencies or fees.
- **Optional Local LLM (Ollama) Integration**:
  - Click the **Gear icon (⚙️)** in the chat header to enable local Ollama model integration (`http://localhost:11434/api/generate`). If Ollama is unavailable or uninstalled, ANIBOT automatically and seamlessly falls back to fast local intelligence without any interruption!

---

*Anime Navigator is free and open-source software built for anime enthusiasts worldwide.*
