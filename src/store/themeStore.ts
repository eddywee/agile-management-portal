// © Edmund Wallner
import { create } from 'zustand';

type ThemePreference = 'light' | 'dark' | 'system';
type ResolvedTheme = 'light' | 'dark';

interface ThemeState {
  theme: ThemePreference;
  resolved: ResolvedTheme;
  setTheme: (t: ThemePreference) => void;
  initTheme: () => void;
}

const STORAGE_KEY = 'amp-theme';

function getSystemTheme(): ResolvedTheme {
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function resolveTheme(pref: ThemePreference): ResolvedTheme {
  return pref === 'system' ? getSystemTheme() : pref;
}

function applyTheme(resolved: ResolvedTheme) {
  document.documentElement.dataset.theme = resolved;
}

export const useThemeStore = create<ThemeState>((set, get) => ({
  theme: 'dark',
  resolved: 'dark',
  setTheme: (t) => {
    const resolved = resolveTheme(t);
    applyTheme(resolved);
    localStorage.setItem(STORAGE_KEY, t);
    set({ theme: t, resolved });
  },
  initTheme: () => {
    const stored = localStorage.getItem(STORAGE_KEY) as ThemePreference | null;
    const theme = stored && ['light', 'dark', 'system'].includes(stored) ? stored : 'dark';
    const resolved = resolveTheme(theme);
    applyTheme(resolved);
    set({ theme, resolved });

    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const listener = () => {
      const current = get();
      if (current.theme === 'system') {
        const newResolved = getSystemTheme();
        applyTheme(newResolved);
        set({ resolved: newResolved });
      }
    };
    mq.addEventListener('change', listener);
  },
}));
