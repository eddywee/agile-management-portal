// © Edmund Wallner
import { useEffect } from 'react';
import { check } from '@tauri-apps/plugin-updater';
import { useUpdateStore, isVersionSkipped } from '../store/updateStore';

export function useUpdateChecker() {
  const setUpdate = useUpdateStore((s) => s.setUpdate);
  const showToast = useUpdateStore((s) => s.showToast);

  useEffect(() => {
    let cancelled = false;
    check()
      .then((u) => {
        if (cancelled || !u?.available) return;
        if (isVersionSkipped(u.version)) return;
        setUpdate(u);
        showToast();
      })
      .catch(() => {
        // Silently ignore update check failures (offline, no key configured, etc.)
      });
    return () => { cancelled = true; };
  }, [setUpdate, showToast]);
}
