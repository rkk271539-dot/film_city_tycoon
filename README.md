# Film City Tycoon (v0.1 Foundation)

A deep, multi-turn studio management simulation where you and your partner build an Indian cinema empire from the ground up against rival studios and unicorn production houses.

---

## 🌟 Version 0.1: Foundation & Dashboard

This initial release establishes the complete technical foundation, turn-based day clock, real aging system, robust multi-slot save architecture, procedural vector portrait generation, and modern obsidian-dark mobile UI shell.

### Included in v0.1:
- **Architecture & Modularity**: Multi-file, non-bundled vanilla web architecture with namespaced modules (`window.StudioGame`), opening seamlessly on any browser or file system without CORS restrictions.
- **Modern Dark UI**: Mobile-first portrait layout, 44px+ touch targets, glassmorphism card surfaces, and smooth scrolling navigation.
- **Starting Setup & Customization**:
  - Founder & Wife character customization with procedural SVG avatars (`face.js`) or local photo upload with client-side canvas cropping and compression.
  - 5 permanent specialization skills with a focused **+25% non-upgradeable bonus**:
    - ✍️ *Talented Writer* (+25% Script Quality)
    - 📊 *Brilliant Manager* (+25% Cost Reduction)
    - 📣 *Marketing Guru* (+25% Marketing & Hype)
    - 🤝 *Sharp Negotiator* (+25% Negotiation Power)
    - 🔍 *Talent Scout* (+25% Talent Discovery)
  - Starting liquid capital seed: ₹5.00 Cr to ₹8.00 Cr (Player) and ₹4.50 Cr personal net worth (Wife).
- **Day-Based Turn Engine & Aging**:
  - Real character aging with birthday celebrations and milestones.
  - Fast-forward turn controls: **Next Day**, **+7 Days**, **+30 Days**, and **⚡ Next Event**.
  - Daily financial flow with overhead deductions, liquid bank yield, and studio valuation updates.
- **Interactive High-DPI Canvas Chart**:
  - Personal Net Worth vs. Studio Net Worth toggles.
  - Range filters: `7D`, `30D`, `90D`, `1Y`, `ALL`.
- **Wife Card & Details Page Preview**:
  - Home card displaying relationship meter, openness gauge, fitness, and career status, opening her dedicated page.
- **Robust Save & Rollback System**:
  - Automatic daily autosave.
  - Rolling autosave history (up to 5 recent checkpoints) enabling instant rollback.
  - 3 manual save slots with date, time, and net worth metadata.
  - JSON save export & import for cross-device transfers and backups.
- **Locked Tabs & Roadmap Preview**:
  - Bottom scrolling tab bar featuring Home (active), Actions, Talent, Studios, Market, and News with roadmap modals detailing future releases.

---

## 📁 Project Structure

```
├── index.html               # Main entry point & script orchestration
├── REQUIREMENTS.md          # Complete master design specification (0.1 to 2.0)
├── README.md                # Project documentation and roadmap
├── css/
│   └── style.css            # Modern dark theme responsive styling
└── js/
    ├── face.js              # Procedural SVG vector portrait generator & image cropper
    ├── state.js             # Global state, rolling autosave, manual slots & JSON export
    ├── main.js              # Game loop, screen router & navigation controller
    ├── data/
    │   ├── skills.js        # 5 permanent founder skills
    │   └── events.js        # Daily news bulletins & milestone triggers
    ├── systems/
    │   ├── clock.js         # Day-based turn clock & character aging
    │   └── finance.js       # Rupee formatting (Crores & Lakhs) & daily cash calculations
    └── ui/
        ├── chart.js         # Interactive Canvas line chart component
        ├── dashboard.js     # Home dashboard screen
        ├── startScreen.js   # Character creator & studio setup
        ├── wifePreview.js   # Wife detail page & status modal
        └── saveModal.js     # Multi-slot save & rollback manager
```

---

## 🚀 How to Run

1. **Directly via Browser**:
   Open `index.html` in any modern desktop or mobile browser (Chrome, Edge, Safari, Firefox). No build step, Node.js, or local server required!
2. **Via Local Server (Optional)**:
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
| **0.2** | Wife Autonomous Career Engine & Deep Influence | Next Up ⏳ |
| **0.3** | Actions Tab: Photoshoot & Ad Film Contract Bidding | Planned |
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
