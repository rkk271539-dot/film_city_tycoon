/**
 * Actions Tab UI Component (Version 0.3)
 * Full interface for Contract Bids (Photoshoots & Ads), Active Production Pipeline,
 * Custom Project Creator with Itemized Cost Bill, and Studio Facility Upgrades.
 */

window.StudioGame = window.StudioGame || {};
window.StudioGame.UI = window.StudioGame.UI || {};

window.StudioGame.UI.ActionsScreen = (function() {
  let activeSubTab = 'bids'; // 'bids' | 'pipeline' | 'commission' | 'upgrades'

  // Temporary state for the Custom Project Creator
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

    const formatRupees = window.StudioGame.Systems.Finance.formatRupees;
    const capacity = projectSystem.getStudioCapacity(state);
    const activeProjectsCount = state.studio.projects.length;

    container.innerHTML = `
      <div class="actions-page-container">
        <!-- Top Operations Bar -->
        <header class="actions-header">
          <div class="actions-header-title-wrap">
            <span class="badge badge-emerald">Studio Operations</span>
            <h1 class="actions-title">Commercial Pipeline & Bidding</h1>
          </div>
          <div class="actions-header-stats">
            <div class="header-stat-pill">
              <span class="stat-pill-label">Capacity</span>
              <span class="stat-pill-val ${activeProjectsCount >= capacity ? 'text-rose' : 'highlight-cyan'}">
                ${activeProjectsCount} / ${capacity} Shoots
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
          <button class="actions-tab-btn ${activeSubTab === 'bids' ? 'active' : ''}" data-subtab="bids">
            📋 Contract Bids (${state.bids.length})
          </button>
          <button class="actions-tab-btn ${activeSubTab === 'pipeline' ? 'active' : ''}" data-subtab="pipeline">
            🎬 Active Pipeline (${activeProjectsCount})
          </button>
          <button class="actions-tab-btn ${activeSubTab === 'commission' ? 'active' : ''}" data-subtab="commission">
            ➕ New Project
          </button>
          <button class="actions-tab-btn ${activeSubTab === 'upgrades' ? 'active' : ''}" data-subtab="upgrades">
            🏢 Upgrades (${state.studio.upgrades.length})
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

    if (tab === 'bids') {
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
        <div class="info-callout mb-3">
          <div class="callout-icon">💼</div>
          <div class="callout-text">
            <strong>Competitive Bidding Engine</strong><br/>
            Clients weigh your bid price against studio quality and reputation. Bidding lower increases win odds, but leaves less margin for production. Competing studios submit rival bids simultaneously.
          </div>
        </div>

        <div class="rfp-cards-list">
          ${bids.map(rfp => {
            const defaultBid = Math.round(rfp.clientMaxBudget * 0.90);
            return `
              <div class="rfp-card" id="rfp_${rfp.id}">
                <div class="rfp-card-header">
                  <div class="rfp-identity">
                    <span class="rfp-genre-icon">${rfp.genreIcon}</span>
                    <div class="rfp-title-wrap">
                      <div class="rfp-client-name">${rfp.clientName}</div>
                      <span class="badge badge-indigo text-xs">${rfp.format} &bull; ${rfp.genreName}</span>
                    </div>
                  </div>
                  <div class="rfp-budget-badge">
                    <span class="subtext">Client Ceiling</span>
                    <span class="rfp-budget-val highlight-emerald">${formatRupees(rfp.clientMaxBudget)}</span>
                  </div>
                </div>

                <p class="rfp-desc">${rfp.description}</p>

                <!-- Rivals Info -->
                <div class="rfp-rivals-box">
                  <span class="rivals-label">Competing Bidders:</span>
                  <div class="rivals-chips">
                    ${rfp.rivals.map(r => `
                      <span class="rival-chip">🏢 ${r.name}</span>
                    `).join('')}
                  </div>
                </div>

                <!-- Bidding Interaction Box -->
                <div class="rfp-bid-control">
                  <div class="bid-slider-row">
                    <label for="slider_${rfp.id}">Your Bid Offer:</label>
                    <span class="bid-amount-display highlight-amber" id="bidLabel_${rfp.id}">
                      ${formatRupees(defaultBid)}
                    </span>
                  </div>
                  <input type="range" class="form-range bid-slider" id="slider_${rfp.id}"
                    data-rfp-id="${rfp.id}"
                    min="${Math.round(rfp.clientMaxBudget * 0.65)}"
                    max="${Math.round(rfp.clientMaxBudget * 1.10)}"
                    step="25000"
                    value="${defaultBid}" />
                  <div class="slider-extremes">
                    <span>Aggressive (${formatRupees(Math.round(rfp.clientMaxBudget * 0.65))})</span>
                    <span>Max (${formatRupees(Math.round(rfp.clientMaxBudget * 1.10))})</span>
                  </div>
                </div>

                <div class="rfp-footer">
                  <div class="rfp-duration">
                    <span>⏱️ Duration: <strong>${rfp.durationDays} Days</strong></span>
                  </div>
                  <button class="btn btn-sm btn-primary btn-submit-bid" data-rfp-id="${rfp.id}">
                    🔨 Submit Studio Bid
                  </button>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      `;
    }

    if (tab === 'pipeline') {
      const active = state.studio.projects || [];
      const completed = state.studio.completedProjects || [];

      return `
        <div class="section-label">Active Studio Shoots (${active.length})</div>

        ${active.length === 0 ? `
          <div class="empty-state-card text-center p-4">
            <div class="empty-icon">🎬</div>
            <div class="empty-title">All Sound Stages Idle</div>
            <div class="empty-sub text-muted">Win client contracts in the Bids tab or greenlight a custom project!</div>
          </div>
        ` : `
          <div class="pipeline-list">
            ${active.map(proj => {
              const progressPct = Math.min(100, Math.round((proj.daysElapsed / proj.totalDays) * 100));
              const daysLeft = Math.max(0, proj.totalDays - proj.daysElapsed);

              return `
                <div class="pipeline-card">
                  <div class="pipeline-header">
                    <div class="pipeline-title-group">
                      <span class="pipeline-icon">${proj.genreIcon || '🎬'}</span>
                      <div>
                        <div class="pipeline-name">${proj.name}</div>
                        <div class="pipeline-sub">${proj.clientName} &bull; ${proj.format}</div>
                      </div>
                    </div>
                    <div class="pipeline-payout highlight-emerald">${formatRupees(proj.agreedPayout)}</div>
                  </div>

                  <div class="pipeline-stage-row">
                    <span class="stage-tag"><span class="pulse-indicator"></span> ${proj.stage}</span>
                    <span class="days-remaining text-dim">${daysLeft} Days to Delivery</span>
                  </div>

                  <div class="pipeline-progress-bar">
                    <div class="pipeline-progress-fill" style="width: ${progressPct}%"></div>
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        `}

        <!-- Completed Shoots History -->
        ${completed.length > 0 ? `
          <div class="section-label mt-4">Delivered Shoots Archive (${completed.length})</div>
          <div class="completed-list">
            ${completed.slice(0, 5).map(cp => `
              <div class="completed-item">
                <div class="completed-info">
                  <div class="completed-name">${cp.name}</div>
                  <div class="completed-date">${cp.deliveredDate || 'Delivered'} &bull; ${cp.format}</div>
                </div>
                <div class="completed-payout highlight-emerald">
                  +${formatRupees(cp.agreedPayout)}
                </div>
              </div>
            `).join('')}
          </div>
        ` : ''}
      `;
    }

    if (tab === 'commission') {
      const contractsData = window.StudioGame.Data.Contracts;
      const genres = contractsData.genres;
      const starterTalent = contractsData.starterTalent;
      const selectedTalent = starterTalent.find(t => t.id === commissionState.talentId) || starterTalent[0];

      // Calculate cost bill
      const bill = projectSystem.calculateCostBill(state, {
        format: commissionState.format,
        talent: selectedTalent
      });

      return `
        <div class="commission-container">
          <div class="section-label">Commission Studio Commercial Shoot</div>
          <p class="subtext mb-3">
            Produce an in-house commercial project, pick lead talent, and syndicate the finished package to luxury clients.
          </p>

          <!-- Format & Genre Selection -->
          <div class="card p-3 mb-3">
            <div class="form-group">
              <label>Project Format</label>
              <div class="format-toggle-group">
                <button type="button" class="btn-toggle ${commissionState.format === 'Commercial Photoshoot' ? 'active' : ''}" data-format="Commercial Photoshoot">
                  📸 Photoshoot (2 Days)
                </button>
                <button type="button" class="btn-toggle ${commissionState.format === 'Short Ad Film' ? 'active' : ''}" data-format="Short Ad Film">
                  🎥 Short Ad Film (8 Days)
                </button>
              </div>
            </div>

            <div class="form-group mt-3">
              <label for="inputProjectName">Project Title</label>
              <input type="text" id="inputProjectName" class="form-input" value="${commissionState.name}" />
            </div>

            <div class="form-group mt-3">
              <label>Select Genre</label>
              <select id="selectGenre" class="form-input">
                ${genres.map(g => `
                  <option value="${g.id}" ${commissionState.genreId === g.id ? 'selected' : ''}>
                    ${g.icon} ${g.name}
                  </option>
                `).join('')}
              </select>
            </div>
          </div>

          <!-- Starter Talent Selection -->
          <div class="section-label mt-3">Select Lead Commercial Talent</div>
          <div class="talent-choice-list mb-3">
            ${starterTalent.map(t => `
              <div class="talent-starter-card ${commissionState.talentId === t.id ? 'selected' : ''}" data-talent-id="${t.id}">
                <div class="talent-starter-header">
                  <div class="talent-starter-name">${t.name}</div>
                  <div class="talent-starter-fee highlight-amber">${formatRupees(t.flatFee)}</div>
                </div>
                <div class="talent-starter-cat">${t.category}</div>
                <div class="talent-starter-bio">${t.bio}</div>
                <div class="talent-starter-stats">
                  <span>Glamour: <strong>${t.glamour}%</strong></span>
                  <span>Acting: <strong>${t.acting}%</strong></span>
                </div>
              </div>
            `).join('')}
          </div>

          <!-- Section 3.25: Itemized Project Cost Bill -->
          <div class="card cost-bill-card">
            <div class="card-header">
              <div class="card-title-group">
                <span class="badge badge-emerald">Mandatory Cost Audit</span>
                <h3 class="card-title">Itemized Project Cost Bill</h3>
              </div>
              <span class="badge badge-slate">${bill.format}</span>
            </div>

            <div class="bill-line-items">
              ${bill.lineItems.map(item => `
                <div class="bill-line-row">
                  <span class="bill-item-label">${item.label} <span class="bill-item-note">(${item.note})</span></span>
                  <span class="bill-item-val">${formatRupees(item.amount)}</span>
                </div>
              `).join('')}

              ${bill.managerDiscount > 0 ? `
                <div class="bill-line-row discount-row">
                  <span class="bill-item-label">✍️ Brilliant Manager Discount (-25%)</span>
                  <span class="bill-item-val highlight-emerald">-${formatRupees(bill.managerDiscount)}</span>
                </div>
              ` : ''}

              <div class="bill-divider"></div>

              <div class="bill-total-row">
                <span class="total-label">Total Greenlight Cost:</span>
                <span class="total-val highlight-amber">${formatRupees(bill.totalCost)}</span>
              </div>

              <div class="bill-projection-row">
                <span class="proj-label">Projected Delivery Return:</span>
                <span class="proj-val highlight-emerald">${formatRupees(bill.projectedRevenue)}</span>
              </div>

              <div class="bill-cash-impact-row">
                <span class="cash-impact-label">Studio Cash After Payment:</span>
                <span class="cash-impact-val ${bill.cashRemainingAfter < 0 ? 'text-rose' : 'text-muted'}">
                  ${formatRupees(bill.cashRemainingAfter)}
                </span>
              </div>
            </div>

            <div class="bill-actions mt-3">
              ${bill.canAfford ? `
                <button type="button" class="btn btn-primary btn-full" id="btnSignCostBill">
                  ✍️ Sign Bill & Launch Shoot (${formatRupees(bill.totalCost)})
                </button>
              ` : `
                <button type="button" class="btn btn-secondary btn-full" disabled>
                  ⚠️ Insufficient Studio Cash to Finalize Bill
                </button>
              `}
            </div>
          </div>
        </div>
      `;
    }

    if (tab === 'upgrades') {
      const catalog = window.StudioGame.Data.Upgrades || [];
      const installed = state.studio.upgrades || [];

      return `
        <div class="section-label">Studio Sound Stage & Facility Upgrades</div>
        <p class="subtext mb-3">
          Expanding your studio facilities permanently boosts Studio Net Worth valuation and operational quality, but adds daily electricity and maintenance bills.
        </p>

        <div class="upgrades-catalog-list">
          ${catalog.map(upg => {
            const isInstalled = installed.includes(upg.id);
            const canAfford = state.studio.cash >= upg.cost;

            return `
              <div class="upgrade-card ${isInstalled ? 'is-installed' : ''}">
                <div class="upgrade-header">
                  <div class="upgrade-identity">
                    <span class="upgrade-icon">${upg.icon}</span>
                    <div>
                      <div class="upgrade-name">${upg.name}</div>
                      <span class="badge badge-indigo text-xs">${upg.category}</span>
                    </div>
                  </div>
                  <div class="upgrade-cost highlight-amber">
                    ${isInstalled ? '<span class="badge badge-emerald">Installed</span>' : formatRupees(upg.cost)}
                  </div>
                </div>

                <div class="upgrade-desc">${upg.description}</div>

                <div class="upgrade-meta-grid">
                  <div class="meta-item">
                    <span class="meta-label">Valuation Boost:</span>
                    <span class="meta-val highlight-emerald">+${formatRupees(upg.assetValuationBoost)}</span>
                  </div>
                  <div class="meta-item">
                    <span class="meta-label">Daily Running Cost:</span>
                    <span class="meta-val text-rose">+${formatRupees(upg.dailyOverhead)}/day</span>
                  </div>
                </div>

                <div class="upgrade-perk-line">
                  <span>✨ <strong>${upg.perkText}</strong></span>
                </div>

                <div class="upgrade-actions">
                  ${isInstalled ? `
                    <button class="btn btn-sm btn-ghost btn-full" disabled>✓ Operational on Studio Lot</button>
                  ` : `
                    <button class="btn btn-sm ${canAfford ? 'btn-primary' : 'btn-secondary'} btn-full btn-buy-upgrade"
                      data-upgrade-id="${upg.id}" ${!canAfford ? 'disabled' : ''}>
                      ${canAfford ? `Commission Facility (${formatRupees(upg.cost)})` : `Requires ${formatRupees(upg.cost)}`}
                    </button>
                  `}
                </div>
              </div>
            `;
          }).join('')}
        </div>
      `;
    }

    return '';
  }

  function attachListeners(container, state, callbacks) {
    const projectSystem = window.StudioGame.Systems.Projects;

    // Sub-nav tab switching
    container.querySelectorAll('.actions-tab-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        activeSubTab = e.currentTarget.getAttribute('data-subtab');
        render(container, state, callbacks);
      });
    });

    // Bid Sliders in Bids Tab
    container.querySelectorAll('.bid-slider').forEach(slider => {
      slider.addEventListener('input', (e) => {
        const rfpId = e.currentTarget.getAttribute('data-rfp-id');
        const val = parseInt(e.currentTarget.value, 10);
        const label = document.getElementById(`bidLabel_${rfpId}`);
        if (label) {
          label.textContent = window.StudioGame.Systems.Finance.formatRupees(val);
        }
      });
    });

    // Submit Bid Buttons
    container.querySelectorAll('.btn-submit-bid').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const rfpId = e.currentTarget.getAttribute('data-rfp-id');
        const slider = document.getElementById(`slider_${rfpId}`);
        const bidAmount = slider ? parseInt(slider.value, 10) : 500000;

        const res = projectSystem.submitBid(state, rfpId, bidAmount);
        window.StudioGame.State.autosave();

        if (res.won) {
          alert(`🏆 ${res.message}\nContract finalized and moved into active production!`);
          activeSubTab = 'pipeline';
          render(container, state, callbacks);
        } else {
          alert(`❌ ${res.message}\nTry adjusting your pricing or upgrading studio equipment for the next tender.`);
          render(container, state, callbacks);
        }
      });
    });

    // Commission: Format Toggles
    container.querySelectorAll('.format-toggle-group .btn-toggle').forEach(btn => {
      btn.addEventListener('click', (e) => {
        commissionState.format = e.currentTarget.getAttribute('data-format');
        render(container, state, callbacks);
      });
    });

    // Commission: Title Input
    const nameInput = document.getElementById('inputProjectName');
    if (nameInput) {
      nameInput.addEventListener('input', (e) => {
        commissionState.name = e.target.value;
      });
    }

    // Commission: Genre Select
    const genreSelect = document.getElementById('selectGenre');
    if (genreSelect) {
      genreSelect.addEventListener('change', (e) => {
        commissionState.genreId = e.target.value;
        const g = window.StudioGame.Data.Contracts.genres.find(item => item.id === e.target.value);
        if (g) commissionState.genreName = g.name;
        render(container, state, callbacks);
      });
    }

    // Commission: Talent Pickers
    container.querySelectorAll('.talent-starter-card').forEach(card => {
      card.addEventListener('click', (e) => {
        commissionState.talentId = e.currentTarget.getAttribute('data-talent-id');
        render(container, state, callbacks);
      });
    });

    // Commission: Sign Cost Bill
    const signBtn = document.getElementById('btnSignCostBill');
    if (signBtn) {
      signBtn.addEventListener('click', () => {
        const selectedTalent = window.StudioGame.Data.Contracts.starterTalent.find(t => t.id === commissionState.talentId);
        const selectedGenre = window.StudioGame.Data.Contracts.genres.find(g => g.id === commissionState.genreId) || window.StudioGame.Data.Contracts.genres[0];

        const res = projectSystem.launchCustomProject(state, {
          format: commissionState.format,
          name: commissionState.name || 'Haute Couture Showcase',
          genreName: selectedGenre.name,
          genreIcon: selectedGenre.icon,
          talent: selectedTalent
        });

        if (res.success) {
          window.StudioGame.State.autosave();
          alert(`🎬 "${res.project.name}" signed and set up on sound stage!`);
          activeSubTab = 'pipeline';
          render(container, state, callbacks);
        } else {
          alert(res.error);
        }
      });
    }

    // Upgrades: Purchase Button
    container.querySelectorAll('.btn-buy-upgrade').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const upgId = e.currentTarget.getAttribute('data-upgrade-id');
        const res = projectSystem.purchaseUpgrade(state, upgId);
        if (res.success) {
          window.StudioGame.State.autosave();
          alert(res.message);
          render(container, state, callbacks);
        } else {
          alert(res.error);
        }
      });
    });
  }

  return {
    render
  };
})();
