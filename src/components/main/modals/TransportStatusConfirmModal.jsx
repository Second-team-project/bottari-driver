import './TransportStatusConfirmModal.css';

export default function TransportStatusConfirmModal({isOpen, onCancel}) {
  if(!isOpen) return null;

  return (
    <>
      <div className='modal-backdrop' onClick={onCancel}>
        <div className='modal-container' onClick={e => e.stopPropagation()}>
          <p>상태를 변경하시겠습니까?</p>
        </div>
      </div>
    </>
  )
}