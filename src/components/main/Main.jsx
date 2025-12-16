import './Main.css';
import { useState } from 'react';

export default function Main() {
  const [isWorking, setIsWorking] = useState(false);

  const handleClick = () => {
    setIsWorking(prev => !prev);
  };

  return (
    <>
      <div className='driver-info'>
        <div className='info-left'>
          <div>
            <p>안녕하세요.</p>
            <p>보따리 기사님</p>
          </div>
          <p>오늘은 2025-12-12 입니다.</p>
        </div>
        <div className='info-right'>
          <button>정보 수정 하기</button>
          <button
            type="button"
            className={`toggle ${isWorking ? "on" : "off"}`}
            aria-pressed={isWorking}
            aria-label={isWorking ? "근무중" : "휴무"}
            onClick={handleClick}
          >
            <span className="knob" />
            <span className="label">
              {isWorking ? "근무중" : "휴무"}
            </span>
          </button>
        </div>
      </div>
    </>
  )

}