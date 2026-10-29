/**
 * Dalal Street Stock Market Initial Data & Tickers
 * Listed studios, media conglomerates, cinema exhibition giants, and initial pricing.
 */

window.StudioGame = window.StudioGame || {};
window.StudioGame.Data = window.StudioGame.Data || {};

window.StudioGame.Data.Market = (function() {
  const initialListedCompanies = [
    {
      ticker: 'TSRM',
      name: 'T-Series Media & Films Ltd.',
      sector: 'Film Production & Music Publishing',
      sharePrice: 840,
      sharesTotal: 20000000,
      peRatio: 24.5,
      debtEquity: 0.18,
      cashReserves: 5200000000,
      buyPressure: 64, // 64% buy, 36% sell
      trend: 'bullish',
      rsi: 58,
      history: [790, 805, 812, 825, 832, 840],
      dayChangePct: 1.2
    },
    {
      ticker: 'YRFM',
      name: 'Yash Raj Media Works Ltd.',
      sector: 'Cinema Franchise & Spyverse',
      sharePrice: 1420,
      sharesTotal: 10000000,
      peRatio: 31.2,
      debtEquity: 0.12,
      cashReserves: 4200000000,
      buyPressure: 72,
      trend: 'strong_bullish',
      rsi: 66,
      history: [1320, 1345, 1380, 1395, 1410, 1420],
      dayChangePct: 2.1
    },
    {
      ticker: 'ZEEL',
      name: 'Zee Entertainment Enterprises',
      sector: 'Broadcasting & Theatrical Distribution',
      sharePrice: 155,
      sharesTotal: 60000000,
      peRatio: 18.4,
      debtEquity: 0.42,
      cashReserves: 3100000000,
      buyPressure: 45,
      trend: 'neutral',
      rsi: 48,
      history: [162, 160, 158, 156, 154, 155],
      dayChangePct: -0.6
    },
    {
      ticker: 'PVRI',
      name: 'PVR Inox Multiplex Theatres',
      sector: 'Exhibition & Single-Screen Chains',
      sharePrice: 1350,
      sharesTotal: 9800000,
      peRatio: 28.0,
      debtEquity: 0.55,
      cashReserves: 1800000000,
      buyPressure: 58,
      trend: 'bullish',
      rsi: 54,
      history: [1290, 1310, 1335, 1340, 1345, 1350],
      dayChangePct: 0.8
    },
    {
      ticker: 'BTLF',
      name: 'Balaji Telefilms & Pictures',
      sector: 'Commercial Drama & OTT Content',
      sharePrice: 62,
      sharesTotal: 50000000,
      peRatio: 16.2,
      debtEquity: 0.35,
      cashReserves: 850000000,
      buyPressure: 42,
      trend: 'bearish',
      rsi: 41,
      history: [68, 66, 65, 63, 62, 62],
      dayChangePct: -1.5
    },
    {
      ticker: 'SRGM',
      name: 'Saregama India Music & IP',
      sector: 'Music Rights & Retro Catalog',
      sharePrice: 480,
      sharesTotal: 19000000,
      peRatio: 35.8,
      debtEquity: 0.05,
      cashReserves: 1400000000,
      buyPressure: 68,
      trend: 'bullish',
      rsi: 62,
      history: [440, 452, 465, 470, 476, 480],
      dayChangePct: 1.8
    },
    {
      ticker: 'TIPS',
      name: 'TIPS Industries & Films',
      sector: 'Music Streaming & Feature Production',
      sharePrice: 395,
      sharesTotal: 8500000,
      peRatio: 22.4,
      debtEquity: 0.08,
      cashReserves: 950000000,
      buyPressure: 55,
      trend: 'neutral',
      rsi: 51,
      history: [385, 388, 390, 392, 396, 395],
      dayChangePct: 0.4
    },
    {
      ticker: 'EROS',
      name: 'Eros Media International',
      sector: 'Global Distribution & Catalog',
      sharePrice: 28,
      sharesTotal: 80000000,
      peRatio: 12.1,
      debtEquity: 0.82,
      cashReserves: 410000000,
      buyPressure: 32,
      trend: 'strong_bearish',
      rsi: 33,
      history: [34, 32, 31, 30, 29, 28],
      dayChangePct: -3.2
    },
    {
      ticker: 'ASMP',
      name: 'Aryan Shah Motion Pictures',
      sector: 'Talent Unicorn Boutique Cinema',
      sharePrice: 215,
      sharesTotal: 7000000,
      peRatio: 26.0,
      debtEquity: 0.15,
      cashReserves: 420000000,
      buyPressure: 76,
      trend: 'bullish',
      rsi: 65,
      history: [195, 202, 208, 210, 212, 215],
      dayChangePct: 2.8
    }
  ];

  return {
    initialListedCompanies
  };
})();
