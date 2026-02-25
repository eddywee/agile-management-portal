// © Edmund Wallner - Mercedes-Benz AG
import { create } from 'zustand';
import type { OrgNode } from '../types';

interface OrgState {
  selectedNode: OrgNode | null;
  selectNode: (node: OrgNode | null) => void;
}

export const useOrgStore = create<OrgState>((set) => ({
  selectedNode: null,
  selectNode: (node) => set({ selectedNode: node }),
}));
