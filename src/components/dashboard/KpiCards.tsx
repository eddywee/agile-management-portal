// © Edmund Wallner
import type { RoleDistribution, Solution, Art, ConflictPerson } from '../../types';

interface KpiCardsProps {
  dist: RoleDistribution;
  solutions: Solution[];
  arts: Art[];
  conflicts: ConflictPerson[];
  onScrollToConflicts: () => void;
}

export function KpiCards({ dist, solutions, arts, conflicts, onScrollToConflicts }: KpiCardsProps) {
  return (
    <div className="kpi-row">
      <div className="kpi-card kpi-card--accent">
        <div className="kpi-card__label">Total FTE</div>
        <div className="kpi-card__value">{dist.total.toFixed(1)}</div>
        <div className="kpi-card__sub">across all assignments</div>
      </div>
      <div className="kpi-card kpi-card--purple">
        <div className="kpi-card__label">Solutions</div>
        <div className="kpi-card__value">{solutions.length}</div>
        <div className="kpi-card__sub">configured</div>
      </div>
      <div className="kpi-card kpi-card--green">
        <div className="kpi-card__label">ARTs</div>
        <div className="kpi-card__value">{arts.length}</div>
        <div className="kpi-card__sub">active trains</div>
      </div>
      <div className="kpi-card kpi-card--red clickable" onClick={onScrollToConflicts}>
        <div className="kpi-card__label">Conflicts</div>
        <div className="kpi-card__value">{conflicts.length}</div>
        <div className="kpi-card__sub">
          {conflicts.length ? '⚠ over-allocated people' : '✓ all within bounds'}
        </div>
      </div>
    </div>
  );
}
