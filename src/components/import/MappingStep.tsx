// © Edmund Wallner - Mercedes-Benz AG
import { useState, useEffect } from 'react';
import { useImportStore } from '../../store/importStore';
import { usePIStore } from '../../store/piStore';

const FIELDS = ['— skip —', 'full_name', 'email', 'department', 'hub', 'cost_center', 'company', 'team_name', 'art_name', 'solution_name', 'role', 'fte_percent'];

export function MappingStep() {
  const { headers, mappings, setMappings, piId, setPiId, euroDecimal, setEuroDecimal, setStep } = useImportStore();
  const allPIs = usePIStore((s) => s.allPIs);
  const [localMappings, setLocalMappings] = useState(mappings);

  useEffect(() => {
    // Auto-map on mount if mappings are empty
    if (localMappings.length === 0 && headers.length > 0) {
      const fieldMap: Record<string, string[]> = {
        full_name: ['name', 'mitarbeiter', 'full_name', 'person'],
        email: ['email', 'e-mail', 'mail'],
        department: ['department', 'dept', 'abteilung'],
        hub: ['hub', 'standort', 'location'],
        cost_center: ['cost_center', 'kostenstelle', 'cc'],
        company: ['company', 'firma', 'organisation'],
        team_name: ['team', 'team_name'],
        art_name: ['art', 'art_name'],
        solution_name: ['solution', 'solution_name'],
        role: ['role', 'rolle'],
        fte_percent: ['fte', 'fte_percent', 'allocation', 'alloc'],
      };
      const auto = headers.map(h => {
        const hl = h.toLowerCase();
        for (const [field, aliases] of Object.entries(fieldMap)) {
          if (aliases.some(a => hl.includes(a))) return { csv_column: h, field };
        }
        return { csv_column: h, field: '— skip —' };
      });
      setLocalMappings(auto);
    }
  }, [headers]);

  const updateMapping = (csvCol: string, field: string) => {
    setLocalMappings(prev => prev.map(m => m.csv_column === csvCol ? { ...m, field } : m));
  };

  const handleNext = () => {
    setMappings(localMappings);
    setStep(3);
  };

  return (
    <>
      <div style={{ marginBottom: 16 }}>
        <div className="form-group" style={{ maxWidth: 250 }}>
          <label className="form-label">Target PI</label>
          <select className="form-select" value={piId ?? ''} onChange={e => setPiId(parseInt(e.target.value))}>
            {allPIs.map(pi => <option key={pi.id} value={pi.id}>{pi.pi_name}</option>)}
          </select>
        </div>
        <div className="toggle-wrap">
          <input type="checkbox" className="toggle-input" id="euroDecimal" checked={euroDecimal} onChange={e => setEuroDecimal(e.target.checked)} />
          <label className="toggle-label" htmlFor="euroDecimal">European decimal format (0,50 → 50%)</label>
        </div>
      </div>
      {headers.map((h) => {
        const mapping = localMappings.find(m => m.csv_column === h);
        return (
          <div className="mapping-row" key={h}>
            <div className="mapping-row__csv">{h}</div>
            <div className="mapping-row__arrow">→</div>
            <select value={mapping?.field ?? '— skip —'} onChange={e => updateMapping(h, e.target.value)}>
              {FIELDS.map(f => <option key={f} value={f}>{f}</option>)}
            </select>
          </div>
        );
      })}
      <div style={{ marginTop: 20, display: 'flex', gap: 10 }}>
        <button className="btn btn-outline" onClick={() => setStep(1)}>← Back</button>
        <button className="btn btn-primary" onClick={handleNext}>Next: Preview →</button>
      </div>
    </>
  );
}
