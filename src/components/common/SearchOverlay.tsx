// © Edmund Wallner
import { useState, useEffect, useRef, useCallback } from 'react';
import { usePIStore } from '@/store/piStore';
import { useNavigationStore } from '@/store/navigationStore';
import { useOrgStore } from '@/store/orgStore';
import { usePeopleStore } from '@/store/peopleStore';
import * as api from '@/api';
import type { SearchResults } from '@/types';

type SearchFilter = 'all' | 'people' | 'teams' | 'arts';

interface SearchOverlayProps {
  onClose: () => void;
}

const avatarColors = ['blue', 'green', 'amber', 'red', 'purple'] as const;

function highlight(text: string | null, term: string): string {
  if (!text) return '';
  const escaped = term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regex = new RegExp(`(${escaped})`, 'gi');
  // We use dangerouslySetInnerHTML for this
  return text.replace(regex, '<mark>$1</mark>');
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();
}

export function SearchOverlay({ onClose }: SearchOverlayProps) {
  const [term, setTerm] = useState('');
  const [filter, setFilter] = useState<SearchFilter>('all');
  const [results, setResults] = useState<SearchResults | null>(null);
  const [personFTEs, setPersonFTEs] = useState<Record<number, number>>({});
  const inputRef = useRef<HTMLInputElement>(null);
  const activePI = usePIStore((s) => s.activePI);
  const navigateTo = useNavigationStore((s) => s.navigateTo);
  const selectNode = useOrgStore((s) => s.selectNode);
  const setSelectedPerson = usePeopleStore((s) => s.setSelectedPerson);

  useEffect(() => {
    setTimeout(() => inputRef.current?.focus(), 100);
  }, []);

  useEffect(() => {
    if (!term.trim()) {
      setResults(null);
      return;
    }
    let cancelled = false;
    (async () => {
      const res = await api.searchAll(term.trim());
      if (cancelled) return;
      setResults(res);
      // Fetch FTEs for people results
      if (activePI && res.people.length) {
        const ftes: Record<number, number> = {};
        await Promise.all(
          res.people.map(async (p) => {
            ftes[p.id] = await api.getPersonTotalFTE(p.id, activePI.id);
          }),
        );
        if (!cancelled) setPersonFTEs(ftes);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [term, activePI]);

  const goToPerson = useCallback(
    (id: number) => {
      onClose();
      navigateTo('people');
      setSelectedPerson(id);
    },
    [onClose, navigateTo, setSelectedPerson],
  );

  const goToOrg = useCallback(
    (type: 'solution' | 'art' | 'team', id: number) => {
      onClose();
      navigateTo('organization');
      selectNode({ type, id });
    },
    [onClose, navigateTo, selectNode],
  );

  const showPeople = (filter === 'all' || filter === 'people') && results?.people?.length;
  const showTeams = (filter === 'all' || filter === 'teams') && results?.teams?.length;
  const showArts = (filter === 'all' || filter === 'arts') && (results?.arts?.length || results?.solutions?.length);

  return (
    <div
      className="search-overlay"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="search-modal">
        <div className="search-input-wrap">
          <svg viewBox="0 0 20 20" fill="none">
            <circle cx="9" cy="9" r="6" stroke="currentColor" strokeWidth="1.5" />
            <path d="M14 14l4.5 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          <input
            ref={inputRef}
            type="text"
            placeholder="Search People, Teams, ARTs…"
            value={term}
            onChange={(e) => setTerm(e.target.value)}
          />
        </div>
        <div className="search-filters">
          {(['all', 'people', 'teams', 'arts'] as SearchFilter[]).map((f) => (
            <button
              key={f}
              className={`search-filter-pill${filter === f ? ' active' : ''}`}
              onClick={() => setFilter(f)}
            >
              {f === 'arts' ? 'ARTs & Solutions' : f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
        <div className="search-results">
          {!term.trim() ? (
            <div style={{ padding: 40, textAlign: 'center', color: 'var(--dim)', fontSize: 13 }}>
              Start typing to search…
            </div>
          ) : results && !showPeople && !showTeams && !showArts ? (
            <div style={{ padding: 40, textAlign: 'center', color: 'var(--dim)', fontSize: 13 }}>No results found</div>
          ) : (
            <>
              {showPeople && (
                <>
                  <div className="search-category-label">
                    <span>People</span>
                    <span
                      style={{
                        background: 'rgba(255,255,255,0.04)',
                        padding: '2px 8px',
                        borderRadius: 3,
                        fontSize: 10,
                      }}
                    >
                      {results!.people.length} match{results!.people.length > 1 ? 'es' : ''}
                    </span>
                  </div>
                  {results!.people.map((p, i) => (
                    <div key={p.id} className="search-result-item" onClick={() => goToPerson(p.id)}>
                      <div className={`avatar avatar--${avatarColors[i % avatarColors.length]}`}>
                        {getInitials(p.full_name)}
                      </div>
                      <div className="search-result-item__info">
                        <div
                          className="search-result-item__name"
                          dangerouslySetInnerHTML={{ __html: highlight(p.full_name, term) }}
                        />
                        <div className="search-result-item__detail">
                          {p.department || ''} · {p.hub || ''}
                        </div>
                      </div>
                      <span className="search-result-item__meta">FTE: {personFTEs[p.id] ?? 0}%</span>
                    </div>
                  ))}
                </>
              )}

              {showTeams && (
                <>
                  <div className="search-category-label">
                    <span>Teams</span>
                  </div>
                  {results!.teams.map((t) => (
                    <div key={t.id} className="search-result-item" onClick={() => goToOrg('team', t.id)}>
                      <div className="avatar avatar--blue" style={{ borderRadius: 'var(--r)' }}>
                        <svg viewBox="0 0 16 16" fill="none" style={{ width: 14, height: 14 }}>
                          <circle cx="5" cy="5" r="2" stroke="currentColor" strokeWidth="1" />
                          <circle cx="11" cy="5" r="2" stroke="currentColor" strokeWidth="1" />
                          <path d="M1 14c0-2 1.8-3 4-3m2 3c0-2 1.8-3 4-3" stroke="currentColor" strokeWidth="1" />
                        </svg>
                      </div>
                      <div className="search-result-item__info">
                        <div
                          className="search-result-item__name"
                          dangerouslySetInnerHTML={{ __html: highlight(t.name, term) }}
                        />
                        <div className="search-result-item__detail">{t.art_name}</div>
                      </div>
                    </div>
                  ))}
                </>
              )}

              {showArts && (
                <>
                  <div className="search-category-label">
                    <span>ARTs & Solutions</span>
                  </div>
                  {results!.arts.map((a) => (
                    <div key={`art-${a.id}`} className="search-result-item" onClick={() => goToOrg('art', a.id)}>
                      <div className="avatar avatar--purple" style={{ borderRadius: 'var(--r)' }}>
                        <svg viewBox="0 0 16 16" fill="none" style={{ width: 14, height: 14 }}>
                          <rect x="2" y="2" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1" />
                          <rect x="9" y="9" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1" />
                        </svg>
                      </div>
                      <div className="search-result-item__info">
                        <div
                          className="search-result-item__name"
                          dangerouslySetInnerHTML={{ __html: highlight(a.name, term) }}
                        />
                        <div className="search-result-item__detail">ART · {a.sol_name}</div>
                      </div>
                    </div>
                  ))}
                  {results!.solutions.map((s) => (
                    <div key={`sol-${s.id}`} className="search-result-item" onClick={() => goToOrg('solution', s.id)}>
                      <div className="avatar avatar--green" style={{ borderRadius: 'var(--r)' }}>
                        <svg viewBox="0 0 16 16" fill="none" style={{ width: 14, height: 14 }}>
                          <path d="M8 1.5L1 5v6l7 4 7-4V5L8 1.5z" stroke="currentColor" strokeWidth="1" />
                        </svg>
                      </div>
                      <div className="search-result-item__info">
                        <div
                          className="search-result-item__name"
                          dangerouslySetInnerHTML={{ __html: highlight(s.name, term) }}
                        />
                        <div className="search-result-item__detail">Solution</div>
                      </div>
                    </div>
                  ))}
                </>
              )}
            </>
          )}
        </div>
        <div className="search-footer">
          <div className="search-footer__hints">
            <span>
              <kbd>↩</kbd> to select
            </span>
            <span>
              <kbd>↑</kbd>
              <kbd>↓</kbd> navigate
            </span>
            <span>
              <kbd>ESC</kbd> close
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--green)' }}></span>
            Search Index Active
          </div>
        </div>
      </div>
    </div>
  );
}
