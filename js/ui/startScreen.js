/**
 * Start Screen & Studio Setup UI Component
 * Configures Studio name, player & wife profile, photo uploads, skill choice, and starting capital.
 */

window.StudioGame = window.StudioGame || {};
window.StudioGame.UI = window.StudioGame.UI || {};

window.StudioGame.UI.StartScreen = (function() {
  const STUDIO_NAMES = [
    'Apex Motion Pictures', 'Prism Cinecorp', 'Mayur Film Studios',
    'Rajputana Productions', 'Kavita Cinema Works', 'Vanguard Talkies',
    'Crown Jewel Films', 'Saffron Mirage Studios', 'Navrang Studios',
    'Infinity Box Office', 'Deccan Heights Pictures', 'Starlight Mumbai'
  ];

  let playerAvatarData = null;
  let wifeAvatarData = null;
  let selectedSkill = 'talented_writer';
  let startingCashCr = 6.50;

  function render(container, onGameStartCallback) {
    if (!container) return;

    if (!playerAvatarData) {
      playerAvatarData = window.StudioGame.Face.generate({ gender: 'male', seed: Math.floor(Math.random() * 99999) });
    }
    if (!wifeAvatarData) {
      wifeAvatarData = window.StudioGame.Face.generate({ gender: 'female', seed: Math.floor(Math.random() * 99999) });
    }

    const skills = window.StudioGame.Data.Skills || [];
    const randomStudio = STUDIO_NAMES[Math.floor(Math.random() * STUDIO_NAMES.length)];

    container.innerHTML = `
      <div class="start-screen-container">
        <div class="start-hero-header">
          <div class="start-logo-icon">🎬</div>
          <h1 class="start-hero-title">FILM CITY TYCOON</h1>
          <p class="start-hero-subtitle">Studio Management & Cinema Empire Simulation &bull; v0.1 Foundation</p>
        </div>

        <form id="formStartGame" class="start-form">
          <!-- 1. Studio Name Card -->
          <div class="card start-section-card">
            <div class="section-label">1. Studio Registration</div>
            <div class="form-group">
              <label for="inputStudioName">Studio Brand Name</label>
              <div class="input-with-action">
                <input type="text" id="inputStudioName" class="form-input" value="${randomStudio}" required />
                <button type="button" class="btn btn-secondary btn-sm" id="btnRandomStudio">🎲 Roll Name</button>
              </div>
              <span class="form-hint">Your brand identity across box office charts and trade magazines.</span>
            </div>
          </div>

          <!-- 2. Player Profile & Wife Profile -->
          <div class="grid-2-col">
            <!-- Player -->
            <div class="card start-section-card">
              <div class="section-label">2. Founder Profile</div>
              <div class="avatar-setup-wrap">
                <div class="avatar-preview-box">
                  <img src="${playerAvatarData}" id="imgPlayerPreview" alt="Player Avatar" class="avatar-img-round" />
                </div>
                <div class="avatar-btn-group">
                  <button type="button" class="btn btn-xs btn-secondary" id="btnRandomizePlayerAvatar">🎲 Randomize</button>
                  <label class="btn btn-xs btn-secondary btn-file-label">
                    📷 Upload Photo
                    <input type="file" id="filePlayerPhoto" accept="image/*" style="display:none;" />
                  </label>
                </div>
              </div>

              <div class="form-group mt-3">
                <label for="inputPlayerName">Your Name</label>
                <input type="text" id="inputPlayerName" class="form-input" value="Kabir Sharma" required />
              </div>

              <div class="form-group">
                <label for="inputPlayerAge">Starting Age</label>
                <input type="number" id="inputPlayerAge" class="form-input" value="26" min="18" max="75" required />
              </div>
            </div>

            <!-- Wife -->
            <div class="card start-section-card">
              <div class="section-label">3. Partner & Wife Profile</div>
              <div class="avatar-setup-wrap">
                <div class="avatar-preview-box">
                  <img src="${wifeAvatarData}" id="imgWifePreview" alt="Wife Avatar" class="avatar-img-round" />
                </div>
                <div class="avatar-btn-group">
                  <button type="button" class="btn btn-xs btn-secondary" id="btnRandomizeWifeAvatar">🎲 Randomize</button>
                  <label class="btn btn-xs btn-secondary btn-file-label">
                    📷 Upload Photo
                    <input type="file" id="fileWifePhoto" accept="image/*" style="display:none;" />
                  </label>
                </div>
              </div>

              <div class="form-group mt-3">
                <label for="inputWifeName">Wife's Name</label>
                <input type="text" id="inputWifeName" class="form-input" value="Rhea Sharma" required />
              </div>

              <div class="form-group">
                <label for="inputWifeAge">Starting Age</label>
                <input type="number" id="inputWifeAge" class="form-input" value="25" min="18" max="75" required />
              </div>

              <div class="wife-starting-badge">
                <span>💰 Wife Starts With:</span>
                <strong>₹4.50 Cr Personal Net Worth</strong>
              </div>
            </div>
          </div>

          <!-- 3. Permanent Skill Selection -->
          <div class="card start-section-card">
            <div class="section-label">4. Founder Specialty Skill</div>
            <p class="subtext mb-3">
              Pick 1 permanent specialization. Gives a <strong>+25% bonus</strong> in that field only. This skill cannot be upgraded later.
            </p>
            <div class="skills-grid">
              ${skills.map(skill => `
                <div class="skill-choice-card ${selectedSkill === skill.id ? 'selected' : ''}" data-skill-id="${skill.id}">
                  <div class="skill-choice-header">
                    <span class="skill-choice-icon">${skill.icon}</span>
                    <span class="skill-choice-tag">${skill.tagline}</span>
                  </div>
                  <div class="skill-choice-title">${skill.name}</div>
                  <div class="skill-choice-desc">${skill.description}</div>
                </div>
              `).join('')}
            </div>
          </div>

          <!-- 4. Starting Capital Seed -->
          <div class="card start-section-card">
            <div class="section-label">5. Starting Liquid Capital</div>
            <div class="capital-selector-row">
              <div class="capital-display">
                <span class="capital-label">Your Starting Liquid Cash:</span>
                <span class="capital-val highlight-emerald" id="lblStartingCash">₹${startingCashCr.toFixed(2)} Cr</span>
              </div>
              <button type="button" class="btn btn-secondary btn-sm" id="btnRollStartingCash">
                🎲 Roll Range (₹5.0 - ₹8.0 Cr)
              </button>
            </div>
            <span class="form-hint">Studio starts with ₹3.00 Cr working capital + ₹2.00 Cr in sound stage facilities.</span>
          </div>

          <!-- Submit Button -->
          <div class="start-submit-wrap">
            <button type="submit" class="btn btn-primary btn-hero-start">
              🚀 Launch Film Studio &bull; Day 1
            </button>
          </div>
        </form>
      </div>
    `;

    // Listeners
    // Random Studio
    const btnRandomStudio = document.getElementById('btnRandomStudio');
    const inputStudioName = document.getElementById('inputStudioName');
    if (btnRandomStudio && inputStudioName) {
      btnRandomStudio.addEventListener('click', () => {
        inputStudioName.value = STUDIO_NAMES[Math.floor(Math.random() * STUDIO_NAMES.length)];
      });
    }

    // Randomize Player Avatar
    const btnRandomizePlayer = document.getElementById('btnRandomizePlayerAvatar');
    const imgPlayer = document.getElementById('imgPlayerPreview');
    if (btnRandomizePlayer && imgPlayer) {
      btnRandomizePlayer.addEventListener('click', () => {
        playerAvatarData = window.StudioGame.Face.generate({ gender: 'male', seed: Math.floor(Math.random() * 99999) });
        imgPlayer.src = playerAvatarData;
      });
    }

    // Upload Player Photo
    const filePlayer = document.getElementById('filePlayerPhoto');
    if (filePlayer && imgPlayer) {
      filePlayer.addEventListener('change', async (e) => {
        const file = e.target.files[0];
        if (file) {
          try {
            playerAvatarData = await window.StudioGame.Face.cropAndCompressImage(file);
            imgPlayer.src = playerAvatarData;
          } catch (err) {
            alert('Image upload failed: ' + err.message);
          }
        }
      });
    }

    // Randomize Wife Avatar
    const btnRandomizeWife = document.getElementById('btnRandomizeWifeAvatar');
    const imgWife = document.getElementById('imgWifePreview');
    if (btnRandomizeWife && imgWife) {
      btnRandomizeWife.addEventListener('click', () => {
        wifeAvatarData = window.StudioGame.Face.generate({ gender: 'female', seed: Math.floor(Math.random() * 99999) });
        imgWife.src = wifeAvatarData;
      });
    }

    // Upload Wife Photo
    const fileWife = document.getElementById('fileWifePhoto');
    if (fileWife && imgWife) {
      fileWife.addEventListener('change', async (e) => {
        const file = e.target.files[0];
        if (file) {
          try {
            wifeAvatarData = await window.StudioGame.Face.cropAndCompressImage(file);
            imgWife.src = wifeAvatarData;
          } catch (err) {
            alert('Image upload failed: ' + err.message);
          }
        }
      });
    }

    // Skill Selection Cards
    container.querySelectorAll('.skill-choice-card').forEach(card => {
      card.addEventListener('click', () => {
        container.querySelectorAll('.skill-choice-card').forEach(c => c.classList.remove('selected'));
        card.classList.add('selected');
        selectedSkill = card.getAttribute('data-skill-id');
      });
    });

    // Roll Capital
    const btnRollCash = document.getElementById('btnRollStartingCash');
    const lblStartingCash = document.getElementById('lblStartingCash');
    if (btnRollCash && lblStartingCash) {
      btnRollCash.addEventListener('click', () => {
        // Random float between 5.00 and 8.00 Cr
        startingCashCr = parseFloat((5.0 + Math.random() * 3.0).toFixed(2));
        lblStartingCash.textContent = `₹${startingCashCr.toFixed(2)} Cr`;
      });
    }

    // Form Submit
    const form = document.getElementById('formStartGame');
    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const studioName = document.getElementById('inputStudioName').value.trim() || 'Apex Motion Pictures';
        const playerName = document.getElementById('inputPlayerName').value.trim() || 'Kabir Sharma';
        const playerAge = parseInt(document.getElementById('inputPlayerAge').value, 10) || 26;
        const wifeName = document.getElementById('inputWifeName').value.trim() || 'Rhea Sharma';
        const wifeAge = parseInt(document.getElementById('inputWifeAge').value, 10) || 25;

        const newGameParams = {
          studioName,
          playerName,
          playerAge,
          playerAvatar: playerAvatarData,
          wifeName,
          wifeAge,
          wifeAvatar: wifeAvatarData,
          skill: selectedSkill,
          startingCashCr,
          wifeNetWorthCr: 4.50
        };

        if (onGameStartCallback) {
          onGameStartCallback(newGameParams);
        }
      });
    }
  }

  return {
    render
  };
})();
