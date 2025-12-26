import { useEffect, useState } from 'react';
import './App.css'
import Header from './components/common/Header.jsx';
import ProtectedRouter from './routes/ProtectedRouter.jsx';
import { reissueThunk } from './store/thunks/authThunk.js';
import { statusThunk } from './store/thunks/attendanceThunk.js';
import { useDispatch } from 'react-redux';
import { toast, Toaster } from 'sonner';
import { useNavigate } from 'react-router-dom';

function App() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [isInitializing, setIsInitializing] = useState(true); // 초기화 상태

  useEffect(() => {
    const initAuth = async () => {
      if (window.location.pathname.includes('/login')) {
        setIsInitializing(false);
        return;
      }

      try {
        await dispatch(reissueThunk()).unwrap();
        dispatch(statusThunk());
      } catch (error) {
        // 401(Unauthorized) 또는 403(Forbidden) 에러인 경우
        if (error.status === 401 || error.status === 403) {
          toast.error("세션이 만료되었습니다. 다시 로그인해주세요.");
          navigate('/login');
        } else {
          // 서버가 죽었거나 네트워크 오류인 경우
          toast.error("서버와의 연결이 원활하지 않습니다.");
        }
      } finally {
        setIsInitializing(false); // 성공하든 실패하든 로딩 종료
      }
    };

    initAuth();
  }, []);

  // 인증 확인 전에는 아무것도 안 그리거나 로딩바를 보여줍니다.
  if (isInitializing) return null;

  return (
    <>
      <Toaster position="top-center" />
      <Header />
      <ProtectedRouter />
    </>
  )
}

export default App
