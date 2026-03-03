// © Edmund Wallner
import { useEffect, useState, useCallback } from 'react';
import { useOrgStore } from '@/store/orgStore';
import { useModalStore } from '@/store/modalStore';
import * as api from '@/api';
import type { Solution, Art, ProductTeam, OrgNode } from '@/types';
import {
  AddSolutionForm,
  AddARTForm,
  AddTeamForm,
  EditSolutionForm,
  EditARTForm,
  EditTeamForm,
} from '@/components/common/ModalForms';

interface TreeData {
  solutions: Solution[];
  arts: Record<number, Art[]>;
  teams: Record<number, ProductTeam[]>;
  standaloneArts: Art[];
  standaloneTeams: ProductTeam[];
}

export function OrgTree({ onRefresh }: { onRefresh: number }) {
  const { selectedNode, selectNode } = useOrgStore();
  const showModal = useModalStore((s) => s.showModal);
  const [data, setData] = useState<TreeData>({
    solutions: [],
    arts: {},
    teams: {},
    standaloneArts: [],
    standaloneTeams: [],
  });
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});

  const loadTree = useCallback(async () => {
    const [solutions, allArts, allTeams] = await Promise.all([api.getSolutions(), api.getArts(), api.getTeams()]);

    const artsMap: Record<number, Art[]> = {};
    const standaloneArts: Art[] = [];
    for (const art of allArts) {
      if (art.solution_id) {
        if (!artsMap[art.solution_id]) artsMap[art.solution_id] = [];
        artsMap[art.solution_id].push(art);
      } else {
        standaloneArts.push(art);
      }
    }

    const teamsMap: Record<number, ProductTeam[]> = {};
    const standaloneTeams: ProductTeam[] = [];
    for (const team of allTeams) {
      if (team.art_id) {
        if (!teamsMap[team.art_id]) teamsMap[team.art_id] = [];
        teamsMap[team.art_id].push(team);
      } else {
        standaloneTeams.push(team);
      }
    }

    setData({ solutions, arts: artsMap, teams: teamsMap, standaloneArts, standaloneTeams });
  }, []);

  useEffect(() => {
    loadTree();
  }, [loadTree, onRefresh]);

  const toggleCollapse = (key: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setCollapsed((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const isSelected = (node: OrgNode) => selectedNode?.type === node.type && selectedNode?.id === node.id;

  // ── Modal handlers ──

  const handleAddSolution = () => {
    showModal('New Solution', <AddSolutionForm onDone={loadTree} />, null);
  };
  const handleAddART = (solId?: number) => {
    showModal('New ART', <AddARTForm solutionId={solId} onDone={loadTree} />, null);
  };
  const handleAddTeam = (artId?: number) => {
    showModal('New Team', <AddTeamForm artId={artId} onDone={loadTree} />, null);
  };

  const handleEditSolution = (sol: Solution, e: React.MouseEvent) => {
    e.stopPropagation();
    showModal('Edit Solution', <EditSolutionForm solution={sol} onDone={loadTree} />, null);
  };
  const handleDeleteSolution = async (sol: Solution, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm(`Delete solution "${sol.name}"? Its ARTs will become standalone.`)) return;
    await api.deleteSolution(sol.id);
    if (selectedNode?.type === 'solution' && selectedNode.id === sol.id) selectNode(null);
    loadTree();
  };
  const handleEditART = (art: Art, e: React.MouseEvent) => {
    e.stopPropagation();
    showModal('Edit ART', <EditARTForm art={art} onDone={loadTree} />, null);
  };
  const handleDeleteART = async (art: Art, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm(`Delete ART "${art.name}"? Its teams will become standalone.`)) return;
    await api.deleteArt(art.id);
    if (selectedNode?.type === 'art' && selectedNode.id === art.id) selectNode(null);
    loadTree();
  };
  const handleEditTeam = (team: ProductTeam, e: React.MouseEvent) => {
    e.stopPropagation();
    showModal('Edit Team', <EditTeamForm team={team} onDone={loadTree} />, null);
  };
  const handleDeleteTeam = async (team: ProductTeam, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm(`Delete team "${team.name}"? All memberships will be removed.`)) return;
    await api.deleteTeam(team.id);
    if (selectedNode?.type === 'team' && selectedNode.id === team.id) selectNode(null);
    loadTree();
  };

  // ── Icons ──

  const pencilIcon = (
    <svg viewBox="0 0 14 14" fill="none" style={{ width: 13, height: 13 }}>
      <path
        d="M10 2l2 2-7 7H3V9l7-7z"
        stroke="currentColor"
        strokeWidth="1.1"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
  const trashIcon = (
    <svg viewBox="0 0 14 14" fill="none" style={{ width: 13, height: 13 }}>
      <path
        d="M3 4h8M5 4V3h4v1M4.5 4v7a.5.5 0 00.5.5h4a.5.5 0 00.5-.5V4"
        stroke="currentColor"
        strokeWidth="1.1"
        strokeLinecap="round"
      />
    </svg>
  );
  const chevronIcon = (isOpen: boolean) => (
    <svg className={`tree-node__chevron${isOpen ? ' open' : ''}`} viewBox="0 0 14 14" fill="none">
      <path d="M5 3l4 4.5-4 4.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  );
  const solutionIcon = (
    <svg className="tree-node__icon" viewBox="0 0 15 15" fill="none">
      <path d="M7.5 1.5L1 5v5.5l6.5 3.5 6.5-3.5V5L7.5 1.5z" stroke="currentColor" strokeWidth="1.1" />
    </svg>
  );
  const artIcon = (
    <svg className="tree-node__icon" viewBox="0 0 15 15" fill="none">
      <rect x="2" y="2" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1" />
      <rect x="8" y="8" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1" />
    </svg>
  );
  const teamIcon = (
    <svg className="tree-node__icon" viewBox="0 0 15 15" fill="none" style={{ marginLeft: 14 }}>
      <circle cx="5" cy="5" r="2" stroke="currentColor" strokeWidth="1" />
      <circle cx="10" cy="5" r="2" stroke="currentColor" strokeWidth="1" />
      <path d="M1 13c0-2 1.8-3.5 4-3.5m5-3.5c2.2 0 4 1.5 4 3.5" stroke="currentColor" strokeWidth="1" />
    </svg>
  );

  // ── Render helpers ──

  const renderTeamNode = (team: ProductTeam) => (
    <div className="tree-node" key={team.id}>
      <div
        className={`tree-node__header${isSelected({ type: 'team', id: team.id }) ? ' selected' : ''}`}
        onClick={() => selectNode({ type: 'team', id: team.id })}
      >
        {teamIcon}
        <span className="tree-node__label">{team.name}</span>
        <span className="tree-node__actions">
          <button className="icon-btn icon-btn--dim" onClick={(e) => handleEditTeam(team, e)}>
            {pencilIcon}
          </button>
          <button className="icon-btn icon-btn--red" onClick={(e) => handleDeleteTeam(team, e)}>
            {trashIcon}
          </button>
        </span>
      </div>
    </div>
  );

  const renderArtNode = (art: Art) => {
    const artKey = `art-${art.id}`;
    const artTeams = data.teams[art.id] || [];
    const isOpen = !collapsed[artKey];
    return (
      <div className="tree-node" key={art.id}>
        <div
          className={`tree-node__header${isSelected({ type: 'art', id: art.id }) ? ' selected' : ''}`}
          onClick={() => selectNode({ type: 'art', id: art.id })}
        >
          <span onClick={(e) => toggleCollapse(artKey, e)}>{chevronIcon(isOpen)}</span>
          {artIcon}
          <span className="tree-node__label">{art.name}</span>
          <span className="tree-node__actions">
            <button className="icon-btn icon-btn--dim" onClick={(e) => handleEditART(art, e)}>
              {pencilIcon}
            </button>
            <button className="icon-btn icon-btn--red" onClick={(e) => handleDeleteART(art, e)}>
              {trashIcon}
            </button>
          </span>
        </div>
        {isOpen && (
          <div className="tree-node__children">
            {artTeams.map(renderTeamNode)}
            <button className="tree-add-btn" onClick={() => handleAddTeam(art.id)}>
              <svg viewBox="0 0 12 12" fill="none">
                <path d="M6 1v10M1 6h10" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
              </svg>
              Add Team
            </button>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="org-tree-panel">
      {/* Section 1: Solutions (with nested ARTs and Teams) */}
      {data.solutions.map((sol) => {
        const solKey = `sol-${sol.id}`;
        const solArts = data.arts[sol.id] || [];
        const isOpen = !collapsed[solKey];
        return (
          <div className="tree-node" key={sol.id}>
            <div
              className={`tree-node__header${isSelected({ type: 'solution', id: sol.id }) ? ' selected' : ''}`}
              onClick={() => selectNode({ type: 'solution', id: sol.id })}
            >
              <span onClick={(e) => toggleCollapse(solKey, e)}>{chevronIcon(isOpen)}</span>
              {solutionIcon}
              <span className="tree-node__label">{sol.name}</span>
              <span className="tree-node__actions">
                <button className="icon-btn icon-btn--dim" onClick={(e) => handleEditSolution(sol, e)}>
                  {pencilIcon}
                </button>
                <button className="icon-btn icon-btn--red" onClick={(e) => handleDeleteSolution(sol, e)}>
                  {trashIcon}
                </button>
              </span>
            </div>
            {isOpen && (
              <div className="tree-node__children">
                {solArts.map((art) => renderArtNode(art))}
                <button className="tree-add-btn" onClick={() => handleAddART(sol.id)}>
                  <svg viewBox="0 0 12 12" fill="none">
                    <path d="M6 1v10M1 6h10" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
                  </svg>
                  Add ART
                </button>
              </div>
            )}
          </div>
        );
      })}

      {/* Section 2: Standalone ARTs (with nested Teams) */}
      {data.standaloneArts.length > 0 && (
        <>
          <div className="tree-section-label">Standalone ARTs</div>
          {data.standaloneArts.map((art) => renderArtNode(art))}
        </>
      )}

      {/* Section 3: Standalone Teams */}
      {data.standaloneTeams.length > 0 && (
        <>
          <div className="tree-section-label">Standalone Teams</div>
          {data.standaloneTeams.map(renderTeamNode)}
        </>
      )}

      {/* Add buttons */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginTop: 12 }}>
        <button className="tree-add-btn" onClick={handleAddSolution}>
          <svg viewBox="0 0 12 12" fill="none">
            <path d="M6 1v10M1 6h10" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
          </svg>
          Add Solution
        </button>
        <button className="tree-add-btn" onClick={() => handleAddART()}>
          <svg viewBox="0 0 12 12" fill="none">
            <path d="M6 1v10M1 6h10" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
          </svg>
          Add ART
        </button>
        <button className="tree-add-btn" onClick={() => handleAddTeam()}>
          <svg viewBox="0 0 12 12" fill="none">
            <path d="M6 1v10M1 6h10" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
          </svg>
          Add Team
        </button>
      </div>
    </div>
  );
}
