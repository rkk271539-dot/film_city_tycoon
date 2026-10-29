# Film City Tycoon (v1.06 Master Edition)

A deep, multi-turn studio management simulation where you and your partner build an Indian cinema empire from the ground up against rival studios, talent unicorn production houses, and Dalal Street market forces.

---

## 🌟 What's Included & Implemented

### 🚀 Production, Bidding & Talent Fame Scaling Fixes
- **Cinema Greenlight Button Restoration & Seamless Star Casting**:
  - Automatically defaults lead hero and heroine selections to signed studio artistes (with an 80% discount) or top available stars.
  - Quick-sign exclusive 3 to 36-month contracts directly from the casting modal or cast guest stars at standard market quotes.
  - Exported canonical `greenlightCinemaProject` and `launchCinemaFeature` aliases so production launches flawlessly onto the floor.
- **Commercial Photoshoot & Ad Film Exclusivity (Signed & Free Talent Only)**:
  - **Strict Studio Artiste Restriction**: Commercial photoshoots and ad films can only be headlined by artistes under an active, exclusive studio contract (1 to 36 months).
  - **Floor Availability Check**: Artistes currently filming on another production set (cinema features, web series, or concurrent commercial shoots) are marked busy and blocked until their ongoing shoot wraps.
  - **Clear Visual UI & Guidance**: The Commercial Quick Project screen dynamically detects free vs busy studio artistes, lists busy stars as disabled with active shoot details, and provides quick shortcuts to scout or sign new talent when no free artistes are available.
- **Custom Commercial Shoot Execution & Realistic Endorsement Quotes**:
  - Attached full event listener and state pipeline for `#btnLaunchCommission`.
  - Realistic ad fees for commercial photoshoots and short ad films (~5% of feature movie fees, capped at ₹75 Lakhs with 80% signed discount) ensuring accessible, profitable ad shoots.
  - Commercial shoots automatically record lead talent and deliver fan growth and studio payout on completion.
- **RFP Client Bidding System & Star Ambassador Fame Scaling**:
  - Fixed bidding button crash by standardizing result object returns across win, rival loss, and studio soundstage capacity checks.
  - **Dynamic Talent Attachment**: Attach signed stars or top talent to RFP briefs as brand ambassadors.
  - **Fame Multipliers**: Star fame directly increases effective client RFP budget (up to 2.8x for Megastars), raises bid appeal points (+42 pts), and boosts projected revenue and profit margins.
  - High star fame significantly increases contract win odds even at premium bid margins.


### 🚀 New in v1.06: Dynamic Stock Market Realism, Autonomous Rival Studios & Procedural 400+ Film Titles
- **Dynamic Two-Way Stock Market Engine & Infinite Money Exploit Fix**:
  - Replaced one-way upward drift with authentic Dalal Street market regimes (*Bull Rally, Institutional Profit Booking, Bear Corrections, and Value Accumulation*).
  - **Institutional Profit Booking (RSI > 68)**: Smart money dumps shares into overbought rallies, pulling RSI down and causing realistic corrections (-2% to -6%).
  - **Value Hunter Dip Buying (RSI < 35)**: Deep oversold conditions trigger institutional accumulation and relief bounces.
  - **Dynamic Technical Indicators**: Wilder 14-Day RSI oscillates naturally between 15 and 90, smoothly transitioning trend signals between *Strong Bearish, Bearish, Neutral, Bullish,* and *Strong Bullish*.
  - **Corporate Catalysts & News Reactions**:
    - Hit / Blockbuster wrap surges company stock (+5% to +8% upper circuit test).
    - Flop / Box office disaster triggers immediate panic dumps (-4% to -8% circuit drop).
    - P/E ratio gravity & Debt-to-Equity balance sheet burdens penalize overleveraged stocks during sector downturns.
    - Diminishing returns formula caps mega-cap stocks from spiraling to infinity.
  - **Player Studio Public Realism**: Player studio shares fluctuate based on actual net operating income, active releases, box office verdicts, and debt ratios.
