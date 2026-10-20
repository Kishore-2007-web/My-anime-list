/* ==========================================================================
   ANIBOT MASCOT - ORIGINAL KAWAII CHIBI ANIME CAT-GIRL VECTOR ENGINE
   ========================================================================== */

(function (window) {
  'use strict';

  /**
   * ANIBOT Mascot Vector Renderer
   * Renders high-quality original SVG artwork with dynamic facial expressions:
   * 'happy' | 'talking' | 'thinking' | 'celebrate' | 'sleepy' | 'wink'
   */
  const AnibotMascot = {
    // Generate SVG string for ANIBOT avatar
    renderAvatar(expression = 'happy', size = 48) {
      const validExpr = ['happy', 'talking', 'thinking', 'celebrate', 'sleepy', 'wink'].includes(expression)
        ? expression
        : 'happy';

      let eyesSvg = '';
      let mouthSvg = '';
      let extraSvg = '';

      switch (validExpr) {
        case 'talking':
          // Lively open eyes, animated talking mouth
          eyesSvg = `
            <!-- Left Eye -->
            <ellipse cx="36" cy="48" rx="7" ry="9" fill="#1e1b4b" />
            <circle cx="34" cy="44" r="3.2" fill="#ffffff" />
            <circle cx="38" cy="51" r="1.5" fill="#38bdf8" />
            <!-- Right Eye -->
            <ellipse cx="64" cy="48" rx="7" ry="9" fill="#1e1b4b" />
            <circle cx="62" cy="44" r="3.2" fill="#ffffff" />
            <circle cx="66" cy="51" r="1.5" fill="#38bdf8" />
          `;
          mouthSvg = `
            <!-- Talking Animated Open Mouth -->
            <path d="M46 59 Q50 66 54 59 Z" fill="#f43f5e" />
            <path d="M47 60 Q50 63 53 60" stroke="#fecdd3" stroke-width="1.2" stroke-linecap="round" fill="none" />
          `;
          break;

        case 'thinking':
          // Eyes looking up-right thoughtfully, small 'o' mouth, thought star
          eyesSvg = `
            <!-- Left Eye looking up-right -->
            <ellipse cx="36" cy="46" rx="6.5" ry="8.5" fill="#1e1b4b" />
            <circle cx="37" cy="43" r="3" fill="#ffffff" />
            <circle cx="38" cy="49" r="1.4" fill="#a855f7" />
            <!-- Right Eye looking up-right -->
            <ellipse cx="64" cy="46" rx="6.5" ry="8.5" fill="#1e1b4b" />
            <circle cx="65" cy="43" r="3" fill="#ffffff" />
            <circle cx="66" cy="49" r="1.4" fill="#a855f7" />
          `;
          mouthSvg = `
            <!-- Small curious 'o' mouth -->
            <circle cx="50" cy="61" r="2.8" fill="#f43f5e" />
          `;
          extraSvg = `
            <!-- Floating thought bubble sparkle -->
            <g class="anibot-sparkle-float">
              <path d="M78 28 L80 22 L82 28 L88 30 L82 32 L80 38 L78 32 L72 30 Z" fill="#fde047" />
              <circle cx="86" cy="38" r="1.5" fill="#fde047" />
            </g>
          `;
          break;

        case 'celebrate':
          // Starry glowing eyes, wide happy cat grin, sparkles
          eyesSvg = `
            <!-- Left Star Eye -->
            <path d="M36 40 L38.5 45 L44 46 L40 50 L41 55.5 L36 52.5 L31 55.5 L32 50 L28 46 L33.5 45 Z" fill="#facc15" />
            <circle cx="36" cy="48" r="2.2" fill="#ffffff" />
            <!-- Right Star Eye -->
            <path d="M64 40 L66.5 45 L72 46 L68 50 L69 55.5 L64 52.5 L59 55.5 L60 50 L56 46 L61.5 45 Z" fill="#facc15" />
            <circle cx="64" cy="48" r="2.2" fill="#ffffff" />
          `;
          mouthSvg = `
            <!-- Joyous wide open smile -->
            <path d="M43 59 Q50 71 57 59 Z" fill="#f43f5e" />
            <path d="M45 61 Q50 67 55 61" fill="#fb7185" />
          `;
          extraSvg = `
            <!-- Celebration Confetti Sparkles -->
            <path d="M18 30 L20 25 L22 30 L27 32 L22 34 L20 39 L18 34 L13 32 Z" fill="#38bdf8" class="anibot-sparkle-left" />
            <path d="M82 26 L84 21 L86 26 L91 28 L86 30 L84 35 L82 30 L77 28 Z" fill="#fb7185" class="anibot-sparkle-right" />
          `;
          break;

        case 'sleepy':
          // Curved gentle closed sleeping eyes, droopy ears aesthetic, gentle zZ
          eyesSvg = `
            <!-- Left Sleeping Eye -->
            <path d="M30 50 Q36 56 42 50" stroke="#312e81" stroke-width="2.5" stroke-linecap="round" fill="none" />
            <!-- Right Sleeping Eye -->
            <path d="M58 50 Q64 56 70 50" stroke="#312e81" stroke-width="2.5" stroke-linecap="round" fill="none" />
          `;
          mouthSvg = `
            <!-- Soft relaxed cat mouth -->
            <path d="M47 60 Q50 62 53 60" stroke="#f43f5e" stroke-width="1.8" stroke-linecap="round" fill="none" />
          `;
          extraSvg = `
            <!-- Gentle floating zZ -->
            <g class="anibot-sleep-float">
              <text x="76" y="32" font-family="'Plus Jakarta Sans', sans-serif" font-size="12" font-weight="bold" fill="#38bdf8" opacity="0.9">Z</text>
              <text x="84" y="24" font-family="'Plus Jakarta Sans', sans-serif" font-size="9" font-weight="bold" fill="#818cf8" opacity="0.7">z</text>
            </g>
          `;
          break;

        case 'wink':
          // Left eye winking playful curved line, right eye wide open and sparkling
          eyesSvg = `
            <!-- Left Winking Eye -->
            <path d="M29 50 Q35 43 42 50" stroke="#1e1b4b" stroke-width="3" stroke-linecap="round" fill="none" />
            <!-- Right Open Eye -->
            <ellipse cx="64" cy="48" rx="7" ry="9" fill="#1e1b4b" />
            <circle cx="62" cy="44" r="3.2" fill="#ffffff" />
            <circle cx="66" cy="51" r="1.5" fill="#38bdf8" />
          `;
          mouthSvg = `
            <!-- Playful cat smirk -->
            <path d="M45 58 Q48 62 50 59 Q52 62 55 58" stroke="#f43f5e" stroke-width="2" stroke-linecap="round" fill="none" />
          `;
          extraSvg = `
            <!-- Wink twinkle -->
            <path d="M22 44 L24 40 L26 44 L30 46 L26 48 L24 52 L22 48 L18 46 Z" fill="#facc15" />
          `;
          break;

        case 'happy':
        default:
          // Default: Big sparkling anime eyes with double reflections, cute cat mouth :3
          eyesSvg = `
            <!-- Left Eye -->
            <ellipse cx="36" cy="48" rx="7" ry="9.5" fill="#1e1b4b" class="anibot-eye" />
            <ellipse cx="36" cy="48" rx="5.5" ry="8" fill="url(#anibot-eye-grad)" />
            <circle cx="34" cy="43.5" r="3.2" fill="#ffffff" />
            <circle cx="38" cy="51.5" r="1.6" fill="#7dd3fc" />
            <circle cx="33" cy="51" r="1" fill="#ffffff" />
            <!-- Left Upper Eyelash -->
            <path d="M27 43 Q36 38 43 43" stroke="#0f172a" stroke-width="2.5" stroke-linecap="round" fill="none" />
            <path d="M41 40 L44 38" stroke="#0f172a" stroke-width="1.8" stroke-linecap="round" />

            <!-- Right Eye -->
            <ellipse cx="64" cy="48" rx="7" ry="9.5" fill="#1e1b4b" class="anibot-eye" />
            <ellipse cx="64" cy="48" rx="5.5" ry="8" fill="url(#anibot-eye-grad)" />
            <circle cx="62" cy="43.5" r="3.2" fill="#ffffff" />
            <circle cx="66" cy="51.5" r="1.6" fill="#7dd3fc" />
            <circle cx="61" cy="51" r="1" fill="#ffffff" />
            <!-- Right Upper Eyelash -->
            <path d="M57 43 Q64 38 73 43" stroke="#0f172a" stroke-width="2.5" stroke-linecap="round" fill="none" />
            <path d="M71 40 L74 38" stroke="#0f172a" stroke-width="1.8" stroke-linecap="round" />
          `;
          mouthSvg = `
            <!-- Cute Kawaii Cat Smile :3 -->
            <path d="M44 58 Q47 62 50 59 Q53 62 56 58" stroke="#f43f5e" stroke-width="2" stroke-linecap="round" fill="none" />
          `;
          break;
      }

      return `
        <svg class="anibot-svg-mascot expr-${validExpr}" viewBox="0 0 100 100" width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="ANIBOT anime mascot (${validExpr})">
          <defs>
            <!-- Luminous Eye Gradient -->
            <linearGradient id="anibot-eye-grad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stop-color="#312e81" />
              <stop offset="60%" stop-color="#38bdf8" />
              <stop offset="100%" stop-color="#0284c7" />
            </linearGradient>

            <!-- Ear Inner Soft Gradient -->
            <linearGradient id="anibot-ear-inner" x1="0%" y1="100%" x2="0%" y2="0%">
              <stop offset="0%" stop-color="#f472b6" />
              <stop offset="100%" stop-color="#fbcfe8" />
            </linearGradient>

            <!-- Hair Soft Gradient -->
            <linearGradient id="anibot-hair-grad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stop-color="#ffffff" />
              <stop offset="70%" stop-color="#fef9c3" />
              <stop offset="100%" stop-color="#fef08a" />
            </linearGradient>

            <!-- Star Clip Gradient -->
            <linearGradient id="anibot-star-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#fef08a" />
              <stop offset="50%" stop-color="#facc15" />
              <stop offset="100%" stop-color="#eab308" />
            </linearGradient>

            <!-- Soft Blush Glow -->
            <radialGradient id="anibot-blush" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stop-color="#fb7185" stop-opacity="0.65" />
              <stop offset="100%" stop-color="#fb7185" stop-opacity="0" />
            </radialGradient>
          </defs>

          <!-- Drop Shadow / Glow Base -->
          <circle cx="50" cy="52" r="44" fill="rgba(56, 189, 248, 0.12)" />

          <!-- Cat Ears (Left & Right) -->
          <!-- Left Ear -->
          <g class="anibot-ear-left">
            <path d="M16 42 Q10 16 34 16 Q36 28 32 40 Z" fill="#ffffff" stroke="#f1f5f9" stroke-width="1.5" />
            <path d="M19 38 Q16 22 30 22 Q32 29 28 37 Z" fill="url(#anibot-ear-inner)" />
            <!-- Inner Ear Fluff -->
            <path d="M22 36 Q20 32 24 30 Q23 34 26 35" stroke="#ffffff" stroke-width="1.2" stroke-linecap="round" fill="none" />
          </g>

          <!-- Right Ear -->
          <g class="anibot-ear-right">
            <path d="M84 42 Q90 16 66 16 Q64 28 68 40 Z" fill="#ffffff" stroke="#f1f5f9" stroke-width="1.5" />
            <path d="M81 38 Q84 22 70 22 Q68 29 72 37 Z" fill="url(#anibot-ear-inner)" />
            <!-- Inner Ear Fluff -->
            <path d="M78 36 Q80 32 76 30 Q77 34 74 35" stroke="#ffffff" stroke-width="1.2" stroke-linecap="round" fill="none" />
          </g>

          <!-- Chibi Head Base (Warm porcelain cream) -->
          <ellipse cx="50" cy="54" rx="39" ry="35" fill="#fffdfa" stroke="#e2e8f0" stroke-width="1" />

          <!-- Cute Cheek Blush -->
          <ellipse cx="26" cy="57" rx="8" ry="4.5" fill="url(#anibot-blush)" />
          <ellipse cx="74" cy="57" rx="8" ry="4.5" fill="url(#anibot-blush)" />

          <!-- Anime Whiskers (Subtle kawaii marks) -->
          <path d="M14 55 Q20 56 24 57 M13 60 Q19 60 23 60" stroke="#fecdd3" stroke-width="1.2" stroke-linecap="round" />
          <path d="M86 55 Q80 56 76 57 M87 60 Q81 60 77 60" stroke="#fecdd3" stroke-width="1.2" stroke-linecap="round" />

          <!-- Chibi Anime Eyes Dynamic Layer -->
          <g class="anibot-eyes-group">
            ${eyesSvg}
          </g>

          <!-- Cute Tiny Nose -->
          <circle cx="50" cy="54.5" r="1.2" fill="#fb7185" />

          <!-- Dynamic Mouth -->
          <g class="anibot-mouth-group">
            ${mouthSvg}
          </g>

          <!-- Cute Front Chibi Hair & Bangs (Soft White/Cream with Sunshine-Yellow Highlights) -->
          <g class="anibot-hair-group">
            <!-- Back Hair Layer Frame -->
            <path d="M14 46 Q10 68 20 82 Q24 74 20 54 Z" fill="url(#anibot-hair-grad)" />
            <path d="M86 46 Q90 68 80 82 Q76 74 80 54 Z" fill="url(#anibot-hair-grad)" />

            <!-- Forehead Bangs -->
            <path d="M24 30 Q36 40 44 32 Q52 42 62 30 Q72 38 78 30 Q76 22 50 20 Q26 22 24 30 Z" fill="url(#anibot-hair-grad)" />
            <!-- Soft Bang Strands -->
            <path d="M38 27 Q44 35 48 29" stroke="#fef08a" stroke-width="1.8" stroke-linecap="round" fill="none" />
            <path d="M52 28 Q56 36 62 28" stroke="#fef08a" stroke-width="1.8" stroke-linecap="round" fill="none" />
            <!-- Ahoge (Cute Single Playful Hair Strand on Top) -->
            <path d="M50 20 Q48 10 56 12 Q58 14 52 18" stroke="#fde047" stroke-width="2.2" stroke-linecap="round" fill="none" class="anibot-ahoge" />
          </g>

          <!-- Signature Star Hair Clip (Left Ear/Hair accessory) -->
          <g class="anibot-star-clip" transform="translate(24, 23)">
            <path d="M0 -7 L2 -2 L7 -2 L3 2 L5 7 L0 4 L-5 7 L-3 2 L-7 -2 L-2 -2 Z" fill="url(#anibot-star-grad)" stroke="#ca8a04" stroke-width="0.8" />
            <circle cx="0" cy="0" r="1.8" fill="#ffffff" />
            <circle cx="-1" cy="-2" r="0.8" fill="#ffffff" />
          </g>

          <!-- Extra Expressions / Particles Layer -->
          ${extraSvg}
        </svg>
      `;
    },

    // Attach expression controller to an existing DOM container
    attachTo(container, initialExpression = 'happy', size = 52) {
      if (!container) return;
      container.innerHTML = this.renderAvatar(initialExpression, size);

      return {
        setExpression: (expr) => {
          container.innerHTML = this.renderAvatar(expr, size);
        }
      };
    }
  };

  window.AnibotMascot = AnibotMascot;
})(window);
