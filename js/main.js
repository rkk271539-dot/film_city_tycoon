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
      id: 'wife',
      name: 'Wife',
      icon: '💍',
      unlocked: true,
      unlockVersion: '0.2',
      description: 'Partner & Co-founder: career decisions, relationship dynamics, openness, social events, fitness investments, and luxury business ventures.'
    },
    {
      id: 'actions',
      name: 'Actions',
      icon: '🎬',
      unlocked: true,
      unlockVersion: '0.3',
      description: 'Photoshoot & Ad Film bidding contracts against rival studios, feature film & series production pipeline, and studio lot upgrades.'
    },
    {
      id: 'talent',
      name: 'Talent',
      icon: '🌟',
      unlocked: true,
      unlockVersion: '0.4',
      description: 'Full talent roster of 300+ actresses and actors (Megastars & newcomers), dynamic fan following, fitness, debt bailouts, and contract negotiations.'
    },
    {
      id: 'studios',
      name: 'Studios',
      icon: '🏢',
      unlocked: true,
      unlockVersion: '0.7',
      description: 'The 25 Indian production houses + 10 Dynamic Unicorn Studios founded by top talent. Real-time net worth tracking and box office competition.'
    },
    {
      id: 'market',
      name: 'Market',
      icon: '📈',
      unlocked: true,
      unlockVersion: '0.9',
      description: 'Complex Dalal Street stock exchange, studio IPOs, technical analysis, buy/sell pressure engine with -8% to +8% circuit breakers.'
    },
    {
      id: 'bank',
      name: 'Bank',
      icon: '🏛️',
      unlocked: true,
      unlockVersion: '1.0',
      description: 'Imperial Reserve Bank of India: Term loans, mezzanine film bridge credit, Fixed Deposits (7.5% APY), and corporate debt management.'
    },
    {
      id: 'news',
      name: 'News',
      icon: '📰',
      unlocked: true,
      unlockVersion: '0.8',
      description: 'Trade magazines, box office rankings, media scandals in 5-star hotels, paparazzi leaks, and annual Bollywood awards season.'
    }
  ];

  function init() {
    console.log('Film City Tycoon Initializing... Version ' + window.StudioGame.State.CURRENT_VERSION);
    renderAppShell();

    // Check for existing save
    if (window.StudioGame.State.hasSavedGame() && window.StudioGame.State.loadAutosave()) {
      routeScreen();
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
      btn.addEventListener('click', () => {
        const tabId = btn.getAttribute('data-tab-id');
        const tabDef = TAB_DEFINITIONS.find(t => t.id === tabId);

        if (!tabDef) return;

        if (!tabDef.unlocked) {
          showLockedTabModal(tabDef);
          return;
        }

        // Reset to Cards Hub when tapping Actions or Bank
        if (tabId === 'actions' && window.StudioGame.UI.ActionsScreen?.resetToHub) {
          window.StudioGame.UI.ActionsScreen.resetToHub();
        } else if (tabId === 'bank' && window.StudioGame.UI.BankScreen?.resetToHub) {
          window.StudioGame.UI.BankScreen.resetToHub();
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
    } else if (activeTab === 'wife') {
      showWife();
    } else if (activeTab === 'actions') {
      showActions();
    } else if (activeTab === 'talent') {
      showTalent();
    } else if (activeTab === 'studios') {
      showStudios();
    } else if (activeTab === 'market') {
      showMarket();
    } else if (activeTab === 'bank') {
      showBank();
    } else if (activeTab === 'news') {
      showNews();
    }
  }

  function showActions() {
    const viewport = document.getElementById('screenViewport');
    const tabBar = document.getElementById('bottomTabBar');
    if (tabBar) tabBar.style.display = 'block';

    const state = window.StudioGame.State.get();
    if (!state) return;

    if (window.StudioGame.UI.ActionsScreen) {
      window.StudioGame.UI.ActionsScreen.render(viewport, state, {
        onAdvanceTurn: handleAdvanceTurn,
        onAdvanceToEvent: handleAdvanceToEvent,
        onStateChange: () => {
          showActions();
        }
      });
    }
  }

  function showTalent() {
    const viewport = document.getElementById('screenViewport');
    const tabBar = document.getElementById('bottomTabBar');
    if (tabBar) tabBar.style.display = 'block';

    const state = window.StudioGame.State.get();
    if (!state) return;

    if (window.StudioGame.UI.TalentScreen) {
      window.StudioGame.UI.TalentScreen.render(viewport, state, {
        onAdvanceTurn: handleAdvanceTurn,
        onAdvanceToEvent: handleAdvanceToEvent,
        onStateChange: () => {
          showTalent();
        }
      });
    }
  }

  function showStudios() {
    const viewport = document.getElementById('screenViewport');
    const tabBar = document.getElementById('bottomTabBar');
    if (tabBar) tabBar.style.display = 'block';

    const state = window.StudioGame.State.get();
    if (!state) return;

    if (window.StudioGame.UI.StudiosScreen) {
      window.StudioGame.UI.StudiosScreen.render(viewport, state, {
        onAdvanceTurn: handleAdvanceTurn,
        onAdvanceToEvent: handleAdvanceToEvent,
        onStateChange: () => {
          showStudios();
        }
      });
    }
  }

  function showMarket() {
    const viewport = document.getElementById('screenViewport');
    const tabBar = document.getElementById('bottomTabBar');
    if (tabBar) tabBar.style.display = 'block';

    const state = window.StudioGame.State.get();
    if (!state) return;

    if (window.StudioGame.UI.MarketScreen) {
      window.StudioGame.UI.MarketScreen.render(viewport, state, {
        onAdvanceTurn: handleAdvanceTurn,
        onAdvanceToEvent: handleAdvanceToEvent,
        onStateChange: () => {
          showMarket();
        }
      });
    }
  }

  function showBank() {
    const viewport = document.getElementById('screenViewport');
    const tabBar = document.getElementById('bottomTabBar');
    if (tabBar) tabBar.style.display = 'block';

    const state = window.StudioGame.State.get();
    if (!state) return;

    if (window.StudioGame.UI.BankScreen) {
      window.StudioGame.UI.BankScreen.render(viewport, state, {
        onAdvanceTurn: handleAdvanceTurn,
        onAdvanceToEvent: handleAdvanceToEvent,
        onStateChange: () => {
          showBank();
        }
      });
    }
  }

  function showNews() {
    const viewport = document.getElementById('screenViewport');
    const tabBar = document.getElementById('bottomTabBar');
    if (tabBar) tabBar.style.display = 'block';

    const state = window.StudioGame.State.get();
    if (!state) return;

    if (window.StudioGame.UI.NewsScreen) {
      window.StudioGame.UI.NewsScreen.render(viewport, state, {
        onAdvanceTurn: handleAdvanceTurn,
        onAdvanceToEvent: handleAdvanceToEvent,
        onStateChange: () => {
          showNews();
        }
      });
    }
  }

  function showStartScreen() {
    const viewport = document.getElementById('screenViewport');
    const tabBar = document.getElementById('bottomTabBar');
    if (tabBar) tabBar.style.display = 'none';

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

  
  function showWife() {
    activeTab = 'wife';
    updateActiveTabVisuals();
    const viewport = document.getElementById('screenViewport');
    const tabBar = document.getElementById('bottomTabBar');
    if (tabBar) tabBar.style.display = 'block';

    const state = window.StudioGame.State.get();
    if (!state) return;

    if (window.StudioGame.UI.WifeScreen) {
      window.StudioGame.UI.WifeScreen.render(viewport, state, {
        onAdvanceTurn: handleAdvanceTurn,
        onAdvanceToEvent: handleAdvanceToEvent,
        onStateChange: () => {
          showWife();
        }
      });
    }
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
    routeScreen();

    // Only notify if genuine noteworthy events or milestones occurred
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
    routeScreen();
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
        </div>

        <div class="modal-footer">
          <button class="btn btn-secondary btn-full" id="btnDismissLockedModal">Got it</button>
        </div>
      </div>
    `;

    document.body.appendChild(backdrop);

    const close = () => backdrop.remove();
    backdrop.querySelector('#btnCloseLockedModal').addEventListener('click', close);
    backdrop.querySelector('#btnDismissLockedModal').addEventListener('click', close);
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
    showWife,
    showActions,
    showTalent,
    showStudios,
    showMarket,
    showNews,
    showStartScreen,
    showToast
  };
})();

// Bootstrap when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  window.StudioGame.App.init();
});
