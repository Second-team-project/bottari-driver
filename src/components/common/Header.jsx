import './Header.css';
import BottariLogo2 from '../logo/BottariLogo2.jsx';
import { LogOut } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { clearAuth } from '../../store/slices/authSlice.js';
import { clearDeliveryData } from '../../store/slices/deliveriesSlice.js';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { logoutThunk } from '../../store/thunks/authThunk.js';
import { useState } from 'react';
import LogoutModal from './LogoutModal.jsx';

export default function Header() {
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // 로그아웃 모달 표시 여부
  const [logoutOpen, setLogoutOpen] = useState(false);

  // 숨기고 싶은 경로들 모음 배열
  const hiddenPatterns = [
    /^\/login$/,
  ]

  // 현재 경로가 hiddenLinkatterns에 포함되는지 체크
  const hideNav = hiddenPatterns.some(pattern => pattern.test(location.pathname));

  async function confirmLogOut() {
    try {
      await dispatch(logoutThunk()).unwrap();
      
      setLogoutOpen(false);

      navigate('/login', { replace: true });
      toast.success("로그아웃 되었습니다.");
    } catch (error) {
      console.log(error);
      toast.error(error.massege);
    }
  }

  return (
    <>
      <div className='header-container'>
        <div className='bottari-logo'>
          <BottariLogo2 width={120} height={75} />
        </div>
        {
          !hideNav && (
            <LogOut color='#1E1B4B' onClick={() => setLogoutOpen(true)} />
          )
        }
      </div>
      <LogoutModal
        isOpen={logoutOpen}
        onCancel={() => setLogoutOpen(false)}
        onConfirm={confirmLogOut}
      />
    </>
  )
}