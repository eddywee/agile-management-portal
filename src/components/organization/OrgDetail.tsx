// © Edmund Wallner - Mercedes-Benz AG
import { useEffect, useState, useCallback } from 'react';
import { usePIStore } from '../../store/piStore';
import { useOrgStore } from '../../store/orgStore';
import { useModalStore } from '../../store/modalStore';
import * as api from '../../api';
import type { Solution, Art, ProductTeam, LeadershipWithPerson, MembershipWithPerson } from '../../types';
import { AddLeadershipForm, AddMemberForm, AddTeamForm, EditSolutionForm, EditARTForm, EditTeamForm } from '../common/ModalForms';

export function OrgDetail({ onRefreshRequest }: { onRefreshRequest: () => void }) {
  const selectedNode = useOrgStore((s) => s.selectedNode);

  if (!selectedNode) {
    return (
      <div className="org-detail-panel">
        <div className="empty-state">
          <svg viewBox="0 0 48 48" fill="none">
            <path d="M24 4L4 14v20l20 10 20-10V14L24 4z" stroke="currentColor" strokeWidth="1.5" />
          </svg>
          <p>Select an item from the tree to view its details</p>
        </div>
      </div>
    );
  }

  return (
    <div className="org-detail-panel">
      {selectedNode.type === 'solution' && <SolutionDetail id={selectedNode.id} onRefresh={onRefreshRequest} />}
      {selectedNode.type === 'art' && <ArtDetail id={selectedNode.id} onRefresh={onRefreshRequest} />}
      {selectedNode.type === 'team' && <TeamDetail id={selectedNode.id} onRefresh={onRefreshRequest} />}
    </div>
  );
}

