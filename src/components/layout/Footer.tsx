// © Edmund Wallner
import { useEffect, useState } from 'react';
import { usePIStore } from '../../store/piStore';
import { useNavigationStore } from '../../store/navigationStore';
import { useUpdateStore } from '../../store/updateStore';
import { openUpdateModal } from '../common/UpdateModal';
import * as api from '../../api';

function getUpdateSeverity(current: string, available: string): 'major' | 'minor' {
  const [curMajor] = current.split('.').map(Number);
  const [avaMajor] = available.split('.').map(Number);
  return avaMajor > curMajor ? 'major' : 'minor';
}


export function Footer() {
  const activePI = usePIStore((s) => s.activePI);
  const navigateTo = useNavigationStore((s) => s.navigateTo);
  const [totalFTE, setTotalFTE] = useState(0);
  const [conflictCount, setConflictCount] = useState(0);

  const update = useUpdateStore((s) => s.update);
  const sessionDismissed = useUpdateStore((s) => s.sessionDismissed);
  const updateCheckDone = useUpdateStore((s) => s.updateCheckDone);
  const hasUpdate = !!update && !sessionDismissed;

  useEffect(() => {
    if (!activePI) return;
    let cancelled = false;
    (async () => {
      const [dist, conflicts] = await Promise.all([
        api.getRoleDistribution(activePI.id),
        api.getConflicts(activePI.id),
      ]);
      if (cancelled) return;
      setTotalFTE(dist.total);
      setConflictCount(conflicts.length);
    })();
    return () => { cancelled = true; };
  }, [activePI]);

  return (
    <footer className="footer">
      <div className="footer__left">
        <span>Active PI: <span className="footer__pi">{activePI?.pi_name ?? '—'}</span></span>
        <span className="footer__fte">{totalFTE.toFixed(1)} FTE</span>
        <span
          className={`footer__conflicts ${conflictCount > 0 ? 'has-conflicts' : 'no-conflicts'}`}
          onClick={() => navigateTo('dashboard')}
        >
          {conflictCount > 0
            ? `⚠ ${conflictCount} conflict${conflictCount > 1 ? 's' : ''}`
            : '✓ No conflicts'}
        </span>
      </div>
      <div className="footer__right">
        <span>Agile Management Portal</span>
        <span
          className={`footer__version${
            hasUpdate
              ? getUpdateSeverity(__APP_VERSION__, update!.version) === 'major'
                ? ' footer__version--major'
                : ' footer__version--minor'
              : updateCheckDone && !update
                ? ' footer__version--latest'
                : ''
          }`}
          onClick={hasUpdate ? openUpdateModal : undefined}
        >
          v{__APP_VERSION__}
          {hasUpdate && <span className="footer__update-dot" />}
        </span>
        <span>© Edmund Wallner</span>
      </div>
    </footer>
  );
}
