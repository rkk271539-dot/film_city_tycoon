/**
 * Main Game Loop, Screen Router, and Tab Navigation Controller
 * Initializes game systems, manages screen state, and orchestrates turn progression.
 */

window.StudioGame = window.StudioGame || {};

window.StudioGame.App = (function() {
  let activeTab = 'home';
  const TAB_DEFINITIONS = [
    {
      id: 'home',
      name: 'Home',
      icon: '🏠',
      unlocked: true,
      unlockVersion: '0.1'
    },
    {
      id: 'actions',
      name: 'Actions',
      icon: '🎬',
      unlocked: false,
      unlockVersion: '0.3',
      description: 'Photoshoot & Ad Film bidding contracts against rival studios, project pipeline management, and studio upgrade facilities.'
    },
    {
      id: 'talent',
      name: 'Talent',
      icon: '🌟',
      unlocked: false,
      unlockVersion: '0.4',
      description: 'Full talent roster of 300+ actresses and actors (A-listers & newcomers), dynamic fan following, fitness, debt, and contract negotiations.'
    },
    {
      id: 'studios',
      name: 'Studios',
      icon: '🏢',
      unlocked: false,
      unlockVersion: '0.7',
      description: 'The 25 Indian production houses + 10 Dynamic Unicorn Studios founded by top talent. Real-time net worth tracking and box office competition.'
    },
    {
      id: 'market',
      name: 'Market',
      icon: '📈',
      unlocked: false,
      unlockVersion: '0.9',
      description: 'Complex Dalal Street stock exchange, studio IPOs, technical analysis, buy/sell pressure engine with -8% to +8% circuit breakers.'
    },
    {
      id: 'news',
      name: 'News',
      icon: '📰',
      unlocked: false,
      unlockVersion: '0.8',
      description: 'Trade magazines, box office rankings, media scandals in 5-star hotels, paparazzi leaks, and annual Bollywood awards season.'
    }
  ];

  function init() {
    console.log('Film City Tycoon Initializing... Version ' + window.StudioGame.State.CURRENT_VERSION);
    renderAppShell();

    // Check for existing save
    if (window.StudioGame.State.hasSavedGame() && window.StudioGame.State.loadAutosave()) {
      showDashboard();
    } else {
      showStartScreen();
    }
  }

  function renderAppShell() {
    const root = document.getElementById('app');
    if (!root) return;

    root.innerHTML = `
      <div class="app-layout">
        <!-- Main Screen Viewport -->
        <div class="screen-viewport" id="screenViewport"></div>

        <!-- Scrolling Bottom Navigation Bar -->
        <nav class="bottom-tab-bar" id="bottomTabBar">
          <div class="tab-scroll-container">
            ${TAB_DEFINITIONS.map(tab => `
              <button class="nav-tab-item ${tab.id === activeTab ? 'active' : ''} ${!tab.unlocked ? 'is-locked' : ''}" data-tab-id="${tab.id}">
                <div class="nav-icon-wrap">
                  <span class="nav-icon">${tab.icon}</span>
                  ${!tab.unlocked ? '<span class="lock-indicator">🔒</span>' : ''}
                </div>
                <span class="nav-label">${tab.name}</span>
                ${!tab.unlocked ? `<span class="version-tag">v${tab.unlockVersion}</span>` : ''}
              </button>
            `).join('')}
          </div>
        </nav>
      </div>

      <!-- Toast Container -->
      <div id="toastContainer" class="toast-container"></div>
    `;

    attachTabBarListeners();
  }

  function attachTabBarListeners() {
    const navButtons = document.querySelectorAll('.nav-tab-item');
    navButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const tabId = btn.getAttribute('data-tab-id');
        const tabDef = TAB_DEFINITIONS.find(t => t.id === tabId);

        if (!tabDef) return;

        if (!tabDef.unlocked) {
          showLockedTabModal(tabDef);
          return;
        }

        activeTab = tabId;
        updateActiveTabVisuals();
        routeScreen();
      });
    });
  }

  function updateActiveTabVisuals() {
    document.querySelectorAll('.nav-tab-item').forEach(btn => {
      const tabId = btn.getAttribute('data-tab-id');
      if (tabId === activeTab) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });
  }

  function routeScreen() {
    const state = window.StudioGame.State.get();
    if (!state) {
      showStartScreen();
      return;
    }

    if (activeTab === 'home') {
      showDashboard();
    }
  }

  function showStartScreen() {
    const viewport = document.getElementById('screenViewport');
    const tabBar = document.getElementById('bottomTabBar');
    if (tabBar) tabBar.style.display = 'none'; // Hide bottom tabs during character creation

    window.StudioGame.UI.StartScreen.render(viewport, (newGameParams) => {
      const newState = window.StudioGame.State.createInitialState(newGameParams);
      window.StudioGame.State.set(newState);
      window.StudioGame.State.autosave();

      if (tabBar) tabBar.style.display = 'block';
      activeTab = 'home';
      updateActiveTabVisuals();
      showDashboard();
      showToast('🎬 Studio successfully founded! Welcome to Mumbai Film City.');
    });
  }

  function showDashboard() {
    const viewport = document.getElementById('screenViewport');
    const tabBar = document.getElementById('bottomTabBar');
    if (tabBar) tabBar.style.display = 'block';

    const state = window.StudioGame.State.get();
    if (!state) return;

    window.StudioGame.UI.Dashboard.render(viewport, state, {
      onAdvanceTurn: handleAdvanceTurn,
      onAdvanceToEvent: handleAdvanceToEvent,
      onStateChange: () => {
        showDashboard();
      }
    });
  }

  function handleAdvanceTurn(days) {
    const state = window.StudioGame.State.get();
    if (!state) return;

    const result = window.StudioGame.Systems.Clock.advanceDays(state, days);
    window.StudioGame.State.autosave();
    showDashboard();

    // Only notify if genuine noteworthy events or milestones occurred, no routine skip toaster
    if (result.events && result.events.length > 0) {
      result.events.forEach(evt => {
        showToast(evt.message);
      });
    }
  }

  function handleAdvanceToEvent() {
    const state = window.StudioGame.State.get();
    if (!state) return;

    const result = window.StudioGame.Systems.Clock.advanceToNextEvent(state);
    window.StudioGame.State.autosave();
    showDashboard();
    showToast(`⚡ ${result.reason} (Advanced ${result.daysAdvanced} days)`);
  }

  function showLockedTabModal(tabDef) {
    const existing = document.getElementById('lockedModalBackdrop');
    if (existing) existing.remove();

    const backdrop = document.createElement('div');
    backdrop.className = 'modal-backdrop';
    backdrop.id = 'lockedModalBackdrop';
    backdrop.innerHTML = `
      <div class="modal-card slide-up">
        <div class="modal-header">
          <div class="modal-title-wrap">
            <span class="badge badge-amber">Locked Feature</span>
            <h2 class="modal-title">${tabDef.icon} ${tabDef.name} Tab</h2>
          </div>
          <button class="btn-icon-close" id="btnCloseLockedModal" aria-label="Close">&times;</button>
        </div>

        <div class="modal-body text-center">
          <div class="locked-icon-large">🔒</div>
          <div class="locked-version-headline">Unlocks in Version ${tabDef.unlockVersion}</div>
          <p class="locked-description">
            ${tabDef.description}
          </p>

          <div class="roadmap-box">
            <div class="roadmap-title">Current Development Milestone:</div>
            <div class="roadmap-val highlight-emerald">v0.2 Wife Autonomous Career Engine &bull; Complete</div>
            <div class="roadmap-next">Next Target: <strong>v0.3 Actions & Photoshoot Contracts</strong></div>
          </div>
        </div>

        <div class="modal-footer">
          <button class="btn btn-secondary btn-full" id="btnDismissLockedModal">Got it</button>
        </div>
      </div>
    `;

    document.body.appendChild(backdrop);

    const close = () => backdrop.remove();
    document.getElementById('btnCloseLockedModal').addEventListener('click', close);
    document.getElementById('btnDismissLockedModal').addEventListener('click', close);
    backdrop.addEventListener('click', (e) => {
      if (e.target === backdrop) close();
    });
  }

  function showToast(message, duration = 3000) {
    const container = document.getElementById('toastContainer');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = 'toast-bubble slide-down';
    toast.textContent = message;
    container.appendChild(toast);

    setTimeout(() => {
      toast.classList.add('fade-out');
      setTimeout(() => toast.remove(), 400);
    }, duration);
  }

  return {
    init,
    showDashboard,
    showStartScreen,
    showToast
  };
})();

// Bootstrap when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  window.StudioGame.App.init();
});
