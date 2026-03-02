// © Edmund Wallner
import { useNavigationStore } from '../../store/navigationStore';
import { DashboardPage } from '../dashboard/DashboardPage';
import { OrganizationPage } from '../organization/OrganizationPage';
import { PeoplePage } from '../people/PeoplePage';
import { ImportPage } from '../import/ImportPage';
import { SettingsPage } from '../settings/SettingsPage';

export function PageRouter() {
  const currentPage = useNavigationStore((s) => s.currentPage);

  return (
    <main className="main">
      <div className={`page${currentPage === 'dashboard' ? ' active' : ''}`}>
        {currentPage === 'dashboard' && <DashboardPage />}
      </div>
      <div className={`page${currentPage === 'organization' ? ' active' : ''}`}>
        {currentPage === 'organization' && <OrganizationPage />}
      </div>
      <div className={`page${currentPage === 'people' ? ' active' : ''}`}>
        {currentPage === 'people' && <PeoplePage />}
      </div>
      <div className={`page${currentPage === 'import' ? ' active' : ''}`}>
        {currentPage === 'import' && <ImportPage />}
      </div>
      <div className={`page${currentPage === 'settings' ? ' active' : ''}`}>
        {currentPage === 'settings' && <SettingsPage />}
      </div>
    </main>
  );
}
