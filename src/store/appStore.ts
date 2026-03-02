// © Edmund Wallner
import { create } from 'zustand';
import type { AppStateInfo } from '../types';
import * as api from '../api';

interface AppStoreState {
  appState: AppStateInfo | null;
  isReady: boolean;
  isSetupComplete: boolean;
  loadAppState: () => Promise<void>;
  completeSetup: () => void;
}

export const useAppStore = create<AppStoreState>((set) => ({
  appState: null,
  isReady: false,
  isSetupComplete: false,
  loadAppState: async () => {
    const state = await api.getAppState();
    set({
      appState: state,
      isReady: true,
      isSetupComplete: !state.is_first_launch,
    });
  },
  completeSetup: () => set({ isSetupComplete: true }),
}));
