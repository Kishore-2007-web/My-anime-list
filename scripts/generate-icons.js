const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

// Ensure output directory exists
const ICONS_DIR = path.join(__dirname, '..', 'assets', 'icons');
if (!fs.existsSync(ICONS_DIR)) {
  fs.mkdirSync(ICONS_DIR, { recursive: true });
}

// -------------------------------------------------------------
// SVG GENERATOR
// -------------------------------------------------------------
function generateSVG(isMaskable = false) {
  const padding = isMaskable ? 80 : 20;
  const size = 512;
  const center = size / 2;
  const scale = (size - padding * 2) / (size - 40);

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="100%" height="100%">
  <defs>
    <!-- Background Gradient -->
    <radialGradient id="bgGrad" cx="50%" cy="40%" r="65%">
      <stop offset="0%" stop-color="#1a1c35" />
      <stop offset="50%" stop-color="#0e1022" />
      <stop offset="100%" stop-color="#04050a" />
    </radialGradient>

    <!-- Glowing Border Gradient -->
    <linearGradient id="borderGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#38bdf8" stop-opacity="0.9" />
      <stop offset="50%" stop-color="#a855f7" stop-opacity="0.8" />
      <stop offset="100%" stop-color="#f43f5e" stop-opacity="0.6" />
    </linearGradient>

    <!-- Star Primary Facet Gradients -->
    <linearGradient id="facetLight" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#ffffff" />
      <stop offset="60%" stop-color="#c084fc" />
      <stop offset="100%" stop-color="#a855f7" />
    </linearGradient>

    <linearGradient id="facetDark" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#9333ea" />
      <stop offset="60%" stop-color="#6b21a8" />
      <stop offset="100%" stop-color="#3b0764" />
    </linearGradient>

    <linearGradient id="facetCyanLight" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#e0f2fe" />
      <stop offset="100%" stop-color="#38bdf8" />
    </linearGradient>

    <linearGradient id="facetCyanDark" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0284c7" />
      <stop offset="100%" stop-color="#0369a1" />
    </linearGradient>

    <!-- Center Gem Glow -->
    <radialGradient id="coreGlow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#ffffff" />
      <stop offset="40%" stop-color="#38bdf8" />
      <stop offset="80%" stop-color="#a855f7" stop-opacity="0.8" />
      <stop offset="100%" stop-color="#a855f7" stop-opacity="0" />
    </radialGradient>

    <!-- Glow Filter -->
    <filter id="neonGlow" x="-30%" y="-30%" width="160%" height="160%">
      <feGaussianBlur stdDeviation="8" result="blur" />
      <feMerge>
        <feMergeNode in="blur" />
        <feMergeNode in="SourceGraphic" />
      </feMerge>
    </filter>

    <filter id="softGlow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="16" />
    </filter>
  </defs>

  <!-- Background Base -->
  ${isMaskable
    ? `<rect width="512" height="512" fill="url(#bgGrad)" />`
    : `<rect width="512" height="512" rx="112" fill="url(#bgGrad)" />
       <rect width="504" height="504" x="4" y="4" rx="108" fill="none" stroke="url(#borderGrad)" stroke-width="2.5" opacity="0.6" />`
  }

  <!-- Ambient Glow Behind Dial -->
  <circle cx="${center}" cy="${center}" r="${180 * scale}" fill="#a855f7" opacity="0.25" filter="url(#softGlow)" />
  <circle cx="${center}" cy="${center}" r="${120 * scale}" fill="#38bdf8" opacity="0.2" filter="url(#softGlow)" />

  <g transform="translate(${center}, ${center}) scale(${scale}) translate(-${center}, -${center})">
    <!-- Outer Glass Compass Dial Rings -->
    <circle cx="256" cy="256" r="195" fill="none" stroke="rgba(255,255,255,0.08)" stroke-width="1.5" />
    <circle cx="256" cy="256" r="185" fill="none" stroke="url(#borderGrad)" stroke-width="2" opacity="0.4" />
    <circle cx="256" cy="256" r="150" fill="none" stroke="rgba(255,255,255,0.12)" stroke-dasharray="3 8" stroke-width="2" />
    <circle cx="256" cy="256" r="115" fill="rgba(255,255,256,0.02)" stroke="rgba(168,85,247,0.3)" stroke-width="1.5" />

    <!-- Compass Dial Cardinal Ticks -->
    <line x1="256" y1="62" x2="256" y2="76" stroke="#ffffff" stroke-width="3" stroke-linecap="round" />
    <line x1="256" y1="436" x2="256" y2="450" stroke="#a855f7" stroke-width="3" stroke-linecap="round" />
    <line x1="62" y1="256" x2="76" y2="256" stroke="#38bdf8" stroke-width="3" stroke-linecap="round" />
    <line x1="436" y1="256" x2="450" y2="256" stroke="#38bdf8" stroke-width="3" stroke-linecap="round" />

    <!-- Diagonal Small Dots -->
    <circle cx="120" cy="120" r="3.5" fill="#a855f7" opacity="0.7" />
    <circle cx="392" cy="120" r="3.5" fill="#a855f7" opacity="0.7" />
    <circle cx="120" cy="392" r="3.5" fill="#a855f7" opacity="0.7" />
    <circle cx="392" cy="392" r="3.5" fill="#a855f7" opacity="0.7" />

    <!-- 8-Point Compass Star -->
    <g filter="url(#neonGlow)">
      <!-- Diagonal Secondary Points (Cyan/Blue Theme) -->
      <!-- NE -->
      <polygon points="256,256 256,155 327,185" fill="url(#facetCyanLight)" />
      <polygon points="256,256 357,256 327,185" fill="url(#facetCyanDark)" />
      <!-- NW -->
      <polygon points="256,256 256,155 185,185" fill="url(#facetCyanDark)" />
      <polygon points="256,256 155,256 185,185" fill="url(#facetCyanLight)" />
      <!-- SE -->
      <polygon points="256,256 357,256 327,327" fill="url(#facetCyanLight)" />
      <polygon points="256,256 256,357 327,327" fill="url(#facetCyanDark)" />
      <!-- SW -->
      <polygon points="256,256 155,256 185,327" fill="url(#facetCyanDark)" />
      <polygon points="256,256 256,357 185,327" fill="url(#facetCyanLight)" />

      <!-- Cardinal Primary Points (Violet/White Theme) -->
      <!-- North (Longest / Leading Needle) -->
      <polygon points="256,256 256,80 230,225" fill="url(#facetLight)" />
      <polygon points="256,256 256,80 282,225" fill="url(#facetDark)" />

      <!-- South -->
      <polygon points="256,256 256,432 282,287" fill="url(#facetLight)" />
      <polygon points="256,256 256,432 230,287" fill="url(#facetDark)" />

      <!-- East -->
      <polygon points="256,256 432,256 287,230" fill="url(#facetLight)" />
      <polygon points="256,256 432,256 287,282" fill="url(#facetDark)" />

      <!-- West -->
      <polygon points="256,256 80,256 225,282" fill="url(#facetLight)" />
      <polygon points="256,256 80,256 225,230" fill="url(#facetDark)" />
    </g>

    <!-- Center Radiant Crystal Gem -->
    <circle cx="256" cy="256" r="32" fill="url(#coreGlow)" />
    <circle cx="256" cy="256" r="16" fill="#ffffff" />
    <polygon points="256,236 270,256 256,276 242,256" fill="#38bdf8" opacity="0.9" />
    <polygon points="256,242 265,256 256,270 247,256" fill="#ffffff" />
  </g>
</svg>`;
}

// -------------------------------------------------------------
// PURE JS PNG ENCODER WITH ANTIALIASED PROCEDURAL RENDERER
// -------------------------------------------------------------
const crcTable = new Uint32Array(256);
for (let n = 0; n < 256; n++) {
  let c = n;
  for (let k = 0; k < 8; k++) {
    c = (c & 1) ? (0xedb88320 ^ (c >>> 1)) : (c >>> 1);
  }
  crcTable[n] = c;
}

function crc32(buf) {
  let crc = 0xffffffff;
  for (let i = 0; i < buf.length; i++) {
    crc = crcTable[(crc ^ buf[i]) & 0xff] ^ (crc >>> 8);
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function makeChunk(type, data) {
  const len = data.length;
  const buf = Buffer.alloc(4 + 4 + len + 4);
  buf.writeUInt32BE(len, 0);
  buf.write(type, 4, 4, 'ascii');
  data.copy(buf, 8);
  const toCrc = buf.subarray(4, 8 + len);
  buf.writeUInt32BE(crc32(toCrc), 8 + len);
  return buf;
}

function encodePNG(width, height, getPixelRGBA) {
  const rowSize = 1 + width * 4;
  const rawData = Buffer.alloc(rowSize * height);

  for (let y = 0; y < height; y++) {
    const rowOffset = y * rowSize;
    rawData[rowOffset] = 0;
    for (let x = 0; x < width; x++) {
      const [r, g, b, a] = getPixelRGBA(x, y, width, height);
      const pxOffset = rowOffset + 1 + x * 4;
      rawData[pxOffset] = r;
      rawData[pxOffset + 1] = g;
      rawData[pxOffset + 2] = b;
      rawData[pxOffset + 3] = a;
    }
  }

  const ihdrData = Buffer.alloc(13);
  ihdrData.writeUInt32BE(width, 0);
  ihdrData.writeUInt32BE(height, 4);
  ihdrData[8] = 8;
  ihdrData[9] = 6;
  ihdrData[10] = 0;
  ihdrData[11] = 0;
  ihdrData[12] = 0;

  const header = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
  const ihdrChunk = makeChunk('IHDR', ihdrData);
  const idatChunk = makeChunk('IDAT', zlib.deflateSync(rawData, { level: 9 }));
  const iendChunk = makeChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([header, ihdrChunk, idatChunk, iendChunk]);
}

// -------------------------------------------------------------
// PROCEDURAL PIXEL SHADER FOR CRISP ICONS AT ANY RESOLUTION
// -------------------------------------------------------------
function pointInTriangle(px, py, ax, ay, bx, by, cx, cy) {
  const v0x = cx - ax, v0y = cy - ay;
  const v1x = bx - ax, v1y = by - ay;
  const v2x = px - ax, v2y = py - ay;

  const dot00 = v0x * v0x + v0y * v0y;
  const dot01 = v0x * v1x + v0y * v1y;
  const dot02 = v0x * v2x + v0y * v2y;
  const dot11 = v1x * v1x + v1y * v1y;
  const dot12 = v1x * v2x + v1y * v2y;

  const invDenom = 1 / (dot00 * dot11 - dot01 * dot01);
  const u = (dot11 * dot02 - dot01 * dot12) * invDenom;
  const v = (dot00 * dot12 - dot01 * dot02) * invDenom;

  return (u >= 0) && (v >= 0) && (u + v <= 1);
}

function clamp(v, min, max) {
  return Math.max(min, Math.min(max, v));
}

function mix(c1, c2, factor) {
  return [
    Math.round(c1[0] + (c2[0] - c1[0]) * factor),
    Math.round(c1[1] + (c2[1] - c1[1]) * factor),
    Math.round(c1[2] + (c2[2] - c1[2]) * factor),
    Math.round(c1[3] + (c2[3] - c1[3]) * factor)
  ];
}

function renderPixel(x, y, w, h, isMaskable = false, roundedRadius = 0) {
  // Normalize to -1 .. +1 space
  const nx = (x + 0.5) / w * 2 - 1;
  const ny = (y + 0.5) / h * 2 - 1;

  // Check rounded corner clip if non-maskable
  if (!isMaskable && roundedRadius > 0) {
    const rx = (x + 0.5) / w;
    const ry = (y + 0.5) / h;
    const radNorm = roundedRadius / 512;
    const dx = Math.max(0, Math.max(radNorm - rx, rx - (1 - radNorm)));
    const dy = Math.max(0, Math.max(radNorm - ry, ry - (1 - radNorm)));
    if (dx > 0 && dy > 0 && Math.sqrt(dx * dx + dy * dy) > radNorm) {
      return [0, 0, 0, 0]; // Transparent outside rounded corner
    }
  }

  // Radial Background
  const distCenter = Math.sqrt(nx * nx + ny * ny);
  const bgCenter = [26, 28, 53, 255];
  const bgMid = [14, 16, 34, 255];
  const bgOuter = [4, 5, 10, 255];

  let bg = distCenter < 0.7 
    ? mix(bgCenter, bgMid, distCenter / 0.7) 
    : mix(bgMid, bgOuter, clamp((distCenter - 0.7) / 0.5, 0, 1));

  // Scale factor for maskable safe area
  const contentScale = isMaskable ? 0.72 : 0.88;
  const sx = nx / contentScale;
  const sy = ny / contentScale;
  const sdist = Math.sqrt(sx * sx + sy * sy);
  const angle = Math.atan2(sy, sx); // -PI .. +PI

  let color = [...bg];

  // Subtle radial aura around compass
  if (sdist < 0.9) {
    const auraFactor = (1 - sdist / 0.9) * 0.35;
    const auraCol = [168, 85, 247, 255];
    color = mix(color, auraCol, auraFactor);
  }

  // Outer Dial Rings
  const dialRadius1 = 0.76;
  const dialRadius2 = 0.60;
  if (Math.abs(sdist - dialRadius1) < 0.012) {
    const intensity = (1 - Math.abs(sdist - dialRadius1) / 0.012);
    color = mix(color, [56, 189, 248, 255], intensity * 0.7);
  }
  if (Math.abs(sdist - dialRadius2) < 0.008) {
    const intensity = (1 - Math.abs(sdist - dialRadius2) / 0.008);
    color = mix(color, [168, 85, 247, 255], intensity * 0.5);
  }

  // 4 Main Compass Star Points
  // Model as 8 triangles: Cardinal North, South, East, West (length ~0.84, base half-width ~0.12)
  const lenMain = 0.84;
  const wMain = 0.13;
  const lenDiag = 0.58;
  const wDiag = 0.10;

  // Transform coordinates for cardinal 4-fold symmetry
  // Rotate by multiples of 90 deg
  for (let i = 0; i < 4; i++) {
    const theta = (i * Math.PI) / 2;
    const cosT = Math.cos(theta);
    const sinT = Math.sin(theta);
    const rx = sx * cosT - sy * sinT;
    const ry = sx * sinT + sy * cosT;

    // North-aligned needle: rx is lateral, ry is pointing towards top (-ry is up)
    // Primary Facet (Right side: rx >= 0)
    if (pointInTriangle(rx, ry, 0, 0, 0, -lenMain, wMain, -0.15)) {
      const grad = clamp((-ry) / lenMain, 0, 1);
      const cLight = i === 0 ? [255, 255, 255, 255] : [192, 132, 252, 255];
      const cDark = [168, 85, 247, 255];
      color = mix(cDark, cLight, grad);
      break;
    }
    // Secondary Facet (Left side: rx < 0)
    if (pointInTriangle(rx, ry, 0, 0, 0, -lenMain, -wMain, -0.15)) {
      const grad = clamp((-ry) / lenMain, 0, 1);
      const cLight = [147, 51, 234, 255];
      const cDark = [59, 7, 100, 255];
      color = mix(cDark, cLight, grad);
      break;
    }
  }

  // Diagonal 4-fold Secondary Points (offset 45 deg)
  for (let i = 0; i < 4; i++) {
    const theta = (i * Math.PI) / 2 + Math.PI / 4;
    const cosT = Math.cos(theta);
    const sinT = Math.sin(theta);
    const rx = sx * cosT - sy * sinT;
    const ry = sx * sinT + sy * cosT;

    if (pointInTriangle(rx, ry, 0, 0, 0, -lenDiag, wDiag, -0.12)) {
      const grad = clamp((-ry) / lenDiag, 0, 1);
      color = mix([2, 132, 199, 255], [224, 242, 254, 255], grad);
      break;
    }
    if (pointInTriangle(rx, ry, 0, 0, 0, -lenDiag, -wDiag, -0.12)) {
      const grad = clamp((-ry) / lenDiag, 0, 1);
      color = mix([3, 105, 161, 255], [56, 189, 248, 255], grad);
      break;
    }
  }

  // Central Core Crystal
  const coreRadius = 0.14;
  if (sdist < coreRadius) {
    const coreGrad = 1 - sdist / coreRadius;
    const crystalCol = sdist < 0.05 
      ? [255, 255, 255, 255] 
      : mix([56, 189, 248, 255], [255, 255, 255, 255], coreGrad * 0.9);
    color = mix(color, crystalCol, Math.min(1, coreGrad * 1.5));
  }

  // Border frame for non-maskable icons
  if (!isMaskable && roundedRadius > 0) {
    const rx = (x + 0.5) / w;
    const ry = (y + 0.5) / h;
    const edgeDist = Math.min(rx, 1 - rx, ry, 1 - ry);
    if (edgeDist < 0.015) {
      color = mix(color, [168, 85, 247, 255], 0.6);
    }
  }

  return color;
}

// -------------------------------------------------------------
// BUILD & SAVE ALL ASSETS
// -------------------------------------------------------------
console.log('Generating Anime Navigator PWA Icons...');

// 1. Save SVGs
const standardSvg = generateSVG(false);
const maskableSvg = generateSVG(true);

fs.writeFileSync(path.join(ICONS_DIR, 'favicon.svg'), standardSvg);
fs.writeFileSync(path.join(ICONS_DIR, 'icon.svg'), standardSvg);
fs.writeFileSync(path.join(ICONS_DIR, 'icon-maskable.svg'), maskableSvg);
console.log('Saved SVG icons.');

// 2. Generate PNGs
const pngSizes = [
  { name: 'favicon-16x16.png', size: 16, maskable: false, radius: 2 },
  { name: 'favicon-32x32.png', size: 32, maskable: false, radius: 4 },
  { name: 'apple-touch-icon.png', size: 180, maskable: false, radius: 40 },
  { name: 'icon-192.png', size: 192, maskable: false, radius: 42 },
  { name: 'icon-512.png', size: 512, maskable: false, radius: 112 },
  { name: 'icon-maskable-192.png', size: 192, maskable: true, radius: 0 },
  { name: 'icon-maskable-512.png', size: 512, maskable: true, radius: 0 }
];

for (const spec of pngSizes) {
  const buf = encodePNG(spec.size, spec.size, (x, y, w, h) => {
    return renderPixel(x, y, w, h, spec.maskable, spec.radius);
  });
  fs.writeFileSync(path.join(ICONS_DIR, spec.name), buf);
  console.log(`Generated ${spec.name} (${spec.size}x${spec.size}, ${buf.length} bytes)`);
}

// Also place a root favicon.ico / copy for legacy compatibility
fs.writeFileSync(path.join(__dirname, '..', 'favicon.ico'), pngSizes[1] ? fs.readFileSync(path.join(ICONS_DIR, 'favicon-32x32.png')) : Buffer.alloc(0));

console.log('All PWA icons generated successfully!');
