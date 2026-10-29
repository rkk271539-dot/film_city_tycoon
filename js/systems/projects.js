/**
 * Production Pipeline, Commercial Bidding, Feature Films & Studio Upgrades System
 * Handles multi-turn commercial shoots, client RFPs, rival studio bidding,
 * feature films & web series (Section 3.6), theatrical box office runs,
 * streaming OTT licensing deals, and studio upgrades.
 */

window.StudioGame = window.StudioGame || {};
window.StudioGame.Systems = window.StudioGame.Systems || {};

window.StudioGame.Systems.Projects = (function() {
  /**
   * Available Cinema Formats (Section 3.6)
   */
  const CINEMA_FORMATS = [
    {
      id: 'short_film',
      name: 'Short Film',
      durationDays: 28, // 4 weeks
      theatricalWeeks: 0, // YouTube / Festival release
      baseCost: 800000, // 8 Lakhs
      icon: '🎞️',
      description: 'Festival circuit or digital showcase. Low budget, high critical acclaim potential.'
    },
    {
      id: 'web_series',
      name: 'Web Series Season',
      durationDays: 75, // 2.5 months
      theatricalWeeks: 5, // 5 weeks of weekly streaming drops
      baseCost: 45000000, // 4.5 Cr
      icon: '📺',
      description: 'High-concept multi-episode streaming show licensed to OTT giants.'
    },
    {
      id: 'small_film',
      name: 'Small Budget Indie Film',
      durationDays: 95, // 3 months
      theatricalWeeks: 2, // 2-week theatrical run then OTT
      baseCost: 25000000, // 2.5 Cr
      icon: '🎭',
      description: 'Content-driven cinematic drama targeting multiplexes and festival acclaim.'
    },
    {
      id: 'mid_film',
      name: 'Mid Budget Commercial Film',
      durationDays: 165, // ~5.5 months
      theatricalWeeks: 4, // 4-week theatrical run
      baseCost: 65000000, // 6.5 Cr
      icon: '🎬',
      description: 'Mainstream commercial entertainer with star cast, hit songs, and national theatrical release.'
    },
    {
      id: 'big_film',
      name: 'Big Budget Blockbuster',
      durationDays: 250, // ~8.5 months (240-270 days)
      theatricalWeeks: 5, // 5-week mega theatrical run
      baseCost: 180000000, // 18 Cr
      icon: '👑',
      description: 'Pan-India spectacle with megastar cast, massive VFX, and record screen count.'
    }
  ];

  const CINEMA_GENRES = [
    { id: 'action_masala', name: 'Action Masala & Stunts', icon: '💥', multiplier: 1.35 },
    { id: 'romantic_drama', name: 'Grand Romantic Drama', icon: '💖', multiplier: 1.20 },
    { id: 'spy_thriller', name: 'Spyverse & Espionage', icon: '🕵️', multiplier: 1.30 },
    { id: 'horror_comedy', name: 'Horror Comedy', icon: '👻', multiplier: 1.25 },
    { id: 'mythological_epic', name: 'Mythological Epic', icon: '🏹', multiplier: 1.50 },
    { id: 'crime_noir', name: 'Underworld Crime & Mafia', icon: '🔫', multiplier: 1.15 },
    { id: 'social_satire', name: 'Social Comedy & Satire', icon: '🎭', multiplier: 1.10 }
  ];

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
    const count = 3 + Math.floor(Math.random() * 2);

    for (let i = 0; i < count; i++) {
      const client = clients[Math.floor(Math.random() * clients.length)];
      const genre = genres.find(g => g.id === client.preferredGenre) || genres[0];
      const isAd = Math.random() > 0.45;

      const format = isAd ? 'Short Ad Film' : 'Commercial Photoshoot';
      const durationDays = isAd ? (7 + Math.floor(Math.random() * 8)) : (1 + Math.floor(Math.random() * 3));
      
      const baseBudget = isAd
        ? Math.round((1200000 + Math.random() * 1800000) * client.budgetMultiplier)
        : Math.round((400000 + Math.random() * 600000) * client.budgetMultiplier);

      const competingRivals = [];
      const shuffledRivals = [...rivals].sort(() => 0.5 - Math.random());
      for (let r = 0; r < 2; r++) {
        const rivalName = shuffledRivals[r];
        const bidRatio = 0.82 + (Math.random() * 0.22);
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
    const activeCount = state.studio.projects.length;
    const maxCapacity = getStudioCapacity(state);
    if (activeCount >= maxCapacity) {
      return {
        success: false,
        error: `Studio sound stages are at full capacity (${activeCount}/${maxCapacity} shoots). Finish ongoing projects or upgrade your sound stage.`
      };
    }

    const upfrontDeposit = Math.round(playerBidAmount * 0.25);
    if (state.studio.cash < upfrontDeposit) {
      return {
        success: false,
        error: `Insufficient studio cash for upfront crew/equipment deposit (Requires ${window.StudioGame.Systems.Finance.formatRupees(upfrontDeposit)}).`
      };
    }

    let playerQuality = state.studio.reputation;
    if (state.player.skill === 'talented_writer') playerQuality *= 1.25;
    if (state.player.skill === 'marketing_guru') playerQuality *= 1.15;
    if (state.wife && state.wife.currentRoleId === 'studio_creative_head') playerQuality *= 1.10;

    const upgradeBonuses = getUpgradePerks(state);
    playerQuality += upgradeBonuses.qualityBonus;

    let negotiatorMultiplier = 1.0;
    if (state.player.skill === 'sharp_negotiator') negotiatorMultiplier = 1.25;

    const priceRatio = playerBidAmount / rfp.clientMaxBudget;
    let priceScore = (1.1 - priceRatio) * 100;
    if (priceRatio > 1.05) priceScore -= 40;

    let playerScore = (priceScore * 0.5 + playerQuality * 0.5) * negotiatorMultiplier;
    playerScore += (Math.random() * 12 - 6);

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

    state.bids.splice(rfpIndex, 1);

    if (playerScore >= bestRivalScore) {
      state.studio.cash -= upfrontDeposit;

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
      return {
        won: false,
        winnerName: bestRival.name,
        winningBid: bestRival.bidAmount,
        message: `${rfp.clientName} awarded the contract to ${bestRival.name} (${window.StudioGame.Systems.Finance.formatRupees(bestRival.bidAmount)}).`
      };
    }
  }

  /**
   * Launch a Major Cinema Production (Section 3.6)
   */
  function launchCinemaFeature(state, params) {
    ensureProjectState(state);
    const activeCount = state.studio.projects.length;
    const maxCapacity = getStudioCapacity(state);
    if (activeCount >= maxCapacity) {
      return { success: false, error: `Studio floors at capacity (${activeCount}/${maxCapacity}).` };
    }

    const formatDef = CINEMA_FORMATS.find(f => f.id === params.formatId) || CINEMA_FORMATS[2];
    const genreDef = CINEMA_GENRES.find(g => g.id === params.genreId) || CINEMA_GENRES[0];

    const leadActor = (state.talent || []).find(t => t.id === params.leadActorId);
    const leadActress = (state.talent || []).find(t => t.id === params.leadActressId);

    let actorFee = leadActor ? (leadActor.contractStatus === 'signed_player' ? Math.round(leadActor.averageFee * 0.2) : leadActor.averageFee) : 500000;
    let actressFee = leadActress ? (leadActress.contractStatus === 'signed_player' ? Math.round(leadActress.averageFee * 0.2) : leadActress.averageFee) : 500000;

    let subtotalCost = formatDef.baseCost + actorFee + actressFee;

    if (state.player.skill === 'brilliant_manager') {
      subtotalCost *= 0.75;
    }

    const totalCost = Math.round(subtotalCost);
    if (state.studio.cash < totalCost) {
      return {
        success: false,
        error: `Insufficient studio funds to greenlight production (Requires ${window.StudioGame.Systems.Finance.formatRupees(totalCost)}).`
      };
    }

    state.studio.cash -= totalCost;

    const title = params.title || `${genreDef.name} Blockbuster`;
    const newFeature = {
      id: 'film_' + Date.now(),
      name: title,
      title: title,
      format: formatDef.name,
      formatId: formatDef.id,
      genreName: genreDef.name,
      genreIcon: genreDef.icon,
      totalDays: formatDef.durationDays,
      theatricalWeeks: formatDef.theatricalWeeks,
      daysElapsed: 0,
      theatricalDayCount: 0,
      theatricalWeekCurrent: 1,
      theatricalGrossTotal: 0,
      theatricalGrossWeek: 0,
      upfrontInvested: totalCost,
      agreedPayout: formatDef.theatricalWeeks === 0 ? Math.round(totalCost * (1.35 + Math.random() * 0.40)) : 0,
      verdict: formatDef.theatricalWeeks === 0 ? 'Critically Acclaimed Festival Winner' : null,
      leadActorName: leadActor ? leadActor.name : 'Unknown Star',
      leadActressName: leadActress ? leadActress.name : 'Unknown Star',
      leadActorId: leadActor?.id,
      leadActressId: leadActress?.id,
      leadActorInfo: leadActor ? { id: leadActor.id, name: leadActor.name, fans: leadActor.fans, avatar: leadActor.avatar || leadActor.avatarSvg, pureImage: leadActor.pureImage, tier: leadActor.tier } : null,
      leadActressInfo: leadActress ? { id: leadActress.id, name: leadActress.name, fans: leadActress.fans, avatar: leadActress.avatar || leadActress.avatarSvg, pureImage: leadActress.pureImage, tier: leadActress.tier } : null,
      costBreakdown: {
        actorFee: actorFee,
        actressFee: actressFee,
        baseProduction: Math.round(formatDef.baseCost * 0.45),
        cameraAndOptics: Math.round(formatDef.baseCost * 0.20),
        marketingBlitz: Math.round(formatDef.baseCost * 0.20),
        postAndVfx: Math.round(formatDef.baseCost * 0.15)
      },
      stage: 'Phase 1: Script & Packaging',
      inTheatres: false
    };

    state.studio.projects.push(newFeature);

    // Reset idle days and boost star loyalty on greenlight
    if (leadActor) {
      leadActor.daysIdle = 0;
      leadActor.loyalty = Math.min(100, (leadActor.loyalty || 60) + 6);
    }
    if (leadActress) {
      leadActress.daysIdle = 0;
      leadActress.loyalty = Math.min(100, (leadActress.loyalty || 60) + 6);
    }

    state.feed.unshift({
      id: 'evt_film_launch_' + Date.now(),
      day: state.clock.day,
      date: state.clock.formattedDate,
      category: 'Cinema Feature',
      title: `Grand Mahurat: ${title}`,
      body: `${state.studio.name} greenlit ${formatDef.name} "${title}" starring ${newFeature.leadActorName} & ${newFeature.leadActressName}. Total budget: ${window.StudioGame.Systems.Finance.formatRupees(totalCost)}.`,
      icon: '🎬'
    });

    return { success: true, project: newFeature };
  }

  /**
   * Calculate Itemized Cost Bill for Custom Photoshoot / Ad
   */
  function calculateCostBill(state, params = {}) {
    ensureProjectState(state);
    const format = params.format || 'Commercial Photoshoot';
    const isAd = format === 'Short Ad Film';
    const talent = params.talent || (state.talent && state.talent[0]) || { name: 'Simran Ahuja', averageFee: 35000 };

    let modelFee = talent.flatFee || talent.averageFee || 40000;
    let studioRent = isAd ? 65000 : 20000;
    let cameraEquipmentRent = isAd ? 45000 : 18000;
    let crewAndLighting = isAd ? 55000 : 22000;
    let locationAndPermits = isAd ? 35000 : 15000;
    let wardrobeAndProps = isAd ? 30000 : 12000;
    let postProductionBuffer = isAd ? 25000 : 8000;

    const perks = getUpgradePerks(state);
    if (perks.wardrobeDiscount) {
      wardrobeAndProps *= (1 - perks.wardrobeDiscount);
    }

    if (state.wife && state.wife.currentRoleId === 'studio_casting_head') {
      modelFee *= 0.90;
    }

    let subtotal = modelFee + studioRent + cameraEquipmentRent + crewAndLighting + locationAndPermits + wardrobeAndProps + postProductionBuffer;
    let managerDiscount = 0;
    if (state.player.skill === 'brilliant_manager') {
      managerDiscount = subtotal * 0.25;
      subtotal -= managerDiscount;
    }

    const contingencyBuffer = Math.round(subtotal * 0.08);
    const totalCost = Math.round(subtotal + contingencyBuffer);
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
   * Daily Turn Tick for all studio projects
   */
  function dailyTick(state) {
    ensureProjectState(state);

    const completedIndices = [];

    state.studio.projects.forEach((proj, idx) => {
      // 1. Feature film in theatrical release
      if (proj.inTheatres) {
        tickTheatricalRun(state, proj, idx, completedIndices);
        return;
      }

      // 2. Normal production phase progression
      proj.daysElapsed += 1;
      const progressRatio = proj.daysElapsed / proj.totalDays;

      if (proj.theatricalWeeks && proj.theatricalWeeks > 0) {
        // Feature Film / Web Series multi-stage pipeline
        if (progressRatio < 0.25) {
          proj.stage = 'Phase 1: Pre-Production & Casting';
        } else if (progressRatio < 0.65) {
          proj.stage = 'Phase 2: Principal Photography (Floor Shoot)';
        } else if (progressRatio < 0.90) {
          proj.stage = 'Phase 3: Post-Production & Censor Board';
        } else if (progressRatio < 1.0) {
          proj.stage = 'Phase 4: Pan-India Marketing Blitz & Trailer';
        } else {
          // ENTER THEATRICAL RELEASE / STREAMING PREMIERE!
          proj.inTheatres = true;
          proj.theatricalWeekCurrent = 1;
          proj.theatricalDayCount = 0;
          proj.stage = proj.formatId === 'web_series' ? 'Phase 5: Streaming Drop on NetPrime & YouTube' : 'Phase 5: In Theatres & Multiplexes';

          const leadActor = (state.talent || []).find(t => t.id === proj.leadActorId);
          const leadActress = (state.talent || []).find(t => t.id === proj.leadActressId);
          const combinedFans = (leadActor?.fans || 250000) + (leadActress?.fans || 250000);
          
          // Fan Multiplier: low fans = 0.85x, 40M+ fans = up to 2.35x
          const fanMultiplier = Math.max(0.85, Math.min(2.35, 0.85 + (combinedFans / 40000000)));
          proj.combinedFans = combinedFans;
          proj.fanMultiplier = fanMultiplier;

          const openingWeekend = Math.round(proj.upfrontInvested * (0.65 + Math.random() * 0.65) * fanMultiplier);
          proj.theatricalGrossWeek = openingWeekend;
          proj.theatricalGrossTotal = openingWeekend;

          const fanNote = combinedFans >= 10000000 ? ` Powered by massive ${window.StudioGame.Systems.Talent.formatFanCount(combinedFans)} fan base frenzy!` : '';
          state.feed.unshift({
            id: 'evt_theatre_open_' + Date.now(),
            day: state.clock.day,
            date: state.clock.formattedDate,
            category: proj.formatId === 'web_series' ? 'Streaming Premiere' : 'Box Office Premiere',
            title: proj.formatId === 'web_series' ? `OTT Premiere: ${proj.name} Drops!` : `Pan-India Release: ${proj.name}!`,
            body: `"${proj.name}" debuted across ${proj.formatId === 'web_series' ? 'NetPrime & YouTube streaming' : '3,800 screens nationwide'}! Sensational opening weekend collected ${window.StudioGame.Systems.Finance.formatRupees(openingWeekend)}.${fanNote}`,
            icon: proj.formatId === 'web_series' ? '📺' : '🎟️'
          });
        }
      } else {
        // Commercial Shoot or Short Film
        if (progressRatio < 0.3) {
          proj.stage = 'Pre-Production & Packaging';
        } else if (progressRatio < 0.8) {
          proj.stage = 'Active Floor Shoot';
        } else if (progressRatio < 1.0) {
          proj.stage = 'Post-Production & Final Master';
        } else {
          proj.stage = 'Delivery & Wrap';
          completedIndices.push(idx);
        }
      }
    });

    // Handle completed commercial shoots and short films
    for (let i = completedIndices.length - 1; i >= 0; i--) {
      const completedProj = state.studio.projects.splice(completedIndices[i], 1)[0];
      wrapCommercialShoot(state, completedProj);
    }

    // Handle ongoing streaming royalties for catalog web series & short films
    (state.studio.completedProjects || []).forEach(cp => {
      if (cp.isStreamingCatalog && cp.royaltyDaysRemaining > 0) {
        cp.royaltyDaysRemaining -= 1;
        const dailyInflow = Math.round(cp.dailyRoyalty * (0.92 + Math.random() * 0.16));
        state.studio.cash += dailyInflow;
        cp.cumulativePassiveEarnings = (cp.cumulativePassiveEarnings || 0) + dailyInflow;
        cp.profitEarned = (cp.profitEarned || 0) + dailyInflow;
        // Slow natural decay over time
        cp.dailyRoyalty = Math.max(1200, Math.round(cp.dailyRoyalty * 0.997));
      }
    });

    // Refresh RFP bids pool
    if (state.clock.day % 14 === 0 || state.bids.length === 0) {
      refreshAvailableBids(state);
    }
  }

  function tickTheatricalRun(state, proj, idx, completedIndices) {
    proj.theatricalDayCount += 1;
    const dailyTicketShare = Math.round(proj.theatricalGrossWeek / 7);
    proj.theatricalGrossTotal += dailyTicketShare;
    
    // 50% distributor net share credited to studio
    state.studio.cash += Math.round(dailyTicketShare * 0.50);

    // End of theatrical week
    if (proj.theatricalDayCount % 7 === 0) {
      proj.theatricalWeekCurrent += 1;
      proj.theatricalGrossWeek = Math.round(proj.theatricalGrossWeek * (0.50 + Math.random() * 0.25));

      if (proj.theatricalWeekCurrent > proj.theatricalWeeks || proj.theatricalGrossWeek < 2000000) {
        state.studio.projects.splice(idx, 1);
        wrapCinemaFeature(state, proj);
      }
    }
  }

  function wrapCommercialShoot(state, completedProj) {
    if (!completedProj.agreedPayout) {
      completedProj.agreedPayout = Math.round((completedProj.upfrontInvested || 800000) * 1.45);
    }
    state.studio.cash += completedProj.agreedPayout;
    state.studio.reputation = Math.min(100, state.studio.reputation + 2);

    completedProj.deliveredDate = state.clock.formattedDate;
    completedProj.profitEarned = completedProj.agreedPayout - (completedProj.upfrontInvested || 0);
    completedProj.verdict = completedProj.verdict || 'Commercial Hit';
    state.studio.completedProjects.unshift(completedProj);

    const netProfitFormatted = window.StudioGame.Systems.Finance.formatRupees(completedProj.profitEarned, { forcePlus: true });
    const payoutFormatted = window.StudioGame.Systems.Finance.formatRupees(completedProj.agreedPayout);

    state.feed.unshift({
      id: 'evt_wrap_' + Date.now(),
      day: state.clock.day,
      date: state.clock.formattedDate,
      category: 'Production',
      title: `Shoot Delivered: ${completedProj.name}`,
      body: `"${completedProj.name}" delivered! Payout of ${payoutFormatted} credited to studio (${netProfitFormatted} net profit).`,
      icon: '💰'
    });
  }

  function wrapCinemaFeature(state, proj) {
    const roi = proj.theatricalGrossTotal / proj.upfrontInvested;
    let verdict = 'Semi-Hit';
    if (roi >= 2.5) verdict = 'All-Time Blockbuster';
    else if (roi >= 1.8) verdict = 'Blockbuster';
    else if (roi >= 1.3) verdict = 'Super Hit';
    else if (roi >= 1.0) verdict = 'Hit';
    else if (roi >= 0.7) verdict = 'Average';
    else verdict = 'Flop';

    // OTT Windfall influenced by Fans and Star Power
    const combinedFans = proj.combinedFans || 1000000;
    const fanOttBonus = Math.round(Math.min(50000000, combinedFans * 0.05));
    const ottWindfall = Math.round(proj.theatricalGrossTotal * 0.40) + fanOttBonus;
    state.studio.cash += ottWindfall;
    state.studio.reputation = Math.min(100, state.studio.reputation + (roi >= 1.5 ? 6 : 2));

    proj.deliveredDate = state.clock.formattedDate;
    proj.verdict = verdict;
    proj.ottLicense = ottWindfall;
    proj.theatricalDistributorShare = Math.round(proj.theatricalGrossTotal * 0.50);
    proj.profitEarned = (proj.theatricalDistributorShare + ottWindfall) - proj.upfrontInvested;

    // Web Series & Short Film long-tail streaming royalties initialization
    if (proj.formatId === 'web_series') {
      proj.isStreamingCatalog = true;
      proj.streamingPlatform = 'NetPrime & YouTube Official';
      proj.dailyRoyalty = Math.round((proj.theatricalGrossTotal * 0.0025) + (combinedFans * 0.0003) + 35000);
      proj.royaltyDaysRemaining = 180; // 6 months recurring long-tail
      proj.cumulativePassiveEarnings = 0;
    } else if (proj.formatId === 'short_film') {
      proj.isStreamingCatalog = true;
      proj.streamingPlatform = 'YouTube Festival Channel';
      proj.dailyRoyalty = Math.round(8000 + Math.random() * 12000);
      proj.royaltyDaysRemaining = 90; // 3 months recurring
      proj.cumulativePassiveEarnings = 0;
    }

    state.studio.completedProjects.unshift(proj);

    // Dynamic Star Relations & Morale changes
    [proj.leadActorId, proj.leadActressId].forEach(talentId => {
      if (!talentId) return;
      const t = (state.talent || []).find(star => star.id === talentId);
      if (t) {
        t.pastTopFilms = t.pastTopFilms || [];
        t.pastTopFilms.unshift({
          title: proj.name,
          year: state.clock.currentYear,
          verdict: verdict
        });
        if (roi >= 1.3) {
          const boostType = roi >= 2.5 ? 'all_time_blockbuster' : (roi >= 1.8 ? 'blockbuster' : 'hit_film');
          const growth = window.StudioGame.Systems.Talent.calculateFanGrowth(t.fans, boostType);
          t.fans += growth.growth;
          t.reputation = Math.min(100, t.reputation + 4);
          t.loyalty = Math.min(100, (t.loyalty || 60) + 15);
          t.relationship = Math.min(100, (t.relationship || 50) + 15);
        } else if (roi < 0.7) {
          t.loyalty = Math.max(20, (t.loyalty || 60) - 8);
          t.relationship = Math.max(20, (t.relationship || 50) - 8);
        }
      }
    });

    const streamingNote = proj.isStreamingCatalog ? ` Ongoing daily OTT/YouTube royalties active for next ${proj.royaltyDaysRemaining} days!` : '';
    state.feed.unshift({
      id: 'evt_film_verdict_' + Date.now(),
      day: state.clock.day,
      date: state.clock.formattedDate,
      category: 'Trade Box Office',
      title: `Trade Verdict: ${proj.name} is a ${verdict}!`,
      body: `Final box office gross reached ${window.StudioGame.Systems.Finance.formatRupees(proj.theatricalGrossTotal)}. Streaming rights licensed to NetPrime for ${window.StudioGame.Systems.Finance.formatRupees(ottWindfall)}.${streamingNote}`,
      icon: '🏆'
    });
  }

  function getStudioCapacity(state) {
    let capacity = 2;
    if (state.studio.upgrades && state.studio.upgrades.includes('sound_stage_tier2')) {
      capacity += 1;
    }
    return capacity;
  }

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

  function purchaseUpgrade(state, upgradeId) {
    ensureProjectState(state);
    const catalog = window.StudioGame.Data.Upgrades || [];
    const upg = catalog.find(u => u.id === upgradeId);
    if (!upg) return { success: false, error: 'Upgrade not found' };

    if (state.studio.upgrades.includes(upgradeId)) {
      return { success: false, error: 'Upgrade already installed on studio lot.' };
    }

    if (state.studio.cash < upg.cost) {
      return {
        success: false,
        error: `Insufficient studio funds (Requires ${window.StudioGame.Systems.Finance.formatRupees(upg.cost)}).`
      };
    }

    state.studio.cash -= upg.cost;
    state.studio.facilitiesValue += Math.round(upg.cost * 0.85);
    state.studio.upgrades.push(upgradeId);

    state.feed.unshift({
      id: 'evt_upg_' + Date.now(),
      day: state.clock.day,
      date: state.clock.formattedDate,
      category: 'Studio',
      title: `Facility Installed: ${upg.name}`,
      body: `Invested ${window.StudioGame.Systems.Finance.formatRupees(upg.cost)} into ${upg.name}. Studio asset valuation boosted!`,
      icon: '🏗️'
    });

    return { success: true, upgrade: upg };
  }

  return {
    CINEMA_FORMATS,
    CINEMA_GENRES,
    ensureProjectState,
    refreshAvailableBids,
    submitBid,
    launchCinemaFeature,
    calculateCostBill,
    launchCustomProject,
    dailyTick,
    getStudioCapacity,
    getUpgradePerks,
    purchaseUpgrade
  };
})();
