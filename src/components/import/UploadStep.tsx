// © Edmund Wallner - Mercedes-Benz AG
import { useCallback } from 'react';
import { open } from '@tauri-apps/plugin-dialog';
import { useImportStore } from '../../store/importStore';
import { usePIStore } from '../../store/piStore';
import * as api from '../../api';

export function UploadStep() {
  const { fileName, rows, setFile, setStep, setPiId } = useImportStore();
  const activePI = usePIStore((s) => s.activePI);

  const handleBrowse = useCallback(async () => {
    const selected = await open({ filters: [{ name: 'CSV', extensions: ['csv', 'tsv'] }] });
    if (!selected) return;
    const path = typeof selected === 'string' ? selected : (selected as unknown as { path: string }).path;
    const result = await api.parseCsvFile(path);
    const name = path.split('/').pop() || path;
    setFile(path, name, result.headers, result.rows);
    if (activePI) setPiId(activePI.id);
  }, [setFile, setPiId, activePI]);

  return (
    <>
      <div className="dropzone" onClick={handleBrowse}>
        <svg viewBox="0 0 40 40" fill="none">
          <path d="M20 5v22M13 14l7-7 7 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M5 28v6a2 2 0 002 2h26a2 2 0 002-2v-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
        <div>Click to <span style={{ color: 'var(--accent)', fontWeight: 500 }}>browse files</span></div>
        <div style={{ marginTop: 6, fontSize: 11 }}>Supports .csv and .tsv files</div>
      </div>
      {fileName && rows.length > 0 && (
        <>
          <div style={{ padding: 12, border: '1px solid var(--green-bd)', borderRadius: 'var(--r)', background: 'var(--green-lo)', color: 'var(--green)', fontSize: 13, marginTop: 12 }}>
            ✓ {fileName} — {rows.length} rows
          </div>
          <div style={{ marginTop: 16 }}>
            <button className="btn btn-primary" onClick={() => setStep(2)}>Next: Map Columns →</button>
          </div>
        </>
      )}
    </>
  );
}
