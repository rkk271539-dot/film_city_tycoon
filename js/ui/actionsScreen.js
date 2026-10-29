/**
 * Actions Tab UI Component (Version 0.6)
 * Interface for Commercial Bids, Cinema & Web Series Production,
 * Active Theatrical & Production Pipeline, Custom Commercials, and Facility Upgrades.
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
      <div class="actions-page-container">
        <!-- Top Operations Bar -->
        <header class="actions-header">
          <div class="actions-header-title-wrap">
            <span class="badge badge-emerald">Studio Operations</span>
            <h1 class="actions-title">Cinema & Commercial Productions</h1>
          </div>
          <div class="actions-header-stats">
            <div class="header-stat-pill">
              <span class="stat-pill-label">Sound Stages</span>
              <span class="stat-pill-val ${activeProjectsCount >= capacity ? 'text-rose' : 'highlight-cyan'}">
                ${activeProjectsCount} / ${capacity} Occupied
              </span>
            </div>
            <div class="header-stat-pill">
              <span class="stat-pill-label">Studio Cash</span>
              <span class="stat-pill-val highlight-amber">${formatRupees(state.studio.cash)}</span>
            </div>
          </div>
        </header>

        <!-- Segmented Tab Bar -->
        <nav class="actions-subnav-tabs">
          <button class="actions-tab-btn ${activeSubTab === 'cinema' ? 'active' : ''}" data-subtab="cinema">
            🎬 Feature Films & Series
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
        <div class="actions-body">
          ${renderSubTabContent(state, activeSubTab)}
        </div>
      </div>
    `;

    attachListeners(container, state, callbacks);
  }

  function renderSubTabContent(state, tab) {
    const formatRupees = window.StudioGame.Systems.Finance.formatRupees;
    const projectSystem = window.StudioGame.Systems.Projects;

    if (tab === 'cinema') {
      return renderCinemaProductionTab(state);
    }

    if (tab === 'bids') {
      return renderBidsTab(state);
    }

    if (tab === 'pipeline') {
      return renderPipelineTab(state);
    }

    if (tab === 'commission') {
      return renderCommissionTab(state);
    }

    if (tab === 'upgrades') {
      return renderUpgradesTab(state);
    }

    return '';
  }

  function renderCinemaProductionTab(state) {
    const formatRupees = window.StudioGame.Systems.Finance.formatRupees;
    const formats = window.StudioGame.Systems.Projects.CINEMA_FORMATS;
    const genres = window.StudioGame.Systems.Projects.CINEMA_GENRES;
    const talents = state.talent || [];

    const selectedFormat = formats.find(f => f.id === cinemaState.formatId) || formats[2];
    const selectedGenre = genres.find(g => g.id === cinemaState.genreId) || genres[0];

    const leadActor = talents.find(t => t.id === cinemaState.leadActorId);
    const leadActress = talents.find(t => t.id === cinemaState.leadActressId);

    // Compute estimated cost
    let actorFee = leadActor ? (leadActor.contractStatus === 'signed_player' ? Math.round(leadActor.averageFee * 0.2) : leadActor.averageFee) : 500000;
    let actressFee = leadActress ? (leadActress.contractStatus === 'signed_player' ? Math.round(leadActress.averageFee * 0.2) : leadActress.averageFee) : 500000;
    let totalEst = selectedFormat.baseCost + actorFee + actressFee;

    if (state.player.skill === 'brilliant_manager') {
      totalEst *= 0.75;
    }
    totalEst = Math.round(totalEst);
    const canAfford = state.studio.cash >= totalEst;

    return `
      <div class="cinema-production-layout">
        <div class="info-callout mb-3">
          <div class="callout-icon">👑</div>
          <div class="callout-text">
            <strong>Feature Film & Web Series Production Studio</strong><br/>
            Package cinematic scripts, attach headlining actors & actresses from your talent roster, finance physical production, and distribute nationwide for massive theatrical ticket runs and streaming licensing windfalls!
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
                  <div class="f-dur">${f.durationDays} Days &bull; ${f.theatricalWeeks > 0 ? `${f.theatricalWeeks} Wks Theatrical` : 'Direct OTT'}</div>
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
            <input type="text" id="inputCinemaTitle" class="form-control-input font-bold" value="${escapeHtml(cinemaState.title)}" />
          </div>

          <div class="form-group mt-2">
            <label class="form-label">Genre</label>
            <select id="selectCinemaGenre" class="form-select-control">
              ${genres.map(g => `
                <option value="${g.id}" ${cinemaState.genreId === g.id ? 'selected' : ''}>
                  ${g.icon} ${g.name}
                </option>
              `).join('')}
            </select>
          </div>
        </div>

        <!-- Casting Section -->
        <div class="card p-3 mb-3">
          <label class="form-label font-bold">3. Star Cast Selection</label>
          <p class="subtext mb-2">Artistes signed to your studio cost 80% less than outside free agents!</p>

          <div class="casting-selectors-grid">
            <div class="form-group">
              <label class="form-label">Lead Actor</label>
              <select id="selectLeadActor" class="form-select-control font-mono">
                ${talents.filter(t => t.gender === 'male').slice(0, 50).map(t => `
                  <option value="${t.id}" ${cinemaState.leadActorId === t.id ? 'selected' : ''}>
                    ${t.name} (${t.category}) &bull; ${t.contractStatus === 'signed_player' ? '⭐ SIGNED' : formatRupees(t.averageFee)}
                  </option>
                `).join('')}
              </select>
            </div>

            <div class="form-group">
              <label class="form-label">Lead Actress</label>
              <select id="selectLeadActress" class="form-select-control font-mono">
                ${talents.filter(t => t.gender === 'female').slice(0, 50).map(t => `
                  <option value="${t.id}" ${cinemaState.leadActressId === t.id ? 'selected' : ''}>
                    ${t.name} (${t.category}) &bull; ${t.contractStatus === 'signed_player' ? '⭐ SIGNED' : formatRupees(t.averageFee)}
                  </option>
                `).join('')}
              </select>
            </div>
          </div>
        </div>

        <!-- Cost & Greenlight Summary -->
        <div class="card p-3 mb-3">
          <div class="cinema-budget-summary">
            <div class="budget-line">
              <span>Production Scale Base:</span>
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
              <div class="budget-line highlight-emerald">
                <span>Brilliant Manager Discount:</span>
                <span class="font-mono">-25%</span>
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
          <div class="empty-sub text-muted">No active cinema or commercial shoots on the floor. Visit the Feature Films or RFPs tab to greenlight productions.</div>
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

              <!-- Progress Bar -->
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
                  <span>Invested Budget: <strong>${formatRupees(proj.upfrontInvested)}</strong></span>
                  ${proj.agreedPayout ? `<span>Agreed Payout: <strong class="highlight-emerald">${formatRupees(proj.agreedPayout)}</strong></span>` : ''}
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
            <input type="text" id="inputProjectName" class="form-control-input font-bold" value="${escapeHtml(commissionState.name)}" />
          </div>

          <div class="form-group mt-3">
            <label class="form-label">Commercial Genre</label>
            <select id="selectGenre" class="form-select-control">
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
          ${starterTalent.map(t => `
            <div class="talent-starter-card ${commissionState.talentId === t.id ? 'selected' : ''}" data-talent-id="${t.id}">
              <div class="talent-starter-header">
                <div class="talent-starter-name">${t.name}</div>
                <div class="talent-starter-fee highlight-amber font-mono">${formatRupees(t.flatFee)}</div>
              </div>
              <div class="talent-starter-cat">${t.category}</div>
              <div class="talent-starter-bio">${t.bio}</div>
            </div>
          `).join('')}
        </div>

        <!-- Section 3.25: Itemized Cost Bill -->
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

    // Lead Actor
    const actorSelect = container.querySelector('#selectLeadActor');
    if (actorSelect) {
      actorSelect.addEventListener('change', (e) => {
        cinemaState.leadActorId = e.target.value;
        render(container, state, callbacks);
      });
    }

    // Lead Actress
    const actressSelect = container.querySelector('#selectLeadActress');
    if (actressSelect) {
      actressSelect.addEventListener('change', (e) => {
        cinemaState.leadActressId = e.target.value;
        render(container, state, callbacks);
      });
    }

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
