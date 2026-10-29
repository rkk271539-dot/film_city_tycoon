/**
 * Banking, Loans & Treasury System
 * Manages studio term loans, production mezzanine debt, fixed deposits (FD),
 * monthly EMI auto-deductions, and corporate credit rating.
 */

window.StudioGame = window.StudioGame || {};
window.StudioGame.Systems = window.StudioGame.Systems || {};

window.StudioGame.Systems.Bank = (function() {
  /**
   * Ensure bank state is initialized on global game state
   */
  function ensureBankState(state) {
    if (!state.bank) {
      state.bank = {
        creditScore: 82, // 0 to 100
        creditRating: 'AA', // AAA, AA, A, BBB, Junk
        activeLoans: [],
        fixedDeposits: [],
        totalBorrowed: 0,
        lifetimeInterestPaid: 0,
        lifetimeFDInterestEarned: 0
      };
    }
  }

  /**
   * Calculate corporate credit rating based on leverage and track record
   */
  function updateCreditRating(state) {
    ensureBankState(state);
    const bank = state.bank;

    // Debt to net worth leverage
    const totalDebt = (bank.activeLoans || []).reduce((acc, l) => acc + l.remainingPrincipal, 0);
    const leverage = state.studio.netWorth > 0 ? (totalDebt / state.studio.netWorth) : 1;

    let score = 80;
    if (leverage > 0.6) score -= 30;
    else if (leverage > 0.4) score -= 15;
    else if (leverage > 0.2) score -= 5;
    else score += 10;

    // Reputation bonus
    score += Math.round((state.studio.reputation / 100) * 10);

    bank.creditScore = Math.max(20, Math.min(100, score));

    if (bank.creditScore >= 90) bank.creditRating = 'AAA (Prime)';
    else if (bank.creditScore >= 75) bank.creditRating = 'AA (High Quality)';
    else if (bank.creditScore >= 60) bank.creditRating = 'A (Upper Medium)';
    else if (bank.creditScore >= 45) bank.creditRating = 'BBB (Investment)';
    else bank.creditRating = 'Junk (Speculative)';
  }

  /**
   * Get interest rate based on loan type and credit rating
   */
  function getInterestRate(state, loanType) {
    ensureBankState(state);
    const baseRate = loanType === 'term' ? 9.0 : 14.5;
    const score = state.bank.creditScore || 80;
    // Lower score increases interest rate
    const scoreAdj = (80 - score) * 0.1;
    return Math.max(7.5, Math.min(22.0, baseRate + scoreAdj));
  }

  /**
   * Maximum borrowing capacity based on net worth and existing debt
   */
  function getMaxBorrowLimit(state, loanType) {
    ensureBankState(state);
    const totalDebt = (state.bank.activeLoans || []).reduce((acc, l) => acc + l.remainingPrincipal, 0);
    const maxCapacity = Math.round(state.studio.netWorth * (loanType === 'term' ? 0.45 : 0.25));
    return Math.max(0, maxCapacity - totalDebt);
  }

  /**
   * Take out a new bank loan
   */
  function takeLoan(state, { type, principal, tenureMonths }) {
    ensureBankState(state);
    const maxAllowed = getMaxBorrowLimit(state, type);
    const amount = Math.min(maxAllowed, parseInt(principal, 10));

    if (amount <= 0) {
      return { success: false, error: 'Loan amount exceeds studio borrowing capacity.' };
    }

    const tenure = Math.max(3, Math.min(24, parseInt(tenureMonths, 10) || 12));
    const annualRate = getInterestRate(state, type);
    const monthlyRate = (annualRate / 100) / 12;

    // Monthly EMI using standard amortization formula
    const emi = Math.round(
      (amount * monthlyRate * Math.pow(1 + monthlyRate, tenure)) /
      (Math.pow(1 + monthlyRate, tenure) - 1)
    );

    const loan = {
      id: 'loan_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
      type: type === 'term' ? 'Studio Term Loan' : 'Production Mezzanine Bridge',
      principal: amount,
      remainingPrincipal: amount,
      annualInterestRate: parseFloat(annualRate.toFixed(2)),
      tenureMonths: tenure,
      remainingMonths: tenure,
      monthlyEMI: emi,
      daysToNextEMI: 30,
      takenOnDay: state.clock.day
    };

    state.bank.activeLoans.push(loan);
    state.bank.totalBorrowed = (state.bank.totalBorrowed || 0) + amount;
    state.studio.cash += amount;
    updateCreditRating(state);

    state.feed.unshift({
      id: 'evt_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
      day: state.clock.day,
      date: state.clock.formattedDate,
      category: 'Bank',
      title: 'Credit Facility Disbursed',
      body: `Imperial Reserve Bank disbursed ${window.StudioGame.Systems.Finance.formatRupees(amount)} under ${loan.type} at ${loan.annualInterestRate}% p.a. (Monthly EMI: ${window.StudioGame.Systems.Finance.formatRupees(emi)}).`,
      icon: '🏛️'
    });

    return { success: true, loan };
  }

  /**
   * Repay a loan early to eliminate future interest
   */
  function repayLoanInFull(state, loanId) {
    ensureBankState(state);
    const loanIdx = state.bank.activeLoans.findIndex(l => l.id === loanId);
    if (loanIdx === -1) return { success: false, error: 'Loan not found.' };

    const loan = state.bank.activeLoans[loanIdx];
    const payoffAmount = loan.remainingPrincipal;

    if (state.studio.cash < payoffAmount) {
      return {
        success: false,
        error: `Insufficient studio funds to pay off ${window.StudioGame.Systems.Finance.formatRupees(payoffAmount)}.`
      };
    }

    state.studio.cash -= payoffAmount;
    state.bank.activeLoans.splice(loanIdx, 1);
    updateCreditRating(state);

    state.feed.unshift({
      id: 'evt_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
      day: state.clock.day,
      date: state.clock.formattedDate,
      category: 'Bank',
      title: 'Loan Settled in Full',
      body: `${state.studio.name} paid off ${window.StudioGame.Systems.Finance.formatRupees(payoffAmount)} early, clearing all outstanding liabilities for ${loan.type}!`,
      icon: '✅'
    });

    return { success: true, payoffAmount };
  }

  /**
   * Deposit cash into a high-yield Fixed Deposit (7.5% annual interest)
   */
  function createFixedDeposit(state, amount, tenureMonths = 6) {
    ensureBankState(state);
    const depositAmt = parseInt(amount, 10);
    if (depositAmt <= 0) return { success: false, error: 'Invalid deposit amount.' };

    if (state.studio.cash < depositAmt) {
      return {
        success: false,
        error: `Insufficient cash. Studio has ${window.StudioGame.Systems.Finance.formatRupees(state.studio.cash)} available.`
      };
    }

    state.studio.cash -= depositAmt;
    const months = Math.max(3, Math.min(24, parseInt(tenureMonths, 10) || 6));
    const annualRate = 7.5;

    const fd = {
      id: 'fd_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
      principal: depositAmt,
      annualRate,
      tenureMonths: months,
      remainingDays: months * 30,
      accruedInterest: 0,
      createdOnDay: state.clock.day
    };

    state.bank.fixedDeposits.push(fd);

    state.feed.unshift({
      id: 'evt_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
      day: state.clock.day,
      date: state.clock.formattedDate,
      category: 'Bank',
      title: 'Fixed Deposit Opened',
      body: `Locked ${window.StudioGame.Systems.Finance.formatRupees(depositAmt)} in a ${months}-month Reserve Bank Fixed Deposit at 7.5% p.a. to generate passive treasury yield.`,
      icon: '🏦'
    });

    return { success: true, fd };
  }

  /**
   * Liquidate Fixed Deposit early (1% penalty on interest)
   */
  function liquidateFixedDeposit(state, fdId) {
    ensureBankState(state);
    const idx = state.bank.fixedDeposits.findIndex(f => f.id === fdId);
    if (idx === -1) return { success: false, error: 'Fixed deposit not found.' };

    const fd = state.bank.fixedDeposits[idx];
    const isMatured = fd.remainingDays <= 0;
    const payout = fd.principal + (isMatured ? fd.accruedInterest : Math.round(fd.accruedInterest * 0.7));

    state.studio.cash += payout;
    state.bank.fixedDeposits.splice(idx, 1);

    state.feed.unshift({
      id: 'evt_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
      day: state.clock.day,
      date: state.clock.formattedDate,
      category: 'Bank',
      title: isMatured ? 'Fixed Deposit Matured' : 'Fixed Deposit Liquidated',
      body: `Returned ${window.StudioGame.Systems.Finance.formatRupees(payout)} from Fixed Deposit back to studio working capital.`,
      icon: '💰'
    });

    return { success: true, payout };
  }

  /**
   * Daily tick for loans, EMIs, and FD interest compounding
   */
  function dailyTick(state) {
    ensureBankState(state);
    const bank = state.bank;

    // 1. Process active loans
    for (let i = bank.activeLoans.length - 1; i >= 0; i--) {
      const loan = bank.activeLoans[i];
      loan.daysToNextEMI -= 1;

      if (loan.daysToNextEMI <= 0) {
        loan.daysToNextEMI = 30;
        loan.remainingMonths -= 1;

        // Deduct EMI
        const emi = loan.monthlyEMI;
        if (state.studio.cash >= emi) {
          state.studio.cash -= emi;
          const monthlyRate = (loan.annualInterestRate / 100) / 12;
          const interestPortion = Math.round(loan.remainingPrincipal * monthlyRate);
          const principalPortion = emi - interestPortion;
          loan.remainingPrincipal = Math.max(0, loan.remainingPrincipal - principalPortion);
          bank.lifetimeInterestPaid = (bank.lifetimeInterestPaid || 0) + interestPortion;
        } else {
          // Default / missed payment penalty!
          bank.creditScore = Math.max(10, bank.creditScore - 12);
          updateCreditRating(state);
          state.feed.unshift({
            id: 'evt_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
            day: state.clock.day,
            date: state.clock.formattedDate,
            category: 'Bank',
            title: '⚠️ EMI Default Notice',
            body: `Studio could not cover monthly EMI of ${window.StudioGame.Systems.Finance.formatRupees(emi)} on ${loan.type}. Credit rating downgraded!`,
            icon: '⚠️'
          });
        }

        if (loan.remainingPrincipal <= 0 || loan.remainingMonths <= 0) {
          bank.activeLoans.splice(i, 1);
          updateCreditRating(state);
        }
      }
    }

    // 2. Process Fixed Deposits
    for (let i = bank.fixedDeposits.length - 1; i >= 0; i--) {
      const fd = bank.fixedDeposits[i];
      const dailyRate = (fd.annualRate / 100) / 365;
      const dailyInterest = Math.round(fd.principal * dailyRate);
      fd.accruedInterest += dailyInterest;
      bank.lifetimeFDInterestEarned = (bank.lifetimeFDInterestEarned || 0) + dailyInterest;

      fd.remainingDays -= 1;
      if (fd.remainingDays <= 0) {
        // Auto-credit matured FD
        liquidateFixedDeposit(state, fd.id);
      }
    }
  }

  return {
    ensureBankState,
    updateCreditRating,
    getInterestRate,
    getMaxBorrowLimit,
    takeLoan,
    repayLoanInFull,
    createFixedDeposit,
    liquidateFixedDeposit,
    dailyTick
  };
})();
