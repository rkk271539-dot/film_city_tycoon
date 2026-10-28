/**
 * Finance & Net Worth System
 * Formats Indian Rupee denominations (Crores & Lakhs) and calculates daily cash flows.
 */

window.StudioGame = window.StudioGame || {};
window.StudioGame.Systems = window.StudioGame.Systems || {};

window.StudioGame.Systems.Finance = (function() {
  /**
   * Format numbers into Indian Rupee notation (Cr, L, or standard thousands)
   */
  function formatRupees(amount, options = {}) {
    if (amount === undefined || amount === null || isNaN(amount)) amount = 0;
    const isNegative = amount < 0;
    const abs = Math.abs(amount);

    let formatted = '';
    if (abs >= 10000000) { // 1 Crore = 100 Lakhs = 10,000,000
      const cr = abs / 10000000;
      formatted = `₹${cr.toFixed(2)} Cr`;
    } else if (abs >= 100000) { // 1 Lakh = 100,000
      const lk = abs / 100000;
      formatted = `₹${lk.toFixed(2)} L`;
    } else {
      // Standard Indian number format
      formatted = '₹' + Math.round(abs).toLocaleString('en-IN');
    }

    if (isNegative) return `-${formatted}`;
    if (options.forcePlus && amount > 0) return `+${formatted}`;
    return formatted;
  }

  /**
   * Daily financial tick:
   * 1. Studio office rent / electricity bill (Manager skill cuts it by 25%)
   * 2. Bank savings interest on liquid funds (+4.2% p.a. / 365)
   * 3. Wife's independent portfolio slight drift
   * 4. Update overall net worth
   */
  function dailyTick(state) {
    // 1. Studio daily overhead (base ₹500/day ≈ ₹15,000/month)
    let dailyOverhead = 500;
    if (state.player.skill === 'brilliant_manager') {
      dailyOverhead *= 0.75; // 25% cost reduction
    }

    // Deduct overhead from studio cash
    state.studio.cash -= dailyOverhead;
    state.studio.expensesMonth = (state.studio.expensesMonth || 0) + dailyOverhead;

    // 2. Liquid interest on player cash (4.2% p.a. risk-free liquid yield)
    const dailyInterestRate = 0.042 / 365;
    const playerInterest = Math.max(0, state.player.cash * dailyInterestRate);
    state.player.cash += playerInterest;

    // 3. Wife's independent net worth slight growth/market fluctuation (+4% to +7% p.a. range)
    const wifeDailyRate = (0.05 + (Math.sin(state.clock.day / 15) * 0.02)) / 365;
    state.wife.netWorth += state.wife.netWorth * wifeDailyRate;

    // 4. Studio Net Worth calculation
    // Studio Net Worth = Studio Cash + Studio Facilities Value + IP Value - Studio Debt
    state.studio.netWorth = Math.max(0, state.studio.cash + state.studio.facilitiesValue + state.studio.ipValue - state.studio.debt);

    // 5. Player Net Worth calculation
    // Personal Net Worth = Player Liquid Cash + Personal Investments + (Studio Net Worth * Equity Share) - Personal Debt
    const studioEquityShare = state.player.studioEquityPercentage || 1.0;
    state.player.netWorth = Math.max(0, state.player.cash + state.player.investments + (state.studio.netWorth * studioEquityShare) - state.player.debt);
  }

  return {
    formatRupees,
    dailyTick
  };
})();
