# Film City Tycoon (v0.3 Actions & Commercial Pipeline)

A deep, multi-turn studio management simulation where you and your partner build an Indian cinema empire from the ground up against rival studios and unicorn production houses.

---

## 🌟 Version 0.3: Actions Tab, Commercial Bidding & Studio Upgrades

This major update unlocks the **Actions Tab (0.3)**, introducing the entry-level commercial tier of Bollywood production: Photoshoots and Short Ad Films, competitive client bidding against rival studios, an itemized pre-production cost audit bill, starter commercial talent, and studio facility upgrades.

### What's New in v0.3:
- **Actions Tab Unlocked**:
  - The `Actions` icon on the bottom scrollable navigation bar is now fully operational!
- **Competitive Client Bidding Engine (Photoshoots & Ads)**:
  - Commercial client RFPs from iconic Indian & global brands: *Vogue India*, *Sabyasachi Heritage*, *Titan Edge*, *Lakme Absolute*, *Royal Enfield*, and more.
  - Competing against top Mumbai production houses (*Dharma Digital*, *Yash Raj Commercials*, *Excel Media*, *T-Series Ad Division*).
  - Bid Offer slider allows you to calibrate price competitiveness versus packaging quality.
  - Win algorithm takes into account founder skill perks (*Talented Writer* +25% script, *Sharp Negotiator* +25% scoring advantage) and wife executive bonuses (*Studio Creative Head* +10% quality).
- **Multi-Turn Production Pipeline**:
  - Commercial shoots are multi-turn pipelines rather than instant click-and-collect:
    - *Photoshoots*: 1 to 3 days to wrap.
    - *Short Ad Films*: 7 to 14 days to wrap.
  - Multi-stage pipeline progression (*Pre-Production* &rarr; *Active Floor Shoot* &rarr; *Post-Production & Client Review* &rarr; *Delivery & Wrap*).
  - Payouts are credited directly to studio working capital on delivery, boosting Studio Reputation and Net Worth.
- **Itemized Project Cost Bill (Section 3.25)**:
  - Mandatory transparent audit before greenlighting any custom shoot:
    - Line items: *Lead Talent Flat Fee*, *Sound Stage Rent*, *4K Camera Optics*, *Technical Crew*, *Location Permits*, *Wardrobe & Props*, *Color Grading Master*, and *Contingency Overrun Buffer (8%)*.
    - *Brilliant Manager* founder skill automatically slashes production costs by 25%.
    - Live calculation of cash remaining after signature; blocks signing if funds are insufficient.
- **Starter Commercial Talent Pool**:
  - 5 hirable commercial models & editorial talent with transparent flat fees (₹35,000 to ₹90,000) and glamour/acting ratings.
- **Studio Upgrades & Facility Expansions (Section 3.21)**:
  - Invest in the studio lot to permanently increase studio asset valuation (boosting Studio Net Worth):
    - 🎙️ *Acoustic Sound Stage II* (₹15 Lakhs &bull; +1 Concurrent Shoot Capacity, +6% Quality, +₹350/day electricity)
    - 🎥 *High-End 4K Cinema Camera Rig* (₹10 Lakhs &bull; +10% Visual Quality, +₹200/day maintenance)
    - 💻 *Post-Production & Color Suite* (₹8 Lakhs &bull; Speeds up shoot wrap times by 20%, +₹150/day license)
    - 👔 *Prop & Haute Wardrobe Archive* (₹6 Lakhs &bull; Cuts wardrobe rental fees by 20%, +₹120/day climate control)
    - 🛋️ *Celebrity Green Room & Lounge* (₹5 Lakhs &bull; +15% Client & Talent Satisfaction, +₹100/day upkeep)

---

## 🌟 Version 0.2: Wife Autonomous Career Engine (Included)
- **Autonomous Career Engine**: 10 independent career paths for your partner (Studio Creative Head, Marketing Head, Casting Head, Finance Chief, Actress, Model, Producer, Brand Founder, Angel Investor, Sabbatical).
- **Career Nudging**: Guide and influence her next career transition.
- **Skill Progression**: Acting, Glamour, Business, and Creative proficiencies level up with experience.
- **Fitness & Romance**: 3 tiers of wellness investments and date night experiences.
- **Living Career Chronicle**: Historical timeline of all career shifts and contracts.

---

