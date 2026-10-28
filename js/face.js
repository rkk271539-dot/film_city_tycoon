/**
 * Procedural Portrait & Image Processing System
 * Generates beautiful modern vector avatars and handles client-side photo processing.
 */

window.StudioGame = window.StudioGame || {};

window.StudioGame.Face = (function() {
  const SKIN_TONES = [
    { base: '#f8d9b6', shadow: '#e2be9b' },
    { base: '#eed4a6', shadow: '#d6b785' },
    { base: '#e4b382', shadow: '#c99665' },
    { base: '#c68642', shadow: '#aa6d2f' },
    { base: '#8d5524', shadow: '#713e17' },
    { base: '#683f1d', shadow: '#4e2d12' }
  ];

  const HAIR_COLORS = [
    '#1a1a1a', '#2c1e18', '#3d2314', '#4a3728', '#634e3a', '#10141d', '#8b5a2b'
  ];

  const CLOTHING_COLORS = [
    '#2563eb', '#4f46e5', '#7c3aed', '#db2777', '#dc2626', '#059669', '#0d9488', '#1e293b', '#334155'
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

  function generateAvatarSvg(options = {}) {
    const gender = options.gender || 'female';
    const rng = pseudoRandom(options.seed || Math.random() * 1000000);

    const skin = SKIN_TONES[Math.floor(rng() * SKIN_TONES.length)];
    const hair = HAIR_COLORS[Math.floor(rng() * HAIR_COLORS.length)];
    const clothes = CLOTHING_COLORS[Math.floor(rng() * CLOTHING_COLORS.length)];
    const hasGlasses = rng() > 0.85;
    const hasJewelry = gender === 'female' && rng() > 0.4;
    const bindi = gender === 'female' && rng() > 0.5;

    const bgGradients = [
      ['#1e1b4b', '#312e81'],
      ['#1e293b', '#334155'],
      ['#064e3b', '#065f46'],
      ['#831843', '#9d174d'],
      ['#172554', '#1e3a8a']
    ];
    const bg = bgGradients[Math.floor(rng() * bgGradients.length)];

    let hairPath = '';
    if (gender === 'female') {
      const styles = [
        // Long wavy
        `<path d="M 60 75 C 50 30, 150 30, 140 75 C 155 100, 155 160, 145 180 C 135 150, 130 90, 130 80 C 110 50, 90 50, 70 80 C 70 90, 65 150, 55 180 C 45 160, 45 100, 60 75 Z" fill="${hair}"/>
         <path d="M 65 70 C 85 45, 115 45, 135 70 C 120 62, 80 62, 65 70 Z" fill="${hair}"/>`,
        // Elegant bun
        `<circle cx="100" cy="48" r="32" fill="${hair}"/>
         <path d="M 68 85 C 60 55, 140 55, 132 85 C 125 72, 75 72, 68 85 Z" fill="${hair}"/>`,
        // Bob cut
        `<path d="M 62 80 C 58 45, 142 45, 138 80 C 142 110, 135 135, 128 140 C 124 100, 126 80, 120 75 C 105 60, 95 60, 80 75 C 74 80, 76 100, 72 140 C 65 135, 58 110, 62 80 Z" fill="${hair}"/>`
      ];
      hairPath = styles[Math.floor(rng() * styles.length)];
    } else {
      // Male styles
      const maleStyles = [
        // Pompadour / Modern fade
        `<path d="M 68 80 C 65 40, 135 40, 132 80 C 128 65, 115 55, 100 55 C 85 55, 72 65, 68 80 Z" fill="${hair}"/>
         <path d="M 65 82 C 65 95, 68 105, 70 110 L 68 85 Z" fill="${hair}"/>
         <path d="M 135 82 C 135 95, 132 105, 130 110 L 132 85 Z" fill="${hair}"/>`,
        // Slick back
        `<path d="M 67 78 C 65 48, 135 48, 133 78 C 120 60, 80 60, 67 78 Z" fill="${hair}"/>`,
        // Clean parted
        `<path d="M 68 80 C 64 50, 100 45, 132 78 C 125 62, 95 62, 68 80 Z" fill="${hair}"/>`
      ];
      hairPath = maleStyles[Math.floor(rng() * maleStyles.length)];
    }

    const svg = `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="100%" height="100%">
        <defs>
          <linearGradient id="bgGrad_${Math.floor(rng()*1000)}" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stop-color="${bg[0]}" />
            <stop offset="100%" stop-color="${bg[1]}" />
          </linearGradient>
        </defs>
        <!-- Background -->
        <rect width="200" height="200" rx="16" fill="${bg[0]}" />
        
        <!-- Shoulders / Clothes -->
        <path d="M 35 200 C 45 155, 75 145, 100 145 C 125 145, 155 155, 165 200 Z" fill="${clothes}" />
        <path d="M 90 145 L 100 162 L 110 145 Z" fill="#ffffff" opacity="0.8" />
        
        <!-- Neck -->
        <rect x="88" y="118" width="24" height="30" rx="6" fill="${skin.shadow}" />
        <rect x="90" y="120" width="20" height="26" rx="4" fill="${skin.base}" />
        
        <!-- Head Back Hair (females) -->
        ${gender === 'female' ? `<path d="M 55 90 C 50 60, 150 60, 145 90 C 150 140, 140 170, 130 180 L 70 180 C 60 170, 50 140, 55 90 Z" fill="${hair}" opacity="0.6"/>` : ''}

        <!-- Face Shape -->
        <ellipse cx="100" cy="98" rx="30" ry="36" fill="${skin.base}" />
        <path d="M 76 98 C 76 124, 100 134, 100 134 C 100 134, 124 124, 124 98 Z" fill="${skin.base}" />
        
        <!-- Ears -->
        <circle cx="68" cy="98" r="6" fill="${skin.shadow}" />
        <circle cx="132" cy="98" r="6" fill="${skin.shadow}" />
        ${hasJewelry ? `<circle cx="68" cy="103" r="2.5" fill="#f59e0b" /><circle cx="132" cy="103" r="2.5" fill="#f59e0b" />` : ''}

        <!-- Eyebrows -->
        <path d="M 78 86 Q 86 82 93 86" stroke="${hair}" stroke-width="2.5" stroke-linecap="round" fill="none" />
        <path d="M 107 86 Q 114 82 122 86" stroke="${hair}" stroke-width="2.5" stroke-linecap="round" fill="none" />

        <!-- Eyes -->
        <circle cx="85" cy="94" r="3.2" fill="#1e293b" />
        <circle cx="86" cy="93" r="1" fill="#ffffff" />
        <circle cx="115" cy="94" r="3.2" fill="#1e293b" />
        <circle cx="116" cy="93" r="1" fill="#ffffff" />
        
        <!-- Nose -->
        <path d="M 100 95 L 98 106 L 102 106" stroke="${skin.shadow}" stroke-width="1.8" stroke-linecap="round" fill="none" />

        <!-- Bindi (if female) -->
        ${bindi ? `<circle cx="100" cy="85" r="1.8" fill="#e11d48" />` : ''}

        <!-- Mouth -->
        <path d="M 92 116 Q 100 122 108 116" stroke="#991b1b" stroke-width="2.2" stroke-linecap="round" fill="none" />

        <!-- Hair Front / Style -->
        ${hairPath}

        <!-- Glasses -->
        ${hasGlasses ? `
          <rect x="76" y="88" width="18" height="12" rx="3" stroke="#e2e8f0" stroke-width="1.5" fill="none" />
          <rect x="106" y="88" width="18" height="12" rx="3" stroke="#e2e8f0" stroke-width="1.5" fill="none" />
          <line x1="94" y1="94" x2="106" y2="94" stroke="#e2e8f0" stroke-width="1.5" />
        ` : ''}
      </svg>
    `.trim();

    return 'data:image/svg+xml;utf8,' + encodeURIComponent(svg);
  }

  /**
   * Crop and downscale an uploaded image client-side to a compact square data URL.
   * Keeps storage size small (~20KB) so localStorage is never exhausted.
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
    generate: generateAvatarSvg,
    cropAndCompressImage: cropAndCompressImage
  };
})();
