/**
 * Global State & Robust Multi-Slot / Rolling Save System
 * Supports daily rolling autosaves with rollback, manual slots, JSON export/import,
 * version migration checks, and storage integrity safeguards.
 */

window.StudioGame = window.StudioGame || {};

window.StudioGame.State = (function() {
  const CURRENT_VERSION = '0.2.0';
  const STORAGE_PREFIX = 'filmy_tycoon_';
  const AUTOSAVE_KEY = STORAGE_PREFIX + 'autosave';
  const AUTOSAVE_HISTORY_KEY = STORAGE_PREFIX + 'autosave_history';
  const MANUAL_SLOTS_PREFIX = STORAGE_PREFIX + 'slot_';
  const MAX_ROLLBACK_SAVES = 5;

  let activeState = null;

  function createInitialState(params = {}) {
    const startingCash = (params.startingCashCr || 6.5) * 10000000;
    const wifeNetWorth = (params.wifeNetWorthCr || 4.5) * 10000000;
    const studioValuation = 50000000; // 5 Cr baseline studio facilities & IP

    const state = {
      version: CURRENT_VERSION,
      meta: {
        createdAt: new Date().toISOString(),
        lastSavedAt: new Date().toISOString(),
        saveName: params.studioName || 'Apex Motion Pictures'
      },
      clock: {
        day: 1,
        startDate: '2026-01-01',
        currentYear: 2026,
        currentMonth: 0,
        currentDay: 1,
        formattedDate: '01 Jan 2026'
      },
      player: {
        name: params.playerName || 'Kabir Sharma',
        age: parseInt(params.playerAge, 10) || 26,
        avatar: params.playerAvatar || window.StudioGame.Face.generate({ gender: 'male', seed: 'player' }),
        skill: params.skill || 'talented_writer',
        cash: startingCash,
        debt: 0,
        investments: 0,
        studioEquityPercentage: 1.0,
        netWorth: startingCash + studioValuation
      },
      wife: {
        name: params.wifeName || 'Rhea Sharma',
        age: parseInt(params.wifeAge, 10) || 25,
        avatar: params.wifeAvatar || window.StudioGame.Face.generate({ gender: 'female', seed: 'wife' }),
        netWorth: wifeNetWorth,
        openness: 10, // Base openness (0-100), deep mechanics in v1.2
        relationship: 95, // Loyalty / connection meter (0-100)
        currentRoleId: 'studio_creative_head',
        currentRole: 'Studio Creative Head',
        fitness: 82,
        skills: {
          acting: 28,
          glamour: 42,
          business: 45,
          creative: 50
        },
        nudgeRole: null,
        nudgeDaysRemaining: 0,
        careerEarningsTotal: 0,
        lastDecisionDay: 1,
        careerHistory: [
          {
            day: 1,
            date: '01 Jan 2026',
            roleId: 'studio_creative_head',
            roleName: 'Studio Creative Head',
            title: 'Appointed Studio Creative Head',
            description: `Joined ${params.studioName || 'Apex Motion Pictures'} to spearhead storytelling and narrative excellence.`
          }
        ]
      },
      studio: {
        name: params.studioName || 'Apex Motion Pictures',
        tier: 1,
        tierName: 'Indie Studio',
        cash: 30000000, // 3 Cr studio working capital
        debt: 0,
        facilitiesValue: 20000000, // 2 Cr studio equipment / leasehold
        ipValue: 0,
        netWorth: 50000000,
        expensesMonth: 0,
        activeProjectsCount: 0
      },
      feed: [
        {
          id: 'evt_init',
          day: 1,
          date: '01 Jan 2026',
          category: 'Studio',
          title: 'Studio Founded',
          body: `${params.studioName || 'Apex Motion Pictures'} has officially been registered in Mumbai. Ready to make cinematic history.`,
          icon: '🎬'
        }
      ],
      history: [
        {
          day: 1,
          date: '01 Jan 2026',
          playerNetWorth: startingCash + studioValuation,
          studioNetWorth: 50000000,
          cash: startingCash
        }
      ]
    };

    return state;
  }

  function get() {
    return activeState;
  }

  function set(newState) {
    activeState = newState;
  }

  /**
   * Save current state to main autosave slot and push to rolling rollback stack.
   */
  function autosave() {
    if (!activeState) return false;
    try {
      activeState.meta.lastSavedAt = new Date().toISOString();
      const serialized = JSON.stringify(activeState);
      localStorage.setItem(AUTOSAVE_KEY, serialized);

      // Rolling autosave history for rollback capability
      let history = [];
      const rawHistory = localStorage.getItem(AUTOSAVE_HISTORY_KEY);
      if (rawHistory) {
        try { history = JSON.parse(rawHistory); } catch (e) { history = []; }
      }

      history.unshift({
        timestamp: Date.now(),
        day: activeState.clock.day,
        date: activeState.clock.formattedDate,
        playerNetWorth: activeState.player.netWorth,
        data: serialized
      });

      // Keep only recent checkpoints
      if (history.length > MAX_ROLLBACK_SAVES) {
        history = history.slice(0, MAX_ROLLBACK_SAVES);
      }
      localStorage.setItem(AUTOSAVE_HISTORY_KEY, JSON.stringify(history));
      return true;
    } catch (err) {
      console.warn('Autosave failed:', err);
      return false;
    }
  }

  /**
   * Get list of rollback points
   */
  function getRollbackCheckpoints() {
    try {
      const raw = localStorage.getItem(AUTOSAVE_HISTORY_KEY);
      if (!raw) return [];
      const list = JSON.parse(raw);
      return list.map((item, idx) => ({
        index: idx,
        day: item.day,
        date: item.date,
        time: new Date(item.timestamp).toLocaleTimeString(),
        playerNetWorth: item.playerNetWorth
      }));
    } catch (e) {
      return [];
    }
  }

  /**
   * Restore from a rolling rollback index
   */
  function restoreRollback(index) {
    try {
      const raw = localStorage.getItem(AUTOSAVE_HISTORY_KEY);
      if (!raw) return false;
      const list = JSON.parse(raw);
      if (!list[index] || !list[index].data) return false;

      const restored = JSON.parse(list[index].data);
      activeState = validateAndMigrate(restored);
      autosave();
      return true;
    } catch (err) {
      console.error('Failed to restore rollback:', err);
      return false;
    }
  }

  /**
   * Manual save slot functions (Slots 1, 2, 3)
   */
  function saveToSlot(slotId, slotName = null) {
    if (!activeState) return false;
    try {
      const payload = {
        slotId,
        slotName: slotName || `Save Slot ${slotId}`,
        savedAt: new Date().toISOString(),
        day: activeState.clock.day,
        date: activeState.clock.formattedDate,
        studioName: activeState.studio.name,
        playerNetWorth: activeState.player.netWorth,
        state: activeState
      };
      localStorage.setItem(MANUAL_SLOTS_PREFIX + slotId, JSON.stringify(payload));
      return true;
    } catch (e) {
      console.error(`Save to slot ${slotId} failed:`, e);
      return false;
    }
  }

  function loadFromSlot(slotId) {
    try {
      const raw = localStorage.getItem(MANUAL_SLOTS_PREFIX + slotId);
      if (!raw) return false;
      const parsed = JSON.parse(raw);
      if (!parsed.state) return false;
      activeState = validateAndMigrate(parsed.state);
      autosave();
      return true;
    } catch (e) {
      console.error(`Load from slot ${slotId} failed:`, e);
      return false;
    }
  }

  function getSlotInfo(slotId) {
    try {
      const raw = localStorage.getItem(MANUAL_SLOTS_PREFIX + slotId);
      if (!raw) return null;
      const p = JSON.parse(raw);
      return {
        slotId: p.slotId,
        slotName: p.slotName,
        savedAt: new Date(p.savedAt).toLocaleString(),
        day: p.day,
        date: p.date,
        studioName: p.studioName,
        playerNetWorth: p.playerNetWorth
      };
    } catch (e) {
      return null;
    }
  }

  function deleteSlot(slotId) {
    localStorage.removeItem(MANUAL_SLOTS_PREFIX + slotId);
  }

  /**
   * Check if an active autosave exists
   */
  function hasSavedGame() {
    return !!localStorage.getItem(AUTOSAVE_KEY);
  }

  /**
   * Load autosaved game
   */
  function loadAutosave() {
    try {
      const raw = localStorage.getItem(AUTOSAVE_KEY);
      if (!raw) return false;
      const parsed = JSON.parse(raw);
      activeState = validateAndMigrate(parsed);
      return true;
    } catch (e) {
      console.error('Failed to load autosave:', e);
      return false;
    }
  }

  /**
   * Export save state to downloadable JSON file
   */
  function exportSaveToFile() {
    if (!activeState) return;
    const jsonStr = JSON.stringify(activeState, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    const safeStudio = (activeState.studio.name || 'studio').replace(/[^a-z0-9]/gi, '_').toLowerCase();
    link.download = `film_city_${safeStudio}_day${activeState.clock.day}_v${CURRENT_VERSION}.json`;
    link.href = url;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  /**
   * Import save state from JSON string or file
   */
  function importSaveFromJson(jsonString) {
    try {
      const parsed = JSON.parse(jsonString);
      if (!parsed || !parsed.player || !parsed.clock) {
        throw new Error('Invalid save file structure.');
      }
      activeState = validateAndMigrate(parsed);
      autosave();
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  }

  /**
   * Validates schema and migrates forward if necessary
   */
  function validateAndMigrate(rawState) {
    if (!rawState) return createInitialState();
    // Ensure all critical root keys exist
    rawState.version = rawState.version || '0.1.0';
    rawState.clock = rawState.clock || { day: 1, formattedDate: '01 Jan 2026', startDate: '2026-01-01' };
    rawState.player = rawState.player || {};
    rawState.player.cash = rawState.player.cash !== undefined ? rawState.player.cash : 65000000;
    rawState.player.debt = rawState.player.debt || 0;
    rawState.player.investments = rawState.player.investments || 0;
    rawState.player.netWorth = rawState.player.netWorth || 115000000;
    rawState.wife = rawState.wife || {};
    rawState.wife.netWorth = rawState.wife.netWorth || 45000000;
    rawState.wife.openness = rawState.wife.openness !== undefined ? rawState.wife.openness : 10;
    rawState.wife.relationship = rawState.wife.relationship || 95;
    if (window.StudioGame.Systems.Wife) {
      window.StudioGame.Systems.Wife.ensureWifeState(rawState);
    }
    rawState.studio = rawState.studio || {};
    rawState.studio.cash = rawState.studio.cash !== undefined ? rawState.studio.cash : 30000000;
    rawState.feed = rawState.feed || [];
    rawState.history = rawState.history || [];

    return rawState;
  }

  function resetGame() {
    activeState = null;
    localStorage.removeItem(AUTOSAVE_KEY);
    localStorage.removeItem(AUTOSAVE_HISTORY_KEY);
  }

  return {
    CURRENT_VERSION,
    createInitialState,
    get,
    set,
    autosave,
    hasSavedGame,
    loadAutosave,
    getRollbackCheckpoints,
    restoreRollback,
    saveToSlot,
    loadFromSlot,
    getSlotInfo,
    deleteSlot,
    exportSaveToFile,
    importSaveFromJson,
    resetGame
  };
})();
