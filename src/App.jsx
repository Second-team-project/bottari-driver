import './App.css'

import { Outlet } from 'react-router-dom';
import Header from './components/common/Header.jsx';
// import { useEffect } from 'react';
// import axiosIns from './api/axiosInstance.js';

function App() {

  // // 백엔드 연결 테스트
  // useEffect(() => {
  //   console.log('API URL:', import.meta.env.VITE_API_URL);
  //   const test = async () => {
  //     const res = await axiosIns.get('/test/success');
  //     console.log(res.data);
  //   };
  //   test();
  // }, []);

  return (
    <>
      <Header />
      <Outlet />
    </>
  )
}

export default App
