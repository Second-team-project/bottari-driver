import './Login.css';

export default function Login() {
  return (
    <>
      {/* info */}
      <div className='login-info-container'>
        <p className='login-info-greeting'>안녕하세요. 기사님</p>
        <p className='login-info-date'>오늘은 2025-12-12 입니다.</p>
      </div>
      
      {/* 로그인 */}
      <div>
        <form className='login-container'>
          <input type="text" className='login-input-id' placeholder='아이디' />
          <input type="text" className='login-input-password' placeholder='패스워드' />
          <button type='submit' className='login-btn'>로그인</button>
        </form>
      </div>
    </>
  )
}