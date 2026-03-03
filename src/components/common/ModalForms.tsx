// © Edmund Wallner
import { useState, useEffect, useRef, useCallback } from 'react';
import { useModalStore } from '@/store/modalStore';
import { usePIStore } from '@/store/piStore';
import * as api from '@/api';
import type { Person, PersonAllocation, ProgramIncrement, Solution, Art, ProductTeam } from '@/types';

// ── Helpers ──
function useRefresh() {
  const loadPIs = usePIStore((s) => s.loadPIs);
  const closeModal = useModalStore((s) => s.closeModal);
  return { loadPIs, closeModal };
}

// ── Add Person ──
export function AddPersonForm({ onDone }: { onDone?: () => void }) {
  const { closeModal } = useRefresh();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [dept, setDept] = useState('');
  const [hub, setHub] = useState('');
  const [cc, setCc] = useState('');
  const [company, setCompany] = useState('');

  const handleSubmit = async () => {
    if (!name.trim()) return alert('Name is required');
    await api.createPerson(
      name,
      email || undefined,
      dept || undefined,
      cc || undefined,
      hub || undefined,
      company || undefined,
    );
    closeModal();
    onDone?.();
  };

  return (
    <>
      <div className="modal-body">
        <div className="form-group">
          <label className="form-label">Full Name *</label>
          <input
            className="form-input"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Max Mustermann"
          />
        </div>
        <div className="form-group">
          <label className="form-label">Email</label>
          <input
            className="form-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="e.g. j.smith@example.com"
          />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <div className="form-group">
            <label className="form-label">Department</label>
            <input
              className="form-input"
              value={dept}
              onChange={(e) => setDept(e.target.value)}
              placeholder="e.g. IT-PLT"
            />
          </div>
          <div className="form-group">
            <label className="form-label">Hub</label>
            <input
              className="form-input"
              value={hub}
              onChange={(e) => setHub(e.target.value)}
              placeholder="e.g. Stuttgart"
            />
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <div className="form-group">
            <label className="form-label">Cost Center</label>
            <input
              className="form-input"
              value={cc}
              onChange={(e) => setCc(e.target.value)}
              placeholder="e.g. CC-4810"
            />
          </div>
          <div className="form-group">
            <label className="form-label">Company</label>
            <input
              className="form-input"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              placeholder="e.g. Acme Corp"
            />
          </div>
        </div>
      </div>
      <div className="modal-actions">
        <button className="btn btn-outline" onClick={closeModal}>
          Cancel
        </button>
        <button className="btn btn-primary" onClick={handleSubmit}>
          Create Person
        </button>
      </div>
    </>
  );
}

// ── Edit Person ──
export function EditPersonForm({ person, onDone }: { person: Person; onDone?: () => void }) {
  const { closeModal } = useRefresh();
  const [name, setName] = useState(person.full_name);
  const [email, setEmail] = useState(person.email || '');
  const [dept, setDept] = useState(person.department || '');
  const [hub, setHub] = useState(person.hub || '');
  const [cc, setCc] = useState(person.cost_center || '');
  const [company, setCompany] = useState(person.company || '');

  const handleSubmit = async () => {
    await api.updatePerson(
      person.id,
      name,
      email || undefined,
      dept || undefined,
      cc || undefined,
      hub || undefined,
      company || undefined,
    );
    closeModal();
    onDone?.();
  };

  return (
    <>
      <div className="modal-body">
        <div className="form-group">
          <label className="form-label">Full Name *</label>
          <input className="form-input" value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div className="form-group">
          <label className="form-label">Email</label>
          <input className="form-input" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <div className="form-group">
            <label className="form-label">Department</label>
            <input className="form-input" value={dept} onChange={(e) => setDept(e.target.value)} />
          </div>
          <div className="form-group">
            <label className="form-label">Hub</label>
            <input className="form-input" value={hub} onChange={(e) => setHub(e.target.value)} />
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <div className="form-group">
            <label className="form-label">Cost Center</label>
            <input className="form-input" value={cc} onChange={(e) => setCc(e.target.value)} />
          </div>
          <div className="form-group">
            <label className="form-label">Company</label>
            <input className="form-input" value={company} onChange={(e) => setCompany(e.target.value)} />
          </div>
        </div>
      </div>
      <div className="modal-actions">
        <button className="btn btn-outline" onClick={closeModal}>
          Cancel
        </button>
        <button className="btn btn-primary" onClick={handleSubmit}>
          Save
        </button>
      </div>
    </>
  );
}

