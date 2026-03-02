// © Edmund Wallner
import { usePIStore } from '../../store/piStore';
import { useNavigationStore } from '../../store/navigationStore';
import * as api from '../../api';

export function DataManagementTab() {
  const activePI = usePIStore((s) => s.activePI);
  const loadPIs = usePIStore((s) => s.loadPIs);
  const navigateTo = useNavigationStore((s) => s.navigateTo);

  const handleExportCSV = async () => {
    if (!activePI) return;
    const csv = await api.exportPIAsCSV(activePI.id);
    // In Tauri, the Rust command returns the CSV string — we could use dialog save
    // For now, create a Blob download
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `amp_${activePI.pi_name.replace(/\s/g, '_')}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleReset = async () => {
    if (!confirm('Are you sure? This will delete ALL data and reset to seed state.')) return;
    try {
      await api.resetDatabase();
      await loadPIs();
    } catch (err) {
      console.error('Reset failed:', err);
      alert('Failed to reset database. Please restart the application.');
    }
  };

  return (
    <>
      <div className="dm-section">
        <div className="dm-section-header">
          <div className="dm-section-icon dm-section-icon--blue">
            <svg viewBox="0 0 20 20" fill="none" style={{ width: 18, height: 18 }}><path d="M3 9v3h8v-3M7 1v7M4 5l3 3 3-3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </div>
          <div className="dm-section-title">Export Data</div>
        </div>
        <div className="dm-cards">
          <div className="dm-card">
            <div className="dm-card__header">
              <div className="dm-card__icon" style={{ background: 'var(--accent-lo)', color: 'var(--accent)' }}>
                <svg viewBox="0 0 20 20" fill="none" style={{ width: 18, height: 18 }}><path d="M4 2h8l4 4v10a2 2 0 01-2 2H4a2 2 0 01-2-2V4a2 2 0 012-2z" stroke="currentColor" strokeWidth="1.2" /><path d="M12 2v4h4" stroke="currentColor" strokeWidth="1.2" /></svg>
              </div>
              <span className="dm-card__tag">PI Data</span>
            </div>
            <h4>Export Current PI</h4>
            <p>Download structured CSV files for {activePI?.pi_name || '—'} planning session.</p>
            <button className="btn btn-primary" onClick={handleExportCSV}>
              <svg viewBox="0 0 14 14" fill="none"><path d="M3 9v3h8v-3M7 1v7M4 5l3 3 3-3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" /></svg>
              Download CSVs
            </button>
          </div>
        </div>
      </div>
      <div className="divider" />
      <div className="dm-section">
        <div className="dm-section-header">
          <div className="dm-section-icon dm-section-icon--green">
            <svg viewBox="0 0 20 20" fill="none" style={{ width: 18, height: 18 }}><path d="M7 11v-7M4 7l3-3 3 3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" /><path d="M17 11v3a2 2 0 01-2 2H5a2 2 0 01-2-2v-3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" /></svg>
          </div>
          <div className="dm-section-title">Import Data</div>
        </div>
        <div className="dm-import-card">
          <div style={{ zIndex: 1 }}>
            <h4 style={{ fontFamily: 'var(--font-display)', fontSize: 16, marginBottom: 4 }}>Import Wizard</h4>
            <p style={{ fontSize: 12, color: 'var(--muted)', maxWidth: 400, lineHeight: 1.5 }}>
              Upload new planning data or restore from a previous backup. Our wizard will guide you through mapping columns and validating data integrity.
            </p>
          </div>
          <button className="btn btn-primary" style={{ zIndex: 1, flexShrink: 0 }} onClick={() => navigateTo('import')}>
            <svg viewBox="0 0 14 14" fill="none"><path d="M7 11v-7M4 7l3-3 3 3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" /></svg>
            Launch Import Wizard
          </button>
        </div>
      </div>
      <div className="divider" />
      <div className="dm-section">
        <div className="dm-section-header">
          <div className="dm-section-icon dm-section-icon--red">
            <svg viewBox="0 0 20 20" fill="none" style={{ width: 18, height: 18 }}><path d="M10 3l7 4v6l-7 4-7-4V7l7-4z" stroke="currentColor" strokeWidth="1.2" /><path d="M10 9v3M10 14h.01" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
          </div>
          <div className="dm-section-title" style={{ color: 'var(--red)' }}>Danger Zone</div>
        </div>
        <div className="danger-zone">
          <div>
            <h4>Reset System Data</h4>
            <p>This action will permanently delete all planning data, configurations, and user preferences. This action cannot be undone.</p>
          </div>
          <button className="btn btn-danger" style={{ flexShrink: 0 }} onClick={handleReset}>
            <svg viewBox="0 0 14 14" fill="none"><path d="M3 4h8M5 4V3h4v1M4.5 4v7a.5.5 0 00.5.5h4a.5.5 0 00.5-.5V4" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" /></svg>
            Reset / Clear All Data
          </button>
        </div>
      </div>
      <div className="settings-card">
        <h4>Application Info</h4>
        <p>Agile Management Portal v{__APP_VERSION__} · SQLite (rusqlite) · Tauri Desktop App · © Edmund Wallner</p>
      </div>
    </>
  );
}
