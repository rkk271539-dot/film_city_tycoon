/**
 * Studios & Rival AI Simulation Engine
 * Manages the 25 Indian Legacy Studios and 10 Dynamic Talent Unicorn Studios,
 * autonomous greenlighting and production pipelines, procedural 400+ combinatorial 3-4 word film titles,
 * dynamic theatrical and OTT box office runs, All-Time Top 5 hits tracking, bankruptcies, replacements, and diplomacy.
 */

window.StudioGame = window.StudioGame || {};
window.StudioGame.Systems = window.StudioGame.Systems || {};

window.StudioGame.Systems.Studios = (function() {
  /**
   * Rich combinatorial pools for procedural 3-4 word Pan-India titles (over 50,000+ unique combinations)
   */
  const TitlePools = {
    prefixes: [
      'The Deadly', 'Grand', 'Secret', 'Royal', 'Sultan of', 'King of', 'Legend of',
      'Rise of', 'Blood of', 'Mission', 'Mumbai', 'Delhi', 'Deccan', 'Untamed',
      'Fearless', 'Savage', 'Shadow', 'Silent', 'Eternal', 'Rebel', 'Tiger',
      'Iron', 'Crimson', 'Golden', 'Dark', 'Bullet', 'Thunder', 'Destiny',
      'Fire', 'Outlaw', 'Phantom', 'Final', 'Supreme', 'Sovereign', 'Kaal',
      'Urban', 'Midnight', 'Raw', 'Immortal', 'Undercover', 'Vanguard', 'Rogue', 'Apex',
      'Wild', 'Brahm'
    ],
    nouns: [
      'Underworld', 'Empire', 'Dynasty', 'Syndicate', 'Force', 'Vengeance', 'Hunter',
      'Warrior', 'Storm', 'Don', 'Frontier', 'Bullet', 'Verdict', 'Throne',
      'Legacy', 'Conspiracy', 'Monsoon', 'Heartbeat', 'Falcon', 'Citadel', 'Tiger',
      'Cobra', 'Sultan', 'Panther', 'Renegade', 'Chaser', 'Mirage', 'Target',
      'Command', 'Matrix', 'Horizon', 'Inferno', 'Vanguard', 'Phoenix', 'Fortress',
      'Odyssey', 'Havoc', 'Eclipse', 'Dominion', 'Crusade', 'Reckoning', 'Godfather',
      'Kingdom', 'Strike', 'Order'
    ],
    modifiers: [
      'Reborn', 'Unleashed', 'Strikes Back', 'Rising', 'Chapter 2', 'War Cry',
      'Bloodline', 'Revolution', 'Infiltration', 'Retribution', 'Reloaded',
      'The Awakening', 'Operation Red', 'Final Stand', 'High Stakes', 'Zero Hour',
      'Redux', 'Lockdown', 'The Return', 'Judgement Day', 'Last Stand',
      'Beyond Borders', 'Dark Dawn', 'Code Red', 'No Mercy', 'Endgame',
      'Crossfire', 'Resurgence', 'Strike Force', 'Undercover', 'Uncensored',
      'Protocol', 'Blitzkrieg', 'Showdown', 'Nemesis', 'Dominance', 'Retaliation',
      'In Blood', 'Vengeance'
    ],
    seriesSubtitles: [
      'The Investigation', 'Classified Files', 'The Syndicate Tapes', 'Special Ops',
      'Dark Network', 'The Heist', 'Unsolved Mystery', 'Underbelly Chronicles'
    ]
  };

  /**
   * Starter Top 5 Blockbuster Records for Iconic Indian Legacy Studios
   */
  const StarterTopProjects = {
    studio_yrf: [
      { title: 'Pathaan: Shadow Protocol', format: 'Theatrical Pan-India Tentpole', stars: ['Shah Rukh Mir', 'Deepika Sen'], director: 'Siddharth Anand', boxOfficeGross: 10500000000, budget: 2500000000, verdict: 'All-Time Blockbuster', year: 2023 },
      { title: 'Tiger: Sovereign Frontier', format: 'Theatrical Feature Film', stars: ['Salman Qureshi', 'Katrina Rai'], director: 'Maneesh Sharma', boxOfficeGross: 6200000000, budget: 3000000000, verdict: 'All-Time Blockbuster', year: 2023 },
      { title: 'Sultan: Grand Ring', format: 'Theatrical Feature Film', stars: ['Salman Qureshi', 'Anushka Sen'], director: 'Ali Abbas Zafar', boxOfficeGross: 5800000000, budget: 1450000000, verdict: 'All-Time Blockbuster', year: 2016 },
      { title: 'Dhoom 3: Final Stand', format: 'Theatrical Feature Film', stars: ['Aamir Farooqi', 'Katrina Rai'], director: 'Vijay Krishna', boxOfficeGross: 5500000000, budget: 1750000000, verdict: 'All-Time Blockbuster', year: 2013 },
      { title: 'War: Strike Force', format: 'Theatrical Pan-India Tentpole', stars: ['Hrithik Anand', 'Tiger Shirodkar'], director: 'Siddharth Anand', boxOfficeGross: 4750000000, budget: 1500000000, verdict: 'Blockbuster', year: 2019 }
    ],
    studio_dharma: [
      { title: 'Brahmāstra: Dev Rising', format: 'Theatrical Pan-India Tentpole', stars: ['Ranbir Dev', 'Alia Kapoor'], director: 'Ayan Mukerji', boxOfficeGross: 4300000000, budget: 4000000000, verdict: 'Blockbuster', year: 2022 },
      { title: 'Simmba: Roar of Justice', format: 'Theatrical Feature Film', stars: ['Ranveer Bajwa', 'Sara Ali'], director: 'Rohit Shetty', boxOfficeGross: 4000000000, budget: 1100000000, verdict: 'Blockbuster', year: 2018 },
      { title: 'Rocky Rani: Prem Kahaani', format: 'Theatrical Feature Film', stars: ['Ranveer Bajwa', 'Alia Kapoor'], director: 'Karan Johar', boxOfficeGross: 3550000000, budget: 1600000000, verdict: 'Super Hit', year: 2023 },
      { title: 'Yeh Jawaani Hai Deewani', format: 'Theatrical Feature Film', stars: ['Ranbir Dev', 'Deepika Sen'], director: 'Ayan Mukerji', boxOfficeGross: 3200000000, budget: 750000000, verdict: 'Super Hit', year: 2013 },
      { title: 'Agneepath: Vengeance Unleashed', format: 'Theatrical Feature Film', stars: ['Hrithik Anand', 'Sanjay Dutt'], director: 'Karan Malhotra', boxOfficeGross: 2100000000, budget: 850000000, verdict: 'Super Hit', year: 2012 }
    ],
    studio_tseries: [
      { title: 'Animal: Instincts Unleashed', format: 'Theatrical Pan-India Tentpole', stars: ['Ranbir Dev', 'Tripti Dimri'], director: 'Sandeep Vanga', boxOfficeGross: 9170000000, budget: 2000000000, verdict: 'All-Time Blockbuster', year: 2023 },
      { title: 'Saaho: Underworld Syndicate', format: 'Theatrical Feature Film', stars: ['Prabhas Raju', 'Shraddha Kapoor'], director: 'Sujeeth', boxOfficeGross: 4300000000, budget: 3500000000, verdict: 'Blockbuster', year: 2019 },
      { title: 'Kabir Singh: Fire Heart', format: 'Theatrical Feature Film', stars: ['Shahid Kapoor', 'Kiara Advani'], director: 'Sandeep Vanga', boxOfficeGross: 3800000000, budget: 600000000, verdict: 'Blockbuster', year: 2019 },
      { title: 'Tanhaji: The Unsung Warrior', format: 'Theatrical Feature Film', stars: ['Ajay Devgan-Rao', 'Saif Ali'], director: 'Om Raut', boxOfficeGross: 3680000000, budget: 1250000000, verdict: 'Blockbuster', year: 2020 },
      { title: 'Bhool Bhulaiyaa 2 Reborn', format: 'Theatrical Feature Film', stars: ['Kartik Aaryan', 'Kiara Advani'], director: 'Anees Bazmee', boxOfficeGross: 2660000000, budget: 750000000, verdict: 'Super Hit', year: 2022 }
    ],
    studio_redchillies: [
      { title: 'Jawan: Final Reckoning', format: 'Theatrical Pan-India Tentpole', stars: ['Shah Rukh Mir', 'Nayanthara Kurian'], director: 'Atlee Kumar', boxOfficeGross: 11500000000, budget: 3000000000, verdict: 'All-Time Blockbuster', year: 2023 },
      { title: 'Dunki: Long Journey', format: 'Theatrical Feature Film', stars: ['Shah Rukh Mir', 'Taapsee Pannu'], director: 'Rajkumar Hirani', boxOfficeGross: 4700000000, budget: 1200000000, verdict: 'Blockbuster', year: 2023 },
      { title: 'Chennai Express: High Speed', format: 'Theatrical Feature Film', stars: ['Shah Rukh Mir', 'Deepika Sen'], director: 'Rohit Shetty', boxOfficeGross: 4230000000, budget: 1150000000, verdict: 'Blockbuster', year: 2013 },
      { title: 'Happy New Year: Grand Heist', format: 'Theatrical Feature Film', stars: ['Shah Rukh Mir', 'Deepika Sen'], director: 'Farah Khan', boxOfficeGross: 4000000000, budget: 1500000000, verdict: 'Blockbuster', year: 2014 },
      { title: 'Ra.One: Digital Avatar', format: 'Theatrical Feature Film', stars: ['Shah Rukh Mir', 'Kareena Kapoor'], director: 'Anubhav Sinha', boxOfficeGross: 2070000000, budget: 1300000000, verdict: 'Hit', year: 2011 }
    ],
    studio_hombale: [
      { title: 'K.G.F Chapter 2 Reborn', format: 'Theatrical Pan-India Tentpole', stars: ['Yash Rocky', 'Sanjay Dutt'], director: 'Prashanth Neel', boxOfficeGross: 12500000000, budget: 1000000000, verdict: 'All-Time Blockbuster', year: 2022 },
      { title: 'Salaar: Ceasefire Strikes Back', format: 'Theatrical Pan-India Tentpole', stars: ['Prabhas Raju', 'Prithviraj'], director: 'Prashanth Neel', boxOfficeGross: 7150000000, budget: 2700000000, verdict: 'All-Time Blockbuster', year: 2023 },
      { title: 'Kantara: The Divine Forest', format: 'Theatrical Feature Film', stars: ['Rishab Shetty', 'Sapthami'], director: 'Rishab Shetty', boxOfficeGross: 4500000000, budget: 160000000, verdict: 'All-Time Blockbuster', year: 2022 },
      { title: 'K.G.F Chapter 1 Rise', format: 'Theatrical Feature Film', stars: ['Yash Rocky', 'Srinidhi'], director: 'Prashanth Neel', boxOfficeGross: 2500000000, budget: 800000000, verdict: 'Blockbuster', year: 2018 },
      { title: 'Bagheera: The Dark Knight', format: 'Theatrical Feature Film', stars: ['Sriimurali', 'Rukmini'], director: 'Suri', boxOfficeGross: 850000000, budget: 350000000, verdict: 'Hit', year: 2024 }
    ],
    studio_mythri: [
      { title: 'Pushpa 2: The Rule', format: 'Theatrical Pan-India Tentpole', stars: ['Allu Arjun-Varma', 'Rashmika Mandanna'], director: 'Sukumar', boxOfficeGross: 14000000000, budget: 4500000000, verdict: 'All-Time Blockbuster', year: 2024 },
      { title: 'Pushpa: The Rise Force', format: 'Theatrical Pan-India Tentpole', stars: ['Allu Arjun-Varma', 'Samantha Prabhu'], director: 'Sukumar', boxOfficeGross: 3700000000, budget: 1700000000, verdict: 'Blockbuster', year: 2021 },
      { title: 'Waltair Veerayya: High Voltage', format: 'Theatrical Feature Film', stars: ['Chiranjeevi', 'Ravi Teja'], director: 'Bobby Kolli', boxOfficeGross: 2300000000, budget: 1400000000, verdict: 'Super Hit', year: 2023 },
      { title: 'Rangasthalam: Sound of Rebel', format: 'Theatrical Feature Film', stars: ['Ram Charan', 'Samantha Prabhu'], director: 'Sukumar', boxOfficeGross: 2160000000, budget: 600000000, verdict: 'Super Hit', year: 2018 },
      { title: 'Veera Simha Reddy Strike', format: 'Theatrical Feature Film', stars: ['Balakrishna', 'Shruti Haasan'], director: 'Gopichand', boxOfficeGross: 1350000000, budget: 800000000, verdict: 'Hit', year: 2023 }
    ],
    studio_lyca: [
      { title: '2.0: The Robot Reborn', format: 'Theatrical Pan-India Tentpole', stars: ['Rajinikanth Rao', 'Akshay Kumar'], director: 'S. Shankar', boxOfficeGross: 8000000000, budget: 5750000000, verdict: 'All-Time Blockbuster', year: 2018 },
      { title: 'Ponniyin Selvan: Chola Dynasty', format: 'Theatrical Feature Film', stars: ['Vikram', 'Aishwarya Rai'], director: 'Mani Ratnam', boxOfficeGross: 5000000000, budget: 2500000000, verdict: 'All-Time Blockbuster', year: 2022 },
      { title: 'Ponniyin Selvan 2 Rise', format: 'Theatrical Feature Film', stars: ['Karthi', 'Trisha'], director: 'Mani Ratnam', boxOfficeGross: 3500000000, budget: 2500000000, verdict: 'Super Hit', year: 2023 },
      { title: 'Darbar: Mumbai Police Don', format: 'Theatrical Feature Film', stars: ['Rajinikanth Rao', 'Nayanthara Kurian'], director: 'AR Murugadoss', boxOfficeGross: 2500000000, budget: 2000000000, verdict: 'Hit', year: 2020 },
      { title: 'Kaththi: Fight for Water', format: 'Theatrical Feature Film', stars: ['Vijay', 'Samantha Prabhu'], director: 'AR Murugadoss', boxOfficeGross: 1300000000, budget: 700000000, verdict: 'Super Hit', year: 2014 }
    ]
  };

  /**
   * Procedural Film & Web Series 3-4 word title generator (400+ distinct combinations)
   */
  function generateProceduralFilmTitle(genre = 'Action', format = 'film') {
    const p = TitlePools.prefixes[Math.floor(Math.random() * TitlePools.prefixes.length)];
    const n = TitlePools.nouns[Math.floor(Math.random() * TitlePools.nouns.length)];
    const m = TitlePools.modifiers[Math.floor(Math.random() * TitlePools.modifiers.length)];

    if (format === 'series' && Math.random() < 0.45) {
      const sub = TitlePools.seriesSubtitles[Math.floor(Math.random() * TitlePools.seriesSubtitles.length)];
      return `${n}: ${sub}`; // 3 to 4 words e.g. "Underworld: The Syndicate Tapes"
    }

    const pattern = Math.random();
    if (pattern < 0.40) {
      return `${p} ${n}: ${m}`; // 3-4 words e.g. "The Deadly Underworld: Syndicate Unleashed"
    } else if (pattern < 0.75) {
      return `${p} ${n} ${m}`; // 3-4 words e.g. "Grand Monsoon Retribution", "Untamed Tiger Strikes Back"
    } else {
      return `${n} Syndicate: ${m}`; // 3-4 words e.g. "Reckoning Syndicate: Strike Force"
    }
  }

  /**
   * Ensure studios state structure exists and initialize Top 5 Projects for all studios
   */
  function ensureStudiosState(state) {
    if (!state.studios) state.studios = {};

    if (!state.studios.legacy || state.studios.legacy.length === 0) {
      if (window.StudioGame.Data.Studios) {
        state.studios.legacy = JSON.parse(JSON.stringify(window.StudioGame.Data.Studios.legacyStudios));
      } else {
        state.studios.legacy = [];
      }
    }

    if (!state.studios.unicorns || state.studios.unicorns.length === 0) {
      if (window.StudioGame.Data.Studios) {
        state.studios.unicorns = JSON.parse(JSON.stringify(window.StudioGame.Data.Studios.initialUnicornStudios));
      } else {
        state.studios.unicorns = [];
      }
    }

    // Ensure pipeline and Top 5 projects list exists on every studio
    const allStudios = [...state.studios.legacy, ...state.studios.unicorns];
    allStudios.forEach(studio => {
      if (!studio.activeReleases) studio.activeReleases = [];
      if (!studio.inProduction) studio.inProduction = [];

      if (!studio.topProjects || studio.topProjects.length === 0) {
        if (StarterTopProjects[studio.id]) {
          studio.topProjects = JSON.parse(JSON.stringify(StarterTopProjects[studio.id]));
        } else {
          // Generate 5 authentic historic starter blockbusters for this studio
          studio.topProjects = generateStarterTopProjects(studio, state);
        }
      }
    });
  }

  /**
   * Generate authentic starter top 5 projects for studios without explicit presets
   */
  function generateStarterTopProjects(studio, state) {
    const projects = [];
    const nw = studio.netWorth || 2500000000;
    const baseRecord = studio.boxOfficeRecord || Math.round(nw * 0.7);

    const starsAvailable = (studio.contractedStars && studio.contractedStars.length > 0)
      ? studio.contractedStars
      : [studio.founder || studio.founderName || 'Industry Headliner'];

    const verdicts = ['All-Time Blockbuster', 'Blockbuster', 'Super Hit', 'Super Hit', 'Hit'];
    const multipliers = [1.0, 0.72, 0.52, 0.38, 0.28];

    for (let i = 0; i < 5; i++) {
      const gross = Math.round(baseRecord * multipliers[i]);
      const budget = Math.round(gross * (0.32 + Math.random() * 0.15));
      const year = 2025 - (i * 2);

      projects.push({
        title: generateProceduralFilmTitle(studio.signatureGenres?.[0] || 'Drama', i === 4 ? 'series' : 'film'),
        format: i === 4 ? 'OTT Premium Web Series' : (i === 0 ? 'Theatrical Pan-India Tentpole' : 'Theatrical Feature Film'),
        stars: [starsAvailable[i % starsAvailable.length], 'Ensemble Cast'],
        director: 'Ace Filmmaker',
        boxOfficeGross: gross,
        budget: budget,
        verdict: verdicts[i],
        year: year
      });
    }

    return projects;
  }

  /**
   * Daily turn simulation for rival studios and dynamic unicorns
   */
  function dailyTick(state) {
    ensureStudiosState(state);

    const allStudios = [...state.studios.legacy, ...state.studios.unicorns];

    // 1. Advance active theatrical and OTT releases
    allStudios.forEach(studio => {
      tickStudioFilms(state, studio);
    });

    // 2. Advance projects in production
    allStudios.forEach(studio => {
      tickStudioProduction(state, studio);
    });

    // 3. Autonomous Greenlighting Engine:
    // Staggered checks allow studios to realistically greenlight films & web series
    if (state.clock.day % 4 === 0) {
      runAutonomousGreenlightCycle(state);
    }

    // 4. Dynamic Unicorn studios ranking & liquidation checks (every 15 days)
    if (state.clock.day % 15 === 0) {
      evaluateUnicornDynamics(state);
    }
  }

  /**
   * Progress studio active theatrical & OTT releases
   */
  function tickStudioFilms(state, studio) {
    if (!studio.activeReleases || studio.activeReleases.length === 0) return;

    for (let idx = studio.activeReleases.length - 1; idx >= 0; idx--) {
      const film = studio.activeReleases[idx];

      // Daily portion of weekly gross
      const dailyGross = Math.round(film.weeklyGross / 7);
      film.totalGross = (film.totalGross || 0) + dailyGross;
      studio.cash += Math.round(dailyGross * 0.45); // 45% distributor share

      // Weekly box office transition
      if (state.clock.day % 7 === 0) {
        film.week += 1;
        // Box office decay
        film.weeklyGross = Math.round(film.weeklyGross * (0.50 + Math.random() * 0.22));

        if (film.week > 5 || film.weeklyGross < 4000000) {
          // Theatrical or streaming run wraps!
          wrapRivalFilm(state, studio, film, idx);
        }
      }
    }
  }

  /**
   * Conclude a film or series run, record verdict, update top projects, and impact stock price
   */
  function wrapRivalFilm(state, studio, film, idx) {
    studio.activeReleases.splice(idx, 1);
    studio.filmsCount = (studio.filmsCount || 0) + 1;

    // Theatrical & OTT trade verdict
    let verdict = 'Hit';
    if (film.totalGross >= 500000000) verdict = 'All-Time Blockbuster';
    else if (film.totalGross >= 250000000) verdict = 'Blockbuster';
    else if (film.totalGross >= 120000000) verdict = 'Super Hit';
    else if (film.totalGross >= 60000000) verdict = 'Hit';
    else if (film.totalGross >= 35000000) verdict = 'Average';
    else if (film.totalGross >= 15000000) verdict = 'Flop';
    else verdict = 'Disaster';

    // OTT streaming licensing windfall
    const ottWindfall = Math.round(film.totalGross * 0.35);
    studio.cash += ottWindfall;
    studio.netWorth += Math.round(ottWindfall * 0.75);

    // Update Studio All-Time Top 5 Projects Hall of Fame
    studio.topProjects = studio.topProjects || [];
    const newEntry = {
      title: film.title,
      format: film.format || 'Theatrical Feature Film',
      stars: film.stars || (studio.contractedStars && studio.contractedStars.length ? [studio.contractedStars[0]] : ['Ensemble Cast']),
      director: film.director || 'Ace Director',
      boxOfficeGross: film.totalGross,
      budget: film.budget || Math.round(film.totalGross * 0.4),
      verdict: verdict,
      year: 2026 + Math.floor(state.clock.day / 365),
      completedDay: state.clock.day
    };

    studio.topProjects.push(newEntry);
    studio.topProjects.sort((a, b) => b.boxOfficeGross - a.boxOfficeGross);
    if (studio.topProjects.length > 5) {
      studio.topProjects = studio.topProjects.slice(0, 5);
    }

    // Update box office record if broken
    if (!studio.boxOfficeRecord || film.totalGross > studio.boxOfficeRecord) {
      studio.boxOfficeRecord = film.totalGross;
    }

    // DYNAMIC STOCK MARKET SHOCK:
    // If studio is listed on Dalal Street, Hit surges stock; Flop plunges stock!
    if (studio.ticker && state.market?.companies) {
      const comp = state.market.companies.find(c => c.ticker === studio.ticker);
      if (comp) {
        if (verdict === 'All-Time Blockbuster' || verdict === 'Blockbuster') {
          comp.buyPressure = Math.min(85, comp.buyPressure + 24); // Rallies to upper circuit zone
        } else if (verdict === 'Flop' || verdict === 'Disaster') {
          comp.buyPressure = Math.max(15, comp.buyPressure - 28); // Panics to lower circuit zone
        }
      }
    }

    state.feed.unshift({
      id: 'evt_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
      day: state.clock.day,
      date: state.clock.formattedDate,
      category: 'Trade Box Office',
      title: `${film.title} Concludes Run (${verdict})`,
      body: `${studio.name}'s "${film.title}" concluded its run with ${window.StudioGame.Systems.Finance.formatRupees(film.totalGross)} worldwide gross (${verdict}). ${verdict === 'All-Time Blockbuster' || verdict === 'Blockbuster' ? 'Enters the studio\'s All-Time Top 5 Hall of Fame!' : ''}`,
      icon: (verdict === 'All-Time Blockbuster' || verdict === 'Blockbuster') ? '🏆' : (verdict === 'Flop' ? '🔻' : '🎟️')
    });
  }

  /**
   * Advance in-production projects for rival studios
   */
  function tickStudioProduction(state, studio) {
    if (!studio.inProduction || studio.inProduction.length === 0) return;

    for (let i = studio.inProduction.length - 1; i >= 0; i--) {
      const proj = studio.inProduction[i];
      proj.daysRemaining -= 1;

      if (proj.daysRemaining <= 0) {
        // Production complete! Launch into active releases!
        studio.inProduction.splice(i, 1);
        launchProducedFilm(state, studio, proj);
      }
    }
  }

  /**
   * Launch a completed production into active theatrical or OTT release
   */
  function launchProducedFilm(state, studio, proj) {
    const openingWeekend = Math.round((proj.budget * (0.35 + Math.random() * 0.50)) / 1000000) * 1000000;

    studio.activeReleases = studio.activeReleases || [];
    studio.activeReleases.push({
      title: proj.title,
      format: proj.format,
      stars: proj.stars,
      director: proj.director,
      budget: proj.budget,
      week: 1,
      weeklyGross: openingWeekend,
      totalGross: openingWeekend
    });

    state.feed.unshift({
      id: 'evt_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
      day: state.clock.day,
      date: state.clock.formattedDate,
      category: 'Theatrical Release',
      title: `Grand Premiere: ${proj.title}`,
      body: `${studio.name} has officially released "${proj.title}" (${proj.format}) starring ${proj.stars.join(', ')} across 4,500 screens nationwide! Opening collections estimated at ${window.StudioGame.Systems.Finance.formatRupees(openingWeekend)}.`,
      icon: '🎬'
    });
  }

  /**
   * Autonomous greenlighting cycle: studios evaluate cash and initiate new projects
   */
  function runAutonomousGreenlightCycle(state) {
    const allStudios = [...state.studios.legacy, ...state.studios.unicorns];

    // Pick a candidate studio that has capacity (< 2 active releases and productions)
    const eligible = allStudios.filter(s => {
      const totalLoad = (s.activeReleases?.length || 0) + (s.inProduction?.length || 0);
      return totalLoad < 2 && (s.cash || 0) >= 30000000; // Min ₹3 Cr cash
    });

    if (eligible.length === 0) return;

    // Pick 1-2 studios per cycle to greenlight
    const candidate = eligible[Math.floor(Math.random() * eligible.length)];

    // Determine format: 70% Theatrical Feature, 30% OTT Web Series
    const isSeries = Math.random() < 0.30;
    const format = isSeries ? 'OTT Premium Web Series' : 'Theatrical Feature Film';

    // Procedural 3-4 word title
    const genre = candidate.signatureGenres?.[0] || 'Action';
    const title = generateProceduralFilmTitle(genre, isSeries ? 'series' : 'film');

    // Pick star cast: prefer studio's contracted stars
    let cast = [];
    if (candidate.contractedStars && candidate.contractedStars.length > 0) {
      cast = [candidate.contractedStars[0]];
      if (candidate.contractedStars.length > 1 && Math.random() < 0.5) {
        cast.push(candidate.contractedStars[1]);
      }
    } else if (candidate.founderName) {
      cast = [candidate.founderName];
    } else {
      // Cast top talent from industry
      const sampleTalents = ['Ranbir Dev', 'Kiara Advani', 'Kartik Aaryan', 'Kriti Sanon', 'Vicky Kaushal', 'Deepika Sen'];
      cast = [sampleTalents[Math.floor(Math.random() * sampleTalents.length)]];
    }

    // Allocate production budget (15% to 35% of cash reserves, clamped ₹15 Cr to ₹220 Cr)
    const rawBudget = Math.round((candidate.cash || 100000000) * (0.18 + Math.random() * 0.18));
    const budget = Math.max(150000000, Math.min(2200000000, rawBudget));

    // Deduct cash for production
    candidate.cash = Math.max(10000000, candidate.cash - budget);

    // Production timeline (50 to 90 days)
    const prodDays = 50 + Math.floor(Math.random() * 40);

    candidate.inProduction = candidate.inProduction || [];
    candidate.inProduction.push({
      title: title,
      format: format,
      stars: cast,
      director: 'Ace Filmmaker',
      budget: budget,
      daysRemaining: prodDays,
      totalProductionDays: prodDays
    });

    // Notify feed for tentpole projects
    if (budget >= 500000000) {
      state.feed.unshift({
        id: 'evt_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
        day: state.clock.day,
        date: state.clock.formattedDate,
        category: 'Industry Greenlight',
        title: `Greenlight Alert: ${candidate.name}`,
        body: `${candidate.name} has greenlit mega-production "${title}" (${format}) starring ${cast.join(' & ')} with an allocated budget of ${window.StudioGame.Systems.Finance.formatRupees(budget)}.`,
        icon: '🎥'
      });
    }
  }

  /**
   * Evaluate top 10 dynamic Unicorn studios:
   * Rank them by net worth; if any fall below ₹15 Cr, trigger collapse and replace!
   */
  function evaluateUnicornDynamics(state) {
    const unicorns = state.studios.unicorns;
    if (!unicorns || unicorns.length === 0) return;

    // Track net worth history
    unicorns.forEach(u => {
      const drift = (Math.random() - 0.48) * 0.03;
      u.netWorth = Math.max(5000000, Math.round(u.netWorth * (1 + drift)));
      u.history = u.history || [];
      u.history.push(u.netWorth);
      if (u.history.length > 10) u.history.shift();
    });

    // Check for collapse
    for (let i = 0; i < unicorns.length; i++) {
      const u = unicorns[i];
      if (u.netWorth < 150000000) { // Below 15 Cr -> Collapse!
        triggerUnicornCollapse(state, u, i);
      }
    }

    // Sort by net worth descending to maintain top 10 rank
    unicorns.sort((a, b) => b.netWorth - a.netWorth);
  }

  function triggerUnicornCollapse(state, collapsedStudio, index) {
    const founder = collapsedStudio.founderName || 'Founder Talent';

    state.feed.unshift({
      id: 'evt_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
      day: state.clock.day,
      date: state.clock.formattedDate,
      category: 'Corporate Scandal',
      title: `Unicorn Collapse: ${collapsedStudio.name}`,
      body: `Crippled by consecutive box office disasters and debt, ${collapsedStudio.name} (founded by ${founder}) has filed for liquidation. All contracts terminated.`,
      icon: '📉'
    });

    // Replace with a new dynamic talent-founded startup
    const potentialFounders = [
      { name: 'Kriti Sanon', cat: 'Superstar', prefix: 'Sanon Starlight Motion' },
      { name: 'Ayushmann Khurrana', cat: 'A-Lister', prefix: 'Khurrana Content Lab' },
      { name: 'Kartik Aaryan', cat: 'Superstar', prefix: 'Aaryan Crown Entertainment' },
      { name: 'Vicky Kaushal', cat: 'Superstar', prefix: 'Kaushal Braveheart Cine' },
      { name: 'Nayanthara Kurian', cat: 'Megastar', prefix: 'Nayanthara Royal Celluloid' },
      { name: 'Samantha Prabhu', cat: 'Superstar', prefix: 'Samantha Phoenix Films' }
    ];

    const founderData = potentialFounders[Math.floor(Math.random() * potentialFounders.length)];
    const startingNw = Math.round((280000000 + Math.random() * 220000000) / 1000000) * 1000000;

    const replacement = {
      id: 'unicorn_' + Date.now(),
      name: founderData.prefix,
      founderName: founderData.name,
      founderCategory: founderData.cat,
      netWorth: startingNw,
      cash: Math.round(startingNw * 0.35),
      reputation: 86,
      attitude: 'neutral',
      status: 'active',
      isPublic: false,
      ticker: null,
      filmsCount: 1,
      activeReleases: [],
      inProduction: [],
      topProjects: [],
      history: [startingNw]
    };

    replacement.topProjects = generateStarterTopProjects(replacement, state);
    state.studios.unicorns[index] = replacement;

    state.feed.unshift({
      id: 'evt_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
      day: state.clock.day,
      date: state.clock.formattedDate,
      category: 'Studio Founded',
      title: `New Unicorn Enters Top 10: ${replacement.name}`,
      body: `${founderData.name} has launched a boutique studio with ₹${(startingNw / 10000000).toFixed(1)} Cr seed backing, taking over the vacant Top-10 Unicorn slot.`,
      icon: '🦄'
    });
  }

  /**
   * Pitch a Co-Production deal with a rival studio
   */
  function pitchCoProduction(state, studioId) {
    ensureStudiosState(state);
    const studio = [...state.studios.legacy, ...state.studios.unicorns].find(s => s.id === studioId);
    if (!studio) return { success: false, error: 'Studio not found.' };

    if (studio.attitude === 'aggressive') {
      return {
        success: false,
        error: `${studio.name} considers your studio an aggressive rival and flatly refused to co-finance.`
      };
    }

    if (state.studio.reputation < 50) {
      return {
        success: false,
        error: `${studio.name} requires your studio to hold at least 50 Reputation before partnering on co-productions.`
      };
    }

    // Success! Co-production granted
    studio.attitude = 'friendly';
    return {
      success: true,
      message: `${studio.name} accepted the co-production alliance! They will co-finance 35% of your next major feature film budget.`
    };
  }

  return {
    ensureStudiosState,
    dailyTick,
    generateProceduralFilmTitle,
    pitchCoProduction
  };
})();
