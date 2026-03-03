// © Edmund Wallner
import { useCallback } from 'react';

interface HeaderProps {
  onOpenSearch: () => void;
  onToggleSidebar: () => void;
}

export function Header({ onOpenSearch, onToggleSidebar }: HeaderProps) {
  const handleSearchClick = useCallback(() => onOpenSearch(), [onOpenSearch]);

  return (
    <header className="header">
      <div className="header__left">
        <button className="header__toggle" title="Toggle sidebar (Ctrl+B)" onClick={onToggleSidebar}>
          <svg viewBox="0 0 16 16" fill="none">
            <path
              d="M10 3L5.5 8 10 13"
              stroke="currentColor"
              strokeWidth="1.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>
      <div className="header__brand">
        <div className="header__logo">
          <svg viewBox="0 0 24 24" fill="none" width="22" height="22">
            <rect x="2" y="2" width="9" height="9" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
            <rect x="13" y="2" width="9" height="9" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
            <rect x="2" y="13" width="9" height="9" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
            <rect
              x="13"
              y="13"
              width="9"
              height="9"
              rx="1.5"
              fill="currentColor"
              stroke="currentColor"
              strokeWidth="1.5"
            />
          </svg>
        </div>
        <div className="header__title">
          AMP<span>Agile Management Portal</span>
        </div>
      </div>
      <div className="header__right">
        <button className="header__search-trigger" onClick={handleSearchClick}>
          <svg viewBox="0 0 16 16" fill="none">
            <circle cx="7" cy="7" r="5" stroke="currentColor" strokeWidth="1.2" />
            <path d="M11 11l3.5 3.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
          </svg>
          Search
          <kbd>⌘K</kbd>
        </button>
        <div className="env-badge">
          <span className="env-badge__dot"></span>Local
        </div>
        <div className="header__user">
          <div className="header__user-avatar">AP</div>
          <span className="header__user-name">Planner</span>
        </div>
      </div>
    </header>
  );
}
