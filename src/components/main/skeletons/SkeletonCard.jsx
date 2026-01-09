

export default function SkeletonCard() {
  return (
    <div className="list-card skeleton-card">
      {/* 1. 상태 버튼 자리 (우측 상단) */}
      <div className="card-header-row">
        <div className="skeleton-item skeleton-btn"></div>
      </div>

      <div className='reservation-flow'>
        {/* 2. 출발지 라인 */}
        <div className='flex-between'>
          <div className='reservation-place'>
            <div className="skeleton-item skeleton-label"></div>
            <div className="skeleton-item skeleton-text-long"></div>
          </div>
          <div className="skeleton-item skeleton-time"></div>
        </div>

        {/* 3. 도착지 라인 */}
        <div className='flex-between'>
          <div className='reservation-place'>
            <div className="skeleton-item skeleton-label"></div>
            <div className="skeleton-item skeleton-text-mid"></div>
          </div>
        </div>

        {/* 4. 짐 목록 라인 */}
        <div className='flex-between items-start'>
          <div className="skeleton-item skeleton-label"></div>
          <div className="skeleton-item skeleton-text-short"></div>
        </div>
      </div>
      
      {/* 5. 하단 아코디언 화살표 자리 */}
      <div className="accordion-arrow-row">
        <div className="skeleton-item skeleton-circle"></div>
      </div>
    </div>
  );
}