import { useDispatch } from 'react-redux';
import './Login.css';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { loginThunk } from '../../store/thunks/authThunk.js';
import { toast, Toaster } from 'sonner';

export default function Login() {
  const dispatch = useDispatch();
  const navigate= useNavigate();

  const [id, setId] = useState('');
  const [password, setPassword] = useState('');

  async function handleLogin(e) {
    // 기존 이벤트 취소
    e.preventDefault();

    try {
      // 로그인 요청
      await dispatch(loginThunk({id, password})).unwrap();
      
      return navigate('/main', { replace: true });
    } catch(error) {
      console.log(error);
      const code = error.response?.data?.code;
      toast.error(`로그인에 실패했습니다. ${code}`);
    }
  }

  return (
    <>
      <Toaster position="top-center" />
      {/* info */}
      <div className='login-info-container'>
        <p className='login-info-greeting'>안녕하세요. 기사님</p>
        <p className='login-info-date'>오늘은 2025-12-12 입니다.</p>
      </div>
      
      {/* 로그인 */}
      <div>
        <form className='login-container'>
          <input type="text" className='login-input-id' onChange={ e => { setId(e.target.value) } } placeholder='아이디' />
          <input type="text" className='login-input-password' onChange={e => { setPassword(e.target.value) }} placeholder='패스워드' />
          <button type='submit' className='login-btn' onClick={handleLogin}>로그인</button>
        </form>
      </div>
    </>
  )
}