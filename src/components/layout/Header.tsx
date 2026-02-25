// © Edmund Wallner - Mercedes-Benz AG
import { useCallback } from 'react';
import mbLogo from '../../assets/images/mercedes-benz-logo-white.svg';

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
            <path d="M10 3L5.5 8 10 13" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>
      <div className="header__brand">
        <div className="header__logo">
          <img src={mbLogo} alt="Mercedes-Benz" />
        </div>
        <div className="header__title">HELIX<span>Agile Portal</span></div>
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
        <div className="env-badge"><span className="env-badge__dot"></span>Local</div>
        <div className="header__user">
          <div className="header__user-avatar">HP</div>
          <span className="header__user-name">HELIX Planner</span>
        </div>
      </div>
    </header>
  );
}
