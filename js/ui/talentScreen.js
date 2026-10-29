/**
 * Talent Roster UI Screen
 * Browsing, filtering, detailed star cards, 1-6 month contract negotiation,
 * interpersonal actions & relations, debt bailouts, and active signed studio roster.
 */

window.StudioGame = window.StudioGame || {};
window.StudioGame.UI = window.StudioGame.UI || {};

window.StudioGame.UI.TalentScreen = (function() {
  let activeViewMode = 'roster'; // 'roster' | 'signed'
  let searchQuery = '';
  let activeFilterGender = 'all'; // 'all', 'female', 'male'
  let activeFilterCategory = 'all'; // 'all', 'superstar', 'a_lister', 'acclaimed', 'rising_star', 'model', 'newcomer'
  let activeFilterStatus = 'all'; // 'all', 'free_agent', 'signed', 'in_debt'
  let activeFilterImage = 'all'; // 'all', 'wholesome', 'romantic', 'bold', 'unrestricted'
  let activeSortBy = 'fans_desc'; // 'fans_desc', 'acting_desc', 'glamour_desc', 'fee_asc', 'fee_desc', 'net_worth_desc', 'debt_desc'
  let currentPage = 1;
  const ITEMS_PER_PAGE = 18;

  function render(container, state, callbacks = {}) {
    if (!container || !state) return;
    window.StudioGame.Systems.Talent.ensureTalentState(state);

    const talents = state.talent || [];
    const signedStars = window.StudioGame.Systems.Talent.getActiveSignedTalents(state);
    const signedCount = signedStars.length;
    const debtCount = talents.filter(t => t.debt && t.debt > 0).length;

    // Filter talents
    let filtered = talents.filter(t => {
      // If signed tab is active, only show signed stars
      if (activeViewMode === 'signed') {
        if (t.contractStatus !== 'signed_player' || t.contractDaysRemaining <= 0) return false;
      }

      // Gender filter
      if (activeFilterGender !== 'all' && t.gender !== activeFilterGender) return false;

      // Category filter
      if (activeFilterCategory !== 'all') {
        const catSlug = (t.category || '').toLowerCase().replace(/[\s-]/g, '_');
        if (!catSlug.includes(activeFilterCategory)) return false;
      }

      // Status filter
      if (activeFilterStatus === 'free_agent' && t.contractStatus !== 'free_agent') return false;
      if (activeFilterStatus === 'signed' && t.contractStatus !== 'signed_player') return false;
      if (activeFilterStatus === 'in_debt' && (!t.debt || t.debt <= 0)) return false;

      // Screen image filter
      if (activeFilterImage !== 'all' && t.pureImage !== activeFilterImage) return false;

      // Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesName = t.name.toLowerCase().includes(q);
        const matchesCategory = (t.category || '').toLowerCase().includes(q);
        const matchesBio = (t.bio || '').toLowerCase().includes(q);
        if (!matchesName && !matchesCategory && !matchesBio) return false;
      }

      return true;
    });

    // Sort talents
    filtered.sort((a, b) => {
      if (activeSortBy === 'fans_desc') return b.fans - a.fans;
      if (activeSortBy === 'acting_desc') return b.acting - a.acting;
      if (activeSortBy === 'glamour_desc') return b.glamour - a.glamour;
      if (activeSortBy === 'fee_asc') return a.averageFee - b.averageFee;
      if (activeSortBy === 'fee_desc') return b.averageFee - a.averageFee;
      if (activeSortBy === 'net_worth_desc') return b.netWorth - a.netWorth;
      if (activeSortBy === 'debt_desc') return (b.debt || 0) - (a.debt || 0);
      return 0;
    });

    // Pagination
    const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
    if (currentPage > totalPages) currentPage = totalPages;
    const pageItems = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

    container.innerHTML = `
      <div class="screen-page-container">
        <!-- Unified Top App Bar -->
        <header class="top-nav-bar">
          <div class="top-user-wrap">
            <div class="avatar-small">
              <img src="${state.player.avatar}" alt="${state.player.name}" class="avatar-img-round" />
            </div>
            <div class="top-user-meta">
              <div class="top-player-name">${state.player.name}</div>
              <div class="top-studio-tag">${state.studio.name} &bull; Talent Center (${signedCount} Signed)</div>
            </div>
          </div>

          <div class="top-date-wrap">
            <div class="date-badge">
              <span class="calendar-icon">📅</span>
              <span class="calendar-text">Day ${state.clock.day} &bull; ${state.clock.formattedDate}</span>
            </div>
          </div>

          <div class="top-actions">
            <button class="btn-icon" id="btnOpenSaveManager" title="Save / Settings">
              💾
            </button>
          </div>
        </header>

        <!-- Unified Sticky Turn Controls Bar -->
        <section class="turn-control-bar">
          <div class="turn-bar-inner">
            <button class="btn-turn-primary" id="btnNextDay" title="Advance 1 in-game day">
              <span class="turn-btn-glow"></span>
              <span class="turn-btn-icon">▶</span>
              <span class="turn-btn-text">Next Day</span>
            </button>
            <div class="turn-fast-forward-group">
              <button class="btn-fast-forward" id="btnAdvanceWeek" title="Advance 1 full week">+7D</button>
              <button class="btn-fast-forward" id="btnAdvanceMonth" title="Advance 1 month">+30D</button>
              <button class="btn-fast-forward btn-event-advance" id="btnAdvanceEvent" title="Fast forward to next event">
                ⚡ Event
              </button>
            </div>
          </div>
        </section>

        <!-- Main Content Area -->
        <main class="page-content-padding">
          <!-- Stats Overview Banner -->
          <div class="talent-summary-grid">
            <div class="summary-mini-card">
              <span class="mini-label">Total Artistes</span>
              <span class="mini-val highlight-gold">${talents.length}</span>
              <span class="mini-sub">152 Actresses / 152 Actors</span>
            </div>
            <div class="summary-mini-card">
              <span class="mini-label">Our Signed Roster</span>
              <span class="mini-val highlight-emerald font-bold">${signedCount} Stars</span>
              <span class="mini-sub">Exclusive Retention (80% Off)</span>
            </div>
            <div class="summary-mini-card">
              <span class="mini-label">Artistes in Debt</span>
              <span class="mini-val highlight-rose font-bold">${debtCount} Talents</span>
              <span class="mini-sub">Bailout for Deep Loyalty</span>
            </div>
            <div class="summary-mini-card">
              <span class="mini-label">Studio Cash</span>
              <span class="mini-val font-mono">${window.StudioGame.Systems.Finance.formatRupees(state.studio.cash)}</span>
              <span class="mini-sub">Available Capital</span>
            </div>
          </div>

          <!-- Roster View Mode Tabs -->
          <div class="talent-view-tabs my-2">
            <button class="studios-tab-btn ${activeViewMode === 'roster' ? 'active' : ''}" data-view-mode="roster">
              🌐 Artiste Directory (${talents.length})
            </button>
            <button class="studios-tab-btn ${activeViewMode === 'signed' ? 'active' : ''}" data-view-mode="signed">
              📜 Our Signed Stars (${signedCount})
            </button>
          </div>

          <!-- Filter & Search Toolbar -->
          <div class="talent-toolbar-card">
            <div class="toolbar-search-row">
              <div class="search-input-wrap">
                <span class="search-icon">🔍</span>
                <input type="text" id="talentSearchInput" class="form-input search-input-padded" placeholder="Search by name, star tier, or background bio..." value="${escapeHtml(searchQuery)}">
                ${searchQuery ? '<button class="clear-search-btn" id="btnClearSearch">&times;</button>' : ''}
              </div>

              <div class="sort-select-wrap">
                <select id="talentSortSelect" class="form-input">
                  <option value="fans_desc" ${activeSortBy === 'fans_desc' ? 'selected' : ''}>🔥 Most Fans (Popularity)</option>
                  <option value="acting_desc" ${activeSortBy === 'acting_desc' ? 'selected' : ''}>🎭 Acting Skill (High &rarr; Low)</option>
                  <option value="glamour_desc" ${activeSortBy === 'glamour_desc' ? 'selected' : ''}>✨ Glamour / Beauty (High &rarr; Low)</option>
                  <option value="fee_asc" ${activeSortBy === 'fee_asc' ? 'selected' : ''}>💰 Lowest Fee (Budget Friendly)</option>
                  <option value="fee_desc" ${activeSortBy === 'fee_desc' ? 'selected' : ''}>💎 Highest Fee (Superstars)</option>
                  <option value="net_worth_desc" ${activeSortBy === 'net_worth_desc' ? 'selected' : ''}>🏛️ Net Worth (Wealthiest)</option>
                  <option value="debt_desc" ${activeSortBy === 'debt_desc' ? 'selected' : ''}>💸 Highest Debt (Bailout Targets)</option>
                </select>
              </div>
            </div>

            <!-- Filter Pills -->
            <div class="filter-pills-row mt-2">
              <div class="pill-group">
                <span class="pill-group-title">Gender:</span>
                <button class="filter-pill ${activeFilterGender === 'all' ? 'active' : ''}" data-filter-gender="all">All</button>
                <button class="filter-pill ${activeFilterGender === 'female' ? 'active' : ''}" data-filter-gender="female">👩 Actresses</button>
                <button class="filter-pill ${activeFilterGender === 'male' ? 'active' : ''}" data-filter-gender="male">👨 Actors</button>
              </div>

              <div class="pill-group">
                <span class="pill-group-title">Category:</span>
                <button class="filter-pill ${activeFilterCategory === 'all' ? 'active' : ''}" data-filter-category="all">All</button>
                <button class="filter-pill ${activeFilterCategory === 'superstar' ? 'active' : ''}" data-filter-category="superstar">👑 Superstars</button>
                <button class="filter-pill ${activeFilterCategory === 'a_lister' ? 'active' : ''}" data-filter-category="a_lister">🌟 A-Listers</button>
                <button class="filter-pill ${activeFilterCategory === 'acclaimed' ? 'active' : ''}" data-filter-category="acclaimed">🎭 Acclaimed</button>
                <button class="filter-pill ${activeFilterCategory === 'rising_star' ? 'active' : ''}" data-filter-category="rising_star">🚀 Rising Stars</button>
                <button class="filter-pill ${activeFilterCategory === 'model' ? 'active' : ''}" data-filter-category="model">👗 Models</button>
                <button class="filter-pill ${activeFilterCategory === 'newcomer' ? 'active' : ''}" data-filter-category="newcomer">🌱 Newcomers</button>
              </div>

              ${activeViewMode === 'roster' ? `
                <div class="pill-group">
                  <span class="pill-group-title">Status:</span>
                  <button class="filter-pill ${activeFilterStatus === 'all' ? 'active' : ''}" data-filter-status="all">All</button>
                  <button class="filter-pill ${activeFilterStatus === 'free_agent' ? 'active' : ''}" data-filter-status="free_agent">🆓 Free Agents</button>
                  <button class="filter-pill ${activeFilterStatus === 'signed' ? 'active' : ''}" data-filter-status="signed">📜 Signed To Us</button>
                  <button class="filter-pill ${activeFilterStatus === 'in_debt' ? 'active' : ''}" data-filter-status="in_debt">💸 In Debt</button>
                </div>
              ` : ''}

              <div class="pill-group">
                <span class="pill-group-title">Image:</span>
                <button class="filter-pill ${activeFilterImage === 'all' ? 'active' : ''}" data-filter-image="all">All</button>
                <button class="filter-pill ${activeFilterImage === 'wholesome' ? 'active' : ''}" data-filter-image="wholesome">🕊️ Pure Wholesome</button>
                <button class="filter-pill ${activeFilterImage === 'romantic' ? 'active' : ''}" data-filter-image="romantic">💖 Romantic</button>
                <button class="filter-pill ${activeFilterImage === 'bold' ? 'active' : ''}" data-filter-image="bold">🔥 Bold</button>
                <button class="filter-pill ${activeFilterImage === 'unrestricted' ? 'active' : ''}" data-filter-image="unrestricted">⚡ Method</button>
              </div>
            </div>
          </div>

          <!-- Filter Count Headline -->
          <div class="results-header-bar">
            <span class="results-count-text">Showing <strong>${filtered.length}</strong> matching artistes &bull; Page ${currentPage} of ${totalPages}</span>
          </div>

          <!-- Talent Cards Grid -->
          <div class="talent-cards-grid">
            ${pageItems.length > 0 ? pageItems.map(talent => renderTalentCard(talent, state)).join('') : `
              <div class="empty-results-box text-center p-4">
                <span class="empty-icon">🌟</span>
                <h4>No Artistes Found</h4>
                <p>${activeViewMode === 'signed' ? 'You have not signed any exclusive talent yet. Switch to Artiste Directory to negotiate a 1-6 month contract!' : 'No talents match your current filters.'}</p>
              </div>
            `}
          </div>

          <!-- Pagination Controls -->
          ${totalPages > 1 ? `
            <div class="pagination-bar">
              <button class="pagination-btn" id="btnPrevPage" ${currentPage === 1 ? 'disabled' : ''}>&larr; Previous</button>
              <span class="page-indicator">Page ${currentPage} of ${totalPages}</span>
              <button class="pagination-btn" id="btnNextPage" ${currentPage === totalPages ? 'disabled' : ''}>Next &rarr;</button>
            </div>
          ` : ''}
        </main>
      </div>
    `;

    attachEventListeners(container, state, callbacks);
  }

  function renderTalentCard(t, state) {
    const isSignedToUs = t.contractStatus === 'signed_player';
    const isSignedToRival = t.contractStatus === 'signed_rival';
    const hasDebt = t.debt && t.debt > 0;

    let imageBadgeClass = 'badge-blue';
    let imageBadgeText = 'Romantic';
    if (t.pureImage === 'wholesome') {
      imageBadgeClass = 'badge-emerald';
      imageBadgeText = '🕊️ Pure';
    } else if (t.pureImage === 'bold') {
      imageBadgeClass = 'badge-rose';
      imageBadgeText = '🔥 Bold';
    } else if (t.pureImage === 'unrestricted') {
      imageBadgeClass = 'badge-purple';
      imageBadgeText = '⚡ Method';
    }

    const avatarUrl = window.StudioGame.Face.generate({
      gender: t.gender,
      seed: t.avatarSeed || t.name
    });

    return `
      <div class="talent-roster-card ${isSignedToUs ? 'is-signed-our' : ''}" data-talent-id="${t.id}">
        <div class="talent-card-header">
          <div class="talent-avatar-box">
            <img src="${avatarUrl}" alt="${escapeHtml(t.name)}" class="avatar-img-square" />
            <span class="talent-gender-icon">${t.gender === 'female' ? '♀' : '♂'}</span>
          </div>

          <div class="talent-identity-box">
            <div class="talent-title-row">
              <h3 class="talent-name-text">${escapeHtml(t.name)}</h3>
              <span class="talent-age-tag">${t.age} yrs</span>
            </div>

            <div class="talent-badges-row">
              <span class="badge ${getCategoryBadgeClass(t.category)}">${t.category}</span>
              <span class="badge ${imageBadgeClass}">${imageBadgeText}</span>
              ${hasDebt ? `<span class="badge badge-amber font-mono">💸 Debt: ${window.StudioGame.Systems.Finance.formatRupees(t.debt)}</span>` : ''}
              ${isSignedToUs ? `<span class="badge badge-emerald">⭐ Signed (${t.contractDaysRemaining}D Left)</span>` : ''}
              ${isSignedToRival ? `<span class="badge badge-indigo">🔒 Locked (${t.contractWith})</span>` : ''}
            </div>

            <div class="talent-fans-line">
              <span class="fan-icon">🔥</span>
              <span class="fan-count">${window.StudioGame.Systems.Talent.formatFans(t.fans)}</span>
              <span class="fan-divider">&bull;</span>
              <span class="rep-label">Rep: <strong>${t.reputation}/100</strong></span>
              <span class="fan-divider">&bull;</span>
              <span class="rep-label">Loyalty: <strong>${t.loyalty || 50}%</strong></span>
            </div>
          </div>
        </div>

        <p class="talent-bio-snippet">${escapeHtml(t.bio || 'Rising talent making waves in the Hindi film industry.')}</p>

        <div class="talent-stats-row">
          <div class="stat-pill-bar">
            <span class="stat-pill-label">Acting: ${t.acting}</span>
            <div class="stat-progress-bg">
              <div class="stat-progress-fill fill-cyan" style="width: ${t.acting}%"></div>
            </div>
          </div>

          <div class="stat-pill-bar">
            <span class="stat-pill-label">Glamour: ${t.glamour}</span>
            <div class="stat-progress-bg">
              <div class="stat-progress-fill fill-pink" style="width: ${t.glamour}%"></div>
            </div>
          </div>

          <div class="stat-pill-bar">
            <span class="stat-pill-label">Fitness: ${t.fitness}</span>
            <div class="stat-progress-bg">
              <div class="stat-progress-fill fill-emerald" style="width: ${t.fitness}%"></div>
            </div>
          </div>
        </div>

        <div class="talent-card-footer">
          <div class="talent-fee-box">
            <span class="fee-lbl">Per Film Quote</span>
            <span class="fee-val highlight-gold font-mono">${window.StudioGame.Systems.Finance.formatRupees(t.averageFee)}</span>
          </div>

          <button class="btn btn-sm ${isSignedToUs ? 'btn-emerald' : 'btn-primary'} btn-view-dossier" data-talent-id="${t.id}">
            ${isSignedToUs ? 'Manage Contract' : 'Dossier & Sign'}
          </button>
        </div>
      </div>
    `;
  }

  function getCategoryBadgeClass(category) {
    switch (category) {
      case 'Superstar': return 'badge-gold';
      case 'A-Lister': return 'badge-blue';
      case 'Acclaimed': return 'badge-purple';
      case 'Rising Star': return 'badge-emerald';
      case 'Commercial Model': return 'badge-pink';
      default: return 'badge-slate';
    }
  }

  function attachEventListeners(container, state, callbacks) {
    // Top bar & turn controls
    container.querySelector('#btnNextDay')?.addEventListener('click', () => callbacks.onAdvanceTurn?.(1));
    container.querySelector('#btnAdvanceWeek')?.addEventListener('click', () => callbacks.onAdvanceTurn?.(7));
    container.querySelector('#btnAdvanceMonth')?.addEventListener('click', () => callbacks.onAdvanceTurn?.(30));
    container.querySelector('#btnAdvanceEvent')?.addEventListener('click', () => callbacks.onAdvanceToEvent?.());

    container.querySelector('#btnOpenSaveManager')?.addEventListener('click', () => {
      window.StudioGame.UI.SaveModal.open(state, callbacks.onStateChange);
    });

    // View mode subtabs
    container.querySelectorAll('[data-view-mode]').forEach(btn => {
      btn.addEventListener('click', () => {
        activeViewMode = btn.getAttribute('data-view-mode');
        currentPage = 1;
        render(container, state, callbacks);
      });
    });

    // Search input
    const searchInput = container.querySelector('#talentSearchInput');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        searchQuery = e.target.value;
        currentPage = 1;
        render(container, state, callbacks);
        const refocused = container.querySelector('#talentSearchInput');
        if (refocused) {
          refocused.focus();
          refocused.setSelectionRange(searchQuery.length, searchQuery.length);
        }
      });
    }

    container.querySelector('#btnClearSearch')?.addEventListener('click', () => {
      searchQuery = '';
      currentPage = 1;
      render(container, state, callbacks);
    });

    // Sort select
    const sortSelect = container.querySelector('#talentSortSelect');
    if (sortSelect) {
      sortSelect.addEventListener('change', (e) => {
        activeSortBy = e.target.value;
        currentPage = 1;
        render(container, state, callbacks);
      });
    }

    // Gender filter pills
    container.querySelectorAll('[data-filter-gender]').forEach(btn => {
      btn.addEventListener('click', () => {
        activeFilterGender = btn.getAttribute('data-filter-gender');
        currentPage = 1;
        render(container, state, callbacks);
      });
    });

    // Category filter pills
    container.querySelectorAll('[data-filter-category]').forEach(btn => {
      btn.addEventListener('click', () => {
        activeFilterCategory = btn.getAttribute('data-filter-category');
        currentPage = 1;
        render(container, state, callbacks);
      });
    });

    // Status filter pills
    container.querySelectorAll('[data-filter-status]').forEach(btn => {
      btn.addEventListener('click', () => {
        activeFilterStatus = btn.getAttribute('data-filter-status');
        currentPage = 1;
        render(container, state, callbacks);
      });
    });

    // Image filter pills
    container.querySelectorAll('[data-filter-image]').forEach(btn => {
      btn.addEventListener('click', () => {
        activeFilterImage = btn.getAttribute('data-filter-image');
        currentPage = 1;
        render(container, state, callbacks);
      });
    });

    // Pagination
    container.querySelector('#btnPrevPage')?.addEventListener('click', () => {
      if (currentPage > 1) {
        currentPage--;
        render(container, state, callbacks);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    });

    container.querySelector('#btnNextPage')?.addEventListener('click', () => {
      currentPage++;
      render(container, state, callbacks);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // Open Dossier Modal
    container.querySelectorAll('.btn-view-dossier, .talent-roster-card').forEach(el => {
      el.addEventListener('click', (e) => {
        e.stopPropagation();
        const talentId = el.getAttribute('data-talent-id');
        openTalentDossierModal(talentId, state, callbacks);
      });
    });
  }

  /**
   * Comprehensive Star Dossier & Negotiation/Interactions Modal
   */
  function openTalentDossierModal(talentId, state, callbacks) {
    const existing = document.getElementById('talentDossierModal');
    if (existing) existing.remove();

    const talent = (state.talent || []).find(t => t.id === talentId);
    if (!talent) return;

    const isSignedToUs = talent.contractStatus === 'signed_player';
    const isSignedToRival = talent.contractStatus === 'signed_rival';
    const formatRupees = window.StudioGame.Systems.Finance.formatRupees;

    const avatarUrl = window.StudioGame.Face.generate({
      gender: talent.gender,
      seed: talent.avatarSeed || talent.name
    });

    const backdrop = document.createElement('div');
    backdrop.className = 'modal-backdrop';
    backdrop.id = 'talentDossierModal';

    backdrop.innerHTML = `
      <div class="modal-card modal-lg slide-up">
        <div class="modal-header">
          <div class="modal-title-wrap">
            <span class="badge ${getCategoryBadgeClass(talent.category)}">${talent.category}</span>
            <h2 class="modal-title">${escapeHtml(talent.name)}</h2>
          </div>
          <button class="btn-icon-close" id="btnCloseDossier" aria-label="Close">&times;</button>
        </div>

        <div class="modal-body talent-dossier-body">
          <!-- Hero Section -->
          <div class="dossier-hero-row">
            <div class="dossier-avatar-col">
              <img src="${avatarUrl}" alt="${escapeHtml(talent.name)}" class="dossier-avatar-img" />
            </div>

            <div class="dossier-meta-col">
              <div class="dossier-key-stats">
                <div class="meta-item">
                  <span class="meta-lbl">Age & Gender</span>
                  <span class="meta-val">${talent.age} Years &bull; ${talent.gender === 'female' ? 'Female' : 'Male'}</span>
                </div>
                <div class="meta-item">
                  <span class="meta-lbl">Fan Following</span>
                  <span class="meta-val highlight-amber font-mono">${window.StudioGame.Systems.Talent.formatFans(talent.fans)}</span>
                </div>
                <div class="meta-item">
                  <span class="meta-lbl">Personal Net Worth</span>
                  <span class="meta-val highlight-emerald font-mono">${formatRupees(talent.netWorth)}</span>
                </div>
                <div class="meta-item">
                  <span class="meta-lbl">Average Film Fee</span>
                  <span class="meta-val highlight-gold font-mono">${formatRupees(talent.averageFee)}</span>
                </div>
              </div>

              <!-- Badges Strip -->
              <div class="dossier-badges-strip">
                <span class="badge badge-purple">Screen Image: ${talent.pureImage.toUpperCase()}</span>
                <span class="badge badge-blue">Marital: ${talent.maritalStatus || 'Single'} ${talent.spouse ? `(${talent.spouse})` : ''}</span>
                ${talent.debt > 0 ? `<span class="badge badge-rose font-mono">⚠️ Outstanding Debt: ${formatRupees(talent.debt)}</span>` : '<span class="badge badge-emerald">Debt Free</span>'}
              </div>
            </div>
          </div>

          <!-- Attributes Strip -->
          <div class="dossier-attributes-strip">
            <div class="strip-item">
              <span class="strip-lbl">Acting Mastery</span>
              <span class="strip-val font-mono">${talent.acting}/100</span>
            </div>
            <div class="strip-item">
              <span class="strip-lbl">Glamour / Beauty</span>
              <span class="strip-val font-mono">${talent.glamour}/100</span>
            </div>
            <div class="strip-item">
              <span class="strip-lbl">Physical Fitness</span>
              <span class="strip-val font-mono">${talent.fitness}/100</span>
            </div>
            <div class="strip-item">
              <span class="strip-lbl">Industry Ego</span>
              <span class="strip-val font-mono">${talent.ego}/100</span>
            </div>
            <div class="strip-item">
              <span class="strip-lbl">Studio Loyalty</span>
              <span class="strip-val font-mono highlight-gold">${talent.loyalty || 50}/100</span>
            </div>
            <div class="strip-item">
              <span class="strip-lbl">Relationship Clout</span>
              <span class="strip-val font-mono highlight-cyan">${talent.relationship || 40}/100</span>
            </div>
          </div>

          <!-- Section: Interpersonal Actions & Relations -->
          <div class="dossier-section-box">
            <h4 class="section-box-title">🤝 Interpersonal Relations & Clout Actions</h4>
            <div class="lifestyle-actions-grid">
              <div class="lifestyle-action-card">
                <span class="act-icon">☕</span>
                <div class="act-meta">
                  <strong>Private Power Lunch at Soho House</strong>
                  <span>Boosts loyalty & mutual friendship (+12 Rel).</span>
                  <span class="act-cost highlight-gold font-mono">₹50,000</span>
                </div>
                <button class="btn btn-sm btn-outline-gold btn-talent-action" data-action="lunch">Host Lunch</button>
              </div>

              <div class="lifestyle-action-card">
                <span class="act-icon">🎁</span>
                <div class="act-meta">
                  <strong>Luxury Designer Timepiece & Hamper</strong>
                  <span>Bespoke Cartier / Rolex gift (+20 Rel, +18 Loyalty).</span>
                  <span class="act-cost highlight-gold font-mono">₹3.0 Lakh</span>
                </div>
                <button class="btn btn-sm btn-outline-gold btn-talent-action" data-action="gift">Send Gift</button>
              </div>

              <div class="lifestyle-action-card">
                <span class="act-icon">🎭</span>
                <div class="act-meta">
                  <strong>Method Acting Masterclass</strong>
                  <span>Professional coach sponsorship (+2 Acting, +2 Glamour).</span>
                  <span class="act-cost highlight-gold font-mono">₹5.0 Lakh</span>
                </div>
                <button class="btn btn-sm btn-outline-gold btn-talent-action" data-action="mentorship">Enroll</button>
              </div>

              <div class="lifestyle-action-card">
                <span class="act-icon">✨</span>
                <div class="act-meta">
                  <strong>PR Image Makeover Campaign</strong>
                  <span>Transform screen persona & gain 10% new fan surge.</span>
                  <span class="act-cost highlight-gold font-mono">₹10.0 Lakh</span>
                </div>
                <button class="btn btn-sm btn-outline-gold btn-talent-action" data-action="makeover">Revamp Image</button>
              </div>

              ${talent.debt > 0 ? `
                <div class="lifestyle-action-card is-debt-card">
                  <span class="act-icon">💸</span>
                  <div class="act-meta">
                    <strong>Bailout Outstanding Debt</strong>
                    <span>Pay off ${formatRupees(talent.debt)} for profound loyalty and 35% fee discount.</span>
                    <span class="act-cost highlight-rose font-mono">${formatRupees(talent.debt)}</span>
                  </div>
                  <button class="btn btn-sm btn-emerald" id="btnBailoutDebt">Bailout Debt</button>
                </div>
              ` : ''}
            </div>
          </div>

          <!-- Contract Status & Flexible Negotiation -->
          <div class="negotiation-drawer-box mt-3" id="negotiationDrawerBox">
            ${isSignedToUs ? `
              <div class="active-contract-banner">
                <div class="active-contract-info">
                  <span class="active-icon">📜</span>
                  <div>
                    <div class="active-title">Signed Exclusive to ${state.studio.name}</div>
                    <div class="active-meta font-mono">
                      ⏳ ${talent.contractDaysRemaining} Days Remaining &bull; 80% Production Discount &bull; ${talent.contractTerms?.profitShare || 0}% Profit Share
                    </div>
                  </div>
                </div>
                <div class="contract-actions-group">
                  <button class="btn btn-sm btn-primary" id="btnOpenExtendModal">Extend Contract</button>
                  <button class="btn btn-sm btn-outline-danger" id="btnReleaseContract">Release Early</button>
                </div>
              </div>
            ` : (isSignedToRival ? `
              <div class="rival-contract-banner">
                <span class="active-icon">🔒</span>
                <div>
                  <strong>Exclusive Contract with ${talent.contractWith}</strong>
                  <p class="text-xs text-muted mb-0">This artiste is locked to ${talent.contractWith}. Visit the <strong>Studios Screen</strong> to initiate a high-value Poaching buyout offer!</p>
                </div>
              </div>
            ` : `
              <div class="negotiation-form">
                <h4 class="negotiation-form-title">🤝 Negotiate Studio Contract (1 to 6 Months)</h4>
                <p class="negotiation-form-sub">Pitch an exclusive retention contract to secure ${talent.name} for upcoming films at an 80% production discount.</p>

                <div class="negotiation-inputs-grid">
                  <div class="form-group">
                    <label class="form-label">Contract Duration</label>
                    <select id="negMonths" class="form-input">
                      <option value="1">1 Month (30 Days Retention)</option>
                      <option value="2">2 Months (60 Days Retention)</option>
                      <option value="3" selected>3 Months (90 Days - Standard)</option>
                      <option value="4">4 Months (120 Days Retention)</option>
                      <option value="5">5 Months (150 Days Retention)</option>
                      <option value="6">6 Months (180 Days Exclusive)</option>
                    </select>
                  </div>

                  <div class="form-group">
                    <label class="form-label">Screen Intimacy Clause</label>
                    <select id="negIntimacy" class="form-input">
                      <option value="strict_wholesome" ${talent.pureImage === 'wholesome' ? 'selected' : ''}>Strict Wholesome (No Kissing / Intimacy)</option>
                      <option value="standard" ${talent.pureImage === 'romantic' ? 'selected' : ''}>Standard Cinematic Romance</option>
                      <option value="bold_permissible" ${talent.pureImage === 'bold' ? 'selected' : ''}>Bold & Sensational Permitted</option>
                    </select>
                  </div>
                </div>

                <div class="form-group mt-2">
                  <div class="slider-header-row">
                    <label class="form-label">Upfront Signing Bonus</label>
                    <span class="slider-display-val highlight-gold font-mono font-bold" id="upfrontDisplay">${formatRupees(Math.round(talent.averageFee * 0.85))}</span>
                  </div>
                  <input type="range" class="form-range" id="negUpfrontSlider"
                    min="${Math.round(talent.averageFee * 0.25)}"
                    max="${Math.round(talent.averageFee * 3.5)}"
                    step="${Math.max(10000, Math.round(talent.averageFee / 20))}"
                    value="${Math.round(talent.averageFee * 0.85)}">
                  <div class="slider-extremes">
                    <span>${formatRupees(talent.averageFee * 0.25)}</span>
                    <span>${formatRupees(talent.averageFee * 3.5)}</span>
                  </div>
                </div>

                <div class="form-group mt-2">
                  <div class="slider-header-row">
                    <label class="form-label">Backend Profit Share</label>
                    <span class="slider-display-val highlight-cyan font-mono" id="profitShareDisplay">10%</span>
                  </div>
                  <input type="range" class="form-range" id="negProfitSlider" min="0" max="25" step="1" value="10">
                  <div class="slider-extremes">
                    <span>0% (Standard)</span>
                    <span>25% (Superstar Royalty)</span>
                  </div>
                </div>

                <!-- Feedback / Status message container -->
                <div id="negotiationFeedbackArea"></div>

                <div class="negotiation-actions-row mt-3">
                  <button class="btn btn-primary btn-full" id="btnSubmitNegotiation">
                    Submit Contract Proposal
                  </button>
                </div>
              </div>
            `)}
          </div>
        </div>

        <div class="modal-footer">
          <button class="btn btn-secondary" id="btnCloseDossierBottom">Close</button>
        </div>
      </div>
    `;

    document.body.appendChild(backdrop);

    const close = () => backdrop.remove();
    backdrop.querySelector('#btnCloseDossier')?.addEventListener('click', close);
    backdrop.querySelector('#btnCloseDossierBottom')?.addEventListener('click', close);
    backdrop.addEventListener('click', (e) => {
      if (e.target === backdrop) close();
    });

    // Interpersonal action buttons
    backdrop.querySelectorAll('.btn-talent-action').forEach(btn => {
      btn.addEventListener('click', () => {
        const actionType = btn.getAttribute('data-action');
        let params = {};
        if (actionType === 'makeover') {
          params.targetImage = talent.pureImage === 'wholesome' ? 'bold' : 'wholesome';
        }
        const res = window.StudioGame.Systems.Talent.interactWithTalent(state, talent.id, actionType, params);
        if (res.success) {
          window.StudioGame.State.autosave();
          callbacks.onStateChange?.();
          window.StudioGame.App.showToast(`✨ ${res.message}`);
          close();
          openTalentDossierModal(talent.id, state, callbacks);
        } else {
          window.StudioGame.App.showToast(`⚠️ ${res.error}`);
        }
      });
    });

    // Bailout debt
    backdrop.querySelector('#btnBailoutDebt')?.addEventListener('click', () => {
      const res = window.StudioGame.Systems.Talent.bailoutDebt(state, talent.id);
      if (res.success) {
        window.StudioGame.State.autosave();
        callbacks.onStateChange?.();
        window.StudioGame.App.showToast(`🤝 Succeeded in bailing out ${talent.name}! Loyalty is soaring.`);
        close();
        openTalentDossierModal(talent.id, state, callbacks);
      } else {
        window.StudioGame.App.showToast(`⚠️ ${res.error}`);
      }
    });

    // Release contract
    backdrop.querySelector('#btnReleaseContract')?.addEventListener('click', () => {
      window.StudioGame.Systems.Talent.releaseContract(state, talent.id);
      window.StudioGame.State.autosave();
      callbacks.onStateChange?.();
      window.StudioGame.App.showToast(`Released ${talent.name} from studio contract.`);
      close();
      openTalentDossierModal(talent.id, state, callbacks);
    });

    // Extend contract
    backdrop.querySelector('#btnOpenExtendModal')?.addEventListener('click', () => {
      const additional = 3;
      const res = window.StudioGame.Systems.Talent.extendContract(state, talent.id, additional);
      if (res.success) {
        window.StudioGame.State.autosave();
        callbacks.onStateChange?.();
        window.StudioGame.App.showToast(`📜 Extended contract by +${additional} months (+90 days)!`);
        close();
        openTalentDossierModal(talent.id, state, callbacks);
      } else {
        window.StudioGame.App.showToast(`⚠️ ${res.error}`);
      }
    });

    // Sliders
    const upfrontSlider = backdrop.querySelector('#negUpfrontSlider');
    const upfrontDisplay = backdrop.querySelector('#upfrontDisplay');
    const monthsSelect = backdrop.querySelector('#negMonths');

    function updateSliderDefault() {
      if (!upfrontSlider || !monthsSelect) return;
      const m = parseInt(monthsSelect.value, 10);
      const mult = window.StudioGame.Systems.Talent.getDurationMultiplier(m);
      const def = Math.round(talent.averageFee * mult);
      upfrontSlider.value = def;
      if (upfrontDisplay) upfrontDisplay.textContent = formatRupees(def);
    }

    if (monthsSelect) {
      monthsSelect.addEventListener('change', updateSliderDefault);
    }

    if (upfrontSlider && upfrontDisplay) {
      upfrontSlider.addEventListener('input', () => {
        upfrontDisplay.textContent = formatRupees(parseInt(upfrontSlider.value, 10));
      });
    }

    const profitSlider = backdrop.querySelector('#negProfitSlider');
    const profitDisplay = backdrop.querySelector('#profitShareDisplay');
    if (profitSlider && profitDisplay) {
      profitSlider.addEventListener('input', () => {
        profitDisplay.textContent = `${profitSlider.value}%`;
      });
    }

    // Submit contract proposal
    backdrop.querySelector('#btnSubmitNegotiation')?.addEventListener('click', () => {
      const upfrontFee = parseInt(upfrontSlider?.value || 0, 10);
      const profitShare = parseInt(profitSlider?.value || 0, 10);
      const contractMonths = parseInt(monthsSelect?.value || 3, 10);
      const intimacyClause = backdrop.querySelector('#negIntimacy')?.value || 'standard';

      const offer = { upfrontFee, profitShare, contractMonths, intimacyClause };
      const res = window.StudioGame.Systems.Talent.evaluateContractOffer(state, talent.id, offer);
      const feedbackArea = backdrop.querySelector('#negotiationFeedbackArea');

      if (res.agreed || res.success) {
        const signRes = window.StudioGame.Systems.Talent.signContract(state, talent.id, offer);
        if (signRes.success) {
          window.StudioGame.State.autosave();
          callbacks.onStateChange?.();
          window.StudioGame.App.showToast(`🖋️ Successfully signed ${talent.name} on ${contractMonths}-month exclusive contract!`);
          close();
          openTalentDossierModal(talent.id, state, callbacks);
        } else {
          window.StudioGame.App.showToast(`⚠️ ${signRes.error}`);
        }
      } else if (res.counterOffer) {
        if (feedbackArea) {
          feedbackArea.innerHTML = `
            <div class="negotiation-result-box countered slide-down">
              <div class="result-headline highlight-amber">Manager Countered:</div>
              <p>${res.message}</p>
              <div class="counter-specs-box">
                <span>Requested Upfront: <strong class="font-mono">${formatRupees(res.counterOffer.upfrontFee)}</strong></span>
                <span>Profit Share: <strong class="font-mono">${res.counterOffer.profitShare}%</strong></span>
              </div>
              <button class="btn btn-sm btn-emerald mt-2" id="btnAcceptCounter">
                Accept Counter Terms (${formatRupees(res.counterOffer.upfrontFee)})
              </button>
            </div>
          `;
          feedbackArea.querySelector('#btnAcceptCounter')?.addEventListener('click', () => {
            const counterSign = window.StudioGame.Systems.Talent.signContract(state, talent.id, {
              upfrontFee: res.counterOffer.upfrontFee,
              profitShare: res.counterOffer.profitShare,
              contractMonths,
              intimacyClause: res.counterOffer.intimacyClause
            });
            if (counterSign.success) {
              window.StudioGame.State.autosave();
              callbacks.onStateChange?.();
              window.StudioGame.App.showToast(`🖋️ Signed ${talent.name} on counter terms!`);
              close();
              openTalentDossierModal(talent.id, state, callbacks);
            } else {
              window.StudioGame.App.showToast(`⚠️ ${counterSign.error}`);
            }
          });
        }
      } else {
        if (feedbackArea) {
          feedbackArea.innerHTML = `
            <div class="negotiation-result-box rejected slide-down">
              <div class="result-headline highlight-rose">Offer Rejected:</div>
              <p>${res.reason}</p>
            </div>
          `;
        }
      }
    });
  }

  function escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  return {
    render
  };
})();
