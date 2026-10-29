/**
 * Dalal Street Stock Exchange Engine
 * Implements realistic order-book buy/sell pressure, strict -8% to +8% daily circuit breaker caps,
 * technical indicators (SMA, RSI, trend signals), fundamentals, portfolio management, and studio IPOs.
 */

window.StudioGame = window.StudioGame || {};
window.StudioGame.Systems = window.StudioGame.Systems || {};

window.StudioGame.Systems.Market = (function() {
  /**
   * Ensure market state is initialized
   */
  function ensureMarketState(state) {
    if (!state.market) {
      state.market = {
        niftyMediaIndex: 4250,
        indexHistory: [4180, 4210, 4235, 4250],
        companies: [],
        portfolio: [],
        isStudioPublic: false,
        studioTicker: null,
        studioSharePrice: 0,
        studioSharesTotal: 10000000,
        studioPublicFloatPct: 0
      };
    }

    if (!state.market.companies || state.market.companies.length === 0) {
      if (window.StudioGame.Data.Market) {
        state.market.companies = JSON.parse(JSON.stringify(window.StudioGame.Data.Market.initialListedCompanies));
      } else {
        state.market.companies = [];
      }
    }

    if (!state.market.portfolio) {
      state.market.portfolio = [];
    }
  }

  /**
   * Daily tick for Dalal Street
   */
  function dailyTick(state) {
    ensureMarketState(state);

    // 1. Sector Nifty Media index fluctuation (-2.5% to +2.5%)
    const indexMovePct = (Math.random() - 0.49) * 2.5;
    state.market.niftyMediaIndex = Math.max(1000, Math.round(state.market.niftyMediaIndex * (1 + indexMovePct / 100)));
    state.market.indexHistory = state.market.indexHistory || [];
    state.market.indexHistory.push(state.market.niftyMediaIndex);
    if (state.market.indexHistory.length > 30) state.market.indexHistory.shift();

    // 2. Individual company fluctuations
    state.market.companies.forEach(comp => {
      // Order book pressure drift
      // Market sentiment pulls buy pressure toward index move
      let sentimentDelta = indexMovePct * 3.5;
      comp.buyPressure = Math.max(15, Math.min(85, comp.buyPressure + sentimentDelta + (Math.random() - 0.5) * 8));

      // Calculate raw daily percentage move driven by net pressure
      // Neutral pressure is 50. Above 50 = buy pressure, Below 50 = sell pressure
      let netPressureDelta = ((comp.buyPressure - 50) / 50) * 5.5 + (Math.random() - 0.5) * 2.2;

      // STRICT CIRCUIT BREAKER ENFORCEMENT: -8% to +8% Cap as per Section 3.5
      const cappedMovePct = Math.max(-8.0, Math.min(8.0, netPressureDelta));

      const oldPrice = comp.sharePrice;
      comp.sharePrice = Math.max(1, Math.round(comp.sharePrice * (1 + cappedMovePct / 100)));
      comp.dayChangePct = parseFloat((((comp.sharePrice - oldPrice) / oldPrice) * 100).toFixed(2));

      // Update price history (up to 30 days)
      comp.history = comp.history || [];
      comp.history.push(comp.sharePrice);
      if (comp.history.length > 30) comp.history.shift();

      // Technical Indicators update
      updateTechnicalIndicators(comp);
    });

    // 3. Update player studio stock if public
    if (state.market.isStudioPublic) {
      tickPlayerStudioStock(state);
    }
  }

  /**
   * Update RSI, Moving Averages, and trend signals
   */
  function updateTechnicalIndicators(comp) {
    const hist = comp.history;
    if (!hist || hist.length < 2) return;

    // 20-Day SMA
    const window20 = hist.slice(-20);
    const sum20 = window20.reduce((acc, p) => acc + p, 0);
    comp.sma20 = Math.round(sum20 / window20.length);

    // RSI calculation
    let gains = 0;
    let losses = 0;
    for (let i = 1; i < hist.length; i++) {
      const diff = hist[i] - hist[i - 1];
      if (diff > 0) gains += diff;
      else losses += Math.abs(diff);
    }

    const avgGain = gains / Math.max(1, hist.length - 1);
    const avgLoss = losses / Math.max(1, hist.length - 1);
    if (avgLoss === 0) {
      comp.rsi = 85;
    } else {
      const rs = avgGain / avgLoss;
      comp.rsi = Math.round(100 - (100 / (1 + rs)));
    }

    // Trend classification
    if (comp.rsi > 65) comp.trend = 'strong_bullish';
    else if (comp.rsi > 54) comp.trend = 'bullish';
    else if (comp.rsi > 46) comp.trend = 'neutral';
    else if (comp.rsi > 35) comp.trend = 'bearish';
    else comp.trend = 'strong_bearish';
  }

  function tickPlayerStudioStock(state) {
    const comp = state.market.companies.find(c => c.ticker === state.market.studioTicker);
    if (!comp) return;

    // Player studio price influenced by studio reputation and cash flow
    const repWeight = (state.studio.reputation - 50) / 50;
    comp.buyPressure = Math.max(20, Math.min(80, 50 + repWeight * 20 + (Math.random() - 0.5) * 6));

    let netMove = ((comp.buyPressure - 50) / 50) * 5.0 + (Math.random() - 0.5) * 2.0;
    const cappedMove = Math.max(-8.0, Math.min(8.0, netMove));

    const oldPrice = comp.sharePrice;
    comp.sharePrice = Math.max(5, Math.round(comp.sharePrice * (1 + cappedMove / 100)));
    comp.dayChangePct = parseFloat((((comp.sharePrice - oldPrice) / oldPrice) * 100).toFixed(2));
    comp.history.push(comp.sharePrice);
    if (comp.history.length > 30) comp.history.shift();
    updateTechnicalIndicators(comp);

    state.market.studioSharePrice = comp.sharePrice;

    // Check for hostile takeover threat if equity dropped below 50.1%
    if ((state.player.studioEquityPercentage || 1.0) < 0.501 && Math.random() < 0.04) {
      state.feed.unshift({
        id: 'evt_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
        day: state.clock.day,
        date: state.clock.formattedDate,
        category: 'Dalal Street Warning',
        title: 'Hostile Takeover Speculation',
        body: `Rival institutional funds are quietly accumulating market float of ${comp.ticker}. Because you own only ${((state.player.studioEquityPercentage || 1.0) * 100).toFixed(1)}% equity, your board control is vulnerable!`,
        icon: '⚠️'
      });
    }
  }

  /**
   * Buy shares of a company
   */
  function buyShares(state, ticker, sharesCount) {
    ensureMarketState(state);
    const count = parseInt(sharesCount, 10);
    if (isNaN(count) || count <= 0) return { success: false, error: 'Invalid share quantity.' };

    const comp = state.market.companies.find(c => c.ticker === ticker);
    if (!comp) return { success: false, error: 'Ticker not found on Dalal Street.' };

    const totalCost = count * comp.sharePrice;
    if (state.player.cash < totalCost) {
      return {
        success: false,
        error: `Insufficient personal cash. Requires ${window.StudioGame.Systems.Finance.formatRupees(totalCost)}.`
      };
    }

    state.player.cash -= totalCost;

    // Update or create portfolio holding
    const holding = state.market.portfolio.find(h => h.ticker === ticker);
    if (holding) {
      const prevTotalCost = holding.sharesCount * holding.avgBuyPrice;
      holding.sharesCount += count;
      holding.avgBuyPrice = Math.round((prevTotalCost + totalCost) / holding.sharesCount);
    } else {
      state.market.portfolio.push({
        ticker: ticker,
        companyName: comp.name,
        sharesCount: count,
        avgBuyPrice: comp.sharePrice
      });
    }

    // Slightly increase buy pressure
    comp.buyPressure = Math.min(85, comp.buyPressure + 2);

    return { success: true, totalCost };
  }

  /**
   * Sell shares of a company
   */
  function sellShares(state, ticker, sharesCount) {
    ensureMarketState(state);
    const count = parseInt(sharesCount, 10);
    if (isNaN(count) || count <= 0) return { success: false, error: 'Invalid share quantity.' };

    const comp = state.market.companies.find(c => c.ticker === ticker);
    if (!comp) return { success: false, error: 'Ticker not found.' };

    const holdingIdx = state.market.portfolio.findIndex(h => h.ticker === ticker);
    if (holdingIdx === -1) return { success: false, error: 'No shares held in this company.' };

    const holding = state.market.portfolio[holdingIdx];
    if (holding.sharesCount < count) {
      return {
        success: false,
        error: `You only own ${holding.sharesCount.toLocaleString('en-IN')} shares of ${ticker}.`
      };
    }

    const proceeds = count * comp.sharePrice;
    state.player.cash += proceeds;

    holding.sharesCount -= count;
    if (holding.sharesCount <= 0) {
      state.market.portfolio.splice(holdingIdx, 1);
    }

    // Slightly increase sell pressure
    comp.buyPressure = Math.max(15, comp.buyPressure - 2);

    return { success: true, proceeds };
  }

  /**
   * File Initial Public Offering (IPO) for Player Studio
   */
  function launchStudioIPO(state, params = {}) {
    ensureMarketState(state);
    if (state.market.isStudioPublic) {
      return { success: false, error: 'Studio is already listed on Dalal Street.' };
    }

    // Valuation check: min ₹25 Cr Net Worth
    if (state.studio.netWorth < 250000000) {
      return {
        success: false,
        error: `SEBI Listing Criteria requires minimum ₹25 Cr Studio Valuation (Current: ${window.StudioGame.Systems.Finance.formatRupees(state.studio.netWorth)}).`
      };
    }

    // Completed projects check: min 4 projects
    const completedCount = (state.studio.completedProjects || []).length;
    if (completedCount < 4) {
      return {
        success: false,
        error: `SEBI requires at least 4 completed cinema productions to demonstrate operational track record (Current: ${completedCount}).`
      };
    }

    const floatPct = Math.max(0.10, Math.min(0.35, parseFloat(params.floatPct) || 0.20)); // 10% to 35%
    const ticker = (params.ticker || state.studio.name.slice(0, 4).toUpperCase()).replace(/[^A-Z]/g, '');

    // Issue 10,000,000 total shares
    const totalShares = 10000000;
    const initialPrice = Math.round(state.studio.netWorth / totalShares);
    const sharesFloated = Math.round(totalShares * floatPct);
    const capitalRaised = sharesFloated * initialPrice;

    // Credit raised capital to studio cash!
    state.studio.cash += capitalRaised;

    // Dilute player equity
    state.player.studioEquityPercentage = 1.0 - floatPct;

    state.market.isStudioPublic = true;
    state.market.studioTicker = ticker;
    state.market.studioSharePrice = initialPrice;
    state.market.studioSharesTotal = totalShares;
    state.market.studioPublicFloatPct = floatPct;

    // Add studio to listed market companies
    state.market.companies.unshift({
      ticker: ticker,
      name: state.studio.name + ' Ltd.',
      sector: 'Film Production & Cinema IP',
      sharePrice: initialPrice,
      sharesTotal: totalShares,
      peRatio: 22.0,
      debtEquity: state.studio.debt > 0 ? (state.studio.debt / state.studio.netWorth).toFixed(2) : 0.05,
      cashReserves: state.studio.cash,
      buyPressure: 78,
      trend: 'strong_bullish',
      rsi: 70,
      history: [Math.round(initialPrice * 0.95), initialPrice],
      dayChangePct: 5.2
    });

    state.feed.unshift({
      id: 'evt_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
      day: state.clock.day,
      date: state.clock.formattedDate,
      category: 'IPO Landmark',
      title: `Blockbuster IPO: ${ticker} Hits Dalal Street!`,
      body: `${state.studio.name} successfully rang the opening bell at the Bombay Stock Exchange, raising ${window.StudioGame.Systems.Finance.formatRupees(capitalRaised)} in public capital at ₹${initialPrice}/share!`,
      icon: '🔔'
    });

    return { success: true, capitalRaised, ticker, initialPrice };
  }

  function getDemandLabel(buyPressure) {
    if (buyPressure >= 75) return '🔥 Institutional Inflow Surge';
    if (buyPressure >= 60) return '🟢 Buyers Rushing In';
    if (buyPressure >= 45) return '🟡 Balanced Sideways Flow';
    if (buyPressure >= 30) return '🟠 Heavy Profit Booking';
    return '🔴 Panic Selling Climax';
  }

  return {
    ensureMarketState,
    dailyTick,
    buyShares,
    sellShares,
    launchStudioIPO,
    getDemandLabel
  };
})();
