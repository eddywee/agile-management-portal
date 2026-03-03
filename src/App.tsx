// © Edmund Wallner
import { useState, useCallback, useEffect } from 'react';
import { Header } from './components/layout/Header';
import { Sidebar } from './components/layout/Sidebar';
import { Footer } from './components/layout/Footer';
import { PageRouter } from './components/layout/PageRouter';
import { ModalContainer } from './components/common/ModalContainer';
import { SearchOverlay } from './components/common/SearchOverlay';
import { UpdateToast } from './components/common/UpdateToast';
import { SetupWizard } from './components/setup/SetupWizard';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';
import { useUpdateChecker } from './hooks/useUpdateChecker';
import { useModalStore } from './store/modalStore';
import { usePIStore } from './store/piStore';
import { useAppStore } from './store/appStore';

function App() {
  const [searchOpen, setSearchOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const closeModal = useModalStore((s) => s.closeModal);
  const loadPIs = usePIStore((s) => s.loadPIs);

  const { isReady, isSetupComplete, loadAppState } = useAppStore();

  useEffect(() => {
    loadAppState();
  }, [loadAppState]);
  useEffect(() => {
    if (isSetupComplete) loadPIs();
  }, [isSetupComplete, loadPIs]);

  const openSearch = useCallback(() => setSearchOpen(true), []);
  const closeSearch = useCallback(() => setSearchOpen(false), []);
  const toggleSidebar = useCallback(() => setCollapsed((c) => !c), []);

  useKeyboardShortcuts(openSearch, closeSearch, closeModal);
  useUpdateChecker();

  if (!isReady) {
    return (
      <div className="setup-page">
        <div className="setup-loading">
          <div className="setup-spinner" />
        </div>
      </div>
    );
  }

  if (!isSetupComplete) {
    return <SetupWizard />;
  }

  return (
    <div className={`app${collapsed ? ' collapsed' : ''}`} id="app">
      <Header onOpenSearch={openSearch} onToggleSidebar={toggleSidebar} />
      <Sidebar />
      <PageRouter />
      <Footer />
      <ModalContainer />
      <UpdateToast />
      {searchOpen && <SearchOverlay onClose={closeSearch} />}
    </div>
  );
}

export default App;
