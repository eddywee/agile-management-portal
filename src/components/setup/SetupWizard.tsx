// © Edmund Wallner
import { useState } from 'react';
import { WelcomeStep } from './WelcomeStep';
import { LocationStep } from './LocationStep';
import { DataStep } from './DataStep';
import { useAppStore } from '@/store/appStore';

type Step = 'welcome' | 'location' | 'data';

const STEPS: { key: Step; label: string }[] = [
  { key: 'welcome', label: 'Welcome' },
  { key: 'location', label: 'Location' },
  { key: 'data', label: 'Data' },
];

export function SetupWizard() {
  const [step, setStep] = useState<Step>('welcome');
  const [dbPath, setDbPath] = useState('');
  const appState = useAppStore((s) => s.appState);

  const defaultPath = appState?.default_db_path ?? '';

  const stepIndex = STEPS.findIndex((s) => s.key === step);

  return (
    <div className="setup-page">
      <div className="setup-container">
        <div className="setup-steps">
          {STEPS.map((s, i) => (
            <div key={s.key} className="setup-steps__row">
              {i > 0 && <div className="setup-steps__connector" />}
              <div className={`setup-step${i === stepIndex ? ' active' : ''}${i < stepIndex ? ' done' : ''}`}>
                <div className="setup-step__num">{i < stepIndex ? '\u2713' : i + 1}</div>
                <span>{s.label}</span>
              </div>
            </div>
          ))}
        </div>

        {step === 'welcome' && <WelcomeStep onNext={() => setStep('location')} />}
        {step === 'location' && (
          <LocationStep
            defaultPath={defaultPath}
            onNext={(path) => {
              setDbPath(path);
              setStep('data');
            }}
            onBack={() => setStep('welcome')}
          />
        )}
        {step === 'data' && <DataStep dbPath={dbPath || defaultPath} onBack={() => setStep('location')} />}
      </div>
    </div>
  );
}
