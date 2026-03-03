// © Edmund Wallner
import { create } from 'zustand';
import type { Update } from '@tauri-apps/plugin-updater';
import { relaunch } from '@tauri-apps/plugin-process';

const SKIPPED_VERSION_KEY = 'amp_skipped_update_version';

type DownloadStatus = 'idle' | 'downloading' | 'installing' | 'restarting' | 'failed';

interface UpdateState {
  update: Update | null;
  downloadStatus: DownloadStatus;
  downloadPercent: number;
  errorMessage: string | null;
  toastVisible: boolean;
  sessionDismissed: boolean;
  updateCheckDone: boolean;

  setUpdate: (update: Update) => void;
  showToast: () => void;
  hideToast: () => void;
  dismissSession: () => void;
  skipVersion: (version: string) => void;
  startDownload: () => Promise<void>;
  clearUpdate: () => void;
  setUpdateCheckDone: () => void;
}

export const useUpdateStore = create<UpdateState>((set, get) => ({
  update: null,
  downloadStatus: 'idle',
  downloadPercent: 0,
  errorMessage: null,
  toastVisible: false,
  sessionDismissed: false,
  updateCheckDone: false,

  setUpdate: (update) => set({ update }),
  setUpdateCheckDone: () => set({ updateCheckDone: true }),
  showToast: () => set({ toastVisible: true }),
  hideToast: () => set({ toastVisible: false }),
  dismissSession: () => set({ sessionDismissed: true, toastVisible: false }),
  clearUpdate: () => set({ update: null, toastVisible: false }),

  skipVersion: (version) => {
    localStorage.setItem(SKIPPED_VERSION_KEY, version);
    set({ update: null, toastVisible: false, sessionDismissed: true });
  },

  startDownload: async () => {
    const { update } = get();
    if (!update) return;

    set({ downloadStatus: 'downloading', downloadPercent: 0, errorMessage: null });

    try {
      let total = 0;
      let downloaded = 0;
      await update.downloadAndInstall((event) => {
        if (event.event === 'Started' && event.data.contentLength) {
          total = event.data.contentLength;
        } else if (event.event === 'Progress') {
          downloaded += event.data.chunkLength;
          if (total > 0) {
            set({ downloadPercent: Math.round((downloaded / total) * 100) });
          }
        } else if (event.event === 'Finished') {
          set({ downloadStatus: 'installing', downloadPercent: 100 });
        }
      });
      set({ downloadStatus: 'restarting' });
      await relaunch();
    } catch (e) {
      set({
        downloadStatus: 'failed',
        errorMessage: e instanceof Error ? e.message : String(e),
      });
    }
  },
}));

export function isVersionSkipped(version: string): boolean {
  return localStorage.getItem(SKIPPED_VERSION_KEY) === version;
}
