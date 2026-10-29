/**
 * Talent Roster UI Screen
 * Browsing, filtering, detailed star cards, negotiation engine, and debt bailouts.
 */

window.StudioGame = window.StudioGame || {};
window.StudioGame.UI = window.StudioGame.UI || {};

window.StudioGame.UI.TalentScreen = (function() {
  let activeFilterCategory = 'all';
  let activeFilterGender = 'all';
  let activeFilterImage = 'all';
  let activeFilterStatus = 'all'; // 'all', 'free_agent', 'signed', 'in_debt'
  let activeSortBy = 'fans_desc';
  let searchQuery = '';
  let currentPage = 1;
  const ITEMS_PER_PAGE = 24;

  function render(container, state, callbacks = {}) {
    window.StudioGame.Systems.Talent.ensureTalentState(state);

    const talents = state.talent || [];
    const signedCount = talents.filter(t => t.contractStatus === 'signed_player').length;
    const debtCount = talents.filter(t => t.debt > 0).length;

    // Filter talents
    let filtered = talents.filter(t => {
      if (activeFilterCategory !== 'all') {
        if (activeFilterCategory === 'superstar' && !['Megastar', 'Superstar'].includes(t.category)) return false;
        if (activeFilterCategory === 'a_lister' && t.category !== 'A-Lister') return false;
        if (activeFilterCategory === 'acclaimed' && t.category !== 'Acclaimed') return false;
        if (activeFilterCategory === 'rising_star' && t.category !== 'Rising Star') return false;
        if (activeFilterCategory === 'model' && t.category !== 'Commercial Model') return false;
        if (activeFilterCategory === 'newcomer' && t.category !== 'Newcomer') return false;
      }

      if (activeFilterGender !== 'all' && t.gender !== activeFilterGender) return false;

      if (activeFilterImage !== 'all' && t.pureImage !== activeFilterImage) return false;

      if (activeFilterStatus === 'free_agent' && t.contractStatus !== 'free_agent') return false;
      if (activeFilterStatus === 'signed' && t.contractStatus !== 'signed_player') return false;
      if (activeFilterStatus === 'in_debt' && (!t.debt || t.debt <= 0)) return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesName = t.name.toLowerCase().includes(q);
        const matchesCat = t.category.toLowerCase().includes(q);
        const matchesBio = (t.bio || '').toLowerCase().includes(q);
        if (!matchesName && !matchesCat && !matchesBio) return false;
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
      <div class="screen-container">
        <!-- Sticky Top Bar -->
        <header class="app-top-bar">
          <div class="top-bar-left">
            <div class="studio-brand">
              <span class="studio-logo-icon">🌟</span>
              <div class="studio-titles">
                <h1 class="studio-title-text">Talent Roster</h1>
                <span class="studio-subtitle-text">${talents.length} Indian Cinema Artistes &bull; ${signedCount} Signed</span>
              </div>
            </div>
          </div>

          <div class="top-bar-right">
            <div class="turn-controls">
              <button class="turn-btn" id="btnNextDay" title="Advance 1 Day">
                <span class="turn-icon">▶</span>
                <span class="turn-label">1D</span>
              </button>
              <button class="turn-btn" id="btnPlus7Days" title="Advance 7 Days">
                <span class="turn-icon">⏩</span>
                <span class="turn-label">+7D</span>
              </button>
              <button class="turn-btn" id="btnPlus30Days" title="Advance 30 Days">
                <span class="turn-icon">⏭</span>
                <span class="turn-label">+30D</span>
              </button>
              <button class="turn-btn highlight-gold" id="btnNextEvent" title="Advance to Next Milestone">
                <span class="turn-icon">⚡</span>
                <span class="turn-label">Event</span>
              </button>
            </div>
          </div>
        </header>

        <!-- Stats Overview Banner -->
        <div class="talent-summary-grid">
          <div class="summary-mini-card">
            <span class="mini-label">Total Pool</span>
            <span class="mini-val highlight-gold">${talents.length}</span>
            <span class="mini-sub">152 Actresses / 152 Actors</span>
          </div>
          <div class="summary-mini-card">
            <span class="mini-label">Our Signed Roster</span>
            <span class="mini-val highlight-emerald">${signedCount} Stars</span>
            <span class="mini-sub">Exclusive Retention</span>
          </div>
          <div class="summary-mini-card">
            <span class="mini-label">Talent In Debt</span>
            <span class="mini-val highlight-rose">${debtCount} Artistes</span>
            <span class="mini-sub">Bailout & Gain Loyalty</span>
          </div>
          <div class="summary-mini-card">
            <span class="mini-label">Studio Cash</span>
            <span class="mini-val">${window.StudioGame.Systems.Finance.formatRupees(state.studio.cash)}</span>
            <span class="mini-sub">Available Capital</span>
          </div>
        </div>

        <!-- Filter & Search Toolbar -->
        <div class="talent-toolbar-card">
          <div class="toolbar-search-row">
            <div class="search-input-wrap">
              <span class="search-icon">🔍</span>
              <input type="text" id="talentSearchInput" class="form-control-input" placeholder="Search actor, actress, star category, or bio..." value="${escapeHtml(searchQuery)}">
              ${searchQuery ? '<button class="clear-search-btn" id="btnClearSearch">&times;</button>' : ''}
            </div>

            <div class="sort-select-wrap">
              <select id="talentSortSelect" class="form-select-control">
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
          <div class="filter-pills-row">
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

            <div class="pill-group">
              <span class="pill-group-title">Status:</span>
              <button class="filter-pill ${activeFilterStatus === 'all' ? 'active' : ''}" data-filter-status="all">All</button>
              <button class="filter-pill ${activeFilterStatus === 'free_agent' ? 'active' : ''}" data-filter-status="free_agent">🆓 Free Agents</button>
              <button class="filter-pill ${activeFilterStatus === 'signed' ? 'active' : ''}" data-filter-status="signed">📜 Signed To Us</button>
              <button class="filter-pill ${activeFilterStatus === 'in_debt' ? 'active' : ''}" data-filter-status="in_debt">💸 In Debt</button>
            </div>

            <div class="pill-group">
              <span class="pill-group-title">Screen Image:</span>
              <button class="filter-pill ${activeFilterImage === 'all' ? 'active' : ''}" data-filter-image="all">All</button>
              <button class="filter-pill ${activeFilterImage === 'wholesome' ? 'active' : ''}" data-filter-image="wholesome">🕊️ Pure / Wholesome</button>
              <button class="filter-pill ${activeFilterImage === 'romantic' ? 'active' : ''}" data-filter-image="romantic">💖 Romantic</button>
              <button class="filter-pill ${activeFilterImage === 'bold' ? 'active' : ''}" data-filter-image="bold">🔥 Bold</button>
              <button class="filter-pill ${activeFilterImage === 'unrestricted' ? 'active' : ''}" data-filter-image="unrestricted">⚡ Method</button>
            </div>
          </div>
        </div>

        <!-- Filter Count Headline -->
        <div class="results-header-bar">
          <span class="results-count-text">Showing <strong>${filtered.length}</strong> matching talent (Page ${currentPage} of ${totalPages})</span>
        </div>

        <!-- Talent Cards Grid -->
        <div class="talent-cards-grid">
          ${pageItems.map(talent => renderTalentCard(talent, state)).join('')}
        </div>

        <!-- Pagination Controls -->
        ${totalPages > 1 ? `
          <div class="pagination-bar">
            <button class="pagination-btn" id="btnPrevPage" ${currentPage === 1 ? 'disabled' : ''}>&larr; Previous</button>
            <span class="page-indicator">Page ${currentPage} of ${totalPages}</span>
            <button class="pagination-btn" id="btnNextPage" ${currentPage === totalPages ? 'disabled' : ''}>Next &rarr;</button>
          </div>
        ` : ''}
      </div>
    `;

    attachEventListeners(container, state, callbacks);
  }

  function renderTalentCard(t, state) {
    const isSignedToUs = t.contractStatus === 'signed_player';
    const isSignedOther = t.contractStatus === 'exclusive_studio';
    const hasDebt = t.debt && t.debt > 0;

    let imageBadgeClass = 'badge-blue';
    let imageBadgeText = 'Romantic';
    if (t.pureImage === 'wholesome') {
      imageBadgeClass = 'badge-emerald';
      imageBadgeText = '🕊️ Pure Wholesome';
    } else if (t.pureImage === 'bold') {
      imageBadgeClass = 'badge-rose';
      imageBadgeText = '🔥 Bold Screen';
    } else if (t.pureImage === 'unrestricted') {
      imageBadgeClass = 'badge-purple';
      imageBadgeText = '⚡ Method';
    }

    const avatarSvg = window.StudioGame.Face.generate({
      gender: t.gender,
      seed: t.avatarSeed || t.name
    });

    return `
      <div class="talent-roster-card ${isSignedToUs ? 'is-signed-our' : ''}" data-talent-id="${t.id}">
        <div class="talent-card-header">
          <div class="talent-avatar-box">
            ${avatarSvg}
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
              ${hasDebt ? `<span class="badge badge-amber">💸 Debt: ${window.StudioGame.Systems.Finance.formatRupees(t.debt)}</span>` : ''}
              ${isSignedToUs ? '<span class="badge badge-emerald">📜 Signed Exclusive</span>' : ''}
            </div>

            <div class="talent-fans-line">
              <span class="fan-icon">🔥</span>
              <span class="fan-count">${window.StudioGame.Systems.Talent.formatFans(t.fans)}</span>
              <span class="fan-divider">&bull;</span>
              <span class="rep-label">Rep: <strong>${t.reputation}/100</strong></span>
            </div>
          </div>
        </div>

        <p class="talent-bio-snippet">${escapeHtml(t.bio || '')}</p>

        <!-- Stats Meters -->
        <div class="talent-stats-row">
          <div class="stat-pill-bar">
            <span class="stat-pill-label">Acting</span>
            <div class="stat-progress-bg">
              <div class="stat-progress-fill fill-cyan" style="width: ${t.acting}%"></div>
            </div>
            <span class="stat-pill-num">${t.acting}</span>
          </div>

          <div class="stat-pill-bar">
            <span class="stat-pill-label">Glamour</span>
            <div class="stat-progress-bg">
              <div class="stat-progress-fill fill-pink" style="width: ${t.glamour}%"></div>
            </div>
            <span class="stat-pill-num">${t.glamour}</span>
          </div>

          <div class="stat-pill-bar">
            <span class="stat-pill-label">Fitness</span>
            <div class="stat-progress-bg">
              <div class="stat-progress-fill fill-emerald" style="width: ${t.fitness}%"></div>
            </div>
            <span class="stat-pill-num">${t.fitness}</span>
          </div>
        </div>

        <!-- Footer / Pricing & Actions -->
        <div class="talent-card-footer">
          <div class="talent-fee-box">
            <span class="fee-label">Standard Quote:</span>
            <span class="fee-amount highlight-gold">${window.StudioGame.Systems.Finance.formatRupees(t.averageFee)}</span>
          </div>

          <button class="btn btn-sm ${isSignedToUs ? 'btn-secondary' : 'btn-primary'} btn-view-talent" data-talent-id="${t.id}">
            ${isSignedToUs ? 'Manage Contract' : 'View & Hire'}
          </button>
        </div>
      </div>
    `;
  }

  function getCategoryBadgeClass(category) {
    switch (category) {
      case 'Megastar': return 'badge-gold';
      case 'Superstar': return 'badge-amber';
      case 'A-Lister': return 'badge-blue';
      case 'Acclaimed': return 'badge-purple';
      case 'Rising Star': return 'badge-emerald';
      case 'Commercial Model': return 'badge-pink';
      default: return 'badge-slate';
    }
  }

  function attachEventListeners(container, state, callbacks) {
    // Top bar clock turns
    container.querySelector('#btnNextDay')?.addEventListener('click', () => callbacks.onAdvanceTurn?.(1));
    container.querySelector('#btnPlus7Days')?.addEventListener('click', () => callbacks.onAdvanceTurn?.(7));
    container.querySelector('#btnPlus30Days')?.addEventListener('click', () => callbacks.onAdvanceTurn?.(30));
    container.querySelector('#btnNextEvent')?.addEventListener('click', () => callbacks.onAdvanceToEvent?.());

    // Search input
    const searchInput = container.querySelector('#talentSearchInput');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        searchQuery = e.target.value;
        currentPage = 1;
        render(container, state, callbacks);
      });
    }

    // Clear search
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

    // View & Hire Talent Modal
    container.querySelectorAll('.btn-view-talent').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const talentId = btn.getAttribute('data-talent-id');
        openTalentDossierModal(talentId, state, callbacks);
      });
    });

    container.querySelectorAll('.talent-roster-card').forEach(card => {
      card.addEventListener('click', () => {
        const talentId = card.getAttribute('data-talent-id');
        openTalentDossierModal(talentId, state, callbacks);
      });
    });
  }

  /**
   * Open full-screen Talent Dossier & Negotiation Modal
   */
  function openTalentDossierModal(talentId, state, callbacks) {
    const existing = document.getElementById('talentDossierModal');
    if (existing) existing.remove();

    const talent = (state.talent || []).find(t => t.id === talentId);
    if (!talent) return;

    const isSignedToUs = talent.contractStatus === 'signed_player';
    const hasDebt = talent.debt && talent.debt > 0;
    const canAffordDebt = state.studio.cash >= (talent.debt || 0);

    const avatarSvg = window.StudioGame.Face.generate({
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
          <!-- Star Banner -->
          <div class="dossier-hero-row">
            <div class="dossier-avatar-col">
              ${avatarSvg}
            </div>

            <div class="dossier-main-intel">
              <div class="dossier-headline">
                <span class="dossier-age">${talent.age} Years Old &bull; ${talent.gender === 'female' ? 'Actress' : 'Actor'}</span>
                <span class="dossier-fans-badge">🔥 ${window.StudioGame.Systems.Talent.formatFans(talent.fans)}</span>
              </div>

              <p class="dossier-bio-full">${escapeHtml(talent.bio || '')}</p>

              <div class="dossier-tags-cluster">
                <span class="dossier-tag">Screen Image: <strong>${formatPureImageLabel(talent.pureImage)}</strong></span>
                <span class="dossier-tag">Marital Status: <strong>${talent.maritalStatus}${talent.spouse ? ` (${escapeHtml(talent.spouse)})` : ''}</strong></span>
                <span class="dossier-tag">Net Worth: <strong>${window.StudioGame.Systems.Finance.formatRupees(talent.netWorth)}</strong></span>
                <span class="dossier-tag">Standard Fee: <strong>${window.StudioGame.Systems.Finance.formatRupees(talent.averageFee)}</strong></span>
              </div>
            </div>
          </div>

          <!-- Debt Alert & Bailout Box -->
          ${hasDebt ? `
            <div class="debt-bailout-alert-box">
              <div class="debt-alert-left">
                <span class="debt-warning-icon">💸</span>
                <div class="debt-warning-text">
                  <div class="debt-warning-title">Crushing Personal Debt: ${window.StudioGame.Systems.Finance.formatRupees(talent.debt)}</div>
                  <div class="debt-warning-desc">
                    Talent is under intense creditor pressure. Settle their debt from studio funds to earn <strong>+45 Loyalty</strong> and a <strong>35% permanent discount</strong> on all future acting fees!
                  </div>
                </div>
              </div>
              <button class="btn btn-sm btn-primary" id="btnBailoutDebt" ${!canAffordDebt ? 'disabled' : ''}>
                ${canAffordDebt ? `Bailout (${window.StudioGame.Systems.Finance.formatRupees(talent.debt)})` : 'Insufficient Cash'}
              </button>
            </div>
          ` : ''}

          <!-- Deep Metrics Grid -->
          <div class="metrics-quad-grid">
            <div class="metric-quad-card">
              <div class="quad-label">Acting Prowess</div>
              <div class="quad-val highlight-cyan">${talent.acting}/100</div>
              <div class="quad-bar"><div class="quad-fill fill-cyan" style="width: ${talent.acting}%"></div></div>
            </div>

            <div class="metric-quad-card">
              <div class="quad-label">Glamour & Beauty</div>
              <div class="quad-val highlight-pink">${talent.glamour}/100</div>
              <div class="quad-bar"><div class="quad-fill fill-pink" style="width: ${talent.glamour}%"></div></div>
            </div>

            <div class="metric-quad-card">
              <div class="quad-label">Physique & Fitness</div>
              <div class="quad-val highlight-emerald">${talent.fitness}/100</div>
              <div class="quad-bar"><div class="quad-fill fill-emerald" style="width: ${talent.fitness}%"></div></div>
            </div>

            <div class="metric-quad-card">
              <div class="quad-label">Ego & Demands</div>
              <div class="quad-val highlight-amber">${talent.ego}/100</div>
              <div class="quad-bar"><div class="quad-fill fill-amber" style="width: ${talent.ego}%"></div></div>
            </div>
          </div>

          <!-- Secondary Metrics -->
          <div class="meta-strip-row">
            <div class="strip-item">
              <span class="strip-lbl">Studio Loyalty</span>
              <span class="strip-val">${talent.loyalty || 50}/100</span>
            </div>
            <div class="strip-item">
              <span class="strip-lbl">Scandal Risk</span>
              <span class="strip-val">${talent.scandalRisk || 20}%</span>
            </div>
            <div class="strip-item">
              <span class="strip-lbl">Chemistry Pairs</span>
              <span class="strip-val">${(talent.chemistryPairs && talent.chemistryPairs.length > 0) ? talent.chemistryPairs.join(', ') : 'Versatile with all'}</span>
            </div>
            <div class="strip-item">
              <span class="strip-lbl">Contract Status</span>
              <span class="strip-val ${isSignedToUs ? 'highlight-emerald' : ''}">${formatContractStatus(talent)}</span>
            </div>
          </div>

          <!-- Filmography -->
          <div class="dossier-section-box">
            <h4 class="section-box-title">Dynamic Filmography & Box Office Verdicts</h4>
            ${(talent.pastTopFilms && talent.pastTopFilms.length > 0) ? `
              <div class="filmography-list">
                ${talent.pastTopFilms.map(film => `
                  <div class="filmography-item">
                    <span class="film-year">${film.year || 2025}</span>
                    <span class="film-title">${escapeHtml(film.title)}</span>
                    <span class="film-verdict badge ${getVerdictBadgeClass(film.verdict)}">${film.verdict}</span>
                  </div>
                `).join('')}
              </div>
            ` : '<p class="empty-dossier-note">Aspiring newcomer without major studio releases yet.</p>'}
          </div>

          <!-- Interactive Negotiation Section -->
          <div class="negotiation-drawer-box" id="negotiationDrawerBox">
            ${isSignedToUs ? `
              <div class="active-contract-banner">
                <div class="active-contract-info">
                  <span class="active-icon">📜</span>
                  <div>
                    <div class="active-title">Signed Exclusive to ${state.studio.name}</div>
                    <div class="active-meta">${talent.contractDaysRemaining} days remaining on studio contract. Backend profit share: ${talent.contractTerms?.profitShare || 0}%.</div>
                  </div>
                </div>
                <button class="btn btn-sm btn-outline-danger" id="btnReleaseContract">Release Contract</button>
              </div>
            ` : `
              <div class="negotiation-form">
                <h4 class="negotiation-form-title">🤝 Negotiate Studio Contract</h4>
                <p class="negotiation-form-sub">Pitch an exclusive retention contract to secure ${talent.name} for upcoming films and commercials.</p>

                <div class="negotiation-inputs-grid">
                  <div class="form-group">
                    <label class="form-label">Contract Duration</label>
                    <select id="negMonths" class="form-select-control">
                      <option value="6">6 Months Retention</option>
                      <option value="12" selected>12 Months (1 Year)</option>
                      <option value="24">24 Months (2 Years)</option>
                      <option value="36">36 Months (3 Years Exclusive)</option>
                    </select>
                  </div>

                  <div class="form-group">
                    <label class="form-label">Screen Intimacy Clause</label>
                    <select id="negIntimacy" class="form-select-control">
                      <option value="strict_wholesome" ${talent.pureImage === 'wholesome' ? 'selected' : ''}>Strict Wholesome (No Intimacy / No Kissing)</option>
                      <option value="standard" ${talent.pureImage === 'romantic' ? 'selected' : ''}>Standard Cinematic Romance</option>
                      <option value="bold_permissible" ${talent.pureImage === 'bold' ? 'selected' : ''}>Bold & Sensational Permitted</option>
                    </select>
                  </div>
                </div>

                <div class="form-group">
                  <div class="slider-header-row">
                    <label class="form-label">Upfront Signing Bonus</label>
                    <span class="slider-display-val highlight-gold" id="upfrontDisplay">${window.StudioGame.Systems.Finance.formatRupees(talent.averageFee * 2)}</span>
                  </div>
                  <input type="range" class="form-range" id="negUpfrontSlider"
                    min="${Math.round(talent.averageFee * 0.5)}"
                    max="${Math.round(talent.averageFee * 6)}"
                    step="${Math.max(10000, Math.round(talent.averageFee / 20))}"
                    value="${Math.round(talent.averageFee * 2)}">
                  <div class="slider-extremes">
                    <span>${window.StudioGame.Systems.Finance.formatRupees(talent.averageFee * 0.5)}</span>
                    <span>${window.StudioGame.Systems.Finance.formatRupees(talent.averageFee * 6)}</span>
                  </div>
                </div>

                <div class="form-group">
                  <div class="slider-header-row">
                    <label class="form-label">Backend Profit Share</label>
                    <span class="slider-display-val highlight-cyan" id="profitShareDisplay">10%</span>
                  </div>
                  <input type="range" class="form-range" id="negProfitSlider" min="0" max="25" step="1" value="10">
                  <div class="slider-extremes">
                    <span>0% (Standard)</span>
                    <span>25% (Superstar Royalty)</span>
                  </div>
                </div>

                <!-- Feedback / Status message container -->
                <div id="negotiationFeedbackArea"></div>

                <div class="negotiation-actions-row">
                  <button class="btn btn-primary btn-full" id="btnSubmitNegotiation">
                    Submit Contract Proposal
                  </button>
                </div>
              </div>
            `}
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

    // Debt Bailout button listener
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

    // Release Contract button listener
    backdrop.querySelector('#btnReleaseContract')?.addEventListener('click', () => {
      window.StudioGame.Systems.Talent.releaseContract(state, talent.id);
      window.StudioGame.State.autosave();
      callbacks.onStateChange?.();
      window.StudioGame.App.showToast(`Released ${talent.name} from studio contract.`);
      close();
      openTalentDossierModal(talent.id, state, callbacks);
    });

    // Slider display updates
    const upfrontSlider = backdrop.querySelector('#negUpfrontSlider');
    const upfrontDisplay = backdrop.querySelector('#upfrontDisplay');
    if (upfrontSlider && upfrontDisplay) {
      upfrontSlider.addEventListener('input', () => {
        upfrontDisplay.textContent = window.StudioGame.Systems.Finance.formatRupees(parseInt(upfrontSlider.value, 10));
      });
    }

    const profitSlider = backdrop.querySelector('#negProfitSlider');
    const profitDisplay = backdrop.querySelector('#profitShareDisplay');
    if (profitSlider && profitDisplay) {
      profitSlider.addEventListener('input', () => {
        profitDisplay.textContent = `${profitSlider.value}%`;
      });
    }

    // Submit Negotiation button listener
    backdrop.querySelector('#btnSubmitNegotiation')?.addEventListener('click', () => {
      const upfrontFee = parseInt(upfrontSlider?.value || 0, 10);
      const profitShare = parseInt(profitSlider?.value || 0, 10);
      const contractMonths = parseInt(backdrop.querySelector('#negMonths')?.value || 12, 10);
      const intimacyClause = backdrop.querySelector('#negIntimacy')?.value || 'standard';

      const offer = { upfrontFee, profitShare, contractMonths, intimacyClause };
      const evalResult = window.StudioGame.Systems.Talent.evaluateContractOffer(state, talent.id, offer);

      const feedbackArea = backdrop.querySelector('#negotiationFeedbackArea');
      if (!feedbackArea) return;

      if (evalResult.agreed) {
        feedbackArea.innerHTML = `
          <div class="negotiation-result-box agreed slide-down">
            <div class="result-headline">🎉 Deal Accepted!</div>
            <p>${evalResult.message}</p>
            <button class="btn btn-emerald btn-full mt-2" id="btnFinalizeSign">
              Confirm & Sign Contract (${window.StudioGame.Systems.Finance.formatRupees(upfrontFee)})
            </button>
          </div>
        `;
        feedbackArea.querySelector('#btnFinalizeSign')?.addEventListener('click', () => {
          const signRes = window.StudioGame.Systems.Talent.signContract(state, talent.id, offer);
          if (signRes.success) {
            window.StudioGame.State.autosave();
            callbacks.onStateChange?.();
            window.StudioGame.App.showToast(`📜 Signed ${talent.name} to ${state.studio.name}!`);
            close();
            openTalentDossierModal(talent.id, state, callbacks);
          } else {
            window.StudioGame.App.showToast(`⚠️ ${signRes.error}`);
          }
        });
      } else if (evalResult.counterOffer) {
        const counter = evalResult.counterOffer;
        feedbackArea.innerHTML = `
          <div class="negotiation-result-box countered slide-down">
            <div class="result-headline">⚖️ Counter-Offer Received</div>
            <p>${evalResult.message}</p>
            <div class="counter-specs-box">
              <span>Demanded Upfront: <strong>${window.StudioGame.Systems.Finance.formatRupees(counter.upfrontFee)}</strong></span>
              <span>Profit Share: <strong>${counter.profitShare}%</strong></span>
            </div>
            <div class="counter-actions-row">
              <button class="btn btn-sm btn-primary" id="btnAcceptCounter">
                Accept Counter (${window.StudioGame.Systems.Finance.formatRupees(counter.upfrontFee)})
              </button>
            </div>
          </div>
        `;
        feedbackArea.querySelector('#btnAcceptCounter')?.addEventListener('click', () => {
          const counterTerms = {
            upfrontFee: counter.upfrontFee,
            profitShare: counter.profitShare,
            contractMonths,
            intimacyClause: counter.intimacyClause
          };
          const signRes = window.StudioGame.Systems.Talent.signContract(state, talent.id, counterTerms);
          if (signRes.success) {
            window.StudioGame.State.autosave();
            callbacks.onStateChange?.();
            window.StudioGame.App.showToast(`📜 Accepted counter and signed ${talent.name}!`);
            close();
            openTalentDossierModal(talent.id, state, callbacks);
          } else {
            window.StudioGame.App.showToast(`⚠️ ${signRes.error}`);
          }
        });
      } else {
        feedbackArea.innerHTML = `
          <div class="negotiation-result-box rejected slide-down">
            <div class="result-headline">❌ Proposal Rejected</div>
            <p>${evalResult.reason}</p>
          </div>
        `;
      }
    });
  }

  function formatPureImageLabel(pureImage) {
    switch (pureImage) {
      case 'wholesome': return '🕊️ Pure / Wholesome (Strict No-Intimacy)';
      case 'romantic': return '💖 Romantic & Commercial';
      case 'bold': return '🔥 Bold & Sensational';
      case 'unrestricted': return '⚡ Method / Unrestricted';
      default: return 'Standard';
    }
  }

  function formatContractStatus(talent) {
    if (talent.contractStatus === 'signed_player') return `Exclusive with Our Studio (${talent.contractDaysRemaining} days)`;
    if (talent.contractStatus === 'exclusive_studio') return `Contracted to ${talent.contractWith || 'Rival'}`;
    return 'Free Agent';
  }

  function getVerdictBadgeClass(verdict) {
    if (!verdict) return 'badge-slate';
    if (verdict.includes('All-Time') || verdict.includes('Historic')) return 'badge-gold';
    if (verdict.includes('Blockbuster')) return 'badge-emerald';
    if (verdict.includes('Super Hit') || verdict.includes('Hit')) return 'badge-cyan';
    if (verdict.includes('Acclaimed')) return 'badge-purple';
    return 'badge-slate';
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
