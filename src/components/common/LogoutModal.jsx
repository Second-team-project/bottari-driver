import './LogoutModal.css';

export default function LogoutModal({isOpen, onCancel, onConfirm}) {
  if(!isOpen) return null;

  return (
    <>
      <div className='modal-backdrop' onClick={onCancel}>
        <div className='modal-container' onClick={e => e.stopPropagation()}>
          <p className='logout-modal-title'>로그아웃 하시겠습니까?</p>
          <div className='logout-btn-container'>
            <button type='button' className='cancel-btn' onClick={onCancel}>취소</button>
            <button type='button' className='confirm-btn' onClick={onConfirm}>확인</button>
          </div>
        </div>
      </div>
    </>
  )
}