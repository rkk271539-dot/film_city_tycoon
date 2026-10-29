/**
 * Comprehensive Indian Cinema Talent Database (300+ Talent)
 * Spans Megastars, Superstars, A-Listers, Acclaimed Artistes,
 * Character Veterans, Rising Breakthroughs, Commercial Models, and Newcomers.
 */

window.StudioGame = window.StudioGame || {};
window.StudioGame.Data = window.StudioGame.Data || {};

window.StudioGame.Data.Talent = (function() {
  // Existing starter talents for continuous save compatibility
  const starterTalents = [
    {
      id: 'talent_starter_1',
      name: 'Simran Ahuja',
      category: 'Commercial Model',
      gender: 'female',
      age: 23,
      avatarSeed: 'simran_ahuja',
      bio: 'Popular face in Mumbai print catalogs and bridal fashion weeks.',
      reputation: 35,
      glamour: 65,
      acting: 40,
      fans: 180000,
      pureImage: 'romantic',
      netWorth: 3500000,
      averageFee: 35000,
      debt: 0,
      maritalStatus: 'Single',
      spouse: null,
      fitness: 78,
      ego: 30,
      loyalty: 50,
      scandalRisk: 25,
      contractStatus: 'free_agent',
      contractWith: null,
      chemistryPairs: ['Rohan Mehra', 'Vikramaditya Roy'],
      pastTopFilms: [{ title: 'Bridal Couture Mumbai', year: 2025, verdict: 'Commercial Hit' }],
      awards: []
    },
    {
      id: 'talent_starter_2',
      name: 'Rohan Mehra',
      category: 'Commercial Model',
      gender: 'male',
      age: 25,
      avatarSeed: 'rohan_mehra',
      bio: 'Known for athletic physique; frequent lead in energy drink and motorcycle shoots.',
      reputation: 38,
      glamour: 60,
      acting: 45,
      fans: 240000,
      pureImage: 'bold',
      netWorth: 4500000,
      averageFee: 40000,
      debt: 800000, // 8 Lakhs bike loan debt
      maritalStatus: 'Single',
      spouse: null,
      fitness: 88,
      ego: 35,
      loyalty: 50,
      scandalRisk: 30,
      contractStatus: 'free_agent',
      contractWith: null,
      chemistryPairs: ['Simran Ahuja', 'Ananya Deshmukh'],
      pastTopFilms: [{ title: 'Nitro Energy Rush', year: 2025, verdict: 'Commercial Hit' }],
      awards: []
    },
    {
      id: 'talent_starter_3',
      name: 'Ananya Deshmukh',
      category: 'Rising Star',
      gender: 'female',
      age: 24,
      avatarSeed: 'ananya_deshmukh',
      bio: 'Theatre-trained talent transitioning into high-end streaming commercial ads and indie shorts.',
      reputation: 48,
      glamour: 72,
      acting: 58,
      fans: 520000,
      pureImage: 'wholesome',
      netWorth: 8000000,
      averageFee: 65000,
      debt: 0,
      maritalStatus: 'Single',
      spouse: null,
      fitness: 82,
      ego: 40,
      loyalty: 55,
      scandalRisk: 20,
      contractStatus: 'free_agent',
      contractWith: null,
      chemistryPairs: ['Vikramaditya Roy', 'Rohan Mehra'],
      pastTopFilms: [{ title: 'Shadows of Prithvi', year: 2024, verdict: 'Critically Acclaimed' }],
      awards: ['Best Debut Theatre 2024']
    },
    {
      id: 'talent_starter_4',
      name: 'Vikramaditya Roy',
      category: 'A-Lister',
      gender: 'male',
      age: 31,
      avatarSeed: 'vikram_roy',
      bio: 'Charismatic screen presence, seasoned in television commercials and corporate campaigns.',
      reputation: 52,
      glamour: 68,
      acting: 64,
      fans: 1100000,
      pureImage: 'romantic',
      netWorth: 15000000,
      averageFee: 75000,
      debt: 2500000, // 25 Lakhs debt from a failed restaurant venture
      maritalStatus: 'Dating',
      spouse: 'Meera Sen',
      fitness: 80,
      ego: 55,
      loyalty: 50,
      scandalRisk: 35,
      contractStatus: 'free_agent',
      contractWith: null,
      chemistryPairs: ['Meera Sen', 'Ananya Deshmukh'],
      pastTopFilms: [{ title: 'The Royal Sovereign', year: 2023, verdict: 'Semi-Hit' }],
      awards: []
    },
    {
      id: 'talent_starter_5',
      name: 'Meera Sen',
      category: 'Commercial Model',
      gender: 'female',
      age: 27,
      avatarSeed: 'meera_sen',
      bio: 'A-list runway model frequently featured on luxury lifestyle magazine covers.',
      reputation: 58,
      glamour: 82,
      acting: 50,
      fans: 1900000,
      pureImage: 'bold',
      netWorth: 22000000,
      averageFee: 90000,
      debt: 0,
      maritalStatus: 'Dating',
      spouse: 'Vikramaditya Roy',
      fitness: 90,
      ego: 60,
      loyalty: 45,
      scandalRisk: 45,
      contractStatus: 'free_agent',
      contractWith: null,
      chemistryPairs: ['Vikramaditya Roy'],
      pastTopFilms: [{ title: 'Vogue Summer Gala', year: 2025, verdict: 'Sensational' }],
      awards: ['Model of the Year 2024']
    }
  ];

  // Curated prominent icons and superstars inspired by Indian cinema
  const curatedStars = [
    // Female Superstars & Icons
    {
      name: 'Deepika Sen',
      gender: 'female',
      age: 38,
      category: 'Megastar',
      avatarSeed: 'deepika_sen',
      bio: 'The undisputed reigning queen of Bollywood with unmatched box office appeal and global fashion clout.',
      reputation: 96,
      glamour: 97,
      acting: 91,
      fans: 68000000,
      pureImage: 'romantic',
      netWorth: 450000000,
      averageFee: 180000000, // 18 Cr
      debt: 0,
      maritalStatus: 'Married',
      spouse: 'Ranveer Bajwa',
      fitness: 95,
      ego: 75,
      loyalty: 40,
      scandalRisk: 25,
      contractStatus: 'free_agent',
      contractWith: null,
      chemistryPairs: ['Ranveer Bajwa', 'Ranbir Dev', 'Shah Rukh Mir'],
      pastTopFilms: [
        { title: 'Padmavati Rekha', year: 2022, verdict: 'All-Time Blockbuster' },
        { title: 'Gehraiyaan Skies', year: 2023, verdict: 'Hit' },
        { title: 'Pathaan Force', year: 2024, verdict: 'All-Time Blockbuster' }
      ],
      awards: ['Filmfare Best Actress (x3)', 'National Cinema Icon']
    },
    {
      name: 'Alia Kapoor',
      gender: 'female',
      age: 31,
      category: 'Superstar',
      avatarSeed: 'alia_kapoor',
      bio: 'Powerhouse performer celebrated for emotional intensity, pristine script selection, and mass adoration.',
      reputation: 94,
      glamour: 89,
      acting: 96,
      fans: 62000000,
      pureImage: 'romantic',
      netWorth: 380000000,
      averageFee: 160000000, // 16 Cr
      debt: 0,
      maritalStatus: 'Married',
      spouse: 'Ranbir Dev',
      fitness: 90,
      ego: 70,
      loyalty: 45,
      scandalRisk: 20,
      contractStatus: 'free_agent',
      contractWith: null,
      chemistryPairs: ['Ranbir Dev', 'Varun Dhawan-Bahl'],
      pastTopFilms: [
        { title: 'Gangubai Majesty', year: 2022, verdict: 'All-Time Blockbuster' },
        { title: 'Brahmastra Prophecy', year: 2023, verdict: 'Blockbuster' },
        { title: 'Rocky Rani Love', year: 2024, verdict: 'Super Hit' }
      ],
      awards: ['National Film Award Best Actress', 'Filmfare Best Actress (x4)']
    },
    {
      name: 'Katrina Rai',
      gender: 'female',
      age: 39,
      category: 'Megastar',
      avatarSeed: 'katrina_rai',
      bio: 'Glamour goddess and peerless action dancer with monumental brand value across Asia.',
      reputation: 91,
      glamour: 98,
      acting: 74,
      fans: 58000000,
      pureImage: 'bold',
      netWorth: 410000000,
      averageFee: 140000000,
      debt: 0,
      maritalStatus: 'Married',
      spouse: 'Vicky Kaushal',
      fitness: 97,
      ego: 72,
      loyalty: 40,
      scandalRisk: 30,
      contractStatus: 'free_agent',
      contractWith: null,
      chemistryPairs: ['Salman Qureshi', 'Hrithik Anand'],
      pastTopFilms: [
        { title: 'Tiger Immortal', year: 2023, verdict: 'Blockbuster' },
        { title: 'Sooryavanshi Strike', year: 2022, verdict: 'Super Hit' }
      ],
      awards: ['Global Style Diva', 'Best Dance Icon']
    },
    {
      name: 'Nayanthara Kurian',
      gender: 'female',
      age: 39,
      category: 'Megastar',
      avatarSeed: 'nayanthara_k',
      bio: 'The Lady Superstar of South cinema; commands unmatched respect, solo-led box office hits, and strict contract clauses.',
      reputation: 95,
      glamour: 91,
      acting: 93,
      fans: 54000000,
      pureImage: 'wholesome',
      netWorth: 350000000,
      averageFee: 150000000,
      debt: 0,
      maritalStatus: 'Married',
      spouse: 'Vignesh Shivan',
      fitness: 91,
      ego: 82,
      loyalty: 35,
      scandalRisk: 15,
      contractStatus: 'free_agent',
      contractWith: null,
      chemistryPairs: ['Shah Rukh Mir', 'Vijay Sethupathi'],
      pastTopFilms: [
        { title: 'Jawan Blitz', year: 2023, verdict: 'All-Time Blockbuster' },
        { title: 'Netrikann Vision', year: 2022, verdict: 'Super Hit' }
      ],
      awards: ['South Cinema Queen', 'Filmfare Best Actress (x5)']
    },
    {
      name: 'Kiara Advani',
      gender: 'female',
      age: 32,
      category: 'Superstar',
      avatarSeed: 'kiara_advani',
      bio: 'Golden girl of modern commercial cinema; carries an angelic screen image, soaring popularity, and spotless track record.',
      reputation: 89,
      glamour: 94,
      acting: 84,
      fans: 48000000,
      pureImage: 'wholesome',
      netWorth: 240000000,
      averageFee: 90000000,
      debt: 0,
      maritalStatus: 'Married',
      spouse: 'Sidharth Malhotra',
      fitness: 89,
      ego: 60,
      loyalty: 50,
      scandalRisk: 15,
      contractStatus: 'free_agent',
      contractWith: null,
      chemistryPairs: ['Sidharth Malhotra', 'Kartik Aaryan'],
      pastTopFilms: [
        { title: 'Shershaah Valor', year: 2021, verdict: 'All-Time Blockbuster' },
        { title: 'Bhool Bhulaiyaa 2', year: 2022, verdict: 'Blockbuster' },
        { title: 'SatyaPrem Katha', year: 2023, verdict: 'Hit' }
      ],
      awards: ['Sensational Actress of the Year']
    },
    {
      name: 'Kriti Sanon',
      gender: 'female',
      age: 34,
      category: 'Superstar',
      avatarSeed: 'kriti_sanon',
      bio: 'National Award-winning actress and studio entrepreneur blending striking height, runway glamour, and dramatic weight.',
      reputation: 88,
      glamour: 93,
      acting: 89,
      fans: 42000000,
      pureImage: 'romantic',
      netWorth: 210000000,
      averageFee: 85000000,
      debt: 0,
      maritalStatus: 'Single',
      spouse: null,
      fitness: 92,
      ego: 62,
      loyalty: 55,
      scandalRisk: 20,
      contractStatus: 'free_agent',
      contractWith: null,
      chemistryPairs: ['Kartik Aaryan', 'Varun Dhawan-Bahl'],
      pastTopFilms: [
        { title: 'Mimi Motherhood', year: 2022, verdict: 'Super Hit' },
        { title: 'Crew Airlines', year: 2024, verdict: 'Super Hit' }
      ],
      awards: ['National Film Award Best Actress', 'Filmfare Best Actress']
    },
    {
      name: 'Samantha Prabhu',
      gender: 'female',
      age: 37,
      category: 'Superstar',
      avatarSeed: 'samantha_prabhu',
      bio: 'Fearless and fiercely beloved pan-India superstar with record digital engagement and intense stunt dedication.',
      reputation: 92,
      glamour: 93,
      acting: 92,
      fans: 50000000,
      pureImage: 'bold',
      netWorth: 280000000,
      averageFee: 110000000,
      debt: 0,
      maritalStatus: 'Divorced',
      spouse: null,
      fitness: 94,
      ego: 68,
      loyalty: 45,
      scandalRisk: 30,
      contractStatus: 'free_agent',
      contractWith: null,
      chemistryPairs: ['Vijay Sethupathi', 'Aryan Shah'],
      pastTopFilms: [
        { title: 'Oo Antava Spark', year: 2022, verdict: 'Sensational Hit' },
        { title: 'Citadel Honey', year: 2024, verdict: 'Blockbuster Series' }
      ],
      awards: ['Filmfare South Best Actress (x4)']
    },
    {
      name: 'Tripti Dimri',
      gender: 'female',
      age: 29,
      category: 'Rising Star',
      avatarSeed: 'tripti_dimri',
      bio: 'National crush and breakthrough sensation following incendiary dramatic roles in dark thrillers and mass entertainers.',
      reputation: 82,
      glamour: 92,
      acting: 85,
      fans: 26000000,
      pureImage: 'bold',
      netWorth: 95000000,
      averageFee: 45000000,
      debt: 12000000, // 1.2 Cr debt from early luxury lifestyle leverage
      maritalStatus: 'Single',
      spouse: null,
      fitness: 86,
      ego: 58,
      loyalty: 60,
      scandalRisk: 40,
      contractStatus: 'free_agent',
      contractWith: null,
      chemistryPairs: ['Ranbir Dev', 'Vicky Kaushal'],
      pastTopFilms: [
        { title: 'Qala Requiem', year: 2022, verdict: 'Critically Acclaimed' },
        { title: 'Animal Instinct', year: 2023, verdict: 'All-Time Blockbuster' }
      ],
      awards: ['Breakthrough Face of the Year 2024']
    },
    {
      name: 'Radhika Apte',
      gender: 'female',
      age: 38,
      category: 'Acclaimed',
      avatarSeed: 'radhika_apte',
      bio: 'Indie powerhouse and international festival darling; refuses formulaic Bollywood tropes, excels in gritty psychological cinema.',
      reputation: 85,
      glamour: 76,
      acting: 95,
      fans: 18000000,
      pureImage: 'unrestricted',
      netWorth: 120000000,
      averageFee: 35000000,
      debt: 0,
      maritalStatus: 'Married',
      spouse: 'Benedict Taylor',
      fitness: 84,
      ego: 65,
      loyalty: 65,
      scandalRisk: 25,
      contractStatus: 'free_agent',
      contractWith: null,
      chemistryPairs: ['Nawazuddin Siddiqui', 'Ayushmann Khurrana'],
      pastTopFilms: [
        { title: 'Andhadhun Symphony', year: 2020, verdict: 'All-Time Blockbuster' },
        { title: 'Raat Akeli Thi', year: 2022, verdict: 'Super Hit' }
      ],
      awards: ['International Emmy Nominee']
    },
    {
      name: 'Tabu Hashmi',
      gender: 'female',
      age: 52,
      category: 'Megastar',
      avatarSeed: 'tabu_hashmi',
      bio: 'Living legend of nuanced elegance, dark comedic timing, and peerless dramatic weight.',
      reputation: 97,
      glamour: 86,
      acting: 98,
      fans: 35000000,
      pureImage: 'romantic',
      netWorth: 310000000,
      averageFee: 95000000,
      debt: 0,
      maritalStatus: 'Single',
      spouse: null,
      fitness: 82,
      ego: 60,
      loyalty: 60,
      scandalRisk: 10,
      contractStatus: 'free_agent',
      contractWith: null,
      chemistryPairs: ['Ajay Devgan-Rao', 'Shah Rukh Mir'],
      pastTopFilms: [
        { title: 'Drishyam Truth 2', year: 2022, verdict: 'All-Time Blockbuster' },
        { title: 'Bhool Bhulaiyaa 2', year: 2022, verdict: 'Blockbuster' }
      ],
      awards: ['National Film Award (x2)', 'Padma Shri Honoree']
    },

    // Male Superstars & Icons
    {
      name: 'Shah Rukh Mir',
      gender: 'male',
      age: 58,
      category: 'Megastar',
      avatarSeed: 'srk_mir',
      bio: 'The Badshah of Indian Cinema; global cultural colossus with millions of fans across 100 countries.',
      reputation: 99,
      glamour: 94,
      acting: 97,
      fans: 95000000,
      pureImage: 'romantic',
      netWorth: 6200000000, // 620 Cr
      averageFee: 300000000, // 30 Cr or 50% backend
      debt: 0,
      maritalStatus: 'Married',
      spouse: 'Gauri Mir',
      fitness: 89,
      ego: 85,
      loyalty: 30,
      scandalRisk: 25,
      contractStatus: 'free_agent',
      contractWith: null,
      chemistryPairs: ['Deepika Sen', 'Katrina Rai', 'Nayanthara Kurian'],
      pastTopFilms: [
        { title: 'Pathaan Force', year: 2023, verdict: 'All-Time Blockbuster' },
        { title: 'Jawan Vengeance', year: 2023, verdict: 'All-Time Blockbuster' },
        { title: 'Dunki Flight', year: 2024, verdict: 'Hit' }
      ],
      awards: ['Filmfare Best Actor (x8)', 'Legion of Honour France']
    },
    {
      name: 'Ranbir Dev',
      gender: 'male',
      age: 41,
      category: 'Superstar',
      avatarSeed: 'ranbir_dev',
      bio: 'The generational prodigy of Bollywood royalty; chameleon-like method craft paired with earth-shattering opening records.',
      reputation: 96,
      glamour: 95,
      acting: 98,
      fans: 65000000,
      pureImage: 'romantic',
      netWorth: 490000000,
      averageFee: 220000000,
      debt: 0,
      maritalStatus: 'Married',
      spouse: 'Alia Kapoor',
      fitness: 93,
      ego: 78,
      loyalty: 40,
      scandalRisk: 35,
      contractStatus: 'free_agent',
      contractWith: null,
      chemistryPairs: ['Alia Kapoor', 'Deepika Sen', 'Tripti Dimri'],
      pastTopFilms: [
        { title: 'Sanju Chronicle', year: 2021, verdict: 'All-Time Blockbuster' },
        { title: 'Brahmastra Flames', year: 2022, verdict: 'Blockbuster' },
        { title: 'Animal Fury', year: 2023, verdict: 'All-Time Blockbuster' }
      ],
      awards: ['Filmfare Best Actor (x6)', 'Critics Award (x2)']
    },
    {
      name: 'Salman Qureshi',
      gender: 'male',
      age: 58,
      category: 'Megastar',
      avatarSeed: 'salman_q',
      bio: 'The ultimate mass demigod; single-theatre king with fan loyalty akin to religious worship across India.',
      reputation: 97,
      glamour: 88,
      acting: 78,
      fans: 88000000,
      pureImage: 'wholesome',
      netWorth: 2900000000,
      averageFee: 280000000,
      debt: 0,
      maritalStatus: 'Single',
      spouse: null,
      fitness: 88,
      ego: 92,
      loyalty: 25,
      scandalRisk: 55,
      contractStatus: 'free_agent',
      contractWith: null,
      chemistryPairs: ['Katrina Rai', 'Deepika Sen'],
      pastTopFilms: [
        { title: 'Bajrangi Miracle', year: 2020, verdict: 'All-Time Blockbuster' },
        { title: 'Tiger 3 Hunt', year: 2023, verdict: 'Blockbuster' }
      ],
      awards: ['Mass King of the Millennium']
    },
    {
      name: 'Hrithik Anand',
      gender: 'male',
      age: 50,
      category: 'Megastar',
      avatarSeed: 'hrithik_anand',
      bio: 'The Greek God of Indian Cinema; jaw-dropping dancing, superhero physique, and peerless action pedigree.',
      reputation: 95,
      glamour: 99,
      acting: 90,
      fans: 72000000,
      pureImage: 'romantic',
      netWorth: 1800000000,
      averageFee: 240000000,
      debt: 0,
      maritalStatus: 'Dating',
      spouse: 'Saba Azad',
      fitness: 99,
      ego: 80,
      loyalty: 40,
      scandalRisk: 25,
      contractStatus: 'free_agent',
      contractWith: null,
      chemistryPairs: ['Katrina Rai', 'Deepika Sen'],
      pastTopFilms: [
        { title: 'War Clash', year: 2021, verdict: 'All-Time Blockbuster' },
        { title: 'Fighter Wing', year: 2024, verdict: 'Super Hit' }
      ],
      awards: ['Filmfare Best Actor (x4)', 'Global Fitness Icon']
    },
    {
      name: 'Ranveer Bajwa',
      gender: 'male',
      age: 39,
      category: 'Superstar',
      avatarSeed: 'ranveer_bajwa',
      bio: 'Volcanic bundle of raw kinetic energy, avant-garde couture, and total immersion into every eccentric character.',
      reputation: 93,
      glamour: 92,
      acting: 95,
      fans: 58000000,
      pureImage: 'bold',
      netWorth: 390000000,
      averageFee: 170000000,
      debt: 0,
      maritalStatus: 'Married',
      spouse: 'Deepika Sen',
      fitness: 96,
      ego: 80,
      loyalty: 45,
      scandalRisk: 45,
      contractStatus: 'free_agent',
      contractWith: null,
      chemistryPairs: ['Deepika Sen', 'Alia Kapoor'],
      pastTopFilms: [
        { title: 'Padmavat Sultan', year: 2021, verdict: 'All-Time Blockbuster' },
        { title: 'Gully Rhythm', year: 2022, verdict: 'Super Hit' },
        { title: 'Rocky Rani Love', year: 2024, verdict: 'Super Hit' }
      ],
      awards: ['Filmfare Best Actor (x4)']
    },
    {
      name: 'Prabhas Raju',
      gender: 'male',
      age: 44,
      category: 'Megastar',
      avatarSeed: 'prabhas_raju',
      bio: 'Rebel star of Pan-India cinema; single-handedly created the 1000-Crore opening era with Baahubali and Salaar.',
      reputation: 96,
      glamour: 89,
      acting: 82,
      fans: 76000000,
      pureImage: 'wholesome',
      netWorth: 850000000,
      averageFee: 250000000,
      debt: 0,
      maritalStatus: 'Single',
      spouse: null,
      fitness: 89,
      ego: 75,
      loyalty: 35,
      scandalRisk: 15,
      contractStatus: 'free_agent',
      contractWith: null,
      chemistryPairs: ['Kriti Sanon', 'Deepika Sen'],
      pastTopFilms: [
        { title: 'Baahubali Conclusion', year: 2020, verdict: 'All-Time Historic Blockbuster' },
        { title: 'Salaar Ceasefire', year: 2023, verdict: 'All-Time Blockbuster' },
        { title: 'Kalki 2898 AD', year: 2024, verdict: 'All-Time Blockbuster' }
      ],
      awards: ['Pan-India Megastar of the Century']
    },
    {
      name: 'Vicky Kaushal',
      gender: 'male',
      age: 36,
      category: 'Superstar',
      avatarSeed: 'vicky_kaushal',
      bio: 'National Award-winning hero beloved for military biopics, grounded Punjabi charm, and flawless emotional resonance.',
      reputation: 91,
      glamour: 88,
      acting: 96,
      fans: 42000000,
      pureImage: 'romantic',
      netWorth: 220000000,
      averageFee: 120000000,
      debt: 0,
      maritalStatus: 'Married',
      spouse: 'Katrina Rai',
      fitness: 93,
      ego: 60,
      loyalty: 60,
      scandalRisk: 15,
      contractStatus: 'free_agent',
      contractWith: null,
      chemistryPairs: ['Tripti Dimri', 'Alia Kapoor'],
      pastTopFilms: [
        { title: 'Uri Strike', year: 2021, verdict: 'All-Time Blockbuster' },
        { title: 'Sardar Udham', year: 2022, verdict: 'Critically Acclaimed Masterpiece' },
        { title: 'Sam Bahadur', year: 2023, verdict: 'Super Hit' }
      ],
      awards: ['National Film Award Best Actor', 'Filmfare Best Actor']
    },
    {
      name: 'Kartik Aaryan',
      gender: 'male',
      age: 34,
      category: 'Superstar',
      avatarSeed: 'kartik_aaryan',
      bio: 'The undisputed prince of youth rom-coms and family comedy franchises; holds immense box office draw among Gen-Z.',
      reputation: 89,
      glamour: 91,
      acting: 82,
      fans: 46000000,
      pureImage: 'romantic',
      netWorth: 260000000,
      averageFee: 110000000,
      debt: 0,
      maritalStatus: 'Single',
      spouse: null,
      fitness: 90,
      ego: 68,
      loyalty: 50,
      scandalRisk: 30,
      contractStatus: 'free_agent',
      contractWith: null,
      chemistryPairs: ['Kiara Advani', 'Kriti Sanon'],
      pastTopFilms: [
        { title: 'Bhool Bhulaiyaa 2', year: 2022, verdict: 'All-Time Blockbuster' },
        { title: 'SatyaPrem Katha', year: 2023, verdict: 'Hit' },
        { title: 'Chandu Champion', year: 2024, verdict: 'Super Hit' }
      ],
      awards: ['Youth Icon of Cinema']
    },
    {
      name: 'Nawazuddin Siddiqui',
      gender: 'male',
      age: 50,
      category: 'Acclaimed',
      avatarSeed: 'nawaz_siddiqui',
      bio: 'From village theatre to Cannes red carpet; master of raw rustic villainy, dark comedy, and profound human vulnerability.',
      reputation: 92,
      glamour: 65,
      acting: 99,
      fans: 29000000,
      pureImage: 'unrestricted',
      netWorth: 170000000,
      averageFee: 50000000,
      debt: 35000000, // 3.5 Cr debt from family litigation & production losses
      maritalStatus: 'Divorced',
      spouse: null,
      fitness: 75,
      ego: 55,
      loyalty: 65,
      scandalRisk: 35,
      contractStatus: 'free_agent',
      contractWith: null,
      chemistryPairs: ['Radhika Apte', 'Manoj Bajpayee-Nath'],
      pastTopFilms: [
        { title: 'Gangs of Wasseypur', year: 2020, verdict: 'Cult Historic Classic' },
        { title: 'Sacred Games Crime', year: 2021, verdict: 'Global Sensation' }
      ],
      awards: ['National Film Award Special Mention', 'Cannes Breakthrough Actor']
    },
    {
      name: 'Pankaj Tripathi',
      gender: 'male',
      age: 48,
      category: 'Acclaimed',
      avatarSeed: 'pankaj_tripathi',
      bio: 'The national treasure of effortless wit, warmth, and intimidating mafia coldness with mere glances.',
      reputation: 94,
      glamour: 68,
      acting: 98,
      fans: 38000000,
      pureImage: 'wholesome',
      netWorth: 190000000,
      averageFee: 60000000,
      debt: 0,
      maritalStatus: 'Married',
      spouse: 'Mridula Tripathi',
      fitness: 74,
      ego: 40,
      loyalty: 75,
      scandalRisk: 10,
      contractStatus: 'free_agent',
      contractWith: null,
      chemistryPairs: ['Alia Kapoor', 'Kriti Sanon'],
      pastTopFilms: [
        { title: 'Mirzapur Reign', year: 2022, verdict: 'All-Time Streaming Sensation' },
        { title: 'OMG 2 Sanctuary', year: 2023, verdict: 'Super Hit' },
        { title: 'Stree 2 Lore', year: 2024, verdict: 'All-Time Blockbuster' }
      ],
      awards: ['National Film Award Best Supporting Actor (x2)']
    }
  ];

  // Procedural generator lists to scale up to 300+ full talent (150 female, 150 male)
  const femaleFirstNames = [
    'Aarohi', 'Aditi', 'Alankrita', 'Amrita', 'Ananya', 'Anushka', 'Aparna', 'Archana', 'Avantika',
    'Bhavana', 'Charu', 'Damini', 'Disha', 'Diya', 'Divya', 'Esha', 'Gayatri', 'Geetika', 'Harini',
    'Ishita', 'Janhavi', 'Juhi', 'Kalyani', 'Kavya', 'Ketaki', 'Lavanya', 'Madhuri', 'Malavika',
    'Manasvi', 'Maya', 'Medha', 'Mitali', 'Mohini', 'Mrunal', 'Namrata', 'Nandini', 'Navya',
    'Niharika', 'Nisha', 'Pallavi', 'Pooja', 'Prachi', 'Pragya', 'Pranitha', 'Preity', 'Radha',
    'Raveena', 'Reema', 'Ritika', 'Riya', 'Roshni', 'Rupali', 'Sakshi', 'Samyuktha', 'Sandhya',
    'Sanya', 'Shalini', 'Sharanya', 'Shivangi', 'Shreya', 'Shruti', 'Siddhi', 'Sneha', 'Sonali',
    'Suhana', 'Sunidhi', 'Swara', 'Tanvi', 'Tara', 'Tejaswini', 'Trisha', 'Upasana', 'Vaani',
    'Vedika', 'Vidya', 'Yashasvi', 'Zoya', 'Ahana', 'Dia', 'Nitya', 'Pari', 'Srishti'
  ];

  const maleFirstNames = [
    'Abhay', 'Abhimanyu', 'Aditya', 'Ajay', 'Akash', 'Akshaye', 'Aman', 'Amey', 'Anand', 'Angad',
    'Aniruddh', 'Ankush', 'Arjun', 'Arnav', 'Aryan', 'Ashish', 'Avinash', 'Ayush', 'Bobby', 'Chaitanya',
    'Chetan', 'Darshan', 'Deepak', 'Dev', 'Dhruv', 'Gaurav', 'Girish', 'Harshvardhan', 'Hemant',
    'Himanshu', 'Iqbal', 'Ishaan', 'Jaideep', 'Jayant', 'Jeet', 'Karan', 'Kartikeya', 'Kay Kay',
    'Keshav', 'Kunal', 'Manav', 'Mayank', 'Mihir', 'Mohit', 'Nakul', 'Naveen', 'Neeraj', 'Nikhil',
    'Nirvaan', 'Nitin', 'Omkar', 'Parth', 'Prateik', 'Raghav', 'Rahul', 'Rajat', 'Rajeev', 'Rakesh',
    'Rannvijay', 'Reyansh', 'Rishi', 'Ritwik', 'Rohit', 'Sachin', 'Sahil', 'Samar', 'Sameer',
    'Samarth', 'Sanjay', 'Sarthak', 'Saurabh', 'Sharad', 'Shashank', 'Shaurya', 'Shivam', 'Siddhant',
    'Sourabh', 'Subodh', 'Sudarshan', 'Suraj', 'Swapnil', 'Tanmay', 'Tushar', 'Varun', 'Vedang',
    'Vikrant', 'Vinay', 'Vishal', 'Yash', 'Yuvraj', 'Zeeshan'
  ];

  const lastNames = [
    'Bakshi', 'Banerjee', 'Bhardwaj', 'Bhatia', 'Bhattacharya', 'Chauhan', 'Chopra', 'Chowdhury',
    'Deshmukh', 'Dhillon', 'Dubey', 'Ganguly', 'Ghoshal', 'Goswami', 'Gupta', 'Iyer', 'Jadhav',
    'Jain', 'Joshi', 'Kapoor', 'Kashyap', 'Kaushik', 'Khurana', 'Kulkarni', 'Mahajan', 'Malik',
    'Mallya', 'Mathur', 'Menon', 'Mishra', 'Mukherjee', 'Nambiar', 'Naik', 'Nair', 'Pandey',
    'Parekh', 'Patel', 'Patil', 'Pillai', 'Pradhan', 'Purohit', 'Ranganathan', 'Rathore', 'Raut',
    'Reddy', 'Roy', 'Sarin', 'Saxena', 'Sehgal', 'Sen', 'Sengupta', 'Seth', 'Sharma', 'Shetty',
    'Shroff', 'Shukla', 'Singh', 'Singhania', 'Soni', 'Srivastava', 'Suri', 'Talwar', 'Tandon',
    'Thakur', 'Trivedi', 'Upadhyay', 'Varma', 'Vyas', 'Walia', 'Yadav', 'Zaidi'
  ];

  const categories = [
    'Megastar', 'Superstar', 'A-Lister', 'Acclaimed',
    'Rising Star', 'Commercial Model', 'Newcomer'
  ];

  const pureImages = ['wholesome', 'romantic', 'bold', 'unrestricted'];
  const maritalStatuses = ['Single', 'Dating', 'Married', 'Divorced'];

  /**
   * Deterministic pseudo-random number generator for talent stats
   */
  function seedRng(seed) {
    let s = 1;
    for (let i = 0; i < seed.length; i++) {
      s = (s * 31 + seed.charCodeAt(i)) & 0x7fffffff;
    }
    return function() {
      s = (s * 9301 + 49297) % 233280;
      return s / 233280;
    };
  }

  /**
   * Build complete roster ensuring exactly 300+ unique talents (150 female, 150 male)
   */
  function generateFullRoster() {
    const roster = [];
    const usedNames = new Set();

    // 1. Add starter talents
    starterTalents.forEach(t => {
      roster.push({ ...t });
      usedNames.add(t.name);
    });

    // 2. Add curated icons
    curatedStars.forEach((t, idx) => {
      roster.push({
        id: 'talent_curated_' + (idx + 1),
        ...t
      });
      usedNames.add(t.name);
    });

    // Count current gender splits
    let currentFemale = roster.filter(t => t.gender === 'female').length;
    let currentMale = roster.filter(t => t.gender === 'male').length;

    const targetFemale = 152;
    const targetMale = 152;

    // Generate female roster up to target
    let fIdx = 0;
    while (currentFemale < targetFemale) {
      const fName = femaleFirstNames[fIdx % femaleFirstNames.length];
      const lName = lastNames[(fIdx * 7 + 13) % lastNames.length];
      const fullName = `${fName} ${lName}`;
      fIdx++;

      if (usedNames.has(fullName)) continue;
      usedNames.add(fullName);

      const rng = seedRng('female_' + fullName);
      const isNewcomer = rng() < 0.45;
      const isModel = !isNewcomer && rng() < 0.35;
      const isAcclaimed = !isNewcomer && !isModel && rng() < 0.35;
      const category = isNewcomer ? 'Newcomer' : (isModel ? 'Commercial Model' : (isAcclaimed ? 'Acclaimed' : 'Rising Star'));

      const age = Math.floor(19 + rng() * 26);
      const rep = isNewcomer ? Math.floor(20 + rng() * 25) : Math.floor(45 + rng() * 40);
      const glam = Math.floor(55 + rng() * 42);
      const act = isAcclaimed ? Math.floor(75 + rng() * 23) : Math.floor(35 + rng() * 55);
      const fans = Math.round(isNewcomer ? (15000 + rng() * 85000) : (450000 + rng() * 12000000));
      
      const hasDebt = rng() < 0.22; // 22% of talents carry debt burden
      const debtAmount = hasDebt ? Math.round((500000 + rng() * 18000000) / 100000) * 100000 : 0;

      const fee = isNewcomer
        ? Math.round((40000 + rng() * 120000) / 5000) * 5000
        : Math.round((250000 + rng() * 45000000) / 50000) * 50000;

      const netWorth = Math.round(fee * (3 + rng() * 15));

      roster.push({
        id: 'talent_f_' + (currentFemale + 1),
        name: fullName,
        category: category,
        gender: 'female',
        age: age,
        avatarSeed: 'f_' + fullName.toLowerCase().replace(/\s+/g, '_'),
        bio: `${category} in Mumbai film circuit known for dynamic screen screen presence.`,
        reputation: rep,
        glamour: glam,
        acting: act,
        fans: fans,
        pureImage: pureImages[Math.floor(rng() * pureImages.length)],
        netWorth: netWorth,
        averageFee: fee,
        debt: debtAmount,
        maritalStatus: maritalStatuses[Math.floor(rng() * maritalStatuses.length)],
        spouse: null,
        fitness: Math.floor(65 + rng() * 32),
        ego: Math.floor(30 + rng() * 55),
        loyalty: Math.floor(40 + rng() * 45),
        scandalRisk: Math.floor(15 + rng() * 60),
        contractStatus: 'free_agent',
        contractWith: null,
        chemistryPairs: [],
        pastTopFilms: isNewcomer ? [] : [{ title: `Echoes of ${lName}`, year: 2024, verdict: 'Hit' }],
        awards: []
      });

      currentFemale++;
    }

    // Generate male roster up to target
    let mIdx = 0;
    while (currentMale < targetMale) {
      const mName = maleFirstNames[mIdx % maleFirstNames.length];
      const lName = lastNames[(mIdx * 11 + 5) % lastNames.length];
      const fullName = `${mName} ${lName}`;
      mIdx++;

      if (usedNames.has(fullName)) continue;
      usedNames.add(fullName);

      const rng = seedRng('male_' + fullName);
      const isNewcomer = rng() < 0.45;
      const isModel = !isNewcomer && rng() < 0.30;
      const isAcclaimed = !isNewcomer && !isModel && rng() < 0.40;
      const category = isNewcomer ? 'Newcomer' : (isModel ? 'Commercial Model' : (isAcclaimed ? 'Acclaimed' : 'Rising Star'));

      const age = Math.floor(21 + rng() * 32);
      const rep = isNewcomer ? Math.floor(20 + rng() * 25) : Math.floor(45 + rng() * 42);
      const glam = Math.floor(45 + rng() * 48);
      const act = isAcclaimed ? Math.floor(75 + rng() * 23) : Math.floor(35 + rng() * 55);
      const fans = Math.round(isNewcomer ? (12000 + rng() * 95000) : (500000 + rng() * 14000000));
      
      const hasDebt = rng() < 0.25; // 25% of male talent have loans/business debts
      const debtAmount = hasDebt ? Math.round((700000 + rng() * 25000000) / 100000) * 100000 : 0;

      const fee = isNewcomer
        ? Math.round((45000 + rng() * 140000) / 5000) * 5000
        : Math.round((350000 + rng() * 55000000) / 50000) * 50000;

      const netWorth = Math.round(fee * (3 + rng() * 15));

      roster.push({
        id: 'talent_m_' + (currentMale + 1),
        name: fullName,
        category: category,
        gender: 'male',
        age: age,
        avatarSeed: 'm_' + fullName.toLowerCase().replace(/\s+/g, '_'),
        bio: `${category} active across Bollywood web series, ads, and theatrical features.`,
        reputation: rep,
        glamour: glam,
        acting: act,
        fans: fans,
        pureImage: pureImages[Math.floor(rng() * pureImages.length)],
        netWorth: netWorth,
        averageFee: fee,
        debt: debtAmount,
        maritalStatus: maritalStatuses[Math.floor(rng() * maritalStatuses.length)],
        spouse: null,
        fitness: Math.floor(65 + rng() * 33),
        ego: Math.floor(35 + rng() * 55),
        loyalty: Math.floor(40 + rng() * 45),
        scandalRisk: Math.floor(20 + rng() * 60),
        contractStatus: 'free_agent',
        contractWith: null,
        chemistryPairs: [],
        pastTopFilms: isNewcomer ? [] : [{ title: `The ${lName} Files`, year: 2024, verdict: 'Hit' }],
        awards: []
      });

      currentMale++;
    }

    return roster;
  }

  return {
    starterTalents,
    curatedStars,
    generateFullRoster
  };
})();
