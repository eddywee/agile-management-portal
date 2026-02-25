// © Edmund Wallner - Mercedes-Benz AG
import { useModalStore } from '../../store/modalStore';

export function ModalContainer() {
  const { isOpen, title, content, actions, closeModal } = useModalStore();

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) closeModal(); }}>
      <div className="modal">
        <h3>{title}</h3>
        <div className="modal-body">{content}</div>
        <div className="modal-actions">{actions}</div>
      </div>
    </div>
  );
}
