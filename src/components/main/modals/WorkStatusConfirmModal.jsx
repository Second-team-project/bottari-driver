import './WorkStatusConfirmModal.css';

export default function WorkStatusConfirmModal({ isOpen, nextStatus, onConfirm, onCancel }) {
  if (!isOpen) return null;

  return (
    <>
      <div className='modal-backdrop' onClick={onCancel}>
        <div className='modal-container' onClick={e => e.stopPropagation()}>
          <p className='work-status-modal-title'>
            {nextStatus ? "출근하시겠습니까?" : "퇴근하시겠습니까?"}
          </p>
          <div className='work-status-btn-container'>
            <button onClick={onCancel}>취소</button>
            <button onClick={onConfirm}>확인</button>
          </div>
        </div>
      </div>
    </>
  )
}