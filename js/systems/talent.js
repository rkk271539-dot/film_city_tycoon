/**
 * Talent Roster, Agency, and Negotiation Engine
 * Manages 300+ actors and actresses, dynamic contracts, debt relief bailouts,
 * fan following, and intelligent contract evaluation AI.
 */

window.StudioGame = window.StudioGame || {};
window.StudioGame.Systems = window.StudioGame.Systems || {};

window.StudioGame.Systems.Talent = (function() {
  /**
   * Ensure talent roster is populated in global game state
   */
  function ensureTalentState(state) {
    if (!state.talent || !Array.isArray(state.talent) || state.talent.length < 50) {
      if (window.StudioGame.Data.Talent) {
        state.talent = window.StudioGame.Data.Talent.generateFullRoster();
      } else {
        state.talent = [];
      }
    }
  }

  /**
   * Format large fan counts into readable Indian/Global notations (e.g. 1.2M or 850K)
   */
  function formatFans(fans) {
    if (!fans) return '0';
    if (fans >= 10000000) {
      return (fans / 10000000).toFixed(1) + ' Cr Fans';
    } else if (fans >= 1000000) {
      return (fans / 1000000).toFixed(1) + 'M Fans';
    } else if (fans >= 1000) {
      return Math.round(fans / 1000) + 'K Fans';
    }
    return fans.toLocaleString('en-IN') + ' Fans';
  }

  /**
   * Daily tick for talent system
   */
  function dailyTick(state) {
    ensureTalentState(state);

    state.talent.forEach(talent => {
      // 1. Contract expiration countdown for signed talent
      if (talent.contractStatus === 'signed_player' && talent.contractDaysRemaining > 0) {
        talent.contractDaysRemaining -= 1;
        if (talent.contractDaysRemaining <= 0) {
          talent.contractStatus = 'free_agent';
          talent.contractWith = null;
          state.feed.unshift({
            id: 'evt_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
            day: state.clock.day,
            date: state.clock.formattedDate,
            category: 'Talent',
            title: 'Contract Concluded',
            body: `Exclusive studio contract with ${talent.name} has expired. They are now a free agent.`,
            icon: '📄'
          });
        }
      }

      // 2. Subtle fan and fitness drift
      if (Math.random() < 0.05) {
        // Small fitness drift based on age & lifestyle
        const delta = Math.random() > 0.5 ? 1 : -1;
        talent.fitness = Math.max(40, Math.min(100, talent.fitness + delta));
      }

      // 3. Ambient star news or rumors
      if (talent.debt > 0 && Math.random() < 0.005) {
        // Debt pressure news
        state.feed.unshift({
          id: 'evt_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
          day: state.clock.day,
          date: state.clock.formattedDate,
          category: 'Paparazzi',
          title: 'Financial Stress in Film City',
          body: `Rumors suggest ${talent.name} is facing creditor pressure over outstanding debts of ${window.StudioGame.Systems.Finance.formatRupees(talent.debt)}.`,
          icon: '💸'
        });
      }
    });
  }

  /**
   * Intelligent negotiation AI evaluation
   * Returns outcome: agreed, countered, or rejected
   */
  function evaluateContractOffer(state, talentId, offer) {
    ensureTalentState(state);
    const talent = state.talent.find(t => t.id === talentId);
    if (!talent) return { success: false, reason: 'Talent record not found.' };

    const upfrontOffered = parseInt(offer.upfrontFee, 10) || 0;
    const profitShareOffered = parseInt(offer.profitShare, 10) || 0;
    const durationMonths = parseInt(offer.contractMonths, 10) || 12;
    const intimacyClause = offer.intimacyClause || 'standard';

    // Baseline fee expected for multi-month exclusive retention
    // 6 months = 1.2x avgFee, 12 months = 2.0x avgFee, 24 months = 3.5x avgFee
    let durationMultiplier = 1.0;
    if (durationMonths <= 6) durationMultiplier = 1.2;
    else if (durationMonths <= 12) durationMultiplier = 2.0;
    else if (durationMonths <= 24) durationMultiplier = 3.5;
    else durationMultiplier = 5.0;

    let baseRequired = talent.averageFee * durationMultiplier;

    // Debt desperation discount: if talent has high debt, they accept lower upfront if it clears a chunk of debt
    if (talent.debt > 0) {
      baseRequired *= 0.85;
    }

    // Evaluate perks & penalties
    let score = (upfrontOffered / baseRequired) * 55;

    // Profit share sweetness: 1% profit share = 2 points
    score += profitShareOffered * 2.2;

    // Studio reputation weight
    score += (state.studio.reputation / 100) * 15;

    // Founder Skill: Sharp Negotiator (+25% negotiation score)
    if (state.player.skill === 'sharp_negotiator') {
      score *= 1.25;
    }

    // Wife executive perk: Studio Casting Head (+15% rapport)
    if (state.wife && state.wife.currentRoleId === 'studio_casting_head') {
      score *= 1.15;
    }

    // Screen image intimacy clause alignment
    if (talent.pureImage === 'wholesome') {
      if (intimacyClause === 'strict_wholesome') {
        score += 20; // Delighted by respect for their boundaries
      } else if (intimacyClause === 'bold_permissible') {
        score -= 40; // Highly offended!
      }
    } else if (talent.pureImage === 'bold') {
      if (intimacyClause === 'bold_permissible') {
        score += 10;
      }
    }

    // Ego penalty
    score -= (talent.ego / 100) * 20;

    // Evaluate threshold
    if (score >= 65) {
      return {
        success: true,
        agreed: true,
        message: `${talent.name} is thrilled with the package and is ready to sign the contract!`
      };
    } else if (score >= 40) {
      // Counter-offer
      const suggestedUpfront = Math.round((baseRequired * 0.95) / 100000) * 100000;
      const suggestedShare = Math.max(profitShareOffered, 10);
      return {
        success: false,
        counterOffer: {
          upfrontFee: suggestedUpfront,
          profitShare: suggestedShare,
          intimacyClause: talent.pureImage === 'wholesome' ? 'strict_wholesome' : intimacyClause
        },
        message: `${talent.name}'s manager countered the proposal. They request higher upfront remuneration and profit guarantees.`
      };
    } else {
      return {
        success: false,
        rejected: true,
        reason: `${talent.name} politely rejected the terms. The financial offer or clauses do not match their market stature.`
      };
    }
  }

  /**
   * Finalize and sign a studio contract
   */
  function signContract(state, talentId, terms) {
    ensureTalentState(state);
    const talent = state.talent.find(t => t.id === talentId);
    if (!talent) return { success: false, error: 'Talent not found' };

    const upfront = parseInt(terms.upfrontFee, 10) || 0;
    if (state.studio.cash < upfront) {
      return {
        success: false,
        error: `Insufficient studio capital to pay signing bonus of ${window.StudioGame.Systems.Finance.formatRupees(upfront)}.`
      };
    }

    // Deduct upfront bonus from studio
    state.studio.cash -= upfront;

    // Update talent status
    const months = parseInt(terms.contractMonths, 10) || 12;
    talent.contractStatus = 'signed_player';
    talent.contractWith = state.studio.name;
    talent.contractDaysRemaining = months * 30;
    talent.contractTerms = {
      upfrontFee: upfront,
      profitShare: parseInt(terms.profitShare, 10) || 0,
      intimacyClause: terms.intimacyClause || 'standard',
      signedOnDay: state.clock.day
    };
    talent.loyalty = Math.min(100, talent.loyalty + 20);

    // Reputation boost
    state.studio.reputation = Math.min(100, state.studio.reputation + (talent.category === 'Superstar' ? 4 : 2));

    state.feed.unshift({
      id: 'evt_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
      day: state.clock.day,
      date: state.clock.formattedDate,
      category: 'Talent',
      title: 'Star Contract Signed!',
      body: `${talent.name} has officially signed an exclusive ${months}-month studio contract with ${state.studio.name}!`,
      icon: '🖋️'
    });

    return { success: true };
  }

  /**
   * Bailout a talent's debt to earn deep loyalty and fee discounts
   */
  function bailoutDebt(state, talentId) {
    ensureTalentState(state);
    const talent = state.talent.find(t => t.id === talentId);
    if (!talent) return { success: false, error: 'Talent not found' };
    if (!talent.debt || talent.debt <= 0) return { success: false, error: 'Talent has no outstanding debt.' };

    const debtAmount = talent.debt;
    if (state.studio.cash < debtAmount) {
      return {
        success: false,
        error: `Insufficient studio funds to clear ${window.StudioGame.Systems.Finance.formatRupees(debtAmount)} debt.`
      };
    }

    state.studio.cash -= debtAmount;
    talent.debt = 0;
    talent.loyalty = Math.min(100, talent.loyalty + 45);
    // 35% permanent discount on all quotes
    talent.averageFee = Math.round(talent.averageFee * 0.65);

    state.feed.unshift({
      id: 'evt_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
      day: state.clock.day,
      date: state.clock.formattedDate,
      category: 'Philanthropy',
      title: 'Debt Bailout Cleared',
      body: `${state.studio.name} stepped in to settle ${window.StudioGame.Systems.Finance.formatRupees(debtAmount)} in personal debts for ${talent.name}. Their loyalty is now profound.`,
      icon: '🤝'
    });

    return { success: true, debtAmount };
  }

  /**
   * Terminate contract early
   */
  function releaseContract(state, talentId) {
    ensureTalentState(state);
    const talent = state.talent.find(t => t.id === talentId);
    if (!talent) return { success: false, error: 'Talent not found' };

    talent.contractStatus = 'free_agent';
    talent.contractWith = null;
    talent.contractDaysRemaining = 0;
    talent.contractTerms = null;

    state.feed.unshift({
      id: 'evt_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
      day: state.clock.day,
      date: state.clock.formattedDate,
      category: 'Talent',
      title: 'Contract Released',
      body: `${talent.name} has been amicably released from their studio contract.`,
      icon: '👋'
    });

    return { success: true };
  }

  return {
    ensureTalentState,
    formatFans,
    dailyTick,
    evaluateContractOffer,
    signContract,
    bailoutDebt,
    releaseContract
  };
})();
