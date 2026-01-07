import './NotificationInfo.css';
import usePushNotifications from "../../hooks/usePushNotifications.jsx";
import { useSelector } from 'react-redux';
import { X } from 'lucide-react';

export default function NotificationInfo() {
  const { isInit, isSubscribing, isCheckedSubscribe, subscribeUser, dismissToday, dismissModal } = usePushNotifications();
  const { isLoggedIn } = useSelector(state => state.auth);

  return (
    <>
      {
        ( isLoggedIn && isInit && !isSubscribing && !isCheckedSubscribe) && (
          <div className="modal-backdrop">
            <div className="modal-container">
              <div className='modal-cancel-btn' onClick={dismissModal}>
                <X size={22} color='#888888' />
              </div>
              <p className='push-modal-title'>푸시 알림 권한 허용 요청</p>
              <div className='push-modal-content-box'>
                <p className='push-modal-content'>
                  푸시 알림을 허용하지 않을 시<br />
                  예약 배정 알림을 받을 수 없습니다.
                </p>
                <p className='push-modal-content'>따라서 알림 허용을 권장드립니다.</p>
                <p className='push-modal-content'>
                  알림을 허용하지 않아 생긴 모든 문제는<br />
                  귀하의 책임이며 귀사는 책임지지 않습니다.
                </p>
              </div>
              <div className="push-btn-container">
                <button type="button" className='cancel-btn' onClick={dismissToday}>하루 동안 보지 않기</button>
                <button type="button" className='confirm-btn' onClick={subscribeUser}>알림 허용</button>
              </div>
            </div>
          </div>
        )
      }
    </>
  )
}