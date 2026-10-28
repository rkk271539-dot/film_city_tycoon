# Studio Game: Requirements

Status legend: **[decided]** you said it, **[proposed]** suggested, needs your yes/no, **[open]** question to settle.

## 1. Concept
- **[decided]** Studio management game: you and your wife build a studio and grow it against rival studios.
- **[decided]** Growth path: photoshoots, small series, web series, movies and films.
- **[decided]** Net worth is tracked for you, the studio, the wife, talent and rival studios.
- **[decided]** A big, deep, long-term game, far more complex than the earlier single-file games.
- **[decided]** One default difficulty, already hard. No easy mode and no difficulty levels.

## 2. Platform and code structure
- **[decided]** Multi-file folder structure (not one giant HTML) so updates stay small and AI can read the code easily.
- **[decided]** You upload to git yourself. Updates are delivered as "changed files only".
- **[proposed]** Mobile web, plain HTML/CSS/JS.
- **[decided]** Modern UI (not pixel art). See section 3.9.
- **[open]** Plain script tags (opens anywhere) or ES modules (cleaner, needs hosting or a server).

```
studio-game/
├── index.html
├── css/style.css
├── js/
│   ├── main.js          game loop, screen routing
│   ├── state.js         global state, save/load
│   ├── data/            genres, names, events, upgrades
│   ├── systems/         projects, talent, wife, studios, finance, stocks, awards
│   ├── ui/              dashboard, wife, talent, studios, stocks screens
│   └── face.js          portrait generator
├── REQUIREMENTS.md
└── README.md
```

## 3. Screens and scope

### 3.0 Starting setup
- **[decided]** All money is in Indian rupees (crore).
- **[decided]** You start with around 5 to 8 cr. Your wife starts with around 4 to 5 cr.
- **[decided]** At the start you pick one skill out of 5. It gives a **25% bonus in that field only**, kept small so the game doesn't become easy.
- **[decided]** The chosen skill can never be upgraded.
- **[decided]** Skill options so far: Talented writer (script quality up), Brilliant manager (costs down), Marketing (marketing and hype up).
- **[proposed]** Two more: Sharp negotiator (better fees, loans and bid outcomes) and Talent scout (spots hidden talent stats and newcomers earlier).

### 3.1 Dashboard (home)
- **[decided]** Your proper details: personal net worth, studio net worth, cash, debt.
- **[decided]** Graphs: your net worth over time, studio net worth over time.
- **[decided]** Wife card on the dashboard. Tapping it opens her full page (see 3.2).
- **[proposed]** Also shows: current calendar date, running projects, films in theatres and their earnings, upcoming releases, alerts and news.

### 3.2 Wife (full page)
- **[decided]** Full details page: relationship status, what work she does, career, net worth.
- **[decided]** She can have many different roles, not a fixed one. Examples: actress, model, department manager in the studio, or something else. This is much deeper than the limited wife options in the earlier games.
- **[decided]** You can influence her, but she makes intelligent decisions of her own, such as which career is better or worth pursuing.
- **[proposed]** Role options: actress, model, studio department head (Casting, Finance, Marketing, Creative), producer, director, her own business or brand, investor, stay out of work.
- **[proposed]** Her decisions weigh income, growth, relationship with you, her skills, opportunities and risk. Your influence changes the odds but never forces the outcome.
- **[proposed]** Skills and experience grow in her chosen field. Relationship meter affects loyalty, cooperation and whether she takes offers from rivals.
- **[decided]** The wife can hang out with others and may end up in a hotel. This is never shown explicitly, only as outcomes and headlines.
- **[decided]** She has an **openness** attribute. The more you forgive, the more open she becomes to "going around".
- **[decided]** Upside of her openness: she can bring in male models and talent for a lower cost. Downside: she gives more of her time to them.
- **[decided]** Your relationship is hardly affected, because it is mutual.
- **[proposed]** Other costs: scandal risk, reputation and brand hits, rivals exploiting it. If openness is low and she is caught, the relationship drops hard and divorce becomes possible.
- **[proposed]** Openness rises when you forgive and falls when you object or punish.
- **[open]** Does the same openness mechanic apply to you?
- **[decided]** Fitness also applies to the wife (see 3.13). You can invest money in it.
- **[decided]** She can launch her own business and probably put it on the stock market for investors (see 3.15).

