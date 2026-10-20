/* ==========================================================================
   ANIBOT SERVICE - SAFE DATA ADAPTER, INTENT RECOGNIZER & LOCAL AI ENGINE
   ========================================================================== */

(function (window) {
  'use strict';

  // -------------------------------------------------------------
  // 1. ANIME DATA ADAPTER: Safe, Authorized Read-Only Data Layer
  // -------------------------------------------------------------
  const AnimeDataAdapter = {
    getAll() {
      if (window.animeNavigator && Array.isArray(window.animeNavigator.animeList)) {
        return window.animeNavigator.animeList;
      }
      try {
        const raw = localStorage.getItem("anime_navigator_list_v4");
        if (raw) {
          const parsed = JSON.parse(raw);
          return Array.isArray(parsed) ? parsed : [];
        }
      } catch (e) {
        console.warn("[ANIBOT] Failed to read from localStorage:", e);
      }
      return [];
    },

    getByStatus(status) {
      const all = this.getAll();
      const s = (status || "").toLowerCase().trim();

      // Normalize status aliases
      if (s.includes("watch") && !s.includes("going")) {
        return all.filter(item => item.status === "Watching");
      }
      if (s.includes("going") || s.includes("plan") || s.includes("backlog")) {
        return all.filter(item => item.status === "Going to watch");
      }
      if (s.includes("ongoing") || s.includes("follow")) {
        return all.filter(item => item.status === "Ongoing-follow-up");
      }
      if (s.includes("complete") || s.includes("finish") || s.includes("done")) {
        return all.filter(item => item.status === "Completed");
      }

      return all.filter(item => (item.status || "").toLowerCase() === s);
    },

    getStats() {
      const all = this.getAll();
      const stats = {
        total: all.length,
        watching: 0,
        goingToWatch: 0,
        ongoing: 0,
        completed: 0
      };

      all.forEach(item => {
        if (item.status === "Watching") stats.watching++;
        else if (item.status === "Going to watch") stats.goingToWatch++;
        else if (item.status === "Ongoing-follow-up") stats.ongoing++;
        else if (item.status === "Completed") stats.completed++;
      });

      return stats;
    },

    search(query) {
      if (!query) return [];
      const q = query.toLowerCase().trim();
      return this.getAll().filter(item => (item.title || "").toLowerCase().includes(q));
    }
  };

  // -------------------------------------------------------------
  // 2. OLLAMA LOCAL LLM CONNECTOR (Optional with Safe Fallback)
  // -------------------------------------------------------------
  const OllamaConnector = {
    STORAGE_KEY: "anibot_ollama_config",

    getConfig() {
      try {
        const raw = localStorage.getItem(this.STORAGE_KEY);
        if (raw) return JSON.parse(raw);
      } catch (e) {}
      return {
        enabled: false,
        endpoint: "http://localhost:11434/api/generate",
        model: "llama3.2"
      };
    },

    saveConfig(cfg) {
      try {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(cfg));
      } catch (e) {}
    },

    async query(prompt, stats, knowledge) {
      const cfg = this.getConfig();
      if (!cfg.enabled) return null;

      const systemPrompt = `You are ANIBOT, a cute, friendly, kawaii anime cat-girl AI companion for the website 'Anime Navigator' created by Kishore.
Website creator: Kishore (V. Kishore).
Kishore's official portfolio link: https://kishore-portfolio-2026.vercel.app
Whenever the user asks who created this website, who made you, or who the developer is, ALWAYS proudly and enthusiastically state that it was created by Kishore and provide his portfolio link: https://kishore-portfolio-2026.vercel.app
Keep responses concise, sweet, helpful, and anime-themed (using occasional expressions like "Nyaa!", "Sugoi!", "Senpai!").
Never invent anime titles or user data not provided below.
Current real user anime collection:
- Total: ${stats.total} anime
- Watching: ${stats.watching}
- Going to watch: ${stats.goingToWatch}
- Ongoing follow-up: ${stats.ongoing}
- Completed: ${stats.completed}
Website creator: Kishore (V. Kishore).
Tech: HTML5, CSS Glassmorphism, Vanilla JS, PWA with LocalStorage.`;

      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 4500);

        const res = await fetch(cfg.endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            model: cfg.model || "llama3.2",
            prompt: prompt,
            system: systemPrompt,
            stream: false
          }),
          signal: controller.signal
        });
        clearTimeout(timeoutId);

        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        return (data.response || "").trim();
      } catch (err) {
        console.warn("[ANIBOT Ollama] Local model unreachable, using fallback:", err);
        return null;
      }
    }
  };

  // -------------------------------------------------------------
  // 3. ANIBOT INTENT RECOGNIZER & RESPONSE GENERATOR
  // -------------------------------------------------------------
  const AnibotService = {
    // Process a user message and return { text, expression, actions, cards }
    async processMessage(userMessage) {
      const rawText = (userMessage || "").trim();
      const text = rawText.toLowerCase();

      // Check optional Ollama first if enabled
      const stats = AnimeDataAdapter.getStats();
      const knowledge = window.AnibotKnowledge || {};

      const ollamaConfig = OllamaConnector.getConfig();
      if (ollamaConfig.enabled) {
        const ollamaReply = await OllamaConnector.query(rawText, stats, knowledge);
        if (ollamaReply) {
          return {
            text: ollamaReply,
            expression: "talking",
            source: "ollama"
          };
        }
      }

      // DETERMINISTIC INTELLIGENCE ENGINE (Fast, 100% Reliable, Offline)
      return this.deterministicReply(text, stats, knowledge);
    },

    deterministicReply(text, stats, knowledge) {
      // 1. GREETING
      if (/^(hi|hello|hey|konnichiwa|kon'nichiwa|nya|nyaa|ohayo|moshi|yo\b|greetings)/i.test(text)) {
        return {
          text: `Kon'nichiwa! ✨ I'm **ANIBOT**, your personal anime watchlist companion! Nyaa~ \n\nI can check your saved anime, show watchlist statistics, guide you through features, show you cute gestures, or tell you about my creator **Kishore**! What would you like to explore today? 🐾`,
          expression: "wave",
          gesture: "wave",
          actions: [
            { label: "📊 Anime Summary", query: "Give me a summary of my anime collection" },
            { label: "👀 What am I watching?", query: "What am I watching right now?" },
            { label: "✨ Who created this site?", query: "Who created this website?" }
          ]
        };
      }

      // 1B. GESTURES & PETTING REACTIONS
      if (/(pet|headpat|pat\b|good girl|cute\b|kawaii|purr)/i.test(text)) {
        return {
          text: `Nyaa~ 💕 *purrs happily* Ehehe, thank you so much for the headpats, Senpai! That tickles in the best way! 🐾✨`,
          expression: "heart",
          gesture: "pet",
          actions: [
            { label: "🐾 Pet Again", actionType: "trigger-gesture", payload: "pet" },
            { label: "👋 Wave", actionType: "trigger-gesture", payload: "wave" },
            { label: "✨ Dance", actionType: "trigger-gesture", payload: "bounce" }
          ]
        };
      }

      if (/(wave to me|say hi to me|do a wave|wave paw)/i.test(text)) {
        return {
          text: `Hai hai! *waves cute paw energetically* ✨ Hello there, Senpai! Always so happy to see you! 🐾`,
          expression: "wave",
          gesture: "wave",
          actions: [
            { label: "🐾 Pet ANIBOT", actionType: "trigger-gesture", payload: "pet" },
            { label: "🎉 Dance", actionType: "trigger-gesture", payload: "bounce" }
          ]
        };
      }

      if (/(dance|bounce|hop|jump|do a flip|celebrate)/i.test(text)) {
        return {
          text: `Yatta! 🎉 *happy bouncy joyful anime dance* Look at me go! Anime makes every single day sparkle! ✨🐾`,
          expression: "celebrate",
          gesture: "bounce",
          actions: [
            { label: "💖 Send Love", query: "I love you ANIBOT" },
            { label: "🐾 Pet Head", actionType: "trigger-gesture", payload: "pet" }
          ]
        };
      }

      if (/(love you|i love anibot|daisuki|heart|marry me)/i.test(text)) {
        return {
          text: `Daisuki! 💖 *blushes with radiant glowing heart eyes* You're the kindest master ever, Senpai! ANIBOT will always be by your side! 💕`,
          expression: "heart",
          gesture: "pet",
          actions: [
            { label: "🐾 Pet ANIBOT", actionType: "trigger-gesture", payload: "pet" },
            { label: "🌐 Kishore's Portfolio", actionType: "open-url", payload: "https://kishore-portfolio-2026.vercel.app" }
          ]
        };
      }

      // 2. CAPABILITIES / WHAT CAN YOU DO / HELP
      if (/(what can you (do|help)|help me|how can you help|features of bot|commands|who are you)/i.test(text)) {
        return {
          text: `Here is what I can do for you, Senpai! ✨🐾\n\n` +
            `• **Watchlist Queries**: Check your total count, active shows, backlog, or completed titles.\n` +
            `• **Website Navigation**: Jump directly to any category tab or open modals on command.\n` +
            `• **Step-by-Step Guides**: Learn how to add, edit, launch, or backup your bookmarks.\n` +
            `• **Private & Safe**: I read your real local data without sending anything to the cloud!\n\n` +
            `Ask me anything, or try one of the quick buttons below!`,
          expression: "wink",
          actions: [
            { label: "📊 Anime Stats", query: "How many anime are in my list?" },
            { label: "✨ Creator Info", query: "Who created this website?" },
            { label: "💾 How to Backup", query: "How do I backup my data?" }
          ]
        };
      }

      // 3. ANIME COUNT & STATS
      if (/(how many|total anime|anime count|number of anime|collection size|statistics|summary)/i.test(text)) {
        if (stats.total === 0) {
          return {
            text: `Your watchlist is currently empty! 🌸 Your anime adventure is just beginning! Click **+ Add Anime** to bookmark your first show.`,
            expression: "sleepy",
            actions: [
              { label: "+ Add Your First Anime", actionType: "open-add-modal" }
            ]
          };
        }

        const milestoneMsg = stats.total >= 50
          ? "🎉 Sugoi! You're an anime connoisseur with a massive collection!"
          : stats.total >= 10
            ? "✨ Amazing progress, your watchlist is growing steadily!"
            : "🐾 A wonderful start to your anime journey!";

        return {
          text: `Sugoi! ✨ You currently have **${stats.total} anime** saved in your collection!\n\n` +
            `• **Watching**: ${stats.watching}\n` +
            `• **Going to watch**: ${stats.goingToWatch}\n` +
            `• **Ongoing follow-up**: ${stats.ongoing}\n` +
            `• **Completed**: ${stats.completed}\n\n${milestoneMsg}`,
          expression: stats.total >= 10 ? "celebrate" : "happy",
          actions: [
            { label: "👀 View Watching", actionType: "switch-nav", payload: "Watching" },
            { label: "✅ View Completed", actionType: "switch-nav", payload: "Completed" },
            { label: "➕ Add Another Anime", actionType: "open-add-modal" }
          ]
        };
      }

      // 4. WATCHING RIGHT NOW
      if (/(watching right now|currently watching|what am i watching|show.*watching|my watching)/i.test(text)) {
        const watchingList = AnimeDataAdapter.getByStatus("Watching");
        if (watchingList.length === 0) {
          return {
            text: `You don't have any anime in your **Watching** list right now! Nyaa~ \n\nWould you like to move an anime from your backlog or add a brand new show?`,
            expression: "thinking",
            actions: [
              { label: "📌 Check Going to Watch", actionType: "switch-nav", payload: "Going to watch" },
              { label: "+ Add New Anime", actionType: "open-add-modal" }
            ]
          };
        }

        const previewCards = watchingList.slice(0, 5);
        const cardHtml = previewCards.map(item => `• **${item.title}**`).join("\n");
        const extraNote = watchingList.length > 5 ? `\n\n*(and ${watchingList.length - 5} more in your Watching tab)*` : "";

        return {
          text: `Here are the anime you are actively watching (**${watchingList.length} total**): ✨\n\n${cardHtml}${extraNote}\n\nClick any card on the dashboard to launch your stream immediately!`,
          expression: "happy",
          cards: previewCards,
          actions: [
            { label: "👀 Open Watching Tab", actionType: "switch-nav", payload: "Watching" }
          ]
        };
      }

      // 5. COMPLETED ANIME
      if (/(completed|finished anime|show completed|anime.*completed|finished list)/i.test(text)) {
        const completedList = AnimeDataAdapter.getByStatus("Completed");
        if (completedList.length === 0) {
          return {
            text: `You haven't marked any anime as **Completed** yet! Keep watching, Senpai! You can change an anime's status to Completed anytime via the pencil icon (✎).`,
            expression: "thinking",
            actions: [
              { label: "👀 Check Watching", actionType: "switch-nav", payload: "Watching" }
            ]
          };
        }

        const previewCards = completedList.slice(0, 5);
        const cardHtml = previewCards.map(item => `• **${item.title}**`).join("\n");
        const extraNote = completedList.length > 5 ? `\n\n*(plus ${completedList.length - 5} more completed titles)*` : "";

        return {
          text: `🎉 Otsukaresama! You have successfully completed **${completedList.length} anime**!\n\n${cardHtml}${extraNote}`,
          expression: "celebrate",
          cards: previewCards,
          actions: [
            { label: "✅ Open Completed Tab", actionType: "switch-nav", payload: "Completed" }
          ]
        };
      }

      // 6. GOING TO WATCH / PLANNED / BACKLOG
      if (/(going to watch|planned|plan to watch|backlog|to watch)/i.test(text)) {
        const plannedList = AnimeDataAdapter.getByStatus("Going to watch");
        if (plannedList.length === 0) {
          return {
            text: `Your **Going to watch** queue is empty! Time to discover some new series to add to your backlog. ✨`,
            expression: "happy",
            actions: [
              { label: "+ Add Anime to Backlog", actionType: "open-add-modal" }
            ]
          };
        }

        const previewCards = plannedList.slice(0, 5);
        const cardHtml = previewCards.map(item => `• **${item.title}**`).join("\n");
        const extraNote = plannedList.length > 5 ? `\n\n*(and ${plannedList.length - 5} more planned titles)*` : "";

        return {
          text: `You have **${plannedList.length} anime** in your **Going to watch** backlog:\n\n${cardHtml}${extraNote}\n\nReady to start one today?`,
          expression: "happy",
          cards: previewCards,
          actions: [
            { label: "📌 Open Going to Watch", actionType: "switch-nav", payload: "Going to watch" }
          ]
        };
      }

      // 7. ONGOING / FOLLOW UP
      if (/(ongoing|follow-up|follow up|airing|weekly)/i.test(text)) {
        const ongoingList = AnimeDataAdapter.getByStatus("Ongoing-follow-up");
        if (ongoingList.length === 0) {
          return {
            text: `You don't have any weekly shows in **Ongoing-follow-up** right now. This category is perfect for keeping track of currently airing episodes!`,
            expression: "thinking",
            actions: [
              { label: "+ Add Ongoing Anime", actionType: "open-add-modal" }
            ]
          };
        }

        const previewCards = ongoingList.slice(0, 5);
        const cardHtml = previewCards.map(item => `• **${item.title}**`).join("\n");
        const extraNote = ongoingList.length > 5 ? `\n\n*(and ${ongoingList.length - 5} more ongoing shows)*` : "";

        return {
          text: `Here are the weekly anime you are following (**${ongoingList.length} total**):\n\n${cardHtml}${extraNote}`,
          expression: "happy",
          cards: previewCards,
          actions: [
            { label: "⏳ Open Ongoing Tab", actionType: "switch-nav", payload: "Ongoing-follow-up" }
          ]
        };
      }

      // 8. DROPPED ANIME QUERY (Explains verified 4-category schema honestly)
      if (/(dropped|dropped anime)/i.test(text)) {
        return {
          text: `Anime Navigator features **4 streamlined categories**: *Watching*, *Going to watch*, *Ongoing-follow-up*, and *Completed*! \n\nA separate "Dropped" category isn't used in this minimalist layout. If you don't wish to keep a show, simply click the **Pencil (✎)** icon on the card and choose **Delete**! 🗑️`,
          expression: "wink",
          actions: [
            { label: "📊 Show Current Categories", query: "Give me a summary of my anime collection" }
          ]
        };
      }

      // 9. RATINGS & EPISODES QUERY (Explains verified schema truthfully without hallucination)
      if (/(highest rated|rating|score|episode count|how many episodes|unrated)/i.test(text)) {
        return {
          text: `Anime Navigator is designed as a **streamlined 4-field bookmark launcher** (*Title*, *Poster*, *Category*, and *Direct Stream Link*).\n\nBecause of this focused design, numeric ratings and episode counters aren't stored in the current schema. But you can easily manage your progress using the 4 category statuses! 🐾`,
          expression: "thinking",
          actions: [
            { label: "👀 What am I watching?", query: "What am I watching right now?" },
            { label: "📊 View Collection Stats", query: "How many anime are in my list?" }
          ]
        };
      }

      // 10. LIST ALL / WHAT ANIME HAVE I ADDED
      if (/(what anime have i added|show.*my anime|list all|all my anime|my collection)/i.test(text)) {
        const all = AnimeDataAdapter.getAll();
        if (all.length === 0) {
          return {
            text: `You haven't added any anime yet! 🌸 Let's add your first bookmark together!`,
            expression: "sleepy",
            actions: [
              { label: "+ Add Anime", actionType: "open-add-modal" }
            ]
          };
        }

        const previewCards = all.slice(0, 6);
        const cardHtml = previewCards.map((item, idx) => `${idx + 1}. **${item.title}** [${item.status}]`).join("\n");
        const extraNote = all.length > 6 ? `\n\n*(and ${all.length - 6} more titles across your categories)*` : "";

        return {
          text: `Here is a look at your saved anime collection (**${all.length} titles**):\n\n${cardHtml}${extraNote}`,
          expression: "happy",
          cards: previewCards,
          actions: [
            { label: "🏠 Show All on Dashboard", actionType: "switch-nav", payload: "Home" }
          ]
        };
      }

      // 11. SEARCH QUERY ("do I have [X]" / "find [X]")
      const searchMatch = text.match(/(do i have|search for|find|is there)\s+(.+)/i);
      if (searchMatch && searchMatch[2]) {
        const queryTerm = searchMatch[2].replace(/[?!.]/g, "").trim();
        const results = AnimeDataAdapter.search(queryTerm);

        if (results.length > 0) {
          const listHtml = results.map(item => `• **${item.title}** (in *${item.status}*)`).join("\n");
          return {
            text: `Hai! Found **${results.length} match** for "${queryTerm}": ✨\n\n${listHtml}\n\nClick below to focus the search bar with this title:`,
            expression: "happy",
            cards: results,
            actions: [
              { label: `🔍 Search "${queryTerm}"`, actionType: "apply-search", payload: queryTerm }
            ]
          };
        } else {
          return {
            text: `I looked through your collection, but couldn't find "${queryTerm}" in your bookmarks! Nyaa~ \n\nWould you like to add it right now?`,
            expression: "thinking",
            actions: [
              { label: `+ Add "${queryTerm}"`, actionType: "open-add-modal", payload: queryTerm }
            ]
          };
        }
      }

      // 12. HOW TO: ADD ANIME
      if (/(how.*add|add anime|how to add|create bookmark)/i.test(text)) {
        const guide = knowledge.howToGuides.addAnime;
        const steps = guide.steps.map((s, idx) => `${idx + 1}. ${s}`).join("\n");
        return {
          text: `Easy-peasy, Senpai! ✨ Here is how you add an anime:\n\n${steps}\n\nLet's grow your collection! 🐾`,
          expression: "happy",
          actions: [
            { label: "+ Add Anime Now", actionType: "open-add-modal" }
          ]
        };
      }

      // 13. HOW TO: EDIT / DELETE
      if (/(how.*edit|how.*change status|how.*update)/i.test(text)) {
        const guide = knowledge.howToGuides.editAnime;
        const steps = guide.steps.map((s, idx) => `${idx + 1}. ${s}`).join("\n");
        return {
          text: `Editing is super simple! ✏️\n\n${steps}`,
          expression: "happy"
        };
      }
      if (/(how.*delete|how.*remove)/i.test(text)) {
        const guide = knowledge.howToGuides.deleteAnime;
        const steps = guide.steps.map((s, idx) => `${idx + 1}. ${s}`).join("\n");
        return {
          text: `To remove an anime bookmark: 🗑️\n\n${steps}\n\n*(Tip: Always export a backup first if you want to keep a copy!)*`,
          expression: "thinking"
        };
      }

      // 14. HOW TO: WATCH / LAUNCH
      if (/(how.*watch|how.*launch|where.*watch|click.*card)/i.test(text)) {
        const guide = knowledge.howToGuides.launchStream;
        return {
          text: `Watching your anime is 1-click simple! 🎬\n\n${guide.steps.join("\n\n")}\n\nDirect, secure, and fast!`,
          expression: "happy"
        };
      }

      // 15. HOW TO: BACKUP & RESTORE
      if (/(how.*backup|export|import|sync|transfer.*device|save my data)/i.test(text)) {
        const backupGuide = knowledge.howToGuides.backupData.steps.join("\n");
        return {
          text: `Your data is 100% portable! 💾 Here is how to backup & sync:\n\n**To Export:**\n${backupGuide}\n\nYou can then import that `.json` file on your phone, tablet, or another browser anytime!`,
          expression: "happy",
          actions: [
            { label: "💾 Open Backup Manager", actionType: "open-backup-modal" }
          ]
        };
      }

      // 16. HOW TO: CHANGE WALLPAPER
      if (/(wallpaper|change background|switch theme|theme)/i.test(text)) {
        const guide = knowledge.howToGuides.changeWallpaper.steps.join("\n");
        return {
          text: `Want to change the mood? 🖼️✨\n\n${guide}`,
          expression: "happy",
          actions: [
            { label: "🖼️ Switch Wallpaper Now", actionType: "toggle-wallpaper" }
          ]
        };
      }

      // 17. HOW TO: INSTALL PWA
      if (/(how.*install|download app|install app|pwa|add to home screen)/i.test(text)) {
        const guide = knowledge.howToGuides.installPwa.steps.join("\n");
        return {
          text: `Anime Navigator can be installed as a native app on all your devices! 📱💻\n\n${guide}`,
          expression: "celebrate",
          actions: [
            { label: "📲 Install App Now", actionType: "prompt-install" }
          ]
        };
      }

      // 18. FAQ: CREATOR & PORTFOLIO
      if (/(who (created|made|built|designed|developed)|who is kishore|created by|creator|developer|portfolio|author|owner|kishore)/i.test(text)) {
        return {
          text: `Anime Navigator and ANIBOT were created and engineered by **Kishore** (**V. Kishore**)! ✨🐱\n\nHe designed this entire website with pure glassmorphic aesthetics, offline PWA capabilities, and local companion intelligence with zero tracking or ads.\n\nYou can explore his creative projects, developer portfolio, and contact details here:\n🌐 **[kishore-portfolio-2026.vercel.app](https://kishore-portfolio-2026.vercel.app)**`,
          expression: "celebrate",
          gesture: "bounce",
          actions: [
            { label: "🌐 Visit Kishore's Portfolio", actionType: "open-url", payload: "https://kishore-portfolio-2026.vercel.app" },
            { label: "👋 Wave to Kishore", actionType: "trigger-gesture", payload: "wave" },
            { label: "🐾 Pet ANIBOT", actionType: "trigger-gesture", payload: "pet" }
          ]
        };
      }

      // 19. FAQ: PURPOSE / WHAT IS THIS
      if (/(what is this (site|website)|what is anime navigator|why.*created)/i.test(text)) {
        return {
          text: `This website is **Anime Navigator** (My Anime List) — a modern, glassmorphic personal anime launcher! 🧭\n\nIt helps you track your anime progress across 4 categories and launch directly into your favorite streaming sites with zero clutter.`,
          expression: "happy"
        };
      }

      // 20. FAQ: PRIVACY & STORAGE
      if (/(privacy|private|where.*data stored|cookies|tracking|safe)/i.test(text)) {
        return {
          text: `Your privacy is 100% protected! 🛡️\n\n• All bookmarks are stored locally inside your browser's private \`localStorage\`.\n• There are **zero tracking cookies**, no analytics, and no external databases.\n• Your data stays on your device at all times!`,
          expression: "happy",
          actions: [
            { label: "🔒 Privacy Policy Modal", actionType: "open-privacy-modal" }
          ]
        };
      }

      // 21. FAQ: OFFLINE CAPABILITY
      if (/(offline|no internet|work offline)/i.test(text)) {
        return {
          text: `Hai! Anime Navigator is a certified Progressive Web App (PWA). All scripts, glass styles, and your saved anime cards are cached locally by the Service Worker, so you can open and organize your list even completely offline! 🟢`,
          expression: "happy"
        };
      }

      // 22. NAVIGATION TRIGGERS ("take me to watching", "open add anime", etc.)
      if (/take me to watching|show watching tab/i.test(text)) {
        return {
          text: `Switching to the **Watching** tab right now! Nyaa~ 🐾`,
          expression: "happy",
          actions: [{ label: "👀 View Watching", actionType: "switch-nav", payload: "Watching", autoTrigger: true }]
        };
      }
      if (/take me to completed|show completed tab/i.test(text)) {
        return {
          text: `Switching to the **Completed** tab! 🎉`,
          expression: "celebrate",
          actions: [{ label: "✅ View Completed", actionType: "switch-nav", payload: "Completed", autoTrigger: true }]
        };
      }

      // 23. UNKNOWN / GRACEFUL FALLBACK
      return {
        text: `Mrow? I didn't quite catch that, Senpai! 🐾 \n\nI can help you check your **anime count**, find what you're **watching**, show how to **add an anime**, or tell you about **privacy** and the **creator**! \n\nTry clicking one of these suggestions:`,
        expression: "thinking",
        actions: [
          { label: "📊 Anime Count", query: "How many anime are in my list?" },
          { label: "👀 What am I watching?", query: "What am I watching right now?" },
          { label: "➕ How do I add anime?", query: "How do I add an anime?" },
          { label: "✨ Who created this site?", query: "Who created this website?" }
        ]
      };
    }
  };

  window.AnimeDataAdapter = AnimeDataAdapter;
  window.OllamaConnector = OllamaConnector;
  window.AnibotService = AnibotService;
})(window);
