// © Edmund Wallner
import { useImportStore } from '@/store/importStore';
import { useNavigationStore } from '@/store/navigationStore';

export function ResultStep() {
  const { result, reset } = useImportStore();
  const navigateTo = useNavigationStore((s) => s.navigateTo);

  if (!result) return null;

  return (
    <div style={{ textAlign: 'center', padding: '20px 0' }}>
      <svg viewBox="0 0 48 48" fill="none" style={{ width: 48, height: 48, margin: '0 auto 12px', display: 'block' }}>
        <circle cx="24" cy="24" r="22" stroke="#22c55e" strokeWidth="2" />
        <path d="M14 24l7 7 13-13" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 22, marginBottom: 8 }}>Import Complete</h3>
      <p style={{ color: 'var(--muted)', fontSize: 14 }}>{result.total} rows processed successfully</p>

      <div className="import-summary" style={{ justifyContent: 'center', marginTop: 16 }}>
        <div className="import-stat">
          <div className="import-stat__value" style={{ color: 'var(--green)' }}>
            {result.created}
          </div>
          <div className="import-stat__label">Created</div>
        </div>
        <div className="import-stat">
          <div className="import-stat__value" style={{ color: 'var(--accent)' }}>
            {result.updated}
          </div>
          <div className="import-stat__label">Updated</div>
        </div>
        <div className="import-stat">
          <div className="import-stat__value" style={{ color: 'var(--purple)' }}>
            {result.teams_created}
          </div>
          <div className="import-stat__label">Teams Created</div>
        </div>
      </div>

      <div style={{ marginTop: 24, display: 'flex', gap: 10, justifyContent: 'center' }}>
        <button className="btn btn-outline" onClick={() => navigateTo('people')}>
          View People
        </button>
        <button className="btn btn-outline" onClick={() => navigateTo('organization')}>
          View Organization
        </button>
        <button className="btn btn-primary" onClick={reset}>
          New Import
        </button>
      </div>
    </div>
  );
}
