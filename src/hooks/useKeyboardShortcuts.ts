// © Edmund Wallner
import { useEffect } from 'react';
import { useNavigationStore } from '../store/navigationStore';

export function useKeyboardShortcuts(onOpenSearch: () => void, onCloseSearch: () => void, onCloseModal: () => void) {
  const navigateTo = useNavigationStore((s) => s.navigateTo);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.tagName === 'SELECT') {
        if (e.key === 'Escape') { onCloseSearch(); onCloseModal(); }
        return;
      }
      const mod = e.metaKey || e.ctrlKey;
      if (mod && e.key === 'k') { e.preventDefault(); onOpenSearch(); }
      if (mod && e.key === '1') { e.preventDefault(); navigateTo('dashboard'); }
      if (mod && e.key === '2') { e.preventDefault(); navigateTo('organization'); }
      if (mod && e.key === '3') { e.preventDefault(); navigateTo('people'); }
      if (mod && e.key === 'i') { e.preventDefault(); navigateTo('import'); }
      if (e.key === 'Escape') { onCloseSearch(); onCloseModal(); }
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [navigateTo, onOpenSearch, onCloseSearch, onCloseModal]);
}
