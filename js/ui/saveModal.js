/**
 * Robust Save System Manager Modal
 * Handles Manual Slots (1-3), Rolling Autosave Rollbacks, JSON Export/Import, and Resets.
 */

window.StudioGame = window.StudioGame || {};
window.StudioGame.UI = window.StudioGame.UI || {};

window.StudioGame.UI.SaveModal = (function() {
  function render(state) {
    const State = window.StudioGame.State;
    const formatRupees = window.StudioGame.Systems.Finance.formatRupees;
    const rollbacks = State.getRollbackCheckpoints();

    let slotsHtml = '';
    for (let slotId = 1; slotId <= 3; slotId++) {
      const info = State.getSlotInfo(slotId);
      if (info) {
        slotsHtml += `
          <div class="save-slot-card active-slot">
            <div class="slot-badge">Slot ${slotId}</div>
            <div class="slot-info">
              <div class="slot-title">${info.studioName || 'Studio'}</div>
              <div class="slot-meta">
                <span>📅 ${info.date}</span> &bull; 
                <span>💰 ${formatRupees(info.playerNetWorth)}</span>
              </div>
              <div class="slot-time">Saved: ${info.savedAt}</div>
            </div>
            <div class="slot-actions">
              <button class="btn btn-sm btn-primary btn-load-slot" data-slot="${slotId}">Load</button>
              <button class="btn btn-sm btn-secondary btn-save-slot" data-slot="${slotId}">Overwrite</button>
              <button class="btn btn-sm btn-ghost btn-delete-slot" data-slot="${slotId}" title="Delete">🗑️</button>
            </div>
          </div>
        `;
      } else {
        slotsHtml += `
          <div class="save-slot-card empty-slot">
            <div class="slot-badge empty">Slot ${slotId}</div>
            <div class="slot-info">
              <div class="slot-title text-muted">Empty Slot</div>
              <div class="slot-meta text-muted">No saved data</div>
            </div>
            <div class="slot-actions">
              <button class="btn btn-sm btn-primary btn-save-slot" data-slot="${slotId}">Save Game</button>
            </div>
          </div>
        `;
      }
    }

    let rollbackHtml = '';
    if (rollbacks.length > 0) {
      rollbackHtml = rollbacks.map((rb, idx) => `
        <div class="rollback-row">
          <div class="rb-details">
            <span class="rb-date">📅 ${rb.date} (Day ${rb.day})</span>
            <span class="rb-nw">Net Worth: ${formatRupees(rb.playerNetWorth)}</span>
            <span class="rb-time">${rb.time}</span>
          </div>
          <button class="btn btn-xs btn-outline-amber btn-rollback" data-index="${idx}">
            Rollback
          </button>
        </div>
      `).join('');
    } else {
      rollbackHtml = `<div class="text-muted p-2 text-center text-sm">No rollback points yet. Advance days to generate.</div>`;
    }

    return `
      <div class="modal-backdrop" id="saveModalBackdrop">
        <div class="modal-card slide-up">
          <div class="modal-header">
            <div class="modal-title-wrap">
              <span class="badge badge-emerald">Game Memory</span>
              <h2 class="modal-title">Save & Backup Manager</h2>
            </div>
            <button class="btn-icon-close" id="btnCloseSaveModal" aria-label="Close">&times;</button>
          </div>

          <div class="modal-body">
            <!-- Manual Slots Section -->
            <div class="section-label">Manual Save Slots</div>
            <div class="save-slots-list">
              ${slotsHtml}
            </div>

            <!-- Rolling Autosaves / Rollback Section -->
            <div class="section-label mt-4">
              <span>Rolling Autosave Rollbacks</span>
              <span class="badge badge-cyan text-xs">Last ${rollbacks.length} Checkpoints</span>
            </div>
            <p class="subtext mb-2">Made a bad decision or want to retry? Revert your studio to an earlier in-game day checkpoint:</p>
            <div class="rollback-list">
              ${rollbackHtml}
            </div>

            <!-- Export / Import Section -->
            <div class="section-label mt-4">Device Transfer & JSON Backup</div>
            <div class="export-import-grid">
              <button class="btn btn-secondary" id="btnExportJson">
                📥 Export Save File (.json)
              </button>
              <label class="btn btn-secondary btn-file-label">
                📤 Import Save File (.json)
                <input type="file" id="fileImportJson" accept=".json" style="display:none;" />
              </label>
            </div>

            <!-- Danger Zone -->
            <div class="section-label mt-4 text-rose">Danger Zone</div>
            <div class="danger-box">
              <div class="danger-desc">
                Permanently wipes all active studio data and begins a brand new career.
              </div>
              <button class="btn btn-outline-danger" id="btnResetAll">
                ⚠️ Reset Entire Game
              </button>
            </div>
          </div>

          <div class="modal-footer">
            <button class="btn btn-secondary btn-full" id="btnDismissSaveModal">Close</button>
          </div>
        </div>
      </div>
    `;
  }

  function open(state, onStateChangeCallback) {
    const existing = document.getElementById('saveModalBackdrop');
    if (existing) existing.remove();

    const wrapper = document.createElement('div');
    wrapper.innerHTML = render(state);
    document.body.appendChild(wrapper.firstElementChild);

    const backdrop = document.getElementById('saveModalBackdrop');
    const closeBtn = document.getElementById('btnCloseSaveModal');
    const dismissBtn = document.getElementById('btnDismissSaveModal');

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

    // Save slot buttons
    document.querySelectorAll('.btn-save-slot').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const slot = e.target.getAttribute('data-slot');
        const success = window.StudioGame.State.saveToSlot(slot);
        if (success) {
          alert(`Game saved successfully to Slot ${slot}!`);
          close();
          open(window.StudioGame.State.get(), onStateChangeCallback);
        }
      });
    });

    // Load slot buttons
    document.querySelectorAll('.btn-load-slot').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const slot = e.target.getAttribute('data-slot');
        if (confirm(`Load game from Slot ${slot}? Any unsaved daily changes will be replaced.`)) {
          const success = window.StudioGame.State.loadFromSlot(slot);
          if (success) {
            close();
            if (onStateChangeCallback) onStateChangeCallback();
          }
        }
      });
    });

    // Delete slot buttons
    document.querySelectorAll('.btn-delete-slot').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const slot = e.target.getAttribute('data-slot');
        if (confirm(`Delete Slot ${slot}?`)) {
          window.StudioGame.State.deleteSlot(slot);
          close();
          open(window.StudioGame.State.get(), onStateChangeCallback);
        }
      });
    });

    // Rollback buttons
    document.querySelectorAll('.btn-rollback').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const idx = parseInt(e.target.getAttribute('data-index'), 10);
        if (confirm('Revert state to this earlier rollback checkpoint?')) {
          const success = window.StudioGame.State.restoreRollback(idx);
          if (success) {
            alert('Reverted to checkpoint successfully!');
            close();
            if (onStateChangeCallback) onStateChangeCallback();
          }
        }
      });
    });

    // Export JSON
    const exportBtn = document.getElementById('btnExportJson');
    if (exportBtn) {
      exportBtn.addEventListener('click', () => {
        window.StudioGame.State.exportSaveToFile();
      });
    }

    // Import JSON
    const importInput = document.getElementById('fileImportJson');
    if (importInput) {
      importInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (event) => {
          const res = window.StudioGame.State.importSaveFromJson(event.target.result);
          if (res.success) {
            alert('Save file imported successfully!');
            close();
            if (onStateChangeCallback) onStateChangeCallback();
          } else {
            alert('Failed to import save file: ' + res.error);
          }
        };
        reader.readAsText(file);
      });
    }

    // Reset All
    const resetBtn = document.getElementById('btnResetAll');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        if (confirm('Are you absolutely sure you want to reset all game data? This cannot be undone.')) {
          window.StudioGame.State.resetGame();
          window.location.reload();
        }
      });
    }
  }

  return {
    open
  };
})();
