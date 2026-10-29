/**
 * Studios & Rival AI Simulation Engine
 * Manages the 25 Indian Legacy Studios and 10 Dynamic Talent Unicorn Studios,
 * dynamic bankruptcies, replacements, box office runs, and studio diplomacy.
 */

window.StudioGame = window.StudioGame || {};
window.StudioGame.Systems = window.StudioGame.Systems || {};

window.StudioGame.Systems.Studios = (function() {
  /**
   * Ensure studios state structure exists
   */
  function ensureStudiosState(state) {
    if (!state.studios) state.studios = {};

    if (!state.studios.legacy || state.studios.legacy.length === 0) {
      if (window.StudioGame.Data.Studios) {
        state.studios.legacy = JSON.parse(JSON.stringify(window.StudioGame.Data.Studios.legacyStudios));
      } else {
        state.studios.legacy = [];
      }
    }

    if (!state.studios.unicorns || state.studios.unicorns.length === 0) {
      if (window.StudioGame.Data.Studios) {
        state.studios.unicorns = JSON.parse(JSON.stringify(window.StudioGame.Data.Studios.initialUnicornStudios));
      } else {
        state.studios.unicorns = [];
      }
    }
  }

  /**
   * Daily turn simulation for rival studios and unicorns
   */
  function dailyTick(state) {
    ensureStudiosState(state);

    // 1. Tick active theatrical releases for Legacy studios
    state.studios.legacy.forEach(studio => {
      tickStudioFilms(state, studio);
    });

    // 2. Tick active theatrical releases for Unicorn studios
    state.studios.unicorns.forEach(studio => {
      tickStudioFilms(state, studio);
    });

    // 3. Periodic new film launches by rivals (every ~35 days on average)
    if (Math.random() < 0.025) {
      launchRivalFilm(state);
    }

    // 4. Unicorn studios rise / collapse dynamic check (checked every 15 days)
    if (state.clock.day % 15 === 0) {
      evaluateUnicornDynamics(state);
    }
  }

  /**
   * Progress studio theatrical releases
   */
  function tickStudioFilms(state, studio) {
    if (!studio.activeReleases || studio.activeReleases.length === 0) return;

    studio.activeReleases.forEach((film, idx) => {
      // Daily portion of weekly gross
      const dailyGross = Math.round(film.weeklyGross / 7);
      film.totalGross = (film.totalGross || 0) + dailyGross;
      studio.cash += Math.round(dailyGross * 0.45); // 45% distributor share to studio

      // End of theatrical week
      if (state.clock.day % 7 === 0) {
        film.week += 1;
        // Natural box office decay (30% to 50% drop each week)
        film.weeklyGross = Math.round(film.weeklyGross * (0.55 + Math.random() * 0.20));

        if (film.week > 4 || film.weeklyGross < 5000000) {
          // Film wraps theatrical run!
          wrapRivalFilm(state, studio, film, idx);
        }
      }
    });
  }

  function wrapRivalFilm(state, studio, film, idx) {
    studio.activeReleases.splice(idx, 1);
    studio.filmsCount = (studio.filmsCount || 0) + 1;

    // Theatrical verdict
    let verdict = 'Hit';
    if (film.totalGross >= 500000000) verdict = 'All-Time Blockbuster';
    else if (film.totalGross >= 250000000) verdict = 'Blockbuster';
    else if (film.totalGross >= 120000000) verdict = 'Super Hit';
    else if (film.totalGross < 40000000) verdict = 'Flop';

    // OTT streaming rights deal windfall
    const ottWindfall = Math.round(film.totalGross * 0.35);
    studio.cash += ottWindfall;
    studio.netWorth += Math.round(ottWindfall * 0.8);

    state.feed.unshift({
      id: 'evt_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
      day: state.clock.day,
      date: state.clock.formattedDate,
      category: 'Trade Box Office',
      title: `${film.title} Concludes Run`,
      body: `${studio.name}'s release wrapped at ${window.StudioGame.Systems.Finance.formatRupees(film.totalGross)} worldwide gross (${verdict}). Streaming rights licensed for ${window.StudioGame.Systems.Finance.formatRupees(ottWindfall)}.`,
      icon: '🎟️'
    });
  }

  function launchRivalFilm(state) {
    const allStudios = [...state.studios.legacy, ...state.studios.unicorns];
    const candidate = allStudios[Math.floor(Math.random() * allStudios.length)];
    if (!candidate || (candidate.activeReleases && candidate.activeReleases.length >= 2)) return;

    const titles = [
      'Singham Force: Vengeance', 'Brahmastra II: Fire Dev', 'War 3: Global Hunt',
      'The Royal Rajput', 'Chandu Champion Returns', 'Stree 3: Night Terror',
      'Mirzapur Syndicate', 'Kalki 2898 AD Part 2', 'Salaar: The Sovereign',
      'Love in London Skies', 'Dhoom Next Gen', 'The Kashmir Horizon'
    ];
    const title = titles[Math.floor(Math.random() * titles.length)];

    const openingWeekend = Math.round((45000000 + Math.random() * 120000000) / 1000000) * 1000000;

    candidate.activeReleases = candidate.activeReleases || [];
    candidate.activeReleases.push({
      title: title,
      week: 1,
      weeklyGross: openingWeekend,
      totalGross: openingWeekend
    });

    state.feed.unshift({
      id: 'evt_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
      day: state.clock.day,
      date: state.clock.formattedDate,
      category: 'Release Clash',
      title: `Rival Theatrical Blitz: ${title}`,
      body: `${candidate.name} has launched mega-release "${title}" across 4,200 screens in India. Weekend opening estimated at ${window.StudioGame.Systems.Finance.formatRupees(openingWeekend)}.`,
      icon: '💥'
    });
  }

  /**
   * Evaluate top 10 dynamic Unicorn studios:
   * Rank them by net worth; if any fall below ₹15 Cr, trigger collapse and replace!
   */
  function evaluateUnicornDynamics(state) {
    const unicorns = state.studios.unicorns;
    if (!unicorns || unicorns.length === 0) return;

    // Track net worth history
    unicorns.forEach(u => {
      // Natural slight drift based on operating expenses / cash flow
      const drift = (Math.random() - 0.48) * 0.03;
      u.netWorth = Math.max(5000000, Math.round(u.netWorth * (1 + drift)));
      u.history = u.history || [];
      u.history.push(u.netWorth);
      if (u.history.length > 10) u.history.shift();
    });

    // Check for collapse
    for (let i = 0; i < unicorns.length; i++) {
      const u = unicorns[i];
      if (u.netWorth < 150000000) { // Below 15 Cr -> Collapse!
        triggerUnicornCollapse(state, u, i);
      }
    }

    // Sort by net worth descending to maintain top 10 rank
    unicorns.sort((a, b) => b.netWorth - a.netWorth);
  }

  function triggerUnicornCollapse(state, collapsedStudio, index) {
    const founder = collapsedStudio.founderName || 'Founder Talent';

    state.feed.unshift({
      id: 'evt_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
      day: state.clock.day,
      date: state.clock.formattedDate,
      category: 'Corporate Scandal',
      title: `Unicorn Collapse: ${collapsedStudio.name}`,
      body: `Crippled by consecutive box office disasters and debt, ${collapsedStudio.name} (founded by ${founder}) has filed for liquidation. All contracts terminated.`,
      icon: '📉'
    });

    // Replace with a new dynamic talent-founded startup
    const potentialFounders = [
      { name: 'Kriti Sanon', cat: 'Superstar', prefix: 'Sanon Starlight Motion' },
      { name: 'Ayushmann Khurrana', cat: 'A-Lister', prefix: 'Khurrana Content Lab' },
      { name: 'Kartik Aaryan', cat: 'Superstar', prefix: 'Aaryan Crown Entertainment' },
      { name: 'Vicky Kaushal', cat: 'Superstar', prefix: 'Kaushal Braveheart Cine' },
      { name: 'Nayanthara Kurian', cat: 'Megastar', prefix: 'Nayanthara Royal Celluloid' },
      { name: 'Samantha Prabhu', cat: 'Superstar', prefix: 'Samantha Phoenix Films' }
    ];

    const founderData = potentialFounders[Math.floor(Math.random() * potentialFounders.length)];
    const startingNw = Math.round((280000000 + Math.random() * 220000000) / 1000000) * 1000000;

    const replacement = {
      id: 'unicorn_' + Date.now(),
      name: founderData.prefix,
      founderName: founderData.name,
      founderCategory: founderData.cat,
      netWorth: startingNw,
      cash: Math.round(startingNw * 0.35),
      reputation: 86,
      attitude: 'neutral',
      status: 'active',
      isPublic: false,
      ticker: null,
      filmsCount: 1,
      activeReleases: [],
      history: [startingNw]
    };

    state.studios.unicorns[index] = replacement;

    state.feed.unshift({
      id: 'evt_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
      day: state.clock.day,
      date: state.clock.formattedDate,
      category: 'Studio Founded',
      title: `New Unicorn Enters Top 10: ${replacement.name}`,
      body: `${founderData.name} has launched a boutique studio with ₹${(startingNw / 10000000).toFixed(1)} Cr seed backing, taking over the vacant Top-10 Unicorn slot.`,
      icon: '🦄'
    });
  }

  /**
   * Pitch a Co-Production deal with a rival studio
   */
  function pitchCoProduction(state, studioId) {
    ensureStudiosState(state);
    const studio = [...state.studios.legacy, ...state.studios.unicorns].find(s => s.id === studioId);
    if (!studio) return { success: false, error: 'Studio not found.' };

    if (studio.attitude === 'aggressive') {
      return {
        success: false,
        error: `${studio.name} considers your studio an aggressive rival and flatly refused to co-finance.`
      };
    }

    if (state.studio.reputation < 50) {
      return {
        success: false,
        error: `${studio.name} requires your studio to hold at least 50 Reputation before partnering on co-productions.`
      };
    }

    // Success! Co-production granted
    studio.attitude = 'friendly';
    return {
      success: true,
      message: `${studio.name} accepted the co-production alliance! They will co-finance 35% of your next major feature film budget.`
    };
  }

  return {
    ensureStudiosState,
    dailyTick,
    pitchCoProduction
  };
})();
