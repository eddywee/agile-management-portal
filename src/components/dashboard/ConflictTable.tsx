// © Edmund Wallner - Mercedes-Benz AG
import { forwardRef } from 'react';
import { useNavigationStore } from '../../store/navigationStore';
import { usePeopleStore } from '../../store/peopleStore';
import type { ConflictPerson } from '../../types';

interface ConflictTableProps {
  conflicts: ConflictPerson[];
}

const avatarColors = ['blue', 'green', 'amber', 'red', 'purple'] as const;

function getInitials(name: string) {
  return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
}

export const ConflictTable = forwardRef<HTMLDivElement, ConflictTableProps>(({ conflicts }, ref) => {
  const navigateTo = useNavigationStore((s) => s.navigateTo);
  const setSelectedPerson = usePeopleStore((s) => s.setSelectedPerson);

  const handleResolve = (personId: number) => {
    navigateTo('people');
    setSelectedPerson(personId);
  };

  return (
    <div className="data-table-wrap" ref={ref}>
      <div className="detail-section__title" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        Allocation Conflicts
        {conflicts.length > 0 && <span>({conflicts.length})</span>}
        {conflicts.length > 0 && <span className="badge badge--action">⚠ Action Required</span>}
      </div>
      <table className="data-table">
        <thead>
          <tr><th>Person</th><th>Department</th><th>Total %</th><th>Assignments</th><th>Action</th></tr>
        </thead>
        <tbody>
          {conflicts.length === 0 ? (
            <tr>
              <td colSpan={5} style={{ textAlign: 'center', color: 'var(--green)', padding: 24 }}>
                ✓ No conflicts detected. All allocations are within bounds.
              </td>
            </tr>
          ) : conflicts.map((c, i) => (
            <tr key={c.id}>
              <td style={{ fontWeight: 500, color: 'var(--white)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div className={`avatar avatar--${avatarColors[i % avatarColors.length]}`}>{getInitials(c.full_name)}</div>
                  {c.full_name}
                </div>
              </td>
              <td>{c.department || '—'}</td>
              <td><span className="pct-badge pct-badge--danger">{c.total_fte}%</span></td>
              <td>{c.assignments} role{c.assignments > 1 ? 's' : ''}</td>
              <td>
                <button className="btn btn-sm btn-primary" onClick={() => handleResolve(c.id)}>Resolve</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
});
