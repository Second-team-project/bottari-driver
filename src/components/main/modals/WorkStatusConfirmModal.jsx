import './WorkStatusConfirmModal.css';

export default function WorkStatusConfirmModal({ isOpen, nextStatus, onConfirm, onCancel }) {
  if (!isOpen) return null;

  // nextStatus 문자열에 따른 텍스트 분기 처리
  const isClockIn = nextStatus === 'CLOCKED_IN';

  return (
    <>
      <div className='modal-backdrop' onClick={onCancel}>
        <div className='modal-container' onClick={e => e.stopPropagation()}>
          <p className='work-status-modal-title'>
            {isClockIn ? "출근하시겠습니까?" : "퇴근하시겠습니까?"}
          </p>
          <div className='work-status-btn-container'>
            <button type='button' className='cancel-btn' onClick={onCancel}>취소</button>
            <button type='button' className='confirm-btn' onClick={onConfirm}>확인</button>
          </div>
        </div>
      </div>
    </>
  )
}