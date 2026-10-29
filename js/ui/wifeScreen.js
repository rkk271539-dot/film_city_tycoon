/**
 * Wife Full Page Screen Component
 * Renders the comprehensive dedicated view for your wife and co-founder:
 * - Real-time relationship dynamics, mood, and openness gauge
 * - Autonomous outside job offers (Dharma films, Lakme Fashion Week, streaming deals)
 * - High-society hotel rendezvous events with interactive player choices (Forgive vs Object vs PR)
 * - Luxury brand enterprise expansion & Dalal Street IPO listing
 * - Interactive heart-to-heart talk console with dynamic dialogue
 * - Fitness & radiance investments, romantic dates, career nudges & timeline chronicle
 */

window.StudioGame = window.StudioGame || {};
window.StudioGame.UI = window.StudioGame.UI || {};

window.StudioGame.UI.WifeScreen = (function() {
  let activeTab = 'overview'; // 'overview' | 'career' | 'venture' | 'social' | 'romance' | 'chronicle'
  let latestTalkMessage = null;

  function render(container, state, callbacks) {
    const wifeSystem = window.StudioGame.Systems.Wife;
    wifeSystem.ensureWifeState(state);

    const wife = state.wife;
    const formatRupees = window.StudioGame.Systems.Finance.formatRupees;
    const formatFans = window.StudioGame.Systems.Talent?.formatFans || ((f) => f.toLocaleString('en-IN'));
    const currentRole = wifeSystem.getRoleById(wife.currentRoleId);
    const allRoles = wifeSystem.getRoles();

    // Relationship status tier
    let relBadgeClass = 'badge-emerald';
    let relStatusLabel = 'Devoted & Inseparable (Co-Founder Bonus: +15% Rep)';
    if (wife.relationship < 30) {
      relBadgeClass = 'badge-rose';
      relStatusLabel = '⚠️ Marital Crisis & Estrangement';
    } else if (wife.relationship < 60) {
      relBadgeClass = 'badge-amber';
      relStatusLabel = 'Cooling & Emotionally Distant';
    } else if (wife.relationship < 85) {
      relBadgeClass = 'badge-blue';
      relStatusLabel = 'Harmonious & Supportive';
    }

    // Openness status description
    let opennessSub = 'Modest & Private (Low Scandal Risk)';
    if (wife.openness >= 65) opennessSub = 'High-Society Socialite (Max Male Talent Discounts, High Tabloid Buzz)';
    else if (wife.openness >= 35) opennessSub = 'Social & Industry Connected (Male Model Discounts Unlocked)';

    container.innerHTML = `
      <div class="screen-page-container wife-screen-layout">
        <!-- Unified Top Bar with Clock Controls -->
        <header class="top-nav-bar">
          <div class="top-user-wrap">
            <div class="avatar-small">
              <img src="${wife.avatar}" alt="${wife.name}" class="avatar-img-round" />
            </div>
            <div class="top-user-meta">
              <div class="top-player-name">${wife.name}</div>
              <div class="top-studio-tag">Co-Founder &bull; Personal NW: <strong class="highlight-emerald">${formatRupees(wife.netWorth)}</strong></div>
            </div>
          </div>

          <div class="top-date-wrap">
            <div class="date-badge">
              <span class="calendar-icon">📅</span>
              <span class="date-text">${state.clock.formattedDate}</span>
              <span class="day-count-pill">Day ${state.clock.day}</span>
            </div>
            <div class="turn-controls-row">
              <button class="btn btn-2xs btn-turn" id="btnNextDay" title="Advance 1 Day">▶ Next Day</button>
              <button class="btn btn-2xs btn-turn" id="btnAdvanceWeek" title="Advance 7 Days">+7D</button>
              <button class="btn btn-2xs btn-turn" id="btnAdvanceMonth" title="Advance 30 Days">+30D</button>
            </div>
          </div>
        </header>

        <div class="wife-page-content p-3">
          <!-- Pending High-Society Social Event Banner -->
          ${wife.pendingSocialEvent ? `
            <div class="card p-3 mb-3 border-amber bg-amber-opacity slide-down" style="border: 1px solid rgba(245, 158, 11, 0.4); background: rgba(245, 158, 11, 0.08);">
              <div class="flex items-center justify-between mb-2">
                <div class="flex items-center gap-2">
                  <span class="text-xl">📸</span>
                  <h3 class="font-bold highlight-amber mb-0">High-Society Hotel Sighting</h3>
                </div>
                <span class="badge badge-amber font-mono">Paparazzi Wire</span>
              </div>
              <p class="text-sm mb-2">${wife.pendingSocialEvent.description}</p>
              <div class="text-xs text-muted mb-3">
                Venue: <strong>${wife.pendingSocialEvent.venueName}</strong> &bull; Companion: <strong>${wife.pendingSocialEvent.companionName}</strong>
              </div>
              <div class="flex flex-wrap gap-2">
                <button class="btn btn-sm btn-emerald btn-resolve-social" data-choice="forgive">
                  🤝 Forgive & Embrace Mutual Freedom (+10 Openness, Unlock Male Talent Discount)
                </button>
                <button class="btn btn-sm btn-outline-rose btn-resolve-social" data-choice="object">
                  🛑 Object & Demand Strict Boundaries (-12 Openness, -14% Trust)
                </button>
                <button class="btn btn-sm btn-secondary btn-resolve-social" data-choice="pr_cleanup">
                  🛡️ Crisis PR Tabloid Cleanup (${formatRupees(250000)})
                </button>
              </div>
            </div>
          ` : ''}

          <!-- Pending Outside Job Offer Banner -->
          ${wife.pendingOutsideOffer ? `
            <div class="card p-3 mb-3 border-emerald bg-emerald-opacity slide-down" style="border: 1px solid rgba(16, 185, 129, 0.4); background: rgba(16, 185, 129, 0.08);">
              <div class="flex items-center justify-between mb-2">
                <div class="flex items-center gap-2">
                  <span class="text-xl">📬</span>
                  <h3 class="font-bold highlight-emerald mb-0">Prestigious Outside Offer</h3>
                </div>
                <span class="badge badge-emerald font-mono">Expires Day ${wife.pendingOutsideOffer.expiresDay}</span>
              </div>
              <h4 class="font-bold text-base mb-1">${wife.pendingOutsideOffer.title}</h4>
              <p class="text-sm mb-2">${wife.pendingOutsideOffer.description}</p>
              <div class="flex items-center justify-between p-2 rounded mb-3" style="background: rgba(0,0,0,0.25);">
                <span>Contract Compensation Payout:</span>
                <span class="highlight-gold font-mono font-bold text-base">${formatRupees(wife.pendingOutsideOffer.fee)}</span>
              </div>
              <div class="flex gap-2">
                <button class="btn btn-sm btn-primary btn-accept-outside-offer" data-offer-id="${wife.pendingOutsideOffer.id}">
                  ✅ Accept Contract (${formatRupees(wife.pendingOutsideOffer.fee)})
                </button>
                <button class="btn btn-sm btn-outline-secondary btn-decline-outside-offer" data-offer-id="${wife.pendingOutsideOffer.id}">
                  ❌ Decline & Stay Dedicated to Studio
                </button>
              </div>
            </div>
          ` : ''}

          <!-- Marital Crisis Banner -->
          ${wife.relationship < 30 ? `
            <div class="card p-3 mb-3 border-rose bg-rose-opacity slide-down" style="border: 1px solid rgba(239, 68, 68, 0.5); background: rgba(239, 68, 68, 0.1);">
              <div class="flex items-center gap-2 mb-1">
                <span class="text-xl">⚠️</span>
                <h3 class="font-bold highlight-rose mb-0">MARITAL CRISIS: Trust Critically Low</h3>
              </div>
              <p class="text-sm mb-2">
                Rhea feels deeply alienated and neglected by the studio workload. Studio executive perks are suspended and she is contemplating legal separation. Make amends immediately!
              </p>
              <button class="btn btn-sm btn-primary btn-grand-apology">
                💎 Grand Reconciliation Apology (Cartier Diamond Gift &bull; ${formatRupees(1500000)})
              </button>
            </div>
          ` : ''}

          <!-- Wife Hero Card -->
          <section class="card p-3 mb-3 wife-hero-card-full">
            <div class="flex flex-wrap items-center gap-3">
              <div class="wife-avatar-full-wrap" style="width: 80px; height: 80px; border-radius: 50%; overflow: hidden; border: 2px solid #e11d48; flex-shrink: 0;">
                <img src="${wife.avatar}" alt="${wife.name}" style="width: 100%; height: 100%; object-fit: cover;" />
              </div>
              <div style="flex: 1; min-width: 200px;">
                <div class="flex items-center gap-2 mb-1">
                  <h1 class="font-bold text-lg mb-0">${wife.name}</h1>
                  <span class="badge ${relBadgeClass}">${wife.age} Yrs &bull; ${relStatusLabel}</span>
                </div>
                <div class="flex items-center gap-2 text-xs mb-1">
                  <span class="badge badge-purple">${currentRole.icon} ${currentRole.name}</span>
                  <span class="badge badge-slate">${currentRole.category}</span>
                  <span class="text-muted">Mood: <strong class="highlight-rose">${wife.mood.toUpperCase()}</strong></span>
                </div>
                <div class="text-xs text-muted">
                  Personal Net Worth: <strong class="highlight-emerald font-mono">${formatRupees(wife.netWorth)}</strong> &bull; 
                  Career Total: <strong class="highlight-gold font-mono">${formatRupees(wife.careerEarningsTotal || 0)}</strong>
                </div>
              </div>
            </div>
          </section>

          <!-- Segmented Sub-navigation Tabs -->
          <nav class="wife-subnav-tabs mb-3 flex gap-2 overflow-x-auto pb-1">
            <button class="btn btn-sm ${activeTab === 'overview' ? 'btn-primary' : 'btn-secondary'} subnav-tab-btn" data-tab="overview">
              👑 Overview & Ambition
            </button>
            <button class="btn btn-sm ${activeTab === 'career' ? 'btn-primary' : 'btn-secondary'} subnav-tab-btn" data-tab="career">
              💼 Career & Nudges
            </button>
            <button class="btn btn-sm ${activeTab === 'venture' ? 'btn-primary' : 'btn-secondary'} subnav-tab-btn" data-tab="venture">
              💎 Brand & IPO ${wife.venture?.isPublic ? '(Public)' : ''}
            </button>
            <button class="btn btn-sm ${activeTab === 'social' ? 'btn-primary' : 'btn-secondary'} subnav-tab-btn" data-tab="social">
              🥂 High Society & Openness
            </button>
            <button class="btn btn-sm ${activeTab === 'romance' ? 'btn-primary' : 'btn-secondary'} subnav-tab-btn" data-tab="romance">
              💖 Romance & Fitness
            </button>
            <button class="btn btn-sm ${activeTab === 'chronicle' ? 'btn-primary' : 'btn-secondary'} subnav-tab-btn" data-tab="chronicle">
              📜 Chronicle (${wife.careerHistory.length})
            </button>
          </nav>

          <!-- Tab Content Viewport -->
          <div class="wife-tab-content">
            ${renderActiveSubTab(state, activeTab)}
          </div>
        </div>
      </div>
    `;

    attachEventListeners(container, state, callbacks);
  }

  function renderActiveSubTab(state, tab) {
    const wifeSystem = window.StudioGame.Systems.Wife;
    const wife = state.wife;
    const formatRupees = window.StudioGame.Systems.Finance.formatRupees;
    const currentRole = wifeSystem.getRoleById(wife.currentRoleId);
    const allRoles = wifeSystem.getRoles();

    if (tab === 'overview') {
      return `
        <!-- Core Dynamic Status Meters -->
        <div class="grid grid-2 gap-3 mb-3">
          <div class="card p-3">
            <div class="flex items-center justify-between mb-1">
              <span class="text-xs font-bold">Relationship & Marital Trust</span>
              <span class="font-mono font-bold highlight-rose">${Math.round(wife.relationship)}%</span>
            </div>
            <div class="meter-bar mb-1"><div class="meter-fill fill-rose" style="width: ${wife.relationship}%"></div></div>
            <div class="text-2xs text-muted">
              ${wife.relationship >= 85 ? '💖 Devoted Co-Founder (+15% Studio Rep)' : wife.relationship >= 50 ? 'Supportive partner & confidante' : '⚠️ Marital tension & estrangement risk'}
            </div>
          </div>

          <div class="card p-3">
            <div class="flex items-center justify-between mb-1">
              <span class="text-xs font-bold">Openness Gauge (Section 3.2)</span>
              <span class="font-mono font-bold highlight-amber">${wife.openness} / 100</span>
            </div>
            <div class="meter-bar mb-1"><div class="meter-fill fill-amber" style="width: ${Math.max(5, wife.openness)}%"></div></div>
            <div class="text-2xs text-muted">
              ${wife.openness >= 50 ? '🌟 High freedom & male talent contract discounts unlocked' : 'Modest & conservative cinema networking'}
            </div>
          </div>

          <div class="card p-3">
            <div class="flex items-center justify-between mb-1">
              <span class="text-xs font-bold">Physical Fitness & Radiance</span>
              <span class="font-mono font-bold highlight-cyan">${Math.round(wife.fitness)}%</span>
            </div>
            <div class="meter-bar mb-1"><div class="meter-fill fill-cyan" style="width: ${wife.fitness}%"></div></div>
            <div class="text-2xs text-muted">Camera allure, red carpet glamour & photoshoot demand</div>
          </div>

          <div class="card p-3">
            <div class="flex items-center justify-between mb-1">
              <span class="text-xs font-bold">Monthly Role Compensation</span>
              <span class="font-mono font-bold highlight-emerald">${formatRupees(currentRole.monthlySalary)}/mo</span>
            </div>
            <div class="text-2xs text-muted mt-1">Paid directly to her personal bank reserves</div>
            <div class="text-2xs highlight-gold mt-1">Total Career Income: ${formatRupees(wife.careerEarningsTotal || 0)}</div>
          </div>
        </div>

        <!-- Active Role Perks Banner -->
        <div class="card p-3 mb-3 border-emerald">
          <div class="flex items-center gap-3 mb-2">
            <span class="text-3xl">${currentRole.icon}</span>
            <div>
              <h3 class="font-bold text-base mb-0">${currentRole.name}</h3>
              <div class="text-xs text-muted">${currentRole.category} &bull; ${currentRole.description}</div>
            </div>
          </div>
          <div class="p-2 rounded flex items-center justify-between text-xs" style="background: rgba(16, 185, 129, 0.08); border: 1px solid rgba(16, 185, 129, 0.25);">
            <span>✨ Active Studio Synergy:</span>
            <strong class="highlight-emerald">${currentRole.studioPerk}</strong>
          </div>
        </div>

        <!-- Professional Skills & Acumen -->
        <div class="card p-3 mb-3">
          <div class="flex items-center justify-between mb-2">
            <h3 class="card-title font-bold text-sm mb-0">Professional Competencies & Talents</h3>
            <span class="badge badge-indigo text-2xs">Self-Learned & Dynamic</span>
          </div>
          <div class="grid grid-2 gap-3">
            <div>
              <div class="flex justify-between text-xs mb-1"><span>🎭 Acting & Screen Craft</span><strong>${Math.round(wife.skills.acting)}%</strong></div>
              <div class="meter-bar mb-2"><div class="meter-fill fill-cyan" style="width: ${wife.skills.acting}%"></div></div>

              <div class="flex justify-between text-xs mb-1"><span>👠 Glamour & High Fashion</span><strong>${Math.round(wife.skills.glamour)}%</strong></div>
              <div class="meter-bar"><div class="meter-fill fill-rose" style="width: ${wife.skills.glamour}%"></div></div>
            </div>
            <div>
              <div class="flex justify-between text-xs mb-1"><span>📊 Business & Executive Management</span><strong>${Math.round(wife.skills.business)}%</strong></div>
              <div class="meter-bar mb-2"><div class="meter-fill fill-amber" style="width: ${wife.skills.business}%"></div></div>

              <div class="flex justify-between text-xs mb-1"><span>🎨 Creative Story Packaging</span><strong>${Math.round(wife.skills.creative)}%</strong></div>
              <div class="meter-bar"><div class="meter-fill fill-indigo" style="width: ${wife.skills.creative}%"></div></div>
            </div>
          </div>
        </div>

        <!-- Interactive Heart-to-Heart Talk Console -->
        <div class="card p-3 mb-3">
          <h3 class="card-title font-bold text-sm mb-1">💬 Interactive Consultation & Conversation</h3>
          <p class="text-xs text-muted mb-3">Talk with Rhea about her career fulfillment, marriage bond, studio strategy, and high-society freedom.</p>

          <div class="flex flex-wrap gap-2 mb-3">
            <button class="btn btn-sm btn-secondary btn-talk" data-action="talk_career">💼 Discuss Career Ambitions</button>
            <button class="btn btn-sm btn-secondary btn-talk" data-action="talk_marriage">💖 Romantic Heart-to-Heart</button>
            <button class="btn btn-sm btn-secondary btn-talk" data-action="talk_studio">📊 Consult Studio Strategy</button>
            <button class="btn btn-sm btn-secondary btn-talk" data-action="talk_openness">🥂 Discuss Social Freedom</button>
          </div>

          ${latestTalkMessage ? `
            <div class="dialogue-card p-3 rounded slide-down" style="background: rgba(225, 29, 72, 0.08); border-left: 3px solid #e11d48;">
              <div class="font-bold text-xs highlight-rose mb-1">${latestTalkMessage.title}</div>
              <p class="text-sm mb-0 text-slate-200">${latestTalkMessage.message}</p>
            </div>
          ` : `
            <div class="text-xs text-muted italic">Click any topic above to have a personal conversation with Rhea.</div>
          `}
        </div>
      `;
    }

    if (tab === 'career') {
      return `
        <!-- Autonomous Career Engine Guidance -->
        <div class="info-callout mb-3">
          <div class="callout-icon">💡</div>
          <div class="callout-text text-xs">
            <strong>Autonomous Agency Engine (Section 3.2):</strong><br/>
            ${wife.name} evaluates career opportunities independently based on her skill progression, studio reputation, and relationship with you. You can <strong>nudge</strong> her towards a desired path to influence her next autonomous decision!
          </div>
        </div>

        ${wife.nudgeRole ? `
          <div class="card p-3 mb-3 border-amber bg-amber-opacity">
            <div class="flex items-center justify-between mb-1">
              <span class="text-xs font-bold highlight-amber">🎯 Your Active Career Nudge:</span>
              <span class="badge badge-amber">${wife.nudgeDaysRemaining} Days Left</span>
            </div>
            <div class="font-bold text-sm mb-1">${wifeSystem.getRoleById(wife.nudgeRole).name}</div>
            <div class="text-xs text-muted">Rhea is actively prioritizing this direction as industry opportunities open up.</div>
          </div>
        ` : ''}

        <!-- Available Career Paths Directory -->
        <div class="career-roles-list">
          ${allRoles.map(role => {
            const isCurrent = role.id === wife.currentRoleId;
            const isNudged = role.id === wife.nudgeRole;
            const primarySkillVal = wife.skills[role.primarySkill] || 30;

            return `
              <div class="card p-3 mb-3 career-role-card ${isCurrent ? 'is-current-role' : ''} ${isNudged ? 'is-nudged-role' : ''}" style="${isCurrent ? 'border-color: #10b981;' : ''}">
                <div class="flex items-center justify-between mb-2">
                  <div class="flex items-center gap-2">
                    <span class="text-2xl">${role.icon}</span>
                    <div>
                      <h4 class="font-bold text-sm mb-0">${role.name}</h4>
                      <span class="badge badge-slate text-2xs">${role.category}</span>
                    </div>
                  </div>
                  <div class="font-mono font-bold highlight-gold text-sm">${formatRupees(role.monthlySalary)}/mo</div>
                </div>

                <p class="text-xs text-muted mb-2">${role.description}</p>

                <div class="flex items-center justify-between text-xs mb-3 p-2 rounded" style="background: rgba(0,0,0,0.2);">
                  <span>Synergy: <strong class="highlight-emerald">${role.studioPerk}</strong></span>
                  <span>Skill Match: <strong>${Math.round(primarySkillVal)}%</strong></span>
                </div>

                <div class="flex justify-end">
                  ${isCurrent ? `
                    <span class="badge badge-emerald">✓ Active Current Role</span>
                  ` : `
                    <button class="btn btn-sm ${isNudged ? 'btn-outline-amber' : 'btn-secondary'} btn-nudge-career" data-role-id="${role.id}">
                      ${isNudged ? '✓ Actively Nudging' : '💬 Nudge / Advise Role'}
                    </button>
                  `}
                </div>
              </div>
            `;
          }).join('')}
        </div>
      `;
    }

    if (tab === 'venture') {
      const venture = wife.venture;
      return `
        <div class="info-callout mb-3">
          <div class="callout-icon">💎</div>
          <div class="callout-text text-xs">
            <strong>Wife's Business Enterprise & Dalal Street IPO (Section 3.15):</strong><br/>
            When ${wife.name} pursues entrepreneurship, she can build an independent luxury enterprise. You can co-invest capital rounds, scale its valuation, and take it public on Dalal Street for massive cash windfalls and recurring dividends!
          </div>
        </div>

        ${venture ? `
          <div class="card p-4 mb-3 border-gold">
            <div class="flex items-center justify-between mb-2">
              <div>
                <h3 class="font-bold text-base mb-0 highlight-gold">${venture.name}</h3>
                <span class="badge badge-purple text-2xs">${venture.category}</span>
              </div>
              <span class="badge ${venture.isPublic ? 'badge-emerald' : 'badge-amber'} font-mono">
                ${venture.isPublic ? `🔔 LISTED (Ticker: ${venture.ticker})` : 'Private Enterprise'}
              </span>
            </div>

            <div class="grid grid-2 gap-3 my-3">
              <div class="stat-box p-2 rounded" style="background: rgba(0,0,0,0.3);">
                <div class="text-2xs text-muted">Enterprise Valuation</div>
                <div class="font-mono font-bold text-lg highlight-emerald">${formatRupees(venture.valuation)}</div>
              </div>
              <div class="stat-box p-2 rounded" style="background: rgba(0,0,0,0.3);">
                <div class="text-2xs text-muted">Monthly Corporate Revenue</div>
                <div class="font-mono font-bold text-lg highlight-amber">${formatRupees(venture.monthlyRevenue)}/mo</div>
              </div>
            </div>

            <p class="text-xs text-muted mb-3">
              Wife owns <strong>${venture.sharesOwnedPct}%</strong> equity. Lifetime dividends paid: <strong class="font-mono highlight-gold">${formatRupees(venture.dividendsPaidTotal || 0)}</strong>.
            </p>

            <div class="venture-actions-grid flex flex-wrap gap-2">
              <button class="btn btn-sm btn-secondary btn-invest-venture" data-tier="1">
                🌱 Seed Flagship Boutique (${formatRupees(2500000)})
              </button>
              <button class="btn btn-sm btn-secondary btn-invest-venture" data-tier="2">
                🚀 Pan-India Retail Expansion (${formatRupees(10000000)})
              </button>
              ${!venture.isPublic ? `
                <button class="btn btn-sm btn-primary btn-float-ipo" ${venture.valuation < 150000000 ? 'disabled' : ''}>
                  🔔 Float Dalal Street IPO ${venture.valuation < 150000000 ? '(Requires ₹15 Cr Val)' : ''}
                </button>
              ` : `
                <span class="badge badge-emerald">✓ Publicly Traded Asset on Dalal Street</span>
              `}
            </div>
          </div>
        ` : `
          <div class="card p-4 text-center">
            <div class="text-3xl mb-2">💎</div>
            <h3 class="font-bold text-sm mb-1">No Active Registered Enterprise</h3>
            <p class="text-xs text-muted mb-3">
              Advise ${wife.name} to become a <strong>Luxury Lifestyle Brand Founder</strong> in the Career tab to establish her own cosmetics or designer fashion enterprise!
            </p>
            <button class="btn btn-sm btn-primary btn-nudge-career" data-role-id="brand_founder">
              💬 Nudge Towards Brand Founder
            </button>
          </div>
        `}
      `;
    }

    if (tab === 'social') {
      const discounts = (wife.unlockedTalentDiscounts || []).map(id => (state.talent || []).find(t => t.id === id)).filter(Boolean);

      return `
        <div class="info-callout mb-3">
          <div class="callout-icon">🥂</div>
          <div class="callout-text text-xs">
            <strong>High-Society Social Freedom & Openness (Section 3.2 REQUIREMENTS.md):</strong><br/>
            As you forgive late-night social encounters, ${wife.name}'s <strong>Openness</strong> rises. High openness brings high-society influence and unlocks exclusive <strong>30% to 50% recruitment discounts</strong> for charismatic male models and artistes!
          </div>
        </div>

        <div class="card p-3 mb-3">
          <div class="flex items-center justify-between mb-2">
            <h3 class="font-bold text-sm mb-0">Openness Gauge & Freedom</h3>
            <span class="font-mono font-bold highlight-amber">${wife.openness} / 100</span>
          </div>
          <div class="meter-bar mb-2"><div class="meter-fill fill-amber" style="width: ${Math.max(5, wife.openness)}%"></div></div>
          <p class="text-xs text-muted mb-2">${opennessSub}</p>
        </div>

        <!-- Unlocked Talent Discounts -->
        <div class="card p-3 mb-3">
          <div class="flex items-center justify-between mb-2">
            <h3 class="font-bold text-sm mb-0">🌟 Unlocked High-Society Talent Discounts</h3>
            <span class="badge badge-emerald font-mono">${discounts.length} Artistes</span>
          </div>
          <p class="text-xs text-muted mb-2">Artistes Rhea connected with through private dinners offering 40% contract recruitment discounts:</p>
          ${discounts.length > 0 ? `
            <div class="discounts-list">
              ${discounts.map(d => `
                <div class="p-2 mb-2 rounded flex items-center justify-between" style="background: rgba(16, 185, 129, 0.08); border: 1px solid rgba(16, 185, 129, 0.25);">
                  <div>
                    <strong class="text-xs">${d.name}</strong>
                    <div class="text-2xs text-muted">${d.category} &bull; 🔥 ${formatFans(d.fans)} Fans</div>
                  </div>
                  <span class="badge badge-gold">40% DISCOUNT UNLOCKED</span>
                </div>
              `).join('')}
            </div>
          ` : `
            <div class="text-xs text-muted italic">No discounts currently active. Social encounters at high openness unlock discounts!</div>
          `}
        </div>
      `;
    }

    if (tab === 'romance') {
      return `
        <!-- Fitness Investments -->
        <div class="card p-3 mb-3">
          <h3 class="font-bold text-sm mb-1">1. Physical Fitness & Screen Radiance</h3>
          <p class="text-xs text-muted mb-3">Invest personal capital to elevate beauty, camera allure, and runway demand.</p>

          <div class="grid grid-3 gap-2">
            <div class="card p-2 text-center" style="background: rgba(0,0,0,0.2);">
              <div class="text-2xl mb-1">🧘‍♀️</div>
              <div class="font-bold text-xs mb-1">Boutique Reformer Pilates</div>
              <div class="text-2xs highlight-gold mb-2">${formatRupees(35000)}</div>
              <div class="text-2xs highlight-cyan mb-2">+5% Fitness &bull; +2% Glamour</div>
              <button class="btn btn-2xs btn-primary btn-full btn-action-fitness" data-tier="1">Enroll (${formatRupees(35000)})</button>
            </div>

            <div class="card p-2 text-center" style="background: rgba(0,0,0,0.2);">
              <div class="text-2xl mb-1">🏋️‍♀️</div>
              <div class="font-bold text-xs mb-1">Celebrity Trainer & Nutritionist</div>
              <div class="text-2xs highlight-gold mb-2">${formatRupees(95000)}</div>
              <div class="text-2xs highlight-cyan mb-2">+11% Fitness &bull; +5% Glamour</div>
              <button class="btn btn-2xs btn-primary btn-full btn-action-fitness" data-tier="2">Retain (${formatRupees(95000)})</button>
            </div>

            <div class="card p-2 text-center" style="background: rgba(0,0,0,0.2);">
              <div class="text-2xl mb-1">✨</div>
              <div class="font-bold text-xs mb-1">VIP Swiss Wellness Sanctuary</div>
              <div class="text-2xs highlight-gold mb-2">${formatRupees(250000)}</div>
              <div class="text-2xs highlight-cyan mb-2">+20% Fitness &bull; +9% Glamour</div>
              <button class="btn btn-2xs btn-primary btn-full btn-action-fitness" data-tier="3">Book (${formatRupees(250000)})</button>
            </div>
          </div>
        </div>

        <!-- Romance & Date Nights -->
        <div class="card p-3 mb-3">
          <h3 class="font-bold text-sm mb-1">2. Quality Time & Luxury Dates</h3>
          <p class="text-xs text-muted mb-3">Prevent emotional neglect, deepen devotion, and keep marital bond strong.</p>

          <div class="grid grid-3 gap-2">
            <div class="card p-2 text-center" style="background: rgba(0,0,0,0.2);">
              <div class="text-2xl mb-1">🍷</div>
              <div class="font-bold text-xs mb-1">Candlelight Dinner at Taj</div>
              <div class="text-2xs highlight-gold mb-2">${formatRupees(20000)}</div>
              <div class="text-2xs highlight-rose mb-2">+4% Trust & Romance</div>
              <button class="btn btn-2xs btn-secondary btn-full btn-action-date" data-tier="1">Reserve (${formatRupees(20000)})</button>
            </div>

            <div class="card p-2 text-center" style="background: rgba(0,0,0,0.2);">
              <div class="text-2xl mb-1">👜</div>
              <div class="font-bold text-xs mb-1">Haute Couture Handbag & Spa</div>
              <div class="text-2xs highlight-gold mb-2">${formatRupees(85000)}</div>
              <div class="text-2xs highlight-rose mb-2">+9% Trust & Romance</div>
              <button class="btn btn-2xs btn-secondary btn-full btn-action-date" data-tier="2">Gift (${formatRupees(85000)})</button>
            </div>

            <div class="card p-2 text-center" style="background: rgba(0,0,0,0.2);">
              <div class="text-2xl mb-1">🛥️</div>
              <div class="font-bold text-xs mb-1">Private Charter Yacht in Goa</div>
              <div class="text-2xs highlight-gold mb-2">${formatRupees(250000)}</div>
              <div class="text-2xs highlight-rose mb-2">+18% Trust & Romance</div>
              <button class="btn btn-2xs btn-secondary btn-full btn-action-date" data-tier="3">Charter (${formatRupees(250000)})</button>
            </div>
          </div>
        </div>
      `;
    }

    if (tab === 'chronicle') {
      return `
        <div class="card p-3 mb-3">
          <h3 class="font-bold text-sm mb-1">📜 Decisions, Milestones & High-Society Chronicle</h3>
          <p class="text-xs text-muted mb-3">A living timeline of ${wife.name}'s professional evolution, corporate milestones, and romantic milestones.</p>

          <div class="wife-timeline">
            ${wife.careerHistory.map(entry => {
              const role = wifeSystem.getRoleById(entry.roleId);
              return `
                <div class="timeline-node p-2 mb-2 rounded" style="background: rgba(0,0,0,0.25); border-left: 3px solid #6366f1;">
                  <div class="flex items-center justify-between text-xs mb-1">
                    <span class="font-bold highlight-cyan">${entry.title}</span>
                    <span class="text-muted text-2xs">${entry.date} (Day ${entry.day})</span>
                  </div>
                  <div class="text-xs text-slate-300">${entry.description}</div>
                </div>
              `;
            }).join('')}
          </div>
        </div>
      `;
    }

    return '';
  }

  function attachEventListeners(container, state, callbacks) {
    const wifeSystem = window.StudioGame.Systems.Wife;

    // Fast Forward Clock Turns
    container.querySelector('#btnNextDay')?.addEventListener('click', () => callbacks.onAdvanceTurn?.(1));
    container.querySelector('#btnAdvanceWeek')?.addEventListener('click', () => callbacks.onAdvanceTurn?.(7));
    container.querySelector('#btnAdvanceMonth')?.addEventListener('click', () => callbacks.onAdvanceTurn?.(30));

    // Sub-tab Navigation
    container.querySelectorAll('.subnav-tab-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        activeTab = e.currentTarget.getAttribute('data-tab');
        render(container, state, callbacks);
      });
    });

    // Talk / Interactive Consultation
    container.querySelectorAll('.btn-talk').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const action = e.currentTarget.getAttribute('data-action');
        const res = wifeSystem.interactWithWife(state, action);
        if (res.success) {
          latestTalkMessage = res;
          window.StudioGame.State.autosave();
          callbacks.onStateChange?.();
          render(container, state, callbacks);
        }
      });
    });

    // Nudge Career Path
    container.querySelectorAll('.btn-nudge-career').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const roleId = e.currentTarget.getAttribute('data-role-id');
        const res = wifeSystem.nudgeCareer(state, roleId);
        window.StudioGame.State.autosave();
        callbacks.onStateChange?.();
        window.StudioGame.App.showToast(`💬 ${res.message}`);
        render(container, state, callbacks);
      });
    });

    // Accept Outside Job Offer
    container.querySelectorAll('.btn-accept-outside-offer').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const offerId = e.currentTarget.getAttribute('data-offer-id');
        const res = wifeSystem.acceptOutsideOffer(state, offerId);
        if (res.success) {
          window.StudioGame.State.autosave();
          callbacks.onStateChange?.();
          window.StudioGame.App.showToast(`✍️ ${res.message}`);
          render(container, state, callbacks);
        }
      });
    });

    // Decline Outside Job Offer
    container.querySelectorAll('.btn-decline-outside-offer').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const offerId = e.currentTarget.getAttribute('data-offer-id');
        const res = wifeSystem.declineOutsideOffer(state, offerId);
        if (res.success) {
          window.StudioGame.State.autosave();
          callbacks.onStateChange?.();
          window.StudioGame.App.showToast(`🤝 ${res.message}`);
          render(container, state, callbacks);
        }
      });
    });

    // Resolve High-Society Social Event
    container.querySelectorAll('.btn-resolve-social').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const choice = e.currentTarget.getAttribute('data-choice');
        const res = wifeSystem.resolveSocialEvent(state, choice);
        if (res.success) {
          window.StudioGame.State.autosave();
          callbacks.onStateChange?.();
          window.StudioGame.App.showToast(`📸 ${res.message}`);
          render(container, state, callbacks);
        } else {
          window.StudioGame.App.showToast(`⚠️ ${res.error}`);
        }
      });
    });

    // Grand Apology
    container.querySelectorAll('.btn-grand-apology').forEach(btn => {
      btn.addEventListener('click', () => {
        const res = wifeSystem.interactWithWife(state, 'grand_apology');
        if (res.success) {
          window.StudioGame.State.autosave();
          callbacks.onStateChange?.();
          window.StudioGame.App.showToast(`💎 ${res.message}`);
          render(container, state, callbacks);
        } else {
          window.StudioGame.App.showToast(`⚠️ ${res.error}`);
        }
      });
    });

    // Venture Expansion
    container.querySelectorAll('.btn-invest-venture').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const tier = parseInt(e.currentTarget.getAttribute('data-tier'), 10);
        const res = wifeSystem.investVenture(state, tier);
        if (res.success) {
          window.StudioGame.State.autosave();
          callbacks.onStateChange?.();
          window.StudioGame.App.showToast(`🌱 ${res.message}`);
          render(container, state, callbacks);
        } else {
          window.StudioGame.App.showToast(`⚠️ ${res.error}`);
        }
      });
    });

    // Float Dalal Street IPO
    container.querySelectorAll('.btn-float-ipo').forEach(btn => {
      btn.addEventListener('click', () => {
        const res = wifeSystem.floatVentureIPO(state);
        if (res.success) {
          window.StudioGame.State.autosave();
          callbacks.onStateChange?.();
          window.StudioGame.App.showToast(`🔔 ${res.message}`);
          render(container, state, callbacks);
        } else {
          window.StudioGame.App.showToast(`⚠️ ${res.error}`);
        }
      });
    });

    // Fitness Investment
    container.querySelectorAll('.btn-action-fitness').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const tier = parseInt(e.currentTarget.getAttribute('data-tier'), 10);
        const res = wifeSystem.investFitness(state, tier);
        if (res.success) {
          window.StudioGame.State.autosave();
          callbacks.onStateChange?.();
          window.StudioGame.App.showToast(`🧘‍♀️ Enrolled in ${res.planName}! Fitness is now ${Math.round(res.newFitness)}%.`);
          render(container, state, callbacks);
        } else {
          window.StudioGame.App.showToast(`⚠️ ${res.error}`);
        }
      });
    });

    // Date Night
    container.querySelectorAll('.btn-action-date').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const tier = parseInt(e.currentTarget.getAttribute('data-tier'), 10);
        const res = wifeSystem.dateNight(state, tier);
        if (res.success) {
          window.StudioGame.State.autosave();
          callbacks.onStateChange?.();
          window.StudioGame.App.showToast(`🥂 Treated to ${res.planName}! Trust rose to ${Math.round(res.newRelationship)}%.`);
          render(container, state, callbacks);
        } else {
          window.StudioGame.App.showToast(`⚠️ ${res.error}`);
        }
      });
    });
  }

  return {
    render,
    open: (state, onStateChangeCallback) => {
      const viewport = document.getElementById('screenViewport');
      if (viewport) {
        render(viewport, state, {
          onAdvanceTurn: (days) => window.StudioGame.App?.handleAdvanceTurn?.(days),
          onStateChange: onStateChangeCallback
        });
      }
    }
  };
})();
