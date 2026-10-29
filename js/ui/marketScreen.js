/**
 * Dalal Street Stock Market UI Screen
 * Live trading, order-book buy/sell pressure engine, technical analysis,
 * -8% to +8% circuit breaker indicators, portfolio tracking, and studio IPOs.
 */

window.StudioGame = window.StudioGame || {};
window.StudioGame.UI = window.StudioGame.UI || {};

window.StudioGame.UI.MarketScreen = (function() {
  let activeSubTab = 'exchange'; // 'exchange', 'portfolio', 'ipo'
  let marketSearchQuery = '';
  let activeSectorFilter = 'all';

  function render(container, state, callbacks = {}) {
    if (!container || !state) return;
    window.StudioGame.Systems.Market.ensureMarketState(state);

    const formatRupees = window.StudioGame.Systems.Finance.formatRupees;
    const market = state.market;
    const portfolio = market.portfolio || [];
    const companies = market.companies || [];

    // Calculate portfolio total value
    let portfolioTotalVal = 0;
    let portfolioTotalCost = 0;
    portfolio.forEach(h => {
      const comp = companies.find(c => c.ticker === h.ticker);
      const currentPrice = comp ? comp.sharePrice : h.avgBuyPrice;
      portfolioTotalVal += h.sharesCount * currentPrice;
      portfolioTotalCost += h.sharesCount * h.avgBuyPrice;
    });
    const portfolioProfit = portfolioTotalVal - portfolioTotalCost;
    const portfolioProfitPct = portfolioTotalCost > 0 ? ((portfolioProfit / portfolioTotalCost) * 100).toFixed(1) : 0;

    // Filter companies
    let filteredCompanies = [...companies];
    if (marketSearchQuery.trim()) {
      const q = marketSearchQuery.toLowerCase().trim();
      filteredCompanies = filteredCompanies.filter(c =>
        c.name.toLowerCase().includes(q) ||
        c.ticker.toLowerCase().includes(q) ||
        (c.sector && c.sector.toLowerCase().includes(q))
      );
    }

    if (activeSectorFilter !== 'all') {
      filteredCompanies = filteredCompanies.filter(c => {
        if (!c.sector) return false;
        const s = c.sector.toLowerCase();
        if (activeSectorFilter === 'multiplex') return s.includes('theat') || s.includes('multiplex') || s.includes('exhibit');
        if (activeSectorFilter === 'production') return s.includes('film') || s.includes('studio') || s.includes('product');
        if (activeSectorFilter === 'broadcasting') return s.includes('broadcast') || s.includes('tv') || s.includes('tele');
        if (activeSectorFilter === 'streaming') return s.includes('stream') || s.includes('music') || s.includes('digital');
        if (activeSectorFilter === 'vfx') return s.includes('vfx') || s.includes('animat') || s.includes('tech');
        return true;
      });
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
              <div class="top-studio-tag">${state.studio.name} &bull; Dalal Street</div>
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

        <!-- Main Content Stream -->
        <main class="dashboard-content">
          <!-- Market Overview Ribbon -->
          <div class="market-overview-grid">
            <div class="market-stat-card">
              <span class="m-stat-label">NIFTY MEDIA INDEX</span>
              <span class="m-stat-val highlight-gold font-mono">${market.niftyMediaIndex.toLocaleString('en-IN')}</span>
              <span class="m-stat-sub highlight-amber">Strict &plusmn;8% Circuit Cap</span>
            </div>

            <div class="market-stat-card">
              <span class="m-stat-label">PORTFOLIO VALUATION</span>
              <span class="m-stat-val highlight-emerald font-mono">${formatRupees(portfolioTotalVal)}</span>
              <span class="m-stat-sub ${portfolioProfit >= 0 ? 'highlight-emerald' : 'highlight-rose'}">
                ${portfolioProfit >= 0 ? '+' : ''}${formatRupees(portfolioProfit)} (${portfolioProfitPct}%)
              </span>
            </div>

            <div class="market-stat-card">
              <span class="m-stat-label">TRADING CASH</span>
              <span class="m-stat-val font-mono">${formatRupees(state.player.cash)}</span>
              <span class="m-stat-sub">Liquid Funds for Equities</span>
            </div>

            <div class="market-stat-card">
              <span class="m-stat-label">STUDIO IPO LISTING</span>
              <span class="m-stat-val ${market.isStudioPublic ? 'highlight-cyan' : 'highlight-amber'}">
                ${market.isStudioPublic ? `Listed (${market.studioTicker})` : 'Private Enterprise'}
              </span>
              <span class="m-stat-sub">${market.isStudioPublic ? `Public Float: ${(market.studioPublicFloatPct * 100).toFixed(0)}%` : 'Eligible for BSE/NSE IPO'}</span>
            </div>
          </div>

          <!-- Market Navigation Tabs -->
          <div class="market-nav-tabs-wrapper">
            <div class="market-nav-tabs">
              <button class="market-tab-btn ${activeSubTab === 'exchange' ? 'active' : ''}" data-subtab="exchange">
                📊 Dalal Street Exchange (${companies.length})
              </button>
              <button class="market-tab-btn ${activeSubTab === 'portfolio' ? 'active' : ''}" data-subtab="portfolio">
                💼 My Holdings (${portfolio.length})
              </button>
              <button class="market-tab-btn ${activeSubTab === 'ipo' ? 'active' : ''}" data-subtab="ipo">
                🔔 Studio IPO Center
              </button>
            </div>
          </div>

          <!-- Tab Viewport -->
          <div class="market-tab-content">
            ${activeSubTab === 'exchange' ? renderExchangeList(filteredCompanies, companies, state) : ''}
            ${activeSubTab === 'portfolio' ? renderPortfolioList(portfolio, companies, state) : ''}
            ${activeSubTab === 'ipo' ? renderIPOCenter(state) : ''}
          </div>
        </main>
      </div>
    `;

    attachEventListeners(container, state, callbacks);
  }

  function renderExchangeList(filteredCompanies, allCompanies, state) {
    return `
      <!-- Search & Sector Filter Toolbar -->
      <div class="market-toolbar-card">
        <div class="market-search-row">
          <div class="search-input-wrap">
            <span class="search-icon">🔍</span>
            <input type="text" id="marketSearchInput" class="form-input search-input-padded" placeholder="Search by ticker symbol (e.g. PVR, ZEE) or company name..." value="${escapeHtml(marketSearchQuery)}">
            ${marketSearchQuery ? '<button class="clear-search-btn" id="btnClearMarketSearch">&times;</button>' : ''}
          </div>

          <div class="sector-filter-pills">
            <button class="filter-pill ${activeSectorFilter === 'all' ? 'active' : ''}" data-sector="all">All Sectors (${allCompanies.length})</button>
            <button class="filter-pill ${activeSectorFilter === 'multiplex' ? 'active' : ''}" data-sector="multiplex">🍿 Multiplex</button>
            <button class="filter-pill ${activeSectorFilter === 'production' ? 'active' : ''}" data-sector="production">🎬 Production</button>
            <button class="filter-pill ${activeSectorFilter === 'broadcasting' ? 'active' : ''}" data-sector="broadcasting">📺 Television</button>
            <button class="filter-pill ${activeSectorFilter === 'streaming' ? 'active' : ''}" data-sector="streaming">🎧 OTT & Music</button>
            <button class="filter-pill ${activeSectorFilter === 'vfx' ? 'active' : ''}" data-sector="vfx">💻 VFX & Tech</button>
          </div>
        </div>
      </div>

      <!-- Stocks List -->
      <div class="market-stocks-list">
        ${filteredCompanies.length > 0 ? filteredCompanies.map(comp => {
          const isUp = comp.dayChangePct >= 0;
          const isCircuit = Math.abs(comp.dayChangePct) >= 7.8;
          const demandText = window.StudioGame.Systems.Market.getDemandLabel(comp.buyPressure || 50);

          return `
            <div class="stock-item-card" data-ticker="${comp.ticker}">
              <div class="stock-item-left">
                <div class="stock-ticker-row">
                  <span class="stock-ticker-badge font-mono">${comp.ticker}</span>
                  <h3 class="stock-company-name">${escapeHtml(comp.name)}</h3>
                  ${isCircuit ? '<span class="badge badge-amber pulse text-xs">⚡ &plusmn;8% CIRCUIT</span>' : ''}
                </div>
                <div class="stock-sector-desc">${escapeHtml(comp.sector)}</div>

                <!-- Order Book Pressure Gauge -->
                <div class="order-pressure-row">
                  <div class="pressure-header-line">
                    <span class="pressure-label">${demandText}</span>
                    <span class="pressure-pct-tag font-mono">${comp.buyPressure}% Buy &bull; ${100 - comp.buyPressure}% Sell</span>
                  </div>
                  <div class="pressure-bar-wrap" title="Buy Pressure: ${comp.buyPressure}%, Sell Pressure: ${100 - comp.buyPressure}%">
                    <div class="pressure-bar-buy" style="width: ${comp.buyPressure}%"></div>
                    <div class="pressure-bar-sell" style="width: ${100 - comp.buyPressure}%"></div>
                  </div>
                </div>
              </div>

              <div class="stock-item-right">
                <div class="stock-price-val font-mono">₹${comp.sharePrice.toLocaleString('en-IN')}</div>
                <div class="stock-change-pill font-mono ${isUp ? 'change-up' : 'change-down'}">
                  ${isUp ? '▲ +' : '▼ '}${comp.dayChangePct}%
                </div>
                <div class="stock-tech-snippet">
                  <span>RSI: <strong class="${comp.rsi > 70 ? 'highlight-rose' : (comp.rsi < 30 ? 'highlight-emerald' : '')}">${comp.rsi || 50}</strong></span>
                  <span>Trend: <strong>${formatTrend(comp.trend)}</strong></span>
                </div>
                <button class="btn btn-sm btn-outline-gold btn-trade-stock" data-ticker="${comp.ticker}">
                  Trade / Chart
                </button>
              </div>
            </div>
          `;
        }).join('') : `
          <div class="empty-results-box text-center">
            <span class="empty-icon">📈</span>
            <h4>No Equities Found</h4>
            <p>No listed securities match your search query and sector filter.</p>
          </div>
        `}
      </div>
    `;
  }

  function renderPortfolioList(portfolio, companies, state) {
    const formatRupees = window.StudioGame.Systems.Finance.formatRupees;

    if (!portfolio || portfolio.length === 0) {
      return `
        <div class="empty-portfolio-card text-center">
          <div class="empty-icon">💼</div>
          <h3 class="empty-title">No Active Stock Holdings</h3>
          <p class="empty-desc">You do not hold any studio or media shares in your portfolio. Explore the Dalal Street Exchange tab to trade blue-chip Indian entertainment stocks.</p>
        </div>
      `;
    }

    return `
      <div class="portfolio-container">
        <div class="portfolio-table-card">
          <div class="table-responsive">
            <table class="portfolio-table">
              <thead>
                <tr>
                  <th>Ticker / Company</th>
                  <th>Quantity</th>
                  <th>Avg Buy Price</th>
                  <th>Current LTP</th>
                  <th>Investment Value</th>
                  <th>Unrealized P&L</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                ${portfolio.map(h => {
                  const comp = companies.find(c => c.ticker === h.ticker);
                  const ltp = comp ? comp.sharePrice : h.avgBuyPrice;
                  const curVal = h.sharesCount * ltp;
                  const costVal = h.sharesCount * h.avgBuyPrice;
                  const pnl = curVal - costVal;
                  const pnlPct = costVal > 0 ? ((pnl / costVal) * 100).toFixed(1) : 0;
                  const isProfit = pnl >= 0;

                  return `
                    <tr class="pf-row">
                      <td class="td-company">
                        <div class="pf-company-cell">
                          <span class="stock-ticker-badge font-mono">${h.ticker}</span>
                          <strong class="pf-comp-name">${escapeHtml(h.companyName)}</strong>
                        </div>
                      </td>
                      <td class="font-mono font-bold">${h.sharesCount.toLocaleString('en-IN')}</td>
                      <td class="font-mono text-muted">₹${h.avgBuyPrice.toLocaleString('en-IN')}</td>
                      <td class="font-mono font-bold highlight-gold">₹${ltp.toLocaleString('en-IN')}</td>
                      <td class="font-mono font-bold">${formatRupees(curVal)}</td>
                      <td class="font-mono font-bold ${isProfit ? 'highlight-emerald' : 'highlight-rose'}">
                        ${isProfit ? '+' : ''}${formatRupees(pnl)} (${pnlPct}%)
                      </td>
                      <td>
                        <button class="btn btn-xs btn-primary btn-trade-stock" data-ticker="${h.ticker}">Trade</button>
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

  function renderIPOCenter(state) {
    const formatRupees = window.StudioGame.Systems.Finance.formatRupees;
    const isPublic = state.market.isStudioPublic;
    const canIPO = state.studio.netWorth >= 250000000 && (state.studio.completedProjects || []).length >= 4;

    if (isPublic) {
      return `
        <div class="ipo-status-card text-center">
          <div class="ipo-bell-icon">🔔</div>
          <h2 class="ipo-status-title">${state.studio.name} is Publicly Traded</h2>
          <div class="ipo-status-ticker highlight-gold font-mono">${state.market.studioTicker}</div>
          <p class="ipo-status-desc">
            Your studio trades live on Dalal Street. Current studio valuation: <strong>${formatRupees(state.studio.netWorth)}</strong>.
            You hold <strong>${((state.player.studioEquityPercentage || 1.0) * 100).toFixed(1)}%</strong> of promoter equity.
          </p>
          <div class="ipo-warning-box">
            <strong>⚠️ Hostile Takeover Safeguard:</strong> Maintain promoter equity strictly above 50.1% to guarantee perpetual voting control against rival conglomerate takeover bids!
          </div>
        </div>
      `;
    }

    return `
      <div class="ipo-application-card">
        <div class="ipo-card-header">
          <span class="ipo-badge">SEBI Listing Pipeline</span>
          <h2 class="ipo-card-title">Initial Public Offering (IPO) Filing</h2>
          <p class="ipo-card-desc">
            Float a minority equity stake of ${state.studio.name} on the Bombay & National Stock Exchanges to raise tens of Crores in fresh working capital for blockbuster cinema productions.
          </p>
        </div>

        <div class="ipo-criteria-list">
          <div class="criteria-item ${state.studio.netWorth >= 250000000 ? 'met' : 'unmet'}">
            <span class="crit-icon">${state.studio.netWorth >= 250000000 ? '✅' : '❌'}</span>
            <div class="crit-info">
              <span class="crit-title">Minimum Studio Net Worth: ₹25.00 Cr</span>
              <span class="crit-current font-mono">Current: ${formatRupees(state.studio.netWorth)}</span>
            </div>
          </div>

          <div class="criteria-item ${(state.studio.completedProjects || []).length >= 4 ? 'met' : 'unmet'}">
            <span class="crit-icon">${(state.studio.completedProjects || []).length >= 4 ? '✅' : '❌'}</span>
            <div class="crit-info">
              <span class="crit-title">Track Record: Minimum 4 Completed Projects</span>
              <span class="crit-current font-mono">Current: ${(state.studio.completedProjects || []).length} Completed Films</span>
            </div>
          </div>
        </div>

        ${canIPO ? `
          <div class="ipo-setup-form">
            <div class="form-group">
              <label class="form-label">Desired Stock Ticker Symbol</label>
              <input type="text" class="form-input font-mono" id="ipoTickerInput" value="${state.studio.name.slice(0, 4).toUpperCase()}" maxlength="5">
              <span class="form-help-text">3 to 5 capital letters representing your studio on BSE/NSE</span>
            </div>

            <div class="form-group">
              <div class="slider-header-row">
                <label class="form-label">Equity Stake Floated to Public</label>
                <span class="slider-display-val highlight-gold font-mono font-bold" id="floatDisplay">20%</span>
              </div>
              <input type="range" class="form-range" id="ipoFloatSlider" min="10" max="35" step="5" value="20">
              <div class="slider-extremes">
                <span>10% (Conservative)</span>
                <span>35% (Maximum Capital)</span>
              </div>
            </div>

            <div class="ipo-estimate-box">
              <span class="est-label">Estimated Fresh Capital Raised:</span>
              <span class="est-val highlight-emerald font-mono font-bold" id="estCapitalDisplay">
                ${formatRupees(state.studio.netWorth * 0.20)}
              </span>
            </div>

            <button class="btn btn-primary btn-full mt-3" id="btnLaunchIPO">
              🔔 Ring The Opening Bell & Go Public
            </button>
          </div>
        ` : `
          <div class="ipo-locked-notice">
            <span class="locked-icon">🔒</span>
            <p>Your studio does not meet the SEBI listing criteria yet. Complete more productions and elevate your studio net worth above ₹25.00 Cr to unlock Dalal Street listing.</p>
          </div>
        `}
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
    container.querySelectorAll('.market-tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        activeSubTab = btn.getAttribute('data-subtab');
        render(container, state, callbacks);
      });
    });

    // Search input
    const searchInput = container.querySelector('#marketSearchInput');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        marketSearchQuery = e.target.value;
        render(container, state, callbacks);
        const refocused = container.querySelector('#marketSearchInput');
        if (refocused) {
          refocused.focus();
          refocused.setSelectionRange(marketSearchQuery.length, marketSearchQuery.length);
        }
      });
    }

    container.querySelector('#btnClearMarketSearch')?.addEventListener('click', () => {
      marketSearchQuery = '';
      render(container, state, callbacks);
    });

    // Sector filter pills
    container.querySelectorAll('[data-sector]').forEach(btn => {
      btn.addEventListener('click', () => {
        activeSectorFilter = btn.getAttribute('data-sector');
        render(container, state, callbacks);
      });
    });

    // Stock Trade modal
    container.querySelectorAll('.btn-trade-stock').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const ticker = btn.getAttribute('data-ticker');
        openStockTradeModal(ticker, state, callbacks);
      });
    });

    container.querySelectorAll('.stock-item-card').forEach(card => {
      card.addEventListener('click', () => {
        const ticker = card.getAttribute('data-ticker');
        openStockTradeModal(ticker, state, callbacks);
      });
    });

    // IPO Slider
    const floatSlider = container.querySelector('#ipoFloatSlider');
    const floatDisplay = container.querySelector('#floatDisplay');
    const estCapitalDisplay = container.querySelector('#estCapitalDisplay');
    if (floatSlider && floatDisplay && estCapitalDisplay) {
      floatSlider.addEventListener('input', () => {
        const pct = parseInt(floatSlider.value, 10);
        floatDisplay.textContent = `${pct}%`;
        const est = state.studio.netWorth * (pct / 100);
        estCapitalDisplay.textContent = window.StudioGame.Systems.Finance.formatRupees(est);
      });
    }

    // Launch IPO button
    container.querySelector('#btnLaunchIPO')?.addEventListener('click', () => {
      const ticker = (container.querySelector('#ipoTickerInput')?.value || 'APEX').trim().toUpperCase();
      const floatPct = (parseInt(floatSlider?.value || 20, 10)) / 100;

      const res = window.StudioGame.Systems.Market.launchStudioIPO(state, { ticker, floatPct });
      if (res.success) {
        window.StudioGame.State.autosave();
        callbacks.onStateChange?.();
        window.StudioGame.App.showToast(`🔔 IPO Success! Raised ${window.StudioGame.Systems.Finance.formatRupees(res.capitalRaised)} on Dalal Street!`);
        activeSubTab = 'exchange';
        render(container, state, callbacks);
      } else {
        window.StudioGame.App.showToast(`⚠️ ${res.error}`);
      }
    });
  }

  function openStockTradeModal(ticker, state, callbacks) {
    const existing = document.getElementById('stockTradeModal');
    if (existing) existing.remove();

    const comp = (state.market.companies || []).find(c => c.ticker === ticker);
    if (!comp) return;

    const formatRupees = window.StudioGame.Systems.Finance.formatRupees;
    const portfolioHolding = (state.market.portfolio || []).find(h => h.ticker === ticker);
    const sharesOwned = portfolioHolding ? portfolioHolding.sharesCount : 0;
    const isUp = comp.dayChangePct >= 0;
    const isCircuit = Math.abs(comp.dayChangePct) >= 7.8;
    const demandText = window.StudioGame.Systems.Market.getDemandLabel(comp.buyPressure || 50);

    const backdrop = document.createElement('div');
    backdrop.className = 'modal-backdrop';
    backdrop.id = 'stockTradeModal';

    backdrop.innerHTML = `
      <div class="modal-card modal-lg slide-up">
        <div class="modal-header">
          <div class="modal-title-wrap">
            <span class="badge badge-gold font-mono">${comp.ticker}</span>
            <div>
              <h2 class="modal-title">${escapeHtml(comp.name)}</h2>
              <span class="modal-sub-desc text-muted text-xs">${escapeHtml(comp.sector)}</span>
            </div>
          </div>
          <button class="btn-icon-close" id="btnCloseTradeModal" aria-label="Close">&times;</button>
        </div>

        <div class="modal-body stock-modal-body">
          <!-- Price Hero Row -->
          <div class="stock-price-hero">
            <div class="hero-price-left">
              <span class="hero-ltp font-mono">₹${comp.sharePrice.toLocaleString('en-IN')}</span>
              <span class="hero-change-pill ${isUp ? 'change-up' : 'change-down'} font-mono">
                ${isUp ? '▲ +' : '▼ '}${comp.dayChangePct}%
              </span>
              ${isCircuit ? '<span class="badge badge-amber pulse">CIRCUIT HIT (&plusmn;8%)</span>' : ''}
            </div>

            <div class="hero-user-holdings">
              <div>Your Holdings: <strong class="font-mono highlight-gold">${sharesOwned.toLocaleString('en-IN')} Shares</strong></div>
              <div>Available Cash: <strong class="highlight-emerald font-mono">${formatRupees(state.player.cash)}</strong></div>
            </div>
          </div>

          <!-- Interactive Price Chart Canvas -->
          <div class="stock-chart-container">
            <div class="chart-header-row">
              <span class="chart-title">30-Day Historical Trend & Moving Average</span>
              <span class="chart-circuit-note">&plusmn;8% Daily Circuit Filter Enforced</span>
            </div>
            <canvas id="stockPriceChartCanvas" width="600" height="180" class="stock-chart-canvas"></canvas>
          </div>

          <!-- Technical & Fundamental Grid -->
          <div class="stock-intel-grid">
            <div class="intel-box">
              <span class="intel-lbl">Order Book Demand</span>
              <span class="intel-val">${demandText}</span>
              <div class="pressure-bar-wrap mt-1">
                <div class="pressure-bar-buy" style="width: ${comp.buyPressure}%"></div>
                <div class="pressure-bar-sell" style="width: ${100 - comp.buyPressure}%"></div>
              </div>
            </div>

            <div class="intel-box">
              <span class="intel-lbl">RSI (14-Day)</span>
              <span class="intel-val ${comp.rsi > 70 ? 'highlight-rose' : (comp.rsi < 30 ? 'highlight-emerald' : 'highlight-cyan')} font-mono font-bold">${comp.rsi || 50} (${comp.rsi > 70 ? 'Overbought' : (comp.rsi < 30 ? 'Oversold' : 'Neutral')})</span>
            </div>

            <div class="intel-box">
              <span class="intel-lbl">20-Day SMA</span>
              <span class="intel-val font-mono">₹${(comp.sma20 || comp.sharePrice).toLocaleString('en-IN')}</span>
            </div>

            <div class="intel-box">
              <span class="intel-lbl">P/E Ratio</span>
              <span class="intel-val font-mono">${comp.peRatio || 24.0}x</span>
            </div>

            <div class="intel-box">
              <span class="intel-lbl">Debt-to-Equity</span>
              <span class="intel-val font-mono">${comp.debtEquity || 0.15}</span>
            </div>

            <div class="intel-box">
              <span class="intel-lbl">Liquid Reserves</span>
              <span class="intel-val highlight-gold font-mono">${formatRupees(comp.cashReserves || 1000000000)}</span>
            </div>
          </div>

          <!-- Trading Panel -->
          <div class="stock-action-panel">
            <div class="trade-tabs">
              <button class="trade-mode-btn active" id="tabBuyMode">Buy Shares</button>
              <button class="trade-mode-btn" id="tabSellMode">Sell Shares</button>
            </div>

            <div class="trade-controls-row">
              <div class="trade-qty-box">
                <label class="form-label">Order Quantity</label>
                <div class="qty-input-group">
                  <button class="qty-adj-btn" id="btnMinusQty">&minus;</button>
                  <input type="number" class="form-input text-center font-mono qty-input-field" id="tradeQtyInput" value="100" min="1">
                  <button class="qty-adj-btn" id="btnPlusQty">&plus;</button>
                </div>
              </div>

              <div class="trade-presets-row">
                <button class="btn-preset-pill" data-qty="100">+100</button>
                <button class="btn-preset-pill" data-qty="500">+500</button>
                <button class="btn-preset-pill" data-qty="1000">+1K</button>
                <button class="btn-preset-pill" id="btnMaxQty">MAX</button>
              </div>

              <div class="trade-total-box">
                <span class="total-lbl">Estimated Order Value:</span>
                <span class="total-val highlight-gold font-mono font-bold" id="tradeOrderValueDisplay">
                  ₹${(100 * comp.sharePrice).toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            <button class="btn btn-emerald btn-full mt-2" id="btnExecuteTrade">
              Confirm Buy Order (100 Shares)
            </button>
          </div>
        </div>

        <div class="modal-footer">
          <button class="btn btn-secondary" id="btnCloseTradeBottom">Close</button>
        </div>
      </div>
    `;

    document.body.appendChild(backdrop);

    // Draw the chart on canvas
    setTimeout(() => {
      drawStockChart('stockPriceChartCanvas', comp.history || [comp.sharePrice]);
    }, 50);

    const close = () => backdrop.remove();
    backdrop.querySelector('#btnCloseTradeModal')?.addEventListener('click', close);
    backdrop.querySelector('#btnCloseTradeBottom')?.addEventListener('click', close);
    backdrop.addEventListener('click', (e) => {
      if (e.target === backdrop) close();
    });

    // Trade mode toggling
    let isBuyMode = true;
    const tabBuy = backdrop.querySelector('#tabBuyMode');
    const tabSell = backdrop.querySelector('#tabSellMode');
    const executeBtn = backdrop.querySelector('#btnExecuteTrade');
    const qtyInput = backdrop.querySelector('#tradeQtyInput');
    const orderValDisplay = backdrop.querySelector('#tradeOrderValueDisplay');

    function updateOrderDisplay() {
      const q = parseInt(qtyInput?.value || 0, 10);
      const val = q * comp.sharePrice;
      if (orderValDisplay) {
        orderValDisplay.textContent = `₹${val.toLocaleString('en-IN')}`;
      }
      if (executeBtn) {
        if (isBuyMode) {
          executeBtn.className = 'btn btn-emerald btn-full mt-2';
          executeBtn.textContent = `Confirm Buy Order (${q.toLocaleString('en-IN')} Shares &bull; ₹${val.toLocaleString('en-IN')})`;
        } else {
          executeBtn.className = 'btn btn-rose btn-full mt-2';
          executeBtn.textContent = `Confirm Sell Order (${q.toLocaleString('en-IN')} Shares &bull; ₹${val.toLocaleString('en-IN')})`;
        }
      }
    }

    tabBuy?.addEventListener('click', () => {
      isBuyMode = true;
      tabBuy.classList.add('active');
      tabSell?.classList.remove('active');
      updateOrderDisplay();
    });

    tabSell?.addEventListener('click', () => {
      isBuyMode = false;
      tabSell.classList.add('active');
      tabBuy?.classList.remove('active');
      updateOrderDisplay();
    });

    qtyInput?.addEventListener('input', updateOrderDisplay);

    backdrop.querySelector('#btnMinusQty')?.addEventListener('click', () => {
      const cur = parseInt(qtyInput.value || 0, 10);
      qtyInput.value = Math.max(1, cur - 100);
      updateOrderDisplay();
    });

    backdrop.querySelector('#btnPlusQty')?.addEventListener('click', () => {
      const cur = parseInt(qtyInput.value || 0, 10);
      qtyInput.value = cur + 100;
      updateOrderDisplay();
    });

    backdrop.querySelectorAll('.btn-preset-pill[data-qty]').forEach(btn => {
      btn.addEventListener('click', () => {
        const add = parseInt(btn.getAttribute('data-qty'), 10);
        const cur = parseInt(qtyInput.value || 0, 10);
        qtyInput.value = cur + add;
        updateOrderDisplay();
      });
    });

    backdrop.querySelector('#btnMaxQty')?.addEventListener('click', () => {
      if (isBuyMode) {
        const maxAffordable = Math.floor(state.player.cash / comp.sharePrice);
        qtyInput.value = Math.max(1, maxAffordable);
      } else {
        qtyInput.value = Math.max(1, sharesOwned);
      }
      updateOrderDisplay();
    });

    executeBtn?.addEventListener('click', () => {
      const q = parseInt(qtyInput.value || 0, 10);
      if (isBuyMode) {
        const res = window.StudioGame.Systems.Market.buyShares(state, comp.ticker, q);
        if (res.success) {
          window.StudioGame.State.autosave();
          callbacks.onStateChange?.();
          window.StudioGame.App.showToast(`📈 Bought ${q.toLocaleString('en-IN')} shares of ${comp.ticker}!`);
          close();
          openStockTradeModal(comp.ticker, state, callbacks);
        } else {
          window.StudioGame.App.showToast(`⚠️ ${res.error}`);
        }
      } else {
        const res = window.StudioGame.Systems.Market.sellShares(state, comp.ticker, q);
        if (res.success) {
          window.StudioGame.State.autosave();
          callbacks.onStateChange?.();
          window.StudioGame.App.showToast(`📉 Sold ${q.toLocaleString('en-IN')} shares of ${comp.ticker}!`);
          close();
          openStockTradeModal(comp.ticker, state, callbacks);
        } else {
          window.StudioGame.App.showToast(`⚠️ ${res.error}`);
        }
      }
    });
  }

  function drawStockChart(canvasId, data) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const w = canvas.width;
    const h = canvas.height;
    ctx.clearRect(0, 0, w, h);

    if (data.length < 2) {
      data = [data[0] * 0.98, data[0]];
    }

    const min = Math.min(...data) * 0.96;
    const max = Math.max(...data) * 1.04;
    const range = Math.max(1, max - min);

    const padTop = 20;
    const padBottom = 25;
    const padLeft = 10;
    const padRight = 10;
    const chartW = w - padLeft - padRight;
    const chartH = h - padTop - padBottom;

    // Grid lines
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.06)';
    ctx.lineWidth = 1;
    for (let i = 0; i < 4; i++) {
      const y = padTop + (chartH / 3) * i;
      ctx.beginPath();
      ctx.moveTo(padLeft, y);
      ctx.lineTo(w - padRight, y);
      ctx.stroke();
    }

    // Line Path
    const step = chartW / (data.length - 1);
    ctx.beginPath();
    data.forEach((val, i) => {
      const x = padLeft + i * step;
      const y = padTop + chartH - ((val - min) / range) * chartH;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });

    const isBull = data[data.length - 1] >= data[0];
    ctx.strokeStyle = isBull ? '#10b981' : '#f43f5e';
    ctx.lineWidth = 2.5;
    ctx.stroke();

    // Fill under curve
    ctx.lineTo(padLeft + (data.length - 1) * step, padTop + chartH);
    ctx.lineTo(padLeft, padTop + chartH);
    ctx.closePath();
    const grad = ctx.createLinearGradient(0, padTop, 0, padTop + chartH);
    grad.addColorStop(0, isBull ? 'rgba(16, 185, 129, 0.25)' : 'rgba(244, 63, 94, 0.25)');
    grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = grad;
    ctx.fill();
  }

  function formatTrend(trend) {
    switch (trend) {
      case 'strong_bullish': return '🟢 Strong Bullish';
      case 'bullish': return '🟢 Bullish';
      case 'neutral': return '🟡 Sideways';
      case 'bearish': return '🟠 Bearish';
      case 'strong_bearish': return '🔴 Strong Bearish';
      default: return 'Neutral';
    }
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
