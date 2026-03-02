// © Edmund Wallner
import { create } from 'zustand';

interface PeopleState {
  selectedPersonId: number | null;
  setSelectedPerson: (id: number | null) => void;
}

export const usePeopleStore = create<PeopleState>((set) => ({
  selectedPersonId: null,
  setSelectedPerson: (id) => set({ selectedPersonId: id }),
}));
