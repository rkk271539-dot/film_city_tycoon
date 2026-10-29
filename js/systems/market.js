/**
 * Dalal Street Stock Exchange Engine
 * Implements realistic dynamic two-way market cycles (Bulls, Profit Booking, Corrections, Accumulation),
 * order-book buy/sell pressure, institutional profit-taking when RSI > 68, value hunting when RSI < 35,
 * sensitivity to studio box office hits/flops, debt, scandals, SEBI circuit breakers (-8% to +8%),
 * technical indicators (14-Day RSI, SMA20, trend shifts), portfolio management, and studio IPOs.
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
        sentimentPhase: 'bull_rally',
        sentimentDaysRemaining: 21,
        isStudioPublic: false,
        studioTicker: null,
        studioSharePrice: 0,
        studioSharesTotal: 10000000,
        studioPublicFloatPct: 0
      };
    }

    if (!state.market.sentimentPhase) {
      state.market.sentimentPhase = 'bull_rally';
      state.market.sentimentDaysRemaining = 18;
    }

    if (!state.market.companies || state.market.companies.length === 0) {
      if (window.StudioGame.Data.Market) {
        state.market.companies = JSON.parse(JSON.stringify(window.StudioGame.Data.Market.initialListedCompanies));
      } else {
        state.market.companies = [];
      }
    }

    // Ensure baseline trackers exist for all companies
    state.market.companies.forEach(comp => {
      if (comp.basePrice === undefined) comp.basePrice = comp.sharePrice;
      if (comp.basePE === undefined) comp.basePE = comp.peRatio || 24.0;
      if (comp.consecutiveUpDays === undefined) comp.consecutiveUpDays = 0;
      if (comp.consecutiveDownDays === undefined) comp.consecutiveDownDays = 0;
      if (comp.rsi === undefined) comp.rsi = 50;
      if (!comp.history || comp.history.length === 0) {
        comp.history = [comp.sharePrice];
      }
    });

    if (!state.market.portfolio) {
      state.market.portfolio = [];
    }
  }

  /**
   * Daily tick for Dalal Street
   */
  function dailyTick(state) {
    ensureMarketState(state);

    // 1. Advance macro market sentiment regime cycle
    state.market.sentimentDaysRemaining = (state.market.sentimentDaysRemaining || 15) - 1;
    if (state.market.sentimentDaysRemaining <= 0) {
      rotateMarketSentiment(state);
    }

    // 2. Calculate Sector Nifty Media index fluctuation
    let regimeBaseDrift = 0;
    if (state.market.sentimentPhase === 'bull_rally') {
      regimeBaseDrift = 0.45; // Moderate bullish drift
    } else if (state.market.sentimentPhase === 'profit_booking') {
      regimeBaseDrift = -0.55; // Institutional profit booking wave
    } else if (state.market.sentimentPhase === 'bear_correction') {
      regimeBaseDrift = -0.90; // Correction pullback
    } else {
      regimeBaseDrift = 0.15; // Accumulation / Sideways base
    }

    const indexMovePct = parseFloat((regimeBaseDrift + (Math.random() - 0.49) * 2.1).toFixed(2));
    state.market.niftyMediaIndex = Math.max(1000, Math.round(state.market.niftyMediaIndex * (1 + indexMovePct / 100)));
    state.market.indexHistory = state.market.indexHistory || [];
    state.market.indexHistory.push(state.market.niftyMediaIndex);
    if (state.market.indexHistory.length > 30) state.market.indexHistory.shift();

    // 3. Individual company fluctuations with two-way dynamics
    state.market.companies.forEach(comp => {
      tickCompanyStock(state, comp, indexMovePct);
    });

    // 4. Update player studio stock if public
    if (state.market.isStudioPublic) {
      tickPlayerStudioStock(state, indexMovePct);
    }
  }

  /**
   * Rotate market sentiment regimes periodically
   */
  function rotateMarketSentiment(state) {
    const regimes = ['bull_rally', 'profit_booking', 'bear_correction', 'accumulation'];
    const current = state.market.sentimentPhase || 'bull_rally';
    let next;

    // Natural market cycle progression
    if (current === 'bull_rally') {
      next = Math.random() < 0.70 ? 'profit_booking' : 'bear_correction';
    } else if (current === 'profit_booking') {
      next = Math.random() < 0.60 ? 'bear_correction' : 'accumulation';
    } else if (current === 'bear_correction') {
      next = Math.random() < 0.75 ? 'accumulation' : 'bull_rally';
    } else {
      next = 'bull_rally';
    }

    state.market.sentimentPhase = next;
    state.market.sentimentDaysRemaining = 14 + Math.floor(Math.random() * 16); // 14 to 30 days
  }

  /**
   * Simulate realistic stock price action for a company
   */
  function tickCompanyStock(state, comp, indexMovePct) {
    // 1. Natural mean reversion force toward neutral 50% pressure
    let pressureShift = (50 - comp.buyPressure) * 0.16;

    // 2. Macro sector sentiment contribution
    pressureShift += indexMovePct * 2.2;

    // 3. Technical Indicator Feedback:
    // When RSI > 68: Institutional algos trigger profit booking (dumping shares to lock in gains)
    if (comp.rsi > 68) {
      const overboughtPenalty = (comp.rsi - 60) * 0.55;
      pressureShift -= overboughtPenalty;
    }
    // When RSI < 35: Bargain hunters and value funds accumulate dips
    else if (comp.rsi < 35) {
      const oversoldSupport = (40 - comp.rsi) * 0.50;
      pressureShift += oversoldSupport;
    }

    // 4. Fatigue from consecutive up or down days (prevents infinite green runs)
    if (comp.consecutiveUpDays >= 3) {
      pressureShift -= 4.5 * Math.min(3, comp.consecutiveUpDays - 2);
    }
    if (comp.consecutiveDownDays >= 3) {
      pressureShift += 3.5 * Math.min(3, comp.consecutiveDownDays - 2);
    }

    // 5. Valuation Resistance & Support (P/E Gravity)
    if (comp.peRatio > 36) {
      pressureShift -= Math.min(7, (comp.peRatio - 36) * 0.35);
    } else if (comp.peRatio < 16) {
      pressureShift += Math.min(6, (16 - comp.peRatio) * 0.40);
    }

    // 6. Balance Sheet & Debt Burden Impact
    if (comp.debtEquity > 0.38 && indexMovePct < 0) {
      // High-debt stocks suffer 1.5x sharper drops during red market days
      pressureShift -= 3.0;
    }

    // 7. Diminishing returns multiplier on runaway prices
    if (comp.basePrice && comp.sharePrice > comp.basePrice * 1.35) {
      const expansion = (comp.sharePrice - comp.basePrice * 1.35) / comp.basePrice;
      pressureShift -= Math.min(8, expansion * 12);
    }

    // 8. Studio Corporate Linkage (Box Office & Operating Catalysts)
    applyStudioLinkageCatalysts(state, comp, pressureShift);

    // Apply noise and clamp buy pressure between 15% and 85%
    const randomNoise = (Math.random() - 0.5) * 5.0;
    comp.buyPressure = Math.max(15, Math.min(85, comp.buyPressure + pressureShift + randomNoise));

    // Calculate daily percentage move driven by order book balance
    // 50% is equilibrium. Above 50 = net buy volume, Below 50 = net sell dump
    let netPressureDelta = ((comp.buyPressure - 50) / 50) * 4.6 + (indexMovePct * 0.5) + (Math.random() - 0.5) * 1.6;

    // STRICT CIRCUIT BREAKER ENFORCEMENT: -8% to +8% Cap as per Section 3.5
    const cappedMovePct = Math.max(-8.0, Math.min(8.0, netPressureDelta));

    const oldPrice = comp.sharePrice;
    comp.sharePrice = Math.max(1, Math.round(comp.sharePrice * (1 + cappedMovePct / 100)));
    comp.dayChangePct = parseFloat((((comp.sharePrice - oldPrice) / oldPrice) * 100).toFixed(2));

    // Update streak counters
    if (comp.dayChangePct > 0.2) {
      comp.consecutiveUpDays = (comp.consecutiveUpDays || 0) + 1;
      comp.consecutiveDownDays = 0;
    } else if (comp.dayChangePct < -0.2) {
      comp.consecutiveDownDays = (comp.consecutiveDownDays || 0) + 1;
      comp.consecutiveUpDays = 0;
    } else {
      comp.consecutiveUpDays = 0;
      comp.consecutiveDownDays = 0;
    }

    // Update dynamic P/E ratio
    if (comp.basePE && comp.basePrice) {
      comp.peRatio = parseFloat((comp.basePE * (comp.sharePrice / comp.basePrice)).toFixed(1));
    }

    // Update price history (30-day window)
    comp.history = comp.history || [];
    comp.history.push(comp.sharePrice);
    if (comp.history.length > 30) comp.history.shift();

    // Technical Indicators update
    updateTechnicalIndicators(comp);
  }

  /**
   * Apply linkage between listed securities and studio events
   */
  function applyStudioLinkageCatalysts(state, comp, currentShift) {
    if (!state.studios) return;

    // Check if company corresponds to a studio (e.g. YRFM, TSRM, ZEEL, TIPS, BTLF, PVRI)
    let matchedStudio = null;
    const allStudios = [...(state.studios.legacy || []), ...(state.studios.unicorns || [])];
    matchedStudio = allStudios.find(s => s.ticker === comp.ticker);

    if (matchedStudio) {
      // Check active theatrical releases
      if (matchedStudio.activeReleases && matchedStudio.activeReleases.length > 0) {
        const topRun = matchedStudio.activeReleases[0];
        if (topRun.totalGross > 200000000) {
          // Strong box office hit provides steady buyer support
          comp.buyPressure = Math.min(82, comp.buyPressure + 2.5);
        }
      } else {
        // Dormant studio with no active releases faces slight market apathy
        comp.buyPressure = Math.max(20, comp.buyPressure - 0.8);
      }
    }

    // PVR Inox Multiplex: correlates with overall nationwide box office health
    if (comp.ticker === 'PVRI') {
      let totalIndiaBoxOffice = 0;
      allStudios.forEach(s => {
        (s.activeReleases || []).forEach(r => {
          totalIndiaBoxOffice += (r.weeklyGross || 0);
        });
      });

      if (totalIndiaBoxOffice > 150000000) {
        comp.buyPressure = Math.min(82, comp.buyPressure + 2.0); // Booming theatre footfalls
      } else if (totalIndiaBoxOffice < 40000000) {
        comp.buyPressure = Math.max(20, comp.buyPressure - 2.5); // Box office drought
      }
    }
  }

  /**
   * Update RSI, Moving Averages, and trend signals using Wilder 14-day calculation
   */
  function updateTechnicalIndicators(comp) {
    const hist = comp.history;
    if (!hist || hist.length < 2) return;

    // 20-Day Simple Moving Average (SMA20)
    const window20 = hist.slice(-20);
    const sum20 = window20.reduce((acc, p) => acc + p, 0);
    comp.sma20 = Math.round(sum20 / window20.length);

    // Standard Wilder 14-Day Relative Strength Index (RSI)
    const period = Math.min(14, hist.length - 1);
    let gains = 0;
    let losses = 0;
    const startIdx = hist.length - period;

    for (let i = startIdx; i < hist.length; i++) {
      const diff = hist[i] - hist[i - 1];
      if (diff > 0) gains += diff;
      else losses += Math.abs(diff);
    }

    const avgGain = gains / period;
    const avgLoss = losses / period;
    let rsi = 50;

    if (avgLoss === 0 && avgGain === 0) {
      rsi = 50;
    } else if (avgLoss === 0) {
      rsi = 85;
    } else if (avgGain === 0) {
      rsi = 15;
    } else {
      const rs = avgGain / avgLoss;
      rsi = Math.round(100 - (100 / (1 + rs)));
    }

    comp.rsi = Math.max(10, Math.min(90, rsi));

    // Dynamic 5-Tier Trend Classification
    if (comp.rsi > 65) {
      comp.trend = 'strong_bullish'; // Overbought warning: elevated correction risk
    } else if (comp.rsi > 54) {
      comp.trend = 'bullish';
    } else if (comp.rsi > 45) {
      comp.trend = 'neutral';
    } else if (comp.rsi > 35) {
      comp.trend = 'bearish';
    } else {
      comp.trend = 'strong_bearish'; // Deep oversold: value zone
    }
  }

  /**
   * Dynamic simulation for player studio stock (prevents infinite money exploit)
   */
  function tickPlayerStudioStock(state, indexMovePct) {
    const comp = state.market.companies.find(c => c.ticker === state.market.studioTicker);
    if (!comp) return;

    // Mean reversion
    let pressureShift = (50 - comp.buyPressure) * 0.16 + (indexMovePct * 1.8);

    // 1. Reputation factor: baseline pull, but NOT a one-way elevator
    const repDeviation = (state.studio.reputation - 50) / 50; // -1.0 to +1.0
    pressureShift += repDeviation * 2.0;

    // 2. Active Productions & Theatrical Footprint:
    // If studio has no active project running, market discounts shares
    const activeProjects = (state.studio.activeProjects || []);
    const runningTheatrical = activeProjects.filter(p => p.format && p.theatricalWeek > 0);
    if (runningTheatrical.length > 0) {
      const topTheatrical = runningTheatrical[0];
      if ((topTheatrical.boxOfficeGross || 0) > 100000000) {
        pressureShift += 3.5; // Hit movie running
      }
    } else if (activeProjects.length === 0) {
      // Completely idle studio: investor apathy creates sell pressure
      pressureShift -= 2.8;
    }

    // 3. Balance sheet debt burden:
    // If debt > 20% of net worth, credit downgrades dump stock
    const debtRatio = state.studio.debt > 0 ? (state.studio.debt / state.studio.netWorth) : 0;
    if (debtRatio > 0.20) {
      pressureShift -= Math.min(7.0, debtRatio * 15);
    }

    // 4. RSI Overbought Profit-Taking:
    // Prevents player from holding indefinitely with guaranteed green days!
    if (comp.rsi > 68) {
      pressureShift -= (comp.rsi - 60) * 0.60;
    } else if (comp.rsi < 35) {
      pressureShift += (38 - comp.rsi) * 0.50;
    }

    // 5. Fatigue from consecutive up days
    if (comp.consecutiveUpDays >= 3) {
      pressureShift -= 5.0;
    }
    if (comp.consecutiveDownDays >= 3) {
      pressureShift += 4.0;
    }

    // 6. Diminishing returns on studio valuation
    if (comp.basePrice && comp.sharePrice > comp.basePrice * 1.4) {
      const excess = (comp.sharePrice - comp.basePrice * 1.4) / comp.basePrice;
      pressureShift -= Math.min(8.0, excess * 10);
    }

    // Apply net shift to buy pressure
    const noise = (Math.random() - 0.5) * 5.0;
    comp.buyPressure = Math.max(15, Math.min(85, comp.buyPressure + pressureShift + noise));

    let netMove = ((comp.buyPressure - 50) / 50) * 4.6 + (indexMovePct * 0.5) + (Math.random() - 0.5) * 1.5;
    const cappedMove = Math.max(-8.0, Math.min(8.0, netMove));

    const oldPrice = comp.sharePrice;
    comp.sharePrice = Math.max(5, Math.round(comp.sharePrice * (1 + cappedMove / 100)));
    comp.dayChangePct = parseFloat((((comp.sharePrice - oldPrice) / oldPrice) * 100).toFixed(2));

    if (comp.dayChangePct > 0.2) {
      comp.consecutiveUpDays = (comp.consecutiveUpDays || 0) + 1;
      comp.consecutiveDownDays = 0;
    } else if (comp.dayChangePct < -0.2) {
      comp.consecutiveDownDays = (comp.consecutiveDownDays || 0) + 1;
      comp.consecutiveUpDays = 0;
    }

    comp.history.push(comp.sharePrice);
    if (comp.history.length > 30) comp.history.shift();
    updateTechnicalIndicators(comp);

    state.market.studioSharePrice = comp.sharePrice;

    // Check for hostile takeover threat if player equity dropped below 50.1%
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
   * Buy shares of a company with order book liquidity impact
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

    // Realistic order book impact: buying large volume temporarily pushes buy pressure up
    const impact = Math.min(8, Math.max(1, Math.round(totalCost / 25000000)));
    comp.buyPressure = Math.min(85, comp.buyPressure + impact);

    return { success: true, totalCost };
  }

  /**
   * Sell shares of a company with realistic order book sell pressure
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

    // Realistic order book impact: dumping large volume onto Dalal Street triggers sell pressure!
    const sellImpact = Math.min(12, Math.max(1, Math.round(proceeds / 20000000)));
    comp.buyPressure = Math.max(15, comp.buyPressure - sellImpact);

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
      basePrice: initialPrice,
      sharesTotal: totalShares,
      peRatio: 22.0,
      basePE: 22.0,
      debtEquity: state.studio.debt > 0 ? (state.studio.debt / state.studio.netWorth).toFixed(2) : 0.05,
      cashReserves: state.studio.cash,
      buyPressure: 65,
      trend: 'bullish',
      rsi: 58,
      history: [Math.round(initialPrice * 0.96), initialPrice],
      dayChangePct: 4.2,
      consecutiveUpDays: 1,
      consecutiveDownDays: 0
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
    if (buyPressure >= 72) return '🔥 Institutional Inflow Surge';
    if (buyPressure >= 58) return '🟢 Buyers Rushing In';
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
