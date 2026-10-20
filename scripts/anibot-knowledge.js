/* ==========================================================================
   ANIBOT KNOWLEDGE BASE - VERIFIED SITE INFORMATION & HOW-TO GUIDES
   ========================================================================== */

(function (window) {
  'use strict';

  const AnibotKnowledge = {
    // Verified Website Metadata
    siteInfo: {
      name: "Anime Navigator (My Anime List)",
      shortName: "Anime Navigator",
      creator: "Kishore (V. Kishore)",
      creatorHandle: "@Kishore",
      version: "1.4.0",
      purpose: "A private, glassmorphic personal anime watchlist manager and direct 1-click web launcher.",
      techStack: [
        "Semantic HTML5",
        "Vanilla Modern CSS (Glassmorphism design system)",
        "Vanilla JavaScript (ES6+ Class architecture)",
        "Progressive Web App (PWA) with Service Worker caching",
        "Client-side LocalStorage persistence"
      ],
      categories: ["Watching", "Going to watch", "Ongoing-follow-up", "Completed"],
      storageKey: "anime_navigator_list_v4",
      privacyHighlights: [
        "100% Client-Side Local Storage — your bookmarks never leave your device",
        "Zero tracking cookies, zero analytics, zero advertisement networks",
        "Strict Content Security Policy (CSP) & HTTPS enforcement",
        "Portable JSON backup export and import anytime"
      ]
    },

    // Verified Step-by-Step Guides
    howToGuides: {
      addAnime: {
        title: "How to Add an Anime",
        steps: [
          "Click the **+ Add Anime** button in the top navigation bar.",
          "Enter the **Anime Title** (e.g. *Solo Leveling* or *Frieren*).",
          "Optionally enter a **Poster Image URL** (HTTPS link). If empty, a sleek glass placeholder is provided.",
          "Select the **Category**: *Watching*, *Going to watch*, *Ongoing-follow-up*, or *Completed*.",
          "Paste your **Website Link** (direct episode or anime page URL from Crunchyroll, HiAnime, etc.).",
          "Click **Save Bookmark**!"
        ],
        action: { label: "+ Add Anime", actionType: "open-add-modal" }
      },
      editAnime: {
        title: "How to Edit an Anime",
        steps: [
          "Find the anime card on your watchlist.",
          "Hover over the card (or tap on mobile) and click the **Pencil icon (✎)** in the upper-right corner.",
          "Change the Title, Poster URL, Category status, or streaming Link.",
          "Click **Save Changes**!"
        ]
      },
      deleteAnime: {
        title: "How to Delete an Anime",
        steps: [
          "Hover over the anime card and click the **Pencil icon (✎)** to open the edit modal.",
          "Click the red **Delete** button at the bottom.",
          "Confirm the confirmation prompt to remove the anime from your list."
        ]
      },
      launchStream: {
        title: "How to Watch / Launch Anime",
        steps: [
          "Simply **click anywhere on any anime card**!",
          "Anime Navigator opens your saved direct streaming link in a secure new browser tab (`noopener,noreferrer`)."
        ]
      },
      backupData: {
        title: "How to Backup or Export Watchlist",
        steps: [
          "Click the **Data** button in the header (or **Backup & Restore** in the footer).",
          "Click **Export JSON**.",
          "A portable file named `anime-navigator-backup-YYYY-MM-DD.json` will be saved to your device."
        ],
        action: { label: "Open Backup Manager", actionType: "open-backup-modal" }
      },
      importData: {
        title: "How to Restore / Sync Watchlist on Another Device",
        steps: [
          "Transfer your `.json` backup file to your phone, tablet, or another browser.",
          "Open Anime Navigator and click **Data** in the header.",
          "Under **Import Backup**, click **Select File** and pick your JSON file.",
          "Your bookmarks and category badges will update immediately!"
        ],
        action: { label: "Open Backup Manager", actionType: "open-backup-modal" }
      },
      changeWallpaper: {
        title: "How to Change Wallpapers",
        steps: [
          "Click the **Wallpaper icon (🖼️)** in the top navigation bar.",
          "The website will cycle to the next curated anime background theme.",
          "Your favorite wallpaper selection is saved automatically in your browser!"
        ],
        action: { label: "Cycle Wallpaper Now", actionType: "toggle-wallpaper" }
      },
      installPwa: {
        title: "How to Install as an App (PWA)",
        steps: [
          "**On Desktop**: Click the 'Install App' banner on the home screen or click the install icon in your browser's address bar.",
          "**On Android**: Tap the 'Install Anime Navigator' banner or open browser menu (⋮) &rarr; 'Install app'.",
          "**On iOS/iPhone**: Tap Safari's Share button (⎋) &rarr; scroll down &rarr; 'Add to Home Screen' &rarr; 'Add'."
        ],
        action: { label: "Install App", actionType: "prompt-install" }
      },
      searchAnime: {
        title: "How to Search Your Anime",
        steps: [
          "Click the **Search Anime...** bar at the top.",
          "Start typing any part of the anime title.",
          "The card grid filters instantly in real time!"
        ],
        action: { label: "Focus Search Bar", actionType: "focus-search" }
      }
    },

    // Frequently Asked Questions
    faqs: [
      {
        id: "creator",
        keywords: ["creator", "who made", "who created", "developer", "author", "owner", "built by"],
        question: "Who created this website?",
        answer: "Anime Navigator was created by **Kishore** (**V. Kishore**)! ✨ He designed it as a personal, high-performance anime bookmark launcher with pure glass aesthetics and offline PWA capability."
      },
      {
        id: "purpose",
        keywords: ["purpose", "what is this", "what is anime navigator", "why was this created", "what does it do", "about"],
        question: "What is this website for?",
        answer: "Anime Navigator is your personal anime bookmark navigator! Instead of cluttered ratings or heavy ads, it gives you a stunning glassmorphic dashboard to organize your anime into 4 categories (*Watching*, *Going to watch*, *Ongoing-follow-up*, *Completed*) and launch your favorite streaming sites with 1 click."
      },
      {
        id: "privacy",
        keywords: ["privacy", "private", "data stored", "where is my data", "cloud", "tracking", "cookies", "safe"],
        question: "Is my anime list private? Where is my data stored?",
        answer: "100% private! 🛡️ All your bookmarks, posters, and links are stored locally inside your browser's `localStorage`. There are zero tracking cookies, no advertising networks, and no external databases. Your list never leaves your device unless you choose to export a JSON backup!"
      },
      {
        id: "offline",
        keywords: ["offline", "no internet", "pwa", "service worker", "work offline"],
        question: "Does Anime Navigator work offline?",
        answer: "Yes, Sugoi! ✨ Anime Navigator is a full Progressive Web App (PWA). The app shell, glass design system, and your saved bookmarks are pre-cached by our Service Worker, so you can browse and manage your watchlist anywhere, even with zero internet."
      },
      {
        id: "ratings-episodes",
        keywords: ["rating", "highest rated", "score", "rate anime", "episodes", "episode count", "how many episodes"],
        question: "Can I rate anime or track episode counts?",
        answer: "Anime Navigator is intentionally designed as a lightweight, lightning-fast 4-field bookmark launcher (*Title*, *Poster*, *Category*, and *Direct Stream Link*), so numeric ratings and episode counts aren't stored in the current schema. But you can organize your progress across categories like *Watching*, *Ongoing-follow-up*, and *Completed*!"
      },
      {
        id: "ai",
        keywords: ["use ai", "are you ai", "what are you", "how do you work", "anibot"],
        question: "Does this website use AI? How does ANIBOT work?",
        answer: "I'm **ANIBOT**, your cute local anime companion! 🐱✨ By default, I use ultra-fast, 100% private local intelligence that runs completely in your browser without sending any data over the internet. You can also connect me to a local Ollama LLM if you run one on your computer!"
      },
      {
        id: "report-bug",
        keywords: ["bug", "report bug", "issue", "feedback", "error", "contact"],
        question: "How can I report a bug or give feedback?",
        answer: "You can report bugs or suggest enhancements directly to the creator **Kishore** on the project's repository. If something looks out of place, you can also try clearing your browser cache or re-installing the PWA update!"
      }
    ]
  };

  window.AnibotKnowledge = AnibotKnowledge;
})(window);
