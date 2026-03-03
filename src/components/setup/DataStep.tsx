// © Edmund Wallner
import { useState } from 'react';
import * as api from '@/api';
import { useAppStore } from '@/store/appStore';

interface DataStepProps {
  dbPath: string;
  onBack: () => void;
}

export function DataStep({ dbPath, onBack }: DataStepProps) {
  const [loading, setLoading] = useState(false);
  const completeSetup = useAppStore((s) => s.completeSetup);

  const handleFinish = async (seedDemo: boolean) => {
    setLoading(true);
    try {
      await api.initializeDatabase(dbPath, seedDemo);
      completeSetup();
    } catch (e) {
      console.error('Failed to initialize database:', e);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="setup-card">
        <div className="setup-loading">
          <div className="setup-spinner" />
          <p>Setting up your database...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="setup-card">
      <h3>Initial Data</h3>
      <p className="setup-card__desc">Choose how to populate your new database.</p>

      <div className="setup-data-options">
        <button className="setup-data-option" onClick={() => handleFinish(true)}>
          <div className="setup-data-option__icon setup-data-option__icon--blue">
            <svg viewBox="0 0 24 24" fill="none">
              <path
                d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <div>
            <h4>Load Demo Data</h4>
            <p>Start with sample solutions, ARTs, teams, and people to explore the app.</p>
          </div>
        </button>

        <button className="setup-data-option" onClick={() => handleFinish(false)}>
          <div className="setup-data-option__icon setup-data-option__icon--green">
            <svg viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5" />
              <path d="M12 8v8M8 12h8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </div>
          <div>
            <h4>Start Empty</h4>
            <p>Begin with a clean database and add your own organizational data.</p>
          </div>
        </button>
      </div>

      <div className="setup-nav">
        <button className="btn btn-outline" onClick={onBack}>
          Back
        </button>
      </div>
    </div>
  );
}
