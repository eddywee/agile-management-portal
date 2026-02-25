// © Edmund Wallner - Mercedes-Benz AG
import { useEffect, type ReactNode } from 'react';
import { usePIStore } from '../../store/piStore';
import { useNavigationStore } from '../../store/navigationStore';
import type { PageName } from '../../types';

const navItems: { page: PageName; label: string; section: 'views' | 'admin'; icon: ReactNode }[] = [
  {
    page: 'dashboard', label: 'Dashboard', section: 'views',
    icon: <svg viewBox="0 0 17 17" fill="none"><path d="M2 13V7h3v6M7 13V4h3v9M12 13V9h3v4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" /></svg>,
  },
  {
    page: 'organization', label: 'Organization', section: 'views',
    icon: <svg viewBox="0 0 17 17" fill="none"><path d="M8.5 1.5L1.5 5v7l7 4 7-4V5l-7-3.5z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" /></svg>,
  },
  {
    page: 'people', label: 'People', section: 'views',
    icon: <svg viewBox="0 0 17 17" fill="none"><circle cx="8.5" cy="5" r="3" stroke="currentColor" strokeWidth="1.2" /><path d="M2 15.5c0-3.3 2.9-6 6.5-6s6.5 2.7 6.5 6" stroke="currentColor" strokeWidth="1.2" /></svg>,
  },
  {
    page: 'import', label: 'Import', section: 'admin',
    icon: <svg viewBox="0 0 17 17" fill="none"><path d="M3 11v3h11v-3M8.5 2v9M5 8l3.5 3.5L12 8" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" /></svg>,
  },
  {
    page: 'settings', label: 'Settings', section: 'admin',
    icon: <svg viewBox="0 0 17 17" fill="none"><circle cx="8.5" cy="8.5" r="2" stroke="currentColor" strokeWidth="1.2" /><path d="M8.5 1v2m0 11v2M1 8.5h2m11 0h2M3.3 3.3l1.4 1.4m7.6 7.6l1.4 1.4M13.7 3.3l-1.4 1.4M4.7 11.9l-1.4 1.4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" /></svg>,
  },
];

export function Sidebar() {
  const { activePI, allPIs, loadPIs, setActivePI } = usePIStore();
  const { currentPage, navigateTo } = useNavigationStore();

  useEffect(() => { loadPIs(); }, [loadPIs]);

  const handlePIChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const pi = allPIs.find(p => p.id === parseInt(e.target.value));
    if (pi) setActivePI(pi);
  };

  const viewItems = navItems.filter(n => n.section === 'views');
  const adminItems = navItems.filter(n => n.section === 'admin');

  return (
    <aside className="sidebar">
      <div className="pi-selector-wrap">
        <div className="pi-selector-label">Program Increment</div>
        <select
          className="pi-selector"
          value={activePI?.id ?? ''}
          onChange={handlePIChange}
        >
          {allPIs.map(pi => (
            <option key={pi.id} value={pi.id}>
              {pi.pi_name} ({pi.status})
            </option>
          ))}
        </select>
      </div>
      <nav className="sidebar-nav">
        <div className="nav-section">
          <div className="nav-section__label">Views</div>
          {viewItems.map(item => (
            <div
              key={item.page}
              className={`nav-item${currentPage === item.page ? ' active' : ''}`}
              onClick={() => navigateTo(item.page)}
            >
              {item.icon}
              <span className="nav-item__text">{item.label}</span>
              <span className="tooltip">{item.label}</span>
            </div>
          ))}
        </div>
        <div className="nav-section">
          <div className="nav-section__label">Admin</div>
          {adminItems.map(item => (
            <div
              key={item.page}
              className={`nav-item${currentPage === item.page ? ' active' : ''}`}
              onClick={() => navigateTo(item.page)}
            >
              {item.icon}
              <span className="nav-item__text">{item.label}</span>
              <span className="tooltip">{item.label}</span>
            </div>
          ))}
        </div>
      </nav>
    </aside>
  );
}
