// © Edmund Wallner
import { useState, useEffect } from 'react';
import { open, save } from '@tauri-apps/plugin-dialog';
import * as api from '@/api';
import { usePIStore } from '@/store/piStore';

export function DatabaseTab() {
  const [dbPath, setDbPath] = useState('');
  const [switching, setSwitching] = useState(false);
  const loadPIs = usePIStore((s) => s.loadPIs);

  useEffect(() => {
    api.getDatabasePath().then(setDbPath);
  }, []);

  const handleSwitch = async (path: string) => {
    setSwitching(true);
    try {
      await api.switchDatabase(path);
      setDbPath(path);
      await loadPIs();
    } catch (e) {
      console.error('Failed to switch database:', e);
    } finally {
      setSwitching(false);
    }
  };

  const handleOpenExisting = async () => {
    const result = await open({
      title: 'Open Existing Database',
      filters: [{ name: 'Agile Portal Database', extensions: ['apdb', 'sqlite', 'db'] }],
    });
    if (result) {
      await handleSwitch(result as string);
    }
  };

  const handleCreateNew = async () => {
    const result = await save({
      title: 'Create New Database',
      defaultPath: 'agile_management_portal.apdb',
      filters: [{ name: 'Agile Portal Database', extensions: ['apdb'] }],
    });
    if (result) {
      await handleSwitch(result as string);
    }
  };

  return (
    <>
      <div className="settings-card">
        <h4>Current Database</h4>
        <p>The database file your app is currently connected to.</p>
        <div className="db-path-display db-path-display--settings">
          <svg viewBox="0 0 16 16" fill="none">
            <path
              d="M8 1v8M4 5l4 4 4-4"
              stroke="currentColor"
              strokeWidth="1.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M2 11v2a1 1 0 001 1h10a1 1 0 001-1v-2"
              stroke="currentColor"
              strokeWidth="1.4"
              strokeLinecap="round"
            />
          </svg>
          <span className="db-path-display__path">{dbPath}</span>
        </div>
      </div>

      <div className="settings-card">
        <h4>Switch Database</h4>
        <p>Connect to a different database file or create a new one. All data will reload from the selected file.</p>
        <div className="setup-actions-row">
          <button className="btn btn-primary" onClick={handleOpenExisting} disabled={switching}>
            <svg viewBox="0 0 16 16" fill="none">
              <path
                d="M4 2h5l1 1h3a1 1 0 011 1v8a1 1 0 01-1 1H3a1 1 0 01-1-1V3a1 1 0 011-1h1z"
                stroke="currentColor"
                strokeWidth="1.3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Open Existing Database
          </button>
          <button className="btn btn-outline" onClick={handleCreateNew} disabled={switching}>
            <svg viewBox="0 0 16 16" fill="none">
              <path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
            </svg>
            Create New Database
          </button>
        </div>
        {switching && <p style={{ marginTop: 12, fontSize: 12, color: 'var(--muted)' }}>Switching database...</p>}
      </div>
    </>
  );
}
