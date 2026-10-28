/**
 * Day-Based Turn Clock & Aging System
 * Handles calendar progression, real character aging, fast-forward skips, and daily cycles.
 */

window.StudioGame = window.StudioGame || {};
window.StudioGame.Systems = window.StudioGame.Systems || {};

window.StudioGame.Systems.Clock = (function() {
  const MONTH_NAMES = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];

  function formatDate(year, month, day) {
    const d = String(day).padStart(2, '0');
    const m = MONTH_NAMES[month];
    return `${d} ${m} ${year}`;
  }

  function advanceDays(state, count = 1, options = {}) {
    const eventsTriggered = [];
    let stoppedEarly = false;
    let stopReason = null;

    for (let i = 0; i < count; i++) {
      state.clock.day += 1;

      // Calendar date calculation
      const d = new Date(state.clock.startDate);
      d.setDate(d.getDate() + (state.clock.day - 1));
      
      const prevMonth = state.clock.currentMonth;
      state.clock.currentYear = d.getFullYear();
      state.clock.currentMonth = d.getMonth();
      state.clock.currentDay = d.getDate();
      state.clock.formattedDate = formatDate(
        state.clock.currentYear,
        state.clock.currentMonth,
        state.clock.currentDay
      );

      // 1. Aging check
      // Player aging
      if (state.clock.day % 365 === 0) {
        state.player.age += 1;
        const msg = `🎉 Happy Birthday ${state.player.name}! You are now ${state.player.age} years old.`;
        eventsTriggered.push({ type: 'birthday', message: msg, date: state.clock.formattedDate });
        state.feed.unshift({
          id: 'evt_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
          day: state.clock.day,
          date: state.clock.formattedDate,
          category: 'Personal',
          title: 'Birthday Milestone',
          body: msg,
          icon: '🎂'
        });
      }

      // Wife aging (offset by e.g. 120 days from start so their birthdays aren't on the exact same day)
      if ((state.clock.day + 120) % 365 === 0) {
        state.wife.age += 1;
        const msg = `💐 Happy Birthday to ${state.wife.name}! She is now ${state.wife.age} years old.`;
        eventsTriggered.push({ type: 'birthday', message: msg, date: state.clock.formattedDate });
        state.feed.unshift({
          id: 'evt_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
          day: state.clock.day,
          date: state.clock.formattedDate,
          category: 'Personal',
          title: "Wife's Birthday",
          body: msg,
          icon: '🎁'
        });
      }

      // 2. Daily Financial Flow (Daily overhead, bank interest on liquid cash)
      if (window.StudioGame.Systems.Finance) {
        window.StudioGame.Systems.Finance.dailyTick(state);
      }

      // 3. Ambient Industry Gossip / News roll
      if (Math.random() < 0.12 && window.StudioGame.Data.Events) {
        const rumors = window.StudioGame.Data.Events.dailyRumors;
        const rumor = rumors[Math.floor(Math.random() * rumors.length)];
        state.feed.unshift({
          id: 'evt_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
          day: state.clock.day,
          date: state.clock.formattedDate,
          category: 'Industry',
          title: 'Industry Bulletin',
          body: rumor,
          icon: '📰'
        });
      }

      // 4. Milestone check
      if (window.StudioGame.Data.Events && window.StudioGame.Data.Events.milestones) {
        const m = window.StudioGame.Data.Events.milestones.find(item => item.days === state.clock.day);
        if (m) {
          eventsTriggered.push({ type: 'milestone', title: m.title, message: m.message, date: state.clock.formattedDate });
          state.feed.unshift({
            id: 'evt_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
            day: state.clock.day,
            date: state.clock.formattedDate,
            category: 'Milestone',
            title: m.title,
            body: m.message,
            icon: '🏆'
          });
          if (options.stopOnEvent) {
            stoppedEarly = true;
            stopReason = m.title;
            break;
          }
        }
      }

      // 5. Append daily history entry for charts
      state.history.push({
        day: state.clock.day,
        date: state.clock.formattedDate,
        playerNetWorth: state.player.netWorth,
        studioNetWorth: state.studio.netWorth,
        cash: state.player.cash
      });

      // Keep history bounded to avoid memory bloating in long multi-year games
      if (state.history.length > 2000) {
        // Sample every second point on the older half
        state.history = state.history.filter((_, idx) => idx % 2 === 0 || idx > 1500);
      }

      // Keep activity feed to last 100 items
      if (state.feed.length > 100) {
        state.feed.length = 100;
      }
    }

    return {
      daysAdvanced: count,
      events: eventsTriggered,
      stoppedEarly,
      stopReason
    };
  }

  function advanceToNextEvent(state, maxDays = 60) {
    let daysPassed = 0;
    while (daysPassed < maxDays) {
      daysPassed++;
      const result = advanceDays(state, 1, { stopOnEvent: true });
      if (result.stoppedEarly || result.events.length > 0) {
        return {
          daysAdvanced: daysPassed,
          reason: result.stopReason || (result.events[0] ? result.events[0].title : 'Noteworthy Event')
        };
      }
    }
    return {
      daysAdvanced: daysPassed,
      reason: `Advanced ${maxDays} days without urgent interruptions`
    };
  }

  return {
    advanceDays,
    advanceToNextEvent,
    formatDate
  };
})();
