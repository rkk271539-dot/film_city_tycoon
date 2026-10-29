/**
 * Wife Career, Autonomous Decision Engine & Social Action System
 * Simulates independent agency, autonomous career transitions, skill progression,
 * player nudges, fitness investments, and studio departmental perks.
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
      monthlySalary: 120000,
      primarySkill: 'creative',
      studioPerk: '+10% Script Quality on all studio projects',
      perkType: 'script_quality',
      perkValue: 1.10
    },
    {
      id: 'studio_marketing_head',
      name: 'Studio Marketing Head',
      category: 'Studio Executive',
      icon: '📣',
      description: 'Drives film publicity, teaser campaigns, and media buzz for your studio.',
      monthlySalary: 130000,
      primarySkill: 'business',
      studioPerk: '+12% Marketing Hype & Box Office buzz',
      perkType: 'marketing_hype',
      perkValue: 1.12
    },
    {
      id: 'studio_casting_head',
      name: 'Studio Head of Casting',
      category: 'Studio Executive',
      icon: '🌟',
      description: 'Scouts emerging talent and negotiates contract terms with agency managers.',
      monthlySalary: 110000,
      primarySkill: 'business',
      studioPerk: '-10% Talent Contract costs for the studio',
      perkType: 'talent_discount',
      perkValue: 0.90
    },
    {
      id: 'studio_finance_head',
      name: 'Studio Chief of Finance',
      category: 'Studio Executive',
      icon: '📊',
      description: 'Maintains financial discipline, audits equipment rentals, and curtails wasteful spending.',
      monthlySalary: 140000,
      primarySkill: 'business',
      studioPerk: '-15% Daily Studio Overheads & Utility Bills',
      perkType: 'overhead_cut',
      perkValue: 0.85
    },
    {
      id: 'independent_actress',
      name: 'Independent Actress',
      category: 'Entertainment',
      icon: '🎭',
      description: 'Auditions for films, web series, and major TV commercials across Mumbai.',
      monthlySalary: 250000,
      primarySkill: 'acting',
      studioPerk: 'High industry visibility & VIP party invites'
    },
    {
      id: 'high_fashion_model',
      name: 'High-Fashion Model',
      category: 'Glamour',
      icon: '👠',
      description: 'Walks Fashion Week runways and signs luxury brand ambassador contracts.',
      monthlySalary: 200000,
      primarySkill: 'glamour',
      studioPerk: 'Builds elite fashion connections and celebrity goodwill'
    },
    {
      id: 'independent_producer',
      name: 'Independent Film Producer',
      category: 'Production',
      icon: '🎬',
      description: 'Develops festival features and streaming series through third-party backing.',
      monthlySalary: 180000,
      primarySkill: 'creative',
      studioPerk: 'Deep network of distributors and streaming platform heads'
    },
    {
      id: 'brand_founder',
      name: 'Beauty & Lifestyle Brand Founder',
      category: 'Entrepreneurship',
      icon: '💎',
      description: 'Runs her own designer cosmetics and organic skincare enterprise.',
      monthlySalary: 300000,
      primarySkill: 'business',
      studioPerk: 'Independent corporate prestige and venture expansion'
    },
    {
      id: 'private_investor',
      name: 'Private Angel Investor',
      category: 'Finance',
      icon: '📈',
      description: 'Allocates capital into media-tech startups and cinematic exhibition chains.',
      monthlySalary: 220000,
      primarySkill: 'business',
      studioPerk: 'Quarterly investment dividends and Dalal Street tips'
    },
    {
      id: 'creative_sabbatical',
      name: 'Creative Sabbatical',
      category: 'Personal',
      icon: '☕',
      description: 'Taking time off to recharge, study world cinema, and focus on personal wellness.',
      monthlySalary: 0,
      primarySkill: 'creative',
      studioPerk: 'Deepened domestic intimacy and higher emotional recharge'
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
    if (!state.wife.skills) {
      state.wife.skills = {
        acting: 28,
        glamour: 42,
        business: 45,
        creative: 50
      };
    }
    if (!state.wife.currentRoleId) {
      state.wife.currentRoleId = 'studio_creative_head';
      state.wife.currentRole = getRoleById('studio_creative_head').name;
    }
    if (state.wife.nudgeRole === undefined) state.wife.nudgeRole = null;
    if (state.wife.nudgeDaysRemaining === undefined) state.wife.nudgeDaysRemaining = 0;
    if (!state.wife.careerHistory) {
      state.wife.careerHistory = [
        {
          day: 1,
          date: state.clock.formattedDate || '01 Jan 2026',
          roleId: state.wife.currentRoleId,
          roleName: state.wife.currentRole,
          title: 'Appointed Studio Creative Head',
          description: `Joined ${state.studio.name || 'the studio'} to spearhead storytelling and script quality.`
        }
      ];
    }
    if (state.wife.careerEarningsTotal === undefined) state.wife.careerEarningsTotal = 0;
    if (state.wife.lastDecisionDay === undefined) state.wife.lastDecisionDay = 1;
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
      score += skillScore * 0.8;

      // 2. Relationship impact
      // If relationship is very high, working in your studio is preferred
      const isStudioRole = role.category === 'Studio Executive';
      if (isStudioRole) {
        score += (wife.relationship - 50) * 0.6;
      } else {
        // High independence / high openness favors external roles
        score += (wife.openness) * 0.3;
      }

      // 3. Player Nudge / Influence Bonus
      if (wife.nudgeRole === role.id && wife.nudgeDaysRemaining > 0) {
        // High relationship makes her much more responsive to your advice
        const nudgePower = 25 + (wife.relationship * 0.25);
        score += nudgePower;
      }

      // 4. Inertia / loyalty to current role
      if (role.id === wife.currentRoleId) {
        score += 35; // People don't change careers every day
      }

      // 5. Random industry opportunity / market drift
      score += (Math.random() * 24 - 12);

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
        return "I want our studio to make meaningful cinematic masterpieces. I'm taking full charge of script development.";
      case 'studio_marketing_head':
        return "Hype is everything in cinema. I'm stepping up to handle our promotions and industry relations.";
      case 'studio_casting_head':
        return "I have a sharp eye for talent. Let me oversee our casting calls and agency bargaining.";
      case 'studio_finance_head':
        return "We need iron-clad discipline with our capital. I'll audit our daily overheads personally.";
      case 'independent_actress':
        return "A leading director offered me a compelling role. The camera is calling me, Kabir.";
      case 'high_fashion_model':
        return "Fashion Week is in full swing. I've signed with a top agency for high-fashion runway shows.";
      case 'independent_producer':
        return "I've secured third-party funding for a daring new indie web series.";
      case 'brand_founder':
        return "It's time to build my own legacy. I'm launching my luxury skincare and lifestyle label.";
      case 'private_investor':
        return "Cinema tech is booming. I'm investing in smart post-production and OTT ventures.";
      case 'creative_sabbatical':
        return "I need a brief respite to recharge, study cinema, and invest time in us.";
      default:
        return "I'm ready for the next exciting chapter in my career.";
    }
  }

  /**
   * Daily tick for wife:
   * - Daily income accretion (pro-rated monthly salary / 30)
   * - Experience progression in her field
   * - Studio perk deduction
   * - Periodic autonomous evaluation (every ~35 days)
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

      // If she is a studio executive, the salary is paid by studio cash
      if (currentRole.category === 'Studio Executive') {
        state.studio.cash = Math.max(0, state.studio.cash - dailyIncome);
      }
    }

    // 2. Experience progression in primary skill (+0.08 per day)
    if (currentRole.primarySkill && wife.skills[currentRole.primarySkill]) {
      wife.skills[currentRole.primarySkill] = Math.min(100, +(wife.skills[currentRole.primarySkill] + 0.08).toFixed(2));
    }

    // 3. Nudge countdown
    if (wife.nudgeDaysRemaining > 0) {
      wife.nudgeDaysRemaining -= 1;
      if (wife.nudgeDaysRemaining === 0) {
        wife.nudgeRole = null;
      }
    }

    // 4. Fitness slight decay if neglected (very slow, -0.02 every day)
    wife.fitness = Math.max(40, +(wife.fitness - 0.02).toFixed(2));

    // 5. Periodic spontaneous career evaluation (every 40-50 days)
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

    // Small relationship bump for showing deep interest in her professional aspirations
    state.wife.relationship = Math.min(100, state.wife.relationship + 2);

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
   * Invest in Fitness & Beauty
   */
  function investFitness(state, tier = 1) {
    ensureWifeState(state);
    const options = [
      { tier: 1, cost: 25000, gain: 4, name: 'Boutique Pilates & Yoga Studio' },
      { tier: 2, cost: 75000, gain: 9, name: 'Celebrity Fitness Trainer & Nutritionist' },
      { tier: 3, cost: 200000, gain: 18, name: 'VIP Swiss Wellness & Beauty Retreat' }
    ];

    const plan = options[tier - 1] || options[0];
    if (state.player.cash < plan.cost) {
      return { success: false, error: 'Insufficient liquid personal cash.' };
    }

    state.player.cash -= plan.cost;
    state.wife.fitness = Math.min(100, +(state.wife.fitness + plan.gain).toFixed(1));
    state.wife.relationship = Math.min(100, +(state.wife.relationship + 1).toFixed(1));

    // Glamour skill rises alongside fitness
    state.wife.skills.glamour = Math.min(100, +(state.wife.skills.glamour + (plan.gain * 0.4)).toFixed(1));

    state.feed.unshift({
      id: 'evt_fit_' + Date.now(),
      day: state.clock.day,
      date: state.clock.formattedDate,
      category: 'Lifestyle',
      title: 'Fitness & Beauty Investment',
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
   * Date Night & Luxury Gift Action
   */
  function dateNight(state, tier = 1) {
    ensureWifeState(state);
    const options = [
      { tier: 1, cost: 15000, gain: 3, name: 'Candlelight Dinner at Taj Sea Lounge' },
      { tier: 2, cost: 60000, gain: 7, name: 'Designer Handbag & Spa Afternoon' },
      { tier: 3, cost: 180000, gain: 14, name: 'Private Charter Yacht in Goa' }
    ];

    const plan = options[tier - 1] || options[0];
    if (state.player.cash < plan.cost) {
      return { success: false, error: 'Insufficient liquid personal cash.' };
    }

    state.player.cash -= plan.cost;
    state.wife.relationship = Math.min(100, +(state.wife.relationship + plan.gain).toFixed(1));

    state.feed.unshift({
      id: 'evt_date_' + Date.now(),
      day: state.clock.day,
      date: state.clock.formattedDate,
      category: 'Family',
      title: 'Romantic Evening',
      body: `You treated ${state.wife.name} to ${plan.name}. Relationship trust rose to ${Math.round(state.wife.relationship)}%.`,
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
    investFitness,
    dateNight
  };
})();
