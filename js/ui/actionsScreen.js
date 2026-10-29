/**
 * Actions Tab UI Component (Version 1.0)
 * Visual Star Casting, Cinema Productions, Bidding RFPs, Active Theatrical Pipeline & Lot Upgrades.
 */

window.StudioGame = window.StudioGame || {};
window.StudioGame.UI = window.StudioGame.UI || {};

window.StudioGame.UI.ActionsScreen = (function() {
  let activeSubTab = 'cinema'; // 'cinema' | 'bids' | 'pipeline' | 'commission' | 'upgrades'

  // Temporary state for Cinema Production
  let cinemaState = {
    formatId: 'mid_film',
    genreId: 'action_masala',
    title: 'The Mumbai Syndicate',
    leadActorId: null,
    leadActressId: null
  };

  // Temporary state for Custom Commercial Project
  let commissionState = {
    format: 'Commercial Photoshoot',
    genreId: 'fashion',
    name: 'Verve Haute Catalog',
    talentId: 'talent_starter_1'
  };

  function render(container, state, callbacks = {}) {
    if (!container || !state) return;
    const projectSystem = window.StudioGame.Systems.Projects;
    projectSystem.ensureProjectState(state);
    window.StudioGame.Systems.Talent.ensureTalentState(state);

    const formatRupees = window.StudioGame.Systems.Finance.formatRupees;
    const capacity = projectSystem.getStudioCapacity(state);
    const activeProjectsCount = state.studio.projects.length;

    // Set default casting if not selected
    const maleTalents = (state.talent || []).filter(t => t.gender === 'male');
    const femaleTalents = (state.talent || []).filter(t => t.gender === 'female');
    if (!cinemaState.leadActorId && maleTalents.length > 0) {
      cinemaState.leadActorId = maleTalents[0].id;
    }
    if (!cinemaState.leadActressId && femaleTalents.length > 0) {
      cinemaState.leadActressId = femaleTalents[0].id;
    }

    container.innerHTML = `
      <div class="screen-page-container">
        <!-- Unified Top App Bar -->
        <header class="top-nav-bar">
          <div class="top-user-wrap">
            <div class="avatar-small">
              <img src="${state.player.avatar}" alt="${state.player.name}" class="avatar-img-round" />
            </div>
            <div class="top-user-meta">
              <div class="top-player-name">${state.player.name}</div>
              <div class="top-studio-tag">${state.studio.name} &bull; Sound Stages (${activeProjectsCount}/${capacity})</div>
            </div>
          </div>

          <div class="top-date-wrap">
            <div class="date-badge">
              <span class="calendar-icon">📅</span>
              <span class="calendar-text">Day ${state.clock.day} &bull; ${state.clock.formattedDate}</span>
            </div>
          </div>

          <div class="top-actions">
            <button class="btn-icon" id="btnOpenSaveManager" title="Save / Settings">
              💾
            </button>
          </div>
        </header>

        <!-- Unified Sticky Turn Controls Bar -->
        <section class="turn-control-bar">
          <div class="turn-bar-inner">
            <button class="btn-turn-primary" id="btnNextDay" title="Advance 1 in-game day">
              <span class="turn-btn-glow"></span>
              <span class="turn-btn-icon">▶</span>
              <span class="turn-btn-text">Next Day</span>
            </button>
            <div class="turn-fast-forward-group">
              <button class="btn-fast-forward" id="btnAdvanceWeek" title="Advance 1 full week">+7D</button>
              <button class="btn-fast-forward" id="btnAdvanceMonth" title="Advance 1 month">+30D</button>
              <button class="btn-fast-forward btn-event-advance" id="btnAdvanceEvent" title="Fast forward to next event">
                ⚡ Event
              </button>
            </div>
          </div>
        </section>

        <!-- Main Content Area -->
        <main class="page-content-padding">
          <!-- Segmented Tab Bar -->
          <nav class="actions-subnav-tabs">
            <button class="actions-tab-btn ${activeSubTab === 'cinema' ? 'active' : ''}" data-subtab="cinema">
              🎬 Cinema & Web Series
            </button>
            <button class="actions-tab-btn ${activeSubTab === 'bids' ? 'active' : ''}" data-subtab="bids">
              📋 Client RFPs (${state.bids.length})
            </button>
            <button class="actions-tab-btn ${activeSubTab === 'pipeline' ? 'active' : ''}" data-subtab="pipeline">
              🎥 Active Pipeline (${activeProjectsCount})
            </button>
            <button class="actions-tab-btn ${activeSubTab === 'commission' ? 'active' : ''}" data-subtab="commission">
              📸 Commercial Shoots
            </button>
            <button class="actions-tab-btn ${activeSubTab === 'upgrades' ? 'active' : ''}" data-subtab="upgrades">
              🏢 Lot Upgrades (${state.studio.upgrades.length})
            </button>
          </nav>

          <!-- Main Tab Body -->
          <div class="actions-body mt-3">
            ${renderSubTabContent(state, activeSubTab)}
          </div>
        </main>
      </div>
    `;

    attachListeners(container, state, callbacks);
  }

  function renderSubTabContent(state, tab) {
    if (tab === 'cinema') return renderCinemaProductionTab(state);
    if (tab === 'bids') return renderBidsTab(state);
    if (tab === 'pipeline') return renderPipelineTab(state);
    if (tab === 'commission') return renderCommissionTab(state);
    if (tab === 'upgrades') return renderUpgradesTab(state);
    return '';
  }

  function renderCinemaProductionTab(state) {
    const formatRupees = window.StudioGame.Systems.Finance.formatRupees;
    const formats = window.StudioGame.Systems.Projects.CINEMA_FORMATS;
    const genres = window.StudioGame.Systems.Projects.CINEMA_GENRES;
    const talents = state.talent || [];

    const selectedFormat = formats.find(f => f.id === cinemaState.formatId) || formats[2];
    const selectedGenre = genres.find(g => g.id === cinemaState.genreId) || genres[0];

    const leadActor = talents.find(t => t.id === cinemaState.leadActorId) || talents.find(t => t.gender === 'male');
    const leadActress = talents.find(t => t.id === cinemaState.leadActressId) || talents.find(t => t.gender === 'female');

    const actorFee = leadActor ? (leadActor.contractStatus === 'signed_player' ? Math.round(leadActor.averageFee * 0.2) : leadActor.averageFee) : 500000;
    const actressFee = leadActress ? (leadActress.contractStatus === 'signed_player' ? Math.round(leadActress.averageFee * 0.2) : leadActress.averageFee) : 500000;
    let totalEst = selectedFormat.baseCost + actorFee + actressFee;

    if (state.player.skill === 'brilliant_manager') {
      totalEst *= 0.75;
    }
    totalEst = Math.round(totalEst);
    const canAfford = state.studio.cash >= totalEst;

    const actorAvatar = leadActor ? window.StudioGame.Face.generate({ gender: 'male', seed: leadActor.avatarSeed || leadActor.name }) : '';
    const actressAvatar = leadActress ? window.StudioGame.Face.generate({ gender: 'female', seed: leadActress.avatarSeed || leadActress.name }) : '';

    return `
      <div class="cinema-production-layout">
        <!-- Production Banner -->
        <div class="info-callout mb-3">
          <div class="callout-icon">👑</div>
          <div class="callout-text">
            <strong>Feature Film & Web Series Production Studio</strong><br/>
            Package scripts, attach headlining stars from your talent roster, finance physical production, and release nationwide for theatrical runs and multi-Crore OTT streaming rights deals!
          </div>
        </div>

        <!-- Format Selector -->
        <div class="card p-3 mb-3">
          <label class="form-label font-bold">1. Select Production Tier (Section 3.6)</label>
          <div class="cinema-formats-grid">
            ${formats.map(f => `
              <div class="format-choice-card ${cinemaState.formatId === f.id ? 'active' : ''}" data-format-id="${f.id}">
                <div class="f-icon">${f.icon}</div>
                <div class="f-info">
                  <div class="f-name">${f.name}</div>
                  <div class="f-dur">${f.durationDays} Days &bull; ${f.theatricalWeeks > 0 ? `${f.theatricalWeeks} Wks In Theatres` : 'Direct OTT Showcase'}</div>
                  <div class="f-cost highlight-gold font-mono">${formatRupees(f.baseCost)} Base</div>
                </div>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Title & Genre -->
        <div class="card p-3 mb-3">
          <label class="form-label font-bold">2. Script & Genre Packaging</label>
          <div class="form-group mb-2">
            <label class="form-label">Project Title</label>
            <input type="text" id="inputCinemaTitle" class="form-input font-bold" value="${escapeHtml(cinemaState.title)}" />
          </div>

          <div class="form-group mt-2">
            <label class="form-label">Genre</label>
            <select id="selectCinemaGenre" class="form-input">
              ${genres.map(g => `
                <option value="${g.id}" ${cinemaState.genreId === g.id ? 'selected' : ''}>
                  ${g.icon} ${g.name}
                </option>
              `).join('')}
            </select>
          </div>
        </div>

        <!-- Visual Star Casting Picker -->
        <div class="card p-3 mb-3">
          <div class="card-header-between mb-2">
            <div>
              <label class="form-label font-bold mb-0">3. Lead Star Cast Selection</label>
              <div class="subtext">Signed studio stars cost <strong>80% less</strong> than outside free agents!</div>
            </div>
          </div>

          <div class="visual-casting-grid">
            <!-- Lead Actor Card -->
            <div class="casting-star-card">
              <div class="casting-card-avatar">
                <img src="${actorAvatar}" alt="${leadActor?.name}" class="avatar-img-square" />
              </div>
              <div class="casting-card-info">
                <span class="casting-role-badge">Lead Hero / Actor</span>
                <h4 class="casting-star-name">${escapeHtml(leadActor?.name || 'Select Actor')}</h4>
                <div class="casting-star-meta">
                  <span class="badge ${leadActor?.contractStatus === 'signed_player' ? 'badge-emerald' : 'badge-slate'}">
                    ${leadActor?.contractStatus === 'signed_player' ? '⭐ SIGNED (80% OFF)' : 'Free Agent'}
                  </span>
                  <span class="badge badge-amber font-mono">${formatRupees(actorFee)}</span>
                </div>
                <div class="casting-stats-mini mt-1">
                  <span>Acting: <strong>${leadActor?.acting || 50}</strong></span>
                  <span>Glamour: <strong>${leadActor?.glamour || 50}</strong></span>
                  <span>Fans: <strong>${window.StudioGame.Systems.Talent.formatFans(leadActor?.fans || 0)}</strong></span>
                </div>
              </div>
              <button class="btn btn-sm btn-secondary btn-open-cast-picker" data-cast-gender="male">
                Change Actor
              </button>
            </div>

            <!-- Lead Actress Card -->
            <div class="casting-star-card">
              <div class="casting-card-avatar">
                <img src="${actressAvatar}" alt="${leadActress?.name}" class="avatar-img-square" />
              </div>
              <div class="casting-card-info">
                <span class="casting-role-badge">Lead Heroine / Actress</span>
                <h4 class="casting-star-name">${escapeHtml(leadActress?.name || 'Select Actress')}</h4>
                <div class="casting-star-meta">
                  <span class="badge ${leadActress?.contractStatus === 'signed_player' ? 'badge-emerald' : 'badge-slate'}">
                    ${leadActress?.contractStatus === 'signed_player' ? '⭐ SIGNED (80% OFF)' : 'Free Agent'}
                  </span>
                  <span class="badge badge-amber font-mono">${formatRupees(actressFee)}</span>
                </div>
                <div class="casting-stats-mini mt-1">
                  <span>Acting: <strong>${leadActress?.acting || 50}</strong></span>
                  <span>Glamour: <strong>${leadActress?.glamour || 50}</strong></span>
                  <span>Fans: <strong>${window.StudioGame.Systems.Talent.formatFans(leadActress?.fans || 0)}</strong></span>
                </div>
              </div>
              <button class="btn btn-sm btn-secondary btn-open-cast-picker" data-cast-gender="female">
                Change Actress
              </button>
            </div>
          </div>
        </div>

        <!-- Cost & Greenlight Summary -->
        <div class="card p-3 mb-3">
          <div class="cinema-budget-summary">
            <div class="budget-line">
              <span>Production Scale Base (${selectedFormat.name}):</span>
              <span class="font-mono">${formatRupees(selectedFormat.baseCost)}</span>
            </div>
            <div class="budget-line">
              <span>Lead Actor (${leadActor?.name}):</span>
              <span class="font-mono">${formatRupees(actorFee)}</span>
            </div>
            <div class="budget-line">
              <span>Lead Actress (${leadActress?.name}):</span>
              <span class="font-mono">${formatRupees(actressFee)}</span>
            </div>
            ${state.player.skill === 'brilliant_manager' ? `
              <div class="budget-line highlight-emerald font-bold">
                <span>✍️ Brilliant Manager Discount (-25%):</span>
                <span class="font-mono">Applied</span>
              </div>
            ` : ''}
            <div class="budget-divider my-2"></div>
            <div class="budget-total-line">
              <span class="font-bold">Total Greenlight Budget:</span>
              <span class="highlight-gold font-mono font-bold">${formatRupees(totalEst)}</span>
            </div>
          </div>

          <button class="btn btn-primary btn-full mt-3" id="btnGreenlightCinema" ${!canAfford ? 'disabled' : ''}>
            ${canAfford ? `🎬 Greenlight & Begin Shoot (${formatRupees(totalEst)})` : `Insufficient Funds (${formatRupees(totalEst)} required)`}
          </button>
        </div>
      </div>
    `;
  }

  function renderBidsTab(state) {
    const formatRupees = window.StudioGame.Systems.Finance.formatRupees;
    const bids = state.bids || [];

    if (bids.length === 0) {
      return `
        <div class="empty-state-card text-center p-4">
          <div class="empty-icon">📭</div>
          <div class="empty-title">No Active Client RFPs</div>
          <div class="empty-sub text-muted">Advance turns on the clock to receive new client campaign requests.</div>
        </div>
      `;
    }

    return `
      <div class="bids-list">
        ${bids.map(rfp => `
          <div class="rfp-card card p-3 mb-3" data-rfp-id="${rfp.id}">
            <div class="rfp-header">
              <div>
                <span class="badge badge-purple">${rfp.brandTier}</span>
                <h3 class="rfp-title mt-1">${rfp.clientName} &bull; ${rfp.format}</h3>
              </div>
              <div class="rfp-budget-badge">
                <span class="rfp-budget-lbl text-muted">Max Budget</span>
                <span class="rfp-budget-val highlight-amber font-mono">${formatRupees(rfp.clientMaxBudget)}</span>
              </div>
            </div>

            <p class="rfp-desc mt-2">${rfp.description}</p>

            <div class="rfp-rivals-box my-2">
              <span class="rivals-label">Competing Bidders:</span>
              <div class="rivals-chips">
                ${rfp.rivals.map(r => `<span class="rival-chip">🏢 ${r.name}</span>`).join('')}
              </div>
            </div>

            <div class="rfp-bid-control mt-2">
              <div class="bid-slider-row">
                <span>Your Proposed Bid:</span>
                <span class="bid-amount-display highlight-emerald font-mono" id="bidDisplay_${rfp.id}">
                  ${formatRupees(Math.round(rfp.clientMaxBudget * 0.90))}
                </span>
              </div>
              <input type="range" class="form-range rfp-bid-slider"
                data-rfp-id="${rfp.id}"
                min="${Math.round(rfp.clientMaxBudget * 0.70)}"
                max="${Math.round(rfp.clientMaxBudget * 1.10)}"
                step="25000"
                value="${Math.round(rfp.clientMaxBudget * 0.90)}">
            </div>

            <button class="btn btn-primary btn-full mt-3 btn-submit-bid" data-rfp-id="${rfp.id}">
              Submit Bid Proposal
            </button>
          </div>
        `).join('')}
      </div>
    `;
  }

  function renderPipelineTab(state) {
    const formatRupees = window.StudioGame.Systems.Finance.formatRupees;
    const projects = state.studio.projects || [];

    if (projects.length === 0) {
      return `
        <div class="empty-state-card text-center p-4">
          <div class="empty-icon">🎬</div>
          <div class="empty-title">Sound Stages Are Dark</div>
          <div class="empty-sub text-muted">No active cinema or commercial shoots on the floor. Visit the Cinema or RFPs tab to greenlight productions.</div>
        </div>
      `;
    }

    return `
      <div class="pipeline-list">
        ${projects.map(proj => {
          const isTheatrical = proj.inTheatres;
          const progressPct = isTheatrical ? 100 : Math.min(100, Math.round((proj.daysElapsed / proj.totalDays) * 100));

          return `
            <div class="card p-3 mb-3 pipeline-card ${isTheatrical ? 'theatrical-active-card' : ''}">
              <div class="pipeline-card-header">
                <div>
                  <span class="badge ${isTheatrical ? 'badge-gold pulse' : 'badge-blue'}">
                    ${isTheatrical ? '🎟️ IN THEATRES' : proj.format}
                  </span>
                  <h3 class="pipeline-title mt-1">${escapeHtml(proj.name)}</h3>
                </div>
                <div class="pipeline-timing text-right">
                  ${isTheatrical ? `
                    <span class="theatrical-week-pill highlight-gold">Week ${proj.theatricalWeekCurrent} of ${proj.theatricalWeeks}</span>
                  ` : `
                    <span class="days-remaining font-mono">${proj.totalDays - proj.daysElapsed} Days Remaining</span>
                  `}
                </div>
              </div>

              <div class="pipeline-stage-banner my-2">
                <span class="stage-tag">${proj.stage}</span>
              </div>

              <div class="pipeline-progress-wrap">
                <div class="pipeline-progress-bar" style="width: ${progressPct}%"></div>
              </div>

              ${isTheatrical ? `
                <div class="theatrical-live-boxoffice mt-3">
                  <div class="stat-mini">
                    <span class="lbl">This Week's Gross:</span>
                    <span class="val highlight-emerald font-mono">${formatRupees(proj.theatricalGrossWeek)}</span>
                  </div>
                  <div class="stat-mini">
                    <span class="lbl">Total Cumulative Box Office:</span>
                    <span class="val highlight-gold font-mono">${formatRupees(proj.theatricalGrossTotal)}</span>
                  </div>
                </div>
              ` : `
                <div class="pipeline-financials mt-2">
                  <span>Invested Budget: <strong class="font-mono">${formatRupees(proj.upfrontInvested)}</strong></span>
                  ${proj.agreedPayout ? `<span>Agreed Payout: <strong class="highlight-emerald font-mono">${formatRupees(proj.agreedPayout)}</strong></span>` : ''}
                </div>
              `}
            </div>
          `;
        }).join('')}
      </div>
    `;
  }

  function renderCommissionTab(state) {
    const formatRupees = window.StudioGame.Systems.Finance.formatRupees;
    const projectSystem = window.StudioGame.Systems.Projects;
    const genres = window.StudioGame.Data.Contracts?.genres || [];
    const starterTalent = window.StudioGame.Data.Contracts?.starterTalent || [];

    const bill = projectSystem.calculateCostBill(state, {
      format: commissionState.format,
      talent: starterTalent.find(t => t.id === commissionState.talentId) || starterTalent[0]
    });

    return `
      <div class="commission-layout">
        <div class="card p-3 mb-3">
          <label class="form-label font-bold">Commercial Shoot Format</label>
          <div class="format-toggle-group">
            <button type="button" class="btn-toggle ${commissionState.format === 'Commercial Photoshoot' ? 'active' : ''}" data-format="Commercial Photoshoot">
              📸 Photoshoot (2 Days)
            </button>
            <button type="button" class="btn-toggle ${commissionState.format === 'Short Ad Film' ? 'active' : ''}" data-format="Short Ad Film">
              🎥 Short Ad Film (8 Days)
            </button>
          </div>

          <div class="form-group mt-3">
            <label class="form-label">Project Title</label>
            <input type="text" id="inputProjectName" class="form-input font-bold" value="${escapeHtml(commissionState.name)}" />
          </div>

          <div class="form-group mt-3">
            <label class="form-label">Commercial Genre</label>
            <select id="selectGenre" class="form-input">
              ${genres.map(g => `
                <option value="${g.id}" ${commissionState.genreId === g.id ? 'selected' : ''}>
                  ${g.icon} ${g.name}
                </option>
              `).join('')}
            </select>
          </div>
        </div>

        <div class="section-label mt-3 font-bold">Select Commercial Model</div>
        <div class="talent-choice-list mb-3">
          ${starterTalent.map(t => {
            const avatarUrl = window.StudioGame.Face.generate({ gender: t.gender, seed: t.avatarSeed || t.name });
            return `
              <div class="talent-starter-card ${commissionState.talentId === t.id ? 'selected' : ''}" data-talent-id="${t.id}">
                <div class="starter-avatar-wrap">
                  <img src="${avatarUrl}" alt="${t.name}" class="avatar-img-square" />
                </div>
                <div class="starter-card-body">
                  <div class="talent-starter-header">
                    <div class="talent-starter-name">${t.name}</div>
                    <div class="talent-starter-fee highlight-amber font-mono">${formatRupees(t.flatFee)}</div>
                  </div>
                  <div class="talent-starter-cat">${t.category}</div>
                  <div class="talent-starter-bio">${t.bio}</div>
                </div>
              </div>
            `;
          }).join('')}
        </div>

        <div class="card cost-bill-card p-3">
          <div class="card-header">
            <h3 class="card-title">Itemized Project Cost Audit</h3>
            <span class="badge badge-slate">${bill.format}</span>
          </div>

          <div class="bill-line-items">
            ${bill.lineItems.map(item => `
              <div class="bill-line-row">
                <span class="bill-item-label">${item.label}</span>
                <span class="bill-item-val font-mono">${formatRupees(item.amount)}</span>
              </div>
            `).join('')}

            ${bill.managerDiscount > 0 ? `
              <div class="bill-line-row discount-row highlight-emerald">
                <span class="bill-item-label">✍️ Brilliant Manager (-25%)</span>
                <span class="bill-item-val font-mono">-${formatRupees(bill.managerDiscount)}</span>
              </div>
            ` : ''}

            <div class="bill-divider my-2"></div>
            <div class="bill-total-row">
              <span class="font-bold">Total Greenlight Cost:</span>
              <span class="highlight-amber font-mono font-bold">${formatRupees(bill.totalCost)}</span>
            </div>
          </div>

          <button class="btn btn-primary btn-full mt-3" id="btnLaunchCustomProject" ${!bill.canAfford ? 'disabled' : ''}>
            ${bill.canAfford ? `Sign Contract & Start Shoot (${formatRupees(bill.totalCost)})` : 'Insufficient Funds'}
          </button>
        </div>
      </div>
    `;
  }

  function renderUpgradesTab(state) {
    const formatRupees = window.StudioGame.Systems.Finance.formatRupees;
    const catalog = window.StudioGame.Data.Upgrades || [];
    const owned = state.studio.upgrades || [];

    return `
      <div class="upgrades-list">
        ${catalog.map(upg => {
          const isOwned = owned.includes(upg.id);
          const canAfford = state.studio.cash >= upg.cost;

          return `
            <div class="upgrade-card card p-3 mb-3 ${isOwned ? 'owned' : ''}">
              <div class="upgrade-header">
                <div>
                  <h3 class="upgrade-name">${upg.name}</h3>
                  <span class="upgrade-cat badge badge-blue">${upg.category}</span>
                </div>
                <div class="upgrade-cost-box">
                  <span class="upgrade-cost highlight-amber font-mono">${formatRupees(upg.cost)}</span>
                </div>
              </div>

              <p class="upgrade-desc mt-2">${upg.description}</p>

              <div class="upgrade-meta-grid my-2">
                <div class="meta-item">
                  <span class="meta-label">Valuation Added</span>
                  <span class="meta-val highlight-emerald font-mono">+${formatRupees(upg.assetValue)}</span>
                </div>
                <div class="meta-item">
                  <span class="meta-label">Daily Upkeep</span>
                  <span class="meta-val font-mono">${formatRupees(upg.dailyOverhead)}/day</span>
                </div>
              </div>

              <div class="upgrade-action-row mt-2">
                ${isOwned ? `
                  <button class="btn btn-secondary btn-full" disabled>Installed on Studio Lot ✅</button>
                ` : `
                  <button class="btn btn-primary btn-full btn-buy-upgrade" data-upgrade-id="${upg.id}" ${!canAfford ? 'disabled' : ''}>
                    ${canAfford ? `Purchase Upgrade (${formatRupees(upg.cost)})` : 'Insufficient Cash'}
                  </button>
                `}
              </div>
            </div>
          `;
        }).join('')}
      </div>
    `;
  }

  function attachListeners(container, state, callbacks) {
    // Top bar & turn controls
    container.querySelector('#btnNextDay')?.addEventListener('click', () => callbacks.onAdvanceTurn?.(1));
    container.querySelector('#btnAdvanceWeek')?.addEventListener('click', () => callbacks.onAdvanceTurn?.(7));
    container.querySelector('#btnAdvanceMonth')?.addEventListener('click', () => callbacks.onAdvanceTurn?.(30));
    container.querySelector('#btnAdvanceEvent')?.addEventListener('click', () => callbacks.onAdvanceToEvent?.());

    container.querySelector('#btnOpenSaveManager')?.addEventListener('click', () => {
      window.StudioGame.UI.SaveModal.open(state, callbacks.onStateChange);
    });

    // Subnav tabs
    container.querySelectorAll('.actions-tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        activeSubTab = btn.getAttribute('data-subtab');
        render(container, state, callbacks);
      });
    });

    // Cinema format selection
    container.querySelectorAll('.format-choice-card').forEach(card => {
      card.addEventListener('click', () => {
        cinemaState.formatId = card.getAttribute('data-format-id');
        render(container, state, callbacks);
      });
    });

    // Cinema Title
    const titleInput = container.querySelector('#inputCinemaTitle');
    if (titleInput) {
      titleInput.addEventListener('input', (e) => {
        cinemaState.title = e.target.value;
      });
    }

    // Cinema Genre
    const genreSelect = container.querySelector('#selectCinemaGenre');
    if (genreSelect) {
      genreSelect.addEventListener('change', (e) => {
        cinemaState.genreId = e.target.value;
        render(container, state, callbacks);
      });
    }

    // Star Casting Picker Buttons (Change Actor / Actress)
    container.querySelectorAll('.btn-open-cast-picker').forEach(btn => {
      btn.addEventListener('click', () => {
        const gender = btn.getAttribute('data-cast-gender');
        openStarCastingModal(gender, state, (selectedId) => {
          if (gender === 'male') {
            cinemaState.leadActorId = selectedId;
          } else {
            cinemaState.leadActressId = selectedId;
          }
          render(container, state, callbacks);
        });
      });
    });

    // Greenlight Cinema button
    container.querySelector('#btnGreenlightCinema')?.addEventListener('click', () => {
      const res = window.StudioGame.Systems.Projects.launchCinemaFeature(state, cinemaState);
      if (res.success) {
        window.StudioGame.State.autosave();
        callbacks.onStateChange?.();
        window.StudioGame.App.showToast(`🎬 Greenlit "${res.project.name}"! Production is underway.`);
        activeSubTab = 'pipeline';
        render(container, state, callbacks);
      } else {
        window.StudioGame.App.showToast(`⚠️ ${res.error}`);
      }
    });

    // RFP Bid sliders
    container.querySelectorAll('.rfp-bid-slider').forEach(slider => {
      slider.addEventListener('input', () => {
        const rfpId = slider.getAttribute('data-rfp-id');
        const display = container.querySelector(`#bidDisplay_${rfpId}`);
        if (display) {
          display.textContent = window.StudioGame.Systems.Finance.formatRupees(parseInt(slider.value, 10));
        }
      });
    });

    // Submit Bid buttons
    container.querySelectorAll('.btn-submit-bid').forEach(btn => {
      btn.addEventListener('click', () => {
        const rfpId = btn.getAttribute('data-rfp-id');
        const slider = container.querySelector(`.rfp-bid-slider[data-rfp-id="${rfpId}"]`);
        const amount = parseInt(slider?.value || 0, 10);

        const res = window.StudioGame.Systems.Projects.submitBid(state, rfpId, amount);
        if (res.won) {
          window.StudioGame.State.autosave();
          callbacks.onStateChange?.();
          window.StudioGame.App.showToast(`🏆 Won Contract! ${res.message}`);
          activeSubTab = 'pipeline';
          render(container, state, callbacks);
        } else {
          window.StudioGame.App.showToast(`❌ Bid Lost: ${res.message}`);
          render(container, state, callbacks);
        }
      });
    });

    // Commercial Format Toggles
    container.querySelectorAll('.format-toggle-group .btn-toggle').forEach(btn => {
      btn.addEventListener('click', () => {
        commissionState.format = btn.getAttribute('data-format');
        render(container, state, callbacks);
      });
    });

    // Commercial Model cards
    container.querySelectorAll('.talent-starter-card').forEach(card => {
      card.addEventListener('click', () => {
        commissionState.talentId = card.getAttribute('data-talent-id');
        render(container, state, callbacks);
      });
    });

    // Launch Commercial project
    container.querySelector('#btnLaunchCustomProject')?.addEventListener('click', () => {
      const res = window.StudioGame.Systems.Projects.launchCustomProject(state, commissionState);
      if (res.success) {
        window.StudioGame.State.autosave();
        callbacks.onStateChange?.();
        window.StudioGame.App.showToast(`🎬 Started Commercial Shoot: ${res.project.name}!`);
        activeSubTab = 'pipeline';
        render(container, state, callbacks);
      } else {
        window.StudioGame.App.showToast(`⚠️ ${res.error}`);
      }
    });

    // Upgrade buttons
    container.querySelectorAll('.btn-buy-upgrade').forEach(btn => {
      btn.addEventListener('click', () => {
        const upgId = btn.getAttribute('data-upgrade-id');
        const res = window.StudioGame.Systems.Projects.purchaseUpgrade(state, upgId);
        if (res.success) {
          window.StudioGame.State.autosave();
          callbacks.onStateChange?.();
          window.StudioGame.App.showToast(`🏗️ Facility installed: ${res.upgrade.name}!`);
          render(container, state, callbacks);
        } else {
          window.StudioGame.App.showToast(`⚠️ ${res.error}`);
        }
      });
    });
  }

  /**
   * Modal for Visual Star Casting Picker with Search & Signed Star priority
   */
  function openStarCastingModal(gender, state, onSelect) {
    const existing = document.getElementById('starCastingModal');
    if (existing) existing.remove();

    const formatRupees = window.StudioGame.Systems.Finance.formatRupees;
    const formatFans = window.StudioGame.Systems.Talent.formatFans;
    const allStars = (state.talent || []).filter(t => t.gender === gender);

    let searchTxt = '';
    let filterSignedOnly = false;

    const backdrop = document.createElement('div');
    backdrop.className = 'modal-backdrop';
    backdrop.id = 'starCastingModal';

    function renderModalContent() {
      const filteredStars = allStars.filter(s => {
        if (filterSignedOnly && s.contractStatus !== 'signed_player') return false;
        if (searchTxt.trim()) {
          const q = searchTxt.toLowerCase().trim();
          return s.name.toLowerCase().includes(q) || s.category.toLowerCase().includes(q);
        }
        return true;
      });

      // Sort signed stars to the top!
      filteredStars.sort((a, b) => {
        if (a.contractStatus === 'signed_player' && b.contractStatus !== 'signed_player') return -1;
        if (b.contractStatus === 'signed_player' && a.contractStatus !== 'signed_player') return 1;
        return b.fans - a.fans;
      });

      backdrop.innerHTML = `
        <div class="modal-card modal-lg slide-up">
          <div class="modal-header">
            <div class="modal-title-wrap">
              <span class="badge badge-amber">${gender === 'female' ? 'Leading Actress' : 'Leading Actor'}</span>
              <h2 class="modal-title">Cast Star Artiste</h2>
            </div>
            <button class="btn-icon-close" id="btnCloseCastingModal" aria-label="Close">&times;</button>
          </div>

          <div class="modal-body casting-modal-body">
            <div class="casting-search-toolbar">
              <input type="text" id="castingSearchInput" class="form-input" placeholder="Search by star name or category..." value="${escapeHtml(searchTxt)}">
              <button class="filter-pill ${filterSignedOnly ? 'active' : ''}" id="btnToggleSignedOnly">
                ⭐ Signed Exclusive Only
              </button>
            </div>

            <div class="casting-star-results-list mt-3">
              ${filteredStars.map(star => {
                const isSigned = star.contractStatus === 'signed_player';
                const effectiveFee = isSigned ? Math.round(star.averageFee * 0.2) : star.averageFee;
                const avatarUrl = window.StudioGame.Face.generate({ gender: star.gender, seed: star.avatarSeed || star.name });

                return `
                  <div class="casting-result-item ${isSigned ? 'is-signed-item' : ''}" data-star-id="${star.id}">
                    <div class="casting-item-avatar">
                      <img src="${avatarUrl}" alt="${star.name}" class="avatar-img-square" />
                    </div>
                    <div class="casting-item-info">
                      <div class="casting-item-header">
                        <span class="star-name font-bold">${escapeHtml(star.name)}</span>
                        <span class="badge ${isSigned ? 'badge-emerald' : 'badge-slate'}">
                          ${isSigned ? '⭐ SIGNED (80% OFF)' : star.category}
                        </span>
                      </div>
                      <div class="casting-item-meta">
                        <span>🔥 ${formatFans(star.fans)}</span>
                        <span>Acting: <strong>${star.acting}</strong></span>
                        <span>Glamour: <strong>${star.glamour}</strong></span>
                        <span class="highlight-gold font-mono font-bold">${formatRupees(effectiveFee)}</span>
                      </div>
                    </div>
                    <button class="btn btn-sm ${isSigned ? 'btn-emerald' : 'btn-primary'} btn-select-star" data-star-id="${star.id}">
                      Select
                    </button>
                  </div>
                `;
              }).join('')}
            </div>
          </div>
        </div>
      `;

      // Event listeners
      backdrop.querySelector('#btnCloseCastingModal')?.addEventListener('click', () => backdrop.remove());
      backdrop.addEventListener('click', (e) => {
        if (e.target === backdrop) backdrop.remove();
      });

      const input = backdrop.querySelector('#castingSearchInput');
      if (input) {
        input.focus();
        input.selectionStart = input.selectionEnd = input.value.length;
        input.addEventListener('input', (e) => {
          searchTxt = e.target.value;
          renderModalContent();
        });
      }

      backdrop.querySelector('#btnToggleSignedOnly')?.addEventListener('click', () => {
        filterSignedOnly = !filterSignedOnly;
        renderModalContent();
      });

      backdrop.querySelectorAll('.btn-select-star, .casting-result-item').forEach(el => {
        el.addEventListener('click', () => {
          const sId = el.getAttribute('data-star-id');
          if (sId) {
            onSelect(sId);
            backdrop.remove();
          }
        });
      });
    }

    document.body.appendChild(backdrop);
    renderModalContent();
  }

  function escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  return {
    render
  };
})();