const pencilIcon = (
  <svg viewBox="0 0 14 14" fill="none" style={{ width: 14, height: 14 }}>
    <path d="M10 2l2 2-7 7H3V9l7-7z" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
const trashIcon = (
  <svg viewBox="0 0 14 14" fill="none" style={{ width: 14, height: 14 }}>
    <path d="M3 4h8M5 4V3h4v1M4.5 4v7a.5.5 0 00.5.5h4a.5.5 0 00.5-.5V4" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" />
  </svg>
);

function SolutionDetail({ id, onRefresh }: { id: number; onRefresh: () => void }) {
  const activePI = usePIStore((s) => s.activePI);
  const selectNode = useOrgStore((s) => s.selectNode);
  const showModal = useModalStore((s) => s.showModal);
  const [sol, setSol] = useState<Solution | null>(null);
  const [arts, setArts] = useState<Art[]>([]);
  const [leadership, setLeadership] = useState<LeadershipWithPerson[]>([]);
  const [totalFTE, setTotalFTE] = useState(0);
  const [artFTEs, setArtFTEs] = useState<Record<number, number>>({});
  const [artTeamCounts, setArtTeamCounts] = useState<Record<number, number>>({});

  const load = useCallback(async () => {
    if (!activePI) return;
    const [sols, artList, lead, fte] = await Promise.all([
      api.getSolutions(),
      api.getArts(id),
      api.getSolutionLeadership(id, activePI.id),
      api.getSolutionFTE(id, activePI.id),
    ]);
    setSol(sols.find(s => s.id === id) || null);
    setArts(artList);
    setLeadership(lead);
    setTotalFTE(fte);
    const ftes: Record<number, number> = {};
    const counts: Record<number, number> = {};
    for (const a of artList) {
      ftes[a.id] = await api.getArtFTE(a.id, activePI.id);
      counts[a.id] = (await api.getTeams(a.id)).length;
    }
    setArtFTEs(ftes);
    setArtTeamCounts(counts);
  }, [id, activePI]);

  useEffect(() => { load(); }, [load]);

  const handleRemoveLeadership = async (leadId: number) => {
    if (!confirm('Remove this leader?')) return;
    await api.deleteLeadership('solution', leadId);
    load();
    onRefresh();
  };

  const handleEdit = () => {
    if (!sol) return;
    showModal('Edit Solution', <EditSolutionForm solution={sol} onDone={() => { load(); onRefresh(); }} />, null);
  };

  const handleDelete = async () => {
    if (!sol) return;
    if (!confirm(`Delete solution "${sol.name}"? Its ARTs will become standalone.`)) return;
    await api.deleteSolution(sol.id);
    selectNode(null);
    onRefresh();
  };

  if (!sol || !activePI) return null;

  return (
    <>
      <div className="detail-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <h3>{sol.name}</h3>
            <button className="icon-btn icon-btn--dim" onClick={handleEdit} title="Edit">{pencilIcon}</button>
            <button className="icon-btn icon-btn--red" onClick={handleDelete} title="Delete">{trashIcon}</button>
          </div>
          <p>{sol.description || 'No description'}</p>
        </div>
        <div className="detail-fte"><div className="detail-fte__number">{totalFTE.toFixed(1)}</div><div className="detail-fte__label">Total FTE</div></div>
      </div>
      <div className="detail-section">
        <div className="detail-section__title">
          Solution Leadership ({activePI.pi_name})
          <button className="btn btn-sm btn-primary" onClick={() => showModal(`Add Solution Leader`, <AddLeadershipForm level="solution" entityId={id} onDone={() => { load(); onRefresh(); }} />, null)}>
            <svg viewBox="0 0 12 12" fill="none"><path d="M6 1v10M1 6h10" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" /></svg> Add
          </button>
        </div>
        {leadership.length ? (
          <table className="mini-table"><thead><tr><th>Role</th><th>Person</th><th>FTE</th><th></th></tr></thead><tbody>
            {leadership.map(l => (
              <tr key={l.id}>
                <td>{l.role}</td>
                <td style={{ fontWeight: 500, color: 'var(--white)' }}>{l.full_name}</td>
                <td>{l.fte_percent}%</td>
                <td><button className="icon-btn icon-btn--red" onClick={() => handleRemoveLeadership(l.id)}>
                  <svg viewBox="0 0 14 14" fill="none"><path d="M3 4h8M5 4V3h4v1M4.5 4v7a.5.5 0 00.5.5h4a.5.5 0 00.5-.5V4" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" /></svg>
                </button></td>
              </tr>
            ))}
          </tbody></table>
        ) : <p style={{ color: 'var(--dim)', fontSize: 13 }}>No leadership assigned for this PI</p>}
      </div>
      <div className="detail-section">
        <div className="detail-section__title">ARTs ({arts.length})</div>
        {arts.length ? (
          <table className="mini-table"><thead><tr><th>ART</th><th>FTE</th><th>Teams</th></tr></thead><tbody>
            {arts.map(a => (
              <tr key={a.id} onClick={() => selectNode({ type: 'art', id: a.id })} style={{ cursor: 'pointer' }}>
                <td style={{ fontWeight: 500, color: 'var(--white)' }}>{a.name}</td>
                <td>{(artFTEs[a.id] ?? 0).toFixed(1)}</td>
                <td>{artTeamCounts[a.id] ?? 0}</td>
              </tr>
            ))}
          </tbody></table>
        ) : <p style={{ color: 'var(--dim)', fontSize: 13 }}>No ARTs yet</p>}
      </div>
    </>
  );
}

function ArtDetail({ id, onRefresh }: { id: number; onRefresh: () => void }) {
  const activePI = usePIStore((s) => s.activePI);
  const selectNode = useOrgStore((s) => s.selectNode);
  const showModal = useModalStore((s) => s.showModal);
  const [artObj, setArtObj] = useState<Art | null>(null);
  const [solName, setSolName] = useState<string | null>(null);
  const [teams, setTeams] = useState<ProductTeam[]>([]);
  const [leadership, setLeadership] = useState<LeadershipWithPerson[]>([]);
  const [totalFTE, setTotalFTE] = useState(0);
  const [teamData, setTeamData] = useState<Record<number, { fte: number; members: number; hasConflict: boolean }>>({});

  const load = useCallback(async () => {
    if (!activePI) return;
    const [allArts, teamList, lead, fte] = await Promise.all([
      api.getArts(),
      api.getTeams(id),
      api.getArtLeadership(id, activePI.id),
      api.getArtFTE(id, activePI.id),
    ]);
    const art = allArts.find(a => a.id === id) || null;
    setArtObj(art);
    if (art?.solution_id) {
      const sols = await api.getSolutions();
      setSolName(sols.find(s => s.id === art.solution_id)?.name || null);
    } else {
      setSolName(null);
    }
    setTeams(teamList);
    setLeadership(lead);
    setTotalFTE(fte);
    const td: Record<number, { fte: number; members: number; hasConflict: boolean }> = {};
    for (const t of teamList) {
      const members = await api.getTeamMembers(t.id, activePI.id);
      const tFte = await api.getTeamFTE(t.id, activePI.id);
      let hasConflict = false;
      for (const m of members) {
        const pFte = await api.getPersonTotalFTE(m.person_id, activePI.id);
        if (pFte > 100) { hasConflict = true; break; }
      }
      td[t.id] = { fte: tFte, members: members.length, hasConflict };
    }
    setTeamData(td);
  }, [id, activePI]);

  useEffect(() => { load(); }, [load]);

  const handleRemoveLeadership = async (leadId: number) => {
    if (!confirm('Remove this leader?')) return;
    await api.deleteLeadership('art', leadId);
    load();
    onRefresh();
  };

  const handleEdit = () => {
    if (!artObj) return;
    showModal('Edit ART', <EditARTForm art={artObj} onDone={() => { load(); onRefresh(); }} />, null);
  };

  const handleDelete = async () => {
    if (!artObj) return;
    if (!confirm(`Delete ART "${artObj.name}"? Its teams will become standalone.`)) return;
    await api.deleteArt(artObj.id);
    selectNode(null);
    onRefresh();
  };

  if (!artObj || !activePI) return null;

  const breadcrumb = solName ? `${solName} → ${artObj.name}` : `Standalone → ${artObj.name}`;

  return (
    <>
      <div className="detail-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <h3>{artObj.name}</h3>
            <button className="icon-btn icon-btn--dim" onClick={handleEdit} title="Edit">{pencilIcon}</button>
            <button className="icon-btn icon-btn--red" onClick={handleDelete} title="Delete">{trashIcon}</button>
          </div>
          <p>{breadcrumb}</p>
        </div>
        <div className="detail-fte"><div className="detail-fte__number">{totalFTE.toFixed(1)}</div><div className="detail-fte__label">Total FTE</div></div>
      </div>
      <div className="detail-section">
        <div className="detail-section__title">
          ART Leadership ({activePI.pi_name})
          <button className="btn btn-sm btn-primary" onClick={() => showModal('Add ART Leader', <AddLeadershipForm level="art" entityId={id} onDone={() => { load(); onRefresh(); }} />, null)}>
            <svg viewBox="0 0 12 12" fill="none"><path d="M6 1v10M1 6h10" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" /></svg> Add
          </button>
        </div>
        {leadership.length ? (
          <table className="mini-table"><thead><tr><th>Role</th><th>Person</th><th>FTE</th><th></th></tr></thead><tbody>
            {leadership.map(l => (
              <tr key={l.id}>
                <td>{l.role}</td>
                <td style={{ fontWeight: 500, color: 'var(--white)' }}>{l.full_name}</td>
                <td>{l.fte_percent}%</td>
                <td><button className="icon-btn icon-btn--red" onClick={() => handleRemoveLeadership(l.id)}>
                  <svg viewBox="0 0 14 14" fill="none"><path d="M3 4h8M5 4V3h4v1M4.5 4v7a.5.5 0 00.5.5h4a.5.5 0 00.5-.5V4" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" /></svg>
                </button></td>
              </tr>
            ))}
          </tbody></table>
        ) : <p style={{ color: 'var(--dim)', fontSize: 13 }}>No leadership assigned</p>}
      </div>
      <div className="detail-section">
        <div className="detail-section__title">
          Teams ({teams.length})
          <button className="btn btn-sm btn-primary" onClick={() => showModal('New Team', <AddTeamForm artId={id} onDone={() => { load(); onRefresh(); }} />, null)}>
            <svg viewBox="0 0 12 12" fill="none"><path d="M6 1v10M1 6h10" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" /></svg> Add Team
          </button>
        </div>
        {teams.length ? (
          <table className="mini-table"><thead><tr><th>Team</th><th>FTE</th><th>Members</th><th>Health</th></tr></thead><tbody>
            {teams.map(t => {
              const td = teamData[t.id];
              return (
                <tr key={t.id} onClick={() => selectNode({ type: 'team', id: t.id })} style={{ cursor: 'pointer' }}>
                  <td style={{ fontWeight: 500, color: 'var(--white)' }}>{t.name}</td>
                  <td>{(td?.fte ?? 0).toFixed(1)}</td>
                  <td>{td?.members ?? 0}</td>
                  <td>{td?.hasConflict
                    ? <span className="health-badge health-badge--conflict">⚠ Conflict</span>
                    : <span className="health-badge health-badge--healthy">✓ Healthy</span>}
                  </td>
                </tr>
              );
            })}
          </tbody></table>
        ) : <p style={{ color: 'var(--dim)', fontSize: 13 }}>No teams yet</p>}
      </div>
    </>
  );
}

function TeamDetail({ id, onRefresh }: { id: number; onRefresh: () => void }) {
  const activePI = usePIStore((s) => s.activePI);
  const selectNode = useOrgStore((s) => s.selectNode);
  const showModal = useModalStore((s) => s.showModal);
  const [teamObj, setTeamObj] = useState<ProductTeam | null>(null);
  const [artName, setArtName] = useState<string | null>(null);
  const [solName, setSolName] = useState<string | null>(null);
  const [members, setMembers] = useState<MembershipWithPerson[]>([]);
  const [totalFTE, setTotalFTE] = useState(0);
  const [memberFTEs, setMemberFTEs] = useState<Record<number, number>>({});

  const load = useCallback(async () => {
    if (!activePI) return;
    const teamList = await api.getTeams();
    const t = teamList.find(t => t.id === id);
    if (!t) return;
    setTeamObj(t);
    if (t.art_id) {
      const allArts = await api.getArts();
      const art = allArts.find(a => a.id === t.art_id);
      setArtName(art?.name || null);
      if (art?.solution_id) {
        const sols = await api.getSolutions();
        setSolName(sols.find(s => s.id === art.solution_id)?.name || null);
      } else {
        setSolName(null);
      }
    } else {
      setArtName(null);
      setSolName(null);
    }

    const [mems, fte] = await Promise.all([
      api.getTeamMembers(id, activePI.id),
      api.getTeamFTE(id, activePI.id),
    ]);
    setMembers(mems);
    setTotalFTE(fte);
    const ftes: Record<number, number> = {};
    for (const m of mems) {
      ftes[m.person_id] = await api.getPersonTotalFTE(m.person_id, activePI.id);
    }
    setMemberFTEs(ftes);
  }, [id, activePI]);

  useEffect(() => { load(); }, [load]);

  const handleRemoveMember = async (membershipId: number) => {
    if (!confirm('Remove this member from the team?')) return;
    await api.deleteMembership(membershipId);
    load();
    onRefresh();
  };

  const handleEdit = () => {
    if (!teamObj) return;
    showModal('Edit Team', <EditTeamForm team={teamObj} onDone={() => { load(); onRefresh(); }} />, null);
  };

  const handleDelete = async () => {
    if (!teamObj) return;
    if (!confirm(`Delete team "${teamObj.name}"? All memberships will be removed.`)) return;
    await api.deleteTeam(teamObj.id);
    selectNode(null);
    onRefresh();
  };

  if (!teamObj || !activePI) return null;

  const breadcrumbParts: string[] = [];
  if (solName) breadcrumbParts.push(solName);
  else if (artName) breadcrumbParts.push('Standalone');
  if (artName) breadcrumbParts.push(artName);
  else breadcrumbParts.push('Standalone');
  breadcrumbParts.push(teamObj.name);
  const breadcrumb = breadcrumbParts.join(' → ');

  return (
    <>
      <div className="detail-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <h3>{teamObj.name}</h3>
            <button className="icon-btn icon-btn--dim" onClick={handleEdit} title="Edit">{pencilIcon}</button>
            <button className="icon-btn icon-btn--red" onClick={handleDelete} title="Delete">{trashIcon}</button>
          </div>
          <p>{breadcrumb}</p>
        </div>
        <div className="detail-fte"><div className="detail-fte__number">{totalFTE.toFixed(1)}</div><div className="detail-fte__label">Total FTE</div></div>
      </div>
      <div className="detail-section">
        <div className="detail-section__title">
          Members ({activePI.pi_name})
          <button className="btn btn-sm btn-primary" onClick={() => showModal('Add Team Member', <AddMemberForm teamId={id} onDone={() => { load(); onRefresh(); }} />, null)}>
            <svg viewBox="0 0 12 12" fill="none"><path d="M6 1v10M1 6h10" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" /></svg> Add Member
          </button>
        </div>
        {members.length ? (
          <table className="mini-table"><thead><tr><th>Person</th><th>Role</th><th>FTE</th><th></th></tr></thead><tbody>
            {members.map(m => {
              const pfte = memberFTEs[m.person_id] ?? 0;
              return (
                <tr key={m.id}>
                  <td style={{ fontWeight: 500, color: 'var(--white)' }}>
                    {m.full_name}
                    {pfte > 100 && <span className="conflict-icon" title={`${pfte}% total`}> ⚠ {pfte}%</span>}
                  </td>
                  <td><span className="badge badge--dim">{m.role}</span></td>
                  <td>{m.fte_percent}%</td>
                  <td><button className="icon-btn icon-btn--red" onClick={() => handleRemoveMember(m.id)}>
                    <svg viewBox="0 0 14 14" fill="none"><path d="M3 4h8M5 4V3h4v1M4.5 4v7a.5.5 0 00.5.5h4a.5.5 0 00.5-.5V4" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" /></svg>
                  </button></td>
                </tr>
              );
            })}
          </tbody></table>
        ) : (
          <div className="empty-state" style={{ padding: 30 }}>
            <p>This team has no members yet.</p>
            <button className="btn btn-primary" onClick={() => showModal('Add Team Member', <AddMemberForm teamId={id} onDone={() => { load(); onRefresh(); }} />, null)}>
              <svg viewBox="0 0 14 14" fill="none"><path d="M7 1v12M1 7h12" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" /></svg> Add Member
            </button>
          </div>
        )}
      </div>
    </>
  );
}
