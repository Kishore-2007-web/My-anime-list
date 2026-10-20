/* ==========================================================================
   ANIBOT UI CONTROLLER - FLOATING LAUNCHER, CHAT INTERFACE & GESTURE SYSTEM
   Pure Glassmorphism Aesthetics • Micro-Animations • Physical Gestures
   ========================================================================== */

(function (window, document) {
  'use strict';

  class AnibotUI {
    constructor() {
      this.isOpen = false;
      this.isTyping = false;
      this.history = [];
      this.currentExpression = 'happy';

      this.initDom();
      this.initEventListeners();
      this.loadWelcomeMessage();
    }

    // -------------------------------------------------------------
    // 1. INJECT DOM ELEMENTS
    // -------------------------------------------------------------
    initDom() {
      // Create Launcher Container
      this.launcherContainer = document.createElement('div');
      this.launcherContainer.className = 'anibot-launcher-container';
      this.launcherContainer.id = 'anibot-launcher-root';

      // Teaser Bubble
      const teaserDismissed = sessionStorage.getItem('anibot_teaser_dismissed') === 'true';
      this.teaserBubble = document.createElement('div');
      this.teaserBubble.className = 'anibot-teaser-bubble';
      this.teaserBubble.id = 'anibot-teaser-bubble';
      this.teaserBubble.style.display = teaserDismissed ? 'none' : 'flex';
      this.teaserBubble.innerHTML = `
        <span>Kon'nichiwa! Need help? ✨</span>
        <button type="button" class="anibot-teaser-close" id="anibot-teaser-close-btn" aria-label="Dismiss">&times;</button>
      `;

      // Floating Button
      this.launcherBtn = document.createElement('button');
      this.launcherBtn.className = 'anibot-launcher-btn';
      this.launcherBtn.id = 'anibot-open-btn';
      this.launcherBtn.type = 'button';
      this.launcherBtn.setAttribute('aria-label', 'Open ANIBOT anime assistant');
      this.launcherBtn.setAttribute('title', 'Chat with ANIBOT');
      this.launcherBtn.innerHTML = `
        <div id="anibot-launcher-mascot-wrap">
          ${window.AnibotMascot ? window.AnibotMascot.renderAvatar('happy', 52) : '🐱'}
        </div>
        <span class="anibot-online-dot"></span>
      `;

      this.launcherContainer.appendChild(this.teaserBubble);
      this.launcherContainer.appendChild(this.launcherBtn);
      document.body.appendChild(this.launcherContainer);

      // Create Chat Panel
      this.chatPanel = document.createElement('div');
      this.chatPanel.className = 'anibot-chat-panel';
      this.chatPanel.id = 'anibot-chat-panel';
      this.chatPanel.setAttribute('role', 'dialog');
      this.chatPanel.setAttribute('aria-label', 'ANIBOT Anime Assistant Chat Window');

      this.chatPanel.innerHTML = `
        <!-- Header -->
        <div class="anibot-header">
          <div class="anibot-header-profile">
            <div class="anibot-header-avatar" id="anibot-header-avatar" title="Click to pet ANIBOT! 🐾">
              ${window.AnibotMascot ? window.AnibotMascot.renderAvatar('happy', 40) : '🐱'}
            </div>
            <div class="anibot-header-info">
              <div class="anibot-header-name">
                ANIBOT <span class="anibot-header-badge">AI MASCOT</span>
              </div>
              <div class="anibot-header-sub">
                <span class="anibot-status-indicator"></span>
                <span>Online & Ready • Kishore</span>
              </div>
            </div>
          </div>
          <div class="anibot-header-controls">
            <button type="button" class="anibot-ctrl-btn" id="anibot-ollama-btn" title="AI Settings / Ollama" aria-label="Ollama AI Settings">
              <i class="fa-solid fa-gear"></i>
            </button>
            <button type="button" class="anibot-ctrl-btn" id="anibot-clear-btn" title="Clear Chat" aria-label="Clear Chat History">
              <i class="fa-solid fa-rotate-right"></i>
            </button>
            <button type="button" class="anibot-ctrl-btn" id="anibot-minimize-btn" title="Minimize" aria-label="Minimize Chat">
              <i class="fa-solid fa-minus"></i>
            </button>
            <button type="button" class="anibot-ctrl-btn close-btn" id="anibot-close-btn" title="Close" aria-label="Close Chat">
              <i class="fa-solid fa-xmark"></i>
            </button>
          </div>
        </div>

        <!-- Interactive Gestures Reaction Bar -->
        <div class="anibot-gestures-bar" id="anibot-gestures-bar">
          <button type="button" class="anibot-gesture-pill" data-gesture="wave" title="Wave to ANIBOT">👋 Wave</button>
          <button type="button" class="anibot-gesture-pill" data-gesture="pet" title="Pet ANIBOT on the head">🐾 Pet Head</button>
          <button type="button" class="anibot-gesture-pill" data-gesture="bounce" title="Dance & Bounce">✨ Dance</button>
          <button type="button" class="anibot-gesture-pill" data-gesture="heart" title="Send Love">💖 Love</button>
          <button type="button" class="anibot-gesture-pill pill-portfolio" data-action-type="open-url" data-payload="https://kishore-portfolio-2026.vercel.app" title="Visit Creator Kishore's Portfolio">🌐 Kishore</button>
        </div>

        <!-- Messages Stream -->
        <div class="anibot-messages-stream" id="anibot-messages-stream"></div>

        <!-- Suggestion Chips Bar -->
        <div class="anibot-chips-bar" id="anibot-chips-bar">
          <button type="button" class="anibot-chip-btn" data-query="Who created this website?">✨ Who created this site?</button>
          <button type="button" class="anibot-chip-btn" data-query="What anime have I added?">What anime have I added?</button>
          <button type="button" class="anibot-chip-btn" data-query="How many anime are in my list?">How many in my list?</button>
          <button type="button" class="anibot-chip-btn" data-query="Which anime am I currently watching?">What am I watching?</button>
          <button type="button" class="anibot-chip-btn" data-query="How do I add an anime?">How do I add an anime?</button>
          <button type="button" class="anibot-chip-btn" data-query="Can you wave to me?">👋 Wave to me</button>
        </div>

        <!-- Input Area -->
        <form class="anibot-input-section" id="anibot-input-form">
          <div class="anibot-input-wrap">
            <textarea
              class="anibot-textarea"
              id="anibot-input-textarea"
              placeholder="Ask ANIBOT anything about your anime or creator..."
              rows="1"
              maxlength="500"
              aria-label="Message ANIBOT"
            ></textarea>
          </div>
          <button type="submit" class="anibot-send-btn" id="anibot-send-btn" aria-label="Send message" title="Send message">
            <i class="fa-solid fa-paper-plane"></i>
          </button>
        </form>

        <!-- Ollama Settings Overlay Modal -->
        <div class="anibot-ollama-modal" id="anibot-ollama-modal">
          <div class="anibot-ollama-header">
            <h3><i class="fa-solid fa-brain" style="color:#ffffff;"></i> Local AI (Ollama) Settings</h3>
            <button type="button" class="anibot-ctrl-btn" id="anibot-ollama-close">&times;</button>
          </div>
          <p style="font-size: 0.8rem; color: #94a3b8; margin-bottom: 1rem; line-height: 1.5;">
            By default, ANIBOT runs 100% offline with lightning-fast deterministic intelligence. You can optionally connect ANIBOT to a locally running Ollama LLM instance on your PC.
          </p>
          <div class="form-group" style="margin-bottom: 0.85rem;">
            <label class="form-label" style="display:flex; align-items:center; gap:0.5rem; cursor:pointer;">
              <input type="checkbox" id="ollama-enable-checkbox" style="width:18px; height:18px; accent-color:#ffffff;">
              <span style="color:#fff; font-weight:700;">Enable Local Ollama Mode</span>
            </label>
          </div>
          <div class="form-group" style="margin-bottom: 0.85rem;">
            <label class="form-label" for="ollama-endpoint-input">Endpoint URL</label>
            <input type="url" id="ollama-endpoint-input" class="form-input" value="http://localhost:11434/api/generate" placeholder="http://localhost:11434/api/generate">
          </div>
          <div class="form-group" style="margin-bottom: 1.25rem;">
            <label class="form-label" for="ollama-model-input">Model Name</label>
            <input type="text" id="ollama-model-input" class="form-input" value="llama3.2" placeholder="e.g. llama3.2, mistral, gemma2:2b">
          </div>
          <div style="display:flex; gap:0.5rem;">
            <button type="button" class="btn-glass-primary" id="ollama-save-btn" style="flex:1;">Save Settings</button>
            <button type="button" class="btn-glass-secondary" id="ollama-cancel-btn">Cancel</button>
          </div>
        </div>
      `;

      document.body.appendChild(this.chatPanel);

      // Elements references
      this.messagesStream = document.getElementById('anibot-messages-stream');
      this.inputForm = document.getElementById('anibot-input-form');
      this.inputTextarea = document.getElementById('anibot-input-textarea');
      this.sendBtn = document.getElementById('anibot-send-btn');
      this.chipsBar = document.getElementById('anibot-chips-bar');
      this.gesturesBar = document.getElementById('anibot-gestures-bar');
      this.headerAvatar = document.getElementById('anibot-header-avatar');
      this.ollamaModal = document.getElementById('anibot-ollama-modal');
    }

    // -------------------------------------------------------------
    // 2. EVENT LISTENERS
    // -------------------------------------------------------------
    initEventListeners() {
      // Toggle Chat Panel
      this.launcherBtn.addEventListener('click', () => {
        this.toggle();
      });

      this.teaserBubble.addEventListener('click', (e) => {
        if (e.target.id === 'anibot-teaser-close-btn') {
          e.stopPropagation();
          this.teaserBubble.style.display = 'none';
          sessionStorage.setItem('anibot_teaser_dismissed', 'true');
          return;
        }
        this.open();
      });

      // Interactive Click on Header Avatar: Pet Head & Spawn Hearts
      if (this.headerAvatar) {
        this.headerAvatar.addEventListener('click', () => {
          this.playGesture('pet', true);
        });
      }

      // Quick Gestures Bar Delegation
      if (this.gesturesBar) {
        this.gesturesBar.addEventListener('click', (e) => {
          const pill = e.target.closest('.anibot-gesture-pill');
          if (!pill) return;
          const gesture = pill.getAttribute('data-gesture');
          const actionType = pill.getAttribute('data-action-type');
          const payload = pill.getAttribute('data-payload');

          if (gesture) {
            this.playGesture(gesture, true);
          } else if (actionType) {
            this.handleAction(actionType, payload);
          }
        });
      }

      // Controls
      document.getElementById('anibot-close-btn').addEventListener('click', () => this.close());
      document.getElementById('anibot-minimize-btn').addEventListener('click', () => this.close());
      document.getElementById('anibot-clear-btn').addEventListener('click', () => this.clearChat());

      // Ollama Settings Modal
      document.getElementById('anibot-ollama-btn').addEventListener('click', () => this.openOllamaModal());
      document.getElementById('anibot-ollama-close').addEventListener('click', () => this.closeOllamaModal());
      document.getElementById('ollama-cancel-btn').addEventListener('click', () => this.closeOllamaModal());
      document.getElementById('ollama-save-btn').addEventListener('click', () => this.saveOllamaSettings());

      // Auto-resize Textarea & Keyboard handling
      this.inputTextarea.addEventListener('input', () => {
        this.inputTextarea.style.height = 'auto';
        this.inputTextarea.style.height = Math.min(this.inputTextarea.scrollHeight, 100) + 'px';
      });

      this.inputTextarea.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
          e.preventDefault();
          this.handleSendMessage();
        }
      });

      this.inputForm.addEventListener('submit', (e) => {
        e.preventDefault();
        this.handleSendMessage();
      });

      // Suggestion Chips Click
      this.chipsBar.addEventListener('click', (e) => {
        const btn = e.target.closest('.anibot-chip-btn');
        if (!btn) return;
        const query = btn.getAttribute('data-query');
        if (query) {
          this.sendQuery(query);
        }
      });

      // Action Buttons & Cards Delegation inside Messages
      this.messagesStream.addEventListener('click', (e) => {
        const actionBtn = e.target.closest('.anibot-action-btn');
        if (actionBtn) {
          const actionType = actionBtn.getAttribute('data-action-type');
          const payload = actionBtn.getAttribute('data-payload');
          const query = actionBtn.getAttribute('data-query');

          if (query) {
            this.sendQuery(query);
          } else if (actionType) {
            this.handleAction(actionType, payload);
          }
        }
      });

      // Close chat with Escape key
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && this.isOpen) {
          this.close();
        }
      });
    }

    // -------------------------------------------------------------
    // 3. CHAT LIFECYCLE & STATE
    // -------------------------------------------------------------
    toggle() {
      if (this.isOpen) {
        this.close();
      } else {
        this.open();
      }
    }

    open() {
      this.isOpen = true;
      this.chatPanel.classList.add('active');
      this.teaserBubble.style.display = 'none';
      sessionStorage.setItem('anibot_teaser_dismissed', 'true');
      this.scrollToBottom();
      setTimeout(() => this.inputTextarea.focus(), 150);
      this.playGesture('wave', false);
    }

    close() {
      this.isOpen = false;
      this.chatPanel.classList.remove('active');
      this.closeOllamaModal();
    }

    clearChat() {
      this.messagesStream.innerHTML = '';
      this.history = [];
      this.setExpression('happy');
      this.loadWelcomeMessage();
    }

    setExpression(expr) {
      this.currentExpression = expr;
      if (window.AnibotMascot) {
        if (this.headerAvatar) {
          this.headerAvatar.innerHTML = window.AnibotMascot.renderAvatar(expr, 40);
        }
        const launcherWrap = document.getElementById('anibot-launcher-mascot-wrap');
        if (launcherWrap) {
          launcherWrap.innerHTML = window.AnibotMascot.renderAvatar(expr, 52);
        }
      }
    }

    // -------------------------------------------------------------
    // GESTURES & ANIMATION SYSTEM
    // -------------------------------------------------------------
    playGesture(gestureName, triggerDialogue = false) {
      const valid = ['wave', 'bounce', 'nod', 'tilt', 'purr', 'pet', 'heart'].includes(gestureName)
        ? gestureName
        : 'bounce';

      // Set expression corresponding to gesture
      const exprMap = {
        wave: 'wave',
        bounce: 'celebrate',
        nod: 'happy',
        tilt: 'thinking',
        purr: 'heart',
        pet: 'heart',
        heart: 'heart'
      };
      this.setExpression(exprMap[valid] || 'happy');

      // Target elements to animate
      const targets = [];
      if (this.headerAvatar) targets.push(this.headerAvatar);
      const launcherWrap = document.getElementById('anibot-launcher-mascot-wrap');
      if (launcherWrap) targets.push(launcherWrap);

      const animClass = `anibot-gesture-${valid === 'heart' ? 'bounce' : valid}`;
      targets.forEach(el => {
        el.classList.remove(
          'anibot-gesture-wave',
          'anibot-gesture-bounce',
          'anibot-gesture-nod',
          'anibot-gesture-tilt',
          'anibot-gesture-purr',
          'anibot-gesture-pet'
        );
        void el.offsetWidth; // Force CSS reflow
        el.classList.add(animClass);
      });

      // Spawn floating hearts on pet or heart gesture
      if (valid === 'pet' || valid === 'heart') {
        this.spawnHeartParticles();
      }

      // Revert animation class after duration
      setTimeout(() => {
        targets.forEach(el => el.classList.remove(animClass));
      }, 1300);

      // Optional trigger dialogue for direct user button clicks
      if (triggerDialogue) {
        const dialogueMap = {
          wave: { text: "Hai hai! *waves cute paw* ✨ Always so wonderful to see you, Senpai! 🐾", expr: "wave" },
          pet: { text: "Nyaa~ 💕 *purrs happily* Ehehe, thank you so much for the headpats, Senpai! 💕 That feels wonderful!", expr: "heart" },
          bounce: { text: "Yatta! 🎉 *happy bouncy joyful dance* Look at me go! Anime makes every day brighter! ✨", expr: "celebrate" },
          heart: { text: "Daisuki! 💖 *blushes with radiant glowing heart eyes* You're the kindest anime master ever! 💕", expr: "heart" }
        };
        if (dialogueMap[valid]) {
          this.appendMessage({
            sender: 'bot',
            text: dialogueMap[valid].text,
            expression: dialogueMap[valid].expr
          });
        }
      }
    }

    spawnHeartParticles() {
      const anchor = this.isOpen && this.headerAvatar ? this.headerAvatar : this.launcherBtn;
      if (!anchor) return;
      const rect = anchor.getBoundingClientRect();
      const emojis = ['💖', '💕', '✨', '🐾', '🌸'];

      for (let i = 0; i < 4; i++) {
        const heart = document.createElement('div');
        heart.className = 'anibot-pet-heart';
        heart.textContent = emojis[i % emojis.length];
        heart.style.left = `${rect.left + rect.width / 2}px`;
        heart.style.top = `${rect.top}px`;
        heart.style.setProperty('--tx', `${(Math.random() - 0.5) * 60}px`);
        document.body.appendChild(heart);

        setTimeout(() => heart.remove(), 1300);
      }
    }

    loadWelcomeMessage() {
      const welcome = {
        sender: 'bot',
        text: `Kon'nichiwa! I'm **ANIBOT**! ✨ Your personal anime companion. \n\nI can track your watchlist, show list stats, perform cute gestures, or tell you about my creator **Kishore**! Nyaa~ 🐾`,
        expression: 'wave',
        gesture: 'wave',
        actions: [
          { label: "🌐 Kishore's Portfolio", actionType: "open-url", payload: "https://kishore-portfolio-2026.vercel.app" },
          { label: "📊 List Summary", query: "Give me a summary of my anime collection" },
          { label: "👀 What am I watching?", query: "What am I watching right now?" },
          { label: "🐾 Pet ANIBOT", actionType: "trigger-gesture", payload: "pet" }
        ]
      };
      this.appendMessage(welcome);
    }

    // -------------------------------------------------------------
    // 4. MESSAGE HANDLING & DISPATCH
    // -------------------------------------------------------------
    sendQuery(queryText) {
      if (!queryText || this.isTyping) return;
      this.inputTextarea.value = queryText;
      this.handleSendMessage();
    }

    async handleSendMessage() {
      const rawText = this.inputTextarea.value.trim();
      if (!rawText || this.isTyping) return;

      // Append User Message
      this.appendMessage({ sender: 'user', text: rawText });
      this.inputTextarea.value = '';
      this.inputTextarea.style.height = 'auto';

      // Show Typing Indicator & switch expression to thinking
      this.showTypingIndicator();
      this.setExpression('thinking');

      // Process message through AnibotService
      try {
        const reply = await window.AnibotService.processMessage(rawText);

        // Small realistic micro-delay (350ms) so response feels natural
        setTimeout(() => {
          this.hideTypingIndicator();
          this.appendMessage({
            sender: 'bot',
            text: reply.text,
            expression: reply.expression || 'happy',
            actions: reply.actions || [],
            cards: reply.cards || []
          });
          this.setExpression(reply.expression || 'happy');

          // Trigger physical gesture if provided
          if (reply.gesture) {
            this.playGesture(reply.gesture, false);
          }

          // Auto-trigger actions if specified (e.g. navigation)
          if (Array.isArray(reply.actions)) {
            const autoAction = reply.actions.find(a => a.autoTrigger && a.actionType);
            if (autoAction) {
              setTimeout(() => this.handleAction(autoAction.actionType, autoAction.payload), 400);
            }
          }
        }, 350);
      } catch (err) {
        console.error("[ANIBOT] Error generating response:", err);
        this.hideTypingIndicator();
        this.appendMessage({
          sender: 'bot',
          text: `Gomen ne! 😿 Something went a little fuzzy while checking that. Please ask me again!`,
          expression: 'sleepy'
        });
        this.setExpression('sleepy');
      }
    }

    // -------------------------------------------------------------
    // 5. MESSAGE RENDERING
    // -------------------------------------------------------------
    appendMessage(msg) {
      this.history.push(msg);

      const row = document.createElement('div');
      row.className = `anibot-msg-row ${msg.sender}`;

      let avatarHtml = '';
      if (msg.sender === 'bot') {
        avatarHtml = `
          <div class="anibot-msg-avatar">
            ${window.AnibotMascot ? window.AnibotMascot.renderAvatar(msg.expression || 'happy', 28) : '🐱'}
          </div>
        `;
      }

      // Format markdown & safe text (including links)
      const formattedText = this.formatMarkdown(msg.text);

      // Render optional compact anime cards
      let cardsHtml = '';
      if (Array.isArray(msg.cards) && msg.cards.length > 0) {
        cardsHtml = `<div class="anibot-cards-container">`;
        msg.cards.forEach(card => {
          const safeTitle = this.escapeHtml(card.title || 'Untitled');
          const safeStatus = this.escapeHtml(card.status || '');
          const safePoster = card.poster || 'https://images.unsplash.com/photo-1578632767115-351597cf2477?q=80&w=200';
          const safeLink = card.link || '#';

          cardsHtml += `
            <div class="anibot-compact-card">
              <img src="${safePoster}" alt="${safeTitle}" class="anibot-card-thumb" onerror="this.src='assets/icons/icon-192.png'">
              <div class="anibot-card-details">
                <div class="anibot-card-title">${safeTitle}</div>
                <div class="anibot-card-status">${safeStatus}</div>
              </div>
              <a href="${safeLink}" target="_blank" rel="noopener noreferrer" class="anibot-card-play-btn" title="Launch stream">
                <i class="fa-solid fa-play"></i> Watch
              </a>
            </div>
          `;
        });
        cardsHtml += `</div>`;
      }

      // Render action buttons
      let actionsHtml = '';
      if (Array.isArray(msg.actions) && msg.actions.length > 0) {
        actionsHtml = `<div class="anibot-msg-actions">`;
        msg.actions.forEach(action => {
          const safeLabel = this.escapeHtml(action.label || 'Action');
          const actionTypeAttr = action.actionType ? `data-action-type="${action.actionType}"` : '';
          const payloadAttr = action.payload ? `data-payload="${this.escapeHtml(action.payload)}"` : '';
          const queryAttr = action.query ? `data-query="${this.escapeHtml(action.query)}"` : '';

          actionsHtml += `
            <button type="button" class="anibot-action-btn" ${actionTypeAttr} ${payloadAttr} ${queryAttr}>
              ${safeLabel}
            </button>
          `;
        });
        actionsHtml += `</div>`;
      }

      row.innerHTML = `
        ${avatarHtml}
        <div class="anibot-msg-bubble">
          ${formattedText}
          ${cardsHtml}
          ${actionsHtml}
        </div>
      `;

      this.messagesStream.appendChild(row);
      this.scrollToBottom();
    }

    showTypingIndicator() {
      this.isTyping = true;
      const row = document.createElement('div');
      row.className = 'anibot-msg-row bot anibot-typing-row';
      row.id = 'anibot-typing-indicator';
      row.innerHTML = `
        <div class="anibot-msg-avatar">
          ${window.AnibotMascot ? window.AnibotMascot.renderAvatar('thinking', 28) : '🐱'}
        </div>
        <div class="anibot-msg-bubble anibot-typing-bubble">
          <span class="anibot-typing-dot"></span>
          <span class="anibot-typing-dot"></span>
          <span class="anibot-typing-dot"></span>
        </div>
      `;
      this.messagesStream.appendChild(row);
      this.scrollToBottom();
    }

    hideTypingIndicator() {
      this.isTyping = false;
      const el = document.getElementById('anibot-typing-indicator');
      if (el) el.remove();
    }

    scrollToBottom() {
      requestAnimationFrame(() => {
        if (this.messagesStream) {
          this.messagesStream.scrollTop = this.messagesStream.scrollHeight;
        }
      });
    }

    // -------------------------------------------------------------
    // 6. ACTION EXECUTOR (Interacts with Real Website & External Links)
    // -------------------------------------------------------------
    handleAction(actionType, payload) {
      const app = window.animeNavigator;

      switch (actionType) {
        case 'open-url':
          if (payload) {
            window.open(payload, '_blank', 'noopener,noreferrer');
          }
          break;

        case 'trigger-gesture':
          if (payload) {
            this.playGesture(payload, true);
          }
          break;

        case 'open-add-modal':
          if (app && app.addModal) {
            app.clearError(app.addErrorMsg);
            if (payload) {
              const titleInput = document.getElementById('add-title');
              if (titleInput) titleInput.value = payload;
            }
            app.addModal.classList.add('active');
          }
          break;

        case 'open-backup-modal':
          if (app) app.openBackupModal();
          break;

        case 'open-privacy-modal':
          if (app && app.privacyModal) app.privacyModal.classList.add('active');
          break;

        case 'open-guide-modal':
          if (app && app.guideModal) app.guideModal.classList.add('active');
          break;

        case 'toggle-wallpaper':
          if (app) app.toggleWallpaper();
          break;

        case 'prompt-install':
          if (app) app.promptInstall();
          break;

        case 'switch-nav':
          if (app && typeof app.switchNav === 'function') {
            app.switchNav(payload);
          }
          break;

        case 'focus-search':
          const searchInput = document.getElementById('search-input');
          if (searchInput) {
            searchInput.focus();
            searchInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
          break;

        case 'apply-search':
          const sInput = document.getElementById('search-input');
          if (sInput) {
            sInput.value = payload || '';
            sInput.dispatchEvent(new Event('input', { bubbles: true }));
            sInput.focus();
          }
          break;

        default:
          console.warn("[ANIBOT] Unrecognized action type:", actionType);
          break;
      }
    }

    // -------------------------------------------------------------
    // 7. OLLAMA CONFIGURATION MODAL
    // -------------------------------------------------------------
    openOllamaModal() {
      const cfg = window.OllamaConnector ? window.OllamaConnector.getConfig() : {};
      const chk = document.getElementById('ollama-enable-checkbox');
      const ep = document.getElementById('ollama-endpoint-input');
      const mod = document.getElementById('ollama-model-input');

      if (chk) chk.checked = Boolean(cfg.enabled);
      if (ep) ep.value = cfg.endpoint || 'http://localhost:11434/api/generate';
      if (mod) mod.value = cfg.model || 'llama3.2';

      if (this.ollamaModal) this.ollamaModal.classList.add('active');
    }

    closeOllamaModal() {
      if (this.ollamaModal) this.ollamaModal.classList.remove('active');
    }

    saveOllamaSettings() {
      const chk = document.getElementById('ollama-enable-checkbox');
      const ep = document.getElementById('ollama-endpoint-input');
      const mod = document.getElementById('ollama-model-input');

      const cfg = {
        enabled: Boolean(chk && chk.checked),
        endpoint: (ep && ep.value.trim()) || 'http://localhost:11434/api/generate',
        model: (mod && mod.value.trim()) || 'llama3.2'
      };

      if (window.OllamaConnector) {
        window.OllamaConnector.saveConfig(cfg);
      }

      this.closeOllamaModal();
      this.appendMessage({
        sender: 'bot',
        text: cfg.enabled
          ? `Ollama AI mode is **enabled**! ✨ Endpoint: \`${cfg.endpoint}\` (Model: \`${cfg.model}\`). If Ollama is offline or uninstalled, I'll instantly fallback to local intelligence.`
          : `Switched to **Fast Local Intelligence** mode! 100% private and offline. 🐾`,
        expression: 'happy'
      });
    }

    // -------------------------------------------------------------
    // 8. HELPERS & FORMATTING
    // -------------------------------------------------------------
    escapeHtml(str) {
      if (!str) return '';
      return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
    }

    formatMarkdown(text) {
      if (!text) return '';
      let escaped = this.escapeHtml(text);

      // Markdown Links: [label](url)
      escaped = escaped.replace(
        /\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g,
        '<a href="$2" target="_blank" rel="noopener noreferrer" class="anibot-link">$1 <i class="fa-solid fa-arrow-up-right-from-square" style="font-size:0.75em; margin-left:2px;"></i></a>'
      );

      // Raw URLs that weren't inside markdown links:
      escaped = escaped.replace(
        /(^|[^"'>])(https:\/\/[^\s<]+)/g,
        '$1<a href="$2" target="_blank" rel="noopener noreferrer" class="anibot-link">$2 <i class="fa-solid fa-arrow-up-right-from-square" style="font-size:0.75em; margin-left:2px;"></i></a>'
      );

      // Bold: **text**
      escaped = escaped.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

      // Italics: *text*
      escaped = escaped.replace(/\*(.*?)\*/g, '<em>$1</em>');

      // Inline code: `code`
      escaped = escaped.replace(
        /`([^`]+)`/g,
        '<code style="background:rgba(0,0,0,0.5); padding:1px 4px; border-radius:4px; font-family:monospace; font-size:0.85em;">$1</code>'
      );

      // Bullet lists: lines starting with • or - or number.
      escaped = escaped.replace(/\n•\s*(.*)/g, '<br>&bull; $1');
      escaped = escaped.replace(/\n\d+\.\s*(.*)/g, '<br>&bull; $1');

      // Newlines
      escaped = escaped.replace(/\n\n/g, '<p style="margin-top:0.4rem;"></p>');
      escaped = escaped.replace(/\n/g, '<br>');

      return escaped;
    }
  }

  // Initialize ANIBOT UI after DOM is ready
  document.addEventListener('DOMContentLoaded', () => {
    window.anibotUI = new AnibotUI();
  });

})(window, document);
