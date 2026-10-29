/**
 * Trade News, Paparazzi Scandals & Annual Bollywood Awards Engine
 * Handles dynamic trade dispatches that impact studios & markets, 5-star hotel tabloids,
 * wife social gossip, and the prestigious December 31st Filmfare & National Cinema Awards Gala.
 */

window.StudioGame = window.StudioGame || {};
window.StudioGame.Systems = window.StudioGame.Systems || {};

window.StudioGame.Systems.News = (function() {
  /**
   * Ensure news & awards state exists
   */
  function ensureNewsState(state) {
    if (!state.awards) {
      state.awards = {
        trophies: [],
        annualGalasHeld: 0,
        lastAwardYear: 2025
      };
    }
  }

  /**
   * Daily tick for news wire and awards check
   */
  function dailyTick(state) {
    ensureNewsState(state);

    // 1. Annual December 31st Bollywood Awards Check
    if (state.clock.currentMonth === 11 && state.clock.currentDay === 31 && state.awards.lastAwardYear < state.clock.currentYear) {
      conductAnnualAwardsGala(state);
    }

    // 2. High Society Hotel & Tabloid Scandals (Linked to Wife Openness or Star Drama)
    if (Math.random() < 0.05) {
      rollPaparazziScandal(state);
    }

    // 3. Dynamic Industry Events with Real Studio & Market Impacts
    if (Math.random() < 0.04) {
      rollDynamicIndustryImpactEvent(state);
    }
  }

  /**
   * Roll spicy paparazzi news headlines (affects wife openness or star relationships)
   */
  function rollPaparazziScandal(state) {
    const wifeOpenness = state.wife ? (state.wife.openness || 10) : 10;

    if (wifeOpenness > 40 && Math.random() < 0.35) {
      const hotelNames = ['The Taj Mahal Palace Colaba', 'Soho House Juhu', 'St. Regis Lower Parel', 'JW Marriott Juhu'];
      const hotel = hotelNames[Math.floor(Math.random() * hotelNames.length)];
      const maleTalents = (state.talent || []).filter(t => t.gender === 'male');
      const companion = maleTalents.length > 0 ? maleTalents[Math.floor(Math.random() * maleTalents.length)].name : 'a handsome European fashion model';

      // Impact: Increases wife openness by +2, minor studio reputation dip if conservative
      state.wife.openness = Math.min(100, (state.wife.openness || 10) + 2);

      state.feed.unshift({
        id: 'evt_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
        day: state.clock.day,
        date: state.clock.formattedDate,
        category: 'Paparazzi Confidential',
        title: `Spotted at ${hotel}`,
        body: `Paparazzi cameras snapped ${state.wife.name} dining and heading to the private ocean-view suites at ${hotel} late last night alongside ${companion}. High-society tongues are wagging, but creative circles laud her boundary-pushing modern network. (Openness +2%).`,
        icon: '📸',
        impact: { type: 'openness_gain', amount: 2 }
      });
      return;
    }

    // General Bollywood tabloid gossip
    const headlines = [
      {
        title: 'Heated Altercation on Film Set',
        body: 'A high-profile Mumbai director reportedly threw a script binder across the sound stage after a lead actor arrived 4 hours late with an entourage of 12 bodyguards.',
        icon: '🎬'
      },
      {
        title: 'Censor Board Controversy Ignites',
        body: 'The Central Board of Film Certification (CBFC) recommended 14 audio mutes and 3 visual trims on an upcoming holiday release citing "unfiltered urban vernacular".',
        icon: '✂️'
      },
      {
        title: '5-Star Hotel Midnight Feud',
        body: 'Two prominent star producers were heard in an explosive shouting match over festival release weekend dates at a luxury rooftop lounge in Bandra.',
        icon: '🍸'
      },
      {
        title: 'Piracy Ring Busted by Cyber Cell',
        body: 'Mumbai Police Cyber Cell raided an illegal streaming hub operating across international proxy servers, preserving box office revenues for current running releases.',
        icon: '🚨'
      }
    ];

    const item = headlines[Math.floor(Math.random() * headlines.length)];
    state.feed.unshift({
      id: 'evt_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
      day: state.clock.day,
      date: state.clock.formattedDate,
      category: 'Paparazzi Confidential',
      title: item.title,
      body: item.body,
      icon: item.icon
    });
  }

  /**
   * Roll dynamic trade wire events that directly modify game state (studios, stocks, reputation)
   */
  function rollDynamicIndustryImpactEvent(state) {
    const legacy = state.studios?.legacy || [];
    const companies = state.market?.companies || [];
    const randomStudio = legacy.length > 0 ? legacy[Math.floor(Math.random() * legacy.length)] : null;
    const randomCompany = companies.length > 0 ? companies[Math.floor(Math.random() * companies.length)] : null;

    const eventTypes = [
      'tax_raid',
      'cannes_acclaim',
      'box_office_surge',
      'stock_surge',
      'stock_crash',
      'ott_mega_deal'
    ];
    const picked = eventTypes[Math.floor(Math.random() * eventTypes.length)];

    switch (picked) {
      case 'tax_raid':
        if (randomStudio) {
          const fine = Math.round(randomStudio.cash * 0.15) || 50000000;
          randomStudio.cash = Math.max(0, (randomStudio.cash || 0) - fine);
          randomStudio.reputation = Math.max(20, randomStudio.reputation - 4);
          state.feed.unshift({
            id: 'evt_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
            day: state.clock.day,
            date: state.clock.formattedDate,
            category: 'Tax & Regulatory',
            title: `🚨 IT Department Raids on ${randomStudio.name}`,
            body: `Income Tax enforcement officers conducted dawn searches at 8 offices of ${randomStudio.name}. Studio accounts frozen pending ${window.StudioGame.Systems.Finance.formatRupees(fine)} provisional assessment! (Studio Reputation -4).`,
            icon: '🚨',
            impact: { type: 'studio_fine', studio: randomStudio.name, amount: fine }
          });
        }
        break;

      case 'cannes_acclaim':
        if (randomStudio) {
          randomStudio.netWorth = Math.round(randomStudio.netWorth * 1.05);
          randomStudio.reputation = Math.min(100, randomStudio.reputation + 5);
          state.feed.unshift({
            id: 'evt_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
            day: state.clock.day,
            date: state.clock.formattedDate,
            category: 'Global Acclaim',
            title: `🏆 Standing Ovation at Cannes for ${randomStudio.name}`,
            body: `International film critics delivered an 8-minute standing ovation at the Cannes Film Festival for ${randomStudio.name}'s new festival showcase! Global valuation surged by +5%.`,
            icon: '🌟',
            impact: { type: 'valuation_surge', studio: randomStudio.name, pct: 5 }
          });
        }
        break;

      case 'stock_surge':
        if (randomCompany) {
          randomCompany.sharePrice = Math.round(randomCompany.sharePrice * 1.07);
          randomCompany.dayChangePct = 7.0;
          randomCompany.buyPressure = 88;
          state.feed.unshift({
            id: 'evt_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
            day: state.clock.day,
            date: state.clock.formattedDate,
            category: 'Dalal Street',
            title: `📈 Bull Run: ${randomCompany.ticker} Hits Upper Circuit`,
            body: `Heavy institutional buying propelled ${randomCompany.name} (${randomCompany.ticker}) up +7.0% on Dalal Street, triggering upper circuit trading halts amidst record quarterly revenues.`,
            icon: '📊',
            impact: { type: 'stock_rally', ticker: randomCompany.ticker, pct: 7.0 }
          });
        }
        break;

      case 'stock_crash':
        if (randomCompany) {
          randomCompany.sharePrice = Math.max(10, Math.round(randomCompany.sharePrice * 0.93));
          randomCompany.dayChangePct = -7.0;
          randomCompany.buyPressure = 15;
          state.feed.unshift({
            id: 'evt_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
            day: state.clock.day,
            date: state.clock.formattedDate,
            category: 'Dalal Street',
            title: `📉 Bear Attack: ${randomCompany.ticker} Hits Lower Circuit`,
            body: `Panic selling swept across media desks as ${randomCompany.name} plunged -7.0% to hit lower circuit limits following unexpected OTT subscription subscriber churn.`,
            icon: '📉',
            impact: { type: 'stock_drop', ticker: randomCompany.ticker, pct: -7.0 }
          });
        }
        break;

      case 'ott_mega_deal':
        state.feed.unshift({
          id: 'evt_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
          day: state.clock.day,
          date: state.clock.formattedDate,
          category: 'Streaming Rights',
          title: '🌐 Global OTT Giant Signs ₹2,500 Cr Multi-Year Slate',
          body: 'Netflix and Amazon Prime Video have escalated their bidding war across Mumbai Film City, hiking advance licensing valuations for Pan-India theatrical blockbusters by +20%.',
          icon: '📺',
          impact: { type: 'industry_boom', pct: 20 }
        });
        break;

      default:
        break;
    }
  }

  /**
   * Conduct the annual December 31st Bollywood Gala
   */
  function conductAnnualAwardsGala(state) {
    const year = state.clock.currentYear;
    state.awards.lastAwardYear = year;
    state.awards.annualGalasHeld += 1;

    const completed = state.studio.completedProjects || [];
    const hadEligibleHit = completed.some(p => p.verdict && (p.verdict.includes('All-Time') || p.verdict.includes('Superhit') || p.verdict.includes('Acclaim')));

    let wonTrophy = false;
    let awardTitle = '';

    if (hadEligibleHit || (state.studio.reputation >= 70 && Math.random() < 0.6)) {
      wonTrophy = true;
      const categories = [
        'Best Feature Film of the Year',
        'Best Director & Visionary Producer',
        'Outstanding Commercial Box Office Achievement',
        'Best Original Screenplay',
        'National Critics Choice Best Film'
      ];
      awardTitle = categories[Math.floor(Math.random() * categories.length)];
      const cashPurse = 50000000; // ₹5 Cr prize money

      state.studio.cash += cashPurse;
      state.studio.reputation = Math.min(100, state.studio.reputation + 8);
      state.awards.trophies.push({
        id: 'tr_' + Date.now(),
        year,
        category: awardTitle,
        project: completed[0]?.title || state.studio.name,
        cashPurse
      });

      // Stock rally if studio is listed!
      if (state.market?.isStudioPublic) {
        state.studio.netWorth = Math.round(state.studio.netWorth * 1.08);
      }

      state.feed.unshift({
        id: 'evt_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
        day: state.clock.day,
        date: state.clock.formattedDate,
        category: 'Annual Awards Gala',
        title: `🏆 GLORY AT AWARDS GALA: Won ${awardTitle}!`,
        body: `At the star-studded December 31st National Cinema Gala, ${state.studio.name} triumphed with the prestigious Golden Trophy for "${awardTitle}" and a cash purse of ${window.StudioGame.Systems.Finance.formatRupees(cashPurse)}!`,
        icon: '🏆',
        impact: { type: 'awards_triumph', purse: cashPurse }
      });
    } else {
      state.feed.unshift({
        id: 'evt_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
        day: state.clock.day,
        date: state.clock.formattedDate,
        category: 'Annual Awards Gala',
        title: `Annual Cinema Awards Gala Concluded (${year})`,
        body: `The national awards season wrapped up in Mumbai. Rival legacy studios swept major technical and performance honors. Expand studio productions to capture trophies next season!`,
        icon: '🎬'
      });
    }
  }

  return {
    ensureNewsState,
    dailyTick,
    rollPaparazziScandal,
    rollDynamicIndustryImpactEvent,
    conductAnnualAwardsGala
  };
})();
