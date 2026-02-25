// © Edmund Wallner - Mercedes-Benz AG
import { useEffect, useState, useRef, useCallback } from 'react';
import { usePIStore } from '../../store/piStore';
import * as api from '../../api';
import type { RoleDistribution, Solution, Art, ConflictPerson, SolutionFTEBreakdown } from '../../types';
import { KpiCards } from './KpiCards';
import { SolutionBarChart } from './SolutionBarChart';
import { RoleDonutChart } from './RoleDonutChart';
import { ConflictTable } from './ConflictTable';
import { EmptyState } from './EmptyState';

export function DashboardPage() {
  const activePI = usePIStore((s) => s.activePI);
  const [dist, setDist] = useState<RoleDistribution>({ delivery: 0, art_leadership: 0, solution_leadership: 0, total: 0 });
  const [solutions, setSolutions] = useState<Solution[]>([]);
  const [arts, setArts] = useState<Art[]>([]);
  const [conflicts, setConflicts] = useState<ConflictPerson[]>([]);
  const [breakdown, setBreakdown] = useState<SolutionFTEBreakdown[]>([]);
  const [loading, setLoading] = useState(true);
  const conflictRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!activePI) return;
    let cancelled = false;
    setLoading(true);
    (async () => {
      const [d, sols, a, c, b] = await Promise.all([
        api.getRoleDistribution(activePI.id),
        api.getSolutions(),
        api.getArts(),
        api.getConflicts(activePI.id),
        api.getSolutionFTEBreakdown(activePI.id),
      ]);
      if (cancelled) return;
      setDist(d);
      setSolutions(sols);
      setArts(a);
      setConflicts(c);
      setBreakdown(b);
      setLoading(false);
    })();
    return () => { cancelled = true; };
  }, [activePI]);

  const scrollToConflicts = useCallback(() => {
    conflictRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  if (!activePI || loading) {
    return (
      <div className="page-header">
        <div className="page-header__left">
          <h2>Dashboard</h2>
          <p>Loading…</p>
        </div>
      </div>
    );
  }

  if (solutions.length === 0) {
    return <EmptyState />;
  }

  return (
    <>
      <div className="page-header">
        <div className="page-header__left">
          <h2>Dashboard</h2>
          <p>Investment overview for {activePI.pi_name}</p>
        </div>
        <div className="page-header__actions">
          <button className="btn btn-outline btn-sm" onClick={() => api.exportPIAsCSV(activePI.id)}>
            <svg viewBox="0 0 14 14" fill="none">
              <path d="M3 9v3h8v-3M7 1v7M4 5l3 3 3-3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Export
          </button>
        </div>
      </div>
      <KpiCards dist={dist} solutions={solutions} arts={arts} conflicts={conflicts} onScrollToConflicts={scrollToConflicts} />
      <div className="charts-row">
        <SolutionBarChart data={breakdown} />
        <RoleDonutChart dist={dist} />
      </div>
      <ConflictTable ref={conflictRef} conflicts={conflicts} />
    </>
  );
}
