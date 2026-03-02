// © Edmund Wallner
import { useState } from 'react';
import { PiManagementTab } from './PiManagementTab';
import { DataManagementTab } from './DataManagementTab';
import { CostRatesTab } from './CostRatesTab';
import { DatabaseTab } from './DatabaseTab';

type SettingsTab = 'pi' | 'data' | 'costs' | 'database';

export function SettingsPage() {
  const [tab, setTab] = useState<SettingsTab>('pi');

  return (
    <>
      <div className="page-header">
        <div className="page-header__left">
          <h2>Settings</h2>
          <p>PI management, data operations</p>
        </div>
      </div>
      <div className="tabs">
        <div className={`tab${tab === 'pi' ? ' active' : ''}`} onClick={() => setTab('pi')}>Program Increments</div>
        <div className={`tab${tab === 'data' ? ' active' : ''}`} onClick={() => setTab('data')}>Data Management</div>
        <div className={`tab${tab === 'costs' ? ' active' : ''}`} onClick={() => setTab('costs')}>Cost Rates</div>
        <div className={`tab${tab === 'database' ? ' active' : ''}`} onClick={() => setTab('database')}>Database</div>
      </div>
      {tab === 'pi' && <PiManagementTab />}
      {tab === 'data' && <DataManagementTab />}
      {tab === 'costs' && <CostRatesTab />}
      {tab === 'database' && <DatabaseTab />}
    </>
  );
}
