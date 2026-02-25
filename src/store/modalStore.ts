// © Edmund Wallner - Mercedes-Benz AG
import { create } from 'zustand';
import type { ReactNode } from 'react';

interface ModalState {
  isOpen: boolean;
  title: string;
  content: ReactNode | null;
  actions: ReactNode | null;
  showModal: (title: string, content: ReactNode, actions: ReactNode) => void;
  closeModal: () => void;
}

export const useModalStore = create<ModalState>((set) => ({
  isOpen: false,
  title: '',
  content: null,
  actions: null,
  showModal: (title, content, actions) => set({ isOpen: true, title, content, actions }),
  closeModal: () => set({ isOpen: false, title: '', content: null, actions: null }),
}));
