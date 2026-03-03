// © Edmund Wallner
import { useUpdateStore } from '@/store/updateStore';
import { useModalStore } from '@/store/modalStore';

export function openUpdateModal() {
  useModalStore.getState().showModal(
    'Software Update',
    <UpdateModalContent />,
    null,
  );
}

function UpdateModalContent() {
  const { update, downloadStatus, downloadPercent, errorMessage, startDownload, dismissSession, skipVersion } = useUpdateStore();
  const closeModal = useModalStore((s) => s.closeModal);

  if (!update) return null;

  const isActive = downloadStatus === 'downloading' || downloadStatus === 'installing' || downloadStatus === 'restarting';

  const handleUpdate = () => { startDownload(); };
  const handleRemind = () => { dismissSession(); closeModal(); };
  const handleSkip = () => { skipVersion(update.version); closeModal(); };

  return (
    <>
      <div className="modal-body">
        <div className="update-modal__versions">
          <span className="update-modal__version-tag">v{__APP_VERSION__}</span>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="5" y1="12" x2="19" y2="12" />
            <polyline points="12 5 19 12 12 19" />
          </svg>
          <span className="update-modal__version-tag update-modal__version-tag--new">v{update.version}</span>
        </div>

        {update.body && (
          <div className="update-modal__notes">
            <label className="form-label">Release Notes</label>
            <div className="update-modal__notes-content">{update.body}</div>
          </div>
        )}

        {isActive && (
          <div className="update-modal__progress">
            <div className="update-modal__progress-bar">
              <div
                className="update-modal__progress-fill"
                style={{ width: `${downloadPercent}%` }}
              />
            </div>
            <span className="update-modal__progress-label">
              {downloadStatus === 'downloading' && `Downloading… ${downloadPercent}%`}
              {downloadStatus === 'installing' && 'Installing…'}
              {downloadStatus === 'restarting' && 'Restarting…'}
            </span>
          </div>
        )}

        {downloadStatus === 'failed' && (
          <div className="update-modal__error">
            Update failed: {errorMessage}
          </div>
        )}
      </div>
      <div className="modal-actions">
        {!isActive && (
          <>
            <button className="btn btn-outline btn-sm" onClick={handleSkip}>Skip This Version</button>
            <button className="btn btn-outline btn-sm" onClick={handleRemind}>Remind Me Later</button>
            <button className="btn btn-primary btn-sm" onClick={handleUpdate}>
              {downloadStatus === 'failed' ? 'Retry Update' : 'Update & Restart'}
            </button>
          </>
        )}
      </div>
    </>
  );
}
