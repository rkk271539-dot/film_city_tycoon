/**
 * Indian Studios Database (25 Baseline Studios + 10 Dynamic Unicorn Studios)
 * Baseline production houses inspired by Indian cinema & dynamic talent-led Unicorn houses.
 */

window.StudioGame = window.StudioGame || {};
window.StudioGame.Data = window.StudioGame.Data || {};

window.StudioGame.Data.Studios = (function() {
  const legacyStudios = [
    {
      id: 'studio_yrf',
      name: 'Yash Raj Films',
      founder: 'Aditya Chopra',
      established: 1970,
      netWorth: 14000000000, // 1,400 Cr
      cash: 4200000000,
      reputation: 98,
      attitude: 'rival',
      signatureGenres: ['Spy Action', 'Romantic Drama', 'Big Spectacle'],
      isPublic: true,
      ticker: 'YRFM',
      filmsCount: 94,
      boxOfficeRecord: 12500000000,
      activeReleases: [
        { title: 'Tiger Immortal: Part 2', week: 3, weeklyGross: 45000000, totalGross: 380000000 }
      ],
      contractedStars: ['Shah Rukh Mir', 'Katrina Rai', 'Hrithik Anand']
    },
    {
      id: 'studio_dharma',
      name: 'Dharma Productions',
      founder: 'Karan Johar',
      established: 1976,
      netWorth: 8500000000, // 850 Cr
      cash: 2100000000,
      reputation: 95,
      attitude: 'neutral',
      signatureGenres: ['High Glamour Romance', 'Family Melodrama', 'Youth Drama'],
      isPublic: false,
      ticker: null,
      filmsCount: 68,
      boxOfficeRecord: 7800000000,
      activeReleases: [
        { title: 'The Royal Sovereign Romance', week: 1, weeklyGross: 82000000, totalGross: 82000000 }
      ],
      contractedStars: ['Alia Kapoor', 'Ranbir Dev', 'Kiara Advani']
    },
    {
      id: 'studio_redchillies',
      name: 'Red Chillies Entertainment',
      founder: 'Gauri & Shah Rukh Mir',
      established: 2002,
      netWorth: 12000000000, // 1,200 Cr
      cash: 3800000000,
      reputation: 96,
      attitude: 'friendly',
      signatureGenres: ['VFX Spectacles', 'Commercial Action', 'Global Sci-Fi'],
      isPublic: false,
      ticker: null,
      filmsCount: 42,
      boxOfficeRecord: 11500000000,
      activeReleases: [],
      contractedStars: ['Shah Rukh Mir', 'Deepika Sen']
    },
    {
      id: 'studio_tseries',
      name: 'T-Series Films',
      founder: 'Bhushan Kumar',
      established: 1983,
      netWorth: 16500000000, // 1,650 Cr
      cash: 5200000000,
      reputation: 94,
      attitude: 'aggressive',
      signatureGenres: ['Musical Masala', 'Chartbuster Action', 'Romantic Comedy'],
      isPublic: true,
      ticker: 'TSRM',
      filmsCount: 112,
      boxOfficeRecord: 14000000000,
      activeReleases: [
        { title: 'Animal Instincts Vol 2', week: 2, weeklyGross: 95000000, totalGross: 240000000 }
      ],
      contractedStars: ['Ranbir Dev', 'Tripti Dimri']
    },
    {
      id: 'studio_excel',
      name: 'Excel Entertainment',
      founder: 'Farhan Akhtar & Ritesh Sidhwani',
      established: 1999,
      netWorth: 4800000000, // 480 Cr
      cash: 1400000000,
      reputation: 91,
      attitude: 'friendly',
      signatureGenres: ['Urban Slick Drama', 'Buddy Comedy', 'Underworld Action'],
      isPublic: false,
      ticker: null,
      filmsCount: 38,
      boxOfficeRecord: 5500000000,
      activeReleases: [],
      contractedStars: ['Ranveer Bajwa']
    },
    {
      id: 'studio_maddock',
      name: 'Maddock Films',
      founder: 'Dinesh Vijan',
      established: 2005,
      netWorth: 3900000000, // 390 Cr
      cash: 1200000000,
      reputation: 92,
      attitude: 'neutral',
      signatureGenres: ['Horror Comedy', 'Small-town Quirky Romance', 'Social Satire'],
      isPublic: false,
      ticker: null,
      filmsCount: 34,
      boxOfficeRecord: 6200000000,
      activeReleases: [
        { title: 'Stree Chanderi Legends', week: 4, weeklyGross: 28000000, totalGross: 490000000 }
      ],
      contractedStars: ['Kriti Sanon', 'Rajkummar Rao']
    },
    {
      id: 'studio_hombale',
      name: 'Hombale Films',
      founder: 'Vijay Kiragandur',
      established: 2013,
      netWorth: 9800000000, // 980 Cr
      cash: 3400000000,
      reputation: 95,
      attitude: 'rival',
      signatureGenres: ['Pan-India Action Epics', 'Mythological Mass', 'Raw Grit'],
      isPublic: false,
      ticker: null,
      filmsCount: 22,
      boxOfficeRecord: 12200000000,
      activeReleases: [
        { title: 'Kantara Prophecy chapter 1', week: 2, weeklyGross: 110000000, totalGross: 290000000 }
      ],
      contractedStars: ['Prabhas Raju']
    },
    {
      id: 'studio_mythri',
      name: 'Mythri Movie Makers',
      founder: 'Naveen Yerneni',
      established: 2015,
      netWorth: 8200000000, // 820 Cr
      cash: 2600000000,
      reputation: 93,
      attitude: 'neutral',
      signatureGenres: ['Mass Action Blockbusters', 'South Masala', 'High Voltage Drama'],
      isPublic: false,
      ticker: null,
      filmsCount: 28,
      boxOfficeRecord: 9800000000,
      activeReleases: [],
      contractedStars: ['Allu Arjun-Varma', 'Samantha Prabhu']
    },
    {
      id: 'studio_balaji',
      name: 'Balaji Motion Pictures',
      founder: 'Ekta Kapoor',
      established: 2001,
      netWorth: 3200000000, // 320 Cr
      cash: 850000000,
      reputation: 84,
      attitude: 'aggressive',
      signatureGenres: ['Edgy Adult Comedy', 'Bold Thrillers', 'Commercial Masala'],
      isPublic: true,
      ticker: 'BTLF',
      filmsCount: 52,
      boxOfficeRecord: 4100000000,
      activeReleases: [],
      contractedStars: ['Ayushmann Khurrana']
    },
    {
      id: 'studio_nadiadwala',
      name: 'Nadiadwala Grandson',
      founder: 'Sajid Nadiadwala',
      established: 1955,
      netWorth: 6200000000, // 620 Cr
      cash: 1900000000,
      reputation: 88,
      attitude: 'neutral',
      signatureGenres: ['Big-Budget Action Comedy', 'Franchise Entertainers'],
      isPublic: false,
      ticker: null,
      filmsCount: 65,
      boxOfficeRecord: 7100000000,
      activeReleases: [],
      contractedStars: ['Kartik Aaryan', 'Varun Dhawan-Bahl']
    },
    {
      id: 'studio_geetha',
      name: 'Geetha Arts',
      founder: 'Allu Aravind',
      established: 1972,
      netWorth: 7400000000,
      cash: 2200000000,
      reputation: 92,
      attitude: 'friendly',
      signatureGenres: ['Telugu Megahits', 'Family Entertainers'],
      isPublic: false,
      ticker: null,
      filmsCount: 58,
      boxOfficeRecord: 8500000000,
      activeReleases: [],
      contractedStars: ['Ram Charan']
    },
    {
      id: 'studio_lyca',
      name: 'Lyca Productions',
      founder: 'Subaskaran Allirajah',
      established: 2014,
      netWorth: 11000000000,
      cash: 3900000000,
      reputation: 91,
      attitude: 'rival',
      signatureGenres: ['VFX Epics', 'Megabudget Tamil Features'],
      isPublic: false,
      ticker: null,
      filmsCount: 26,
      boxOfficeRecord: 10500000000,
      activeReleases: [],
      contractedStars: ['Rajinikanth Rao', 'Nayanthara Kurian']
    },
    {
      id: 'studio_zee',
      name: 'Zee Studios',
      founder: 'Zee Entertainment Group',
      established: 2012,
      netWorth: 9500000000,
      cash: 3100000000,
      reputation: 90,
      attitude: 'neutral',
      signatureGenres: ['Pan-India Distribution', 'Historic Biopics'],
      isPublic: true,
      ticker: 'ZEEL',
      filmsCount: 76,
      boxOfficeRecord: 9200000000,
      activeReleases: [],
      contractedStars: ['Manoj Bajpayee-Nath']
    },
    {
      id: 'studio_rsvp',
      name: 'RSVP Movies',
      founder: 'Ronnie Screwvala',
      established: 2017,
      netWorth: 2900000000,
      cash: 880000000,
      reputation: 90,
      attitude: 'friendly',
      signatureGenres: ['Content-Driven Military & Thrillers', 'Sports Biopics'],
      isPublic: false,
      ticker: null,
      filmsCount: 24,
      boxOfficeRecord: 4600000000,
      activeReleases: [],
      contractedStars: ['Vicky Kaushal']
    },
    {
      id: 'studio_sony',
      name: 'Sony Pictures India',
      founder: 'Sony Pictures Networks',
      established: 2007,
      netWorth: 4600000000,
      cash: 1600000000,
      reputation: 89,
      attitude: 'neutral',
      signatureGenres: ['Modern Quirky Comedy', 'High Concept Dramas'],
      isPublic: false,
      ticker: null,
      filmsCount: 40,
      boxOfficeRecord: 5200000000,
      activeReleases: [],
      contractedStars: []
    },
    {
      id: 'studio_reliance',
      name: 'Reliance Entertainment',
      founder: 'Reliance Group',
      established: 2005,
      netWorth: 7100000000,
      cash: 2100000000,
      reputation: 87,
      attitude: 'neutral',
      signatureGenres: ['Sports Dramas', 'Mass Cop Action Franchises'],
      isPublic: false,
      ticker: null,
      filmsCount: 62,
      boxOfficeRecord: 8100000000,
      activeReleases: [],
      contractedStars: ['Ajay Devgan-Rao']
    },
    {
      id: 'studio_tips',
      name: 'TIPS Films',
      founder: 'Kumar Taurani',
      established: 1988,
      netWorth: 3400000000,
      cash: 950000000,
      reputation: 83,
      attitude: 'neutral',
      signatureGenres: ['Musical Suspense', 'Action Thrillers'],
      isPublic: true,
      ticker: 'TIPS',
      filmsCount: 46,
      boxOfficeRecord: 3900000000,
      activeReleases: [],
      contractedStars: []
    },
    {
      id: 'studio_pen',
      name: 'Pen India Studios',
      founder: 'Jayantilal Gada',
      established: 1987,
      netWorth: 2800000000,
      cash: 720000000,
      reputation: 82,
      attitude: 'neutral',
      signatureGenres: ['Mass Commercial Releases', 'Dubbed South Hits'],
      isPublic: false,
      ticker: null,
      filmsCount: 44,
      boxOfficeRecord: 3600000000,
      activeReleases: [],
      contractedStars: []
    },
    {
      id: 'studio_pooja',
      name: 'Pooja Entertainment',
      founder: 'Vashu Bhagnani',
      established: 1995,
      netWorth: 2100000000,
      cash: 410000000,
      reputation: 76,
      attitude: 'aggressive',
      signatureGenres: ['Commercial Action Masala', 'Slapstick Comedy'],
      isPublic: false,
      ticker: null,
      filmsCount: 48,
      boxOfficeRecord: 3200000000,
      activeReleases: [],
      contractedStars: []
    },
    {
      id: 'studio_viacom18',
      name: 'Viacom18 Studios',
      founder: 'Network18',
      established: 2008,
      netWorth: 6400000000,
      cash: 1900000000,
      reputation: 91,
      attitude: 'neutral',
      signatureGenres: ['Biopics', 'Women-Centric Thrillers'],
      isPublic: false,
      ticker: null,
      filmsCount: 54,
      boxOfficeRecord: 7300000000,
      activeReleases: [],
      contractedStars: ['Taapsee Pannu']
    },
    {
      id: 'studio_eros',
      name: 'Eros International',
      founder: 'Kishore Lulla',
      established: 1977,
      netWorth: 5100000000,
      cash: 1100000000,
      reputation: 80,
      attitude: 'neutral',
      signatureGenres: ['Distribution Catalog', 'Classic Romance'],
      isPublic: true,
      ticker: 'EROS',
      filmsCount: 88,
      boxOfficeRecord: 6800000000,
      activeReleases: [],
      contractedStars: []
    },
    {
      id: 'studio_cleanslate',
      name: 'Clean Slate Filmz',
      founder: 'Karnesh Ssharma',
      established: 2013,
      netWorth: 1600000000,
      cash: 480000000,
      reputation: 89,
      attitude: 'friendly',
      signatureGenres: ['Feminist Supernatural Thrillers', 'Arthouse Streaming'],
      isPublic: false,
      ticker: null,
      filmsCount: 16,
      boxOfficeRecord: 2200000000,
      activeReleases: [],
      contractedStars: ['Tripti Dimri']
    },
    {
      id: 'studio_roykapur',
      name: 'Roy Kapur Films',
      founder: 'Siddharth Roy Kapur',
      established: 2017,
      netWorth: 1900000000,
      cash: 520000000,
      reputation: 90,
      attitude: 'friendly',
      signatureGenres: ['Inspiring Dramas', 'Thoughtful Biopics'],
      isPublic: false,
      ticker: null,
      filmsCount: 18,
      boxOfficeRecord: 2600000000,
      activeReleases: [],
      contractedStars: ['Vidya Balan-Dev']
    },
    {
      id: 'studio_sikhya',
      name: 'Sikhya Entertainment',
      founder: 'Guneet Monga',
      established: 2008,
      netWorth: 1100000000,
      cash: 340000000,
      reputation: 94,
      attitude: 'friendly',
      signatureGenres: ['Academy Award Indie Gems', 'Documentaries & Social Drama'],
      isPublic: false,
      ticker: null,
      filmsCount: 14,
      boxOfficeRecord: 1800000000,
      activeReleases: [],
      contractedStars: []
    },
    {
      id: 'studio_phantom',
      name: 'Phantom Legacy Studios',
      founder: 'Vikramaditya Motwane',
      established: 2011,
      netWorth: 2400000000,
      cash: 670000000,
      reputation: 88,
      attitude: 'neutral',
      signatureGenres: ['Gritty Neo-Noir', 'Cult Superhero Cinema'],
      isPublic: false,
      ticker: null,
      filmsCount: 22,
      boxOfficeRecord: 3400000000,
      activeReleases: [],
      contractedStars: ['Radhika Apte']
    }
  ];

  // 10 Dynamic Talent-Led Unicorn Studios (Top 10 slots)
  const initialUnicornStudios = [
    {
      id: 'unicorn_1',
      name: 'Aryan Shah Motion Pictures',
      founderName: 'Shah Rukh Mir',
      founderCategory: 'Megastar',
      netWorth: 1450000000, // 145 Cr
      cash: 420000000,
      reputation: 92,
      attitude: 'rival',
      status: 'active',
      isPublic: true,
      ticker: 'ASMP',
      filmsCount: 8,
      activeReleases: [
        { title: 'The Red Citadel', week: 2, weeklyGross: 35000000, totalGross: 84000000 }
      ],
      history: [1200000000, 1350000000, 1450000000]
    },
    {
      id: 'unicorn_2',
      name: 'Dev & Co. Cine Studios',
      founderName: 'Ranbir Dev',
      founderCategory: 'Superstar',
      netWorth: 1200000000, // 120 Cr
      cash: 380000000,
      reputation: 90,
      attitude: 'neutral',
      status: 'active',
      isPublic: false,
      ticker: null,
      filmsCount: 6,
      activeReleases: [],
      history: [1000000000, 1120000000, 1200000000]
    },
    {
      id: 'unicorn_3',
      name: 'Sen Supernova Films',
      founderName: 'Deepika Sen',
      founderCategory: 'Megastar',
      netWorth: 950000000, // 95 Cr
      cash: 290000000,
      reputation: 93,
      attitude: 'friendly',
      status: 'active',
      isPublic: true,
      ticker: 'SSNF',
      filmsCount: 5,
      activeReleases: [],
      history: [820000000, 910000000, 950000000]
    },
    {
      id: 'unicorn_4',
      name: 'Kapoor Legacy Works',
      founderName: 'Alia Kapoor',
      founderCategory: 'Superstar',
      netWorth: 880000000, // 88 Cr
      cash: 260000000,
      reputation: 91,
      attitude: 'neutral',
      status: 'active',
      isPublic: false,
      ticker: null,
      filmsCount: 4,
      activeReleases: [],
      history: [750000000, 840000000, 880000000]
    },
    {
      id: 'unicorn_5',
      name: 'Anand Stuntverse',
      founderName: 'Hrithik Anand',
      founderCategory: 'Megastar',
      netWorth: 760000000, // 76 Cr
      cash: 210000000,
      reputation: 89,
      attitude: 'rival',
      status: 'active',
      isPublic: false,
      ticker: null,
      filmsCount: 4,
      activeReleases: [],
      history: [680000000, 720000000, 760000000]
    },
    {
      id: 'unicorn_6',
      name: 'Qureshi Mass Media',
      founderName: 'Salman Qureshi',
      founderCategory: 'Megastar',
      netWorth: 680000000, // 68 Cr
      cash: 180000000,
      reputation: 87,
      attitude: 'aggressive',
      status: 'active',
      isPublic: false,
      ticker: null,
      filmsCount: 5,
      activeReleases: [],
      history: [600000000, 650000000, 680000000]
    },
    {
      id: 'unicorn_7',
      name: 'Varma Classic Studios',
      founderName: 'Amitabh Varma',
      founderCategory: 'Megastar',
      netWorth: 600000000, // 60 Cr
      cash: 190000000,
      reputation: 95,
      attitude: 'friendly',
      status: 'active',
      isPublic: false,
      ticker: null,
      filmsCount: 7,
      activeReleases: [],
      history: [580000000, 590000000, 600000000]
    },
    {
      id: 'unicorn_8',
      name: 'Mir Creative House',
      founderName: 'Gauri Mir',
      founderCategory: 'Superstar',
      netWorth: 540000000, // 54 Cr
      cash: 150000000,
      reputation: 88,
      attitude: 'friendly',
      status: 'active',
      isPublic: false,
      ticker: null,
      filmsCount: 3,
      activeReleases: [],
      history: [480000000, 510000000, 540000000]
    },
    {
      id: 'unicorn_9',
      name: 'Bajwa Powerhouse',
      founderName: 'Ranveer Bajwa',
      founderCategory: 'Superstar',
      netWorth: 450000000, // 45 Cr
      cash: 120000000,
      reputation: 86,
      attitude: 'neutral',
      status: 'active',
      isPublic: false,
      ticker: null,
      filmsCount: 3,
      activeReleases: [],
      history: [400000000, 420000000, 450000000]
    },
    {
      id: 'unicorn_10',
      name: 'Deshmukh Neo Cinema',
      founderName: 'Riteish Deshmukh',
      founderCategory: 'A-Lister',
      netWorth: 380000000, // 38 Cr
      cash: 95000000,
      reputation: 85,
      attitude: 'neutral',
      status: 'active',
      isPublic: false,
      ticker: null,
      filmsCount: 4,
      activeReleases: [],
      history: [350000000, 360000000, 380000000]
    }
  ];

  return {
    legacyStudios,
    initialUnicornStudios
  };
})();
