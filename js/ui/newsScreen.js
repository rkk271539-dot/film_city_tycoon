/**
 * Trade News, Scandals & Annual Awards UI Screen
 * Displays trade wire bulletins, paparazzi hotel gossip, box office clashes, and awards cabinet.
 */

window.StudioGame = window.StudioGame || {};
window.StudioGame.UI = window.StudioGame.UI || {};

window.StudioGame.UI.NewsScreen = (function() {
  let activeFilter = 'all'; // 'all', 'box_office', 'scandals', 'awards'
  let newsSearchQuery = '';

  function render(container, state, callbacks = {}) {
    if (!container || !state) return;
    window.StudioGame.Systems.News.ensureNewsState(state);

    const feed = state.feed || [];
    const awards = state.awards || { trophies: [] };

    let filtered = feed.filter(item => {
      if (activeFilter === 'box_office') {
        return item.category && (item.category.includes('Box Office') || item.category.includes('Release Clash'));
      }
      if (activeFilter === 'scandals') {
        return item.category && (item.category.includes('Paparazzi') || item.category.includes('Scandal'));
      }
      if (activeFilter === 'awards') {
        return item.category && (item.category.includes('Award') || item.category.includes('Milestone'));
      }
      return true;
    });

    if (newsSearchQuery.trim()) {
      const q = newsSearchQuery.toLowerCase().trim();
      filtered = filtered.filter(item =>
        (item.title && item.title.toLowerCase().includes(q)) ||
        (item.body && item.body.toLowerCase().includes(q)) ||
        (item.category && item.category.toLowerCase().includes(q))
      );
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
              <div class="top-studio-tag">${state.studio.name} &bull; Trade Wire & Insider</div>
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
          <!-- Trophy Shelf Banner -->
          <div class="trophy-shelf-banner">
            <div class="trophy-shelf-left">
              <span class="shelf-icon">🏆</span>
              <div class="shelf-text">
                <h3 class="shelf-title">National Studio Trophy Cabinet</h3>
                <p class="shelf-sub">
                  Annual National Cinema & Filmfare Awards gala takes place every <strong>December 31st</strong>.
                  Winners receive massive cash purses, national prestige, and stock market rallies.
                </p>
              </div>
            </div>
            <div class="trophy-count-pill">
              <span class="count-num">${awards.trophies.length}</span>
              <span class="count-lbl">Trophies Won</span>
            </div>
          </div>

          ${awards.trophies.length > 0 ? `
            <div class="trophies-display-row">
              ${awards.trophies.map(t => `
                <div class="trophy-item-card">
                  <span class="trophy-gold-icon">🏆</span>
                  <div class="trophy-item-info">
                    <span class="trophy-year">${t.year}</span>
                    <strong class="trophy-cat">${t.category}</strong>
                    <span class="trophy-proj">${t.project || t.recipient || state.studio.name}</span>
                  </div>
                </div>
              `).join('')}
            </div>
          ` : ''}

          <!-- Filter & Search Toolbar -->
          <div class="news-toolbar-card">
            <div class="news-search-row">
              <div class="search-input-wrap">
                <span class="search-icon">🔍</span>
                <input type="text" id="newsSearchInput" class="form-input search-input-padded" placeholder="Search trade wire, leaks, box office reports..." value="${escapeHtml(newsSearchQuery)}">
                ${newsSearchQuery ? '<button class="clear-search-btn" id="btnClearNewsSearch">&times;</button>' : ''}
              </div>

              <div class="news-filter-pills">
                <button class="filter-pill ${activeFilter === 'all' ? 'active' : ''}" data-filter="all">🌐 All Bulletins</button>
                <button class="filter-pill ${activeFilter === 'box_office' ? 'active' : ''}" data-filter="box_office">🎟️ Box Office</button>
                <button class="filter-pill ${activeFilter === 'scandals' ? 'active' : ''}" data-filter="scandals">📸 Paparazzi & Gossip</button>
                <button class="filter-pill ${activeFilter === 'awards' ? 'active' : ''}" data-filter="awards">🏆 Awards & Galas</button>
              </div>
            </div>
          </div>

          <!-- News Feed Stream -->
          <div class="news-feed-stream">
            ${filtered.length > 0 ? filtered.map(item => `
              <div class="news-bulletin-card">
                <div class="bulletin-header">
                  <span class="bulletin-icon">${item.icon || '📰'}</span>
                  <div class="bulletin-meta">
                    <span class="badge ${getCategoryBadgeClass(item.category)}">${item.category || 'General'}</span>
                    <span class="bulletin-date">${item.date || `Day ${item.day}`}</span>
                  </div>
                </div>

                <h3 class="bulletin-title">${escapeHtml(item.title)}</h3>
                <p class="bulletin-body">${escapeHtml(item.body)}</p>
              </div>
            `).join('') : `
              <div class="empty-news-card text-center">
                <span class="empty-icon">📰</span>
                <h4>No Wire Dispatches Found</h4>
                <p>No trade reports or insider dispatches match the selected filter.</p>
              </div>
            `}
          </div>
        </main>
      </div>
    `;

    attachEventListeners(container, state, callbacks);
  }

  function getCategoryBadgeClass(category) {
    if (!category) return 'badge-slate';
    if (category.includes('Award') || category.includes('IPO')) return 'badge-gold';
    if (category.includes('Paparazzi') || category.includes('Scandal')) return 'badge-rose';
    if (category.includes('Box Office') || category.includes('Release')) return 'badge-emerald';
    if (category.includes('Talent')) return 'badge-purple';
    return 'badge-blue';
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

    // Search input
    const searchInput = container.querySelector('#newsSearchInput');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        newsSearchQuery = e.target.value;
        render(container, state, callbacks);
        const refocused = container.querySelector('#newsSearchInput');
        if (refocused) {
          refocused.focus();
          refocused.setSelectionRange(newsSearchQuery.length, newsSearchQuery.length);
        }
      });
    }

    container.querySelector('#btnClearNewsSearch')?.addEventListener('click', () => {
      newsSearchQuery = '';
      render(container, state, callbacks);
    });

    // Filter pills
    container.querySelectorAll('[data-filter]').forEach(btn => {
      btn.addEventListener('click', () => {
        activeFilter = btn.getAttribute('data-filter');
        render(container, state, callbacks);
      });
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
