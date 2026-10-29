/**
 * Bank & Corporate Treasury UI Screen
 * Imperial Reserve Bank of India & Media Finance Corporation
 * Loans, EMI schedules, Fixed Deposits (FD), and Corporate Credit Rating.
 */

window.StudioGame = window.StudioGame || {};
window.StudioGame.UI = window.StudioGame.UI || {};

window.StudioGame.UI.BankScreen = (function() {
  let activeSubTab = 'hub'; // 'hub' | 'loans' | 'active' | 'fd' // 'loans', 'active', 'fd'
  let selectedLoanType = 'term'; // 'term' | 'mezzanine'
  let loanAmount = 50000000; // 5 Cr default
  let loanTenure = 12; // 12 months

  let fdAmount = 20000000; // 2 Cr default
  let fdTenure = 6; // 6 months

  function render(container, state, callbacks = {}) {
    if (!container || !state) return;
    window.StudioGame.Systems.Bank.ensureBankState(state);
    window.StudioGame.Systems.Bank.updateCreditRating(state);

    const formatRupees = window.StudioGame.Systems.Finance.formatRupees;
    const bank = state.bank;
    const activeLoans = bank.activeLoans || [];
    const fixedDeposits = bank.fixedDeposits || [];

    const totalDebt = activeLoans.reduce((sum, l) => sum + l.remainingPrincipal, 0);
    const totalMonthlyEMI = activeLoans.reduce((sum, l) => sum + l.monthlyEMI, 0);
    const totalFDInvested = fixedDeposits.reduce((sum, f) => sum + f.principal, 0);

    const maxBorrowTerm = window.StudioGame.Systems.Bank.getMaxBorrowLimit(state, 'term');
    const maxBorrowMezz = window.StudioGame.Systems.Bank.getMaxBorrowLimit(state, 'mezzanine');
    const curMaxBorrow = selectedLoanType === 'term' ? maxBorrowTerm : maxBorrowMezz;

    if (loanAmount > curMaxBorrow) loanAmount = Math.max(1000000, curMaxBorrow);

    const annualRate = window.StudioGame.Systems.Bank.getInterestRate(state, selectedLoanType);
    const monthlyRate = (annualRate / 100) / 12;
    const estEMI = Math.round(
      (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, loanTenure)) /
      (Math.pow(1 + monthlyRate, loanTenure) - 1)
    );
    const estTotalInterest = (estEMI * loanTenure) - loanAmount;

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
              <div class="top-studio-tag">${state.studio.name} &bull; Imperial Reserve Bank</div>
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
              <button class="btn-fast-forward btn-event-advance" id="btnAdvanceEvent" title="Fast forward until something happens">
                ⚡ Event
              </button>
            </div>
          </div>
        </section>

        <!-- Main Content Area -->
        <main class="dashboard-content">
          <!-- Credit Rating & Bank Ribbon -->
          <div class="bank-hero-ribbon">
            <div class="bank-stat-card">
              <span class="b-label">Corporate Credit Rating</span>
              <span class="b-val highlight-gold font-mono">${bank.creditRating || 'AA'}</span>
              <span class="b-sub">Score: <strong>${bank.creditScore || 80}/100</strong></span>
            </div>

            <div class="bank-stat-card">
              <span class="b-label">Total Outstanding Debt</span>
              <span class="b-val ${totalDebt > 0 ? 'highlight-rose' : 'highlight-emerald'} font-mono">${formatRupees(totalDebt)}</span>
              <span class="b-sub">${activeLoans.length} Active Credit Lines</span>
            </div>

            <div class="bank-stat-card">
              <span class="b-label">Monthly EMI Commitment</span>
              <span class="b-val font-mono">${formatRupees(totalMonthlyEMI)} / mo</span>
              <span class="b-sub">Auto-deducted on due date</span>
            </div>

            <div class="bank-stat-card">
              <span class="b-label">Treasury Fixed Deposits</span>
              <span class="b-val highlight-emerald font-mono">${formatRupees(totalFDInvested)}</span>
              <span class="b-sub">Earns 7.5% Annual APY</span>
            </div>
          </div>

          ${activeSubTab === 'hub' ? `
            <!-- Exclusive Treasury Cards Hub (No down-scroll) -->
            <section class="bank-card-hub mb-3">
              <div class="actions-hub-header text-center mb-4">
                <h2 class="text-xl font-bold">🏛️ Imperial Reserve Bank & Treasury</h2>
                <p class="text-xs text-muted max-w-md mx-auto">Select a credit facility below to apply for collateralized studio loans, mezzanine emergency bridge finance, review active debt, or park cash in fixed deposits.</p>
              </div>

              <div class="actions-hub-grid">
                <div class="action-hub-card" data-bank-action="term">
                  <div class="action-hub-icon-wrap cinema-glow">💰</div>
                  <div class="action-hub-content">
                    <div class="action-hub-title">Commercial Term Loan</div>
                    <div class="action-hub-subtitle">Low 9.0% p.a. &bull; Up to 45% Net Worth</div>
                    <div class="action-hub-badge">Low Interest</div>
                  </div>
                </div>

                <div class="action-hub-card" data-bank-action="mezzanine">
                  <div class="action-hub-icon-wrap personal-glow">⚡</div>
                  <div class="action-hub-content">
                    <div class="action-hub-title">Mezzanine Bridge Credit</div>
                    <div class="action-hub-subtitle">Fast emergency credit up to ₹5 Cr</div>
                    <div class="action-hub-badge badge-gold">Instant Approval</div>
                  </div>
                </div>

                <div class="action-hub-card" data-bank-action="active">
                  <div class="action-hub-icon-wrap pipeline-glow">📋</div>
                  <div class="action-hub-content">
                    <div class="action-hub-title">Active Loans & Repayment</div>
                    <div class="action-hub-subtitle">Monthly EMIs & 1-click payoff in full</div>
                    <div class="action-hub-badge ${activeLoans.length > 0 ? 'badge-live' : ''}">${activeLoans.length} Active Loans</div>
                  </div>
                </div>

                <div class="action-hub-card" data-bank-action="fd">
                  <div class="action-hub-icon-wrap upgrades-glow">🏦</div>
                  <div class="action-hub-content">
                    <div class="action-hub-title">High-Yield Fixed Deposits</div>
                    <div class="action-hub-subtitle">7.5% Annual APY &bull; Daily compounding</div>
                    <div class="action-hub-badge badge-gold">${fixedDeposits.length} Active FDs</div>
                  </div>
                </div>
              </div>
            </section>
          ` : `
            <!-- Focused Banking Sub-Screen View with Back Navigation -->
            <div class="subscreen-back-bar mb-3 flex items-center justify-between">
              <button class="btn btn-sm btn-outline-gold font-bold" id="btnBackToBankHub">
                &larr; Back to Treasury Hub
              </button>
              <span class="badge badge-gold font-mono text-xs uppercase">${getBankSubTabTitle(activeSubTab, selectedLoanType)}</span>
            </div>

            <!-- Sub-Tab Views -->
            ${activeSubTab === 'loans' ? renderLoanApplication(state, curMaxBorrow, annualRate, estEMI, estTotalInterest) : ''}
            ${activeSubTab === 'active' ? renderActiveLoans(activeLoans, state) : ''}
            ${activeSubTab === 'fd' ? renderFixedDepositSection(fixedDeposits, state) : ''}
          `}
        </main>
      </div>
    `;

    attachEventListeners(container, state, callbacks);
  }

    function getBankSubTabTitle(tab, loanType) {
    if (tab === 'loans') {
      return loanType === 'term' ? '💰 Commercial Term Loan' : '⚡ Mezzanine Bridge Credit';
    }
    if (tab === 'active') return '📋 Active Debt & Amortization';
    if (tab === 'fd') return '🏦 High-Yield Fixed Deposits';
    return 'Reserve Bank Treasury';
  }

  function renderLoanApplication(state, maxBorrow, annualRate, estEMI, estTotalInterest) {
    const formatRupees = window.StudioGame.Systems.Finance.formatRupees;
    const canBorrow = maxBorrow >= 1000000;

    return `
      <div class="bank-application-card">
        <div class="bank-card-header">
          <span class="badge badge-gold font-mono">RESERVE BANK CREDIT FACILITY</span>
          <h2 class="bank-card-title">Commercial Credit Application</h2>
          <p class="bank-card-desc">
            Leverage your studio balance sheet to secure low-interest capital for mega productions, talent contracts, or real estate acquisitions.
          </p>
        </div>

        <!-- Loan Product Toggle -->
        <div class="loan-type-selector-grid">
          <div class="loan-type-box ${selectedLoanType === 'term' ? 'active' : ''}" data-loan-type="term">
            <span class="type-icon">🏢</span>
            <div class="type-meta">
              <h4 class="type-name">Studio Term Loan</h4>
              <span class="type-desc">Collateralized against studio assets. Up to 45% of net worth.</span>
              <span class="type-rate highlight-emerald font-mono font-bold">${window.StudioGame.Systems.Bank.getInterestRate(state, 'term').toFixed(1)}% p.a.</span>
            </div>
          </div>

          <div class="loan-type-box ${selectedLoanType === 'mezzanine' ? 'active' : ''}" data-loan-type="mezzanine">
            <span class="type-icon">🎬</span>
            <div class="type-meta">
              <h4 class="type-name">Production Mezzanine Bridge</h4>
              <span class="type-desc">Fast-approval working capital loan for feature cinema shoots.</span>
              <span class="type-rate highlight-amber font-mono font-bold">${window.StudioGame.Systems.Bank.getInterestRate(state, 'mezzanine').toFixed(1)}% p.a.</span>
            </div>
          </div>
        </div>

        ${canBorrow ? `
          <div class="loan-calculator-box mt-3">
            <div class="form-group">
              <div class="slider-header-row">
                <label class="form-label font-bold">Principal Loan Amount</label>
                <span class="slider-display-val highlight-gold font-mono font-bold" id="loanAmountDisplay">${formatRupees(loanAmount)}</span>
              </div>
              <input type="range" class="form-range" id="loanAmountSlider"
                min="1000000"
                max="${maxBorrow}"
                step="1000000"
                value="${loanAmount}">
              <div class="slider-extremes">
                <span>₹10.0 Lakh</span>
                <span>Max Capacity: ${formatRupees(maxBorrow)}</span>
              </div>
            </div>

            <div class="form-group mt-3">
              <label class="form-label font-bold">Repayment Tenure</label>
              <div class="tenure-pills-row">
                ${[6, 12, 18, 24].map(m => `
                  <button class="tenure-pill ${loanTenure === m ? 'active' : ''}" data-tenure="${m}">${m} Months</button>
                `).join('')}
              </div>
            </div>

            <!-- Financial Projection Box -->
            <div class="loan-projections-summary my-3">
              <div class="proj-line">
                <span>Annual Interest Rate:</span>
                <span class="font-mono font-bold highlight-cyan">${annualRate.toFixed(2)}% p.a.</span>
              </div>
              <div class="proj-line">
                <span>Estimated Monthly EMI:</span>
                <span class="font-mono font-bold highlight-emerald">${formatRupees(estEMI)} / month</span>
              </div>
              <div class="proj-line">
                <span>Total Lifetime Interest:</span>
                <span class="font-mono text-muted">${formatRupees(estTotalInterest)}</span>
              </div>
              <div class="proj-line">
                <span>Disbursed to Working Capital:</span>
                <span class="font-mono font-bold highlight-gold">${formatRupees(loanAmount)}</span>
              </div>
            </div>

            <button class="btn btn-primary btn-full" id="btnDisburseLoan">
              🏛️ Execute Loan Agreement & Disburse Capital
            </button>
          </div>
        ` : `
          <div class="bank-locked-box text-center p-4">
            <span class="empty-icon">🔒</span>
            <h4>Borrowing Limit Exhausted</h4>
            <p>Your studio has utilized its maximum collateralized debt limit. Settle existing loans or expand studio net worth to unlock fresh credit.</p>
          </div>
        `}
      </div>
    `;
  }

  function renderActiveLoans(activeLoans, state) {
    const formatRupees = window.StudioGame.Systems.Finance.formatRupees;

    if (activeLoans.length === 0) {
      return `
        <div class="empty-results-box text-center">
          <span class="empty-icon">✅</span>
          <h4>Debt Free Studio</h4>
          <p>Your studio has zero active bank liabilities or debt obligations. Balance sheet is in pristine condition!</p>
        </div>
      `;
    }

    return `
      <div class="active-loans-list">
        <div class="table-responsive">
          <table class="leaderboard-table">
            <thead>
              <tr>
                <th>Credit Facility</th>
                <th>Original Principal</th>
                <th>Remaining Debt</th>
                <th>Interest Rate</th>
                <th>Monthly EMI</th>
                <th>Next EMI Due</th>
                <th>Remaining</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              ${activeLoans.map(loan => `
                <tr>
                  <td>
                    <strong>${loan.type}</strong>
                  </td>
                  <td class="font-mono">${formatRupees(loan.principal)}</td>
                  <td class="font-mono font-bold highlight-rose">${formatRupees(loan.remainingPrincipal)}</td>
                  <td class="font-mono">${loan.annualInterestRate}%</td>
                  <td class="font-mono font-bold">${formatRupees(loan.monthlyEMI)}</td>
                  <td class="font-mono highlight-amber">${loan.daysToNextEMI} Days</td>
                  <td>${loan.remainingMonths} Months</td>
                  <td>
                    <button class="btn btn-xs btn-outline-gold btn-repay-loan" data-loan-id="${loan.id}">
                      Payoff In Full
                    </button>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;
  }

  function renderFixedDepositSection(fixedDeposits, state) {
    const formatRupees = window.StudioGame.Systems.Finance.formatRupees;

    return `
      <div class="bank-application-card mb-3">
        <div class="bank-card-header">
          <span class="badge badge-emerald font-mono">TREASURY YIELD</span>
          <h2 class="bank-card-title">Open Fixed Deposit (7.5% APY)</h2>
          <p class="bank-card-desc">
            Park excess cash in guaranteed government-backed Fixed Deposits to generate risk-free passive monthly interest for your studio.
          </p>
        </div>

        <div class="fd-create-form mt-2">
          <div class="form-group">
            <div class="slider-header-row">
              <label class="form-label font-bold">Deposit Principal</label>
              <span class="slider-display-val highlight-emerald font-mono font-bold" id="fdAmountDisplay">${formatRupees(fdAmount)}</span>
            </div>
            <input type="range" class="form-range" id="fdAmountSlider"
              min="1000000"
              max="${Math.max(10000000, state.studio.cash)}"
              step="1000000"
              value="${Math.min(fdAmount, state.studio.cash)}">
            <div class="slider-extremes">
              <span>₹10.0 Lakh</span>
              <span>Available Cash: ${formatRupees(state.studio.cash)}</span>
            </div>
          </div>

          <div class="form-group mt-3">
            <label class="form-label font-bold">Lock-in Period</label>
            <div class="tenure-pills-row">
              ${[3, 6, 12].map(m => `
                <button class="tenure-pill ${fdTenure === m ? 'active' : ''}" data-fd-tenure="${m}">${m} Months</button>
              `).join('')}
            </div>
          </div>

          <button class="btn btn-emerald btn-full mt-3" id="btnCreateFD" ${state.studio.cash < 1000000 ? 'disabled' : ''}>
            🏦 Lock Deposit & Start Earning 7.5% Yield
          </button>
        </div>
      </div>

      <!-- Existing FDs -->
      <h3 class="section-title mt-4 mb-2">Active Treasury Deposits (${fixedDeposits.length})</h3>
      ${fixedDeposits.length > 0 ? `
        <div class="table-responsive">
          <table class="leaderboard-table">
            <thead>
              <tr>
                <th>Deposit Certificate</th>
                <th>Principal Locked</th>
                <th>APY Yield</th>
                <th>Accrued Interest</th>
                <th>Days to Maturity</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              ${fixedDeposits.map(fd => `
                <tr>
                  <td><strong>Reserve Bank FD</strong></td>
                  <td class="font-mono font-bold">${formatRupees(fd.principal)}</td>
                  <td class="font-mono highlight-emerald">${fd.annualRate}% p.a.</td>
                  <td class="font-mono font-bold highlight-gold">+${formatRupees(fd.accruedInterest)}</td>
                  <td class="font-mono">${fd.remainingDays} Days</td>
                  <td>
                    <button class="btn btn-xs btn-secondary btn-liquidate-fd" data-fd-id="${fd.id}">
                      Liquidate
                    </button>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      ` : `
        <div class="empty-results-box text-center">
          <span class="empty-icon">🏦</span>
          <h4>No Active Treasury Deposits</h4>
          <p>Deposit surplus liquidity to earn steady interest that covers studio overheads.</p>
        </div>
      `}
    `;
  }

  function attachEventListeners(container, state, callbacks) {
    // Clock turns
    container.querySelector('#btnNextDay')?.addEventListener('click', () => callbacks.onAdvanceTurn?.(1));
    container.querySelector('#btnAdvanceWeek')?.addEventListener('click', () => callbacks.onAdvanceTurn?.(7));
    container.querySelector('#btnAdvanceMonth')?.addEventListener('click', () => callbacks.onAdvanceTurn?.(30));
    container.querySelector('#btnAdvanceEvent')?.addEventListener('click', () => callbacks.onAdvanceToEvent?.());

    container.querySelector('#btnOpenSaveManager')?.addEventListener('click', () => {
      window.StudioGame.UI.SaveModal.open(state, callbacks.onStateChange);
    });

    // Sub tabs
    container.querySelectorAll('[data-bank-action]').forEach(card => {
      card.addEventListener('click', () => {
        const action = card.getAttribute('data-bank-action');
        if (action === 'term') {
          activeSubTab = 'loans';
          selectedLoanType = 'term';
        } else if (action === 'mezzanine') {
          activeSubTab = 'loans';
          selectedLoanType = 'mezzanine';
        } else if (action === 'active') {
          activeSubTab = 'active';
        } else if (action === 'fd') {
          activeSubTab = 'fd';
        }
        render(container, state, callbacks);
      });
    });

    container.querySelector('#btnBackToBankHub')?.addEventListener('click', () => {
      activeSubTab = 'hub';
      render(container, state, callbacks);
    });

    container.querySelectorAll('[data-bank-tab]').forEach(btn => {
      btn.addEventListener('click', () => {
        activeSubTab = btn.getAttribute('data-bank-tab');
        render(container, state, callbacks);
      });
    });

    // Loan type toggle
    container.querySelectorAll('.loan-type-box').forEach(box => {
      box.addEventListener('click', () => {
        selectedLoanType = box.getAttribute('data-loan-type');
        render(container, state, callbacks);
      });
    });

    // Loan amount slider
    const loanSlider = container.querySelector('#loanAmountSlider');
    if (loanSlider) {
      loanSlider.addEventListener('input', () => {
        loanAmount = parseInt(loanSlider.value, 10);
        render(container, state, callbacks);
      });
    }

    // Loan tenure pills
    container.querySelectorAll('[data-tenure]').forEach(pill => {
      pill.addEventListener('click', () => {
        loanTenure = parseInt(pill.getAttribute('data-tenure'), 10);
        render(container, state, callbacks);
      });
    });

    // Disburse loan button
    container.querySelector('#btnDisburseLoan')?.addEventListener('click', () => {
      const res = window.StudioGame.Systems.Bank.takeLoan(state, {
        type: selectedLoanType,
        principal: loanAmount,
        tenureMonths: loanTenure
      });
      if (res.success) {
        window.StudioGame.State.autosave();
        callbacks.onStateChange?.();
        window.StudioGame.App.showToast(`🏛️ Loan Disbursed! Added ${window.StudioGame.Systems.Finance.formatRupees(loanAmount)} to studio working capital.`);
        activeSubTab = 'active';
        render(container, state, callbacks);
      } else {
        window.StudioGame.App.showToast(`⚠️ ${res.error}`);
      }
    });

    // Repay loan early
    container.querySelectorAll('.btn-repay-loan').forEach(btn => {
      btn.addEventListener('click', () => {
        const loanId = btn.getAttribute('data-loan-id');
        const res = window.StudioGame.Systems.Bank.repayLoanInFull(state, loanId);
        if (res.success) {
          window.StudioGame.State.autosave();
          callbacks.onStateChange?.();
          window.StudioGame.App.showToast(`✅ Settled loan in full! Saved future interest obligations.`);
          render(container, state, callbacks);
        } else {
          window.StudioGame.App.showToast(`⚠️ ${res.error}`);
        }
      });
    });

    // FD slider & tenure
    const fdSlider = container.querySelector('#fdAmountSlider');
    if (fdSlider) {
      fdSlider.addEventListener('input', () => {
        fdAmount = parseInt(fdSlider.value, 10);
        const disp = container.querySelector('#fdAmountDisplay');
        if (disp) disp.textContent = window.StudioGame.Systems.Finance.formatRupees(fdAmount);
      });
    }

    container.querySelectorAll('[data-fd-tenure]').forEach(pill => {
      pill.addEventListener('click', () => {
        fdTenure = parseInt(pill.getAttribute('data-fd-tenure'), 10);
        render(container, state, callbacks);
      });
    });

    // Create FD
    container.querySelector('#btnCreateFD')?.addEventListener('click', () => {
      const res = window.StudioGame.Systems.Bank.createFixedDeposit(state, fdAmount, fdTenure);
      if (res.success) {
        window.StudioGame.State.autosave();
        callbacks.onStateChange?.();
        window.StudioGame.App.showToast(`🏦 Fixed Deposit Created! Earning 7.5% annual yield.`);
        render(container, state, callbacks);
      } else {
        window.StudioGame.App.showToast(`⚠️ ${res.error}`);
      }
    });

    // Liquidate FD
    container.querySelectorAll('.btn-liquidate-fd').forEach(btn => {
      btn.addEventListener('click', () => {
        const fdId = btn.getAttribute('data-fd-id');
        const res = window.StudioGame.Systems.Bank.liquidateFixedDeposit(state, fdId);
        if (res.success) {
          window.StudioGame.State.autosave();
          callbacks.onStateChange?.();
          window.StudioGame.App.showToast(`💰 Liquidated FD: Returned ${window.StudioGame.Systems.Finance.formatRupees(res.payout)} to studio cash!`);
          render(container, state, callbacks);
        } else {
          window.StudioGame.App.showToast(`⚠️ ${res.error}`);
        }
      });
    });
  }

  return {
    render,
    resetToHub: () => { activeSubTab = 'hub'; }
  };
})();