### 3.3 Talent roster
- **[decided]** About 150 actresses and 150 actors: a mix of established stars and newcomers.
- **[decided]** Tapping a talent opens a full-screen card.
- **[decided]** The card has a **Hire** button that opens the negotiation screen (see 3.10).
- **[decided]** Card attributes: reputation, beauty, "pure" image (never done romantic scenes or kissed an actor on screen), net worth, average fee, last top films (dynamic, updates as the game runs), debt (if any).
- **[decided]** Also on the card: **fans** (number of fans), fitness, marital status and spouse.
- **[proposed]** More fields: acting skill, fan following, age and career stage, genre fit, ego, loyalty, scandal risk, contract status, awards, best chemistry pairs, full film history.
- **[proposed]** "Pure" works as a screen-image setting (wholesome vs bold, kissing or intimacy clauses in contracts) that affects which roles and brands they accept.
- **[decided]** Newcomers have fictional names.
- **[open]** Established talent: real or fictional names? Recommended: fictional for every person, because the game invents their debt, marriages, scandals and "pure" image. We will settle this and the generator approach later.

### 3.4 Studios (about 25 in total)
- **[decided]** About 25 studios in the game. Some are very big, existing-style studios.
- **[decided]** About 10 to 15 of the 25 use real-life studio names. The rest, and all Unicorn Studios, have fictional names.
- **[proposed]** Owners and leaders are fictional even for real-name studios. All finances, films and events are invented game data.
- **[decided]** Not all are real rivals. Some are neutral and don't care about you, some are aggressively against you.
- **[decided]** Studio list screen shows all studios. Tapping one opens its detail page.
- **[decided]** Studio detail page: owner, net worth with graph, cash flow, current films in theatres and their earnings, past films, past records, how many films made, and more.
- **[proposed]** Attitude toward you: neutral, friendly, rival, aggressive. It changes over time based on your actions (poaching, release clashes, deals).
- **[proposed]** Aggressive studios poach talent, clash release dates, bid for scripts and spread bad press. Neutral studios mostly run their own business.
- **[proposed]** More fields: studio size tier, signature genres, stars under contract, box office record, awards won, stock price if listed.
- **[open]** Real studio names or fictional ones inspired by them? Same reasoning as talent.
- **[decided]** **10 more studios** are founded and controlled by talent. They are separate from the original 25.
- **[decided]** These 10 are called the **Unicorn Studios**. Which studios hold the 10 slots changes over time.
- **[decided]** These are dynamic: they can rise, fall, collapse and shut down.
- **[decided]** They can open not only studios but also other businesses (see 3.15).
- **[decided]** The Studios list page shows the original 25 first, with the 10 Unicorn Studios (dynamic, talent-run) in a separate section below them.
- **[decided]** Only these studios get full studio detail pages. Startups and other businesses appear only in the Market tab.
- **[proposed]** Founder attributes (skill, reputation, fans, funds) decide each venture's odds of success.
- **[proposed]** The 10 dynamic slots rank by net worth and change over time. A startup or business that grows large enough can climb into them, and one that shrinks drops out.
- **[proposed]** When one shuts down, its contracts end, its talent become available, its stock is delisted, and new talent can found replacements.
- **[decided]** The count of 10 is fixed. These are the top 10 studios. When one collapses, another rises into its slot.

