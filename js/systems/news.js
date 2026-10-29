/**
 * Trade News, Paparazzi Scandals & Annual Bollywood Awards Engine
 * Handles daily industry bulletins, 5-star hotel tabloids, wife social gossip,
 * and the annual prestigious December 31st Filmfare & National Cinema Awards Gala.
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
    // December is month 11 (0-indexed) and day 31
    if (state.clock.currentMonth === 11 && state.clock.currentDay === 31 && state.awards.lastAwardYear < state.clock.currentYear) {
      conductAnnualAwardsGala(state);
    }

    // 2. High Society Hotel & Tabloid Scandals (Linked to Wife Openness or Star Drama)
    if (Math.random() < 0.04) {
      rollPaparazziScandal(state);
    }
  }

  /**
   * Roll spicy paparazzi news headlines
   */
  function rollPaparazziScandal(state) {
    const wifeOpenness = state.wife ? (state.wife.openness || 10) : 10;

    if (wifeOpenness > 40 && Math.random() < 0.35) {
      // Wife openness dynamic headline! (Section 3.2: outcomes and headlines only)
      const hotelNames = ['The Taj Mahal Palace Colaba', 'Soho House Juhu', 'St. Regis Lower Parel', 'JW Marriott Juhu'];
      const hotel = hotelNames[Math.floor(Math.random() * hotelNames.length)];
      const maleTalents = (state.talent || []).filter(t => t.gender === 'male');
      const companion = maleTalents.length > 0 ? maleTalents[Math.floor(Math.random() * maleTalents.length)].name : 'a handsome European fashion model';

      state.feed.unshift({
        id: 'evt_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
        day: state.clock.day,
        date: state.clock.formattedDate,
        category: 'Paparazzi Confidential',
        title: `Spotted at ${hotel}`,
        body: `Paparazzi cameras snapped ${state.wife.name} dining and heading to the private suites at ${hotel} late last night alongside ${companion}. High-society tongues are wagging, but creative circles laud her boundary-pushing modern network.`,
        icon: '📸'
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
        body: 'The Central Board of Film Certification (CBFC) has recommended 14 audio mutes and 3 visual trims on an upcoming holiday release citing "unfiltered urban vernacular".',
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
   * Conduct the annual Filmfare & National Cinema Awards Gala
   */
  function conductAnnualAwardsGala(state) {
    state.awards.lastAwardYear = state.clock.currentYear;
    state.awards.annualGalasHeld += 1;

    const completed = state.studio.completedProjects || [];
    const playerQualifiedFilms = completed.filter(p => ['Small Film', 'Mid Film', 'Big Film', 'Web Series Season'].includes(p.format));

    let playerWonCount = 0;
    const ceremonyAwards = [];

    // Award 1: Best Director
    if (playerQualifiedFilms.length > 0 && (state.studio.reputation > 65 || state.player.skill === 'talented_writer') && Math.random() > 0.4) {
      playerWonCount++;
      state.awards.trophies.push({
        year: state.clock.currentYear,
        category: 'Best Director',
        project: playerQualifiedFilms[0].title
      });
      ceremonyAwards.push(`🏆 <strong>Best Director:</strong> Awarded to ${state.studio.name} for "${playerQualifiedFilms[0].title}"!`);
    } else {
      ceremonyAwards.push(`🏆 <strong>Best Director:</strong> Awarded to Aditya Chopra (Yash Raj Films)`);
    }

    // Award 2: Best Leading Actor
    ceremonyAwards.push(`🏆 <strong>Best Actor in a Leading Role:</strong> Awarded to Ranbir Dev`);

    // Award 3: Best Leading Actress
    if (playerQualifiedFilms.length > 0 && state.wife && state.wife.currentRoleId === 'actress' && Math.random() > 0.3) {
      playerWonCount++;
      state.awards.trophies.push({
        year: state.clock.currentYear,
        category: 'Best Actress',
        recipient: state.wife.name
      });
      ceremonyAwards.push(`🏆 <strong>Best Actress in a Leading Role:</strong> Awarded to ${state.wife.name} for dazzling performance!`);
    } else {
      ceremonyAwards.push(`🏆 <strong>Best Actress in a Leading Role:</strong> Awarded to Deepika Sen`);
    }

    // Award 4: Best Feature Film
    if (playerQualifiedFilms.length > 0 && Math.random() > 0.5) {
      playerWonCount++;
      state.awards.trophies.push({
        year: state.clock.currentYear,
        category: 'Best Film of the Year',
        project: playerQualifiedFilms[0].title
      });
      ceremonyAwards.push(`🏆 <strong>Best Film of the Year:</strong> "${playerQualifiedFilms[0].title}" produced by ${state.studio.name}!`);
    } else {
      ceremonyAwards.push(`🏆 <strong>Best Film of the Year:</strong> Dharma Productions for "Royal Sovereign"`);
    }

    // Trophies boost studio prestige
    if (playerWonCount > 0) {
      const repBoost = playerWonCount * 5;
      state.studio.reputation = Math.min(100, state.studio.reputation + repBoost);
      const cashPrize = playerWonCount * 2500000;
      state.studio.cash += cashPrize;

      state.feed.unshift({
        id: 'evt_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
        day: state.clock.day,
        date: state.clock.formattedDate,
        category: 'Annual Awards Gala',
        title: `🏆 Triumphant Night at National Cinema Awards!`,
        body: `${state.studio.name} clinched ${playerWonCount} major trophy victories at the annual awards gala! Reputation surged +${repBoost} and awarded ₹${(cashPrize / 100000).toFixed(0)} Lakhs cash purse.`,
        icon: '🏆'
      });
    } else {
      state.feed.unshift({
        id: 'evt_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
        day: state.clock.day,
        date: state.clock.formattedDate,
        category: 'Annual Awards Gala',
        title: `Annual Cinema Awards Gala ${state.clock.currentYear} Concludes`,
        body: `Bollywood's most glamorous gala night concluded in Mumbai. Legacy studios swept the trophies this year.`,
        icon: '✨'
      });
    }
  }

  return {
    ensureNewsState,
    dailyTick
  };
})();