// ── Add Solution ──
export function AddSolutionForm({ onDone }: { onDone?: () => void }) {
  const { closeModal } = useRefresh();
  const [name, setName] = useState('');
  const [desc, setDesc] = useState('');

  const handleSubmit = async () => {
    if (!name.trim()) return alert('Name is required');
    await api.createSolution(name, desc || undefined);
    closeModal();
    onDone?.();
  };

  return (
    <>
      <div className="modal-body">
        <div className="form-group">
          <label className="form-label">Solution Name *</label>
          <input
            className="form-input"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Cloud Platform"
          />
        </div>
        <div className="form-group">
          <label className="form-label">Description</label>
          <input
            className="form-input"
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            placeholder="Brief description"
          />
        </div>
      </div>
      <div className="modal-actions">
        <button className="btn btn-outline" onClick={closeModal}>
          Cancel
        </button>
        <button className="btn btn-primary" onClick={handleSubmit}>
          Create
        </button>
      </div>
    </>
  );
}

// ── Add ART ──
export function AddARTForm({ solutionId, onDone }: { solutionId?: number; onDone?: () => void }) {
  const { closeModal } = useRefresh();
  const [name, setName] = useState('');
  const [solutions, setSolutions] = useState<Solution[]>([]);
  const [selSolId, setSelSolId] = useState<number | null>(solutionId ?? null);

  useEffect(() => {
    if (solutionId === undefined) api.getSolutions().then(setSolutions);
  }, [solutionId]);

  const handleSubmit = async () => {
    if (!name.trim()) return alert('Name is required');
    await api.createArt(selSolId, name);
    closeModal();
    onDone?.();
  };

  return (
    <>
      <div className="modal-body">
        <div className="form-group">
          <label className="form-label">ART Name *</label>
          <input
            className="form-input"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Platform ART"
          />
        </div>
        {solutionId === undefined && (
          <div className="form-group">
            <label className="form-label">Parent Solution</label>
            <select
              className="form-select"
              value={selSolId ?? ''}
              onChange={(e) => setSelSolId(e.target.value ? parseInt(e.target.value) : null)}
            >
              <option value="">None (Standalone)</option>
              {solutions.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>
      <div className="modal-actions">
        <button className="btn btn-outline" onClick={closeModal}>
          Cancel
        </button>
        <button className="btn btn-primary" onClick={handleSubmit}>
          Create
        </button>
      </div>
    </>
  );
}

// ── Add Team ──
export function AddTeamForm({ artId, onDone }: { artId?: number; onDone?: () => void }) {
  const { closeModal } = useRefresh();
  const [name, setName] = useState('');
  const [arts, setAllArts] = useState<Art[]>([]);
  const [selArtId, setSelArtId] = useState<number | null>(artId ?? null);

  useEffect(() => {
    if (artId === undefined) api.getArts().then(setAllArts);
  }, [artId]);

  const handleSubmit = async () => {
    if (!name.trim()) return alert('Name is required');
    await api.createTeam(selArtId, name);
    closeModal();
    onDone?.();
  };

  return (
    <>
      <div className="modal-body">
        <div className="form-group">
          <label className="form-label">Team Name *</label>
          <input
            className="form-input"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Team Alpha"
          />
        </div>
        {artId === undefined && (
          <div className="form-group">
            <label className="form-label">Parent ART</label>
            <select
              className="form-select"
              value={selArtId ?? ''}
              onChange={(e) => setSelArtId(e.target.value ? parseInt(e.target.value) : null)}
            >
              <option value="">None (Standalone)</option>
              {arts.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.name}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>
      <div className="modal-actions">
        <button className="btn btn-outline" onClick={closeModal}>
          Cancel
        </button>
        <button className="btn btn-primary" onClick={handleSubmit}>
          Create
        </button>
      </div>
    </>
  );
}

// ── Edit Solution ──
export function EditSolutionForm({ solution, onDone }: { solution: Solution; onDone?: () => void }) {
  const { closeModal } = useRefresh();
  const [name, setName] = useState(solution.name);
  const [desc, setDesc] = useState(solution.description || '');

  const handleSubmit = async () => {
    if (!name.trim()) return alert('Name is required');
    await api.updateSolution(solution.id, name, desc || undefined);
    closeModal();
    onDone?.();
  };

  return (
    <>
      <div className="modal-body">
        <div className="form-group">
          <label className="form-label">Solution Name *</label>
          <input className="form-input" value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div className="form-group">
          <label className="form-label">Description</label>
          <input className="form-input" value={desc} onChange={(e) => setDesc(e.target.value)} />
        </div>
      </div>
      <div className="modal-actions">
        <button className="btn btn-outline" onClick={closeModal}>
          Cancel
        </button>
        <button className="btn btn-primary" onClick={handleSubmit}>
          Save
        </button>
      </div>
    </>
  );
}

// ── Edit ART ──
export function EditARTForm({ art, onDone }: { art: Art; onDone?: () => void }) {
  const { closeModal } = useRefresh();
  const [name, setName] = useState(art.name);
  const [solutions, setSolutions] = useState<Solution[]>([]);
  const [solId, setSolId] = useState<number | null>(art.solution_id);

  useEffect(() => {
    api.getSolutions().then(setSolutions);
  }, []);

  const handleSubmit = async () => {
    if (!name.trim()) return alert('Name is required');
    await api.updateArt(art.id, name, solId);
    closeModal();
    onDone?.();
  };

  return (
    <>
      <div className="modal-body">
        <div className="form-group">
          <label className="form-label">ART Name *</label>
          <input className="form-input" value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div className="form-group">
          <label className="form-label">Parent Solution</label>
          <select
            className="form-select"
            value={solId ?? ''}
            onChange={(e) => setSolId(e.target.value ? parseInt(e.target.value) : null)}
          >
            <option value="">None (Standalone)</option>
            {solutions.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="modal-actions">
        <button className="btn btn-outline" onClick={closeModal}>
          Cancel
        </button>
        <button className="btn btn-primary" onClick={handleSubmit}>
          Save
        </button>
      </div>
    </>
  );
}

// ── Edit Team ──
export function EditTeamForm({ team, onDone }: { team: ProductTeam; onDone?: () => void }) {
  const { closeModal } = useRefresh();
  const [name, setName] = useState(team.name);
  const [arts, setAllArts] = useState<Art[]>([]);
  const [artId, setArtId] = useState<number | null>(team.art_id);

  useEffect(() => {
    api.getArts().then(setAllArts);
  }, []);

  const handleSubmit = async () => {
    if (!name.trim()) return alert('Name is required');
    await api.updateTeam(team.id, name, artId);
    closeModal();
    onDone?.();
  };

  return (
    <>
      <div className="modal-body">
        <div className="form-group">
          <label className="form-label">Team Name *</label>
          <input className="form-input" value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div className="form-group">
          <label className="form-label">Parent ART</label>
          <select
            className="form-select"
            value={artId ?? ''}
            onChange={(e) => setArtId(e.target.value ? parseInt(e.target.value) : null)}
          >
            <option value="">None (Standalone)</option>
            {arts.map((a) => (
              <option key={a.id} value={a.id}>
                {a.name}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="modal-actions">
        <button className="btn btn-outline" onClick={closeModal}>
          Cancel
        </button>
        <button className="btn btn-primary" onClick={handleSubmit}>
          Save
        </button>
      </div>
    </>
  );
}

// ── Add Member ──
export function AddMemberForm({ teamId, onDone }: { teamId: number; onDone?: () => void }) {
  const { closeModal } = useRefresh();
  const activePI = usePIStore((s) => s.activePI);
  const [people, setPeople] = useState<Person[]>([]);
  const [search, setSearch] = useState('');
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [selectedFTE, setSelectedFTE] = useState(0);
  const [role, setRole] = useState('Dev');
  const [fte, setFte] = useState(100);
  const [showDropdown, setShowDropdown] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    api.getPeople(true).then(setPeople);
  }, []);

  const matches = search.trim()
    ? people
        .filter(
          (p) =>
            p.full_name.toLowerCase().includes(search.toLowerCase()) ||
            (p.email || '').toLowerCase().includes(search.toLowerCase()),
        )
        .slice(0, 8)
    : [];

  const selectPerson = useCallback(
    async (p: Person) => {
      setSelectedId(p.id);
      setSearch(p.full_name);
      setShowDropdown(false);
      if (activePI) {
        const t = await api.getPersonTotalFTE(p.id, activePI.id);
        setSelectedFTE(t);
      }
    },
    [activePI],
  );

  const newTotal = selectedFTE + fte;
  const totalClass = newTotal > 100 ? 'new-total--over' : newTotal > 80 ? 'new-total--warn' : 'new-total--ok';

  const handleSubmit = async () => {
    if (!selectedId) return alert('Select a person');
    if (!activePI) return;
    await api.createMembership(teamId, selectedId, role, fte, activePI.id);
    closeModal();
    onDone?.();
  };

  return (
    <>
      <div className="modal-body">
        <div className="form-group">
          <label className="form-label">Search Person *</label>
          <div className="member-search-wrap">
            <svg className="member-search-icon" viewBox="0 0 16 16" fill="none">
              <circle cx="7" cy="7" r="5" stroke="currentColor" strokeWidth="1.2" />
              <path d="M11 11l3.5 3.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
            </svg>
            <input
              ref={searchRef}
              className="member-search-input"
              placeholder="Type to search people…"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setShowDropdown(true);
              }}
              autoComplete="off"
            />
            {showDropdown && search.trim() && (
              <div className="member-dropdown" style={{ display: 'block' }}>
                {matches.length === 0 ? (
                  <div style={{ padding: 12, color: 'var(--dim)', fontSize: 12 }}>No matches</div>
                ) : (
                  matches.map((p) => {
                    const initials = p.full_name
                      .split(' ')
                      .map((n) => n[0])
                      .join('')
                      .substring(0, 2);
                    return (
                      <div key={p.id} className="member-dropdown-item" onClick={() => selectPerson(p)}>
                        <div className="avatar avatar--sm avatar--blue">{initials}</div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--white)' }}>{p.full_name}</div>
                          <div style={{ fontSize: 11, color: 'var(--dim)' }}>
                            {p.department || ''} · {p.hub || ''}
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            )}
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <div className="form-group">
            <label className="form-label">Role *</label>
            <select className="form-select" value={role} onChange={(e) => setRole(e.target.value)}>
              <option>PO</option>
              <option>SM</option>
              <option>Dev</option>
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">FTE %</label>
            <input
              className="form-input"
              type="number"
              value={fte}
              min={1}
              max={100}
              onChange={(e) => setFte(parseInt(e.target.value) || 0)}
            />
          </div>
        </div>
        {selectedId && (
          <div className={`new-total ${totalClass}`}>
            <span>New Total Allocation</span>
            <span style={{ fontWeight: 700, fontSize: 16 }}>
              {newTotal}% {newTotal > 100 ? '⚠' : ''}
            </span>
          </div>
        )}
      </div>
      <div className="modal-actions">
        <button className="btn btn-outline" onClick={closeModal}>
          Cancel
        </button>
        <button className="btn btn-primary" onClick={handleSubmit}>
          Add Member
        </button>
      </div>
    </>
  );
}

// ── Add Leadership ──
export function AddLeadershipForm({
  level,
  entityId,
  onDone,
}: {
  level: 'solution' | 'art';
  entityId: number;
  onDone?: () => void;
}) {
  const { closeModal } = useRefresh();
  const activePI = usePIStore((s) => s.activePI);
  const [people, setPeople] = useState<Person[]>([]);
  const [personId, setPersonId] = useState<number | null>(null);
  const [role, setRole] = useState('');
  const [fte, setFte] = useState(100);

  const roles =
    level === 'solution'
      ? ['Solution Manager', 'Solution Architect', 'STE', 'Solution Business Owner']
      : ['Product Manager', 'System Architect', 'RTE', 'Business Owner'];

  useEffect(() => {
    api.getPeople(true).then(setPeople);
    setRole(roles[0]);
  }, []);

  const handleSubmit = async () => {
    if (!personId || !activePI) return alert('Select a person');
    await api.createLeadership(level, entityId, personId, role, fte, activePI.id);
    closeModal();
    onDone?.();
  };

  return (
    <>
      <div className="modal-body">
        <div className="form-group">
          <label className="form-label">Person *</label>
          <select
            className="form-select"
            value={personId ?? ''}
            onChange={(e) => setPersonId(parseInt(e.target.value))}
          >
            <option value="">Select person…</option>
            {people.map((p) => (
              <option key={p.id} value={p.id}>
                {p.full_name}
              </option>
            ))}
          </select>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <div className="form-group">
            <label className="form-label">Role *</label>
            <select className="form-select" value={role} onChange={(e) => setRole(e.target.value)}>
              {roles.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">FTE %</label>
            <input
              className="form-input"
              type="number"
              value={fte}
              min={1}
              max={100}
              onChange={(e) => setFte(parseInt(e.target.value) || 0)}
            />
          </div>
        </div>
      </div>
      <div className="modal-actions">
        <button className="btn btn-outline" onClick={closeModal}>
          Cancel
        </button>
        <button className="btn btn-primary" onClick={handleSubmit}>
          Add
        </button>
      </div>
    </>
  );
}

// ── Add PI ──
export function AddPIForm({ onDone }: { onDone?: () => void }) {
  const { closeModal, loadPIs } = useRefresh();
  const [name, setName] = useState('');
  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');

  const handleSubmit = async () => {
    if (!name.trim() || !start || !end) return alert('All fields are required');
    await api.createPI(name, start, end);
    await loadPIs();
    closeModal();
    onDone?.();
  };

  return (
    <>
      <div className="modal-body">
        <div className="form-group">
          <label className="form-label">PI Name *</label>
          <input
            className="form-input"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. PI 25.3"
          />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <div className="form-group">
            <label className="form-label">Start Date *</label>
            <input className="form-input" type="date" value={start} onChange={(e) => setStart(e.target.value)} />
          </div>
          <div className="form-group">
            <label className="form-label">End Date *</label>
            <input className="form-input" type="date" value={end} onChange={(e) => setEnd(e.target.value)} />
          </div>
        </div>
      </div>
      <div className="modal-actions">
        <button className="btn btn-outline" onClick={closeModal}>
          Cancel
        </button>
        <button className="btn btn-primary" onClick={handleSubmit}>
          Create PI
        </button>
      </div>
    </>
  );
}

// ── Edit Allocation ──
export function EditAllocationForm({ allocation, onDone }: { allocation: PersonAllocation; onDone?: () => void }) {
  const { closeModal } = useRefresh();
  const roleOptions =
    allocation.level === 'Team'
      ? ['PO', 'SM', 'Dev']
      : allocation.level === 'ART Leadership'
        ? ['Product Manager', 'System Architect', 'RTE', 'Business Owner']
        : ['Solution Manager', 'Solution Architect', 'STE', 'Solution Business Owner'];
  const [role, setRole] = useState(allocation.role);
  const [fte, setFte] = useState(allocation.fte_percent);

  const handleSubmit = async () => {
    if (allocation.level === 'Team') {
      await api.updateMembership(allocation.allocation_id, role, fte);
    } else {
      const level = allocation.level === 'ART Leadership' ? 'art' : 'solution';
      await api.updateLeadership(level, allocation.allocation_id, role, fte);
    }
    closeModal();
    onDone?.();
  };

  return (
    <>
      <div className="modal-body">
        <div className="form-group">
          <label className="form-label">Entity</label>
          <input className="form-input" value={`${allocation.entity} (${allocation.level})`} disabled />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <div className="form-group">
            <label className="form-label">Role *</label>
            <select className="form-select" value={role} onChange={(e) => setRole(e.target.value)}>
              {roleOptions.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">FTE %</label>
            <input
              className="form-input"
              type="number"
              value={fte}
              min={1}
              max={100}
              onChange={(e) => setFte(parseInt(e.target.value) || 0)}
            />
          </div>
        </div>
      </div>
      <div className="modal-actions">
        <button className="btn btn-outline" onClick={closeModal}>
          Cancel
        </button>
        <button className="btn btn-primary" onClick={handleSubmit}>
          Save
        </button>
      </div>
    </>
  );
}

// ── Add to Team (from People pane) ──
export function AddToTeamForm({ personId, piId, onDone }: { personId: number; piId: number; onDone?: () => void }) {
  const { closeModal } = useRefresh();
  const [allTeams, setAllTeams] = useState<ProductTeam[]>([]);
  const [allArts, setAllArts] = useState<Art[]>([]);
  const [solutions, setSolutions] = useState<Solution[]>([]);
  const [teamId, setTeamId] = useState<number | null>(null);
  const [role, setRole] = useState('Dev');
  const [fte, setFte] = useState(100);

  useEffect(() => {
    Promise.all([api.getTeams(), api.getArts(), api.getSolutions()]).then(([t, a, s]) => {
      setAllTeams(t);
      setAllArts(a);
      setSolutions(s);
    });
  }, []);

  const getTeamLabel = (t: ProductTeam) => {
    if (!t.art_id) return `${t.name} (Standalone)`;
    const art = allArts.find((a) => a.id === t.art_id);
    if (!art) return t.name;
    const sol = art.solution_id ? solutions.find((s) => s.id === art.solution_id) : null;
    return sol ? `${t.name} (${art.name} / ${sol.name})` : `${t.name} (${art.name})`;
  };

  const handleSubmit = async () => {
    if (!teamId) return alert('Select a team');
    await api.createMembership(teamId, personId, role, fte, piId);
    closeModal();
    onDone?.();
  };

  return (
    <>
      <div className="modal-body">
        <div className="form-group">
          <label className="form-label">Team *</label>
          <select
            className="form-select"
            value={teamId ?? ''}
            onChange={(e) => setTeamId(parseInt(e.target.value) || null)}
          >
            <option value="">Select team…</option>
            {allTeams.map((t) => (
              <option key={t.id} value={t.id}>
                {getTeamLabel(t)}
              </option>
            ))}
          </select>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <div className="form-group">
            <label className="form-label">Role *</label>
            <select className="form-select" value={role} onChange={(e) => setRole(e.target.value)}>
              <option>PO</option>
              <option>SM</option>
              <option>Dev</option>
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">FTE %</label>
            <input
              className="form-input"
              type="number"
              value={fte}
              min={1}
              max={100}
              onChange={(e) => setFte(parseInt(e.target.value) || 0)}
            />
          </div>
        </div>
      </div>
      <div className="modal-actions">
        <button className="btn btn-outline" onClick={closeModal}>
          Cancel
        </button>
        <button className="btn btn-primary" onClick={handleSubmit}>
          Add to Team
        </button>
      </div>
    </>
  );
}

// ── Add to Leadership (from People pane) ──
export function AddToLeadershipForm({
  personId,
  piId,
  level,
  onDone,
}: {
  personId: number;
  piId: number;
  level: 'art' | 'solution';
  onDone?: () => void;
}) {
  const { closeModal } = useRefresh();
  const [solutions, setSolutions] = useState<Solution[]>([]);
  const [arts, setArts] = useState<Art[]>([]);
  const [solId, setSolId] = useState<number | null>(null);
  const [artId, setArtId] = useState<number | null>(null);

  const roles =
    level === 'solution'
      ? ['Solution Manager', 'Solution Architect', 'STE', 'Solution Business Owner']
      : ['Product Manager', 'System Architect', 'RTE', 'Business Owner'];
  const [role, setRole] = useState(roles[0]);
  const [fte, setFte] = useState(100);

  useEffect(() => {
    api.getSolutions().then(setSolutions);
    if (level === 'art') api.getArts().then(setArts);
  }, [level]);

  const getArtLabel = (a: Art) => {
    if (!a.solution_id) return `${a.name} (Standalone)`;
    const sol = solutions.find((s) => s.id === a.solution_id);
    return sol ? `${a.name} (${sol.name})` : a.name;
  };

  const handleSubmit = async () => {
    const entityId = level === 'solution' ? solId : artId;
    if (!entityId) return alert(`Select ${level === 'solution' ? 'a solution' : 'an ART'}`);
    await api.createLeadership(level, entityId, personId, role, fte, piId);
    closeModal();
    onDone?.();
  };

  return (
    <>
      <div className="modal-body">
        {level === 'solution' ? (
          <div className="form-group">
            <label className="form-label">Solution *</label>
            <select
              className="form-select"
              value={solId ?? ''}
              onChange={(e) => setSolId(parseInt(e.target.value) || null)}
            >
              <option value="">Select solution…</option>
              {solutions.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>
        ) : (
          <div className="form-group">
            <label className="form-label">ART *</label>
            <select
              className="form-select"
              value={artId ?? ''}
              onChange={(e) => setArtId(parseInt(e.target.value) || null)}
            >
              <option value="">Select ART…</option>
              {arts.map((a) => (
                <option key={a.id} value={a.id}>
                  {getArtLabel(a)}
                </option>
              ))}
            </select>
          </div>
        )}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <div className="form-group">
            <label className="form-label">Role *</label>
            <select className="form-select" value={role} onChange={(e) => setRole(e.target.value)}>
              {roles.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">FTE %</label>
            <input
              className="form-input"
              type="number"
              value={fte}
              min={1}
              max={100}
              onChange={(e) => setFte(parseInt(e.target.value) || 0)}
            />
          </div>
        </div>
      </div>
      <div className="modal-actions">
        <button className="btn btn-outline" onClick={closeModal}>
          Cancel
        </button>
        <button className="btn btn-primary" onClick={handleSubmit}>
          Add
        </button>
      </div>
    </>
  );
}

// ── Deactivate Person Dialog ──
export function DeactivatePersonDialog({
  personName,
  assignmentCount,
  onDeactivateKeep,
  onDeactivateRemove,
}: {
  personName: string;
  assignmentCount: number;
  onDeactivateKeep: () => void;
  onDeactivateRemove: () => void;
}) {
  const { closeModal } = useRefresh();
  return (
    <>
      <div className="modal-body">
        <p style={{ color: 'var(--amber)', fontWeight: 500, marginBottom: 8 }}>
          {personName} has {assignmentCount} active assignment{assignmentCount !== 1 ? 's' : ''}
        </p>
        <p style={{ color: 'var(--dim)', fontSize: 13 }}>
          Choose how to handle existing allocations when deactivating this person.
        </p>
      </div>
      <div className="modal-actions" style={{ flexDirection: 'column', gap: 8 }}>
        <button
          className="btn btn-primary"
          style={{ width: '100%' }}
          onClick={() => {
            closeModal();
            onDeactivateKeep();
          }}
        >
          Deactivate &amp; Keep Assignments
        </button>
        <button
          className="btn btn-danger"
          style={{ width: '100%' }}
          onClick={() => {
            closeModal();
            onDeactivateRemove();
          }}
        >
          Deactivate &amp; Remove All
        </button>
        <button className="btn btn-outline" style={{ width: '100%' }} onClick={closeModal}>
          Cancel
        </button>
      </div>
    </>
  );
}

// ── Edit PI ──
export function EditPIForm({ pi, onDone }: { pi: ProgramIncrement; onDone?: () => void }) {
  const { closeModal, loadPIs } = useRefresh();
  const [name, setName] = useState(pi.pi_name);
  const [start, setStart] = useState(pi.start_date);
  const [end, setEnd] = useState(pi.end_date);
  const [status, setStatus] = useState<string>(pi.status);

  const handleSubmit = async () => {
    if (!name.trim()) return alert('PI name is required');
    if (!start || !end) return alert('Dates are required');
    await api.updatePI(pi.id, name, start, end, status);
    await loadPIs();
    closeModal();
    onDone?.();
  };

  return (
    <>
      <div className="modal-body">
        <div className="form-group">
          <label className="form-label">PI Name *</label>
          <input className="form-input" value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <div className="form-group">
            <label className="form-label">Start Date *</label>
            <input className="form-input" type="date" value={start} onChange={(e) => setStart(e.target.value)} />
          </div>
          <div className="form-group">
            <label className="form-label">End Date *</label>
            <input className="form-input" type="date" value={end} onChange={(e) => setEnd(e.target.value)} />
          </div>
        </div>
        <div className="form-group">
          <label className="form-label">Status</label>
          <select className="form-select" value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="Planned">Planned</option>
            <option value="Active">Active</option>
            <option value="Completed">Completed</option>
          </select>
        </div>
      </div>
      <div className="modal-actions">
        <button className="btn btn-outline" onClick={closeModal}>
          Cancel
        </button>
        <button className="btn btn-primary" onClick={handleSubmit}>
          Save
        </button>
      </div>
    </>
  );
}
