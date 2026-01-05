import { MoveRight } from 'lucide-react';
import './TransportStatusConfirmModal.css';

export default function TransportStatusConfirmModal({isOpen, onCancel, onConfirm, currentState}) {
  if(!isOpen) return null;

  const statusMap = {
    PICKING_UP: {
      current: "픽업 전",
      next: "운송 중",
      currentClass: "btn-blue", // Main.css의 변수 활용
      nextClass: "btn-pink"
    },
    IN_PROGRESS: {
      current: "운송 중",
      next: "완료",
      currentClass: "btn-pink",
      nextClass: "btn-gray"
    }
  };

  const config = statusMap[currentState] || statusMap.PICKING_UP;

  return (
    <>
      <div className='modal-backdrop' onClick={onCancel}>
        <div className='modal-container' onClick={e => e.stopPropagation()}>
          <p className='trans-port-status-title'>상태를 변경하시겠습니까?</p>

          <div className='trans-port-status-container'>
            <p className={`trans-port-status ${config.currentClass}`}>{config.current}</p>
            <MoveRight />
            <p className={`trans-port-status ${config.nextClass}`}>{config.next}</p>
          </div>

          <div className='trans-port-btn-container'>
            <button type='button' className='cancel-btn' onClick={onCancel}>취소</button>
            <button type='button' className='confirm-btn' onClick={onConfirm}>확인</button>
          </div>
        </div>
      </div>
    </>
  )
}