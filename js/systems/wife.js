/**
 * Wife Career, Autonomous Decision Engine, Dynamic Relationship & High-Society Social System
 * Comprehensive simulation of:
 * - Independent career agency, role transitions, skill growth & outside studio offers
 * - Dynamic changing relationship (warmth, neglect drift, marriage crisis, devoted co-founder)
 * - Openness gauge and high-society hotel encounters (forgive vs object vs PR cleanup)
 * - Male model & talent discount unlocks via high-society networking
 * - Luxury brand enterprise & Dalal Street IPO (Section 3.2 & 3.15 of REQUIREMENTS.md)
 * - Fitness & radiance investments, romantic dates, and interactive heart-to-heart talks
 */

window.StudioGame = window.StudioGame || {};
window.StudioGame.Systems = window.StudioGame.Systems || {};

window.StudioGame.Systems.Wife = (function() {
  const CAREER_ROLES = [
    {
      id: 'studio_creative_head',
      name: 'Studio Creative Head',
      category: 'Studio Executive',
      icon: '🎨',
      description: 'Leads script packaging and artistic vision at your studio. Directs narrative quality.',
      monthlySalary: 150000,
      primarySkill: 'creative',
      studioPerk: '+12% Script Quality & National Festival Awards Appeal',
      perkType: 'script_quality',
      perkValue: 1.12
    },
    {
      id: 'studio_marketing_head',
      name: 'Studio Marketing Head',
      category: 'Studio Executive',
      icon: '📣',
      description: 'Drives film publicity, teaser campaigns, and media buzz for your studio.',
      monthlySalary: 160000,
      primarySkill: 'business',
      studioPerk: '+15% Marketing Hype & Opening Weekend Box Office Blitz',
      perkType: 'marketing_hype',
      perkValue: 1.15
    },
    {
      id: 'studio_casting_head',
      name: 'Studio Head of Casting',
      category: 'Studio Executive',
      icon: '🌟',
      description: 'Scouts emerging talent and negotiates contract terms with agency managers.',
      monthlySalary: 140000,
      primarySkill: 'business',
      studioPerk: '-15% Talent Contract & Endorsement costs for the studio',
      perkType: 'talent_discount',
      perkValue: 0.85
    },
    {
      id: 'studio_finance_head',
      name: 'Studio Chief of Finance',
      category: 'Studio Executive',
      icon: '📊',
      description: 'Maintains financial discipline, audits equipment rentals, and curtails wasteful spending.',
      monthlySalary: 175000,
      primarySkill: 'business',
      studioPerk: '-15% Daily Studio Overheads & Utility Bills',
      perkType: 'overhead_cut',
      perkValue: 0.85
    },
    {
      id: 'independent_actress',
      name: 'Independent Film Actress',
      category: 'Entertainment',
      icon: '🎭',
      description: 'Auditions for films, web series, and major TV commercials across Mumbai. Can headline studio films for ₹0!',
      monthlySalary: 350000,
      primarySkill: 'acting',
      studioPerk: 'High industry visibility, festival red carpets & zero-fee studio heroine casting'
    },
    {
      id: 'high_fashion_model',
      name: 'High-Fashion Supermodel',
      category: 'Glamour',
      icon: '👠',
      description: 'Walks Fashion Week runways and signs luxury brand contracts. Can headline commercial shoots for ₹0!',
      monthlySalary: 280000,
      primarySkill: 'glamour',
      studioPerk: 'Builds elite fashion connections and zero-fee commercial photoshoot casting'
    },
    {
      id: 'independent_producer',
      name: 'Independent Film Producer',
      category: 'Production',
      icon: '🎬',
      description: 'Develops festival features and streaming series through third-party backing.',
      monthlySalary: 240000,
      primarySkill: 'creative',
      studioPerk: 'Deep network of distributors and streaming platform commissioning editors'
    },
    {
      id: 'brand_founder',
      name: 'Luxury Lifestyle Brand Founder',
      category: 'Entrepreneurship',
      icon: '💎',
      description: 'Runs her own designer cosmetics and organic skincare enterprise. Can float an IPO on Dalal Street!',
      monthlySalary: 450000,
      primarySkill: 'business',
      studioPerk: 'Independent corporate prestige, enterprise expansion & Dalal Street IPO listing'
    },
    {
      id: 'private_investor',
      name: 'Private Angel Investor',
      category: 'Finance',
      icon: '📈',
      description: 'Allocates capital into media-tech startups and cinematic exhibition chains.',
      monthlySalary: 320000,
      primarySkill: 'business',
      studioPerk: 'Quarterly venture dividends and early Dalal Street stock market intelligence'
    },
    {
      id: 'creative_sabbatical',
      name: 'Creative Sabbatical & Wellness',
      category: 'Personal',
      icon: '☕',
      description: 'Taking time off to recharge, study world cinema, and focus on personal wellness and marital bond.',
      monthlySalary: 0,
      primarySkill: 'creative',
      studioPerk: 'Rapid marital intimacy recharge and accelerated physical fitness recovery'
    }
  ];

  function getRoles() {
    return CAREER_ROLES;
  }

  function getRoleById(roleId) {
    return CAREER_ROLES.find(r => r.id === roleId) || CAREER_ROLES[0];
  }

  /**
   * Initializes wife data attributes on state if missing
   */
  function ensureWifeState(state) {
    if (!state.wife) state.wife = {};
    const wife = state.wife;

    if (!wife.name) wife.name = 'Rhea Sharma';
    if (!wife.age) wife.age = 25;
    if (!wife.avatar) {
      wife.avatar = window.StudioGame.Face?.generate ? window.StudioGame.Face.generate({ gender: 'female', seed: 'wife' }) : 'data:image/svg+xml;utf8,<svg></svg>';
    }
    if (wife.netWorth === undefined) wife.netWorth = 45000000; // 4.5 Cr starting net worth
    if (wife.relationship === undefined) wife.relationship = 95; // 0 to 100
    if (wife.openness === undefined) wife.openness = 10; // 0 to 100
    if (wife.fitness === undefined) wife.fitness = 82; // 40 to 100

    if (!wife.skills) {
      wife.skills = {
        acting: 28,
        glamour: 42,
        business: 45,
        creative: 50
      };
    }

    if (!wife.currentRoleId) {
      wife.currentRoleId = 'studio_creative_head';
      wife.currentRole = getRoleById('studio_creative_head').name;
    }

    if (wife.nudgeRole === undefined) wife.nudgeRole = null;
    if (wife.nudgeDaysRemaining === undefined) wife.nudgeDaysRemaining = 0;
    if (wife.careerEarningsTotal === undefined) wife.careerEarningsTotal = 0;
    if (wife.lastDecisionDay === undefined) wife.lastDecisionDay = 1;
    if (wife.lastRomanticDay === undefined) wife.lastRomanticDay = 1;
    if (wife.lastSocialEventDay === undefined) wife.lastSocialEventDay = 1;
    if (wife.lastOfferDay === undefined) wife.lastOfferDay = 1;
    if (!wife.mood) wife.mood = 'loving'; // 'ecstatic' | 'loving' | 'content' | 'pensive' | 'frustrated' | 'neglected'
    if (!wife.unlockedTalentDiscounts) wife.unlockedTalentDiscounts = [];
    if (wife.pendingOutsideOffer === undefined) wife.pendingOutsideOffer = null;
    if (wife.pendingSocialEvent === undefined) wife.pendingSocialEvent = null;

    if (!wife.careerHistory || wife.careerHistory.length === 0) {
      wife.careerHistory = [
        {
          day: 1,
          date: state.clock.formattedDate || '01 Jan 2026',
          roleId: wife.currentRoleId,
          roleName: wife.currentRole,
          title: 'Co-Founder Appointment',
          description: `Joined ${state.studio.name || 'the studio'} as partner and creative visionary.`
        }
      ];
    }

    if (!wife.venture && wife.currentRoleId === 'brand_founder') {
      wife.venture = {
        name: `${wife.name.split(' ')[0]} Luxury Botanicals`,
        category: 'High-Glamour Cosmetics & Skincare',
        valuation: 25000000, // 2.5 Cr
        monthlyRevenue: 380000,
        isPublic: false,
        ticker: 'RLUX',
        sharesOwnedPct: 80,
        dividendsPaidTotal: 0
      };
    }
  }

  /**
   * Evaluates autonomous career opportunities
   * She weighs her skills, potential earnings, domestic happiness, and player nudges.
   */
  function evaluateCareer(state, force = false) {
    ensureWifeState(state);
    const wife = state.wife;
    const currentDay = state.clock.day;

    // Minimum 30 days between spontaneous career switches unless forced
    if (!force && (currentDay - wife.lastDecisionDay < 30)) {
      return null;
    }

    // Role scoring calculation
    const scores = CAREER_ROLES.map(role => {
      let score = 50; // base score

      // 1. Skill alignment
      const skillScore = wife.skills[role.primarySkill] || 30;
      score += skillScore * 0.85;

      // 2. Relationship impact
      const isStudioRole = role.category === 'Studio Executive';
      if (isStudioRole) {
        score += (wife.relationship - 50) * 0.7;
      } else {
        // High independence / high openness favors external roles
        score += (wife.openness) * 0.35;
      }

      // 3. Player Nudge / Influence Bonus
      if (wife.nudgeRole === role.id && wife.nudgeDaysRemaining > 0) {
        // High relationship makes her much more responsive to your advice
        const nudgePower = 30 + (wife.relationship * 0.35);
        score += nudgePower;
      }

      // 4. Inertia / loyalty to current role
      if (role.id === wife.currentRoleId) {
        score += 30; // Tendency to maintain professional momentum
      }

      // 5. Random industry opportunity / market drift
      score += (Math.random() * 20 - 10);

      return { role, score };
    });

    // Sort descending by score
    scores.sort((a, b) => b.score - a.score);
    const chosen = scores[0].role;

    // If she decides to change role
    if (chosen.id !== wife.currentRoleId) {
      const prevRole = getRoleById(wife.currentRoleId);
      wife.currentRoleId = chosen.id;
      wife.currentRole = chosen.name;
      wife.lastDecisionDay = currentDay;

      // Initialize venture if switching to brand founder
      if (chosen.id === 'brand_founder' && !wife.venture) {
        wife.venture = {
          name: `${wife.name.split(' ')[0]} Luxury Botanicals`,
          category: 'High-Glamour Cosmetics & Skincare',
          valuation: 25000000,
          monthlyRevenue: 380000,
          isPublic: false,
          ticker: 'RLUX',
          sharesOwnedPct: 80,
          dividendsPaidTotal: 0
        };
      }

      // Reset active nudge once acted upon
      if (wife.nudgeRole === chosen.id) {
        wife.nudgeRole = null;
        wife.nudgeDaysRemaining = 0;
      }

      const eventTitle = `Career Transition: ${chosen.name}`;
      const desc = `${wife.name} transitioned from ${prevRole.name} to ${chosen.name}. "${getCareerDialogue(chosen, wife)}"`;

      wife.careerHistory.unshift({
        day: currentDay,
        date: state.clock.formattedDate,
        roleId: chosen.id,
        roleName: chosen.name,
        title: eventTitle,
        description: desc
      });

      // Activity Feed notice
      state.feed.unshift({
        id: 'evt_wife_' + Date.now(),
        day: currentDay,
        date: state.clock.formattedDate,
        category: 'Family',
        title: `${wife.name} • ${eventTitle}`,
        body: desc,
        icon: chosen.icon
      });

      return {
        changed: true,
        newRole: chosen,
        message: desc
      };
    }

    return { changed: false, currentRole: getRoleById(wife.currentRoleId) };
  }

  function getCareerDialogue(role, wife) {
    switch (role.id) {
      case 'studio_creative_head':
        return "I want our studio to make meaningful cinematic masterpieces. I'm taking full charge of script packaging and story vision.";
      case 'studio_marketing_head':
        return "Hype and box office buzz are everything in modern cinema. I'm stepping up to command our national campaigns!";
      case 'studio_casting_head':
        return "I have an instinctive eye for breakout talent. Let me oversee our casting calls and agency bargaining.";
      case 'studio_finance_head':
        return "We need iron-clad fiscal discipline. I'll personally audit our equipment rentals and studio overheads.";
      case 'independent_actress':
        return "A top production house offered me a compelling screen role. The camera is calling me, Kabir!";
      case 'high_fashion_model':
        return "Lakme Fashion Week is approaching. I've signed with a premier agency for runway shows and couture editorials.";
      case 'independent_producer':
        return "I've secured third-party streaming funding for a daring new psychological thriller series.";
      case 'brand_founder':
        return `It's time to build my own independent enterprise. I'm launching ${wife.venture ? wife.venture.name : 'my luxury beauty label'}!`;
      case 'private_investor':
        return "Cinema exhibition and media-tech are booming. I'm allocating private capital into smart cinematic ventures.";
      case 'creative_sabbatical':
        return "I need a brief respite to recharge, study world cinema, and invest devoted time in our marriage.";
      default:
        return "I'm ready for this exciting new chapter in my professional life.";
    }
  }

  /**
   * Generates dynamic outside job offers from rival studios & brands (Section 3.2)
   */
  function checkOutsideOffers(state) {
    ensureWifeState(state);
    const wife = state.wife;
    if (wife.pendingOutsideOffer) return; // Already has an active offer pending decision

    const day = state.clock.day;
    if (day - (wife.lastOfferDay || 0) < 35) return;

    // Probability check
    if (Math.random() > 0.40) return;

    wife.lastOfferDay = day;

    const offerTypes = [
      {
        id: 'offer_dharma_film',
        type: 'film_role',
        title: 'Lead Heroine in Dharma Productions Blockbuster',
        clientOrStudio: 'Dharma Productions',
        roleTitle: 'Romantic Heroine Lead',
        fee: 22000000, // 2.2 Cr
        skillReq: 'acting',
        minSkill: 35,
        description: 'Karan Johar has formally reached out offering Rhea the lead female role in their upcoming ₹160 Cr romance drama filming in Switzerland and Mumbai.'
      },
      {
        id: 'offer_vogue_cover',
        type: 'modeling_deal',
        title: 'Vogue India Global Cover & Lakme Showstopper',
        clientOrStudio: 'Condé Nast & Lakme',
        roleTitle: 'Runway Showstopper & Cover Star',
        fee: 7500000, // 75 Lakhs
        skillReq: 'glamour',
        minSkill: 38,
        description: 'Vogue India and Lakme Fashion Week selected Rhea to close the grand finale gala as the celebrity showstopper in a Sabyasachi couture ensemble.'
      },
      {
        id: 'offer_netprime_exec',
        type: 'corporate_exec',
        title: 'Head of Regional Fiction at NetPrime India',
        clientOrStudio: 'NetPrime Streaming',
        roleTitle: 'VP of Originals & Script Packaging',
        fee: 30000000, // 3.0 Cr annual package
        skillReq: 'creative',
        minSkill: 40,
        description: 'NetPrime India offered Rhea a senior executive contract commanding all regional fiction greenlights and multi-season web series commissions.'
      },
      {
        id: 'offer_venture_capital',
        type: 'brand_funding',
        title: 'Series-A Seed Capital for Brand Expansion',
        clientOrStudio: 'Sequoia Media Capital',
        roleTitle: 'Enterprise Co-Investment',
        fee: 50000000, // 5.0 Cr expansion
        skillReq: 'business',
        minSkill: 42,
        description: 'Sequoia Media Capital is prepared to inject ₹5 Cr expansion capital into her cosmetics label to launch physical storefronts in luxury malls.'
      }
    ];

    // Filter offers matching her skills or current role
    const matching = offerTypes.filter(o => (wife.skills[o.skillReq] || 30) >= o.minSkill);
    if (matching.length === 0) return;

    const picked = matching[Math.floor(Math.random() * matching.length)];
    wife.pendingOutsideOffer = {
      ...picked,
      receivedDay: day,
      expiresDay: day + 14
    };

    state.feed.unshift({
      id: 'evt_offer_' + Date.now(),
      day: day,
      date: state.clock.formattedDate,
      category: 'Wife Career',
      title: `Lucrative Offer: ${picked.clientOrStudio}`,
      body: `${picked.clientOrStudio} sent an exclusive offer to ${wife.name} (${window.StudioGame.Systems.Finance.formatRupees(picked.fee)}). She is seeking your consultation!`,
      icon: '📬'
    });
  }

  /**
   * Accept an outside job offer
   */
  function acceptOutsideOffer(state, offerId) {
    ensureWifeState(state);
    const wife = state.wife;
    const offer = wife.pendingOutsideOffer;
    if (!offer || offer.id !== offerId) {
      return { success: false, error: 'Offer is no longer active.' };
    }

    // Payout credited to wife's personal net worth
    wife.netWorth += offer.fee;
    wife.careerEarningsTotal += offer.fee;
    wife.skills[offer.skillReq] = Math.min(100, (wife.skills[offer.skillReq] || 30) + 12);
    wife.fitness = Math.min(100, wife.fitness + 5);

    // If she was in studio executive role, she transitions to Independent Stardom
    if (offer.type === 'film_role') {
      wife.currentRoleId = 'independent_actress';
      wife.currentRole = getRoleById('independent_actress').name;
    } else if (offer.type === 'modeling_deal') {
      wife.currentRoleId = 'high_fashion_model';
      wife.currentRole = getRoleById('high_fashion_model').name;
    } else if (offer.type === 'brand_funding' && wife.venture) {
      wife.venture.valuation += offer.fee * 1.5;
      wife.venture.monthlyRevenue += Math.round(offer.fee * 0.05);
    }

    const feeFormatted = window.StudioGame.Systems.Finance.formatRupees(offer.fee);
    const desc = `${wife.name} signed the lucrative contract with ${offer.clientOrStudio} for ${feeFormatted}. Her industry stature and net worth skyrocketed!`;

    wife.careerHistory.unshift({
      day: state.clock.day,
      date: state.clock.formattedDate,
      roleId: wife.currentRoleId,
      roleName: wife.currentRole,
      title: `Signed Contract: ${offer.clientOrStudio}`,
      description: desc
    });

    state.feed.unshift({
      id: 'evt_offer_sign_' + Date.now(),
      day: state.clock.day,
      date: state.clock.formattedDate,
      category: 'Wife Career',
      title: `Contract Sealed: ${offer.title}`,
      body: desc,
      icon: '✍️'
    });

    wife.pendingOutsideOffer = null;
    return { success: true, message: desc, fee: offer.fee };
  }

  /**
   * Decline an outside job offer to stay dedicated to studio
   */
  function declineOutsideOffer(state, offerId) {
    ensureWifeState(state);
    const wife = state.wife;
    if (!wife.pendingOutsideOffer || wife.pendingOutsideOffer.id !== offerId) {
      return { success: false, error: 'Offer is no longer active.' };
    }

    const offerTitle = wife.pendingOutsideOffer.title;
    wife.pendingOutsideOffer = null;

    // Small relationship loyalty increase for choosing home studio
    wife.relationship = Math.min(100, wife.relationship + 4);
    wife.mood = 'loving';

    const desc = `${wife.name} politely turned down the offer for "${offerTitle}" to keep her full creative energy focused on your studio.`;

    wife.careerHistory.unshift({
      day: state.clock.day,
      date: state.clock.formattedDate,
      roleId: wife.currentRoleId,
      roleName: wife.currentRole,
      title: 'Declined Outside Offer',
      description: desc
    });

    return { success: true, message: desc };
  }

  /**
   * High-Society Social Encounters & Hotel Rumors Engine (Section 3.2 in REQUIREMENTS.md)
   * The wife hangs out with others and may end up at hotel parties. Never shown explicitly,
   * only as outcomes and headlines. Governed by openness attribute.
   */
  function checkSocialEncounters(state) {
    ensureWifeState(state);
    const wife = state.wife;
    if (wife.pendingSocialEvent) return;

    const day = state.clock.day;
    if (day - (wife.lastSocialEventDay || 0) < 45) return;

    // Encounters occur more often if openness is moderate/high or active in fashion/entertainment
    const baseChance = 0.35 + (wife.openness * 0.005);
    if (Math.random() > baseChance) return;

    wife.lastSocialEventDay = day;

    const venues = [
      { name: "Taj Land's End, Bandra", type: 'Sea Lounge VIP Suite' },
      { name: "Soho House, Juhu", type: 'Members Penthouse Terrace' },
      { name: "The St. Regis, Lower Parel", type: 'Presidential Afterparty' },
      { name: "The Leela Palace, Udaipur", type: 'High-Society Destination Gala' }
    ];
    const companions = [
      { name: "Armaan Singhania", title: "Top Haute Couture Male Supermodel" },
      { name: "Aarav Roy", title: "Acclaimed International Indie Film Director" },
      { name: "Devendra Singhal", title: "Heir to National Multiplex Cinema Chain" },
      { name: "Matteo Rossi", title: "Milan Fashion Week Creative Director" }
    ];

    const venue = venues[Math.floor(Math.random() * venues.length)];
    const companion = companions[Math.floor(Math.random() * companions.length)];

    wife.pendingSocialEvent = {
      id: 'soc_' + Date.now(),
      day: day,
      venueName: venue.name,
      venueType: venue.type,
      companionName: companion.name,
      companionTitle: companion.title,
      description: `Tabloid paparazzi captured photographs of ${wife.name} sharing a private late-night champagne dinner with ${companion.name} (${companion.title}) at ${venue.name}. The encounter concluded discreetly in the VIP suite elevators.`
    };

    state.feed.unshift({
      id: 'evt_paparazzi_' + Date.now(),
      day: day,
      date: state.clock.formattedDate,
      category: 'Paparazzi Wire',
      title: `Late Night Sighting: ${wife.name}`,
      body: `Paparazzi spotted ${wife.name} socialising with ${companion.name} at ${venue.name}. Tabloids are buzzing!`,
      icon: '📸'
    });
  }

  /**
   * Player choice resolving high-society hotel encounter (Forgive vs Object vs PR Cleanup)
   */
  function resolveSocialEvent(state, choiceId) {
    ensureWifeState(state);
    const wife = state.wife;
    const evt = wife.pendingSocialEvent;
    if (!evt) return { success: false, error: 'No active social event pending.' };

    const formatRupees = window.StudioGame.Systems.Finance.formatRupees;
    let resMsg = '';

    if (choiceId === 'forgive') {
      // 1. FORGIVE & EMBRACE MUTUAL FREEDOM (Section 3.2 REQUIREMENTS.md)
      // "She has an openness attribute. The more you forgive, the more open she becomes to 'going around'."
      // "Upside: she can bring in male models and talent for a lower cost. Downside: she gives more of her time to them."
      wife.openness = Math.min(100, wife.openness + 10);
      wife.relationship = Math.min(100, wife.relationship + 3); // Mutual trust deepens
      wife.mood = 'adventurous';

      // Unlock 40% discount for charismatic male model / talent
      const maleTalents = (state.talent || []).filter(t => t.gender === 'male');
      const candidate = maleTalents[Math.floor(Math.random() * maleTalents.length)];
      if (candidate && !wife.unlockedTalentDiscounts.includes(candidate.id)) {
        wife.unlockedTalentDiscounts.push(candidate.id);
      }

      resMsg = `You discussed the evening with mutual security and warmth. Openness rose to ${wife.openness}/100. Through ${evt.companionName}'s inner network, she unlocked a 40% exclusive recruitment discount for ${candidate ? candidate.name : 'top male talent'}!`;

      wife.careerHistory.unshift({
        day: state.clock.day,
        date: state.clock.formattedDate,
        roleId: wife.currentRoleId,
        roleName: wife.currentRole,
        title: 'High-Society Networking',
        description: `Attended private gathering at ${evt.venueName} with ${evt.companionName}. Mutual openness embraced (+10 Openness, Male Talent Discount unlocked).`
      });

    } else if (choiceId === 'object') {
      // 2. CONFRONT & OBJECT TO HOTEL SIGHTINGS
      // "If openness is low and she is caught, the relationship drops hard and divorce becomes possible."
      // "Openness rises when you forgive and falls when you object or punish."
      wife.openness = Math.max(5, wife.openness - 12);

      let relPenalty = 14;
      if (wife.openness < 25) relPenalty = 22; // Low openness friction hits hard

      wife.relationship = Math.max(10, wife.relationship - relPenalty);
      wife.mood = 'frustrated';

      resMsg = `You confronted ${wife.name} firmly regarding late-night hotel suites. She agreed to withdraw from high-society nightlife, but marital tension mounted (-${relPenalty}% Relationship, -12 Openness).`;

      if (wife.relationship < 25) {
        resMsg += ` ⚠️ MARITAL CRISIS: Trust has dropped critically low! Reconcile immediately before legal separation is initiated.`;
      }

      wife.careerHistory.unshift({
        day: state.clock.day,
        date: state.clock.formattedDate,
        roleId: wife.currentRoleId,
        roleName: wife.currentRole,
        title: 'Marital Confrontation',
        description: `Confronted over ${evt.venueName} late-night rendezvous. Social boundaries reinforced (-12 Openness, -${relPenalty}% Trust).`
      });

    } else if (choiceId === 'pr_cleanup') {
      // 3. CRISIS PR CLEANUP
      const prCost = 250000;
      if (state.player.cash < prCost && state.studio.cash < prCost) {
        return { success: false, error: `Requires ${formatRupees(prCost)} for tabloid crisis management.` };
      }

      if (state.player.cash >= prCost) state.player.cash -= prCost;
      else state.studio.cash -= prCost;

      state.studio.reputation = Math.min(100, state.studio.reputation + 2);
      wife.relationship = Math.min(100, wife.relationship + 1);

      resMsg = `Your studio PR department bought out the paparazzi photo reels for ${formatRupees(prCost)}, reframing the meeting as an upcoming cinema co-production consultation. Brand image fully preserved!`;

      wife.careerHistory.unshift({
        day: state.clock.day,
        date: state.clock.formattedDate,
        roleId: wife.currentRoleId,
        roleName: wife.currentRole,
        title: 'Tabloid PR Neutralized',
        description: `PR team neutralized media speculation from ${evt.venueName}. Brand reputation secured.`
      });
    }

    wife.pendingSocialEvent = null;
    return { success: true, message: resMsg };
  }

  /**
   * Expand Wife's Independent Business Enterprise (Section 3.15)
   */
  function investVenture(state, tier = 1) {
    ensureWifeState(state);
    const wife = state.wife;
    if (!wife.venture) {
      return { success: false, error: 'Wife does not have an active business enterprise. Advise her to become a Brand Founder!' };
    }

    const formatRupees = window.StudioGame.Systems.Finance.formatRupees;
    const tiers = [
      { tier: 1, cost: 2500000, valGain: 6500000, revGain: 120000, name: 'Boutique Flagship Store Launch' },
      { tier: 2, cost: 10000000, valGain: 28000000, revGain: 500000, name: 'Pan-India Retail & E-Commerce Expansion' }
    ];

    const plan = tiers[tier - 1] || tiers[0];
    if (state.player.cash < plan.cost && state.studio.cash < plan.cost) {
      return { success: false, error: `Requires ${formatRupees(plan.cost)} personal or studio capital.` };
    }

    if (state.player.cash >= plan.cost) state.player.cash -= plan.cost;
    else state.studio.cash -= plan.cost;

    wife.venture.valuation += plan.valGain;
    wife.venture.monthlyRevenue += plan.revGain;
    wife.skills.business = Math.min(100, wife.skills.business + 8);
    wife.relationship = Math.min(100, wife.relationship + 5);
    wife.netWorth += Math.round(plan.valGain * 0.70);

    const desc = `Injected ${formatRupees(plan.cost)} co-founder capital into ${wife.venture.name} (${plan.name}). Enterprise valuation surged to ${formatRupees(wife.venture.valuation)}!`;

    wife.careerHistory.unshift({
      day: state.clock.day,
      date: state.clock.formattedDate,
      roleId: wife.currentRoleId,
      roleName: wife.currentRole,
      title: `Venture Capital Injection: ${plan.name}`,
      description: desc
    });

    state.feed.unshift({
      id: 'evt_venture_' + Date.now(),
      day: state.clock.day,
      date: state.clock.formattedDate,
      category: 'Enterprise',
      title: `${wife.venture.name} Surges!`,
      body: desc,
      icon: '📈'
    });

    return { success: true, message: desc, newDailyVal: wife.venture.valuation };
  }

  /**
   * Float Wife's Brand on Dalal Street Exchange (IPO) (Section 3.15)
   */
  function floatVentureIPO(state) {
    ensureWifeState(state);
    const wife = state.wife;
    if (!wife.venture) {
      return { success: false, error: 'No registered corporate enterprise to take public.' };
    }
    if (wife.venture.isPublic) {
      return { success: false, error: `${wife.venture.name} is already listed on Dalal Street.` };
    }
    if (wife.venture.valuation < 150000000) {
      return {
        success: false,
        error: `SEBI IPO listing criteria requires minimum ₹15 Cr enterprise valuation (Current: ${window.StudioGame.Systems.Finance.formatRupees(wife.venture.valuation)}). Invest more capital first!`
      };
    }

    const formatRupees = window.StudioGame.Systems.Finance.formatRupees;
    const ipoWindfall = Math.round(wife.venture.valuation * 0.45); // 45% cashout via public float
    wife.venture.isPublic = true;
    wife.venture.sharesOwnedPct = 55;
    wife.netWorth += ipoWindfall;
    state.studio.cash += Math.round(ipoWindfall * 0.20); // Studio co-founder payout

    const desc = `🔔 RINGING THE BELL: ${wife.venture.name} successfully listed on Dalal Street! Public offering delivered an instant ${formatRupees(ipoWindfall)} windfall to ${wife.name}'s net worth and +${formatRupees(Math.round(ipoWindfall * 0.20))} co-founder dividend to the studio!`;

    wife.careerHistory.unshift({
      day: state.clock.day,
      date: state.clock.formattedDate,
      roleId: wife.currentRoleId,
      roleName: wife.currentRole,
      title: `Dalal Street IPO: ${wife.venture.name}`,
      description: desc
    });

    state.feed.unshift({
      id: 'evt_ipo_wife_' + Date.now(),
      day: state.clock.day,
      date: state.clock.formattedDate,
      category: 'Dalal Street IPO',
      title: `Dalal Street Bells: ${wife.venture.name} Goes Public!`,
      body: desc,
      icon: '🔔'
    });

    return { success: true, message: desc, windfall: ipoWindfall };
  }

  /**
   * Interactive Heart-to-Heart Consultations & Romantic Talk
   */
  function interactWithWife(state, actionType) {
    ensureWifeState(state);
    const wife = state.wife;
    const formatRupees = window.StudioGame.Systems.Finance.formatRupees;

    switch (actionType) {
      case 'talk_career': {
        const role = getRoleById(wife.currentRoleId);
        wife.relationship = Math.min(100, wife.relationship + 2);
        return {
          success: true,
          title: "Career & Ambitions Discussion",
          message: `Rhea smiled and shared her perspective: "In my role as ${role.name}, I feel my ${role.primarySkill} skills are growing every single week. With our studio climbing the charts, I'm ambitious to achieve even greater industry stature!"`
        };
      }

      case 'talk_marriage': {
        wife.relationship = Math.min(100, wife.relationship + 3);
        wife.mood = 'loving';
        wife.lastRomanticDay = state.clock.day;
        return {
          success: true,
          title: "Intimate Heart-to-Heart",
          message: `You spent an hour reminiscing over your early days in Mumbai before the fame. Rhea held your hand tightly: "No matter how turbulent the film industry gets, Kabir, we built this dream together. You will always be my rock."`
        };
      }

      case 'talk_studio': {
        const cashFmt = formatRupees(state.studio.cash);
        const projCount = state.studio.projects.length;
        wife.relationship = Math.min(100, wife.relationship + 2);
        return {
          success: true,
          title: "Executive Studio Consultation",
          message: `Rhea analyzed the studio balance sheet: "We currently command ${cashFmt} in liquid reserves with ${projCount} active productions on the floor. My recommendation: prioritize star-driven high-budget releases that command top OTT streaming rights!"`
        };
      }

      case 'talk_openness': {
        return {
          success: true,
          title: "High-Society & Social Life Discussion",
          message: `Rhea spoke openly about Mumbai's high-society cinema circles: "At ${wife.openness}/100 Openness, I value having creative freedom and rubbing shoulders with top directors and international fashion icons. It brings immense influence and talent discounts to our studio."`
        };
      }

      case 'grand_apology': {
        const cost = 1500000; // 15 Lakhs for luxury diamond reconciliation
        if (state.player.cash < cost) {
          return { success: false, error: `A heartfelt grand reconciliation requires ${formatRupees(cost)} for bespoke Cartier jewelry and private retreat.` };
        }
        state.player.cash -= cost;
        wife.relationship = Math.min(100, wife.relationship + 28);
        wife.mood = 'loving';
        wife.lastRomanticDay = state.clock.day;

        const msg = `You surprised Rhea with a bespoke Cartier diamond necklace and a sincere apology, committing to honor her feelings. Her eyes softened with tears: "Thank you for hearing me, Kabir. Let's leave the bitterness behind." (Trust rose to ${Math.round(wife.relationship)}%, Marital Crisis resolved!)`;

        wife.careerHistory.unshift({
          day: state.clock.day,
          date: state.clock.formattedDate,
          roleId: wife.currentRoleId,
          roleName: wife.currentRole,
          title: 'Marital Reconciliation',
          description: `Surprise Cartier diamond reconciliation. Trust and emotional closeness restored (+28% Trust).`
        });

        return { success: true, message: msg };
      }

      default:
        return { success: false, error: 'Unknown interaction.' };
    }
  }

  /**
   * Daily tick for wife:
   * - Daily income accretion (pro-rated monthly salary / 30)
   * - Natural relationship dynamics (devotion vs neglect cooling)
   * - Experience progression in her field
   * - Enterprise growth & dividends
   * - Periodic autonomous evaluation, outside offers & social encounters
   */
  function dailyTick(state) {
    ensureWifeState(state);
    const wife = state.wife;
    const currentRole = getRoleById(wife.currentRoleId);

    // 1. Daily salary / earnings accretion
    const dailyIncome = currentRole.monthlySalary / 30;
    if (dailyIncome > 0) {
      wife.netWorth += dailyIncome;
      wife.careerEarningsTotal += dailyIncome;

      // Studio executive salaries paid by studio
      if (currentRole.category === 'Studio Executive') {
        state.studio.cash = Math.max(0, state.studio.cash - dailyIncome);
      }
    }

    // 2. Venture enterprise daily dividend if Brand Founder
    if (wife.venture) {
      const dailyDividend = Math.round(wife.venture.monthlyRevenue / 30);
      wife.netWorth += dailyDividend;
      wife.careerEarningsTotal += dailyDividend;
      wife.venture.dividendsPaidTotal = (wife.venture.dividendsPaidTotal || 0) + dailyDividend;

      if (wife.venture.isPublic) {
        // Co-founder studio payout
        state.studio.cash += Math.round(dailyDividend * 0.35);
      }
    }

    // 3. Experience progression in primary skill (+0.10 per day)
    if (currentRole.primarySkill && wife.skills[currentRole.primarySkill] !== undefined) {
      wife.skills[currentRole.primarySkill] = Math.min(100, +(wife.skills[currentRole.primarySkill] + 0.10).toFixed(2));
    }

    // 4. Natural relationship dynamics & neglect drift
    const daysSinceDate = state.clock.day - (wife.lastRomanticDay || 1);
    if (daysSinceDate > 35) {
      // Neglected: slow emotional cooling (-0.08 per day)
      wife.relationship = Math.max(10, +(wife.relationship - 0.08).toFixed(2));
      if (wife.relationship < 40) wife.mood = 'neglected';
      else wife.mood = 'pensive';
    } else if (wife.relationship >= 85) {
      wife.mood = 'loving';
    }

    // 5. Nudge countdown
    if (wife.nudgeDaysRemaining > 0) {
      wife.nudgeDaysRemaining -= 1;
      if (wife.nudgeDaysRemaining === 0) {
        wife.nudgeRole = null;
      }
    }

    // 6. Fitness slow decay if neglected (-0.02 every day)
    wife.fitness = Math.max(40, +(wife.fitness - 0.02).toFixed(2));

    // 7. Check for outside job offers (every 35-50 days)
    checkOutsideOffers(state);

    // 8. Check for high-society social encounters (every 45-70 days)
    checkSocialEncounters(state);

    // 9. Periodic spontaneous career evaluation (every 40-50 days)
    if (state.clock.day % 42 === 0) {
      evaluateCareer(state, false);
    }
  }

  /**
   * Player Nudge Action: Discuss career & advise her towards a specific field
   */
  function nudgeCareer(state, targetRoleId) {
    ensureWifeState(state);
    const targetRole = getRoleById(targetRoleId);
    state.wife.nudgeRole = targetRoleId;
    state.wife.nudgeDaysRemaining = 45; // Persists for 45 in-game days

    // Relationship bump for deep interest in her professional aspirations
    state.wife.relationship = Math.min(100, state.wife.relationship + 3);

    // Immediate soft evaluation check (she listens and weighs your proposal)
    const evalResult = evaluateCareer(state, true);

    return {
      success: true,
      role: targetRole,
      acceptedImmediately: evalResult && evalResult.changed,
      message: evalResult && evalResult.changed
        ? `${state.wife.name} loved your vision and immediately transitioned to ${targetRole.name}!`
        : `${state.wife.name} appreciates your guidance and will strongly consider ${targetRole.name} as new opportunities arise.`
    };
  }

  /**
   * Invest in Fitness & Radiance
   */
  function investFitness(state, tier = 1) {
    ensureWifeState(state);
    const options = [
      { tier: 1, cost: 35000, gain: 5, name: 'Boutique Reformer Pilates & Yoga Sanctuary' },
      { tier: 2, cost: 95000, gain: 11, name: 'Celebrity Strength Trainer & Organic Nutritionist' },
      { tier: 3, cost: 250000, gain: 20, name: 'VIP Swiss Wellness & Cellular Rejuvenation Retreat' }
    ];

    const plan = options[tier - 1] || options[0];
    if (state.player.cash < plan.cost) {
      return { success: false, error: 'Insufficient liquid personal cash.' };
    }

    state.player.cash -= plan.cost;
    state.wife.fitness = Math.min(100, +(state.wife.fitness + plan.gain).toFixed(1));
    state.wife.relationship = Math.min(100, +(state.wife.relationship + 2).toFixed(1));
    state.wife.skills.glamour = Math.min(100, +(state.wife.skills.glamour + (plan.gain * 0.45)).toFixed(1));
    state.wife.lastRomanticDay = state.clock.day;

    state.feed.unshift({
      id: 'evt_fit_' + Date.now(),
      day: state.clock.day,
      date: state.clock.formattedDate,
      category: 'Lifestyle',
      title: 'Fitness & Radiance Investment',
      body: `You enrolled ${state.wife.name} in ${plan.name}. Fitness rose to ${Math.round(state.wife.fitness)}%.`,
      icon: '🏋️‍♀️'
    });

    return {
      success: true,
      newFitness: state.wife.fitness,
      cost: plan.cost,
      planName: plan.name
    };
  }

  /**
   * Date Night & Luxury Romantic Gestures
   */
  function dateNight(state, tier = 1) {
    ensureWifeState(state);
    const options = [
      { tier: 1, cost: 20000, gain: 4, name: 'Candlelight Dinner at Taj Sea Lounge' },
      { tier: 2, cost: 85000, gain: 9, name: 'Haute Couture Handbag & Private Spa Afternoon' },
      { tier: 3, cost: 250000, gain: 18, name: 'Private Luxury Charter Yacht in Goa' }
    ];

    const plan = options[tier - 1] || options[0];
    if (state.player.cash < plan.cost) {
      return { success: false, error: 'Insufficient liquid personal cash.' };
    }

    state.player.cash -= plan.cost;
    state.wife.relationship = Math.min(100, +(state.wife.relationship + plan.gain).toFixed(1));
    state.wife.mood = 'loving';
    state.wife.lastRomanticDay = state.clock.day;

    state.feed.unshift({
      id: 'evt_date_' + Date.now(),
      day: state.clock.day,
      date: state.clock.formattedDate,
      category: 'Family',
      title: 'Romantic Evening',
      body: `You treated ${state.wife.name} to ${plan.name}. Marital trust rose to ${Math.round(state.wife.relationship)}%.`,
      icon: '🥂'
    });

    return {
      success: true,
      newRelationship: state.wife.relationship,
      cost: plan.cost,
      planName: plan.name
    };
  }

  return {
    getRoles,
    getRoleById,
    ensureWifeState,
    evaluateCareer,
    dailyTick,
    nudgeCareer,
    checkOutsideOffers,
    acceptOutsideOffer,
    declineOutsideOffer,
    checkSocialEncounters,
    resolveSocialEvent,
    investVenture,
    floatVentureIPO,
    interactWithWife,
    investFitness,
    dateNight
  };
})();
