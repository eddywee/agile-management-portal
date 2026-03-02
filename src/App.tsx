// © Edmund Wallner
import { useState, useCallback, useEffect } from 'react';
import { Header } from './components/layout/Header';
import { Sidebar } from './components/layout/Sidebar';
import { Footer } from './components/layout/Footer';
import { PageRouter } from './components/layout/PageRouter';
import { ModalContainer } from './components/common/ModalContainer';
import { SearchOverlay } from './components/common/SearchOverlay';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';
import { UpdateBanner } from './components/common/UpdateBanner';
import { useModalStore } from './store/modalStore';
import { usePIStore } from './store/piStore';

function App() {
  const [searchOpen, setSearchOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const closeModal = useModalStore((s) => s.closeModal);
  const loadPIs = usePIStore((s) => s.loadPIs);

  useEffect(() => { loadPIs(); }, [loadPIs]);

  const openSearch = useCallback(() => setSearchOpen(true), []);
  const closeSearch = useCallback(() => setSearchOpen(false), []);
  const toggleSidebar = useCallback(() => setCollapsed(c => !c), []);

  useKeyboardShortcuts(openSearch, closeSearch, closeModal);

  return (
    <div className={`app${collapsed ? ' collapsed' : ''}`} id="app">
      <UpdateBanner />
      <Header onOpenSearch={openSearch} onToggleSidebar={toggleSidebar} />
      <Sidebar />
      <PageRouter />
      <Footer />
      <ModalContainer />
      {searchOpen && <SearchOverlay onClose={closeSearch} />}
    </div>
  );
}

export default App;
