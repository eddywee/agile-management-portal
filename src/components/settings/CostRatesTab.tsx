// © Edmund Wallner - Mercedes-Benz AG
import { useEffect, useState } from 'react';
import * as api from '../../api';
import type { CostRate } from '../../types';

export function CostRatesTab() {
  const [rates, setRates] = useState<CostRate[]>([]);
  const [hubs, setHubs] = useState<string[]>([]);
  const [depts, setDepts] = useState<string[]>([]);
  const [hubFilter, setHubFilter] = useState('All Hubs');
  const [deptFilter, setDeptFilter] = useState('All Departments');

  useEffect(() => {
    api.getCostRateHubs().then(setHubs);
    api.getCostRateDepts().then(setDepts);
  }, []);

  useEffect(() => {
    const hf = hubFilter === 'All Hubs' ? undefined : hubFilter;
    const df = deptFilter === 'All Departments' ? undefined : deptFilter;
    api.getCostRates(hf, df).then(setRates);
  }, [hubFilter, deptFilter]);

  return (
    <>
      <div style={{ padding: '0 32px 16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <div style={{ display: 'flex', gap: 12 }}>
            <select className="form-select" style={{ maxWidth: 160, padding: '8px 28px 8px 12px' }} value={hubFilter} onChange={e => setHubFilter(e.target.value)}>
              <option>All Hubs</option>
              {hubs.map(h => <option key={h}>{h}</option>)}
            </select>
            <select className="form-select" style={{ maxWidth: 180, padding: '8px 28px 8px 12px' }} value={deptFilter} onChange={e => setDeptFilter(e.target.value)}>
              <option>All Departments</option>
              {depts.map(d => <option key={d}>{d}</option>)}
            </select>
          </div>
        </div>
      </div>
      <div className="data-table-wrap" style={{ paddingTop: 0 }}>
        <table className="data-table">
          <thead>
            <tr><th>Hub Code</th><th>Department</th><th>Role / Level</th><th style={{ textAlign: 'right' }}>Daily Rate (€)</th><th>Effective PI</th></tr>
          </thead>
          <tbody>
            {rates.length ? rates.map(r => (
              <tr key={r.id}>
                <td style={{ fontWeight: 500, color: 'var(--white)' }}>{r.hub_code}</td>
                <td>{r.department}</td>
                <td>{r.role_level}</td>
                <td style={{ textAlign: 'right', fontFamily: 'monospace', color: 'var(--white)' }}>€{r.daily_rate.toFixed(2)}</td>
                <td><span className="badge badge--accent">{r.effective_pi}</span></td>
              </tr>
            )) : (
              <tr><td colSpan={5} style={{ textAlign: 'center', color: 'var(--dim)', padding: 24 }}>No cost rates match filters</td></tr>
            )}
          </tbody>
        </table>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', fontSize: 12, color: 'var(--dim)' }}>
          <span>Showing <span style={{ color: 'var(--white)', fontWeight: 600 }}>{rates.length}</span> rates</span>
        </div>
      </div>
    </>
  );
}
