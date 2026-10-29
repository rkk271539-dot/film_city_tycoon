/**
 * Actions Tab UI Component (Version 1.05)
 * Visual Star Casting, Cinema Productions, Commercial RFPs, Floor Pipeline,
 * Personal Lifestyle & Clout Actions, and Studio Lot Upgrades.
 */

window.StudioGame = window.StudioGame || {};
window.StudioGame.UI = window.StudioGame.UI || {};

window.StudioGame.UI.ActionsScreen = (function() {
  let activeSubTab = 'cinema'; // 'cinema' | 'bids' | 'pipeline' | 'personal' | 'commission' | 'upgrades'

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

    // Check signed male and female talents
    const signedMaleTalents = (state.talent || []).filter(t => t.gender === 'male' && t.contractStatus === 'signed_player' && t.contractDaysRemaining > 0);
    const signedFemaleTalents = (state.talent || []).filter(t => t.gender === 'female' && t.contractStatus === 'signed_player' && t.contractDaysRemaining > 0);

    // Auto-select signed talent if not yet picked or if previous pick expired
    if (!cinemaState.leadActorId || !signedMaleTalents.some(t => t.id === cinemaState.leadActorId)) {
      cinemaState.leadActorId = signedMaleTalents.length > 0 ? signedMaleTalents[0].id : null;
    }
    if (!cinemaState.leadActressId || !signedFemaleTalents.some(t => t.id === cinemaState.leadActressId)) {
      cinemaState.leadActressId = signedFemaleTalents.length > 0 ? signedFemaleTalents[0].id : null;
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
              🎥 Shoots Floor (${activeProjectsCount})
            </button>
            <button class="actions-tab-btn ${activeSubTab === 'personal' ? 'active' : ''}" data-subtab="personal">
              👑 Lifestyle & Personal
            </button>
            <button class="actions-tab-btn ${activeSubTab === 'commission' ? 'active' : ''}" data-subtab="commission">
              📸 Commercials
            </button>
            <button class="actions-tab-btn ${activeSubTab === 'upgrades' ? 'active' : ''}" data-subtab="upgrades">
              🏢 Lot Upgrades (${state.studio.upgrades.length})
            </button>
          </nav>

          <!-- Main Tab Body -->
          <div class="actions-body mt-3">
            ${renderSubTabContent(state, activeSubTab, callbacks)}
          </div>
        </main>
      </div>
    `;

    attachListeners(container, state, callbacks);
  }

  function renderSubTabContent(state, tab, callbacks) {
    if (tab === 'cinema') return renderCinemaProductionTab(state, callbacks);
    if (tab === 'bids') return renderBidsTab(state);
    if (tab === 'pipeline') return renderPipelineTab(state);
    if (tab === 'personal') return renderPersonalActionsTab(state);
    if (tab === 'commission') return renderCommissionTab(state);
    if (tab === 'upgrades') return renderUpgradesTab(state);
    return '';
  }

  function renderCinemaProductionTab(state, callbacks) {
    const formatRupees = window.StudioGame.Systems.Finance.formatRupees;
    const formats = window.StudioGame.Systems.Projects.CINEMA_FORMATS;
    const genres = window.StudioGame.Systems.Projects.CINEMA_GENRES;
    const talents = state.talent || [];

    const selectedFormat = formats.find(f => f.id === cinemaState.formatId) || formats[2];
    const selectedGenre = genres.find(g => g.id === cinemaState.genreId) || genres[0];

    const leadActor = talents.find(t => t.id === cinemaState.leadActorId && t.contractStatus === 'signed_player' && t.contractDaysRemaining > 0);
    const leadActress = talents.find(t => t.id === cinemaState.leadActressId && t.contractStatus === 'signed_player' && t.contractDaysRemaining > 0);

    const actorFee = leadActor ? Math.round(leadActor.averageFee * 0.2) : 0;
    const actressFee = leadActress ? Math.round(leadActress.averageFee * 0.2) : 0;
    let totalEst = selectedFormat.baseCost + actorFee + actressFee;

    if (state.player.skill === 'brilliant_manager') {
      totalEst *= 0.75;
    }
    totalEst = Math.round(totalEst);

    const hasBothSignedStars = !!leadActor && !!leadActress;
    const canAfford = state.studio.cash >= totalEst && hasBothSignedStars;

    const actorAvatar = leadActor ? window.StudioGame.Face.generate({ gender: 'male', seed: leadActor.avatarSeed || leadActor.name }) : '';
    const actressAvatar = leadActress ? window.StudioGame.Face.generate({ gender: 'female', seed: leadActress.avatarSeed || leadActress.name }) : '';

    return `
      <div class="cinema-production-layout">
        <!-- Production Banner -->
        <div class="info-callout mb-3">
          <div class="callout-icon">👑</div>
          <div class="callout-text">
            <strong>Feature Film & Web Series Production Studio</strong><br/>
            Industry regulations require lead stars to be under an active studio contract (1 to 6 months). Signed stars cost <strong>80% less</strong> in production budget!
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
              <label class="form-label font-bold mb-0">3. Lead Star Cast Selection (Contract Required)</label>
              <div class="subtext">Stars must be on an exclusive 1-6 month studio contract to lead productions.</div>
            </div>
          </div>

          <div class="visual-casting-grid">
            <!-- Lead Actor Card -->
            ${leadActor ? `
              <div class="casting-star-card">
                <div class="casting-card-avatar">
                  <img src="${actorAvatar}" alt="${leadActor.name}" class="avatar-img-square" />
                </div>
                <div class="casting-card-info">
                  <span class="casting-role-badge">Lead Hero / Actor</span>
                  <h4 class="casting-star-name">${escapeHtml(leadActor.name)}</h4>
                  <div class="casting-star-meta">
                    <span class="badge badge-emerald">⭐ SIGNED (${leadActor.contractDaysRemaining}D Left)</span>
                    <span class="badge badge-amber font-mono">${formatRupees(actorFee)} (80% Off)</span>
                  </div>
                  <div class="casting-stats-mini mt-1">
                    <span>Acting: <strong>${leadActor.acting}</strong></span>
                    <span>Glamour: <strong>${leadActor.glamour}</strong></span>
                    <span>Fans: <strong>${window.StudioGame.Systems.Talent.formatFans(leadActor.fans)}</strong></span>
                  </div>
                </div>
                <button class="btn btn-sm btn-secondary btn-open-cast-picker" data-cast-gender="male">
                  Change Actor
                </button>
              </div>
            ` : `
              <div class="casting-star-card is-empty-casting">
                <div class="casting-empty-icon">🎭</div>
                <div class="casting-card-info">
                  <span class="casting-role-badge highlight-rose">No Signed Lead Actor</span>
                  <p class="casting-empty-note">You must sign an actor on an exclusive 1-6 month contract to headline this film.</p>
                </div>
                <button class="btn btn-sm btn-primary btn-open-cast-picker" data-cast-gender="male">
                  + Sign Lead Actor
                </button>
              </div>
            `}

            <!-- Lead Actress Card -->
            ${leadActress ? `
              <div class="casting-star-card">
                <div class="casting-card-avatar">
                  <img src="${actressAvatar}" alt="${leadActress.name}" class="avatar-img-square" />
                </div>
                <div class="casting-card-info">
                  <span class="casting-role-badge">Lead Heroine / Actress</span>
                  <h4 class="casting-star-name">${escapeHtml(leadActress.name)}</h4>
                  <div class="casting-star-meta">
                    <span class="badge badge-emerald">⭐ SIGNED (${leadActress.contractDaysRemaining}D Left)</span>
                    <span class="badge badge-amber font-mono">${formatRupees(actressFee)} (80% Off)</span>
                  </div>
                  <div class="casting-stats-mini mt-1">
                    <span>Acting: <strong>${leadActress.acting}</strong></span>
                    <span>Glamour: <strong>${leadActress.glamour}</strong></span>
                    <span>Fans: <strong>${window.StudioGame.Systems.Talent.formatFans(leadActress.fans)}</strong></span>
                  </div>
                </div>
                <button class="btn btn-sm btn-secondary btn-open-cast-picker" data-cast-gender="female">
                  Change Actress
                </button>
              </div>
            ` : `
              <div class="casting-star-card is-empty-casting">
                <div class="casting-empty-icon">👑</div>
                <div class="casting-card-info">
                  <span class="casting-role-badge highlight-rose">No Signed Lead Actress</span>
                  <p class="casting-empty-note">You must sign an actress on an exclusive 1-6 month contract to headline this film.</p>
                </div>
                <button class="btn btn-sm btn-primary btn-open-cast-picker" data-cast-gender="female">
                  + Sign Lead Actress
                </button>
              </div>
            `}
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
              <span>Lead Actor (${leadActor ? leadActor.name : 'Not Signed'}):</span>
              <span class="font-mono">${leadActor ? formatRupees(actorFee) : '₹0'}</span>
            </div>
            <div class="budget-line">
              <span>Lead Actress (${leadActress ? leadActress.name : 'Not Signed'}):</span>
              <span class="font-mono">${leadActress ? formatRupees(actressFee) : '₹0'}</span>
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
            ${!hasBothSignedStars
              ? '⚠️ Contract Required: Sign Lead Actor & Actress (1-6 Mo) to Greenlight'
              : (state.studio.cash < totalEst
                  ? `Insufficient Funds (${formatRupees(totalEst)} required)`
                  : `🎬 Greenlight & Begin Shoot (${formatRupees(totalEst)})`)
            }
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

  function renderPersonalActionsTab(state) {
    const formatRupees = window.StudioGame.Systems.Finance.formatRupees;
    const playerAssets = state.player.assets || { realEstate: [], cars: [], perks: [] };

    const realEstateOptions = [
      { id: 're_bandra', name: 'Bandra Sea-Facing Penthouse', cost: 80000000, clout: 15, icon: '🏙️', desc: 'Prestige pad overlooking the Arabian Sea. Hosts elite Page 3 parties.' },
      { id: 're_juhu', name: 'Juhu Heritage Bungalow', cost: 250000000, clout: 35, icon: '🏰', desc: 'Legendary Bollywood mansion in the golden billionaire row.' },
      { id: 're_alibaug', name: 'Alibaug Waterfront Villa', cost: 120000000, clout: 20, icon: '⛵', desc: 'Private speedboat dock and wellness estate for holiday retreats.' }
    ];

    const carOptions = [
      { id: 'car_maybach', name: 'Mercedes-Maybach S-Class', cost: 35000000, clout: 8, icon: '🚘', desc: 'Executive luxury limousine favored by top studio chairmen.' },
      { id: 'car_rolls', name: 'Rolls-Royce Ghost', cost: 75000000, clout: 18, icon: '🏎️', desc: 'Ultimate symbol of cinematic royalty. VIP red carpet arrival.' },
      { id: 'car_urus', name: 'Lamborghini Urus', cost: 45000000, clout: 10, icon: '🏎️', desc: 'Supercar power. Drives viral paparazzi hype across Bandra.' }
    ];

    return `
      <div class="personal-actions-layout">
        <!-- Personal Clout & Assets Header -->
        <div class="personal-clout-banner mb-3">
          <div class="clout-banner-left">
            <span class="clout-icon">👑</span>
            <div>
              <h3 class="clout-title">Personal Lifestyle, Clout & Romance</h3>
              <p class="clout-sub">Your personal fortune dictates industry status, high-society networking, and romantic connection.</p>
            </div>
          </div>
          <div class="clout-cash-pill">
            <span class="clout-cash-lbl">Personal Liquid Cash</span>
            <span class="clout-cash-val highlight-gold font-mono">${formatRupees(state.player.cash)}</span>
          </div>
        </div>

        <!-- Section 1: Romantic & Wife Actions -->
        <div class="card p-3 mb-3">
          <h4 class="section-title mb-2">💐 Romance & Quality Time with ${state.wife.name}</h4>
          <div class="lifestyle-actions-grid">
            <div class="lifestyle-action-card">
              <span class="act-icon">✈️</span>
              <div class="act-meta">
                <strong>European Riviera Vacation</strong>
                <span>Paris, Cannes Film Festival & Amalfi Coast. Resets burnout.</span>
                <span class="act-cost highlight-gold font-mono">₹40.0 Lakh &bull; +35 Relationship</span>
              </div>
              <button class="btn btn-sm btn-primary btn-exec-personal" data-action="vacation">Take Trip</button>
            </div>

            <div class="lifestyle-action-card">
              <span class="act-icon">💎</span>
              <div class="act-meta">
                <strong>Haute Couture Diamond Solitaire</strong>
                <span>Exclusive bespoke jewelry from Cartier / Harry Winston.</span>
                <span class="act-cost highlight-gold font-mono">₹25.0 Lakh &bull; +25 Relationship</span>
              </div>
              <button class="btn btn-sm btn-primary btn-exec-personal" data-action="jewelry">Gift Jewelry</button>
            </div>

            <div class="lifestyle-action-card">
              <span class="act-icon">🍷</span>
              <div class="act-meta">
                <strong>Candlelight Dinner at Taj Colaba</strong>
                <span>Private seaside table at Wasabi by Morimoto.</span>
                <span class="act-cost highlight-gold font-mono">₹2.5 Lakh &bull; +12 Relationship</span>
              </div>
              <button class="btn btn-sm btn-primary btn-exec-personal" data-action="dinner">Book Dinner</button>
            </div>
          </div>
        </div>

        <!-- Section 2: High Society Networking -->
        <div class="card p-3 mb-3">
          <h4 class="section-title mb-2">🥂 High-Society & Industry Clout</h4>
          <div class="lifestyle-actions-grid">
            <div class="lifestyle-action-card">
              <span class="act-icon">🍾</span>
              <div class="act-meta">
                <strong>Host Page 3 Bollywood Gala at Soho House</strong>
                <span>Attracts superstars, +4 Studio Reputation, +15 Talent Loyalty.</span>
                <span class="act-cost highlight-gold font-mono">₹25.0 Lakh</span>
              </div>
              <button class="btn btn-sm btn-outline-gold btn-exec-personal" data-action="gala">Host Gala</button>
            </div>

            <div class="lifestyle-action-card">
              <span class="act-icon">🌐</span>
              <div class="act-meta">
                <strong>OTT Streamers Power Dinner</strong>
                <span>Wine & dine Netflix/Prime Video heads. +20% OTT deals!</span>
                <span class="act-cost highlight-gold font-mono">₹10.0 Lakh</span>
              </div>
              <button class="btn btn-sm btn-outline-gold btn-exec-personal" data-action="ott_dinner">Host Dinner</button>
            </div>

            <div class="lifestyle-action-card">
              <span class="act-icon">🛡️</span>
              <div class="act-meta">
                <strong>Celebrity Crisis PR Retainer</strong>
                <span>Hush tabloid leaks & safeguard against paparazzi gossip for 60 days.</span>
                <span class="act-cost highlight-gold font-mono">₹15.0 Lakh</span>
              </div>
              <button class="btn btn-sm btn-outline-gold btn-exec-personal" data-action="pr_shield">Hire PR Shield</button>
            </div>
          </div>
        </div>

        <!-- Section 3: Luxury Real Estate -->
        <div class="card p-3 mb-3">
          <h4 class="section-title mb-2">🏰 Luxury Real Estate Portfolio</h4>
          <div class="assets-showcase-grid">
            ${realEstateOptions.map(prop => {
              const owned = (playerAssets.realEstate || []).includes(prop.id);
              return `
                <div class="asset-item-card ${owned ? 'is-owned' : ''}">
                  <span class="asset-icon">${prop.icon}</span>
                  <div class="asset-info">
                    <strong class="asset-name">${prop.name}</strong>
                    <span class="asset-desc">${prop.desc}</span>
                    <span class="asset-cost highlight-gold font-mono">${formatRupees(prop.cost)} (+${prop.clout} Clout)</span>
                  </div>
                  ${owned ? '<span class="badge badge-emerald">Owned Estate</span>' : `
                    <button class="btn btn-sm btn-primary btn-buy-asset" data-asset-type="realEstate" data-asset-id="${prop.id}" data-cost="${prop.cost}">
                      Purchase
                    </button>
                  `}
                </div>
              `;
            }).join('')}
          </div>
        </div>

        <!-- Section 4: Supercars Garage -->
        <div class="card p-3 mb-3">
          <h4 class="section-title mb-2">🏎️ Supercars & Exotic Garage</h4>
          <div class="assets-showcase-grid">
            ${carOptions.map(car => {
              const owned = (playerAssets.cars || []).includes(car.id);
              return `
                <div class="asset-item-card ${owned ? 'is-owned' : ''}">
                  <span class="asset-icon">${car.icon}</span>
                  <div class="asset-info">
                    <strong class="asset-name">${car.name}</strong>
                    <span class="asset-desc">${car.desc}</span>
                    <span class="asset-cost highlight-gold font-mono">${formatRupees(car.cost)} (+${car.clout} Swagger)</span>
                  </div>
                  ${owned ? '<span class="badge badge-emerald">In Garage</span>' : `
                    <button class="btn btn-sm btn-primary btn-buy-asset" data-asset-type="cars" data-asset-id="${car.id}" data-cost="${car.cost}">
                      Purchase
                    </button>
                  `}
                </div>
              `;
            }).join('')}
          </div>
        </div>
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
      <div class="card p-3 mb-3">
        <h3 class="section-title">Commercial Quick Project</h3>
        <p class="text-muted text-xs">Execute fast-turnaround catalog shoots or viral commercial promos for immediate cash inflow.</p>

        <div class="form-group mt-2">
          <label class="form-label">Client Brand / Campaign Name</label>
          <input type="text" id="commName" class="form-input" value="${escapeHtml(commissionState.name)}">
        </div>

        <div class="form-group mt-2">
          <label class="form-label">Format</label>
          <select id="commFormat" class="form-input">
            <option value="Commercial Photoshoot" ${commissionState.format === 'Commercial Photoshoot' ? 'selected' : ''}>Commercial Photoshoot (2 Days)</option>
            <option value="Ad Film Commercial" ${commissionState.format === 'Ad Film Commercial' ? 'selected' : ''}>Ad Film Commercial (10 Days)</option>
          </select>
        </div>

        <div class="form-group mt-2">
          <label class="form-label">Attached Talent</label>
          <select id="commTalent" class="form-input">
            ${starterTalent.map(t => `<option value="${t.id}" ${commissionState.talentId === t.id ? 'selected' : ''}>${t.name} (Fee: ${formatRupees(t.fee)})</option>`).join('')}
          </select>
        </div>

        <div class="budget-total-line mt-3">
          <span>Total Upfront Cost:</span>
          <span class="highlight-gold font-mono font-bold">${formatRupees(bill.totalCost)}</span>
        </div>

        <button class="btn btn-primary btn-full mt-3" id="btnLaunchCommission" ${state.studio.cash < bill.totalCost ? 'disabled' : ''}>
          Launch Commercial Shoot (${formatRupees(bill.totalCost)})
        </button>
      </div>
    `;
  }

  function renderUpgradesTab(state) {
    const formatRupees = window.StudioGame.Systems.Finance.formatRupees;
    const upgradesData = window.StudioGame.Data.Upgrades || [];
    const studioUpgrades = state.studio.upgrades || [];

    return `
      <div class="upgrades-list">
        ${upgradesData.map(upg => {
          const installed = studioUpgrades.includes(upg.id);
          const canAfford = state.studio.cash >= upg.cost;

          return `
            <div class="card p-3 mb-3 upgrade-item ${installed ? 'is-installed' : ''}">
              <div class="upgrade-header">
                <div>
                  <h3 class="upgrade-name font-bold">${upg.name}</h3>
                  <span class="badge ${installed ? 'badge-emerald' : 'badge-slate'} mt-1">
                    ${installed ? '✅ Operational Facility' : 'Available for Installation'}
                  </span>
                </div>
                <div class="upgrade-cost-badge">
                  <span class="font-mono font-bold ${installed ? 'highlight-emerald' : 'highlight-gold'}">${formatRupees(upg.cost)}</span>
                </div>
              </div>
              <p class="upgrade-desc text-muted text-xs mt-2">${upg.description}</p>
              ${installed ? '' : `
                <button class="btn btn-sm btn-primary btn-full mt-3 btn-buy-upgrade" data-upgrade-id="${upg.id}" ${!canAfford ? 'disabled' : ''}>
                  ${canAfford ? `Build Facility (${formatRupees(upg.cost)})` : `Insufficient Funds (${formatRupees(upg.cost)})`}
                </button>
              `}
            </div>
          `;
        }).join('')}
      </div>
    `;
  }

  function attachListeners(container, state, callbacks) {
    // Clock turns
    container.querySelector('#btnNextDay')?.addEventListener('click', () => callbacks.onAdvanceTurn?.(1));
    container.querySelector('#btnAdvanceWeek')?.addEventListener('click', () => callbacks.onAdvanceTurn?.(7));
    container.querySelector('#btnAdvanceMonth')?.addEventListener('click', () => callbacks.onAdvanceTurn?.(30));
    container.querySelector('#btnAdvanceEvent')?.addEventListener('click', () => callbacks.onAdvanceToEvent?.());

    container.querySelector('#btnOpenSaveManager')?.addEventListener('click', () => {
      window.StudioGame.UI.SaveModal.open(state, callbacks.onStateChange);
    });

    // Subtab switching
    container.querySelectorAll('.actions-tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        activeSubTab = btn.getAttribute('data-subtab');
        render(container, state, callbacks);
      });
    });

    // Format choice cards
    container.querySelectorAll('.format-choice-card').forEach(card => {
      card.addEventListener('click', () => {
        cinemaState.formatId = card.getAttribute('data-format-id');
        render(container, state, callbacks);
      });
    });

    // Title & genre inputs
    container.querySelector('#inputCinemaTitle')?.addEventListener('input', (e) => {
      cinemaState.title = e.target.value;
    });

    container.querySelector('#selectCinemaGenre')?.addEventListener('change', (e) => {
      cinemaState.genreId = e.target.value;
    });

    // Star casting modal trigger
    container.querySelectorAll('.btn-open-cast-picker').forEach(btn => {
      btn.addEventListener('click', () => {
        const gender = btn.getAttribute('data-cast-gender');
        openStarCastingModal(gender, state, (selectedId) => {
          if (gender === 'male') cinemaState.leadActorId = selectedId;
          else cinemaState.leadActressId = selectedId;
          render(container, state, callbacks);
        });
      });
    });

    // Greenlight cinema button
    container.querySelector('#btnGreenlightCinema')?.addEventListener('click', () => {
      const res = window.StudioGame.Systems.Projects.greenlightCinemaProject(state, {
        formatId: cinemaState.formatId,
        genreId: cinemaState.genreId,
        title: cinemaState.title,
        leadActorId: cinemaState.leadActorId,
        leadActressId: cinemaState.leadActressId
      });

      if (res.success) {
        window.StudioGame.State.autosave();
        callbacks.onStateChange?.();
        window.StudioGame.App.showToast(`🎬 Production Greenlit: "${res.project.name}" on the floor!`);
        activeSubTab = 'pipeline';
        render(container, state, callbacks);
      } else {
        window.StudioGame.App.showToast(`⚠️ ${res.error}`);
      }
    });

    // Bids slider & submit
    container.querySelectorAll('.rfp-bid-slider').forEach(slider => {
      slider.addEventListener('input', (e) => {
        const id = slider.getAttribute('data-rfp-id');
        const disp = container.querySelector(`#bidDisplay_${id}`);
        if (disp) {
          disp.textContent = window.StudioGame.Systems.Finance.formatRupees(parseInt(slider.value, 10));
        }
      });
    });

    container.querySelectorAll('.btn-submit-bid').forEach(btn => {
      btn.addEventListener('click', () => {
        const rfpId = btn.getAttribute('data-rfp-id');
        const slider = container.querySelector(`.rfp-bid-slider[data-rfp-id="${rfpId}"]`);
        const bidAmt = slider ? parseInt(slider.value, 10) : 500000;

        const res = window.StudioGame.Systems.Projects.submitBid(state, rfpId, bidAmt);
        if (res.success) {
          window.StudioGame.State.autosave();
          callbacks.onStateChange?.();
          window.StudioGame.App.showToast(`🏆 Won RFP Contract: ${res.project.name}! Advance payment credited.`);
          activeSubTab = 'pipeline';
          render(container, state, callbacks);
        } else {
          window.StudioGame.App.showToast(`❌ Bid Lost to ${res.winner.name} (${window.StudioGame.Systems.Finance.formatRupees(res.winner.bid)})`);
          render(container, state, callbacks);
        }
      });
    });

    // Personal Actions execution
    container.querySelectorAll('.btn-exec-personal').forEach(btn => {
      btn.addEventListener('click', () => {
        const action = btn.getAttribute('data-action');
        executePersonalAction(state, action, callbacks, container);
      });
    });

    // Buying Real Estate / Supercars
    container.querySelectorAll('.btn-buy-asset').forEach(btn => {
      btn.addEventListener('click', () => {
        const type = btn.getAttribute('data-asset-type');
        const assetId = btn.getAttribute('data-asset-id');
        const cost = parseInt(btn.getAttribute('data-cost'), 10);
        buyPlayerAsset(state, type, assetId, cost, callbacks, container);
      });
    });

    // Upgrades
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

  function executePersonalAction(state, action, callbacks, container) {
    const formatRupees = window.StudioGame.Systems.Finance.formatRupees;

    if (action === 'vacation') {
      const cost = 4000000;
      if (state.player.cash < cost) return window.StudioGame.App.showToast(`⚠️ Requires ${formatRupees(cost)} personal cash.`);
      state.player.cash -= cost;
      state.wife.relationship = Math.min(100, (state.wife.relationship || 80) + 35);
      state.wife.openness = Math.min(100, (state.wife.openness || 10) + 5);
      window.StudioGame.State.autosave();
      callbacks.onStateChange?.();
      window.StudioGame.App.showToast(`✈️ Luxuriated across the French Riviera with ${state.wife.name}! Relationship surged to ${state.wife.relationship}%.`);
      render(container, state, callbacks);
    } else if (action === 'jewelry') {
      const cost = 2500000;
      if (state.player.cash < cost) return window.StudioGame.App.showToast(`⚠️ Requires ${formatRupees(cost)} personal cash.`);
      state.player.cash -= cost;
      state.wife.relationship = Math.min(100, (state.wife.relationship || 80) + 25);
      window.StudioGame.State.autosave();
      callbacks.onStateChange?.();
      window.StudioGame.App.showToast(`💎 Gifted diamond solitaire to ${state.wife.name}! She was overjoyed.`);
      render(container, state, callbacks);
    } else if (action === 'dinner') {
      const cost = 250000;
      if (state.player.cash < cost) return window.StudioGame.App.showToast(`⚠️ Requires ${formatRupees(cost)} personal cash.`);
      state.player.cash -= cost;
      state.wife.relationship = Math.min(100, (state.wife.relationship || 80) + 12);
      window.StudioGame.State.autosave();
      callbacks.onStateChange?.();
      window.StudioGame.App.showToast(`🍷 Intimate candlelight dinner at Taj Colaba with ${state.wife.name}!`);
      render(container, state, callbacks);
    } else if (action === 'gala') {
      const cost = 2500000;
      if (state.player.cash < cost) return window.StudioGame.App.showToast(`⚠️ Requires ${formatRupees(cost)} personal cash.`);
      state.player.cash -= cost;
      state.studio.reputation = Math.min(100, state.studio.reputation + 4);
      (state.talent || []).forEach(t => {
        if (t.contractStatus === 'signed_player') t.loyalty = Math.min(100, t.loyalty + 15);
      });
      state.feed.unshift({
        id: 'evt_' + Date.now(),
        day: state.clock.day,
        date: state.clock.formattedDate,
        category: 'Page 3',
        title: '🥂 Spectacular Soho House Gala Hosted by Apex Studio',
        body: 'Bollywood megastars, studio heads and OTT executives danced into dawn at a private penthouse bash hosted by Kabir Sharma. Industry clout elevated!',
        icon: '🍾'
      });
      window.StudioGame.State.autosave();
      callbacks.onStateChange?.();
      window.StudioGame.App.showToast(`🥂 Page 3 Gala Hosted! Studio reputation & star loyalties boosted.`);
      render(container, state, callbacks);
    } else if (action === 'ott_dinner') {
      const cost = 1000000;
      if (state.player.cash < cost) return window.StudioGame.App.showToast(`⚠️ Requires ${formatRupees(cost)} personal cash.`);
      state.player.cash -= cost;
      state.studio.ottBuffRemaining = (state.studio.ottBuffRemaining || 0) + 3; // next 3 films get 20% higher streaming bids
      window.StudioGame.State.autosave();
      callbacks.onStateChange?.();
      window.StudioGame.App.showToast(`🌐 Hosted OTT heads! Unlocked +20% streaming acquisition bonus on your next 3 films.`);
      render(container, state, callbacks);
    } else if (action === 'pr_shield') {
      const cost = 1500000;
      if (state.player.cash < cost) return window.StudioGame.App.showToast(`⚠️ Requires ${formatRupees(cost)} personal cash.`);
      state.player.cash -= cost;
      state.studio.prShieldDaysRemaining = 60;
      window.StudioGame.State.autosave();
      callbacks.onStateChange?.();
      window.StudioGame.App.showToast(`🛡️ Retained top crisis PR firm! Studio is insulated against paparazzi leaks for 60 days.`);
      render(container, state, callbacks);
    }
  }

  function buyPlayerAsset(state, type, assetId, cost, callbacks, container) {
    const formatRupees = window.StudioGame.Systems.Finance.formatRupees;
    if (state.player.cash < cost) {
      return window.StudioGame.App.showToast(`⚠️ Insufficient personal funds to purchase. Requires ${formatRupees(cost)}.`);
    }

    state.player.cash -= cost;
    state.player.assets = state.player.assets || { realEstate: [], cars: [], perks: [] };
    state.player.assets[type] = state.player.assets[type] || [];
    state.player.assets[type].push(assetId);

    // Boost net worth & reputation
    state.studio.reputation = Math.min(100, state.studio.reputation + 3);

    state.feed.unshift({
      id: 'evt_' + Date.now(),
      day: state.clock.day,
      date: state.clock.formattedDate,
      category: 'Lifestyle',
      title: '👑 High-Society Acquisition',
      body: `${state.player.name} completed the acquisition of ${assetId.replace('_', ' ').toUpperCase()} for ${formatRupees(cost)}, sending waves through Mumbai high society.`,
      icon: '🏰'
    });

    window.StudioGame.State.autosave();
    callbacks.onStateChange?.();
    window.StudioGame.App.showToast(`👑 Acquired ${assetId.replace('_', ' ').toUpperCase()}! Added to personal estate.`);
    render(container, state, callbacks);
  }

  /**
   * Modal for Visual Star Casting Picker with Signed Filter & 1-6 Month Signing
   */
  function openStarCastingModal(gender, state, onSelect) {
    const existing = document.getElementById('starCastingModal');
    if (existing) existing.remove();

    const formatRupees = window.StudioGame.Systems.Finance.formatRupees;
    const formatFans = window.StudioGame.Systems.Talent.formatFans;
    const allStars = (state.talent || []).filter(t => t.gender === gender);

    let activeModalTab = 'signed'; // 'signed' | 'free_agents'
    let searchTxt = '';

    const backdrop = document.createElement('div');
    backdrop.className = 'modal-backdrop';
    backdrop.id = 'starCastingModal';

    function renderModalContent() {
      const signedStars = allStars.filter(s => s.contractStatus === 'signed_player' && s.contractDaysRemaining > 0);
      const freeAgents = allStars.filter(s => s.contractStatus !== 'signed_player');

      let currentList = activeModalTab === 'signed' ? signedStars : freeAgents;

      if (searchTxt.trim()) {
        const q = searchTxt.toLowerCase().trim();
        currentList = currentList.filter(s => s.name.toLowerCase().includes(q) || s.category.toLowerCase().includes(q));
      }

      backdrop.innerHTML = `
        <div class="modal-card modal-lg slide-up">
          <div class="modal-header">
            <div class="modal-title-wrap">
              <span class="badge badge-amber">${gender === 'female' ? 'Leading Actress' : 'Leading Actor'}</span>
              <h2 class="modal-title">Star Cast Selection</h2>
            </div>
            <button class="btn-icon-close" id="btnCloseCastingModal" aria-label="Close">&times;</button>
          </div>

          <div class="modal-body casting-modal-body">
            <!-- Modal Tabs: Signed vs Available to Sign -->
            <div class="casting-modal-tabs">
              <button class="casting-tab-btn ${activeModalTab === 'signed' ? 'active' : ''}" id="tabSignedStars">
                📜 Studio Signed Stars (${signedStars.length})
              </button>
              <button class="casting-tab-btn ${activeModalTab === 'free_agents' ? 'active' : ''}" id="tabFreeAgents">
                🌟 Sign New Talent (1 to 6 Months) (${freeAgents.length})
              </button>
            </div>

            <div class="casting-search-toolbar mt-2">
              <div class="search-input-wrap">
                <span class="search-icon">🔍</span>
                <input type="text" id="castingSearchInput" class="form-input search-input-padded" placeholder="Search by star name or category..." value="${escapeHtml(searchTxt)}">
              </div>
            </div>

            <div class="casting-star-results-list mt-3">
              ${activeModalTab === 'signed' && currentList.length === 0 ? `
                <div class="empty-results-box text-center p-4">
                  <span class="empty-icon">⚠️</span>
                  <h4>No Active Signed ${gender === 'female' ? 'Actresses' : 'Actors'}</h4>
                  <p>You have not signed any exclusive ${gender === 'female' ? 'actresses' : 'actors'} on a 1-6 month contract yet. Switch to the <strong>"Sign New Talent"</strong> tab to offer a contract!</p>
                </div>
              ` : ''}

              ${currentList.map(star => {
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
                          ${isSigned ? `⭐ SIGNED (${star.contractDaysRemaining}D Left)` : star.category}
                        </span>
                      </div>
                      <div class="casting-item-meta">
                        <span>🔥 ${formatFans(star.fans)}</span>
                        <span>Acting: <strong>${star.acting}</strong></span>
                        <span>Glamour: <strong>${star.glamour}</strong></span>
                        <span class="highlight-gold font-mono font-bold">${isSigned ? `${formatRupees(effectiveFee)} (80% Off)` : `Quote: ${formatRupees(star.averageFee)}`}</span>
                      </div>
                    </div>

                    ${isSigned ? `
                      <button class="btn btn-sm btn-emerald btn-select-star" data-star-id="${star.id}">
                        Select
                      </button>
                    ` : `
                      <button class="btn btn-sm btn-outline-gold btn-sign-contract-quick" data-star-id="${star.id}">
                        + Sign 1-6 Mo Contract
                      </button>
                    `}
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

      backdrop.querySelector('#tabSignedStars')?.addEventListener('click', () => {
        activeModalTab = 'signed';
        renderModalContent();
      });

      backdrop.querySelector('#tabFreeAgents')?.addEventListener('click', () => {
        activeModalTab = 'free_agents';
        renderModalContent();
      });

      const input = backdrop.querySelector('#castingSearchInput');
      if (input) {
        input.addEventListener('input', (e) => {
          searchTxt = e.target.value;
          renderModalContent();
          const refocused = backdrop.querySelector('#castingSearchInput');
          if (refocused) {
            refocused.focus();
            refocused.setSelectionRange(searchTxt.length, searchTxt.length);
          }
        });
      }

      // Select signed star
      backdrop.querySelectorAll('.btn-select-star').forEach(el => {
        el.addEventListener('click', (e) => {
          e.stopPropagation();
          const sId = el.getAttribute('data-star-id');
          if (sId) {
            onSelect(sId);
            backdrop.remove();
          }
        });
      });

      // Quick sign contract on 1-6 month basis
      backdrop.querySelectorAll('.btn-sign-contract-quick').forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          const starId = btn.getAttribute('data-star-id');
          const star = allStars.find(s => s.id === starId);
          if (star) {
            openQuickContractSignModal(star, state, (newSignedId) => {
              onSelect(newSignedId);
              backdrop.remove();
            });
          }
        });
      });
    }

    document.body.appendChild(backdrop);
    renderModalContent();
  }

  /**
   * Modal to flexibly sign talent for 1 to 6 months
   */
  function openQuickContractSignModal(star, state, onSigned) {
    const formatRupees = window.StudioGame.Systems.Finance.formatRupees;
    let selectedMonths = 3;
    let upfrontFee = Math.round(star.averageFee * window.StudioGame.Systems.Talent.getDurationMultiplier(3));
    let profitShare = 10;
    let intimacyClause = star.pureImage === 'wholesome' ? 'strict_wholesome' : 'standard';

    const backdrop = document.createElement('div');
    backdrop.className = 'modal-backdrop';
    backdrop.style.zIndex = '1200';

    function updateModalView() {
      const mult = window.StudioGame.Systems.Talent.getDurationMultiplier(selectedMonths);
      upfrontFee = Math.round(star.averageFee * mult);
      const avatarUrl = window.StudioGame.Face.generate({ gender: star.gender, seed: star.avatarSeed || star.name });

      backdrop.innerHTML = `
        <div class="modal-card modal-md slide-up">
          <div class="modal-header">
            <div class="modal-title-wrap">
              <span class="badge badge-gold font-mono">1 to 6 MONTH EXCLUSIVE CONTRACT</span>
              <h3 class="modal-title">Sign ${escapeHtml(star.name)}</h3>
            </div>
            <button class="btn-icon-close" id="btnCloseQuickSign">&times;</button>
          </div>

          <div class="modal-body p-3">
            <div class="quick-sign-star-header">
              <div class="casting-card-avatar">
                <img src="${avatarUrl}" alt="${star.name}" class="avatar-img-square" />
              </div>
              <div>
                <h4 class="font-bold">${escapeHtml(star.name)}</h4>
                <div class="text-muted text-xs">Standard Fee: ${formatRupees(star.averageFee)} &bull; ${star.category}</div>
                <div class="text-muted text-xs">Fans: ${window.StudioGame.Systems.Talent.formatFans(star.fans)} &bull; Rep: ${star.reputation}/100</div>
              </div>
            </div>

            <!-- Duration Selector (1 to 6 Months) -->
            <div class="form-group mt-3">
              <label class="form-label font-bold">Contract Duration (1 to 6 Months)</label>
              <div class="tenure-pills-row">
                ${[1, 2, 3, 4, 5, 6].map(m => `
                  <button class="tenure-pill ${selectedMonths === m ? 'active' : ''}" data-months="${m}">
                    ${m} Mo (${m * 30}D)
                  </button>
                `).join('')}
              </div>
            </div>

            <div class="form-group mt-2">
              <label class="form-label font-bold">Screen Intimacy Clause</label>
              <select id="quickIntimacy" class="form-input">
                <option value="strict_wholesome" ${intimacyClause === 'strict_wholesome' ? 'selected' : ''}>Strict Wholesome (No Kissing / Intimacy)</option>
                <option value="standard" ${intimacyClause === 'standard' ? 'selected' : ''}>Standard Cinematic Romance</option>
                <option value="bold_permissible" ${intimacyClause === 'bold_permissible' ? 'selected' : ''}>Bold & Sensational Permitted</option>
              </select>
            </div>

            <div class="quick-contract-calc-box my-3">
              <div class="proj-line">
                <span>Duration Multiplier:</span>
                <span class="font-mono">${mult.toFixed(2)}x</span>
              </div>
              <div class="proj-line">
                <span>Signing Bonus Upfront:</span>
                <span class="highlight-gold font-mono font-bold">${formatRupees(upfrontFee)}</span>
              </div>
              <div class="proj-line">
                <span>Backend Profit Share:</span>
                <span class="highlight-cyan font-mono">${profitShare}%</span>
              </div>
              <div class="proj-line">
                <span>Available Studio Capital:</span>
                <span class="font-mono">${formatRupees(state.studio.cash)}</span>
              </div>
            </div>

            <button class="btn btn-primary btn-full" id="btnConfirmQuickSign" ${state.studio.cash < upfrontFee ? 'disabled' : ''}>
              ${state.studio.cash >= upfrontFee
                ? `🖋️ Sign Exclusive ${selectedMonths}-Month Contract (${formatRupees(upfrontFee)})`
                : `Insufficient Funds (${formatRupees(upfrontFee)} required)`
              }
            </button>
          </div>
        </div>
      `;

      backdrop.querySelector('#btnCloseQuickSign')?.addEventListener('click', () => backdrop.remove());

      backdrop.querySelectorAll('[data-months]').forEach(p => {
        p.addEventListener('click', () => {
          selectedMonths = parseInt(p.getAttribute('data-months'), 10);
          updateModalView();
        });
      });

      backdrop.querySelector('#quickIntimacy')?.addEventListener('change', (e) => {
        intimacyClause = e.target.value;
      });

      backdrop.querySelector('#btnConfirmQuickSign')?.addEventListener('click', () => {
        const evalRes = window.StudioGame.Systems.Talent.evaluateContractOffer(state, star.id, {
          upfrontFee,
          profitShare,
          contractMonths: selectedMonths,
          intimacyClause
        });

        if (evalRes.agreed || evalRes.success) {
          const signRes = window.StudioGame.Systems.Talent.signContract(state, star.id, {
            upfrontFee,
            profitShare,
            contractMonths: selectedMonths,
            intimacyClause
          });
          if (signRes.success) {
            window.StudioGame.App.showToast(`🖋️ Successfully signed ${star.name} on ${selectedMonths}-month exclusive contract!`);
            backdrop.remove();
            onSigned(star.id);
          } else {
            window.StudioGame.App.showToast(`⚠️ ${signRes.error}`);
          }
        } else if (evalRes.counterOffer) {
          window.StudioGame.App.showToast(`⚠️ Manager countered: Requires ${formatRupees(evalRes.counterOffer.upfrontFee)} upfront.`);
        } else {
          window.StudioGame.App.showToast(`❌ ${evalRes.reason || 'Talent rejected terms.'}`);
        }
      });
    }

    document.body.appendChild(backdrop);
    updateModalView();
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
