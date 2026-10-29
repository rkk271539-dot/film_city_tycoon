/**
 * Production Pipeline, Commercial Bidding, and Studio Upgrades System
 * Handles multi-turn commercial shoots, client RFPs, rival studio bidding,
 * itemized cost billing, facility upgrades, and project deliveries.
 */

window.StudioGame = window.StudioGame || {};
window.StudioGame.Systems = window.StudioGame.Systems || {};

window.StudioGame.Systems.Projects = (function() {
  /**
   * Ensure studio project state structure exists and is healthy
   */
  function ensureProjectState(state) {
    if (!state.studio) state.studio = {};
    if (!state.studio.projects) state.studio.projects = [];
    if (!state.studio.completedProjects) state.studio.completedProjects = [];
    if (!state.studio.upgrades) state.studio.upgrades = [];
    if (state.studio.reputation === undefined) state.studio.reputation = 42;
    if (state.studio.maxConcurrentProjects === undefined) state.studio.maxConcurrentProjects = 2;
    if (!state.bids || state.bids.length === 0) {
      refreshAvailableBids(state);
    }
  }

  /**
   * Refreshes the available contract bids pool (3 to 4 RFPs)
   */
  function refreshAvailableBids(state) {
    const contractsData = window.StudioGame.Data.Contracts;
    if (!contractsData) return;

    const clients = contractsData.clients;
    const genres = contractsData.genres;
    const rivals = contractsData.rivalBidderNames;

    const newBids = [];
    const count = 3 + Math.floor(Math.random() * 2); // 3 to 4 RFPs

    for (let i = 0; i < count; i++) {
      const client = clients[Math.floor(Math.random() * clients.length)];
      const genre = genres.find(g => g.id === client.preferredGenre) || genres[0];
      const isAd = Math.random() > 0.45;

      const format = isAd ? 'Short Ad Film' : 'Commercial Photoshoot';
      const durationDays = isAd ? (7 + Math.floor(Math.random() * 8)) : (1 + Math.floor(Math.random() * 3));
      
      // Base client budget: Photoshoots ₹4L - ₹10L, Ads ₹12L - ₹32L
      const baseBudget = isAd
        ? Math.round((1200000 + Math.random() * 1800000) * client.budgetMultiplier)
        : Math.round((400000 + Math.random() * 600000) * client.budgetMultiplier);

      // Select 2 rival studios bidding on this contract
      const competingRivals = [];
      const shuffledRivals = [...rivals].sort(() => 0.5 - Math.random());
      for (let r = 0; r < 2; r++) {
        const rivalName = shuffledRivals[r];
        const bidRatio = 0.82 + (Math.random() * 0.22); // bids 82% to 104% of client budget
        const qualityScore = 40 + Math.floor(Math.random() * 35);
        competingRivals.push({
          name: rivalName,
          bidAmount: Math.round(baseBudget * bidRatio),
          qualityScore: qualityScore
        });
      }

      newBids.push({
        id: 'rfp_' + Date.now() + '_' + i,
        clientName: client.name,
        brandTier: client.brandTier,
        format: format,
        genreId: genre.id,
        genreName: genre.name,
        genreIcon: genre.icon,
        title: `${client.name} &bull; ${format}`,
        description: `National promotional campaign for ${client.name} requiring high-impact visuals in ${genre.name}.`,
        clientMaxBudget: baseBudget,
        durationDays: durationDays,
        minQualityRequired: 45,
        rivals: competingRivals,
        createdDay: state.clock.day,
        expiresInDays: 14
      });
    }

    state.bids = newBids;
  }

  /**
   * Submit a bid on an RFP contract against rival studios
   */
  function submitBid(state, rfpId, playerBidAmount) {
    ensureProjectState(state);
    const rfpIndex = state.bids.findIndex(b => b.id === rfpId);
    if (rfpIndex === -1) {
      return { success: false, error: 'Contract RFP is no longer active.' };
    }

    const rfp = state.bids[rfpIndex];

    // Check studio capacity
    const activeCount = state.studio.projects.length;
    const maxCapacity = getStudioCapacity(state);
    if (activeCount >= maxCapacity) {
      return {
        success: false,
        error: `Studio sound stages are at full capacity (${activeCount}/${maxCapacity} shoots). Finish ongoing projects or upgrade your sound stage.`
      };
    }

    // Upfront production deposit required (25% of bid amount for crew/rent deposits)
    const upfrontDeposit = Math.round(playerBidAmount * 0.25);
    if (state.studio.cash < upfrontDeposit) {
      return {
        success: false,
        error: `Insufficient studio cash for upfront crew/equipment deposit (Requires ${window.StudioGame.Systems.Finance.formatRupees(upfrontDeposit)}).`
      };
    }

    // Calculate player's packaging quality
    let playerQuality = state.studio.reputation;
    
    // Skill bonus: Talented Writer (+25% Script/Concept Quality)
    if (state.player.skill === 'talented_writer') {
      playerQuality *= 1.25;
    }
    // Skill bonus: Marketing Guru (+25% Campaign buzz)
    if (state.player.skill === 'marketing_guru') {
      playerQuality *= 1.15;
    }

    // Wife perk: Studio Creative Head (+10% Quality)
    if (state.wife && state.wife.currentRoleId === 'studio_creative_head') {
      playerQuality *= 1.10;
    }
    // Installed upgrades quality bonus
    const upgradeBonuses = getUpgradePerks(state);
    playerQuality += upgradeBonuses.qualityBonus;

    // Evaluate Bids: Client weighs (Budget - Bid) and (Committed Quality)
    // Sharp Negotiator skill bonus gives +25% scoring advantage
    let negotiatorMultiplier = 1.0;
    if (state.player.skill === 'sharp_negotiator') {
      negotiatorMultiplier = 1.25;
    }

    // Player Bid Score
    // Client dislikes bids over max budget
    const priceRatio = playerBidAmount / rfp.clientMaxBudget;
    let priceScore = (1.1 - priceRatio) * 100;
    if (priceRatio > 1.05) priceScore -= 40; // Penalize over-budget bids

    let playerScore = (priceScore * 0.5 + playerQuality * 0.5) * negotiatorMultiplier;
    playerScore += (Math.random() * 12 - 6);

    // Evaluate Rivals
    let bestRival = null;
    let bestRivalScore = -999;

    rfp.rivals.forEach(rival => {
      const rPriceRatio = rival.bidAmount / rfp.clientMaxBudget;
      const rPriceScore = (1.1 - rPriceRatio) * 100;
      const rScore = rPriceScore * 0.5 + rival.qualityScore * 0.5 + (Math.random() * 10 - 5);
      if (rScore > bestRivalScore) {
        bestRivalScore = rScore;
        bestRival = { ...rival, score: rScore };
      }
    });

    // Remove RFP from pool
    state.bids.splice(rfpIndex, 1);

    if (playerScore >= bestRivalScore) {
      // Player WINS the bid!
      state.studio.cash -= upfrontDeposit;

      // Adjust duration based on editing suite upgrade if installed
      let finalDuration = rfp.durationDays;
      if (upgradeBonuses.speedMultiplier) {
        finalDuration = Math.max(1, Math.round(finalDuration * upgradeBonuses.speedMultiplier));
      }

      const newProject = {
        id: 'proj_' + Date.now(),
        name: rfp.title,
        clientName: rfp.clientName,
        format: rfp.format,
        genreName: rfp.genreName,
        genreIcon: rfp.genreIcon,
        totalDays: finalDuration,
        daysElapsed: 0,
        agreedPayout: playerBidAmount,
        upfrontInvested: upfrontDeposit,
        stage: 'Pre-Production & Set Setup',
        qualityScore: Math.round(playerQuality)
      };

      state.studio.projects.push(newProject);

      // Log success
      state.feed.unshift({
        id: 'evt_bid_win_' + Date.now(),
        day: state.clock.day,
        date: state.clock.formattedDate,
        category: 'Production',
        title: `Contract Won: ${rfp.clientName}`,
        body: `Your studio beat ${bestRival.name} to win the ${rfp.format} contract for ${window.StudioGame.Systems.Finance.formatRupees(playerBidAmount)}!`,
        icon: '🏆'
      });

      return {
        won: true,
        project: newProject,
        bestRival: bestRival,
        message: `Congratulations! ${rfp.clientName} selected your studio over ${bestRival.name}!`
      };
    } else {
      // Player LOST the bid
      return {
        won: false,
        winnerName: bestRival.name,
        winningBid: bestRival.bidAmount,
        message: `${rfp.clientName} awarded the contract to ${bestRival.name} (${window.StudioGame.Systems.Finance.formatRupees(bestRival.bidAmount)}).`
      };
    }
  }

  /**
   * Calculate Itemized Cost Bill for a Custom Project before signing
   */
  function calculateCostBill(state, params = {}) {
    ensureProjectState(state);
    const format = params.format || 'Commercial Photoshoot';
    const isAd = format === 'Short Ad Film';
    const talent = params.talent || window.StudioGame.Data.Contracts.starterTalent[0];

    // Base Costs
    let modelFee = talent.flatFee || 40000;
    let studioRent = isAd ? 65000 : 20000;
    let cameraEquipmentRent = isAd ? 45000 : 18000;
    let crewAndLighting = isAd ? 55000 : 22000;
    let locationAndPermits = isAd ? 35000 : 15000;
    let wardrobeAndProps = isAd ? 30000 : 12000;
    let postProductionBuffer = isAd ? 25000 : 8000;

    // Upgrades modifiers
    const perks = getUpgradePerks(state);
    if (perks.wardrobeDiscount) {
      wardrobeAndProps *= (1 - perks.wardrobeDiscount);
    }

    // Wife Perk: Studio Head of Casting reduces talent cost by 10%
    if (state.wife && state.wife.currentRoleId === 'studio_casting_head') {
      modelFee *= 0.90;
    }

    let subtotal = modelFee + studioRent + cameraEquipmentRent + crewAndLighting + locationAndPermits + wardrobeAndProps + postProductionBuffer;

    // Founder Perk: Brilliant Manager cuts production costs by 25%
    let managerDiscount = 0;
    if (state.player.skill === 'brilliant_manager') {
      managerDiscount = subtotal * 0.25;
      subtotal -= managerDiscount;
    }

    const contingencyBuffer = Math.round(subtotal * 0.08); // 8% overrun reserve
    const totalCost = Math.round(subtotal + contingencyBuffer);

    // Projected Syndication Return (1.35x to 1.75x)
    const projectedRevenue = Math.round(totalCost * (isAd ? 1.60 : 1.45));

    return {
      format,
      talentName: talent.name,
      durationDays: isAd ? 8 : 2,
      lineItems: [
        { label: 'Lead Model / Talent Flat Fee', amount: Math.round(modelFee), note: talent.name },
        { label: 'Sound Stage Floor & Electrical Rent', amount: Math.round(studioRent), note: 'Studio Facilities' },
        { label: '4K Cinema Optics & Rigging Rent', amount: Math.round(cameraEquipmentRent), note: 'Digital Cinema' },
        { label: 'Cinematographer, Gaffer & Crew', amount: Math.round(crewAndLighting), note: 'Technical Crew' },
        { label: 'Location Permits & Catering', amount: Math.round(locationAndPermits), note: 'Mumbai Film City' },
        { label: 'Wardrobe, Costumes & Prop Dressing', amount: Math.round(wardrobeAndProps), note: perks.wardrobeDiscount ? 'Archive Discount' : 'Standard' },
        { label: 'Color Grading & Sound Master', amount: Math.round(postProductionBuffer), note: 'Finishing' },
        { label: 'Contingency & Weather Buffer (8%)', amount: contingencyBuffer, note: 'Safety Margin' }
      ],
      managerDiscount: Math.round(managerDiscount),
      totalCost: totalCost,
      projectedRevenue: projectedRevenue,
      cashRemainingAfter: state.studio.cash - totalCost,
      canAfford: state.studio.cash >= totalCost
    };
  }

  /**
   * Finalize and sign a custom project
   */
  function launchCustomProject(state, params = {}) {
    ensureProjectState(state);
    const activeCount = state.studio.projects.length;
    const maxCapacity = getStudioCapacity(state);
    if (activeCount >= maxCapacity) {
      return { success: false, error: `Studio floors at capacity (${activeCount}/${maxCapacity}).` };
    }

    const bill = calculateCostBill(state, params);
    if (!bill.canAfford) {
      return { success: false, error: 'Insufficient studio funds to cover the finalized project bill.' };
    }

    // Deduct cost from studio cash
    state.studio.cash -= bill.totalCost;

    const newProject = {
      id: 'proj_cust_' + Date.now(),
      name: params.name || `${params.genreName || 'Fashion'} Showcase`,
      clientName: 'Studio Commissioned Project',
      format: bill.format,
      genreName: params.genreName || 'Haute Couture',
      genreIcon: params.genreIcon || '🎬',
      totalDays: bill.durationDays,
      daysElapsed: 0,
      agreedPayout: bill.projectedRevenue,
      upfrontInvested: bill.totalCost,
      stage: 'Pre-Production & Moodboard',
      qualityScore: 50 + Math.floor(Math.random() * 25)
    };

    state.studio.projects.push(newProject);

    state.feed.unshift({
      id: 'evt_proj_launch_' + Date.now(),
      day: state.clock.day,
      date: state.clock.formattedDate,
      category: 'Production',
      title: `Shoot Commenced: ${newProject.name}`,
      body: `Greenlit ${bill.format} starring ${bill.talentName}. Budget invested: ${window.StudioGame.Systems.Finance.formatRupees(bill.totalCost)}.`,
      icon: '🎬'
    });

    return { success: true, project: newProject };
  }

  /**
   * Daily tick for projects & studio operations
   */
  function dailyTick(state) {
    ensureProjectState(state);

    // 1. Advance active projects
    const completedIndices = [];
    const completedEvents = [];

    state.studio.projects.forEach((proj, idx) => {
      proj.daysElapsed += 1;

      // Update stage progression
      const progressRatio = proj.daysElapsed / proj.totalDays;
      if (progressRatio < 0.3) {
        proj.stage = 'Pre-Production & Packaging';
      } else if (progressRatio < 0.8) {
        proj.stage = 'Active Floor Shoot';
      } else if (progressRatio < 1.0) {
        proj.stage = 'Post-Production & Client Review';
      } else {
        proj.stage = 'Delivery & Wrap';
        completedIndices.push(idx);
      }
    });

    // Handle completed deliveries (in reverse to preserve indices)
    for (let i = completedIndices.length - 1; i >= 0; i--) {
      const completedProj = state.studio.projects.splice(completedIndices[i], 1)[0];
      
      // Credit full revenue payout to studio cash
      state.studio.cash += completedProj.agreedPayout;
      state.studio.reputation = Math.min(100, state.studio.reputation + 2);

      // Record in completed archive
      completedProj.deliveredDate = state.clock.formattedDate;
      completedProj.profitEarned = completedProj.agreedPayout - completedProj.upfrontInvested;
      state.studio.completedProjects.unshift(completedProj);

      const netProfitFormatted = window.StudioGame.Systems.Finance.formatRupees(completedProj.profitEarned, { forcePlus: true });
      const payoutFormatted = window.StudioGame.Systems.Finance.formatRupees(completedProj.agreedPayout);

      const msg = `🎬 "${completedProj.name}" delivered! Payout of ${payoutFormatted} credited to studio (${netProfitFormatted} net profit).`;
      completedEvents.push(msg);

      state.feed.unshift({
        id: 'evt_wrap_' + Date.now() + '_' + i,
        day: state.clock.day,
        date: state.clock.formattedDate,
        category: 'Production',
        title: `Shoot Delivered: ${completedProj.name}`,
        body: msg,
        icon: '💰'
      });
    }

    // 2. Periodic RFP bids pool refresh (every 14 days or if empty)
    if (state.clock.day % 14 === 0 || state.bids.length === 0) {
      refreshAvailableBids(state);
    }
  }

  /**
   * Helper to compute studio max concurrent shoots capacity
   */
  function getStudioCapacity(state) {
    let capacity = 2; // base capacity
    if (state.studio.upgrades && state.studio.upgrades.includes('sound_stage_tier2')) {
      capacity += 1;
    }
    return capacity;
  }

  /**
   * Computes upgrade perks
   */
  function getUpgradePerks(state) {
    const perks = {
      qualityBonus: 0,
      wardrobeDiscount: 0,
      speedMultiplier: 1.0,
      satisfactionBonus: 0
    };

    if (!state.studio.upgrades) return perks;

    const catalog = window.StudioGame.Data.Upgrades || [];
    state.studio.upgrades.forEach(upgId => {
      const upg = catalog.find(u => u.id === upgId);
      if (upg) {
        if (upg.qualityBonus) perks.qualityBonus += upg.qualityBonus;
        if (upg.costReductionRatio) perks.wardrobeDiscount += upg.costReductionRatio;
        if (upg.speedMultiplier) perks.speedMultiplier *= upg.speedMultiplier;
        if (upg.satisfactionBonus) perks.satisfactionBonus += upg.satisfactionBonus;
      }
    });

    return perks;
  }

  /**
   * Purchase a Studio Facility Upgrade
   */
  function purchaseUpgrade(state, upgradeId) {
    ensureProjectState(state);
    const catalog = window.StudioGame.Data.Upgrades || [];
    const upg = catalog.find(u => u.id === upgradeId);
    if (!upg) return { success: false, error: 'Upgrade not found.' };

    if (state.studio.upgrades.includes(upgradeId)) {
      return { success: false, error: 'Upgrade already installed at your studio.' };
    }

    if (state.studio.cash < upg.cost) {
      return { success: false, error: `Insufficient studio funds. Requires ${window.StudioGame.Systems.Finance.formatRupees(upg.cost)}.` };
    }

    // Deduct cost and add upgrade
    state.studio.cash -= upg.cost;
    state.studio.upgrades.push(upgradeId);

    // Increase studio facilities valuation directly
    state.studio.facilitiesValue = (state.studio.facilitiesValue || 0) + upg.assetValuationBoost;

    // Recalculate studio net worth
    if (window.StudioGame.Systems.Finance) {
      window.StudioGame.Systems.Finance.dailyTick(state);
    }

    state.feed.unshift({
      id: 'evt_upg_' + Date.now(),
      day: state.clock.day,
      date: state.clock.formattedDate,
      category: 'Facilities',
      title: `Studio Upgrade Installed: ${upg.name}`,
      body: `Commissioned ${upg.name}. Studio valuation boosted by ${window.StudioGame.Systems.Finance.formatRupees(upg.assetValuationBoost)}!`,
      icon: '🏗️'
    });

    return {
      success: true,
      upgrade: upg,
      message: `Successfully commissioned ${upg.name}! Studio valuation boosted by ${window.StudioGame.Systems.Finance.formatRupees(upg.assetValuationBoost)}.`
    };
  }

  return {
    ensureProjectState,
    refreshAvailableBids,
    submitBid,
    calculateCostBill,
    launchCustomProject,
    dailyTick,
    getStudioCapacity,
    getUpgradePerks,
    purchaseUpgrade
  };
})();
