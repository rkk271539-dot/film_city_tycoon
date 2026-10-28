/**
 * Starting Skill Definitions
 * One permanent skill chosen at game creation (+25% focused bonus, non-upgradeable).
 */

window.StudioGame = window.StudioGame || {};
window.StudioGame.Data = window.StudioGame.Data || {};

window.StudioGame.Data.Skills = [
  {
    id: 'talented_writer',
    name: 'Talented Writer',
    icon: '✍️',
    tagline: '+25% Script Quality',
    description: 'Master of narrative rhythm and dialogue. Your projects naturally start with higher script ratings, leading to stronger critical praise and award recognition.',
    bonusField: 'script_quality',
    bonusMultiplier: 1.25
  },
  {
    id: 'brilliant_manager',
    name: 'Brilliant Manager',
    icon: '📊',
    tagline: '+25% Cost Reduction',
    description: 'Keen eye for production discipline. Slashes equipment rents, set waste, and overrun overheads by 25%, preserving vital liquid capital.',
    bonusField: 'cost_reduction',
    bonusMultiplier: 0.75
  },
  {
    id: 'marketing_guru',
    name: 'Marketing Guru',
    icon: '📣',
    tagline: '+25% Marketing & Hype',
    description: 'Knows how to capture public imagination. Every trailer, promotional tour, and press conference generates 25% more initial buzz and opening weekend footfalls.',
    bonusField: 'marketing_hype',
    bonusMultiplier: 1.25
  },
  {
    id: 'sharp_negotiator',
    name: 'Sharp Negotiator',
    icon: '🤝',
    tagline: '+25% Negotiation Power',
    description: 'Unflinching across the boardroom table. Secures 25% better talent contract terms, lower bank loan interest, and winning margins in competitive bids.',
    bonusField: 'negotiation_advantage',
    bonusMultiplier: 1.25
  },
  {
    id: 'talent_scout',
    name: 'Talent Scout',
    icon: '🔍',
    tagline: '+25% Talent Discovery',
    description: 'Spots diamond-in-the-rough newcomers before anyone else. Reveals hidden chemistry, ego flags, and true growth ceilings with unmatched precision.',
    bonusField: 'talent_discovery',
    bonusMultiplier: 1.25
  }
];
