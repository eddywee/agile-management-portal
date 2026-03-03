// © Edmund Wallner
import { create } from 'zustand';
import type { ImportMapping, ImportResult } from '@/types';

interface ImportState {
  step: number;
  filePath: string | null;
  fileName: string | null;
  headers: string[];
  rows: string[][];
  mappings: ImportMapping[];
  piId: number | null;
  euroDecimal: boolean;
  result: ImportResult | null;
  setStep: (step: number) => void;
  setFile: (path: string, name: string, headers: string[], rows: string[][]) => void;
  setMappings: (mappings: ImportMapping[]) => void;
  setPiId: (id: number) => void;
  setEuroDecimal: (v: boolean) => void;
  setResult: (result: ImportResult) => void;
  reset: () => void;
}

export const useImportStore = create<ImportState>((set) => ({
  step: 1,
  filePath: null,
  fileName: null,
  headers: [],
  rows: [],
  mappings: [],
  piId: null,
  euroDecimal: false,
  result: null,
  setStep: (step) => set({ step }),
  setFile: (path, name, headers, rows) => set({ filePath: path, fileName: name, headers, rows }),
  setMappings: (mappings) => set({ mappings }),
  setPiId: (id) => set({ piId: id }),
  setEuroDecimal: (v) => set({ euroDecimal: v }),
  setResult: (result) => set({ result }),
  reset: () => set({ step: 1, filePath: null, fileName: null, headers: [], rows: [], mappings: [], piId: null, euroDecimal: false, result: null }),
}));
