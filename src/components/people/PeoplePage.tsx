// © Edmund Wallner
import { useEffect, useState, useCallback } from 'react';
import { usePIStore } from '@/store/piStore';
import { usePeopleStore } from '@/store/peopleStore';
import { useModalStore } from '@/store/modalStore';
import * as api from '@/api';
import type { Person, PersonAllocation, ProgramIncrement } from '@/types';
import { AddPersonForm, EditPersonForm, EditAllocationForm, AddToTeamForm, AddToLeadershipForm, DeactivatePersonDialog } from '@/components/common/ModalForms';

const avatarColors = ['blue', 'green', 'amber', 'purple', 'red'] as const;

function getInitials(name: string) {
  return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
}

export function PeoplePage() {
  const activePI = usePIStore((s) => s.activePI);
  const { selectedPersonId, setSelectedPerson } = usePeopleStore();
  const showModal = useModalStore((s) => s.showModal);
  const [people, setPeople] = useState<Person[]>([]);
  const [search, setSearch] = useState('');
  const [ftes, setFtes] = useState<Record<number, number>>({});

  const loadPeople = useCallback(async () => {
    const all = await api.getPeople();
    setPeople(all);
    if (activePI) {
      const fteMap: Record<number, number> = {};
      await Promise.all(all.map(async p => { fteMap[p.id] = await api.getPersonTotalFTE(p.id, activePI.id); }));
      setFtes(fteMap);
    }
  }, [activePI]);

  useEffect(() => { loadPeople(); }, [loadPeople]);

  const filtered = search.trim()
    ? people.filter(p =>
      p.full_name.toLowerCase().includes(search.toLowerCase()) ||
      (p.email || '').toLowerCase().includes(search.toLowerCase()) ||
      (p.department || '').toLowerCase().includes(search.toLowerCase()) ||
      (p.hub || '').toLowerCase().includes(search.toLowerCase()))
    : people;

  const handleAddPerson = () => {
    showModal('New Person', <AddPersonForm onDone={loadPeople} />, null);
  };

  return (
    <>
      <div className="page-header">
        <div className="page-header__left">
          <h2>People</h2>
          <p>{filtered.length} people registered</p>
        </div>
        <div className="page-header__actions">
          <button className="btn btn-primary" onClick={handleAddPerson}>
            <svg viewBox="0 0 14 14" fill="none"><path d="M7 1v12M1 7h12" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" /></svg>
            New Person
          </button>
        </div>
      </div>
      <div className="search-bar">
        <svg viewBox="0 0 16 16" fill="none">
          <circle cx="7" cy="7" r="5" stroke="currentColor" strokeWidth="1.2" />
          <path d="M11 11l3.5 3.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
        </svg>
        <input type="text" placeholder="Search people by name, email, department…" value={search} onChange={e => setSearch(e.target.value)} />
      </div>
      <div className="data-table-wrap">
        <table className="data-table">
          <thead><tr><th>Name</th><th>Email</th><th>Department</th><th>Hub</th><th>Total FTE</th><th>Status</th></tr></thead>
          <tbody>
            {filtered.map((p, i) => {
              const total = ftes[p.id] ?? 0;
              const cls = total > 100 ? 'alloc-over' : total === 100 ? 'alloc-ok' : total > 0 ? 'alloc-partial' : '';
              const status = !p.active
                ? <span className="badge badge--dim">Inactive</span>
                : total > 100
                  ? <span className="badge badge--red">⚠ Over</span>
                  : <span className="badge badge--green">✓</span>;
              return (
                <tr key={p.id} style={{ opacity: p.active ? 1 : 0.5, cursor: 'pointer' }} onClick={() => setSelectedPerson(p.id)}>
                  <td style={{ fontWeight: 500, color: 'var(--white)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div className={`avatar avatar--sm avatar--${avatarColors[i % avatarColors.length]}`}>{getInitials(p.full_name)}</div>
                      {p.full_name}
                    </div>
                  </td>
                  <td style={{ fontSize: 12, color: 'var(--dim)' }}>{p.email || '—'}</td>
                  <td>{p.department || '—'}</td>
                  <td>{p.hub || '—'}</td>
                  <td className={cls}>{total}%</td>
                  <td>{status}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {selectedPersonId && activePI && (
        <PersonDetailPanel personId={selectedPersonId} piId={activePI.id} onClose={() => setSelectedPerson(null)} onRefresh={loadPeople} />
      )}
    </>
  );
}

// ── Person Detail Panel ──
function PersonDetailPanel({ personId, piId, onClose, onRefresh }: { personId: number; piId: number; onClose: () => void; onRefresh: () => void }) {
  const activePI = usePIStore((s) => s.activePI);
  const showModal = useModalStore((s) => s.showModal);
  const [person, setPerson] = useState<Person | null>(null);
  const [allocs, setAllocs] = useState<PersonAllocation[]>([]);
  const [total, setTotal] = useState(0);
  const [piHistory, setPiHistory] = useState<{ pi: ProgramIncrement; total: number; count: number }[]>([]);

  const load = useCallback(async () => {
    const [p, a, t, pis] = await Promise.all([
      api.getPersonById(personId),
      api.getPersonAllocations(personId, piId),
      api.getPersonTotalFTE(personId, piId),
      api.getAllPIs(),
    ]);
    setPerson(p);
    setAllocs(a);
    setTotal(t);
    const hist: { pi: ProgramIncrement; total: number; count: number }[] = [];
    for (const pi of pis) {
      const t = await api.getPersonTotalFTE(personId, pi.id);
      if (t > 0) {
        const allocsInPi = await api.getPersonAllocations(personId, pi.id);
        hist.push({ pi, total: t, count: allocsInPi.length });
      }
    }
    setPiHistory(hist);
  }, [personId, piId]);

  useEffect(() => { load(); }, [load]);

  if (!person || !activePI) return null;

  const initials = getInitials(person.full_name);
  const avatarColor = total > 100 ? 'red' : total === 100 ? 'green' : 'blue';
  const totalCls = total > 100 ? 'alloc-over' : total === 100 ? 'alloc-ok' : 'alloc-partial';

  const handleEdit = () => {
    showModal('Edit Person', <EditPersonForm person={person} onDone={() => { load(); onRefresh(); }} />, null);
  };

  const handleDeactivate = async () => {
    if (allocs.length > 0) {
      showModal('Deactivate Person', <DeactivatePersonDialog
        personName={person.full_name}
        assignmentCount={allocs.length}
        onDeactivateKeep={async () => {
          await api.deactivatePerson(person.id);
          load();
          onRefresh();
        }}
        onDeactivateRemove={async () => {
          await api.deactivatePersonRemoveAssignments(person.id);
          load();
          onRefresh();
        }}
      />, null);
    } else {
      if (!confirm('Deactivate this person?')) return;
      await api.deactivatePerson(person.id);
      load();
      onRefresh();
    }
  };

  const handleEditAlloc = (a: PersonAllocation) => {
    showModal('Edit Allocation', <EditAllocationForm allocation={a} onDone={() => { load(); onRefresh(); }} />, null);
  };

  const handleRemoveAlloc = async (a: PersonAllocation) => {
    if (!confirm(`Remove ${a.role} allocation from ${a.entity}?`)) return;
    if (a.level === 'Team') {
      await api.deleteMembership(a.allocation_id);
    } else {
      const level = a.level === 'ART Leadership' ? 'art' : 'solution';
      await api.deleteLeadership(level, a.allocation_id);
    }
    load();
    onRefresh();
  };

  const handleAddToTeam = () => {
    showModal('Add to Team', <AddToTeamForm personId={person.id} piId={piId} onDone={() => { load(); onRefresh(); }} />, null);
  };

  const handleAddArtLeadership = () => {
    showModal('Add ART Leadership', <AddToLeadershipForm personId={person.id} piId={piId} level="art" onDone={() => { load(); onRefresh(); }} />, null);
  };

  const handleAddSolLeadership = () => {
    showModal('Add Solution Leadership', <AddToLeadershipForm personId={person.id} piId={piId} level="solution" onDone={() => { load(); onRefresh(); }} />, null);
  };

  const handleReactivate = async () => {
    await api.reactivatePerson(person.id);
    load();
    onRefresh();
  };

  return (
    <div className="person-detail-panel">
      <div className="detail-header">
        <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
          <div className={`avatar avatar--lg avatar--${avatarColor}`}>{initials}</div>
          <div>
            <h3>{person.full_name} {!person.active && <span className="badge badge--dim" style={{ fontSize: 11, verticalAlign: 'middle' }}>Inactive</span>}</h3>
            <p>{person.email || 'No email'}</p>
            <div className="detail-sidebar-tags" style={{ marginTop: 6 }}>
              {person.department && <span className="badge badge--dim">{person.department}</span>}
              {person.hub && <span className="badge badge--dim">{person.hub}</span>}
              {person.cost_center && <span className="badge badge--dim">CC: {person.cost_center}</span>}
              {person.company && <span className="badge badge--dim">{person.company}</span>}
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="btn btn-sm btn-outline" onClick={handleEdit}>Edit</button>
          {person.active
            ? <button className="btn btn-sm btn-danger" onClick={handleDeactivate}>Deactivate</button>
            : <button className="btn btn-sm btn-outline" onClick={handleReactivate}>Reactivate</button>
          }
          <button className="icon-btn" onClick={onClose}>
            <svg viewBox="0 0 14 14" fill="none"><path d="M3 3l8 8M11 3L3 11" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" /></svg>
          </button>
        </div>
      </div>
      <div className="detail-section">
        <div className="detail-section__title">
          Allocations in {activePI.pi_name}
          <span className={totalCls} style={{ fontSize: 14 }}>Total: {total}% {total > 100 ? '⚠' : ''}</span>
        </div>
        {allocs.length ? (
          <table className="mini-table"><thead><tr><th>Level</th><th>Entity</th><th>Role</th><th>FTE</th><th></th></tr></thead><tbody>
            {allocs.map((a, i) => (
              <tr key={i}>
                <td>{a.level}</td>
                <td style={{ fontWeight: 500, color: 'var(--white)' }}>{a.entity}</td>
                <td>{a.role}</td>
                <td>
                  <span className="fte-bar"><span className="fte-bar__fill fte-bar__fill--ok" style={{ width: `${a.fte_percent}%` }} /></span>
                  {a.fte_percent}%
                </td>
                <td style={{ whiteSpace: 'nowrap' }}>
                  <button className="icon-btn" title="Edit" onClick={() => handleEditAlloc(a)}>
                    <svg viewBox="0 0 14 14" fill="none"><path d="M10.5 1.5l2 2L4.5 11.5H2.5v-2l8-8z" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  </button>
                  <button className="icon-btn" title="Remove" onClick={() => handleRemoveAlloc(a)}>
                    <svg viewBox="0 0 14 14" fill="none"><path d="M2.5 4h9M5 4V2.5h4V4M3.5 4v7.5h7V4" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  </button>
                </td>
              </tr>
            ))}
          </tbody></table>
        ) : <p style={{ color: 'var(--dim)', fontSize: 13 }}>No allocations in this PI</p>}
        <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
          <button className="btn btn-sm btn-outline" onClick={handleAddToTeam}>+ Add to Team</button>
          <button className="btn btn-sm btn-outline" onClick={handleAddArtLeadership}>+ ART Leadership</button>
          <button className="btn btn-sm btn-outline" onClick={handleAddSolLeadership}>+ Solution Leadership</button>
        </div>
      </div>
      <div className="detail-section">
        <div className="detail-section__title">PI History</div>
        {piHistory.length ? (
          <div className="pi-timeline">
            {piHistory.map(h => (
              <div key={h.pi.id} className={`pi-timeline-item${h.pi.id === piId ? ' active' : ''}`}>
                <div className="pi-timeline-dot" />
                <div className="pi-timeline-content">
                  <div className="pi-timeline-label">
                    {h.pi.pi_name}
                    <span className={`badge badge--${h.pi.status === 'Active' ? 'green' : h.pi.status === 'Planned' ? 'accent' : 'dim'}`} style={{ fontSize: 8, padding: '1px 6px', marginLeft: 4 }}>
                      {h.pi.status}
                    </span>
                  </div>
                  <div className="pi-timeline-detail">
                    <span className={h.total > 100 ? 'alloc-over' : 'alloc-ok'}>{h.total}%</span> across {h.count} assignment{h.count !== 1 ? 's' : ''}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : <p style={{ color: 'var(--dim)', fontSize: 13 }}>No historical data</p>}
      </div>
    </div>
  );
}
