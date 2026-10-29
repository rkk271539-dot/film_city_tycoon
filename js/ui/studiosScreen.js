/**
 * Studios UI Screen
 * Displays the 25 Legacy Indian Studios & 10 Dynamic Talent-Led Unicorn Houses,
 * live theatrical box office tracking, rankings, and studio diplomacy.
 */

window.StudioGame = window.StudioGame || {};
window.StudioGame.UI = window.StudioGame.UI || {};

window.StudioGame.UI.StudiosScreen = (function() {
  let activeSubTab = 'legacy'; // 'legacy', 'unicorns', 'leaderboard'

  function render(container, state, callbacks = {}) {
    window.StudioGame.Systems.Studios.ensureStudiosState(state);

    const legacy = state.studios.legacy || [];
    const unicorns = state.studios.unicorns || [];

    // Calculate player ranking among all 36 studios
    const allStudiosRanked = [
      { name: state.studio.name, netWorth: state.studio.netWorth, isPlayer: true, reputation: state.studio.reputation },
      ...legacy.map(s => ({ name: s.name, netWorth: s.netWorth, isPlayer: false, reputation: s.reputation })),
      ...unicorns.map(u => ({ name: u.name, netWorth: u.netWorth, isPlayer: false, reputation: u.reputation }))
    ].sort((a, b) => b.netWorth - a.netWorth);

    const playerRank = allStudiosRanked.findIndex(s => s.isPlayer) + 1;

    container.innerHTML = `
      <div class="screen-container">
        <!-- Sticky Top Bar -->
        <header class="app-top-bar">
          <div class="top-bar-left">
            <div class="studio-brand">
              <span class="studio-logo-icon">🏢</span>
              <div class="studio-titles">
                <h1 class="studio-title-text">Indian Studios</h1>
                <span class="studio-subtitle-text">25 Legacy Houses &bull; 10 Talent Unicorns &bull; Your Rank: #${playerRank}</span>
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

        <!-- National Ranking Banner -->
        <div class="rank-banner-card">
          <div class="rank-banner-left">
            <div class="rank-number-pill">Rank #${playerRank}</div>
            <div class="rank-info-text">
              <div class="rank-headline">${state.studio.name} (${window.StudioGame.Systems.Finance.formatRupees(state.studio.netWorth)})</div>
              <div class="rank-sub">Target Win Condition: Maintain <strong>Rank #1 Studio</strong> in India for 3 years straight!</div>
            </div>
          </div>
          <div class="rank-banner-right">
            <span class="leader-pill">👑 #1 Studio: ${allStudiosRanked[0]?.name} (${window.StudioGame.Systems.Finance.formatRupees(allStudiosRanked[0]?.netWorth)})</span>
          </div>
        </div>

        <!-- Sub Tabs Navigation -->
        <div class="studios-nav-tabs">
          <button class="studios-tab-btn ${activeSubTab === 'legacy' ? 'active' : ''}" data-subtab="legacy">
            🏛️ Legacy Studios (25)
          </button>
          <button class="studios-tab-btn ${activeSubTab === 'unicorns' ? 'active' : ''}" data-subtab="unicorns">
            🦄 Dynamic Unicorns (Top 10)
          </button>
          <button class="studios-tab-btn ${activeSubTab === 'leaderboard' ? 'active' : ''}" data-subtab="leaderboard">
            🏆 Box Office & Net Worth Board
          </button>
        </div>

        <!-- Tab Viewport -->
        <div class="studios-tab-content">
          ${activeSubTab === 'legacy' ? renderLegacyGrid(legacy, state) : ''}
          ${activeSubTab === 'unicorns' ? renderUnicornsGrid(unicorns, state) : ''}
          ${activeSubTab === 'leaderboard' ? renderLeaderboard(allStudiosRanked, state) : ''}
        </div>
      </div>
    `;

    attachEventListeners(container, state, callbacks);
  }

  function renderLegacyGrid(studios, state) {
    return `
      <div class="studios-grid">
        ${studios.map(studio => renderStudioCard(studio, false, state)).join('')}
      </div>
    `;
  }

  function renderUnicornsGrid(unicorns, state) {
    return `
      <div class="unicorn-info-banner">
        <span class="unicorn-banner-icon">🦄</span>
        <div class="unicorn-banner-desc">
          <strong>Top 10 Talent Unicorns:</strong> Boutique production companies founded and run by actors & actresses.
          They dynamically rise and collapse. If one goes bankrupt, another star-led studio takes its place!
        </div>
      </div>
      <div class="studios-grid">
        ${unicorns.map((u, idx) => renderStudioCard(u, true, state, idx + 1)).join('')}
      </div>
    `;
  }

  function renderStudioCard(s, isUnicorn, state, rank = null) {
    const hasActiveRelease = s.activeReleases && s.activeReleases.length > 0;
    const isPublic = s.isPublic;

    let attitudeBadgeClass = 'badge-slate';
    if (s.attitude === 'friendly') attitudeBadgeClass = 'badge-emerald';
    else if (s.attitude === 'rival') attitudeBadgeClass = 'badge-amber';
    else if (s.attitude === 'aggressive') attitudeBadgeClass = 'badge-rose';

    return `
      <div class="studio-card ${isUnicorn ? 'unicorn-card' : ''}" data-studio-id="${s.id}">
        <div class="studio-card-header">
          <div class="studio-card-title-group">
            <div class="studio-name-row">
              ${rank ? `<span class="unicorn-rank-tag">#${rank}</span>` : ''}
              <h3 class="studio-card-name">${escapeHtml(s.name)}</h3>
              ${isPublic ? `<span class="badge badge-gold font-mono">${s.ticker || 'IPO'}</span>` : ''}
            </div>
            <span class="studio-founder-meta">
              Founded by <strong>${escapeHtml(s.founder || s.founderName || 'Media Board')}</strong>
              ${s.established ? `&bull; Est. ${s.established}` : ''}
            </span>
          </div>

          <div class="studio-nw-pill">
            <span class="nw-label">Net Worth</span>
            <span class="nw-val highlight-gold">${window.StudioGame.Systems.Finance.formatRupees(s.netWorth)}</span>
          </div>
        </div>

        <div class="studio-card-badges">
          <span class="badge ${attitudeBadgeClass}">Attitude: ${s.attitude || 'Neutral'}</span>
          <span class="badge badge-blue">Reputation: ${s.reputation}/100</span>
          <span class="badge badge-purple">${s.filmsCount || 0} Films Produced</span>
        </div>

        ${hasActiveRelease ? `
          <div class="active-release-box">
            <div class="release-indicator-row">
              <span class="live-dot pulse"></span>
              <span class="release-tag">Running in Theatres:</span>
              <strong class="release-title">${escapeHtml(s.activeReleases[0].title)}</strong>
            </div>
            <div class="release-boxoffice-line">
              <span>Week ${s.activeReleases[0].week}</span>
              <span class="highlight-emerald">Total: ${window.StudioGame.Systems.Finance.formatRupees(s.activeReleases[0].totalGross)}</span>
            </div>
          </div>
        ` : `
          <div class="studio-inactive-release">
            <span>In Pre-Production & Development</span>
          </div>
        `}

        <div class="studio-card-footer">
          <div class="studio-genres-snippet">
            ${(s.signatureGenres || ['Commercial Cinema']).slice(0, 2).map(g => `<span class="genre-pill-sm">${g}</span>`).join('')}
          </div>
          <button class="btn btn-sm btn-secondary btn-view-studio" data-studio-id="${s.id}">
            Dossier & Partner
          </button>
        </div>
      </div>
    `;
  }

  function renderLeaderboard(allRanked, state) {
    return `
      <div class="leaderboard-table-card">
        <div class="table-header-row">
          <span class="col-rank">Rank</span>
          <span class="col-name">Production House</span>
          <span class="col-rep">Reputation</span>
          <span class="col-nw">Valuation</span>
        </div>
        <div class="table-body">
          ${allRanked.map((s, idx) => `
            <div class="table-row ${s.isPlayer ? 'is-player-row' : ''}">
              <span class="col-rank">#${idx + 1} ${idx === 0 ? '👑' : ''}</span>
              <span class="col-name">${escapeHtml(s.name)} ${s.isPlayer ? '⭐ (Your Studio)' : ''}</span>
              <span class="col-rep">${s.reputation}/100</span>
              <span class="col-nw font-mono highlight-gold">${window.StudioGame.Systems.Finance.formatRupees(s.netWorth)}</span>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  function attachEventListeners(container, state, callbacks) {
    // Clock turns
    container.querySelector('#btnNextDay')?.addEventListener('click', () => callbacks.onAdvanceTurn?.(1));
    container.querySelector('#btnPlus7Days')?.addEventListener('click', () => callbacks.onAdvanceTurn?.(7));
    container.querySelector('#btnPlus30Days')?.addEventListener('click', () => callbacks.onAdvanceTurn?.(30));
    container.querySelector('#btnNextEvent')?.addEventListener('click', () => callbacks.onAdvanceToEvent?.());

    // Sub tabs
    container.querySelectorAll('.studios-tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        activeSubTab = btn.getAttribute('data-subtab');
        render(container, state, callbacks);
      });
    });

    // View Studio modal
    container.querySelectorAll('.btn-view-studio').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const studioId = btn.getAttribute('data-studio-id');
        openStudioDossierModal(studioId, state, callbacks);
      });
    });

    container.querySelectorAll('.studio-card').forEach(card => {
      card.addEventListener('click', () => {
        const studioId = card.getAttribute('data-studio-id');
        openStudioDossierModal(studioId, state, callbacks);
      });
    });
  }

  function openStudioDossierModal(studioId, state, callbacks) {
    const existing = document.getElementById('studioDossierModal');
    if (existing) existing.remove();

    const studio = [...state.studios.legacy, ...state.studios.unicorns].find(s => s.id === studioId);
    if (!studio) return;

    const isPublic = studio.isPublic;
    const backdrop = document.createElement('div');
    backdrop.className = 'modal-backdrop';
    backdrop.id = 'studioDossierModal';

    backdrop.innerHTML = `
      <div class="modal-card modal-lg slide-up">
        <div class="modal-header">
          <div class="modal-title-wrap">
            <span class="badge ${studio.attitude === 'friendly' ? 'badge-emerald' : (studio.attitude === 'aggressive' ? 'badge-rose' : 'badge-amber')}">
              ${studio.attitude ? studio.attitude.toUpperCase() : 'NEUTRAL'}
            </span>
            <h2 class="modal-title">${escapeHtml(studio.name)}</h2>
          </div>
          <button class="btn-icon-close" id="btnCloseStudioModal" aria-label="Close">&times;</button>
        </div>

        <div class="modal-body studio-modal-body">
          <div class="studio-hero-intel">
            <div class="intel-col">
              <span class="intel-lbl">Founded By</span>
              <span class="intel-val">${escapeHtml(studio.founder || studio.founderName || 'Media Conglomerate')}</span>
            </div>
            <div class="intel-col">
              <span class="intel-lbl">Net Worth</span>
              <span class="intel-val highlight-gold">${window.StudioGame.Systems.Finance.formatRupees(studio.netWorth)}</span>
            </div>
            <div class="intel-col">
              <span class="intel-lbl">Working Capital</span>
              <span class="intel-val">${window.StudioGame.Systems.Finance.formatRupees(studio.cash || studio.netWorth * 0.3)}</span>
            </div>
            <div class="intel-col">
              <span class="intel-lbl">Stock Market Listing</span>
              <span class="intel-val ${isPublic ? 'highlight-cyan' : ''}">${isPublic ? `Listed (${studio.ticker})` : 'Private Studio'}</span>
            </div>
          </div>

          <!-- Signature Genres -->
          <div class="studio-dossier-section">
            <h4 class="section-title">Core Competencies & Signature Genres</h4>
            <div class="genres-cluster">
              ${(studio.signatureGenres || ['Commercial Drama', 'Spectacle Cinema']).map(g => `<span class="badge badge-blue">${g}</span>`).join('')}
            </div>
          </div>

          <!-- Active Theatrical Runs -->
          <div class="studio-dossier-section">
            <h4 class="section-title">Active Films in Theatres</h4>
            ${(studio.activeReleases && studio.activeReleases.length > 0) ? `
              <div class="theatre-runs-list">
                ${studio.activeReleases.map(rel => `
                  <div class="theatre-run-card">
                    <div class="run-header">
                      <span class="run-film-title">🎬 ${escapeHtml(rel.title)}</span>
                      <span class="badge badge-emerald">Week ${rel.week}</span>
                    </div>
                    <div class="run-stats">
                      <span>Weekly Run: <strong>${window.StudioGame.Systems.Finance.formatRupees(rel.weeklyGross)}</strong></span>
                      <span>Total Box Office: <strong class="highlight-gold">${window.StudioGame.Systems.Finance.formatRupees(rel.totalGross)}</strong></span>
                    </div>
                  </div>
                `).join('')}
              </div>
            ` : '<p class="empty-note">No current titles running in theatres. New productions in development pipeline.</p>'}
          </div>

          <!-- Diplomacy Actions -->
          <div class="studio-diplomacy-box">
            <h4 class="diplomacy-title">🤝 Inter-Studio Diplomacy</h4>
            <p class="diplomacy-desc">
              Forge strategic co-production alliances to reduce budget exposure and secure shared theatrical distribution across Pan-India circuits.
            </p>
            <div class="diplomacy-actions">
              <button class="btn btn-primary" id="btnPitchCoProd">
                Pitch 40% Co-Production Partnership
              </button>
            </div>
          </div>
        </div>

        <div class="modal-footer">
          <button class="btn btn-secondary" id="btnCloseStudioBottom">Close</button>
        </div>
      </div>
    `;

    document.body.appendChild(backdrop);

    const close = () => backdrop.remove();
    backdrop.querySelector('#btnCloseStudioModal')?.addEventListener('click', close);
    backdrop.querySelector('#btnCloseStudioBottom')?.addEventListener('click', close);
    backdrop.addEventListener('click', (e) => {
      if (e.target === backdrop) close();
    });

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
