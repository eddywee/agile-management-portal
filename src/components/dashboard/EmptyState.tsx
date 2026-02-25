// © Edmund Wallner - Mercedes-Benz AG
import { useNavigationStore } from '../../store/navigationStore';
import { useModalStore } from '../../store/modalStore';
import { AddSolutionForm } from '../common/ModalForms';
import helixLogoFull from '../../assets/images/helix-logo-full.png';

export function EmptyState() {
  const navigateTo = useNavigationStore((s) => s.navigateTo);
  const showModal = useModalStore((s) => s.showModal);

  const handleAddSolution = () => {
    showModal('New Solution', <AddSolutionForm />, null);
  };

  return (
    <div className="welcome-page">
      <div className="welcome-content">
        <div className="welcome-left">
          <div className="welcome-badge">✨ Fresh Install</div>
          <img src={helixLogoFull} alt="HELIX" className="welcome-logo" />
          <h2 className="welcome-subtitle">Agile Portal</h2>
          <p className="welcome-desc">
            Let's get your financial planning environment set up for success.
            We'll start by defining your organizational structure.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div className="welcome-action" onClick={handleAddSolution}>
              <div className="welcome-action__icon welcome-action__icon--blue">🚀</div>
              <div>
                <h4>Start your Journey</h4>
                <p>Establish your first Solution to anchor your Agile Release Trains.</p>
              </div>
            </div>
            <div className="welcome-action" onClick={() => navigateTo('settings')}>
              <div className="welcome-action__icon welcome-action__icon--green">📅</div>
              <div>
                <h4>Set up Program Increment</h4>
                <p>Define your planning cadence and timelines.</p>
              </div>
            </div>
          </div>
        </div>
        <div className="welcome-right">
          <div className="welcome-diagram">
            <div className="welcome-diagram__node welcome-diagram__node--solution">🏢 Solution</div>
            <div className="welcome-diagram__connector"></div>
            <div className="welcome-diagram__arts">
              <div className="welcome-diagram__node welcome-diagram__node--art">🚂 ART 1</div>
              <div className="welcome-diagram__node welcome-diagram__node--art">🚂 ART 2</div>
            </div>
            <div className="welcome-diagram__connector"></div>
            <div style={{ display: 'flex', gap: 6 }}>
              {[1, 2, 3].map(i => <div key={i} style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--dim)' }} />)}
              <div style={{ width: 16 }} />
              {[4, 5].map(i => <div key={i} style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--dim)' }} />)}
            </div>
          </div>
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 18, marginBottom: 6 }}>Build your hierarchy</h3>
          <p style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 16 }}>
            Define your Solutions, Agile Release Trains (ARTs), and Teams to mirror your SAFe configuration.
          </p>
          <button className="btn btn-primary" style={{ width: '100%' }} onClick={handleAddSolution}>
            Start Building Hierarchy
          </button>
        </div>
      </div>
    </div>
  );
}
