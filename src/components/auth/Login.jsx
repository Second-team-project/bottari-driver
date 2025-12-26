import { useDispatch } from 'react-redux';
import './Login.css';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { loginThunk } from '../../store/thunks/authThunk.js';
import { toast, Toaster } from 'sonner';
import dayjs from 'dayjs';

export default function Login() {
  const dispatch = useDispatch();
  const navigate= useNavigate();

  const [id, setId] = useState('');
  const [password, setPassword] = useState('');

  // 오늘 날짜 포멧
    const today = dayjs().format('YYYY-MM-DD');

  async function handleLogin(e) {
    // 기존 이벤트 취소
    e.preventDefault();

    try {
      // 로그인 요청
      await dispatch(loginThunk({ id: id.trim(), password: password.trim() })).unwrap();
      
      return navigate('/main', { replace: true });
    } catch(error) {
      const rawMessage = error.response?.data?.data?.[0];

      function extractAfterColon(message) {
        // 문자열이 아니거나, 문자열이어도 값이 비어 있으면 처리하지 마라 라는 방어코드
        if (!message || typeof message !== 'string') return '';

        // 첫 ':'를 찾아 인덱스를 저장
        const idx = message.indexOf(':');

        // 첫 ':' 뒤 문장을 리턴
        // -1은 ':'가 없을 때 즉 기준점을 찾지 못 했을 때
        return idx === -1 ? message : message.slice(idx + 1).trim();
      }

      const messageFormet = extractAfterColon(rawMessage);

      toast.error(messageFormet ? messageFormet : '로그인에 실패했습니다.');
    }
  }

  return (
    <>
      {/* info */}
      <div className='login-info-container'>
        <p className='login-info-greeting'>안녕하세요. 기사님</p>
        <p className='login-info-date'>{`오늘은 ${today} 입니다.`}</p>
      </div>
      
      {/* 로그인 */}
      <div>
        <form className='login-container'>
          <input type="text" className='login-input-id' onChange={ e => { setId(e.target.value) } } placeholder='아이디' />
          <input type="password" className='login-input-password' onChange={e => { setPassword(e.target.value) }} placeholder='패스워드' />
          <button type='submit' className='login-btn' onClick={handleLogin}>로그인</button>
        </form>
      </div>
    </>
  )
}