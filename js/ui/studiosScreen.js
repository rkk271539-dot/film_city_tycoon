/**
 * Studios UI Screen
 * Displays the 25 Legacy Indian Studios & 10 Dynamic Talent-Led Unicorn Houses,
 * live theatrical box office tracking, national rankings, and diplomacy.
 */

window.StudioGame = window.StudioGame || {};
window.StudioGame.UI = window.StudioGame.UI || {};

window.StudioGame.UI.StudiosScreen = (function() {
  let activeSubTab = 'all'; // 'all', 'legacy', 'unicorns', 'leaderboard'
  let studioSearchQuery = '';
  let activeAttitudeFilter = 'all'; // 'all', 'friendly', 'neutral', 'rival', 'aggressive'

  function getStudioCrestSvg(name, isUnicorn) {
    const clean = (name || 'Studio').replace(/[^a-zA-Z0-9 ]/g, '');
    const words = clean.split(' ').filter(Boolean);
    const initials = words.length > 1 ? (words[0][0] + words[1][0]).toUpperCase() : clean.slice(0, 2).toUpperCase();
    const hash = Math.abs(name.split('').reduce((acc, c) => acc + c.charCodeAt(0) * 19, 0));

    const gradients = isUnicorn ? [
      ['#8b5cf6', '#ec4899'],
      ['#6366f1', '#a855f7'],
      ['#3b82f6', '#ec4899'],
      ['#ec4899', '#f43f5e']
    ] : [
      ['#b45309', '#f59e0b'],
      ['#047857', '#10b981'],
      ['#1d4ed8', '#38bdf8'],
      ['#6d28d9', '#a855f7'],
      ['#be185d', '#fb7185']
    ];

    const [c1, c2] = gradients[hash % gradients.length];

    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100%" height="100%">
      <defs>
        <linearGradient id="stGrad${hash}" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="${c1}" />
          <stop offset="100%" stop-color="${c2}" />
        </linearGradient>
      </defs>
      <rect width="100" height="100" rx="22" fill="url(#stGrad${hash})" />
      <rect x="4" y="4" width="92" height="92" rx="18" fill="none" stroke="rgba(255,255,255,0.3)" stroke-width="2.5" />
      <circle cx="50" cy="50" r="33" fill="rgba(0,0,0,0.22)" stroke="rgba(255,255,255,0.15)" stroke-width="1.5" />
      <text x="50" y="59" font-family="-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif" font-size="28" font-weight="900" fill="#ffffff" text-anchor="middle" letter-spacing="1.5">${initials}</text>
    </svg>`;

    return 'data:image/svg+xml;utf8,' + encodeURIComponent(svg);
  }

  function render(container, state, callbacks = {}) {
    if (!container || !state) return;
    window.StudioGame.Systems.Studios.ensureStudiosState(state);

    const formatRupees = window.StudioGame.Systems.Finance.formatRupees;
    const legacy = state.studios.legacy || [];
    const unicorns = state.studios.unicorns || [];

    // Calculate player ranking among all 36 studios
    const allStudiosRanked = [
      {
        id: 'player_studio',
        name: state.studio.name,
        founder: state.player.name,
        netWorth: state.studio.netWorth,
        cash: state.player.cash,
        isPlayer: true,
        isUnicorn: false,
        reputation: state.studio.reputation,
        attitude: 'friendly',
        signatureGenres: ['Versatile Cinema', 'Mass Entertainers'],
        isPublic: !!state.market?.isStudioPublic,
        ticker: state.market?.studioTicker || null,
        filmsCount: (state.studio.completedProjects || []).length,
        activeReleases: (state.studio.activeProjects || []).filter(p => p.format && p.theatricalWeek > 0).map(p => ({
          title: p.title,
          week: p.theatricalWeek,
          weeklyGross: p.lastWeekGross || 0,
          totalGross: p.boxOfficeGross || 0
        }))
      },
      ...legacy.map(s => ({ ...s, isPlayer: false, isUnicorn: false })),
      ...unicorns.map(u => ({ ...u, isPlayer: false, isUnicorn: true }))
    ].sort((a, b) => b.netWorth - a.netWorth);

    const playerRank = allStudiosRanked.findIndex(s => s.isPlayer) + 1;
    const leaderStudio = allStudiosRanked[0];
    const diffToLeader = leaderStudio.netWorth - state.studio.netWorth;

    // Filter studios based on search & tab
    let displayList = [];
    if (activeSubTab === 'legacy') {
      displayList = legacy.map(s => ({ ...s, isUnicorn: false }));
    } else if (activeSubTab === 'unicorns') {
      displayList = unicorns.map(u => ({ ...u, isUnicorn: true }));
    } else if (activeSubTab === 'all') {
      displayList = allStudiosRanked.filter(s => !s.isPlayer);
    }

    if (studioSearchQuery.trim()) {
      const q = studioSearchQuery.toLowerCase().trim();
      displayList = displayList.filter(s =>
        s.name.toLowerCase().includes(q) ||
        (s.founder && s.founder.toLowerCase().includes(q)) ||
        (s.founderName && s.founderName.toLowerCase().includes(q)) ||
        (s.signatureGenres && s.signatureGenres.some(g => g.toLowerCase().includes(q)))
      );
    }

    if (activeAttitudeFilter !== 'all') {
      displayList = displayList.filter(s => (s.attitude || 'neutral').toLowerCase() === activeAttitudeFilter);
    }

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
              <div class="top-studio-tag">${state.studio.name} &bull; Studios & Rivals</div>
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
              <button class="btn-fast-forward btn-event-advance" id="btnAdvanceEvent" title="Fast forward until something happens">
                ⚡ Event
              </button>
            </div>
          </div>
        </section>

        <!-- Main Content Area -->
        <main class="dashboard-content">
          <!-- National Ranking & Win Condition Hero Banner -->
          <div class="rank-hero-marquee">
            <div class="rank-hero-glow"></div>
            <div class="rank-hero-left">
              <div class="rank-crown-badge">
                <span class="crown-icon">${playerRank === 1 ? '👑' : '🏢'}</span>
                <span class="rank-big-num">#${playerRank}</span>
                <span class="rank-total-tag">of 36 Studios</span>
              </div>
              <div class="rank-meta-details">
                <div class="rank-marquee-title">${state.studio.name}</div>
                <div class="rank-marquee-valuation">
                  Valuation: <strong class="highlight-gold font-mono">${formatRupees(state.studio.netWorth)}</strong>
                  &bull; Reputation: <strong>${state.studio.reputation}/100</strong>
                </div>
                <div class="rank-win-status">
                  ${playerRank === 1
                    ? '🌟 <span class="highlight-emerald font-bold">You are the #1 Studio in India!</span> Maintain this pinnacle for 3 full years to achieve the Industry Monopoly Win!'
                    : `🎯 Target #1: <strong>${leaderStudio.name}</strong> (${formatRupees(leaderStudio.netWorth)}). Gap: <strong class="highlight-rose">${formatRupees(diffToLeader)}</strong>`
                  }
                </div>
              </div>
            </div>

            <div class="rank-hero-quickstats">
              <div class="mini-stat-item">
                <span class="mini-label">Total Studios</span>
                <span class="mini-val">36 Houses</span>
              </div>
              <div class="mini-stat-item">
                <span class="mini-label">Legacy Empires</span>
                <span class="mini-val highlight-amber">25 Studios</span>
              </div>
              <div class="mini-stat-item">
                <span class="mini-label">Star Unicorns</span>
                <span class="mini-val highlight-indigo">10 Houses</span>
              </div>
            </div>
          </div>

          <!-- Studio Navigation Tabs -->
          <div class="studios-nav-tabs-wrapper">
            <div class="studios-nav-tabs">
              <button class="studios-tab-btn ${activeSubTab === 'all' ? 'active' : ''}" data-subtab="all">
                🌐 All Rivals (${allStudiosRanked.length - 1})
              </button>
              <button class="studios-tab-btn ${activeSubTab === 'legacy' ? 'active' : ''}" data-subtab="legacy">
                🏛️ Legacy Studios (25)
              </button>
              <button class="studios-tab-btn ${activeSubTab === 'unicorns' ? 'active' : ''}" data-subtab="unicorns">
                🦄 Star Unicorns (10)
              </button>
              <button class="studios-tab-btn ${activeSubTab === 'leaderboard' ? 'active' : ''}" data-subtab="leaderboard">
                🏆 Industry Leaderboard
              </button>
            </div>
          </div>

          ${activeSubTab !== 'leaderboard' ? `
            <!-- Search & Attitude Filter Toolbar -->
            <div class="studio-toolbar-card">
              <div class="studio-search-row">
                <div class="search-input-wrap">
                  <span class="search-icon">🔍</span>
                  <input type="text" id="studioSearchInput" class="form-input search-input-padded" placeholder="Search studios by name, founder, or genre..." value="${escapeHtml(studioSearchQuery)}">
                  ${studioSearchQuery ? '<button class="clear-search-btn" id="btnClearStudioSearch">&times;</button>' : ''}
                </div>

                <div class="attitude-filter-pills">
                  <button class="filter-pill ${activeAttitudeFilter === 'all' ? 'active' : ''}" data-attitude="all">All Attitudes</button>
                  <button class="filter-pill ${activeAttitudeFilter === 'friendly' ? 'active' : ''}" data-attitude="friendly">🤝 Friendly</button>
                  <button class="filter-pill ${activeAttitudeFilter === 'neutral' ? 'active' : ''}" data-attitude="neutral">⚖️ Neutral</button>
                  <button class="filter-pill ${activeAttitudeFilter === 'rival' ? 'active' : ''}" data-attitude="rival">⚡ Rival</button>
                  <button class="filter-pill ${activeAttitudeFilter === 'aggressive' ? 'active' : ''}" data-attitude="aggressive">🔥 Aggressive</button>
                </div>
              </div>
            </div>

            ${activeSubTab === 'unicorns' ? `
              <div class="unicorn-info-banner">
                <span class="unicorn-banner-icon">🦄</span>
                <div class="unicorn-banner-desc">
                  <strong>Top 10 Dynamic Talent-Led Unicorns:</strong> Boutique production companies founded by superstars and visionary actors.
                  They dynamically surge with hits and collapse with flops. If one dissolves, another top star steps up to launch a new boutique!
                </div>
              </div>
            ` : ''}

            <!-- Studios Cards Grid -->
            <div class="studios-cards-grid">
              ${displayList.length > 0 ? displayList.map((s, idx) => renderStudioCard(s, s.isUnicorn, state, allStudiosRanked.findIndex(x => x.id === s.id) + 1)).join('') : `
                <div class="empty-results-box text-center">
                  <span class="empty-icon">🏢</span>
                  <h4>No Studios Found</h4>
                  <p>No production houses match your current search and attitude filters.</p>
                </div>
              `}
            </div>
          ` : renderLeaderboard(allStudiosRanked, state)}
        </main>
      </div>
    `;

    attachEventListeners(container, state, callbacks);
  }

  function renderStudioCard(s, isUnicorn, state, rank = null) {
    const formatRupees = window.StudioGame.Systems.Finance.formatRupees;
    const hasActiveRelease = s.activeReleases && s.activeReleases.length > 0;
    const isPublic = s.isPublic;
    const crestUrl = getStudioCrestSvg(s.name, isUnicorn);

    let attitudeBadgeClass = 'badge-slate';
    let attitudeIcon = '⚖️';
    if (s.attitude === 'friendly') {
      attitudeBadgeClass = 'badge-emerald';
      attitudeIcon = '🤝';
    } else if (s.attitude === 'rival') {
      attitudeBadgeClass = 'badge-amber';
      attitudeIcon = '⚡';
    } else if (s.attitude === 'aggressive') {
      attitudeBadgeClass = 'badge-rose';
      attitudeIcon = '🔥';
    }

    return `
      <div class="studio-profile-card ${isUnicorn ? 'is-unicorn' : ''}" data-studio-id="${s.id}">
        <div class="studio-card-top">
          <div class="studio-crest-box">
            <img src="${crestUrl}" alt="${escapeHtml(s.name)}" class="studio-crest-img" />
            ${rank ? `<span class="studio-rank-tag">#${rank}</span>` : ''}
          </div>

          <div class="studio-header-intel">
            <div class="studio-name-row">
              <h3 class="studio-title-main">${escapeHtml(s.name)}</h3>
              ${isPublic ? `<span class="badge badge-gold font-mono">${s.ticker || 'IPO'}</span>` : ''}
            </div>

            <div class="studio-founder-line">
              <span>Founded by <strong>${escapeHtml(s.founder || s.founderName || 'Media Board')}</strong></span>
              ${s.established ? `&bull; <span>Est. ${s.established}</span>` : ''}
            </div>

            <div class="studio-tags-row">
              <span class="badge ${attitudeBadgeClass}">${attitudeIcon} ${capitalize(s.attitude || 'Neutral')}</span>
              <span class="badge badge-blue">⭐ Rep: ${s.reputation}/100</span>
              <span class="badge badge-purple">🎬 ${s.filmsCount || 0} Films</span>
            </div>
          </div>

          <div class="studio-valuation-box">
            <span class="val-lbl">Valuation</span>
            <span class="val-num highlight-gold font-mono">${formatRupees(s.netWorth)}</span>
          </div>
        </div>

        <!-- Theatrical Status Strip -->
        <div class="studio-theatre-strip">
          ${hasActiveRelease ? `
            <div class="release-active-strip">
              <div class="release-indicator">
                <span class="pulse-dot"></span>
                <span class="release-header-lbl">NOW IN THEATRES:</span>
              </div>
              <strong class="release-film-name">🎬 ${escapeHtml(s.activeReleases[0].title)}</strong>
              <div class="release-metrics-right">
                <span class="release-week-tag">Week ${s.activeReleases[0].week}</span>
                <span class="highlight-emerald font-mono font-bold">${formatRupees(s.activeReleases[0].totalGross)}</span>
              </div>
            </div>
          ` : `
            <div class="release-idle-strip">
              <span class="idle-icon">⏳</span>
              <span class="idle-text">Pipeline in Pre-Production & Script Development</span>
            </div>
          `}
        </div>

        <!-- Card Footer with Genres and Dossier Button -->
        <div class="studio-card-bottom">
          <div class="studio-signature-genres">
            ${(s.signatureGenres || ['Commercial Cinema']).slice(0, 2).map(g => `<span class="genre-tag-pill">${g}</span>`).join('')}
          </div>
          <button class="btn btn-sm btn-outline-gold btn-view-studio" data-studio-id="${s.id}">
            Studio Inside & Stars
          </button>
        </div>
      </div>
    `;
  }

  function renderLeaderboard(allRanked, state) {
    const formatRupees = window.StudioGame.Systems.Finance.formatRupees;

    return `
      <div class="leaderboard-container">
        <div class="leaderboard-table-card">
          <div class="table-responsive">
            <table class="leaderboard-table">
              <thead>
                <tr>
                  <th class="th-rank">Rank</th>
                  <th class="th-studio">Studio Name</th>
                  <th class="th-founder">Leadership</th>
                  <th class="th-type">Category</th>
                  <th class="th-rep">Reputation</th>
                  <th class="th-boxoffice">Active Box Office</th>
                  <th class="th-nw">Valuation</th>
                  <th class="th-action">Action</th>
                </tr>
              </thead>
              <tbody>
                ${allRanked.map((s, idx) => {
                  const isPlayer = s.isPlayer;
                  const rankNum = idx + 1;
                  const rankIcon = rankNum === 1 ? '👑' : (rankNum === 2 ? '🥈' : (rankNum === 3 ? '🥉' : ''));
                  const hasRelease = s.activeReleases && s.activeReleases.length > 0;
                  const crest = getStudioCrestSvg(s.name, s.isUnicorn);

                  return `
                    <tr class="lb-row ${isPlayer ? 'lb-row-player' : ''}">
                      <td class="td-rank">
                        <span class="rank-indicator ${rankNum <= 3 ? 'rank-top3' : ''}">${rankIcon} #${rankNum}</span>
                      </td>
                      <td class="td-studio">
                        <div class="lb-studio-cell">
                          <img src="${crest}" class="lb-crest-mini" alt="" />
                          <div class="lb-studio-names">
                            <strong class="lb-studio-title">${escapeHtml(s.name)}</strong>
                            ${isPlayer ? '<span class="badge badge-emerald text-xs">⭐ YOUR EMPIRE</span>' : ''}
                            ${s.isPublic ? `<span class="badge badge-gold font-mono text-xs">${s.ticker}</span>` : ''}
                          </div>
                        </div>
                      </td>
                      <td class="td-founder text-muted">
                        ${escapeHtml(s.founder || s.founderName || 'Board')}
                      </td>
                      <td class="td-type">
                        <span class="badge ${isPlayer ? 'badge-amber' : (s.isUnicorn ? 'badge-indigo' : 'badge-slate')}">
                          ${isPlayer ? 'Player Studio' : (s.isUnicorn ? '🦄 Star Unicorn' : '🏛️ Legacy')}
                        </span>
                      </td>
                      <td class="td-rep">
                        <div class="lb-rep-cell">
                          <div class="rep-mini-bar">
                            <div class="rep-mini-fill" style="width: ${Math.min(100, s.reputation)}%"></div>
                          </div>
                          <span class="rep-mini-num">${s.reputation}</span>
                        </div>
                      </td>
                      <td class="td-boxoffice">
                        ${hasRelease ? `
                          <span class="highlight-emerald font-mono font-bold text-xs">
                            🎬 ${formatRupees(s.activeReleases[0].totalGross)}
                          </span>
                        ` : '<span class="text-dim text-xs">Pre-Production</span>'}
                      </td>
                      <td class="td-nw">
                        <span class="font-mono font-bold highlight-gold">${formatRupees(s.netWorth)}</span>
                      </td>
                      <td class="td-action">
                        <button class="btn btn-xs btn-secondary btn-view-studio" data-studio-id="${s.id}">
                          ${isPlayer ? 'Your Studio' : 'Inside'}
                        </button>
                      </td>
                    </tr>
                  `;
                }).join('')}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    `;
  }

  function attachEventListeners(container, state, callbacks) {
    // Clock turns
    container.querySelector('#btnNextDay')?.addEventListener('click', () => callbacks.onAdvanceTurn?.(1));
    container.querySelector('#btnAdvanceWeek')?.addEventListener('click', () => callbacks.onAdvanceTurn?.(7));
    container.querySelector('#btnAdvanceMonth')?.addEventListener('click', () => callbacks.onAdvanceTurn?.(30));
    container.querySelector('#btnAdvanceEvent')?.addEventListener('click', () => callbacks.onAdvanceToEvent?.());

    container.querySelector('#btnOpenSaveManager')?.addEventListener('click', () => {
      window.StudioGame.UI.SaveModal.open(state, callbacks.onStateChange);
    });

    // Sub tabs
    container.querySelectorAll('.studios-tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        activeSubTab = btn.getAttribute('data-subtab');
        render(container, state, callbacks);
      });
    });

    // Search input
    const searchInput = container.querySelector('#studioSearchInput');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        studioSearchQuery = e.target.value;
        render(container, state, callbacks);
        const refocused = container.querySelector('#studioSearchInput');
        if (refocused) {
          refocused.focus();
          refocused.setSelectionRange(studioSearchQuery.length, studioSearchQuery.length);
        }
      });
    }

    container.querySelector('#btnClearStudioSearch')?.addEventListener('click', () => {
      studioSearchQuery = '';
      render(container, state, callbacks);
    });

    // Attitude filter pills
    container.querySelectorAll('[data-attitude]').forEach(btn => {
      btn.addEventListener('click', () => {
        activeAttitudeFilter = btn.getAttribute('data-attitude');
        render(container, state, callbacks);
      });
    });

    // View Studio inside modal
    container.querySelectorAll('.btn-view-studio').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const studioId = btn.getAttribute('data-studio-id');
        openStudioDossierModal(studioId, state, callbacks);
      });
    });

    container.querySelectorAll('.studio-profile-card').forEach(card => {
      card.addEventListener('click', () => {
        const studioId = card.getAttribute('data-studio-id');
        openStudioDossierModal(studioId, state, callbacks);
      });
    });
  }

  /**
   * Redesigned Studio Inside Screen:
   * Overview, Contracted Stars Roster with Poaching Buyouts, Theatrical Runs, and Diplomacy.
   */
    function getStudioSubTabTitle(tab) {
    if (tab === 'stars') return '⭐ Contracted Stars & Poaching';
    if (tab === 'top_projects') return '🏆 All-Time Top 5 Box Office Blockbusters';
    if (tab === 'overview') return '🏛️ Financials & Studio IP';
    if (tab === 'theatre') return '🎟️ Theatrical Box Office Runs';
    if (tab === 'diplomacy') return '🤝 Co-Production & Alliances';
    return 'Studio Overview';
  }

  function openStudioDossierModal(studioId, state, callbacks) {
    const existing = document.getElementById('studioDossierModal');
    if (existing) existing.remove();

    let studio;
    if (studioId === 'player_studio') {
      const completed = (state.studio.completedProjects || []);
      const topProjects = completed.map(p => ({
        title: p.title,
        format: p.format || 'Theatrical Feature Film',
        stars: p.castNames || ['Ensemble Cast'],
        director: p.directorName || state.player.name,
        boxOfficeGross: p.boxOfficeGross || 0,
        budget: p.budget || 0,
        verdict: p.verdict || 'Hit',
        year: 2026,
        completedDay: p.completedDay || 1
      })).sort((a, b) => b.boxOfficeGross - a.boxOfficeGross).slice(0, 5);

      studio = {
        id: 'player_studio',
        name: state.studio.name,
        founder: state.player.name,
        netWorth: state.studio.netWorth,
        cash: state.player.cash,
        isPlayer: true,
        isUnicorn: false,
        reputation: state.studio.reputation,
        attitude: 'friendly',
        signatureGenres: ['Versatile Commercial', 'High Glamour Cinema'],
        isPublic: !!state.market?.isStudioPublic,
        ticker: state.market?.studioTicker || null,
        filmsCount: completed.length,
        boxOfficeRecord: topProjects.length > 0 ? topProjects[0].boxOfficeGross : 0,
        activeReleases: (state.studio.activeProjects || []).filter(p => p.format && p.theatricalWeek > 0).map(p => ({
          title: p.title,
          week: p.theatricalWeek,
          weeklyGross: p.lastWeekGross || 0,
          totalGross: p.boxOfficeGross || 0
        })),
        topProjects: topProjects
      };
    } else {
      studio = [...state.studios.legacy, ...state.studios.unicorns].find(s => s.id === studioId);
    }
    if (!studio) return;

    const formatRupees = window.StudioGame.Systems.Finance.formatRupees;
    const isPublic = studio.isPublic;
    const crestUrl = getStudioCrestSvg(studio.name, studio.founderStarId !== undefined);

    let activeDossierTab = 'hub'; // 'hub' | 'stars' | 'overview' | 'theatre' | 'diplomacy' // 'stars' | 'overview' | 'theatre' | 'diplomacy'

    const backdrop = document.createElement('div');
    backdrop.className = 'modal-backdrop';
    backdrop.id = 'studioDossierModal';

    function renderDossierView() {
      // Find all stars contracted to this studio
      const contractedStars = (state.talent || []).filter(t =>
        t.contractWithStudioId === studio.id ||
        t.contractWith === studio.name ||
        (studio.contractedStars && studio.contractedStars.includes(t.name)) ||
        (studio.founderName && t.name === studio.founderName)
      );

      backdrop.innerHTML = `
        <div class="modal-card modal-lg slide-up">
          <div class="modal-header">
            <div class="modal-title-wrap">
              <img src="${crestUrl}" class="modal-crest-small" alt="" />
              <div>
                <div class="modal-studio-subtag">
                  <span class="badge ${studio.attitude === 'friendly' ? 'badge-emerald' : (studio.attitude === 'aggressive' ? 'badge-rose' : 'badge-amber')}">
                    ${studio.attitude ? studio.attitude.toUpperCase() : 'NEUTRAL'}
                  </span>
                  ${isPublic ? `<span class="badge badge-gold font-mono">${studio.ticker}</span>` : '<span class="badge badge-slate">PRIVATE HOUSE</span>'}
                </div>
                <h2 class="modal-title">${escapeHtml(studio.name)}</h2>
              </div>
            </div>
            <button class="btn-icon-close" id="btnCloseStudioModal" aria-label="Close">&times;</button>
          </div>

          <div class="modal-body studio-modal-body p-3">
            ${activeDossierTab === 'hub' ? `
              <!-- Studio Dossier Hub Cards Grid (v1.05 Overhaul) -->
              <div class="actions-hub-grid mb-3">
                <div class="action-hub-card" data-dossier-tab="stars">
                  <div class="action-hub-icon-wrap cinema-glow">⭐</div>
                  <div class="action-hub-content">
                    <div class="action-hub-title">Contracted Stars</div>
                    <div class="action-hub-subtitle">${contractedStars.length} Stars Under Exclusive Contract</div>
                    <div class="action-hub-badge badge-gold">${contractedStars.length} Stars</div>
                  </div>
                </div>

                <div class="action-hub-card" data-dossier-tab="top_projects">
                  <div class="action-hub-icon-wrap" style="background: linear-gradient(135deg, #f59e0b, #ef4444); color: #fff;">🏆</div>
                  <div class="action-hub-content">
                    <div class="action-hub-title">Top 5 All-Time Hits</div>
                    <div class="action-hub-subtitle">${(studio.topProjects || []).length} Blockbusters & Star Cast</div>
                    <div class="action-hub-badge badge-gold">🏆 Records</div>
                  </div>
                </div>

                <div class="action-hub-card" data-dossier-tab="overview">
                  <div class="action-hub-icon-wrap pipeline-glow">🏛️</div>
                  <div class="action-hub-content">
                    <div class="action-hub-title">Financials & Studio IP</div>
                    <div class="action-hub-subtitle">${formatRupees(studio.netWorth)} Net Worth & Corporate Valuation</div>
                    <div class="action-hub-badge">Balance Sheet</div>
                  </div>
                </div>

                <div class="action-hub-card" data-dossier-tab="theatre">
                  <div class="action-hub-icon-wrap archive-glow">🎟️</div>
                  <div class="action-hub-content">
                    <div class="action-hub-title">Theatrical Runs</div>
                    <div class="action-hub-subtitle">${(studio.activeReleases || []).length} Running Pan-India Titles</div>
                    <div class="action-hub-badge">${(studio.activeReleases || []).length} Active</div>
                  </div>
                </div>

                <div class="action-hub-card" data-dossier-tab="diplomacy">
                  <div class="action-hub-icon-wrap personal-glow">🤝</div>
                  <div class="action-hub-content">
                    <div class="action-hub-title">Co-Production Alliances</div>
                    <div class="action-hub-subtitle">Pitch 40% Co-Financing Partnerships</div>
                    <div class="action-hub-badge badge-emerald">Diplomacy</div>
                  </div>
                </div>
              </div>
            ` : `
              <!-- Focused Studio Sub-Screen with Back Navigation -->
              <div class="subscreen-back-bar mb-3 flex items-center justify-between">
                <button class="btn btn-sm btn-outline-gold font-bold" id="btnBackToStudioHub">
                  &larr; Back to Studio Overview
                </button>
                <span class="badge badge-gold font-mono text-xs uppercase">${getStudioSubTabTitle(activeDossierTab)}</span>
              </div>
            `}

            <!-- TAB 1: CONTRACTED STARS & POACHING -->
            ${activeDossierTab === 'stars' ? `
              <div class="rival-stars-section">
                <div class="poach-info-box mb-3">
                  <span class="poach-icon">⚡</span>
                  <div>
                    <strong>Talent Poaching & Buyout Center:</strong> You can break rival studio contracts by offering stars a 50% compensation buyout + 1.5x upfront bonus.
                    <span class="text-rose">Warning: Poaching will turn this studio hostile and aggressive!</span>
                  </div>
                </div>

                <div class="rival-stars-grid">
                  ${contractedStars.length > 0 ? contractedStars.map(star => {
                    const isPoachedToPlayer = star.contractStatus === 'signed_player';
                    const avatarUrl = window.StudioGame.Face.generate({ gender: star.gender, seed: star.avatarSeed || star.name });
                    const buyoutFee = Math.round(star.averageFee * 0.6);
                    const bonusFee = Math.round(star.averageFee * 0.85 * 1.5);
                    const totalPoachCost = buyoutFee + bonusFee;

                    return `
                      <div class="rival-star-item-card ${isPoachedToPlayer ? 'is-poached' : ''}">
                        <div class="rival-star-avatar">
                          <img src="${avatarUrl}" alt="${star.name}" class="avatar-img-square" />
                        </div>
                        <div class="rival-star-info">
                          <div class="star-top-row">
                            <strong class="star-name">${escapeHtml(star.name)}</strong>
                            <span class="badge ${isPoachedToPlayer ? 'badge-emerald' : 'badge-slate'}">
                              ${isPoachedToPlayer ? '⭐ Signed to You' : star.category}
                            </span>
                          </div>
                          <div class="star-stats-line text-xs text-muted">
                            <span>🔥 ${window.StudioGame.Systems.Talent.formatFans(star.fans)}</span>
                            <span>Acting: ${star.acting}</span>
                            <span>Glamour: ${star.glamour}</span>
                          </div>
                          <div class="star-contract-status text-xs mt-1">
                            ${isPoachedToPlayer ? '<span class="highlight-emerald font-bold">Defected to Your Studio!</span>' : `
                              <span class="text-dim font-mono">⏳ ${star.contractDaysRemaining || 90}D Left &bull; Fee: ${formatRupees(star.averageFee)}</span>
                            `}
                          </div>
                        </div>

                        ${!isPoachedToPlayer ? `
                          <button class="btn btn-sm btn-outline-rose btn-poach-star" data-star-id="${star.id}" data-cost="${totalPoachCost}">
                            ⚡ Poach Star (${formatRupees(totalPoachCost)})
                          </button>
                        ` : ''}
                      </div>
                    `;
                  }).join('') : `
                    <div class="empty-results-box text-center p-4">
                      <span class="empty-icon">⭐</span>
                      <h4>No Contracted Artistes</h4>
                      <p>${studio.name} currently operates primarily with non-exclusive free agents.</p>
                    </div>
                  `}
                </div>
              </div>
            ` : ''}

            <!-- TAB 2: OVERVIEW & FINANCIALS -->
            ${activeDossierTab === 'overview' ? `
              <div class="studio-hero-intel mb-3">
                <div class="intel-col">
                  <span class="intel-lbl">Founded By</span>
                  <span class="intel-val">${escapeHtml(studio.founder || studio.founderName || 'Media Conglomerate')}</span>
                </div>
                <div class="intel-col">
                  <span class="intel-lbl">Valuation</span>
                  <span class="intel-val highlight-gold font-mono">${formatRupees(studio.netWorth)}</span>
                </div>
                <div class="intel-col">
                  <span class="intel-lbl">Liquid Working Capital</span>
                  <span class="intel-val font-mono">${formatRupees(studio.cash || studio.netWorth * 0.3)}</span>
                </div>
                <div class="intel-col">
                  <span class="intel-lbl">Industry Reputation</span>
                  <span class="intel-val highlight-indigo">${studio.reputation}/100</span>
                </div>
              </div>

              <div class="studio-dossier-section mb-3">
                <h4 class="section-title">Core Competencies & Signature Genres</h4>
                <div class="genres-cluster">
                  ${(studio.signatureGenres || ['Commercial Drama', 'Spectacle Cinema']).map(g => `<span class="badge badge-blue">${g}</span>`).join('')}
                </div>
              </div>

              <div class="studio-dossier-section">
                <h4 class="section-title">Historic Filmography & Records</h4>
                <div class="filmography-stats-box">
                  <div class="proj-line">
                    <span>Feature Films Produced:</span>
                    <span class="font-mono font-bold">${studio.filmsCount || 0} Titles</span>
                  </div>
                  <div class="proj-line">
                    <span>All-Time Highest Grosser:</span>
                    <span class="font-mono font-bold highlight-gold">${formatRupees(studio.boxOfficeRecord || studio.netWorth * 0.8)}</span>
                  </div>
                  <div class="proj-line">
                    <span>Corporate Status:</span>
                    <span class="font-bold ${isPublic ? 'highlight-cyan' : ''}">${isPublic ? `Listed on Dalal Street (${studio.ticker})` : 'Private Enterprise'}</span>
                  </div>
                </div>
              </div>
            ` : ''}

            <!-- TAB 3: THEATRICAL RELEASES -->
            ${activeDossierTab === 'theatre' ? `
              <div class="studio-dossier-section">
                <h4 class="section-title">Active Films in Pan-India Theatres</h4>
                ${(studio.activeReleases && studio.activeReleases.length > 0) ? `
                  <div class="theatre-runs-list">
                    ${studio.activeReleases.map(rel => `
                      <div class="theatre-run-card">
                        <div class="run-header">
                          <span class="run-film-title">🎬 ${escapeHtml(rel.title)}</span>
                          <span class="badge badge-emerald">Week ${rel.week}</span>
                        </div>
                        <div class="run-stats">
                          <span>Weekly Run: <strong class="font-mono">${formatRupees(rel.weeklyGross)}</strong></span>
                          <span>Total Box Office: <strong class="highlight-gold font-mono">${formatRupees(rel.totalGross)}</strong></span>
                        </div>
                      </div>
                    `).join('')}
                  </div>
                ` : '<p class="empty-note text-muted p-3">No current titles running in theatres. New productions in development pipeline.</p>'}
              </div>
            ` : ''}

            <!-- TAB 4: DIPLOMACY & CO-PRODUCTION -->
            ${activeDossierTab === 'diplomacy' ? `
              <div class="studio-diplomacy-box">
                <div class="diplomacy-header">
                  <span class="diplomacy-icon">🤝</span>
                  <div>
                    <h4 class="diplomacy-title">Strategic Co-Production Partnership</h4>
                    <p class="diplomacy-desc">
                      Pitch a 40% joint co-production alliance with ${escapeHtml(studio.name)}. Shared budgets reduce capital exposure, pool star power, and expand screen distribution.
                    </p>
                  </div>
                </div>
                <div class="diplomacy-actions">
                  <button class="btn btn-primary" id="btnPitchCoProd">
                    Pitch 40% Co-Production Partnership
                  </button>
                </div>
              </div>
            ` : ''}

            <!-- TAB 5: TOP 5 ALL-TIME BOX OFFICE BLOCKBUSTERS -->
            ${activeDossierTab === 'top_projects' ? `
              <div class="studio-dossier-section">
                <div class="top-projects-header mb-3">
                  <h4 class="section-title text-base font-bold flex items-center gap-2">
                    <span>🏆</span> Top 5 All-Time Box Office Champions
                  </h4>
                  <p class="text-xs text-muted">Audited historical cinema productions ranked by lifetime worldwide gross collections, headliner cast, and verdicts.</p>
                </div>

                ${(studio.topProjects && studio.topProjects.length > 0) ? `
                  <div class="top-projects-container">
                    ${studio.topProjects.slice(0, 5).map((proj, idx) => {
                      const medals = ['🥇', '🥈', '🥉', '🎬', '🎬'];
                      const medal = medals[idx] || '🎬';
                      const castStr = Array.isArray(proj.stars) ? proj.stars.join(', ') : (proj.stars || 'Ensemble Cast');
                      const roi = proj.budget && proj.budget > 0 ? (proj.boxOfficeGross / proj.budget).toFixed(1) + 'x ROI' : '';
                      const verdictClass = getVerdictBadgeClass(proj.verdict);

                      return `
                        <div class="top-project-card ${idx === 0 ? 'rank-1' : ''}">
                          <div class="top-project-medal-col">
                            <span class="top-project-medal">${medal}</span>
                            <span class="top-project-rank-num font-mono">#${idx + 1}</span>
                          </div>

                          <div class="top-project-main">
                            <div class="top-project-title-row">
                              <h5 class="top-project-title">${escapeHtml(proj.title)}</h5>
                              <span class="badge ${verdictClass}">${escapeHtml(proj.verdict || 'Hit')}</span>
                              <span class="badge badge-slate text-xs">${escapeHtml(proj.format || 'Theatrical Feature')}</span>
                            </div>

                            <div class="top-project-stars-row">
                              <span>⭐ Cast: <strong class="text-main">${escapeHtml(castStr)}</strong></span>
                              ${proj.director ? `<span>&bull; Dir: <em>${escapeHtml(proj.director)}</em></span>` : ''}
                            </div>

                            <div class="top-project-meta-row">
                              <span>📅 Released: ${proj.year || 2024}</span>
                              ${proj.budget ? `<span>&bull; Budget: ${formatRupees(proj.budget)}</span>` : ''}
                              ${roi ? `<span class="highlight-emerald font-bold">&bull; ${roi}</span>` : ''}
                            </div>
                          </div>

                          <div class="top-project-gross-col">
                            <div class="top-project-gross-lbl">Worldwide Gross</div>
                            <div class="top-project-gross-val">${formatRupees(proj.boxOfficeGross)}</div>
                          </div>
                        </div>
                      `;
                    }).join('')}
                  </div>
                ` : `
                  <div class="empty-results-box text-center p-4">
                    <span class="empty-icon">🏆</span>
                    <h4>No Historical Releases Recorded</h4>
                    <p>${escapeHtml(studio.name)} has not completed any theatrical productions in the box office archives yet.</p>
                  </div>
                `}
              </div>
            ` : ''}
          </div>

          <div class="modal-footer">
            <button class="btn btn-secondary" id="btnCloseStudioBottom">Close</button>
          </div>
        </div>
      `;

      // Event listeners
      const close = () => backdrop.remove();
      backdrop.querySelector('#btnCloseStudioModal')?.addEventListener('click', close);
      backdrop.querySelector('#btnCloseStudioBottom')?.addEventListener('click', close);
      backdrop.addEventListener('click', (e) => {
        if (e.target === backdrop) close();
      });

      // Sub-tab toggling
      backdrop.querySelectorAll('[data-dossier-tab]').forEach(btn => {
        btn.addEventListener('click', () => {
          activeDossierTab = btn.getAttribute('data-dossier-tab');
          renderDossierView();
        });
      });

      backdrop.querySelector('#btnBackToStudioHub')?.addEventListener('click', () => {
        activeDossierTab = 'hub';
        renderDossierView();
      });

      // Pitch co-production
      backdrop.querySelector('#btnPitchCoProd')?.addEventListener('click', () => {
        const res = window.StudioGame.Systems.Studios.pitchCoProduction(state, studio.id);
        if (res.success) {
          window.StudioGame.State.autosave();
          callbacks.onStateChange?.();
          window.StudioGame.App.showToast(`🤝 ${res.message}`);
          close();
        } else {
          window.StudioGame.App.showToast(`⚠️ ${res.error}`);
        }
      });

      // Poach star button
      backdrop.querySelectorAll('.btn-poach-star').forEach(btn => {
        btn.addEventListener('click', () => {
          const starId = btn.getAttribute('data-star-id');
          const cost = parseInt(btn.getAttribute('data-cost'), 10);
          const star = (state.talent || []).find(t => t.id === starId);

          if (state.studio.cash < cost) {
            return window.StudioGame.App.showToast(`⚠️ Insufficient studio capital. Requires ${formatRupees(cost)}.`);
          }

          const res = window.StudioGame.Systems.Talent.poachTalent(state, starId, 12);
          if (res.success) {
            window.StudioGame.State.autosave();
            callbacks.onStateChange?.();
            window.StudioGame.App.showToast(`⚡ SENSATIONAL POACHING: ${res.talentName} defected to ${state.studio.name}!`);
            renderDossierView();
          } else {
            window.StudioGame.App.showToast(`⚠️ ${res.error}`);
          }
        });
      });
    }

    document.body.appendChild(backdrop);
    renderDossierView();
  }

  function getVerdictBadgeClass(verdict) {
    if (!verdict) return 'badge-slate';
    const v = String(verdict).toLowerCase();
    if (v.includes('all-time') || v.includes('all time')) return 'badge-gold';
    if (v.includes('blockbuster')) return 'badge-emerald';
    if (v.includes('super hit')) return 'badge-indigo';
    if (v.includes('hit')) return 'badge-amber';
    if (v.includes('flop') || v.includes('disaster')) return 'badge-rose';
    return 'badge-slate';
  }

  function capitalize(str) {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1);
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
