// © Edmund Wallner - Mercedes-Benz AG
import { useState, useCallback } from 'react';
import { OrgTree } from './OrgTree';
import { OrgDetail } from './OrgDetail';

export function OrganizationPage() {
  const [refreshKey, setRefreshKey] = useState(0);
  const triggerRefresh = useCallback(() => setRefreshKey(k => k + 1), []);

  return (
    <>
      <div className="page-header">
        <div className="page-header__left">
          <h2>Organization</h2>
          <p>Solution → ART → Team hierarchy</p>
        </div>
      </div>
      <div className="org-layout">
        <OrgTree onRefresh={refreshKey} />
        <OrgDetail onRefreshRequest={triggerRefresh} />
      </div>
    </>
  );
}
