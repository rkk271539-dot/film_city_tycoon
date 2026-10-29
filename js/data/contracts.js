/**
 * Contract Bids & Commercial Shoot Data
 * Defines client brands, commercial genres, RFP templates, and starter commercial talent pool.
 */

window.StudioGame = window.StudioGame || {};
window.StudioGame.Data = window.StudioGame.Data || {};

window.StudioGame.Data.Contracts = {
  genres: [
    { id: 'fashion', name: 'Haute Couture & Fashion', icon: '👗', multiplier: 1.15 },
    { id: 'luxury_lifestyle', name: 'Luxury Lifestyle & Jewelry', icon: '💎', multiplier: 1.25 },
    { id: 'automobile', name: 'Automobile & Sports', icon: '🏎️', multiplier: 1.20 },
    { id: 'fmcg_beverage', name: 'Youth Beverage & Snacks', icon: '🥤', multiplier: 1.05 },
    { id: 'tech_gadgets', name: 'Smartphones & Electronics', icon: '📱', multiplier: 1.10 },
    { id: 'beauty_cosmetics', name: 'Skincare & Cosmetics', icon: '💄', multiplier: 1.15 }
  ],

  starterTalent: [
    {
      id: 'talent_starter_1',
      name: 'Simran Ahuja',
      category: 'Commercial Model',
      avatarSeed: 'simran_ahuja',
      gender: 'female',
      flatFee: 35000,
      reputation: 35,
      glamour: 65,
      acting: 40,
      bio: 'Popular face in Mumbai print catalogs and bridal fashion weeks.'
    },
    {
      id: 'talent_starter_2',
      name: 'Rohan Mehra',
      category: 'Fitness & Auto Model',
      avatarSeed: 'rohan_mehra',
      gender: 'male',
      flatFee: 40000,
      reputation: 38,
      glamour: 60,
      acting: 45,
      bio: 'Known for athletic physique; frequent lead in energy drink and motorcycle shoots.'
    },
    {
      id: 'talent_starter_3',
      name: 'Ananya Deshmukh',
      category: 'Editorial Actress',
      avatarSeed: 'ananya_deshmukh',
      gender: 'female',
      flatFee: 65000,
      reputation: 48,
      glamour: 72,
      acting: 58,
      bio: 'Theatre-trained talent transitioning into high-end streaming commercial ads.'
    },
    {
      id: 'talent_starter_4',
      name: 'Vikramaditya Roy',
      category: 'Commercial Lead',
      avatarSeed: 'vikram_roy',
      gender: 'male',
      flatFee: 75000,
      reputation: 52,
      glamour: 68,
      acting: 64,
      bio: 'Charismatic screen presence, seasoned in television commercials and corporate campaigns.'
    },
    {
      id: 'talent_starter_5',
      name: 'Meera Sen',
      category: 'Runway Specialist',
      avatarSeed: 'meera_sen',
      gender: 'female',
      flatFee: 90000,
      reputation: 58,
      glamour: 82,
      acting: 50,
      bio: 'A-list runway model frequently featured on luxury lifestyle magazine covers.'
    }
  ],

  clients: [
    { name: 'Vogue India', brandTier: 'Luxury Fashion', preferredGenre: 'fashion', budgetMultiplier: 1.3 },
    { name: 'Titan Edge Watches', brandTier: 'Premium Lifestyle', preferredGenre: 'luxury_lifestyle', budgetMultiplier: 1.25 },
    { name: 'Sabyasachi Heritage', brandTier: 'High Luxury', preferredGenre: 'fashion', budgetMultiplier: 1.4 },
    { name: 'Royal Enfield', brandTier: 'Automobile', preferredGenre: 'automobile', budgetMultiplier: 1.2 },
    { name: 'Lakme Absolute', brandTier: 'Cosmetics', preferredGenre: 'beauty_cosmetics', budgetMultiplier: 1.15 },
    { name: 'Thums Up Storm', brandTier: 'Commercial Beverage', preferredGenre: 'fmcg_beverage', budgetMultiplier: 1.1 },
    { name: 'OnePlus Flagship', brandTier: 'Tech Enterprise', preferredGenre: 'tech_gadgets', budgetMultiplier: 1.25 },
    { name: 'FabIndia Festive', brandTier: 'Ethnic Lifestyle', preferredGenre: 'fashion', budgetMultiplier: 1.05 }
  ],

  rivalBidderNames: [
    'Dharma Digital', 'Yash Raj Commercials', 'Excel Media Works',
    'T-Series Ad Division', 'Nadiadwala Creative', 'Balaji Ad Films',
    'Roy Kapur Content', 'Phantom Commercials'
  ]
};
