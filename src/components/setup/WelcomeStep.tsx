// © Edmund Wallner

interface WelcomeStepProps {
  onNext: () => void;
}

export function WelcomeStep({ onNext }: WelcomeStepProps) {
  return (
    <div className="setup-card">
      <div className="setup-welcome">
        <svg className="setup-welcome__icon" viewBox="0 0 48 48" fill="none">
          <rect x="4" y="4" width="40" height="40" rx="8" stroke="currentColor" strokeWidth="2" />
          <path d="M16 24h16M24 16v16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
        <h2>Welcome to Agile Management Portal</h2>
        <p>
          Track FTE allocation across your SAFe organizational hierarchy. Let's get your database set up before we
          begin.
        </p>
        <button className="btn btn-primary" onClick={onNext}>
          <svg viewBox="0 0 16 16" fill="none">
            <path
              d="M3 8h10M9 4l4 4-4 4"
              stroke="currentColor"
              strokeWidth="1.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Get Started
        </button>
      </div>
    </div>
  );
}