### 3.5 Stock market
- **[decided]** A complex stock market system.
- **[decided]** You can list your own studio on the market.
- **[proposed]** Other studios and related companies are listed too. Prices react to box office results, scandals, awards, debt and news.
- **[proposed]** Listing (IPO) raises cash but costs ownership and adds shareholder pressure. Hostile takeover risk if too much is sold.
- **[proposed]** Portfolio, price charts, buy/sell, market indices, dividends.
- **[open]** Can you buy shares of rival studios and take them over?
- **[decided]** The stock algorithms must be very powerful and realistic.
- **[decided]** Many more listed companies exist than the ones shown as full studios (see 3.4).
- **[decided]** The Market tab lists **all** companies: the original 25 studios, the dynamic and startup studios run by talent, and other businesses.
- **[decided]** Prices rise and fall properly, with price graphs for every company.
- **[decided]** The Market tab has proper technical analysis, including bullish and bearish trends.
- **[decided]** It also analyses fundamentals: studio debt, profits, future contracts and running films.
- **[decided]** Investors put money in and pull it out, making intelligent decisions.
- **[decided]** Besides the technical indicators, prices run on **buy pressure and sell pressure**, which make them fluctuate.
- **[decided]** A stock's daily change is capped at **-8% to +8%**, so prices never overshoot to infinity.
- **[decided]** Each stock shows how eager buyers are, and related pressure signals.
- **[proposed]** Pressure comes from investor orders, news, trend, fundamentals and herd behaviour. Net pressure sets the day's move, which is then clipped to the cap.
- **[proposed]** Display: a buy/sell pressure meter, buyer eagerness score, demand level and a short plain-language label such as "buyers rushing in" or "heavy selling".
- **[proposed]** The cap makes crashes and rallies play out over several days instead of in one jump.
- **[proposed]** Technical tools: price charts with range toggles, volume, moving averages, RSI, MACD, support and resistance, and a trend label (bullish, bearish, sideways).
- **[proposed]** Fundamentals view per company: revenue, profit, debt ratio, cash, running films, upcoming releases, signed contracts, valuation ratios, a risk score and an overall rating.
- **[proposed]** Investor types: institutional, retail and venture, each with its own risk appetite and strategy. They react to trends, debt, profits, news and contracts. Their inflows and outflows move prices, and herd behaviour or panic can build.
- **[proposed]** Investor confidence affects how easily your studio can raise money.
- **[proposed]** Watchlist, price alerts and sector indices.

### 3.6 Projects and production
- **[decided]** Projects are a multi-turn pipeline, not a click-and-collect. Several projects run at once at different stages.
- **[decided]** Pipeline stages: idea and script, packaging, pre-production, shoot, marketing, release, theatre or streaming run, aftermath.
- **[decided]** Durations are shortened so you are not clicking through hundreds of days.

| Project | Time to finish | Theatre or streaming run |
|---|---|---|
| Photoshoot | 1 to 3 days | Paid on delivery |
| Ad film | 1 to 2 weeks | Paid on delivery |
| Short film | 3 to 6 weeks | Festival or YouTube, small income |
| Web series season | 2 to 3 months | Weekly episodes for about 5 weeks, then long tail |
| Small film | 2.5 to 4 months | 2 to 3 week run, then OTT |
| Mid film | 5 to 6.5 months | 3 to 4 week run, then OTT |
| Big film | 8 to 9 months (240 to 270 days) | 4 to 5 week run, then OTT and music |

### 3.7 Finance
- Cash, debt, loans, investors, studio valuation, brand value.
- Personal and studio financial sheets with asset allocations and daily cash flows.
- Win condition: stay **No. 1 for 3 years straight**.

### 3.8 Events and awards
- Scandals, shoot delays, censor cuts, piracy, viral flops, festival releases, awards season.

### 3.9 Main GUI
- Fully mobile friendly, portrait first. Modern UI, dark theme, not pixel.
- Bottom tab bar scrolls sideways. Locked tabs show lock icon and "Coming in 0.X".
- Wife photo upload (cropped to square, stored locally; generated fallback portrait).
- Player photo upload (optional; generated fallback portrait).
- Top bar shows date, cash, personal net worth.
- Fast forward turn controls: "Next Day", "+7 Days", "+30 Days", "Next Event".
- Touch-friendly responsive net worth graphs.

### 3.10 to 3.25 Details
(See full specification document).

## 4. Version Plan
- **0.1 Foundation and dashboard** (Current Target)
- 0.2 Wife
- 0.3 Actions and first projects
- 0.4 Talent roster
- 0.5 Contracts and negotiation
- 0.6 Series and films
- 0.7 Studios
- 0.8 Rival behaviour and news
- 0.9 Finance and stock market
- 1.0 First complete run
- 1.x Deepening
- 2.0 Fully playable
