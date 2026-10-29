/**
 * Trade News, Scandals & Annual Awards UI Screen
 * Displays trade wire bulletins, paparazzi hotel gossip, box office clashes, and awards cabinet.
 */

window.StudioGame = window.StudioGame || {};
window.StudioGame.UI = window.StudioGame.UI || {};

window.StudioGame.UI.NewsScreen = (function() {
  let activeFilter = 'all'; // 'all', 'box_office', 'scandals', 'awards'

  function render(container, state, callbacks = {}) {
    window.StudioGame.Systems.News.ensureNewsState(state);

    const feed = state.feed || [];
    const awards = state.awards || { trophies: [] };

    const filtered = feed.filter(item => {
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

    container.innerHTML = `
      <div class="screen-container">
        <!-- Sticky Top Bar -->
        <header class="app-top-bar">
          <div class="top-bar-left">
            <div class="studio-brand">
              <span class="studio-logo-icon">📰</span>
              <div class="studio-titles">
                <h1 class="studio-title-text">Trade Wire & Scandals</h1>
                <span class="studio-subtitle-text">Bollywood Insider &bull; ${awards.trophies.length} Trophies Won</span>
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

        <!-- Trophy Shelf Banner -->
        <div class="trophy-shelf-banner">
          <div class="trophy-shelf-left">
            <span class="shelf-icon">🏆</span>
            <div class="shelf-text">
              <h3 class="shelf-title">Studio Trophy Showcase</h3>
              <p class="shelf-sub">
                Annual Filmfare & National Awards gala takes place every <strong>December 31st</strong>.
                Winners receive cash purses, national acclaim, and massive stock rallies.
              </p>
            </div>
          </div>
          <div class="trophy-count-pill">
            <span class="count-num">${awards.trophies.length}</span>
            <span class="count-lbl">Golden Trophies</span>
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

        <!-- Filter Tabs -->
        <div class="news-filter-tabs">
          <button class="news-tab-btn ${activeFilter === 'all' ? 'active' : ''}" data-filter="all">
            🌐 All News Wire
          </button>
          <button class="news-tab-btn ${activeFilter === 'box_office' ? 'active' : ''}" data-filter="box_office">
            🎟️ Box Office Reports
          </button>
          <button class="news-tab-btn ${activeFilter === 'scandals' ? 'active' : ''}" data-filter="scandals">
            📸 Paparazzi & Hotel Leaks
          </button>
          <button class="news-tab-btn ${activeFilter === 'awards' ? 'active' : ''}" data-filter="awards">
            🏆 Galas & Milestones
          </button>
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
              <p>No reports currently available in this wire filter.</p>
            </div>
          `}
        </div>
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
    container.querySelector('#btnPlus7Days')?.addEventListener('click', () => callbacks.onAdvanceTurn?.(7));
    container.querySelector('#btnPlus30Days')?.addEventListener('click', () => callbacks.onAdvanceTurn?.(30));
    container.querySelector('#btnNextEvent')?.addEventListener('click', () => callbacks.onAdvanceToEvent?.());

    // Filter tabs
    container.querySelectorAll('.news-tab-btn').forEach(btn => {
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
