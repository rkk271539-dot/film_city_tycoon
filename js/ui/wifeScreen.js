/**
 * Wife Full Page Screen Component
 * Renders the comprehensive dedicated view for your wife and co-founder:
 * Career management, skill bars, autonomous career nudges, fitness investments,
 * date night romances, and career chronicle timeline.
 */

window.StudioGame = window.StudioGame || {};
window.StudioGame.UI = window.StudioGame.UI || {};

window.StudioGame.UI.WifeScreen = (function() {
  let activeTab = 'overview'; // 'overview' | 'career' | 'actions' | 'chronicle'

  function render(state, onStateChangeCallback) {
    const wifeSystem = window.StudioGame.Systems.Wife;
    wifeSystem.ensureWifeState(state);

    const wife = state.wife;
    const formatRupees = window.StudioGame.Systems.Finance.formatRupees;
    const currentRole = wifeSystem.getRoleById(wife.currentRoleId);
    const allRoles = wifeSystem.getRoles();

    return `
      <div class="wife-page-container">
        <!-- Top Sticky Header -->
        <header class="wife-page-header">
          <button class="btn-back" id="btnBackFromWife" title="Return to Dashboard">
            &larr; Studio Dashboard
          </button>
          <div class="wife-header-title">Partner & Co-Founder</div>
          <div class="header-spacer"></div>
        </header>

        <!-- Hero Card -->
        <section class="wife-hero-card-full">
          <div class="wife-avatar-full-wrap">
            <img src="${wife.avatar}" alt="${wife.name}" class="avatar-img-round wife-avatar-bordered" />
            <div class="wife-level-badge">${wife.age} Years</div>
          </div>
          <div class="wife-hero-info">
            <div class="wife-name-row">
              <h1 class="wife-display-name">${wife.name}</h1>
              <span class="badge badge-rose">Co-Founder</span>
            </div>
            <div class="wife-active-role-tag">
              <span class="role-icon">${currentRole.icon}</span>
              <span class="role-text">${currentRole.name}</span>
            </div>
            <div class="wife-networth-hero">
              <span class="subtext">Personal Net Worth:</span>
              <span class="hero-nw-val highlight-emerald">${formatRupees(wife.netWorth)}</span>
            </div>
          </div>
        </section>

        <!-- Segmented Navigation Tabs -->
        <nav class="wife-subnav-tabs">
          <button class="subnav-tab-btn ${activeTab === 'overview' ? 'active' : ''}" data-tab="overview">
            Overview & Skills
          </button>
          <button class="subnav-tab-btn ${activeTab === 'career' ? 'active' : ''}" data-tab="career">
            Career & Nudges
          </button>
          <button class="subnav-tab-btn ${activeTab === 'actions' ? 'active' : ''}" data-tab="actions">
            Social & Investments
          </button>
          <button class="subnav-tab-btn ${activeTab === 'chronicle' ? 'active' : ''}" data-tab="chronicle">
            Chronicle (${wife.careerHistory.length})
          </button>
        </nav>

        <!-- Tab Content Viewport -->
        <div class="wife-tab-content">
          ${renderTabContent(state, activeTab)}
        </div>
      </div>
    `;
  }

  function renderTabContent(state, tab) {
    const wifeSystem = window.StudioGame.Systems.Wife;
    const wife = state.wife;
    const formatRupees = window.StudioGame.Systems.Finance.formatRupees;
    const currentRole = wifeSystem.getRoleById(wife.currentRoleId);
    const allRoles = wifeSystem.getRoles();

    if (tab === 'overview') {
      return `
        <!-- Core Status Meters -->
        <div class="stats-grid-2">
          <div class="stat-box">
            <div class="stat-box-label">Relationship & Trust</div>
            <div class="stat-box-val highlight-rose">${Math.round(wife.relationship)}%</div>
            <div class="meter-bar">
              <div class="meter-fill fill-rose" style="width: ${wife.relationship}%"></div>
            </div>
            <div class="meter-sub">
              ${wife.relationship > 80 ? 'Devoted & Inseparable' : wife.relationship > 60 ? 'Supportive & Cooperative' : 'Distant & Friction'}
            </div>
          </div>

          <div class="stat-box">
            <div class="stat-box-label">Openness Gauge</div>
            <div class="stat-box-val highlight-amber">${wife.openness} <span class="unit">/ 100</span></div>
            <div class="meter-bar">
              <div class="meter-fill fill-amber" style="width: ${Math.max(5, wife.openness)}%"></div>
            </div>
            <div class="meter-sub">Industry socializing & networking</div>
          </div>
        </div>

        <div class="stats-grid-2 mt-3">
          <div class="stat-box">
            <div class="stat-box-label">Physical Fitness & Charm</div>
            <div class="stat-box-val highlight-cyan">${Math.round(wife.fitness)}%</div>
            <div class="meter-bar">
              <div class="meter-fill fill-cyan" style="width: ${wife.fitness}%"></div>
            </div>
            <div class="meter-sub">Screen presence & camera glamour</div>
          </div>

          <div class="stat-box">
            <div class="stat-box-label">Career Earnings to Date</div>
            <div class="stat-box-val highlight-emerald">${formatRupees(wife.careerEarningsTotal || 0)}</div>
            <div class="meter-sub">Accumulated professional income</div>
          </div>
        </div>

        <!-- Professional Competencies & Experience -->
        <div class="card mt-3">
          <div class="card-header">
            <h3 class="card-title">Professional Skills & Acumen</h3>
            <span class="badge badge-indigo text-xs">Self-Learned</span>
          </div>
          <div class="skills-meter-list">
            <div class="skill-meter-row">
              <div class="skill-label-group">
                <span>🎭 Acting & Screen Craft</span>
                <strong>${Math.round(wife.skills.acting)}%</strong>
              </div>
              <div class="meter-bar"><div class="meter-fill fill-cyan" style="width: ${wife.skills.acting}%"></div></div>
            </div>

            <div class="skill-meter-row">
              <div class="skill-label-group">
                <span>👠 Glamour & High Fashion</span>
                <strong>${Math.round(wife.skills.glamour)}%</strong>
              </div>
              <div class="meter-bar"><div class="meter-fill fill-rose" style="width: ${wife.skills.glamour}%"></div></div>
            </div>

            <div class="skill-meter-row">
              <div class="skill-label-group">
                <span>📊 Business & Executive Management</span>
                <strong>${Math.round(wife.skills.business)}%</strong>
              </div>
              <div class="meter-bar"><div class="meter-fill fill-amber" style="width: ${wife.skills.business}%"></div></div>
            </div>

            <div class="skill-meter-row">
              <div class="skill-label-group">
                <span>🎨 Creative Vision & Story Packaging</span>
                <strong>${Math.round(wife.skills.creative)}%</strong>
              </div>
              <div class="meter-bar"><div class="meter-fill fill-indigo" style="width: ${wife.skills.creative}%"></div></div>
            </div>
          </div>
        </div>

        <!-- Active Role Perks Banner -->
        <div class="card mt-3 active-role-summary-card">
          <div class="active-role-headline">
            <span class="role-large-icon">${currentRole.icon}</span>
            <div class="role-headline-info">
              <div class="role-current-name">${currentRole.name}</div>
              <div class="role-monthly-pay">Monthly Compensation: <strong>${formatRupees(currentRole.monthlySalary)}/mo</strong></div>
            </div>
          </div>
          <p class="role-desc-text">${currentRole.description}</p>
          <div class="role-perk-badge">
            <span class="perk-star">✨</span>
            <span class="perk-text">Active Studio Synergy: <strong>${currentRole.studioPerk}</strong></span>
          </div>
        </div>
      `;
    }

    if (tab === 'career') {
      return `
        <!-- Autonomous Career Engine Guidance -->
        <div class="info-callout">
          <div class="callout-icon">💡</div>
          <div class="callout-text">
            <strong>Autonomous Agency Engine</strong><br/>
            ${wife.name} evaluates new opportunities independently based on her skill growth, personal ambition, and relationship with you. You can <strong>nudge</strong> her towards a specific path below to sway her next career decision.
          </div>
        </div>

        ${wife.nudgeRole ? `
          <div class="active-nudge-banner mt-3">
            <div class="nudge-banner-header">
              <span>🎯 Your Active Career Recommendation:</span>
              <span class="badge badge-amber">${wife.nudgeDaysRemaining} Days Left</span>
            </div>
            <div class="nudge-target-name">${wifeSystem.getRoleById(wife.nudgeRole).name}</div>
            <div class="subtext">She is currently weighing your advice during industry opportunities.</div>
          </div>
        ` : ''}

        <!-- Career Options Directory -->
        <div class="section-label mt-4">Available Career Paths & Industry Roles</div>
        <div class="career-roles-list">
          ${allRoles.map(role => {
            const isCurrent = role.id === wife.currentRoleId;
            const isNudged = role.id === wife.nudgeRole;
            const primarySkillVal = wife.skills[role.primarySkill] || 30;

            return `
              <div class="career-role-card ${isCurrent ? 'is-current-role' : ''} ${isNudged ? 'is-nudged-role' : ''}">
                <div class="role-card-top">
                  <div class="role-card-identity">
                    <span class="role-card-icon">${role.icon}</span>
                    <div class="role-card-title-wrap">
                      <div class="role-card-name">${role.name}</div>
                      <span class="role-category-tag">${role.category}</span>
                    </div>
                  </div>
                  <div class="role-salary-tag">${formatRupees(role.monthlySalary)}/mo</div>
                </div>

                <div class="role-card-desc">${role.description}</div>

                <div class="role-meta-row">
                  <div class="role-skill-fit">
                    <span class="subtext">Skill Synergy (${role.primarySkill}):</span>
                    <strong class="${primarySkillVal >= 50 ? 'highlight-emerald' : 'highlight-amber'}">${Math.round(primarySkillVal)}%</strong>
                  </div>
                  <div class="role-studio-synergy">
                    <span class="subtext">Synergy:</span>
                    <span class="text-xs text-muted">${role.studioPerk}</span>
                  </div>
                </div>

                <div class="role-card-actions">
                  ${isCurrent ? `
                    <span class="badge badge-emerald">Active Current Role</span>
                  ` : `
                    <button class="btn btn-sm ${isNudged ? 'btn-outline-amber' : 'btn-secondary'} btn-nudge-career" data-role-id="${role.id}">
                      ${isNudged ? '✓ Actively Nudging' : '💬 Nudge / Advise Path'}
                    </button>
                  `}
                </div>
              </div>
            `;
          }).join('')}
        </div>
      `;
    }

    if (tab === 'actions') {
      return `
        <!-- Section 1: Fitness & Wellness Investments -->
        <div class="section-label">1. Fitness & Screen Radiance Investments</div>
        <p class="subtext mb-3">
          As in real-life cinema, top physical conditioning elevates beauty, camera allure, and fashion runway demand.
        </p>

        <div class="investment-tier-list">
          <div class="investment-card">
            <div class="investment-header">
              <span class="investment-icon">🧘‍♀️</span>
              <div class="investment-info">
                <div class="investment-name">Boutique Pilates & Yoga Studio</div>
                <div class="investment-cost highlight-amber">Cost: ${formatRupees(25000)}</div>
              </div>
            </div>
            <div class="investment-desc">Daily reformer pilates sessions and holistic wellness training in Bandra West.</div>
            <div class="investment-gains">
              <span class="badge badge-cyan">+4% Fitness</span>
              <span class="badge badge-rose">+1.5% Glamour</span>
            </div>
            <button class="btn btn-sm btn-primary btn-action-fitness" data-tier="1">Enroll (${formatRupees(25000)})</button>
          </div>

          <div class="investment-card mt-3">
            <div class="investment-header">
              <span class="investment-icon">🏋️‍♀️</span>
              <div class="investment-info">
                <div class="investment-name">Celebrity Fitness Trainer & Nutritionist</div>
                <div class="investment-cost highlight-amber">Cost: ${formatRupees(75000)}</div>
              </div>
            </div>
            <div class="investment-desc">Dedicated personal trainer to the stars, bespoke organic diet plan, and strength coaching.</div>
            <div class="investment-gains">
              <span class="badge badge-cyan">+9% Fitness</span>
              <span class="badge badge-rose">+3.6% Glamour</span>
            </div>
            <button class="btn btn-sm btn-primary btn-action-fitness" data-tier="2">Retain Trainer (${formatRupees(75000)})</button>
          </div>

          <div class="investment-card mt-3">
            <div class="investment-header">
              <span class="investment-icon">✨</span>
              <div class="investment-info">
                <div class="investment-name">VIP Swiss Wellness & Beauty Sanctuary</div>
                <div class="investment-cost highlight-amber">Cost: ${formatRupees(200000)}</div>
              </div>
            </div>
            <div class="investment-desc">All-inclusive cellular rejuvenation, high-tech aesthetics, and holistic spa retreat.</div>
            <div class="investment-gains">
              <span class="badge badge-cyan">+18% Fitness</span>
              <span class="badge badge-rose">+7.2% Glamour</span>
            </div>
            <button class="btn btn-sm btn-primary btn-action-fitness" data-tier="3">Book Sanctuary (${formatRupees(200000)})</button>
          </div>
        </div>

        <!-- Section 2: Date Nights & Romance -->
        <div class="section-label mt-4">2. Quality Time & Romance</div>
        <p class="subtext mb-3">
          Strengthen your emotional foundation and mutual loyalty. High relationship scores keep her dedicated to the studio.
        </p>

        <div class="investment-tier-list">
          <div class="investment-card">
            <div class="investment-header">
              <span class="investment-icon">🍷</span>
              <div class="investment-info">
                <div class="investment-name">Candlelight Dinner at Taj Sea Lounge</div>
                <div class="investment-cost highlight-amber">Cost: ${formatRupees(15000)}</div>
              </div>
            </div>
            <div class="investment-desc">An evening overlooking the Gateway of India with vintage wine and romantic conversation.</div>
            <div class="investment-gains">
              <span class="badge badge-rose">+3% Relationship</span>
            </div>
            <button class="btn btn-sm btn-secondary btn-action-date" data-tier="1">Reserve Table (${formatRupees(15000)})</button>
          </div>

          <div class="investment-card mt-3">
            <div class="investment-header">
              <span class="investment-icon">👜</span>
              <div class="investment-info">
                <div class="investment-name">Designer Handbag & Luxury Spa Afternoon</div>
                <div class="investment-cost highlight-amber">Cost: ${formatRupees(60000)}</div>
              </div>
            </div>
            <div class="investment-desc">Surprise her with an haute-couture piece from Palladium Mall and an afternoon of pampering.</div>
            <div class="investment-gains">
              <span class="badge badge-rose">+7% Relationship</span>
            </div>
            <button class="btn btn-sm btn-secondary btn-action-date" data-tier="2">Gift Surprise (${formatRupees(60000)})</button>
          </div>

          <div class="investment-card mt-3">
            <div class="investment-header">
              <span class="investment-icon">🛥️</span>
              <div class="investment-info">
                <div class="investment-name">Private Charter Yacht in Goa</div>
                <div class="investment-cost highlight-amber">Cost: ${formatRupees(180000)}</div>
              </div>
            </div>
            <div class="investment-desc">A weekend escape cruising the Arabian Sea, uninterrupted by paparazzi or phone calls.</div>
            <div class="investment-gains">
              <span class="badge badge-rose">+14% Relationship</span>
            </div>
            <button class="btn btn-sm btn-secondary btn-action-date" data-tier="3">Charter Yacht (${formatRupees(180000)})</button>
          </div>
        </div>
      `;
    }

    if (tab === 'chronicle') {
      return `
        <div class="section-label">Career Decisions & Milestones Chronicle</div>
        <p class="subtext mb-3">
          A living record of ${wife.name}'s professional evolution, industry contracts, and studio achievements.
        </p>

        <div class="wife-timeline">
          ${wife.careerHistory.map(entry => {
            const role = wifeSystem.getRoleById(entry.roleId);
            return `
              <div class="timeline-node">
                <div class="timeline-marker">${role ? role.icon : '📌'}</div>
                <div class="timeline-body">
                  <div class="timeline-header">
                    <span class="timeline-title">${entry.title}</span>
                    <span class="timeline-date">${entry.date} (Day ${entry.day})</span>
                  </div>
                  <div class="timeline-desc">${entry.description}</div>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      `;
    }

    return '';
  }

  function open(state, onStateChangeCallback) {
    const viewport = document.getElementById('screenViewport');
    if (!viewport) return;

    viewport.innerHTML = render(state, onStateChangeCallback);
    attachListeners(state, onStateChangeCallback);
  }

  function attachListeners(state, onStateChangeCallback) {
    const wifeSystem = window.StudioGame.Systems.Wife;

    // Back button
    const backBtn = document.getElementById('btnBackFromWife');
    if (backBtn) {
      backBtn.addEventListener('click', () => {
        window.StudioGame.App.showDashboard();
      });
    }

    // Sub-nav tab switching
    document.querySelectorAll('.subnav-tab-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        activeTab = e.currentTarget.getAttribute('data-tab');
        open(state, onStateChangeCallback);
      });
    });

    // Nudge Career Buttons
    document.querySelectorAll('.btn-nudge-career').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const roleId = e.currentTarget.getAttribute('data-role-id');
        const res = wifeSystem.nudgeCareer(state, roleId);
        window.StudioGame.State.autosave();
        alert(res.message);
        open(state, onStateChangeCallback);
      });
    });

    // Fitness Investment Buttons
    document.querySelectorAll('.btn-action-fitness').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const tier = parseInt(e.currentTarget.getAttribute('data-tier'), 10);
        const res = wifeSystem.investFitness(state, tier);
        if (res.success) {
          window.StudioGame.State.autosave();
          alert(`Successfully enrolled in ${res.planName}! Fitness is now ${Math.round(res.newFitness)}%.`);
          open(state, onStateChangeCallback);
        } else {
          alert(res.error);
        }
      });
    });

    // Date Night Buttons
    document.querySelectorAll('.btn-action-date').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const tier = parseInt(e.currentTarget.getAttribute('data-tier'), 10);
        const res = wifeSystem.dateNight(state, tier);
        if (res.success) {
          window.StudioGame.State.autosave();
          alert(`Wonderful time spent! Relationship trust is now ${Math.round(res.newRelationship)}%.`);
          open(state, onStateChangeCallback);
        } else {
          alert(res.error);
        }
      });
    });
  }

  return {
    open
  };
})();
