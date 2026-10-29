/**
 * Dashboard (Home Screen) UI Component
 * Renders the primary dashboard view including header, turn controls, net worth chart,
 * wife card, studio summary, skill banner, and activity feed.
 */

window.StudioGame = window.StudioGame || {};
window.StudioGame.UI = window.StudioGame.UI || {};

window.StudioGame.UI.Dashboard = (function() {
  let activeChartTab = 'personal'; // 'personal' | 'studio'
  let activeRangeTab = 'ALL'; // '7D' | '30D' | '90D' | '1Y' | 'ALL'

  function getFilteredHistory(history, range) {
    if (!history || history.length === 0) return [];
    if (range === 'ALL') return history;

    const daysCount = range === '7D' ? 7 : range === '30D' ? 30 : range === '90D' ? 90 : 365;
    return history.slice(-daysCount);
  }

  function render(container, state, callbacks = {}) {
    if (!container || !state) return;
    if (window.StudioGame.Systems.Wife) {
      window.StudioGame.Systems.Wife.ensureWifeState(state);
    }
    const formatRupees = window.StudioGame.Systems.Finance.formatRupees;
    const skills = window.StudioGame.Data.Skills || [];
    const playerSkill = skills.find(s => s.id === state.player.skill) || {
      name: 'Independent Creator',
      tagline: 'Standard Industry Modifier',
      icon: '🎬'
    };

    // Calculate net worth change from start
    const firstPoint = state.history[0] || { playerNetWorth: state.player.netWorth, studioNetWorth: state.studio.netWorth };
    const currentVal = activeChartTab === 'personal' ? state.player.netWorth : state.studio.netWorth;
    const initialVal = activeChartTab === 'personal' ? firstPoint.playerNetWorth : firstPoint.studioNetWorth;
    const diff = currentVal - initialVal;
    const percentDiff = initialVal > 0 ? ((diff / initialVal) * 100).toFixed(2) : '0.00';
    const isGain = diff >= 0;

    container.innerHTML = `
      <div class="dashboard-page">
        <!-- Top App Bar -->
        <header class="top-nav-bar">
          <div class="top-user-wrap">
            <div class="avatar-small">
              <img src="${state.player.avatar}" alt="${state.player.name}" class="avatar-img-round" />
            </div>
            <div class="top-user-meta">
              <div class="top-player-name">${state.player.name}</div>
              <div class="top-studio-tag">${state.studio.name}</div>
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

        <!-- Wealth Overview Ribbon -->
        <section class="wealth-ribbon">
          <div class="wealth-item">
            <span class="ribbon-label">Personal Net Worth</span>
            <span class="ribbon-val highlight-emerald">${formatRupees(state.player.netWorth)}</span>
          </div>
          <div class="ribbon-divider"></div>
          <div class="wealth-item">
            <span class="ribbon-label">Studio Valuation</span>
            <span class="ribbon-val highlight-indigo">${formatRupees(state.studio.netWorth)}</span>
          </div>
          <div class="ribbon-divider"></div>
          <div class="wealth-item">
            <span class="ribbon-label">Liquid Cash</span>
            <span class="ribbon-val highlight-amber">${formatRupees(state.player.cash)}</span>
          </div>
        </section>

        <!-- Floating / Sticky Turn Control Bar -->
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

        <!-- Main Content Stream -->
        <main class="dashboard-content">
          <!-- Permanent Skill Card -->
          <div class="skill-banner">
            <div class="skill-banner-icon">${playerSkill.icon}</div>
            <div class="skill-banner-info">
              <div class="skill-banner-title">
                <span>${playerSkill.name}</span>
                <span class="badge badge-purple text-xs">Permanent Skill</span>
              </div>
              <div class="skill-banner-tagline">${playerSkill.tagline}</div>
            </div>
          </div>

          <!-- Interactive Net Worth Chart Card -->
          <div class="card chart-card">
            <div class="card-header chart-card-header">
              <div class="chart-tab-group">
                <button class="chart-tab-btn ${activeChartTab === 'personal' ? 'active' : ''}" data-chart-tab="personal">
                  Personal Net Worth
                </button>
                <button class="chart-tab-btn ${activeChartTab === 'studio' ? 'active' : ''}" data-chart-tab="studio">
                  Studio Net Worth
                </button>
              </div>
              <div class="range-tab-group">
                ${['7D', '30D', '90D', '1Y', 'ALL'].map(r => `
                  <button class="range-tab-btn ${activeRangeTab === r ? 'active' : ''}" data-range="${r}">${r}</button>
                `).join('')}
              </div>
            </div>

            <div class="chart-hero-summary">
              <div class="chart-current-val">${formatRupees(currentVal)}</div>
              <div class="chart-diff-badge ${isGain ? 'diff-gain' : 'diff-loss'}">
                ${isGain ? '▲' : '▼'} ${formatRupees(diff, { forcePlus: true })} (${percentDiff}%)
              </div>
            </div>

            <div class="chart-canvas-container">
              <canvas id="netWorthCanvas" style="width: 100%; height: 180px;"></canvas>
            </div>
          </div>

          <!-- Wife Card (Home Dashboard Link) -->
          <div class="card interactive-card wife-card" id="cardWifeDashboard">
            <div class="card-header">
              <div class="card-title-group">
                <span class="badge badge-rose">Spouse & Co-Founder</span>
                <h3 class="card-title">${state.wife.name}</h3>
              </div>
              <span class="view-more-tag">View Full Page &rarr;</span>
            </div>

            <div class="wife-card-content">
              <div class="wife-avatar-wrap">
                <img src="${state.wife.avatar}" alt="${state.wife.name}" class="avatar-img-round" />
                <div class="wife-status-bubble" title="Relationship loyalty">❤️ ${state.wife.relationship}%</div>
              </div>
              <div class="wife-meta-wrap">
                <div class="wife-role-line">
                  <span class="status-dot"></span>
                  <span class="role-text">${state.wife.currentRole}</span>
                </div>
                <div class="wife-stats-row">
                  <div class="wife-stat-chip">
                    <span class="chip-label">Net Worth</span>
                    <span class="chip-val highlight-emerald">${formatRupees(state.wife.netWorth)}</span>
                  </div>
                  <div class="wife-stat-chip">
                    <span class="chip-label">Openness</span>
                    <span class="chip-val highlight-amber">${state.wife.openness}/100</span>
                  </div>
                  <div class="wife-stat-chip">
                    <span class="chip-label">Fitness</span>
                    <span class="chip-val highlight-cyan">${state.wife.fitness}%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Studio Overview Card -->
          <div class="card studio-summary-card">
            <div class="card-header">
              <div class="card-title-group">
                <span class="badge badge-indigo">Operations</span>
                <h3 class="card-title">${state.studio.name}</h3>
              </div>
              <span class="tier-pill">Tier 1 &bull; Indie Studio</span>
            </div>

            <div class="studio-stats-grid">
              <div class="mini-stat-card">
                <span class="mini-stat-label">Studio Cash</span>
                <span class="mini-stat-val highlight-amber">${formatRupees(state.studio.cash)}</span>
                <span class="mini-stat-sub">Working Capital</span>
              </div>
              <div class="mini-stat-card">
                <span class="mini-stat-label">Fixed Overheads</span>
                <span class="mini-stat-val text-muted">${formatRupees(500 * (state.player.skill === 'brilliant_manager' ? 0.75 : 1))}/day</span>
                <span class="mini-stat-sub">Office & Utilities</span>
              </div>
              <div class="mini-stat-card">
                <span class="mini-stat-label">Active Shoots</span>
                <span class="mini-stat-val highlight-cyan">0 Projects</span>
                <span class="mini-stat-sub">Shoots unlock in v0.3</span>
              </div>
              <div class="mini-stat-card">
                <span class="mini-stat-label">Outstanding Debt</span>
                <span class="mini-stat-val highlight-emerald">₹0 Debt</span>
                <span class="mini-stat-sub">Pristine Credit</span>
              </div>
            </div>
          </div>

          <!-- Daily Activity & Industry News Feed -->
          <div class="card feed-card">
            <div class="card-header">
              <h3 class="card-title">Daily Chronicle & Industry Feed</h3>
              <span class="badge badge-slate text-xs">${state.feed.length} Log Entries</span>
            </div>
            <div class="feed-list">
              ${state.feed.map(item => `
                <div class="feed-item">
                  <div class="feed-item-icon">${item.icon || '📌'}</div>
                  <div class="feed-item-content">
                    <div class="feed-item-header">
                      <span class="feed-item-title">${item.title}</span>
                      <span class="feed-item-date">${item.date}</span>
                    </div>
                    <div class="feed-item-body">${item.body}</div>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>
        </main>
      </div>
    `;

    // Render Chart Canvas
    renderActiveChart(state);

    // Attach Event Listeners
    attachEventListeners(container, state, callbacks);
  }

  function renderActiveChart(state) {
    const canvas = document.getElementById('netWorthCanvas');
    if (!canvas) return;

    const filtered = getFilteredHistory(state.history, activeRangeTab);
    const dataPoints = filtered.map(pt => ({
      value: activeChartTab === 'personal' ? pt.playerNetWorth : pt.studioNetWorth,
      label: `Day ${pt.day}`
    }));

    window.StudioGame.UI.Chart.render(canvas, dataPoints, {
      lineColor: activeChartTab === 'personal' ? '#10b981' : '#6366f1',
      fillColor: activeChartTab === 'personal' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(99, 102, 241, 0.15)'
    });
  }

  function attachEventListeners(container, state, callbacks) {
    // Open Save Manager
    const saveBtn = document.getElementById('btnOpenSaveManager');
    if (saveBtn) {
      saveBtn.addEventListener('click', () => {
        window.StudioGame.UI.SaveModal.open(state, callbacks.onStateChange);
      });
    }

    // Wife Card Tap
    const wifeCard = document.getElementById('cardWifeDashboard');
    if (wifeCard) {
      wifeCard.addEventListener('click', () => {
        if (window.StudioGame.UI.WifeScreen) {
          window.StudioGame.UI.WifeScreen.open(state, callbacks.onStateChange);
        } else if (window.StudioGame.UI.WifePreview) {
          window.StudioGame.UI.WifePreview.open(state);
        }
      });
    }

    // Chart Tabs
    container.querySelectorAll('.chart-tab-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        activeChartTab = e.target.getAttribute('data-chart-tab');
        render(container, state, callbacks);
      });
    });

    // Range Tabs
    container.querySelectorAll('.range-tab-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        activeRangeTab = e.target.getAttribute('data-range');
        render(container, state, callbacks);
      });
    });

    // Next Day Turn
    const nextDayBtn = document.getElementById('btnNextDay');
    if (nextDayBtn) {
      nextDayBtn.addEventListener('click', () => {
        if (callbacks.onAdvanceTurn) callbacks.onAdvanceTurn(1);
      });
    }

    // Advance 7 Days
    const advanceWeekBtn = document.getElementById('btnAdvanceWeek');
    if (advanceWeekBtn) {
      advanceWeekBtn.addEventListener('click', () => {
        if (callbacks.onAdvanceTurn) callbacks.onAdvanceTurn(7);
      });
    }

    // Advance 30 Days
    const advanceMonthBtn = document.getElementById('btnAdvanceMonth');
    if (advanceMonthBtn) {
      advanceMonthBtn.addEventListener('click', () => {
        if (callbacks.onAdvanceTurn) callbacks.onAdvanceTurn(30);
      });
    }

    // Advance to Event
    const advanceEventBtn = document.getElementById('btnAdvanceEvent');
    if (advanceEventBtn) {
      advanceEventBtn.addEventListener('click', () => {
        if (callbacks.onAdvanceToEvent) callbacks.onAdvanceToEvent();
      });
    }
  }

  return {
    render
  };
})();
