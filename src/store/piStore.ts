// © Edmund Wallner
import { create } from 'zustand';
import type { ProgramIncrement } from '../types';
import * as api from '../api';

interface PIState {
  activePI: ProgramIncrement | null;
  allPIs: ProgramIncrement[];
  loadPIs: () => Promise<void>;
  setActivePI: (pi: ProgramIncrement) => void;
}

export const usePIStore = create<PIState>((set) => ({
  activePI: null,
  allPIs: [],
  loadPIs: async () => {
    const [allPIs, activePI] = await Promise.all([api.getAllPIs(), api.getActivePI()]);
    set({ allPIs, activePI: activePI ?? allPIs[0] ?? null });
  },
  setActivePI: (pi) => set({ activePI: pi }),
}));