- **Autonomous Rival Studio Production Pipeline**:
  - All 35 rival studios (25 Indian Legacy Giants & 10 Dynamic Unicorns) now actively greenlight, film, and release feature films and OTT web series.
  - Studios cast their own contracted stars or top industry free agents.
  - Active productions progress through filming (50–90 days), premiere in theatres/OTT, and run 4–6 week box office cycles with natural weekly gross decay.
- **Procedural 400+ Combinatorial Film & Series Title Generator**:
  - Generates over 50,000+ distinct, authentic 3-4 word titles pairing prefixes, nouns, action modifiers, and series keywords.
  - Examples: *"The Deadly Underworld: Syndicate Unleashed"*, *"Vanguard Falcon: Beyond Borders"*, *"Rebel Kingdom: In Blood"*, *"Monsoon: The Heist"*, *"Brahm Dominion: Operation Red"*.
- **Studio All-Time Top 5 Box Office Blockbusters & Star Cast**:
  - In the Studio Inside dossier screen, a dedicated **🏆 Top 5 All-Time Hits** card showcases the studio's greatest box office champions.
  - Features gold, silver, and bronze rank medals (🥇 #1, 🥈 #2, 🥉 #3, 🎬 #4, #5), film title, format, star cast, director, lifetime worldwide box office gross, trade verdicts (*All-Time Blockbuster, Blockbuster, Super Hit, Hit*), and ROI multipliers.
  - Starter top 5 hits pre-populated for all 25 Legacy studios and 10 Unicorns (e.g. YRF's *Pathaan*, Dharma's *Brahmāstra*, T-Series' *Animal*, Red Chillies' *Jawan*, Hombale's *K.G.F Chapter 2*, Mythri's *Pushpa 2*, Lyca's *2.0*).
  - Automatically updates whenever a new release exceeds a historical hit!
  - Player studio's own Top 5 releases can also be viewed by clicking 'Your Studio' in the national ranking leaderboard!

---

### 🌟 Features from v1.05 Fixes & Expansion
- **Card-Based Visual Hub Navigation (Actions, Bank & Studios)**:
  - Interactive Cards Grid Hubs replace legacy cluttered sub-tabs.
  - Hubs isolate active views on click, hiding other cards and providing seamless `← Back to Hub` navigation.
  - Actions Hub: *🎬 Greenlight Cinema*, *🎥 Active Production Pipeline*, *📜 Past Projects Vault*, *👑 Lifestyle & Personal Assets*, *📋 Client RFP Bids*, and *🏢 Studio Lot Upgrades*.
  - Bank Treasury Hub: *💰 Commercial Term Loans*, *⚡ Mezzanine Bridge Credit*, *📋 Active Debt & Amortization*, and *🏦 High-Yield Fixed Deposits*.
  - Studio Dossier Hub: *⭐ Contracted Stars*, *🏆 Top 5 All-Time Hits*, *🏛️ Financials & Studio IP*, *🎟️ Theatrical Runs*, and *🤝 Co-Production Alliances*.
- **Past Projects Vault & Detailed Financial Statement Audits**:
  - Permanent archival of all completed productions in the studio vault.
  - Full-screen **Audited Financial Statement Modal**: Itemized outflows (Talent quotes, set construction, 4K camera optics, marketing blitz, censor board & post), inflows (Theatrical gross & 50% distributor share, OTT NetPrime licensing, YouTube royalties), and net profit ROI ledger.
- **Web Series Long-Tail Recurring Streaming Royalties (OTT & YouTube)**:
  - Web series don't just stop at premiere: they enter the **Active Streaming Catalog** generating recurring daily streaming royalties and YouTube AdSense revenue for 180 days with organic decay.
- **Talent Debt Notes on Balance Sheet & Secondary Debt Trading Market**:
  - Studio doesn't just forgive debt: you **acquire distressed debt notes** from creditors for emerging starlets, commercial models, and rising talents.
  - Stars are indebted to your studio, unlocking 98+ loyalty and a permanent 45% production discount.
  - **Secondary Debt Market**: As your star ascends, rival studios (Dharma, YRF, Excel) submit lucrative **Debt Buyout Offers** (2x to 4x of original debt)! You can accept buyout offers for massive capital gains, reject to retain exclusivity, or forgive for a 5-year contract lock.
- **Talent Investments & Development Actions with Diminishing Returns**:
  - 8 rich interactive actions: *Celebrity Fitness & Nutrition Bootcamp*, *Commercial Brand Ad Blitz*, *National Drama School Masterclass*, *Haute Couture Glamour Makeover*, *National Viral PR Media Blitz*, *Soho House VIP Power Lunch*, *Luxury Timepieces*, and *Tabloid Paparazzi Hush Money*.
  - Diminishing returns scaling: Lower fame talents gain +5% to +8% fan surges; mega-celebrities (> 20M fans) gain realistic +0.5% to +1.2% proportional boosts.
- **Flexible 3 to 36-Month Contracts**:
  - Select contract durations: 3, 6, 12, 18, 24, 30, or 36 months to ensure long pipeline projects are fully covered.
- **Rival Studio Star Poaching**:
  - Live `⚡ Poach Star` buyout mechanism allowing you to buy out rival contracts.

---

### 1. 🌟 Full Talent Roster & Star System
- **300+ Indian Cinema Artistes (152 Actresses & 152 Actors)**:
  - Spans *Megastars & Legends*, *Superstars*, *A-Listers*, *Critically Acclaimed Titans*, *Rising Starlets*, *Commercial Models*, and *Newcomers*.
  - Star profiles inspired by Indian cinema legends and dynamic fresh talent.
  - Procedural SVG face generator generating 500+ diverse facial combinations across all genders and traits.
- **Deep Artiste Stats & Screen Image Constraints**:
  - `Reputation` (0-100), `Glamour / Beauty` (0-100), `Acting Prowess` (0-100), `Fitness & Stamina` (0-100).
  - **Fan Following**: Measured realistically in Millions and Lakhs (e.g. 68M Fans).
  - **Screen Image Boundary**: *Pure / Wholesome* (strict no-kissing/no-intimacy clauses), *Romantic*, *Bold & Sensational*, and *Method / Unrestricted*.
  - **Personal Debts & Dynamic Relations**: Stars form personal friendships, rivalries, and trade ties with studios.

---

### 2. 🎬 Feature Films & Multi-Turn Cinema Pipeline
- **5 Cinema Production Tiers**:
  - *Short Film* (4 weeks &bull; Festival circuit & digital syndication)
  - *Web Series Season* (2.5 months &bull; 5-week streaming drop cycle + 180-day recurring royalties)
  - *Small Budget Indie Film* (3 months &bull; 2-week theatrical run)
  - *Mid Budget Commercial Film* (5.5 months &bull; 4-week theatrical run)
  - *Big Budget Blockbuster* (8.5 months &bull; 5-week pan-India theatrical extravaganza)
- **7 Mainstream Cinema Genres**:
  - *Action Masala & Stunts*, *Grand Romantic Drama*, *Spyverse & Espionage*, *Horror Comedy*, *Mythological Epic*, *Underworld Crime & Mafia*, *Social Satire*.
- **Creative Star Packaging & Casting**:
  - Cast Lead Actor and Lead Actress directly from your signed studio roster (80% discount) or hire outside talent.
- **Multi-Phase Production Pipeline**:
  - *Phase 1: Pre-Production & Casting* &rarr; *Phase 2: Principal Photography (Floor Shoot)* &rarr; *Phase 3: Post-Production & Censor Board* &rarr; *Phase 4: Marketing Blitz & Trailer Launch* &rarr; *Phase 5: Theatrical Box Office Run*.

---

### 3. 🏢 The 25 Indian Legacy Studios & 10 Dynamic Unicorns
- **25 Baseline Indian Production Houses**:
  - *Yash Raj Films, Dharma Productions, Red Chillies Entertainment, T-Series Films, Excel Entertainment, Maddock Films, Hombale Films, Mythri Movie Makers, Balaji Motion Pictures, Nadiadwala Grandson, Geetha Arts, Lyca Productions, Zee Studios, RSVP Movies, Sony Pictures India, Reliance Entertainment, TIPS Films, Pen India, Pooja Entertainment, Viacom18 Studios, Eros International, Clean Slate Filmz, Roy Kapur Films, Sikhya Entertainment, Phantom Legacy*.
  - Dynamic production pipelines, live box office tracking, contracted stars, and All-Time Top 5 hits.
- **Top 10 Talent Unicorn Studios**:
  - Boutique production houses founded and run by actors and actresses (*Aryan Shah Motion Pictures, Dev & Co., Sen Supernova, Kapoor Legacy, etc.*).
  - Dynamic rise and collapse: If a Unicorn studio falls below ₹15 Cr net worth due to box office disasters, it triggers **Unicorn Bankruptcy & Collapse**!
- **National Win Condition**:
  - Maintain the **Rank #1 Studio in India for 3 consecutive years** (1,095 days).

---

### 4. 📈 Dalal Street Stock Market & Circuit Breakers
- **Live Financial Exchange**:
  - Lists public studios, media conglomerates, and cinema exhibitors (*TSRM, YRFM, ZEEL, PVRI, BTLF, SRGM, TIPS, EROS, ASMP*).
  - **Strict -8% to +8% Circuit Breaker Daily Limit**: Daily price movements are strictly capped to ensure realistic multi-day rallies and corrections.
- **Order-Book Pressure & Technical Analysis Engine**:
  - Buy Pressure vs Sell Pressure gauge with demand indicators.
  - Real-time technical indicators: 20-Day SMA, 14-Day RSI, and trend signals.
  - Interactive Canvas 30-day stock chart.
  - Fundamental metrics: P/E ratio, Market Cap, Debt-to-Equity, Cash Reserves.
- **Portfolio Management & IPO**:
  - Trade listed securities, track unrealized P&L, float your studio via IPO (10% to 35% public float) once meeting SEBI criteria.

---

### 5. 📰 Trade Wire, Paparazzi Scandals & Annual Awards Gala
- **Trade Wire Bulletins**: Weekly box office collections, release clashes, censor cuts, and corporate news.
- **Annual National Cinema / Filmfare Awards Gala (Every December 31st)**: Celebrated every December 31st (Days 365, 730, 1095...).

---

## 🛠️ Architecture & Tech Stack

- **Zero External Dependencies**: Pure Vanilla ES6+ JavaScript, CSS3 variables, and HTML5 canvas charts.
- **Modular Design**:
  - `js/data/`: Baseline datasets (`talentData.js`, `studiosData.js`, `marketData.js`).
  - `js/systems/`: Core simulation engines (`clock.js`, `finance.js`, `talent.js`, `pipeline.js`, `studios.js`, `market.js`, `events.js`, `face.js`).
  - `js/ui/`: Dedicated modular screen components (`talentScreen.js`, `actionsScreen.js`, `studiosScreen.js`, `marketScreen.js`, `bankScreen.js`).
  - `js/state.js`: Central reactive state manager with local storage autosave & multi-slot manual save/load.
- **Visuals**: Dark-mode Obsidian luxury aesthetics, Gold and Emerald accents, dynamic responsive grid layouts.

---

## 🎮 How to Play

1. **Launch**: Open `index.html` in any modern web browser.
2. **Sign Artistes**: Scout talent in the **Talent** screen, negotiate 3–36 month contracts, or acquire distressed talent debt notes.
3. **Greenlight Cinema**: Open **Actions & Pipeline** &rarr; *🎬 Greenlight Cinema*, select budget tier, genre, and cast.
4. **Advance Turns**: Use `▶ Next Day`, `+7D`, or `+30D` to progress production, box office runs, and market ticks.
5. **Trade on Dalal Street**: Buy shares in undervalued media houses during bear corrections, monitor RSI, and sell during overbought euphoria.
6. **Compete with Rivals**: Scout rival studio dossiers, inspect their Top 5 hits, poach stars, and climb to #1!
