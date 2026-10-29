# Film City Tycoon (v0.2 Wife Autonomous Career Engine)

A deep, multi-turn studio management simulation where you and your partner build an Indian cinema empire from the ground up against rival studios and unicorn production houses.

---

## 🌟 Version 0.2: Wife Autonomous Career Engine & Deep Influence

This major update brings the complete **Wife & Co-Founder System** to life, implementing autonomous career decision-making, professional skill acquisition, studio department synergies, player career nudges, fitness investments, romantic date nights, and a living chronicle of her achievements.

### What's New in v0.2:
- **Autonomous Career Decision Engine**:
  - Your wife and co-founder possesses true independent agency: she evaluates career opportunities every ~35–45 days based on her skills, personal ambition, industry opportunities, and domestic relationship.
  - She can work across **10 distinct industry paths**:
    1. 🎨 *Studio Creative Head* (+10% Script Quality on all studio projects, ₹1.2L/mo)
    2. 📣 *Studio Marketing Head* (+12% Studio Hype & Box Office buzz, ₹1.3L/mo)
    3. 🌟 *Studio Head of Casting* (-10% Talent Contract costs for studio, ₹1.1L/mo)
    4. 📊 *Studio Chief of Finance* (-15% Daily Studio Overheads, ₹1.4L/mo)
    5. 🎭 *Independent Actress* (Cinema, OTT & TV commercials, ₹2.5L/mo)
    6. 👠 *High-Fashion Model* (Fashion Week runways & luxury endorsements, ₹2.0L/mo)
    7. 🎬 *Independent Film Producer* (Festival features & streaming series, ₹1.8L/mo)
    8. 💎 *Beauty & Lifestyle Brand Founder* (Designer skincare & cosmetics, ₹3.0L/mo)
    9. 📈 *Private Angel Investor* (Media-tech & exhibition chains, ₹2.2L/mo)
    10. ☕ *Creative Sabbatical* (Wellness, recharging, and domestic intimacy)
- **Player Career Nudging & Influence**:
  - You can discuss career directions and suggest a specific path.
  - Your advice is weighted heavily by her respect and loyalty to you (+25% to +50% bias), guiding her future evaluations without removing her independence.
- **Skill Progression & Experience**:
  - Tracks 4 core competencies: *Acting & Screen Craft*, *Glamour & High Fashion*, *Business & Executive Management*, and *Creative Vision*.
  - Skills level up passively through daily work in her field.
- **Fitness & Radiance Investments**:
  - Invest personal funds into her conditioning to elevate glamour, screen presence, and physical wellness:
    - *Boutique Pilates & Yoga Studio* (₹25,000 &bull; +4% Fitness, +1.5% Glamour)
    - *Celebrity Fitness Trainer & Nutritionist* (₹75,000 &bull; +9% Fitness, +3.6% Glamour)
    - *VIP Swiss Wellness & Beauty Sanctuary* (₹2,00,000 &bull; +18% Fitness, +7.2% Glamour)
- **Romance & Date Nights**:
  - Reinforce your marital foundation and studio loyalty:
    - *Candlelight Dinner at Taj Sea Lounge* (₹15,000 &bull; +3% Trust)
    - *Designer Handbag & Luxury Spa Afternoon* (₹60,000 &bull; +7% Trust)
    - *Private Charter Yacht in Goa* (₹1,80,000 &bull; +14% Trust)
- **Living Career Chronicle**:
  - Historical timeline recording every career shift, promotion, and contract event with in-game calendar timestamps.
- **Cleaner Turn Progression**:
  - Removed routine time-skip toast notifications on "+1D / +7D / +30D" clicks for smooth, uninterrupted gameplay. Only genuine milestones and events generate toast notifications.

---

## 🌟 Version 0.1 Foundation (Included & Preserved)
- **Architecture**: Multi-file vanilla ES web architecture (`window.StudioGame`), opening seamlessly on GitHub Pages or double-clicked from local storage.
- **Modern Dark Obsidian UI**: Glassmorphism cards, 44px+ tap targets, and responsive mobile-first portrait shell.
- **Starting Setup**: Procedural SVG vector portrait generator (`face.js`) or local photo upload with client-side canvas square cropping and compression.
- **5 Founder Skills**: *Talented Writer*, *Brilliant Manager*, *Marketing Guru*, *Sharp Negotiator*, and *Talent Scout* (+25% non-upgradeable bonuses).
- **Day-Based Clock & Aging**: In-game calendar starting 01 Jan 2026, birthday milestones, and turn fast-forwarding.
- **Interactive Canvas Chart**: Touch-friendly Net Worth trends with `7D`, `30D`, `90D`, `1Y`, `ALL` filters.
- **Multi-Slot Save System**: Daily rolling autosaves with 5-step rollback history, 3 manual save slots, and JSON export/import.

---

## 📁 Project Structure

```
├── index.html               # Main entry point & script orchestration
├── REQUIREMENTS.md          # Complete master design specification (0.1 to 2.0)
├── README.md                # Project documentation and roadmap
├── css/
│   └── style.css            # Modern dark theme responsive styling (v0.1 + v0.2)
└── js/
    ├── face.js              # Procedural SVG vector portrait generator & image cropper
    ├── state.js             # Global state, rolling autosave, manual slots & JSON export
    ├── main.js              # Game loop, screen router & navigation controller
    ├── data/
    │   ├── skills.js        # 5 permanent founder skills
    │   └── events.js        # Daily news bulletins & milestone triggers
    ├── systems/
    │   ├── clock.js         # Day-based turn clock & character aging
    │   ├── finance.js       # Rupee formatting (Crores & Lakhs) & daily cash calculations
    │   └── wife.js          # Wife autonomous career decision engine & social actions
    └── ui/
        ├── chart.js         # Interactive Canvas line chart component
        ├── dashboard.js     # Home dashboard screen
        ├── startScreen.js   # Character creator & studio setup
        ├── wifeScreen.js    # Comprehensive wife full page & career center
        ├── wifePreview.js   # Legacy preview modal
        └── saveModal.js     # Multi-slot save & rollback manager
```

---

## 🚀 How to Run & Play

1. **Directly via Browser**:
   Double click `index.html` or open in any mobile/desktop browser. No build step or server required!
2. **On GitHub Pages**:
   Already hosted and runnable directly via GitHub Pages from root `index.html`.
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
| **0.3** | Actions Tab: Photoshoot & Ad Film Contract Bidding | Next Up ⏳ |
| **0.4** | Talent Roster: 300+ Actresses & Actors, Fans & Fitness | Planned |
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
