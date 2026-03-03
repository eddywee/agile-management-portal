// © Edmund Wallner
import { create } from 'zustand';
import type { PageName } from '@/types';

interface NavigationState {
  currentPage: PageName;
  navigateTo: (page: PageName) => void;
}

export const useNavigationStore = create<NavigationState>((set) => ({
  currentPage: 'dashboard',
  navigateTo: (page) => set({ currentPage: page }),
}));
