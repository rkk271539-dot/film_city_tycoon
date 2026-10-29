/**
 * Talent Roster, Agency, Negotiation & Interpersonal Relations Engine
 * Manages 300+ actors and actresses, dynamic 1-6 month contracts, debt relief bailouts,
 * fan following, interpersonal activities, poaching, and intelligent contract evaluation AI.
 */

window.StudioGame = window.StudioGame || {};
window.StudioGame.Systems = window.StudioGame.Systems || {};

window.StudioGame.Systems.Talent = (function() {
  /**
   * Ensure talent roster is populated in global game state and linked to studios
   */
  function ensureTalentState(state) {
    if (!state.talent || !Array.isArray(state.talent) || state.talent.length < 50) {
      if (window.StudioGame.Data.Talent) {
        state.talent = window.StudioGame.Data.Talent.generateFullRoster();
      } else {
        state.talent = [];
      }
    }

    // Ensure rival studio contracts are synchronized
    if (state.studios && (state.studios.legacy || state.studios.unicorns)) {
      const allStudios = [...(state.studios.legacy || []), ...(state.studios.unicorns || [])];
      allStudios.forEach(st => {
        if (st.contractedStars && Array.isArray(st.contractedStars)) {
          st.contractedStars.forEach(starName => {
            const t = state.talent.find(item => item.name === starName);
            if (t && t.contractStatus !== 'signed_player') {
              t.contractStatus = 'signed_rival';
              t.contractWith = st.name;
              t.contractWithStudioId = st.id;
              if (!t.contractDaysRemaining || t.contractDaysRemaining <= 0) {
                t.contractDaysRemaining = Math.floor(Math.random() * 90) + 45; // 45 to 135 days
              }
            }
          });
        }
      });
    }

    // Initialize interpersonal relationship meter on talents if missing
    state.talent.forEach(t => {
      if (t.relationship === undefined) t.relationship = 40; // 0 to 100
      if (t.loyalty === undefined) t.loyalty = 50;
      if (t.contractDaysRemaining === undefined) t.contractDaysRemaining = 0;
    });
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
   * Get duration fee multiplier for 1 to 6 month contracts
   */
  function getDurationMultiplier(months) {
    switch (parseInt(months, 10)) {
      case 1: return 0.35;
      case 2: return 0.60;
      case 3: return 0.85;
      case 4: return 1.10;
      case 5: return 1.35;
      case 6: return 1.60;
      default: return months > 6 ? 1.60 + (months - 6) * 0.25 : 0.35;
    }
  }

  /**
   * Daily tick for talent system
   */
  function dailyTick(state) {
    ensureTalentState(state);

    state.talent.forEach(talent => {
      // 1. Contract expiration countdown for signed talent
      if (talent.contractDaysRemaining > 0) {
        talent.contractDaysRemaining -= 1;
        if (talent.contractDaysRemaining <= 0) {
          const prevOwner = talent.contractWith;
          const wasPlayer = talent.contractStatus === 'signed_player';

          talent.contractStatus = 'free_agent';
          talent.contractWith = null;
          talent.contractWithStudioId = null;

          if (wasPlayer) {
            state.feed.unshift({
              id: 'evt_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
              day: state.clock.day,
              date: state.clock.formattedDate,
              category: 'Talent',
              title: 'Contract Concluded',
              body: `Exclusive studio contract with ${talent.name} has expired. They are now a free agent in Film City.`,
              icon: '📄'
            });
          }
        }
      }

      // 2. Subtle fan and fitness drift
      if (Math.random() < 0.05) {
        const delta = Math.random() > 0.5 ? 1 : -1;
        talent.fitness = Math.max(40, Math.min(100, talent.fitness + delta));
      }

      // 2b. Secondary Debt Market Buyout Offers from Rival Studios
      if (talent.debtHeldBy === 'player_studio') {
        if (talent.rivalDebtBuyoutOffer) {
          if (state.clock.day >= talent.rivalDebtBuyoutOffer.expiresDay) {
            talent.rivalDebtBuyoutOffer = null;
          }
        } else if (Math.random() < 0.06) {
          const rivalStudios = ['Dharma Productions', 'Yash Raj Films', 'Excel Entertainment', 'Maddock Films', 'Red Chillies Entertainment', 'T-Series Films', 'Hombale Films'];
          const rivalName = rivalStudios[Math.floor(Math.random() * rivalStudios.length)];
          const origDebt = talent.debtOriginalAmount || talent.debt || 2500000;
          const fanBoostRatio = Math.min(2.5, (talent.fans || 500000) / 10000000);
          const demandMultiplier = 1.6 + fanBoostRatio + (Math.random() * 1.4);
          const offerAmount = Math.round(origDebt * demandMultiplier);

          talent.rivalDebtBuyoutOffer = {
            rivalStudioName: rivalName,
            offerAmount: offerAmount,
            originalDebt: origDebt,
            createdDay: state.clock.day,
            expiresDay: state.clock.day + 14
          };

          state.feed.unshift({
            id: 'evt_debt_offer_' + Date.now(),
            day: state.clock.day,
            date: state.clock.formattedDate,
            category: 'Trade Finance',
            title: `💼 Debt Buyout Offer: ${talent.name}`,
            body: `${rivalName} submitted a ${window.StudioGame.Systems.Finance.formatRupees(offerAmount)} buyout offer to acquire ${talent.name}'s debt note from your studio (Original: ${window.StudioGame.Systems.Finance.formatRupees(origDebt)}).`,
            icon: '📜'
          });
        }
      }

      // 3. Ambient star news or rumors
      if (talent.debt > 0 && Math.random() < 0.005) {
        state.feed.unshift({
          id: 'evt_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
          day: state.clock.day,
          date: state.clock.formattedDate,
          category: 'Paparazzi',
          title: 'Financial Stress in Film City',
          body: `Creditors report ${talent.name} is facing liquidity strain with unpaid liabilities of ${window.StudioGame.Systems.Finance.formatRupees(talent.debt)}.`,
          icon: '💸'
        });
      }
    });
  }

  /**
   * Intelligent negotiation AI evaluation for flexible 1-6 month contracts
   */
  function evaluateContractOffer(state, talentId, offer) {
    ensureTalentState(state);
    const talent = state.talent.find(t => t.id === talentId);
    if (!talent) return { success: false, reason: 'Talent record not found.' };

    const upfrontOffered = parseInt(offer.upfrontFee, 10) || 0;
    const profitShareOffered = parseInt(offer.profitShare, 10) || 0;
    const durationMonths = Math.max(1, Math.min(6, parseInt(offer.contractMonths, 10) || 3));
    const intimacyClause = offer.intimacyClause || 'standard';

    const mult = getDurationMultiplier(durationMonths);
    let baseRequired = talent.averageFee * mult;

    // Debt desperation discount
    if (talent.debt > 0) {
      baseRequired *= 0.85;
    }

    // Relationship bonus: close friendship lowers required fee
    const relBonus = ((talent.relationship || 40) - 40) * 0.3; // -6 to +18%
    baseRequired *= (1 - (relBonus / 100));

    // Evaluate perks & penalties
    let score = (upfrontOffered / Math.max(1, baseRequired)) * 55;

    // Profit share sweetness: 1% profit share = 2.2 points
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
        score += 20;
      } else if (intimacyClause === 'bold_permissible') {
        score -= 40;
      }
    } else if (talent.pureImage === 'bold') {
      if (intimacyClause === 'bold_permissible') {
        score += 10;
      }
    }

    // Ego penalty
    score -= (talent.ego / 100) * 18;

    // Evaluate outcome
    if (score >= 65) {
      return {
        success: true,
        agreed: true,
        message: `${talent.name} accepts the ${durationMonths}-month studio retention contract!`
      };
    } else if (score >= 40) {
      const suggestedUpfront = Math.round((baseRequired * 0.95) / 50000) * 50000;
      const suggestedShare = Math.max(profitShareOffered, 10);
      return {
        success: false,
        counterOffer: {
          upfrontFee: suggestedUpfront,
          profitShare: suggestedShare,
          contractMonths: durationMonths,
          intimacyClause: talent.pureImage === 'wholesome' ? 'strict_wholesome' : intimacyClause
        },
        message: `${talent.name}'s manager countered. They request ${window.StudioGame.Systems.Finance.formatRupees(suggestedUpfront)} upfront for ${durationMonths} months.`
      };
    } else {
      return {
        success: false,
        rejected: true,
        reason: `${talent.name} politely rejected the offer. Upfront package is too low for their market stature.`
      };
    }
  }

  /**
   * Finalize and sign a studio contract (1 to 6 months)
   */
  function signContract(state, talentId, terms) {
    ensureTalentState(state);
    const talent = state.talent.find(t => t.id === talentId);
    if (!talent) return { success: false, error: 'Talent not found' };

    const upfront = parseInt(terms.upfrontFee, 10) || 0;
    if (state.studio.cash < upfront) {
      return {
        success: false,
        error: `Insufficient studio capital to pay signing fee of ${window.StudioGame.Systems.Finance.formatRupees(upfront)}.`
      };
    }

    // Deduct upfront from studio
    state.studio.cash -= upfront;

    const months = Math.max(1, Math.min(6, parseInt(terms.contractMonths, 10) || 3));
    talent.contractStatus = 'signed_player';
    talent.contractWith = state.studio.name;
    talent.contractWithStudioId = 'player_studio';
    talent.contractDaysRemaining = months * 30;
    talent.contractTerms = {
      upfrontFee: upfront,
      contractMonths: months,
      profitShare: parseInt(terms.profitShare, 10) || 0,
      intimacyClause: terms.intimacyClause || 'standard',
      signedOnDay: state.clock.day
    };
    talent.loyalty = Math.min(100, talent.loyalty + 25);
    talent.relationship = Math.min(100, (talent.relationship || 40) + 15);

    // Studio reputation boost
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

    return { success: true, months };
  }

  /**
   * Extend existing contract for 1 to 6 additional months
   */
  function extendContract(state, talentId, months) {
    ensureTalentState(state);
    const talent = state.talent.find(t => t.id === talentId);
    if (!talent || talent.contractStatus !== 'signed_player') {
      return { success: false, error: 'Talent is not under contract with your studio.' };
    }

    const additionalMonths = Math.max(1, Math.min(6, parseInt(months, 10) || 3));
    const extensionFee = Math.round(talent.averageFee * getDurationMultiplier(additionalMonths) * 0.85); // 15% loyalty discount

    if (state.studio.cash < extensionFee) {
      return {
        success: false,
        error: `Insufficient funds. Extension fee is ${window.StudioGame.Systems.Finance.formatRupees(extensionFee)}.`
      };
    }

    state.studio.cash -= extensionFee;
    talent.contractDaysRemaining += additionalMonths * 30;
    talent.loyalty = Math.min(100, talent.loyalty + 15);

    state.feed.unshift({
      id: 'evt_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
      day: state.clock.day,
      date: state.clock.formattedDate,
      category: 'Talent',
      title: 'Contract Extended',
      body: `${state.studio.name} extended ${talent.name}'s exclusive contract by +${additionalMonths} months (+${additionalMonths * 30} days).`,
      icon: '📜'
    });

    return { success: true, additionalMonths, extensionFee };
  }

  /**
   * Poach a star currently contracted to a rival studio
   */
  function poachTalent(state, talentId, offerMonths = 3) {
    ensureTalentState(state);
    const talent = state.talent.find(t => t.id === talentId);
    if (!talent) return { success: false, error: 'Talent not found.' };

    if (talent.contractStatus !== 'signed_rival') {
      return { success: false, error: `${talent.name} is not under contract with a rival studio.` };
    }

    const rivalStudioName = talent.contractWith || 'Rival Studio';
    const months = Math.max(1, Math.min(6, parseInt(offerMonths, 10) || 3));

    // Poaching requires paying 1.5x upfront bonus to the star + 50% buyout penalty to the rival studio
    const starFee = Math.round(talent.averageFee * getDurationMultiplier(months) * 1.5);
    const buyoutCompensation = Math.round(talent.averageFee * 0.6);
    const totalCost = starFee + buyoutCompensation;

    if (state.studio.cash < totalCost) {
      return {
        success: false,
        error: `Insufficient studio funds. Poaching buyout requires ${window.StudioGame.Systems.Finance.formatRupees(totalCost)} (${window.StudioGame.Systems.Finance.formatRupees(starFee)} star bonus + ${window.StudioGame.Systems.Finance.formatRupees(buyoutCompensation)} buyout penalty).`
      };
    }

    // Deduct funds
    state.studio.cash -= totalCost;

    // Compensate rival studio
    const allStudios = [...(state.studios?.legacy || []), ...(state.studios?.unicorns || [])];
    const rival = allStudios.find(s => s.id === talent.contractWithStudioId || s.name === rivalStudioName);
    if (rival) {
      rival.cash = (rival.cash || 0) + buyoutCompensation;
      // Attitude worsens!
      rival.attitude = 'aggressive';
      if (rival.contractedStars) {
        rival.contractedStars = rival.contractedStars.filter(n => n !== talent.name);
      }
    }

    // Assign to player studio
    talent.contractStatus = 'signed_player';
    talent.contractWith = state.studio.name;
    talent.contractWithStudioId = 'player_studio';
    talent.contractDaysRemaining = months * 30;
    talent.loyalty = 85;
    talent.relationship = Math.min(100, (talent.relationship || 40) + 25);

    // Breaking news headline!
    state.feed.unshift({
      id: 'evt_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
      day: state.clock.day,
      date: state.clock.formattedDate,
      category: 'Paparazzi',
      title: `⚡ SENSATIONAL POACHING: ${talent.name} Defects!`,
      body: `In a bombshell Bollywood coup, ${state.studio.name} paid a ${window.StudioGame.Systems.Finance.formatRupees(buyoutCompensation)} contract buyout penalty to wrest ${talent.name} away from ${rivalStudioName}! ${rivalStudioName} has declared hostile war.`,
      icon: '🔥'
    });

    return {
      success: true,
      talentName: talent.name,
      rivalStudioName,
      totalCost,
      months
    };
  }

  /**
   * Direct interpersonal actions & relationship building with talent
   */
  function interactWithTalent(state, talentId, actionType, params = {}) {
    ensureTalentState(state);
    const talent = state.talent.find(t => t.id === talentId);
    if (!talent) return { success: false, error: 'Talent record not found.' };

    const formatRupees = window.StudioGame.Systems.Finance.formatRupees;

    switch (actionType) {
      // 1. Fitness & Nutrition Bootcamp
      case 'fitness_bootcamp': {
        const cost = 800000;
        if (state.studio.cash < cost) return { success: false, error: `Requires ${formatRupees(cost)} studio capital.` };
        state.studio.cash -= cost;
        talent.fitness = Math.min(100, talent.fitness + 15);
        talent.glamour = Math.min(100, talent.glamour + 5);
        talent.loyalty = Math.min(100, (talent.loyalty || 60) + 10);
        return {
          success: true,
          message: `Enrolled ${talent.name} in an intensive celebrity fitness & nutrition bootcamp (+15 Fitness, +5 Glamour).`
        };
      }

      // 2. Commercial Brand Ad Blitz
      case 'brand_ad_blitz': {
        const cost = 1500000;
        if (state.studio.cash < cost) return { success: false, error: `Requires ${formatRupees(cost)} studio capital.` };
        state.studio.cash -= cost;
        const payout = 2800000; // +13L net profit
        state.studio.cash += payout;
        talent.fans = Math.round(talent.fans + 350000);
        talent.reputation = Math.min(100, talent.reputation + 3);
        talent.loyalty = Math.min(100, (talent.loyalty || 60) + 8);
        return {
          success: true,
          message: `Pitched ${talent.name} for high-profile luxury brand endorsements. Earned ${formatRupees(payout)} commercial revenue (+${formatRupees(payout - cost)} net profit) and +350K Fans!`
        };
      }

      // 3. Method Acting Masterclass
      case 'acting_masterclass':
      case 'mentorship': {
        const cost = 1000000;
        if (state.studio.cash < cost) return { success: false, error: `Requires ${formatRupees(cost)} studio capital.` };
        state.studio.cash -= cost;
        talent.acting = Math.min(100, talent.acting + 12);
        talent.reputation = Math.min(100, talent.reputation + 3);
        talent.loyalty = Math.min(100, (talent.loyalty || 60) + 10);
        return {
          success: true,
          message: `Enrolled ${talent.name} in an intensive National School of Drama acting masterclass (+12 Acting Prowess, +3 Reputation).`
        };
      }

      // 4. Haute Couture Glamour Makeover
      case 'glamour_makeover':
      case 'makeover': {
        const cost = 1200000;
        if (state.studio.cash < cost) return { success: false, error: `Requires ${formatRupees(cost)} studio capital.` };
        state.studio.cash -= cost;
        talent.glamour = Math.min(100, talent.glamour + 15);
        talent.fans = Math.round(talent.fans + 500000);
        if (params.targetImage) {
          talent.pureImage = params.targetImage;
        }
        return {
          success: true,
          message: `Redesigned ${talent.name}'s public wardrobe and red carpet glamour styling (+15 Glamour, +500K Fans).`
        };
      }

      // 5. National Viral PR & Paparazzi Blitz
      case 'viral_pr_push': {
        const cost = 1800000;
        if (state.studio.cash < cost) return { success: false, error: `Requires ${formatRupees(cost)} studio capital.` };
        state.studio.cash -= cost;
        const fanGain = 1200000 + Math.floor(Math.random() * 1000000);
        talent.fans = Math.round(talent.fans + fanGain);
        talent.reputation = Math.min(100, talent.reputation + 8);
        return {
          success: true,
          message: `Launched a nationwide viral social media & paparazzi media campaign for ${talent.name} (+${(fanGain/1000000).toFixed(1)}M Fans, +8 Reputation)!`
        };
      }

      // 6. Soho House Power Lunch
      case 'lunch':
      case 'vip_power_lunch': {
        const cost = 150000;
        if (state.player.cash < cost) return { success: false, error: `Requires ${formatRupees(cost)} personal cash.` };
        state.player.cash -= cost;
        talent.relationship = Math.min(100, (talent.relationship || 40) + 16);
        talent.loyalty = Math.min(100, (talent.loyalty || 60) + 15);
        return {
          success: true,
          message: `Shared an exclusive private power lunch at Soho House Mumbai with ${talent.name} (+16 Relationship, +15 Loyalty).`
        };
      }

      // 7. Luxury Cartier / Rolex Gift
      case 'gift':
      case 'luxury_gift': {
        const cost = 1000000;
        if (state.player.cash < cost) return { success: false, error: `Requires ${formatRupees(cost)} personal cash.` };
        state.player.cash -= cost;
        talent.relationship = Math.min(100, (talent.relationship || 40) + 25);
        talent.loyalty = Math.min(100, (talent.loyalty || 60) + 25);
        return {
          success: true,
          message: `Gifted ${talent.name} a bespoke luxury Cartier timepiece and private luxury hamper (+25 Relationship, +25 Loyalty).`
        };
      }

      // 8. Tabloid Paparazzi Hush Money
      case 'hush_money': {
        const cost = 2500000;
        if (state.studio.cash < cost) return { success: false, error: `Requires ${formatRupees(cost)} studio capital.` };
        state.studio.cash -= cost;
        talent.reputation = Math.min(100, talent.reputation + 15);
        talent.loyalty = Math.min(100, (talent.loyalty || 60) + 30);
        return {
          success: true,
          message: `Silenced controversial tabloid paparazzi leaks regarding ${talent.name} and scrubbed media archives (+15 Reputation, +30 Loyalty).`
        };
      }

      default:
        return { success: false, error: 'Unknown interaction action.' };
    }
  }

  /**
   * Purchase a distressed talent's debt note to hold on studio balance sheet
   * (Available only on smaller/rising talents, not established megastars)
   */
  function purchaseTalentDebt(state, talentId) {
    ensureTalentState(state);
    const talent = state.talent.find(t => t.id === talentId);
    if (!talent) return { success: false, error: 'Talent not found' };
    if (!talent.debt || talent.debt <= 0) return { success: false, error: `${talent.name} has no distressed debt note to acquire.` };

    // Megastar restriction: Established titans manage private institutional wealth
    const isMegastar = talent.tier === 'megastar' || (talent.netWorth && talent.netWorth >= 50000000);
    if (isMegastar) {
      return {
        success: false,
        error: `${talent.name} is a high-net-worth megastar. Distressed debt note acquisitions are only available for emerging starlets, commercial models, and rising talents.`
      };
    }

    const debtAmount = talent.debt;
    if (state.studio.cash < debtAmount) {
      return {
        success: false,
        error: `Insufficient studio funds to purchase debt note (Requires ${window.StudioGame.Systems.Finance.formatRupees(debtAmount)}).`
      };
    }

    // Purchase debt from creditor
    state.studio.cash -= debtAmount;

    // Studio now HOLDS the debt note as an asset!
    talent.debtHeldBy = 'player_studio';
    talent.debtOriginalAmount = debtAmount;
    talent.debtFaceValue = debtAmount;
    talent.debt = debtAmount; // Debt remains on talent, but owed to player studio
    talent.loyalty = 98;
    talent.relationship = Math.min(100, (talent.relationship || 40) + 35);
    // 45% permanent discount on talent quotes
    talent.averageFee = Math.round(talent.averageFee * 0.55);

    // If not signed, immediately sign 6-month exclusive contract
    if (talent.contractStatus !== 'signed_player') {
      talent.contractStatus = 'signed_player';
      talent.contractWith = state.studio.name;
      talent.contractWithStudioId = 'player_studio';
      talent.contractDaysRemaining = 180;
    } else {
      talent.contractDaysRemaining = Math.max(talent.contractDaysRemaining, 180);
    }

    state.feed.unshift({
      id: 'evt_debt_acq_' + Date.now(),
      day: state.clock.day,
      date: state.clock.formattedDate,
      category: 'Trade Finance',
      title: 'Debt Note Acquired',
      body: `${state.studio.name} acquired ${talent.name}'s ${window.StudioGame.Systems.Finance.formatRupees(debtAmount)} distressed debt note from creditors. ${talent.name} is now financially bound to your studio!`,
      icon: '📑'
    });

    return { success: true, debtAmount, talentName: talent.name };
  }

  /**
   * Accept rival studio's buyout offer for a talent debt note
   */
  function acceptRivalDebtBuyout(state, talentId) {
    ensureTalentState(state);
    const talent = state.talent.find(t => t.id === talentId);
    if (!talent) return { success: false, error: 'Talent not found.' };

    const offer = talent.rivalDebtBuyoutOffer;
    if (!offer) return { success: false, error: 'No active buyout offer for this debt note.' };

    const offerAmount = offer.offerAmount;
    const origDebt = talent.debtOriginalAmount || talent.debt || 1000000;
    const profit = offerAmount - origDebt;

    // Collect buyout cash
    state.studio.cash += offerAmount;

    // Transfer debt note to rival studio
    talent.debtHeldBy = offer.rivalStudioName;
    talent.contractStatus = 'signed_rival';
    talent.contractWith = offer.rivalStudioName;
    talent.contractDaysRemaining = 180;
    talent.rivalDebtBuyoutOffer = null;

    state.feed.unshift({
      id: 'evt_debt_sold_' + Date.now(),
      day: state.clock.day,
      date: state.clock.formattedDate,
      category: 'Trade Deal',
      title: `Debt Note Sold: ${talent.name}`,
      body: `${state.studio.name} sold ${talent.name}'s debt note to ${offer.rivalStudioName} for ${window.StudioGame.Systems.Finance.formatRupees(offerAmount)} (Net profit: +${window.StudioGame.Systems.Finance.formatRupees(profit)}). ${talent.name} transfers to ${offer.rivalStudioName}.`,
      icon: '💰'
    });

    return { success: true, offerAmount, profit, rivalStudioName: offer.rivalStudioName };
  }

  /**
   * Reject rival studio buyout offer
   */
  function rejectRivalDebtBuyout(state, talentId) {
    ensureTalentState(state);
    const talent = state.talent.find(t => t.id === talentId);
    if (!talent || !talent.rivalDebtBuyoutOffer) return { success: false, error: 'No active buyout offer.' };

    const rivalName = talent.rivalDebtBuyoutOffer.rivalStudioName;
    talent.rivalDebtBuyoutOffer = null;
    talent.loyalty = Math.min(100, (talent.loyalty || 60) + 6);

    state.feed.unshift({
      id: 'evt_debt_rej_' + Date.now(),
      day: state.clock.day,
      date: state.clock.formattedDate,
      category: 'Trade Stand',
      title: 'Buyout Offer Rejected',
      body: `${state.studio.name} rejected ${rivalName}'s debt buyout offer for ${talent.name}. Star loyalty deepened.`,
      icon: '🛡️'
    });

    return { success: true };
  }

  /**
   * Forgive talent debt in exchange for permanent 5-year studio contract
   */
  function forgiveDebtForRetention(state, talentId) {
    ensureTalentState(state);
    const talent = state.talent.find(t => t.id === talentId);
    if (!talent) return { success: false, error: 'Talent not found.' };

    talent.debtHeldBy = null;
    talent.debt = 0;
    talent.rivalDebtBuyoutOffer = null;
    talent.contractStatus = 'signed_player';
    talent.contractWith = state.studio.name;
    talent.contractWithStudioId = 'player_studio';
    talent.contractDaysRemaining = 1825; // 5 full years
    talent.loyalty = 100;
    talent.relationship = 100;

    state.feed.unshift({
      id: 'evt_debt_forgiven_' + Date.now(),
      day: state.clock.day,
      date: state.clock.formattedDate,
      category: 'Philanthropy',
      title: `Debt Forgiven: 5-Year Lock with ${talent.name}`,
      body: `${state.studio.name} wrote off ${talent.name}'s debt note. In eternal gratitude, ${talent.name} signed an exclusive 5-year retention contract!`,
      icon: '🌟'
    });

    return { success: true };
  }

  // Alias for backward compatibility
  function bailoutDebt(state, talentId) {
    return purchaseTalentDebt(state, talentId);
  }

  function releaseContract(state, talentId) {
    ensureTalentState(state);
    const talent = state.talent.find(t => t.id === talentId);
    if (!talent) return { success: false, error: 'Talent not found' };

    talent.contractStatus = 'free_agent';
    talent.contractWith = null;
    talent.contractWithStudioId = null;
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

  /**
   * Get all active signed talents under contract with the player's studio
   */
  function getActiveSignedTalents(state) {
    ensureTalentState(state);
    return state.talent.filter(t => t.contractStatus === 'signed_player' && t.contractDaysRemaining > 0);
  }

  /**
   * Get all talents contracted to a specific rival studio
   */
  function getStudioContractedTalents(state, studioId) {
    ensureTalentState(state);
    return state.talent.filter(t => t.contractWithStudioId === studioId || (t.contractStatus === 'signed_rival' && t.contractWith === studioId));
  }

  return {
    ensureTalentState,
    formatFans,
    getDurationMultiplier,
    dailyTick,
    evaluateContractOffer,
    signContract,
    extendContract,
    poachTalent,
    interactWithTalent,
    purchaseTalentDebt,
    acceptRivalDebtBuyout,
    rejectRivalDebtBuyout,
    forgiveDebtForRetention,
    bailoutDebt,
    releaseContract,
    getActiveSignedTalents,
    getStudioContractedTalents
  };
})();
