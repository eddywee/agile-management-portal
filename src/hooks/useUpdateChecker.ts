// © Edmund Wallner
import { useEffect } from 'react';
import { check } from '@tauri-apps/plugin-updater';
import { useUpdateStore, isVersionSkipped } from '@/store/updateStore';

export function useUpdateChecker() {
  const setUpdate = useUpdateStore((s) => s.setUpdate);
  const showToast = useUpdateStore((s) => s.showToast);
  const setUpdateCheckDone = useUpdateStore((s) => s.setUpdateCheckDone);

  useEffect(() => {
    let cancelled = false;
    check()
      .then((u) => {
        if (cancelled) return;
        if (!u?.available) {
          setUpdateCheckDone();
          return;
        }
        if (isVersionSkipped(u.version)) {
          setUpdateCheckDone();
          return;
        }
        setUpdate(u);
        showToast();
        setUpdateCheckDone();
      })
      .catch(() => {
        // Silently ignore update check failures (offline, no key configured, etc.)
      });
    return () => {
      cancelled = true;
    };
  }, [setUpdate, showToast, setUpdateCheckDone]);
}
