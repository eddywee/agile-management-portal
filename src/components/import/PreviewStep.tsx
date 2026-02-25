// © Edmund Wallner - Mercedes-Benz AG
import { useState, useCallback } from 'react';
import { useImportStore } from '../../store/importStore';
import * as api from '../../api';

export function PreviewStep() {
  const { rows, headers, mappings, piId, euroDecimal, setResult, setStep } = useImportStore();
  const [importing, setImporting] = useState(false);

  // Build reverse map: field → csv_column index
  const reverseMap: Record<string, number> = {};
  mappings.forEach(m => {
    if (m.field !== '— skip —') {
      const idx = headers.indexOf(m.csv_column);
      if (idx >= 0) reverseMap[m.field] = idx;
    }
  });

  const preview = rows.slice(0, 50).map(row => ({
    full_name: reverseMap.full_name !== undefined ? row[reverseMap.full_name] : '',
    email: reverseMap.email !== undefined ? row[reverseMap.email] : '',
    team_name: reverseMap.team_name !== undefined ? row[reverseMap.team_name] : '',
    role: reverseMap.role !== undefined ? row[reverseMap.role] : '',
    fte_percent: reverseMap.fte_percent !== undefined ? row[reverseMap.fte_percent] : '',
  }));

  const handleImport = useCallback(async () => {
    if (!piId) return;
    setImporting(true);
    const result = await api.executeCsvImport(rows, headers, mappings, piId, euroDecimal);
    setResult(result);
    setStep(4);
    setImporting(false);
  }, [rows, headers, mappings, piId, euroDecimal, setResult, setStep]);

  return (
    <>
      <div className="import-summary">
        <div className="import-stat"><div className="import-stat__value" style={{ color: 'var(--white)' }}>{rows.length}</div><div className="import-stat__label">Total Rows</div></div>
      </div>
      <table className="data-table">
        <thead><tr><th>Name</th><th>Email</th><th>Team</th><th>Role</th><th>FTE</th></tr></thead>
        <tbody>
          {preview.map((r, i) => (
            <tr key={i}>
              <td>{r.full_name}</td>
              <td>{r.email}</td>
              <td>{r.team_name}</td>
              <td>{r.role}</td>
              <td>{r.fte_percent}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div style={{ marginTop: 20, display: 'flex', gap: 10 }}>
        <button className="btn btn-outline" onClick={() => setStep(2)}>← Back</button>
        <button className="btn btn-primary" disabled={importing} onClick={handleImport}>
          {importing ? 'Importing…' : `Import ${rows.length} rows`}
        </button>
      </div>
    </>
  );
}
