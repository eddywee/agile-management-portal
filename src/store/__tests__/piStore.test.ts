// © Edmund Wallner
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { invoke } from '@tauri-apps/api/core';
import { usePIStore } from '@/store/piStore';
import { mockPIs } from '@/test/helpers';

const mockedInvoke = vi.mocked(invoke);

beforeEach(() => {
  usePIStore.setState({ activePI: null, allPIs: [] });
  mockedInvoke.mockReset();
});

describe('usePIStore', () => {
  it('starts with null activePI and empty allPIs', () => {
    const { activePI, allPIs } = usePIStore.getState();
    expect(activePI).toBeNull();
    expect(allPIs).toEqual([]);
  });

  it('loadPIs fetches all PIs and active PI', async () => {
    const activePI = mockPIs[2]; // PI 25.1 Active
    mockedInvoke.mockImplementation((cmd: string) => {
      if (cmd === 'get_all_pis') return Promise.resolve(mockPIs);
      if (cmd === 'get_active_pi') return Promise.resolve(activePI);
      return Promise.reject(new Error(`Unknown command: ${cmd}`));
    });

    await usePIStore.getState().loadPIs();

    const state = usePIStore.getState();
    expect(state.allPIs).toEqual(mockPIs);
    expect(state.activePI).toEqual(activePI);
  });

  it('loadPIs falls back to first PI when no active PI exists', async () => {
    mockedInvoke.mockImplementation((cmd: string) => {
      if (cmd === 'get_all_pis') return Promise.resolve(mockPIs);
      if (cmd === 'get_active_pi') return Promise.resolve(null);
      return Promise.reject(new Error(`Unknown command: ${cmd}`));
    });

    await usePIStore.getState().loadPIs();

    expect(usePIStore.getState().activePI).toEqual(mockPIs[0]);
  });

  it('loadPIs sets null when no PIs exist at all', async () => {
    mockedInvoke.mockImplementation((cmd: string) => {
      if (cmd === 'get_all_pis') return Promise.resolve([]);
      if (cmd === 'get_active_pi') return Promise.resolve(null);
      return Promise.reject(new Error(`Unknown command: ${cmd}`));
    });

    await usePIStore.getState().loadPIs();

    const state = usePIStore.getState();
    expect(state.allPIs).toEqual([]);
    expect(state.activePI).toBeNull();
  });

  it('setActivePI updates the active PI', () => {
    const pi = mockPIs[1];
    usePIStore.getState().setActivePI(pi);
    expect(usePIStore.getState().activePI).toEqual(pi);
  });
});
