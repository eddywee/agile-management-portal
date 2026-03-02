// © Edmund Wallner
import { useState } from 'react';
import { open } from '@tauri-apps/plugin-dialog';

interface LocationStepProps {
  defaultPath: string;
  onNext: (path: string) => void;
  onBack: () => void;
}

export function LocationStep({ defaultPath, onNext, onBack }: LocationStepProps) {
  const [selectedPath, setSelectedPath] = useState(defaultPath);

  const handleChooseFolder = async () => {
    const result = await open({ directory: true, title: 'Choose Database Location' });
    if (result) {
      const dir = result as string;
      const dbPath = dir.endsWith('/') || dir.endsWith('\\')
        ? `${dir}agile_management_portal.apdb`
        : `${dir}/agile_management_portal.apdb`;
      setSelectedPath(dbPath);
    }
  };

  const handleOpenExisting = async () => {
    const result = await open({
      title: 'Open Existing Database',
      filters: [{ name: 'Agile Portal Database', extensions: ['apdb', 'sqlite', 'db'] }],
    });
    if (result) {
      setSelectedPath(result as string);
    }
  };

  return (
    <div className="setup-card">
      <h3>Database Location</h3>
      <p className="setup-card__desc">Choose where to store your data. The default location is recommended for most users.</p>

      <div className="db-path-display">
        <svg viewBox="0 0 16 16" fill="none">
          <path d="M8 1v8M4 5l4 4 4-4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M2 11v2a1 1 0 001 1h10a1 1 0 001-1v-2" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
        </svg>
        <span className="db-path-display__path">{selectedPath}</span>
        {selectedPath === defaultPath && <span className="badge badge--green">Default</span>}
      </div>

      <div className="setup-actions-row">
        <button className="btn btn-outline" onClick={handleChooseFolder}>
          <svg viewBox="0 0 16 16" fill="none">
            <path d="M2 4v8a1 1 0 001 1h10a1 1 0 001-1V6a1 1 0 00-1-1H8L6.5 3H3a1 1 0 00-1 1z" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Choose Custom Location
        </button>
        <button className="btn btn-outline" onClick={handleOpenExisting}>
          <svg viewBox="0 0 16 16" fill="none">
            <path d="M4 2h5l1 1h3a1 1 0 011 1v8a1 1 0 01-1 1H3a1 1 0 01-1-1V3a1 1 0 011-1h1z" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Open Existing Database
        </button>
      </div>

      <div className="setup-nav">
        <button className="btn btn-outline" onClick={onBack}>Back</button>
        <button className="btn btn-primary" onClick={() => onNext(selectedPath)}>Continue</button>
      </div>
    </div>
  );
}
