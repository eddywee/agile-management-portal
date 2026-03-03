// © Edmund Wallner
import { useEffect, useState } from 'react';
import { useUpdateStore } from '@/store/updateStore';
import { openUpdateModal } from './UpdateModal';

export function UpdateToast() {
  const { update, toastVisible, hideToast } = useUpdateStore();
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    if (!toastVisible) {
      setExiting(false);
      return;
    }

    const timer = setTimeout(() => {
      setExiting(true);
      setTimeout(hideToast, 300);
    }, 8000);

    return () => clearTimeout(timer);
  }, [toastVisible, hideToast]);

  if (!toastVisible || !update) return null;

  const handleDetails = () => {
    hideToast();
    openUpdateModal();
  };

  return (
    <div className={`toast${exiting ? ' toast--exit' : ''}`}>
      <div className="toast__content">
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <polyline points="7 10 12 15 17 10" />
          <line x1="12" y1="15" x2="12" y2="3" />
        </svg>
        <span>
          Update Available &mdash; <strong>v{update.version}</strong>
        </span>
      </div>
      <button className="toast__action" onClick={handleDetails}>
        View Details
      </button>
    </div>
  );
}
