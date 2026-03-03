// © Edmund Wallner
import { useEffect, useState, useCallback } from 'react';
import { usePIStore } from '@/store/piStore';
import { useModalStore } from '@/store/modalStore';
import * as api from '@/api';
import { AddPIForm, EditPIForm } from '@/components/common/ModalForms';

export function PiManagementTab() {
  const { allPIs, activePI, loadPIs, setActivePI } = usePIStore();
  const showModal = useModalStore((s) => s.showModal);
  const [cloneFrom, setCloneFrom] = useState('');
  const [cloneTo, setCloneTo] = useState('');

  useEffect(() => { loadPIs(); }, [loadPIs]);

  const handleActivate = async (id: number) => {
    await api.activatePI(id);
    await loadPIs();
    const pi = (await api.getAllPIs()).find(p => p.id === id);
    if (pi) setActivePI(pi);
  };

  const handleComplete = async (id: number) => {
    if (!confirm('Complete this PI? It will be locked and read-only.')) return;
    await api.completePI(id);
    await loadPIs();
  };

  const handleDelete = async (id: number, name: string) => {
    if (!confirm(`Delete PI "${name}"? All memberships and leadership assignments scoped to this PI will be permanently removed.`)) return;
    await api.deletePI(id);
    await loadPIs();
    if (activePI?.id === id) {
      const pis = await api.getAllPIs();
      const next = pis.find(p => p.status === 'Active') || pis[0] || null;
      if (next) setActivePI(next);
    }
  };

  const handleClone = async () => {
    const fromId = parseInt(cloneFrom);
    const toId = parseInt(cloneTo);
    if (!fromId || !toId) return;
    if (fromId === toId) return alert('Cannot clone a PI to itself');
    await api.clonePI(fromId, toId);
    alert('Clone successful!');
    await loadPIs();
  };

  const refresh = useCallback(() => { loadPIs(); }, [loadPIs]);

  return (
    <>
      <div style={{ padding: '0 32px 16px', display: 'flex', justifyContent: 'flex-end' }}>
        <button className="btn btn-primary" onClick={() => showModal('New Program Increment', <AddPIForm onDone={refresh} />, null)}>
          <svg viewBox="0 0 14 14" fill="none"><path d="M7 1v12M1 7h12" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" /></svg>
          New PI
        </button>
      </div>
      <div className="data-table-wrap" style={{ paddingTop: 0 }}>
        <table className="data-table">
          <thead><tr><th>Name</th><th>Start</th><th>End</th><th>Status</th><th>Actions</th></tr></thead>
          <tbody>
            {allPIs.map(pi => (
              <tr key={pi.id}>
                <td style={{ fontWeight: 500, color: 'var(--white)' }}>{pi.pi_name}</td>
                <td>{pi.start_date}</td>
                <td>{pi.end_date}</td>
                <td>
                  <span className={`badge badge--${pi.status === 'Active' ? 'green' : pi.status === 'Planned' ? 'accent' : 'dim'}`}>
                    {pi.status}
                  </span>
                </td>
                <td style={{ display: 'flex', gap: 4 }}>
                  <button className="btn btn-sm btn-outline" onClick={() => showModal('Edit PI', <EditPIForm pi={pi} onDone={refresh} />, null)}>Edit</button>
                  {pi.status === 'Planned' && <button className="btn btn-sm btn-outline" onClick={() => handleActivate(pi.id)}>Activate</button>}
                  {pi.status === 'Active' && <button className="btn btn-sm btn-outline" onClick={() => handleComplete(pi.id)}>Complete</button>}
                  <button className="btn btn-sm btn-outline" style={{ color: 'var(--red)', borderColor: 'var(--red-bd)' }} onClick={() => handleDelete(pi.id, pi.pi_name)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="settings-card">
        <h4>Clone PI</h4>
        <p>Copy all structure and assignments from one PI to another as a starting point.</p>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <select className="form-select" style={{ maxWidth: 200 }} value={cloneFrom} onChange={e => setCloneFrom(e.target.value)}>
            <option value="">Select source…</option>
            {allPIs.map(pi => <option key={pi.id} value={pi.id}>{pi.pi_name}</option>)}
          </select>
          <span style={{ color: 'var(--dim)' }}>→</span>
          <select className="form-select" style={{ maxWidth: 200 }} value={cloneTo} onChange={e => setCloneTo(e.target.value)}>
            <option value="">Select target…</option>
            {allPIs.filter(p => p.status !== 'Completed').map(pi => <option key={pi.id} value={pi.id}>{pi.pi_name}</option>)}
          </select>
          <button className="btn btn-primary" onClick={handleClone}>Clone</button>
        </div>
      </div>
    </>
  );
}
