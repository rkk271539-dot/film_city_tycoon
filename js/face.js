/**
 * Procedural Cinema Portrait Generator (500+ Possibilities)
 * Generates rich, highly detailed vector SVG avatars inspired by Indian cinema icons,
 * with 10+ skin tones, 10+ hairstyles per gender, facial hair variations, traditional
 * ornaments (bindis, jhumkas, maang tikkas), couture clothing, and cinematic lighting.
 */

window.StudioGame = window.StudioGame || {};

window.StudioGame.Face = (function() {
  const SKIN_TONES = [
    { base: '#fce4cf', shadow: '#e5c2a4', blush: '#f7bca0' }, // Fair Ivory
    { base: '#f4d2b2', shadow: '#d8ab85', blush: '#ec9e87' }, // Warm Pearl
    { base: '#eec298', shadow: '#cb9a6e', blush: '#dd8b73' }, // Wheatish Gold
    { base: '#e4b080', shadow: '#be8754', blush: '#d0785c' }, // Sun-Kissed Amber
    { base: '#d39862', shadow: '#ad723b', blush: '#be6548' }, // Dusky Caramel
    { base: '#c18247', shadow: '#9b5e25', blush: '#ab5235' }, // Bronze Glow
    { base: '#aa6c36', shadow: '#834c1b', blush: '#954125' }, // Deep Terracotta
    { base: '#8d5225', shadow: '#6a3611', blush: '#792d15' }, // Rich Mahogany
    { base: '#6d3c16', shadow: '#4e240a', blush: '#5e1d0c' }, // Dark Onyx Bronze
    { base: '#dcc6a8', shadow: '#bba07c', blush: '#caa688' }  // Royal Olive
  ];

  const HAIR_COLORS = [
    '#101216', // Jet Black
    '#1c1a24', // Noir Blue-Black
    '#2b1d16', // Dark Espresso
    '#3b2214', // Rich Chestnut
    '#4a2e1b', // Dark Auburn
    '#5c3d25', // Honey Highlight Brown
    '#6c4e33', // Walnut Brown
    '#252932', // Charcoal
    '#575e6d', // Salt & Pepper
    '#8c92a4'  // Silver Fox
  ];

  const CLOTHING_PRESETS = [
    { type: 'saree', primary: '#b91c1c', border: '#fbbf24', detail: '#f59e0b' },      // Crimson Silk Saree
    { type: 'sherwani', primary: '#1e293b', border: '#d97706', detail: '#f8fafc' },   // Midnight Royal Sherwani
    { type: 'blazer', primary: '#0f172a', border: '#38bdf8', detail: '#ffffff' },     // Sapphire Tuxedo
    { type: 'couture', primary: '#4c1d95', border: '#e879f9', detail: '#fdf4ff' },    // Royal Violet Gown
    { type: 'kurta', primary: '#047857', border: '#fef08a', detail: '#dcfce7' },      // Emerald Festive Kurta
    { type: 'glam', primary: '#be123c', border: '#fb7185', detail: '#ffe4e6' },       // Rose Couture Dress
    { type: 'casual', primary: '#0369a1', border: '#7dd3fc', detail: '#f0f9ff' },     // Casual Denim/Linen
    { type: 'gold_royal', primary: '#78350f', border: '#fde047', detail: '#fef9c3' }  // Heritage Gold Embroidered
  ];

  const BG_GRADIENTS = [
    ['#0f172a', '#1e293b'], // Midnight Slate
    ['#1e1b4b', '#312e81'], // Royal Indigo
    ['#064e3b', '#065f46'], // Emerald Velvet
    ['#831843', '#9d174d'], // Ruby Red Carpet
    ['#451a03', '#78350f'], // Heritage Amber
    ['#172554', '#1e40af'], // Starlight Blue
    ['#581c87', '#7e22ce'], // Velvet Violet
    ['#14532d', '#15803d'], // Forest Green
    ['#701a75', '#86198f'], // Magenta Glamour
    ['#022c22', '#064e3b'], // Deep Jade
    ['#1c1917', '#292524'], // Film Noir Dark
    ['#7c2d12', '#9a3412'], // Terracotta Sunset
    ['#0c4a6e', '#0369a1'], // Ocean Cyan
    ['#3b0764', '#581c87'], // Royal Amethyst
    ['#1f2937', '#374151']  // Studio Graphite
  ];

  function pseudoRandom(seed) {
    let s = typeof seed === 'number' ? Math.abs(seed) : 1;
    if (typeof seed === 'string') {
      s = 1;
      for (let i = 0; i < seed.length; i++) {
        s = Math.abs((s * 31 + seed.charCodeAt(i)) & 0x7fffffff);
      }
    }
    return function() {
      s = (s * 9301 + 49297) % 233280;
      return Math.abs(s) / 233280;
    };
  }

  function generateRawSvg(options = {}) {
    const gender = options.gender || 'female';
    const rng = pseudoRandom(options.seed || Math.random() * 1000000);

    const skin = SKIN_TONES[Math.floor(rng() * SKIN_TONES.length)];
    const hair = HAIR_COLORS[Math.floor(rng() * HAIR_COLORS.length)];
    const cloth = CLOTHING_PRESETS[Math.floor(rng() * CLOTHING_PRESETS.length)];
    const bg = BG_GRADIENTS[Math.floor(rng() * BG_GRADIENTS.length)];

    // Variety traits
    const eyeColors = ['#1e1b18', '#2a1810', '#3a2412', '#142018', '#1a2230'];
    const eyeColor = eyeColors[Math.floor(rng() * eyeColors.length)];
    const hasGlasses = rng() > 0.82;
    const glassesStyle = Math.floor(rng() * 3); // 0: wireframe, 1: thick black, 2: sunglasses
    const hasJewelry = gender === 'female' ? rng() > 0.25 : rng() > 0.75;
    const jewelryType = Math.floor(rng() * 4); // 0: jhumkas, 1: pearls, 2: hoops, 3: diamonds
    const bindiType = gender === 'female' ? Math.floor(rng() * 4) : 0; // 0: none, 1: round crimson, 2: teardrop, 3: crystal
    const hasMaangTikka = gender === 'female' && rng() > 0.65;
    const facialHairType = gender === 'male' ? Math.floor(rng() * 6) : 0; // 0: clean, 1: stubble, 2: full beard, 3: goatee, 4: moustache, 5: french

    // Hair Style selection (10 distinct styles per gender)
    const hairStyleIndex = Math.floor(rng() * 10);
    let hairFront = '';
    let hairBack = '';

    if (gender === 'female') {
      switch (hairStyleIndex) {
        case 0: // Long flowing waves
          hairBack = `<path d="M 45 80 C 35 40, 165 40, 155 80 C 170 130, 168 190, 150 200 L 50 200 C 32 190, 30 130, 45 80 Z" fill="${hair}" />`;
          hairFront = `<path d="M 52 75 C 65 42, 135 42, 148 75 C 130 65, 70 65, 52 75 Z" fill="${hair}" />
                       <path d="M 48 75 C 40 100, 42 140, 52 165 C 56 140, 58 100, 54 75 Z" fill="${hair}" />
                       <path d="M 152 75 C 160 100, 158 140, 148 165 C 144 140, 142 100, 146 75 Z" fill="${hair}" />`;
          break;
        case 1: // Elegant High Top Bun
          hairBack = `<circle cx="100" cy="38" r="28" fill="${hair}" />
                      <circle cx="100" cy="38" r="26" fill="${hair}" opacity="0.8" />
                      <circle cx="100" cy="38" r="30" stroke="#f59e0b" stroke-width="1.5" fill="none" opacity="0.6"/>`;
          hairFront = `<path d="M 62 82 C 60 52, 140 52, 138 82 C 126 70, 74 70, 62 82 Z" fill="${hair}" />
                       <path d="M 64 82 C 62 105, 60 125, 58 135 C 64 120, 68 95, 66 82 Z" fill="${hair}" />
                       <path d="M 136 82 C 138 105, 140 125, 142 135 C 136 120, 132 95, 134 82 Z" fill="${hair}" />`;
          break;
        case 2: // Sleek Modern Bob
          hairFront = `<path d="M 58 78 C 55 45, 145 45, 142 78 C 146 105, 142 135, 132 142 C 128 105, 130 80, 122 75 C 105 60, 95 60, 78 75 C 70 80, 72 105, 68 142 C 58 135, 54 105, 58 78 Z" fill="${hair}" />`;
          break;
        case 3: // Traditional Braid with Gajra / Jasmine Flowers
          hairBack = `<path d="M 55 80 C 45 45, 155 45, 145 80 C 152 110, 148 140, 135 155 L 125 200 L 115 200 L 120 155 Z" fill="${hair}" />
                      <!-- White Jasmine Flowers (Gajra) -->
                      <circle cx="85" cy="50" r="4.5" fill="#ffffff" /><circle cx="95" cy="46" r="4.5" fill="#ffffff" />
                      <circle cx="105" cy="46" r="4.5" fill="#ffffff" /><circle cx="115" cy="50" r="4.5" fill="#ffffff" />`;
          hairFront = `<path d="M 65 78 C 75 52, 125 52, 135 78 C 120 68, 80 68, 65 78 Z" fill="${hair}" />`;
          break;
        case 4: // Red Carpet Side-Swept Waves
          hairBack = `<path d="M 45 80 C 35 45, 165 45, 155 80 C 172 130, 175 190, 155 200 L 130 200 C 145 180, 150 130, 145 80 Z" fill="${hair}" />`;
          hairFront = `<path d="M 55 75 C 65 40, 145 45, 150 78 C 160 120, 160 170, 142 200 L 128 200 C 142 165, 145 115, 135 78 C 115 65, 75 65, 55 75 Z" fill="${hair}" />`;
          break;
        case 5: // Pixie Cut Chic
          hairFront = `<path d="M 62 82 C 58 48, 142 48, 138 82 C 132 72, 120 62, 100 62 C 80 62, 68 72, 62 82 Z" fill="${hair}" />
                       <path d="M 64 78 Q 80 65 96 75 Q 82 85 64 78 Z" fill="${hair}" />
                       <path d="M 136 78 Q 120 65 104 75 Q 118 85 136 78 Z" fill="${hair}" />`;
          break;
        case 6: // Voluminous Blowout
          hairBack = `<path d="M 38 75 C 30 35, 170 35, 162 75 C 176 125, 170 195, 152 200 L 48 200 C 30 195, 24 125, 38 75 Z" fill="${hair}" />`;
          hairFront = `<path d="M 48 72 C 60 38, 140 38, 152 72 C 132 60, 68 60, 48 72 Z" fill="${hair}" />`;
          break;
        case 7: // Half-Up Bouffant with Soft Bangs
          hairBack = `<circle cx="100" cy="50" r="32" fill="${hair}" />
                      <path d="M 45 85 C 40 120, 42 180, 55 200 L 145 200 C 158 180, 160 120, 155 85 Z" fill="${hair}" />`;
          hairFront = `<path d="M 62 75 C 80 68, 120 68, 138 75 C 125 85, 75 85, 62 75 Z" fill="${hair}" />`;
          break;
        case 8: // Layered Feather Curls
          hairBack = `<path d="M 42 75 C 35 40, 165 40, 158 75 C 170 120, 165 175, 148 190 L 52 190 C 35 175, 30 120, 42 75 Z" fill="${hair}" />`;
          hairFront = `<path d="M 54 75 C 70 48, 130 48, 146 75 C 132 68, 68 68, 54 75 Z" fill="${hair}" />`;
          break;
        default: // Traditional Bridal Chignon
          hairBack = `<circle cx="100" cy="44" r="28" fill="${hair}" />
                      <path d="M 52 82 C 48 115, 52 155, 60 170 L 140 170 C 148 155, 152 115, 148 82 Z" fill="${hair}" />`;
          hairFront = `<path d="M 64 78 C 80 62, 120 62, 136 78 C 122 72, 78 72, 64 78 Z" fill="${hair}" />`;
          break;
      }
    } else {
      // Male Hairstyles (10 options)
      switch (hairStyleIndex) {
        case 0: // Modern Pompadour Fade
          hairFront = `<path d="M 68 76 C 65 35, 135 35, 132 76 C 128 58, 115 48, 100 48 C 85 48, 72 58, 68 76 Z" fill="${hair}" />
                       <path d="M 66 78 C 66 92, 68 102, 70 106 L 68 82 Z" fill="${hair}" />
                       <path d="M 134 78 C 134 92, 132 102, 130 106 L 132 82 Z" fill="${hair}" />`;
          break;
        case 1: // Classic Bollywood Slick-Back
          hairFront = `<path d="M 67 76 C 65 44, 135 44, 133 76 C 122 56, 78 56, 67 76 Z" fill="${hair}" />
                       <path d="M 68 76 L 69 98 L 73 98 L 72 76 Z" fill="${hair}" />
                       <path d="M 132 76 L 131 98 L 127 98 L 128 76 Z" fill="${hair}" />`;
          break;
        case 2: // Executive Side-Part
          hairFront = `<path d="M 68 78 C 64 48, 100 42, 132 75 C 125 60, 95 58, 68 78 Z" fill="${hair}" />
                       <path d="M 68 78 L 70 100 L 73 100 L 72 78 Z" fill="${hair}" />
                       <path d="M 132 75 L 130 98 L 127 98 L 129 75 Z" fill="${hair}" />`;
          break;
        case 3: // Textured Messy Quiff
          hairFront = `<path d="M 66 78 C 62 42, 110 32, 134 72 C 124 55, 102 52, 90 56 C 80 50, 70 60, 66 78 Z" fill="${hair}" />
                       <path d="M 67 78 L 70 102 L 73 102 L 71 78 Z" fill="${hair}" />`;
          break;
        case 4: // Samurai Top-Knot Man Bun
          hairBack = `<circle cx="100" cy="38" r="14" fill="${hair}" />
                      <line x1="90" y1="36" x2="110" y2="40" stroke="#f59e0b" stroke-width="2" />`;
          hairFront = `<path d="M 70 78 C 70 52, 130 52, 130 78 C 122 65, 78 65, 70 78 Z" fill="${hair}" />
                       <path d="M 68 80 L 70 100 L 73 100 L 72 80 Z" fill="${hair}" />
                       <path d="M 132 80 L 130 100 L 127 100 L 128 80 Z" fill="${hair}" />`;
          break;
        case 5: // Military Buzz Cut
          hairFront = `<path d="M 70 80 C 68 56, 132 56, 130 80 C 124 68, 76 68, 70 80 Z" fill="${hair}" opacity="0.9" />
                       <path d="M 69 82 L 71 96 L 73 96 L 72 82 Z" fill="${hair}" opacity="0.6" />
                       <path d="M 131 82 L 129 96 L 127 96 L 128 82 Z" fill="${hair}" opacity="0.6" />`;
          break;
        case 6: // Indie Textured Waves
          hairFront = `<path d="M 64 78 C 60 40, 140 40, 136 78 C 130 68, 125 80, 118 70 C 105 60, 95 62, 82 72 C 75 78, 68 68, 64 78 Z" fill="${hair}" />
                       <path d="M 63 80 C 62 95, 64 105, 68 112 L 70 80 Z" fill="${hair}" />
                       <path d="M 137 80 C 138 95, 136 105, 132 112 L 130 80 Z" fill="${hair}" />`;
          break;
        case 7: // Rockstar Layered Locks
          hairBack = `<path d="M 55 85 C 48 115, 48 155, 62 170 L 138 170 C 152 155, 152 115, 145 85 Z" fill="${hair}" />`;
          hairFront = `<path d="M 66 76 C 65 46, 135 46, 134 76 C 120 62, 80 62, 66 76 Z" fill="${hair}" />`;
          break;
        case 8: // Spiky Youth Crop
          hairFront = `<path d="M 67 78 L 72 58 L 80 65 L 88 52 L 98 62 L 108 50 L 118 64 L 126 56 L 133 78 Z" fill="${hair}" />`;
          break;
        default: // Royal Rajput Brushed Waves
          hairFront = `<path d="M 66 76 C 64 42, 136 42, 134 76 C 124 58, 76 58, 66 76 Z" fill="${hair}" />
                       <path d="M 68 76 L 68 108 L 72 108 L 72 76 Z" fill="${hair}" />
                       <path d="M 132 76 L 132 108 L 128 108 L 128 76 Z" fill="${hair}" />`;
          break;
      }
    }

    // Facial Hair SVG (Males)
    let facialHairSvg = '';
    if (gender === 'male') {
      switch (facialHairType) {
        case 1: // Designer Stubble
          facialHairSvg = `<path d="M 80 115 Q 100 138 120 115 Q 100 144 80 115 Z" fill="${hair}" opacity="0.35" />
                           <path d="M 88 110 Q 100 114 112 110 Q 100 118 88 110 Z" fill="${hair}" opacity="0.3" />`;
          break;
        case 2: // Full Groomed Beard
          facialHairSvg = `<path d="M 75 105 C 75 138, 90 148, 100 148 C 110 148, 125 138, 125 105 C 118 120, 112 128, 100 128 C 88 128, 82 120, 75 105 Z" fill="${hair}" />
                           <path d="M 86 112 Q 100 116 114 112 Q 100 122 86 112 Z" fill="${hair}" />`;
          break;
        case 3: // Sharp Goatee
          facialHairSvg = `<path d="M 90 124 Q 100 146 110 124 Q 100 136 90 124 Z" fill="${hair}" />
                           <path d="M 92 113 Q 100 116 108 113 Q 100 120 92 113 Z" fill="${hair}" />`;
          break;
        case 4: // Royal Rajput Moustache
          facialHairSvg = `<path d="M 82 112 Q 92 116 100 112 Q 108 116 118 112 Q 124 108 126 104 Q 120 116 100 116 Q 80 116 74 104 Q 76 108 82 112 Z" fill="${hair}" />`;
          break;
        case 5: // French Beard
          facialHairSvg = `<path d="M 88 112 Q 100 115 112 112 Q 116 125 110 142 Q 100 146 90 142 Q 84 125 88 112 Z" fill="none" stroke="${hair}" stroke-width="4" stroke-linecap="round"/>`;
          break;
        default:
          facialHairSvg = '';
          break;
      }
    }

    // Glasses SVG
    let glassesSvg = '';
    if (hasGlasses) {
      if (glassesStyle === 0) {
        // Wireframe Gold/Silver
        glassesSvg = `<rect x="74" y="87" width="20" height="15" rx="4" stroke="#f59e0b" stroke-width="1.8" fill="rgba(255,255,255,0.12)" />
                      <rect x="106" y="87" width="20" height="15" rx="4" stroke="#f59e0b" stroke-width="1.8" fill="rgba(255,255,255,0.12)" />
                      <line x1="94" y1="94" x2="106" y2="94" stroke="#f59e0b" stroke-width="1.8" />
                      <line x1="68" y1="91" x2="74" y2="91" stroke="#f59e0b" stroke-width="1.5" />
                      <line x1="126" y1="91" x2="132" y2="91" stroke="#f59e0b" stroke-width="1.5" />`;
      } else if (glassesStyle === 1) {
        // Thick Acetate
        glassesSvg = `<rect x="73" y="86" width="22" height="16" rx="4" stroke="#0f172a" stroke-width="3" fill="rgba(255,255,255,0.1)" />
                      <rect x="105" y="86" width="22" height="16" rx="4" stroke="#0f172a" stroke-width="3" fill="rgba(255,255,255,0.1)" />
                      <line x1="95" y1="93" x2="105" y2="93" stroke="#0f172a" stroke-width="3.5" />`;
      } else {
        // Luxury Aviator Sunglasses
        glassesSvg = `<path d="M 73 86 Q 84 84 95 86 L 93 103 Q 84 107 75 101 Z" fill="#0f172a" stroke="#d97706" stroke-width="1.5" opacity="0.9"/>
                      <path d="M 105 86 Q 116 84 127 86 L 125 101 Q 116 107 107 103 Z" fill="#0f172a" stroke="#d97706" stroke-width="1.5" opacity="0.9"/>
                      <line x1="95" y1="88" x2="105" y2="88" stroke="#d97706" stroke-width="2" />`;
      }
    }

    // Jewelry SVG
    let jewelrySvg = '';
    if (hasJewelry) {
      if (jewelryType === 0) {
        // Indian Gold Jhumkas
        jewelrySvg = `<path d="M 68 104 L 66 112 L 70 112 Z" fill="#f59e0b" />
                      <circle cx="68" cy="114" r="3" fill="#f59e0b" />
                      <path d="M 132 104 L 130 112 L 134 112 Z" fill="#f59e0b" />
                      <circle cx="132" cy="114" r="3" fill="#f59e0b" />`;
      } else if (jewelryType === 1) {
        // Pearl Drops
        jewelrySvg = `<circle cx="68" cy="106" r="3" fill="#ffffff" stroke="#cbd5e1" stroke-width="0.8"/>
                      <circle cx="132" cy="106" r="3" fill="#ffffff" stroke="#cbd5e1" stroke-width="0.8"/>`;
      } else if (jewelryType === 2) {
        // Gold Hoops
        jewelrySvg = `<circle cx="67" cy="107" r="5" fill="none" stroke="#f59e0b" stroke-width="1.8"/>
                      <circle cx="133" cy="107" r="5" fill="none" stroke="#f59e0b" stroke-width="1.8"/>`;
      } else {
        // Diamond Studs
        jewelrySvg = `<polygon points="68,103 70,105 68,107 66,105" fill="#38bdf8" stroke="#ffffff" stroke-width="0.6"/>
                      <polygon points="132,103 134,105 132,107 130,105" fill="#38bdf8" stroke="#ffffff" stroke-width="0.6"/>`;
      }
    }

    // Bindi SVG (Female)
    let bindiSvg = '';
    if (gender === 'female') {
      if (bindiType === 1) {
        bindiSvg = `<circle cx="100" cy="83" r="2.2" fill="#b91c1c" />`;
      } else if (bindiType === 2) {
        bindiSvg = `<path d="M 100 81 Q 102 84 100 86 Q 98 84 100 81 Z" fill="#991b1b" />`;
      } else if (bindiType === 3) {
        bindiSvg = `<circle cx="100" cy="83" r="1.8" fill="#38bdf8" stroke="#ffffff" stroke-width="0.5"/>`;
      }
    }

    // Maang Tikka (Forehead bridal ornament)
    let maangTikkaSvg = '';
    if (hasMaangTikka) {
      maangTikkaSvg = `<line x1="100" y1="52" x2="100" y2="76" stroke="#f59e0b" stroke-width="1.5" />
                       <circle cx="100" cy="77" r="3.2" fill="#dc2626" stroke="#f59e0b" stroke-width="1.2" />`;
    }

    // Nose Pin / Nath
    let nosePinSvg = '';
    if (gender === 'female' && rng() > 0.7) {
      nosePinSvg = `<circle cx="95" cy="104" r="1.3" fill="#f59e0b" />`;
    }

    const uniqueId = Math.floor(rng() * 1000000);

    const svg = `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="100%" height="100%">
        <defs>
          <linearGradient id="bgGrad_${uniqueId}" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="${bg[0]}" />
            <stop offset="100%" stop-color="${bg[1]}" />
          </linearGradient>
          <linearGradient id="clothGrad_${uniqueId}" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="${cloth.primary}" />
            <stop offset="100%" stop-color="${cloth.primary}" stop-opacity="0.8" />
          </linearGradient>
        </defs>

        <!-- Canvas Frame -->
        <rect width="200" height="200" rx="14" fill="url(#bgGrad_${uniqueId})" />

        <!-- Hair Back (Long hairstyles) -->
        ${hairBack}

        <!-- Shoulders / Indian & Western Couture Outfit -->
        <path d="M 28 200 C 35 155, 70 142, 100 142 C 130 142, 165 155, 172 200 Z" fill="url(#clothGrad_${uniqueId})" />
        <!-- Outfit Neckline Border & Embroidery -->
        <path d="M 72 152 Q 100 170 128 152" fill="none" stroke="${cloth.border}" stroke-width="3" />
        <path d="M 88 158 Q 100 174 112 158" fill="none" stroke="${cloth.detail}" stroke-width="1.5" />

        <!-- Neck & Shadow -->
        <rect x="88" y="118" width="24" height="30" rx="6" fill="${skin.shadow}" />
        <rect x="90" y="120" width="20" height="26" rx="4" fill="${skin.base}" />

        <!-- Face Base Shape -->
        <ellipse cx="100" cy="98" rx="29" ry="35" fill="${skin.base}" />
        <path d="M 76 96 C 76 122, 100 134, 100 134 C 100 134, 124 122, 124 96 Z" fill="${skin.base}" />

        <!-- Cheeks Blush -->
        <circle cx="82" cy="106" r="6" fill="${skin.blush}" opacity="0.45" />
        <circle cx="118" cy="106" r="6" fill="${skin.blush}" opacity="0.45" />

        <!-- Ears -->
        <circle cx="70" cy="98" r="6" fill="${skin.shadow}" />
        <circle cx="130" cy="98" r="6" fill="${skin.shadow}" />
        <circle cx="70" cy="98" r="3.5" fill="${skin.base}" />
        <circle cx="130" cy="98" r="3.5" fill="${skin.base}" />

        <!-- Jewelry / Earrings -->
        ${jewelrySvg}

        <!-- Eyebrows -->
        <path d="M 76 86 Q 86 81 94 85" stroke="${hair}" stroke-width="2.6" stroke-linecap="round" fill="none" />
        <path d="M 106 85 Q 114 81 124 86" stroke="${hair}" stroke-width="2.6" stroke-linecap="round" fill="none" />

        <!-- Eyes -->
        <ellipse cx="85" cy="94" rx="4.5" ry="3.2" fill="#ffffff" />
        <circle cx="85" cy="94" r="2.8" fill="${eyeColor}" />
        <circle cx="86" cy="93" r="1.1" fill="#ffffff" />

        <ellipse cx="115" cy="94" rx="4.5" ry="3.2" fill="#ffffff" />
        <circle cx="115" cy="94" r="2.8" fill="${eyeColor}" />
        <circle cx="116" cy="93" r="1.1" fill="#ffffff" />

        <!-- Eyelash Liner for females -->
        ${gender === 'female' ? `
          <path d="M 80 93 Q 86 89 91 93" stroke="#000000" stroke-width="1.8" stroke-linecap="round" fill="none" />
          <path d="M 109 93 Q 114 89 120 93" stroke="#000000" stroke-width="1.8" stroke-linecap="round" fill="none" />
        ` : ''}

        <!-- Nose -->
        <path d="M 100 92 L 98 105 L 102 105" stroke="${skin.shadow}" stroke-width="1.8" stroke-linecap="round" fill="none" />
        ${nosePinSvg}

        <!-- Bindi & Maang Tikka -->
        ${bindiSvg}
        ${maangTikkaSvg}

        <!-- Lips -->
        <path d="M 91 116 Q 100 123 109 116" stroke="${gender === 'female' ? '#be123c' : '#a24b3a'}" stroke-width="${gender === 'female' ? '3.2' : '2.4'}" stroke-linecap="round" fill="none" />
        <path d="M 93 115 Q 100 119 107 115" stroke="${gender === 'female' ? '#f43f5e' : '#bc6857'}" stroke-width="1.2" stroke-linecap="round" fill="none" />

        <!-- Facial Hair (Male) -->
        ${facialHairSvg}

        <!-- Hair Front -->
        ${hairFront}

        <!-- Glasses / Eyewear -->
        ${glassesSvg}
      </svg>
    `.trim();

    return svg;
  }

  function generateAvatarDataUrl(options = {}) {
    const rawSvg = generateRawSvg(options);
    return 'data:image/svg+xml;utf8,' + encodeURIComponent(rawSvg);
  }

  /**
   * Crop and downscale an uploaded image client-side to a compact square data URL.
   */
  function cropAndCompressImage(file, targetSize = 256) {
    return new Promise((resolve, reject) => {
      if (!file || !file.type.startsWith('image/')) {
        return reject(new Error('Invalid image file.'));
      }
      const reader = new FileReader();
      reader.onload = function(e) {
        const img = new Image();
        img.onload = function() {
          const canvas = document.createElement('canvas');
          canvas.width = targetSize;
          canvas.height = targetSize;
          const ctx = canvas.getContext('2d');

          const minDim = Math.min(img.width, img.height);
          const startX = (img.width - minDim) / 2;
          const startY = (img.height - minDim) / 2;

          ctx.drawImage(img, startX, startY, minDim, minDim, 0, 0, targetSize, targetSize);
          const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.82);
          resolve(compressedDataUrl);
        };
        img.onerror = () => reject(new Error('Failed to load image.'));
        img.src = e.target.result;
      };
      reader.onerror = () => reject(new Error('Failed to read image file.'));
      reader.readAsDataURL(file);
    });
  }

  return {
    generate: generateAvatarDataUrl,
    generateSvg: generateRawSvg,
    cropAndCompressImage: cropAndCompressImage
  };
})();
