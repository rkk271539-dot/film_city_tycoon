/**
 * Studio Upgrades & Facilities Catalog Data
 * Defines facility expansions, capital costs, daily maintenance bills, and operational perks.
 */

window.StudioGame = window.StudioGame || {};
window.StudioGame.Data = window.StudioGame.Data || {};

window.StudioGame.Data.Upgrades = [
  {
    id: 'sound_stage_tier2',
    name: 'Acoustic Sound Stage II',
    category: 'Infrastructure',
    icon: '🎙️',
    cost: 1500000, // ₹15 Lakhs
    dailyOverhead: 350, // +₹350/day electricity & air conditioning
    assetValuationBoost: 1500000,
    perkText: '+1 Concurrent Shoot Capacity & +6% Base Project Quality',
    perkType: 'capacity_and_quality',
    capacityBonus: 1,
    qualityBonus: 6,
    description: 'Expanded 4,000 sq ft soundproof studio floor with mechanized lighting grid and green screen backdrop.'
  },
  {
    id: 'camera_package_4k',
    name: 'High-End 4K Cinema Camera Rig',
    category: 'Equipment',
    icon: '🎥',
    cost: 1000000, // ₹10 Lakhs
    dailyOverhead: 200, // +₹200/day maintenance & insurance
    assetValuationBoost: 1000000,
    perkText: '+10% Visual Quality on Photoshoots & Ads',
    perkType: 'quality_boost',
    qualityBonus: 10,
    description: 'Two flagship digital cinema bodies with prime anamorphic lens kit and wireless video monitoring.'
  },
  {
    id: 'editing_color_suite',
    name: 'Post-Production & Color Suite',
    category: 'Post-Production',
    icon: '💻',
    cost: 800000, // ₹8 Lakhs
    dailyOverhead: 150, // +₹150/day software licenses & cooling
    assetValuationBoost: 800000,
    perkText: 'Speeds up commercial wrap times by 20% & +5% Delivery Rating',
    perkType: 'speed_boost',
    speedMultiplier: 0.80,
    qualityBonus: 5,
    description: 'Calibrated OLED reference monitors with dedicated DaVinci color grading hardware control panels.'
  },
  {
    id: 'prop_wardrobe_vault',
    name: 'Prop & Haute Wardrobe Archive',
    category: 'Wardrobe & Props',
    icon: '👔',
    cost: 600000, // ₹6 Lakhs
    dailyOverhead: 120, // +₹120/day climate control
    assetValuationBoost: 600000,
    perkText: 'Reduces Shoot Wardrobe & Set Dressing rental costs by 20%',
    perkType: 'cost_saver',
    costReductionRatio: 0.20,
    description: 'Curated collection of period props, luxury designer garments, and set furniture, slashing external rental fees.'
  },
  {
    id: 'vip_green_room',
    name: 'Celebrity Green Room & Lounge',
    category: 'Hospitality',
    icon: '🛋️',
    cost: 500000, // ₹5 Lakhs
    dailyOverhead: 100, // +₹100/day hospitality
    assetValuationBoost: 500000,
    perkText: '+15% Client & Talent Satisfaction on Shoot Delivery',
    perkType: 'satisfaction_boost',
    satisfactionBonus: 15,
    description: 'Private dressing suites with luxury vanity mirrors, espresso bar, and soundproof relaxation space for top stars.'
  }
];
