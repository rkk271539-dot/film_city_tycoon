/**
 * Wife Detail Page / Modal Component
 * Renders the full details page for the wife, accessible from the Dashboard Wife Card.
 */

window.StudioGame = window.StudioGame || {};
window.StudioGame.UI = window.StudioGame.UI || {};

window.StudioGame.UI.WifePreview = (function() {
  function render(state) {
    const wife = state.wife;
    const formatRupees = window.StudioGame.Systems.Finance.formatRupees;

    return `
      <div class="modal-backdrop" id="wifeModalBackdrop">
        <div class="modal-card slide-up">
          <div class="modal-header">
            <div class="modal-title-wrap">
              <span class="badge badge-purple">Family & Partner</span>
              <h2 class="modal-title">${wife.name}</h2>
            </div>
            <button class="btn-icon-close" id="btnCloseWifeModal" aria-label="Close">&times;</button>
          </div>

          <div class="modal-body">
            <!-- Portrait & Core Stats Header -->
            <div class="wife-hero-card">
              <div class="wife-avatar-large">
                <img src="${wife.avatar}" alt="${wife.name}" class="avatar-img-round" />
              </div>
              <div class="wife-hero-details">
                <div class="wife-hero-name">${wife.name}</div>
                <div class="wife-hero-role">
                  <span class="pulse-indicator"></span> ${wife.currentRole}
                </div>
                <div class="wife-hero-networth">
                  <span class="subtext">Personal Net Worth</span>
                  <div class="highlight-val highlight-emerald">${formatRupees(wife.netWorth)}</div>
                </div>
              </div>
            </div>

            <!-- Relationship & Status Meters -->
            <div class="stats-grid-2">
              <div class="stat-box">
                <div class="stat-box-label">Relationship & Trust</div>
                <div class="stat-box-val highlight-rose">${wife.relationship}%</div>
                <div class="meter-bar">
                  <div class="meter-fill fill-rose" style="width: ${wife.relationship}%"></div>
                </div>
                <div class="meter-sub">Deep mutual bond & studio ally</div>
              </div>

              <div class="stat-box">
                <div class="stat-box-label">Openness Score</div>
                <div class="stat-box-val highlight-amber">${wife.openness} <span class="unit">/ 100</span></div>
                <div class="meter-bar">
                  <div class="meter-fill fill-amber" style="width: ${Math.max(5, wife.openness)}%"></div>
                </div>
                <div class="meter-sub">Sociable & industry connected</div>
              </div>
            </div>

            <div class="stats-grid-2" style="margin-top: 10px;">
              <div class="stat-box">
                <div class="stat-box-label">Physical Fitness & Charm</div>
                <div class="stat-box-val highlight-cyan">${wife.fitness}%</div>
                <div class="meter-bar">
                  <div class="meter-fill fill-cyan" style="width: ${wife.fitness}%"></div>
                </div>
                <div class="meter-sub">Prime camera readiness</div>
              </div>

              <div class="stat-box">
                <div class="stat-box-label">Age & Experience</div>
                <div class="stat-box-val highlight-indigo">${wife.age} Years</div>
                <div class="meter-sub">Born into creative circles</div>
              </div>
            </div>

            <!-- Deep Role Engine Teaser / Roadmap Note -->
            <div class="info-callout">
              <div class="callout-icon">✨</div>
              <div class="callout-text">
                <strong>Version 0.2 Wife System Preview</strong><br/>
                In the upcoming v0.2 release, ${wife.name} will autonomously decide her own career path (Star Actress, Model, Studio Creative Head, Producer, or Brand Founder). You can advise and financially invest in her ventures, but she retains independent agency!
              </div>
            </div>

            <!-- Current Thoughts / Ambient Dialogue -->
            <div class="dialogue-card">
              <div class="dialogue-quote">"</div>
              <p class="dialogue-body">
                "Kabir, let's turn our studio into Bollywood's premier powerhouse. I'm reviewing a few scripts and high-fashion modeling agencies while keeping our family's assets safe."
              </p>
              <div class="dialogue-author">— ${wife.name}</div>
            </div>
          </div>

          <div class="modal-footer">
            <button class="btn btn-secondary btn-full" id="btnDismissWifeModal">Return to Studio</button>
          </div>
        </div>
      </div>
    `;
  }

  function open(state) {
    const existing = document.getElementById('wifeModalBackdrop');
    if (existing) existing.remove();

    const wrapper = document.createElement('div');
    wrapper.innerHTML = render(state);
    document.body.appendChild(wrapper.firstElementChild);

    const backdrop = document.getElementById('wifeModalBackdrop');
    const closeBtn = document.getElementById('btnCloseWifeModal');
    const dismissBtn = document.getElementById('btnDismissWifeModal');

    const close = () => {
      if (backdrop) backdrop.remove();
    };

    if (closeBtn) closeBtn.addEventListener('click', close);
    if (dismissBtn) dismissBtn.addEventListener('click', close);
    if (backdrop) {
      backdrop.addEventListener('click', (e) => {
        if (e.target === backdrop) close();
      });
    }
  }

  return {
    open
  };
})();
