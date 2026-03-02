// © Edmund Wallner
import { useState, useEffect } from 'react';
import { check, type Update } from '@tauri-apps/plugin-updater';
import { relaunch } from '@tauri-apps/plugin-process';

export function UpdateBanner() {
  const [update, setUpdate] = useState<Update | null>(null);
  const [dismissed, setDismissed] = useState(false);
  const [installing, setInstalling] = useState(false);
  const [progress, setProgress] = useState<string>('');

  useEffect(() => {
    let cancelled = false;
    check().then((u) => {
      if (!cancelled && u?.available) setUpdate(u);
    }).catch(() => {
      // Silently ignore update check failures (offline, no key configured, etc.)
    });
    return () => { cancelled = true; };
  }, []);

  if (!update || dismissed) return null;

  const handleUpdate = async () => {
    setInstalling(true);
    try {
      let total = 0;
      let downloaded = 0;
      await update.downloadAndInstall((event) => {
        if (event.event === 'Started' && event.data.contentLength) {
          total = event.data.contentLength;
          setProgress('Starting download…');
        } else if (event.event === 'Progress') {
          downloaded += event.data.chunkLength;
          if (total > 0) {
            const pct = Math.round((downloaded / total) * 100);
            setProgress(`Downloading… ${pct}%`);
          }
        } else if (event.event === 'Finished') {
          setProgress('Installing…');
        }
      });
      await relaunch();
    } catch {
      setProgress('Update failed');
      setInstalling(false);
    }
  };

  return (
    <div className="update-banner">
      <span className="update-banner__text">
        {installing ? progress : `Update available: v${update.version}`}
      </span>
      {!installing && (
        <>
          <button className="update-banner__btn" onClick={handleUpdate}>
            Update &amp; Restart
          </button>
          <button
            className="update-banner__dismiss"
            onClick={() => setDismissed(true)}
            aria-label="Dismiss"
          >
            ×
          </button>
        </>
      )}
    </div>
  );
}
