import './App.css'

import { Outlet } from 'react-router-dom';
import { useEffect } from 'react';
import axiosIns from './api/axiosInstance.js';

function App() {

  // 백엔드 연결 테스트
  useEffect(() => {
    console.log('API URL:', import.meta.env.VITE_API_URL);
    const test = async () => {
      const res = await axiosIns.get('/test/success');
      console.log(res.data);
    };
    test();
  }, []);

  return (
    <>
      <div className='app-container'>
       
        <Outlet />
      </div>
    </>
  )
}

export default App