## 🌟 Version 0.1: Foundation & Dashboard (Included)
- **Architecture**: Pure client-side HTML5/ES6 architecture with `window.StudioGame` namespace, running on any browser or GitHub Pages without build steps.
- **Obsidian Dark Theme**: Mobile-first portrait layout, 44px+ tap targets, glassmorphism cards.
- **Founder Customization**: Vector procedural avatars or local photo upload with canvas square cropping.
- **5 Specialization Skills**: Permanent +25% non-upgradeable bonuses (*Talented Writer*, *Brilliant Manager*, *Marketing Guru*, *Sharp Negotiator*, *Talent Scout*).
- **Day Turn Clock & Real Aging**: Calendar progression with birthday celebrations.
- **Interactive Canvas Chart**: Touch-friendly Net Worth trends with `7D`, `30D`, `90D`, `1Y`, `ALL` filters.
- **Robust Multi-Slot Save System**: Rolling autosaves with rollback checkpoints, 3 manual slots, and JSON export/import.

---

## 📁 Project Structure

```
├── index.html               # Main entry point & script orchestration
├── REQUIREMENTS.md          # Complete master design specification (0.1 to 2.0)
├── README.md                # Project documentation and roadmap
├── css/
│   └── style.css            # Modern dark theme responsive styling (v0.1 to v0.3)
└── js/
    ├── face.js              # Procedural SVG vector portrait generator & image cropper
    ├── state.js             # Global state, rolling autosave, manual slots & JSON export
    ├── main.js              # Game loop, screen router & navigation controller
    ├── data/
    │   ├── skills.js        # 5 permanent founder skills
    │   ├── events.js        # Daily news bulletins & milestone triggers
    │   ├── contracts.js     # Client brands, commercial genres & starter talent
    │   └── upgrades.js      # Studio facility upgrades catalog & running costs
    ├── systems/
    │   ├── clock.js         # Day-based turn clock & character aging
    │   ├── finance.js       # Rupee formatting (Crores & Lakhs) & daily cash calculations
    │   ├── wife.js          # Wife autonomous career engine & social actions
    │   └── projects.js      # Commercial bidding engine, pipeline & itemized cost bill
    └── ui/
        ├── chart.js         # Interactive Canvas line chart component
        ├── dashboard.js     # Home dashboard screen
        ├── startScreen.js   # Character creator & studio setup
        ├── wifeScreen.js    # Comprehensive wife full page & career center
        ├── actionsScreen.js # Actions tab: Bidding, Pipeline, New Project & Upgrades
        ├── wifePreview.js   # Legacy preview modal
        └── saveModal.js     # Multi-slot save & rollback manager
```

---

## 🚀 How to Run & Play

1. **Directly via Browser**:
   Double click `index.html` or open in any desktop or mobile browser.
2. **On GitHub Pages**:
   Live and hosted directly from repository root via GitHub Pages.
3. **Local Dev Server**:
   ```bash
   npx serve .
   # or
   python -m http.server 8000
   ```

---

## 🗺️ Roadmap: Version 0.1 to 2.0

| Version | Focus Area | Status |
|---|---|---|
| **0.1** | **Foundation, Day Clock, Saves, Dashboard & Modern UI** | **Complete** ✅ |
| **0.2** | **Wife Autonomous Career Engine & Deep Influence** | **Complete** ✅ |
| **0.3** | **Actions Tab: Photoshoot & Ad Film Contract Bidding** | **Complete** ✅ |
| **0.4** | Talent Roster: 300+ Actresses & Actors, Fans & Fitness | Next Up ⏳ |
| **0.5** | Hiring, Negotiations, Clauses, 2x Buyouts & Work Hours | Planned |
| **0.6** | Series & Full Movie Production Pipeline, Theater Releases | Planned |
| **0.7** | The 25 Indian Studios & Dynamic Operations | Planned |
| **0.8** | Rival Studio AI, Poaching, Bad Press & News Tab | Planned |
| **0.9** | Stock Market (Dalal Street), IPOs, Technical & Fundamentals | Planned |
| **1.0** | First Complete Game Run, Events & Annual Awards | Planned |
| **1.x** | Deepening Systems (Unicorn Studios, Joint Projects, Debt) | Planned |
| **2.0** | Fully Playable, Polished & Balanced Masterpiece | Target |

---

## 📜 License
Film City Tycoon &copy; 2026. All rights reserved.
