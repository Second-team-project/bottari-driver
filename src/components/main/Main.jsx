import './Main.css';
import { useEffect, useRef, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import EditProfileModal from './modals/EditProfileModal.jsx';
import WorkStatusConfirmModal from './modals/WorkStatusConfirmModal.jsx';

export default function Main() {
  const filterRef = useRef(null);

  // 개인정보 수정 모달
  const [editProfileOpen, setEditProfileOpen] = useState(false); // 모달 표시 여부

  // 근무중, 휴무 토글 버튼 모달
  const [isWorking, setIsWorking] = useState(false); // 근무 중, 휴무 버튼 실제 상태
  const [workPendingStatus, setWorkPendingStatus] = useState(null); // 바꾸려는 상태
  const [workStatusModalOpen, setWorkStatusModalOpen] = useState(false); // 모달 표시 여부

  // 정렬기준 선택 드랍박스
  const [sortBtnValue, setSortBtnValue] = useState('정렬 기준'); // 정렬 기준 버튼 value
  const [filterDropboxOpen, setFilterDropboxOpen] = useState(false); // 드랍 박스 on/off

  // 근무 중, 휴무 토글 상태 변경 요청
  const handleToggleRequest = () => {
    setWorkPendingStatus(!isWorking);
    setWorkStatusModalOpen(true);
  };

  // 확인 동작
  const handleConfirm = () => {
    setIsWorking(workPendingStatus);
    setWorkStatusModalOpen(false);
  };

  // 취소 동작
  const handleCancel = () => {
    setWorkPendingStatus(null);
    setWorkStatusModalOpen(false);
  };

  // 정렬 기준 필터 리스트
  const sortOptions = [
    { value: 'RESERVED', label: '픽업 전' },
    { value: 'IN_PROGRESS', label: '운송 중' },
    { value: 'COMPLETED', label: '완료' },
  ];
  
  // 정렬 드랍다운 리스트 값 클릭 시 버튼 값 바꾸고 드랍다운 닫기
  function handleSortChange(value) {
    setSortBtnValue(value);
    setFilterDropboxOpen(false);
  }

  useEffect(() => {
    // 드랍다운 외부 클릭 시 드랍다운 닫기
    function handleSearchClickOutside(event) {
      const clickOutsideOptions = filterRef.current && !filterRef.current.contains(event.target)
      
      if(clickOutsideOptions) {
        setFilterDropboxOpen(false);
      }
    }
    document.addEventListener("mousedown", handleSearchClickOutside);

    return () => document.removeEventListener("mousedown", handleSearchClickOutside);
  }, [])

  return (
    <>
     {/* 기사 개인정보 */}
      <div className='driver-info'>
        <div className='info-left'>
          <div className='info-left-top'>
            <p>안녕하세요.</p>
            <p>보따리 기사님</p>
          </div>
          <p className='info-left-bottom'>오늘은 2025-12-12 입니다.</p>
        </div>
        <div className='info-right'>
          {/* 개인정보 수정 버튼 */}
          <button type='button'
            className='info-modify'
            onClick={() => setEditProfileOpen(true)}
          >
            정보 수정 하기
          </button>

          {/* 개인정보 수정 모달 */}
          <EditProfileModal
            open={editProfileOpen}
            onClose={() => setEditProfileOpen(false)}
          />

          {/* 근무 중, 휴무 버튼 */}
          <button
            type="button"
            className={`toggle ${isWorking ? "on" : "off"}`}
            aria-pressed={isWorking}
            aria-label={isWorking ? "근무중" : "휴무"}
            onClick={handleToggleRequest}
          >
            <span className="knob" />
            <span className="label">
              {isWorking ? "근무중" : "휴무"}
            </span>
          </button>

          {/* 근무 중, 휴무 토글 확인 모달 */}
          <WorkStatusConfirmModal
            isOpen={workStatusModalOpen}
            nextStatus={workPendingStatus}
            onConfirm={handleConfirm}
            onCancel={handleCancel}
          />
        </div>
      </div>

      {/* 대시보드 */}
      <div className='driver-dashboard'>
        <div className='white-box'>
          <div className='dashboard-left'>
            <p>이번 달 실적</p>
            <p>55</p>
          </div>
          <div className='dashboard-line'></div>
          <div className='dashboard-right'>
            <p>오늘 실적</p>
            <p>6</p>
          </div>
        </div>
      </div>

      {/* 예약 리스트 */}
      <div className='reservation-list'>
        <div className='reservation-header'>
          <p className='list-title'>오늘의 예약</p>
          <div className='sort-dropdown-container' ref={filterRef}>
            <button type='button'
              className='sort-btn'
              onClick={() => setFilterDropboxOpen(!filterDropboxOpen)}
              >
              {sortBtnValue}
              <ChevronDown size={15} className={`sort-dropdown-arrow ${filterDropboxOpen ? 'sort-open' : ''}`} />
            </button>
            {/* 정렬 드랍다운 */}
            {filterDropboxOpen && (
              <ul className="sort-dropdown">
                {sortOptions.map((option) => (
                  <li key={option.value}
                    className="sort-dropdown-item"
                    onClick={() => handleSortChange(option.label)}
                  >
                    {option.label}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
        <div className='list-container'>
          <div className='list-card'>
            <button type='button' className='reservation-state-btn btn-blue'>픽업 전</button>
            <div className='reservation-flow'>
              <div className='flex-between'>
                <div className='reservation-place'>
                  <p className='reservation-label'>출발지</p>
                  <p>주소</p>
                </div>
                <p className='reservation-time'>시간</p>
              </div>
              <div className='flex-between'>
                <div className='reservation-place'>
                  <p className='reservation-label'>도착지</p>
                  <p>주소</p>
                </div>
                <p className='reservation-time'>시간</p>
              </div>
              <div className='flex-between'>
                <p className='reservation-label'>짐</p>
                <p>여행용 캐리어</p>
              </div>
            </div>
          </div>

          <div className='list-card'>
            <button className='reservation-state-btn btn-pink'>운송 중</button>
            <div className='reservation-flow'>
              <div className='flex-between'>
                <div className='reservation-place'>
                  <p className='reservation-label'>출발지</p>
                  <p>주소</p>
                </div>
                <p className='reservation-time'>시간</p>
              </div>
              <div className='flex-between'>
                <div className='reservation-place'>
                  <p className='reservation-label'>도착지</p>
                  <p>주소</p>
                </div>
                <p className='reservation-time'>시간</p>
              </div>
              <div className='flex-between'>
                <p className='reservation-label'>짐</p>
                <p>여행용 캐리어</p>
              </div>
            </div>
          </div>

          <div className='list-card'>
            <button className='reservation-state-btn btn-gray'>완료</button>
            <div className='reservation-flow'>
              <div className='flex-between'>
                <div className='reservation-place'>
                  <p className='reservation-label'>출발지</p>
                  <p>주소</p>
                </div>
                <p className='reservation-time'>시간</p>
              </div>
              <div className='flex-between'>
                <div className='reservation-place'>
                  <p className='reservation-label'>도착지</p>
                  <p>주소</p>
                </div>
                <p className='reservation-time'>시간</p>
              </div>
              <div className='flex-between'>
                <p className='reservation-label'>짐</p>
                <p>여행용 캐리어</p>
              </div>
            </div>
          </div>

          <div className='list-card'>
            <button className='reservation-state-btn btn-blue'>픽업 전</button>
            <div className='reservation-flow'>
              <div className='flex-between'>
                <div className='reservation-place'>
                  <p className='reservation-label'>출발지</p>
                  <p>주소</p>
                </div>
                <p className='reservation-time'>시간</p>
              </div>
              <div className='flex-between'>
                <div className='reservation-place'>
                  <p className='reservation-label'>도착지</p>
                  <p>주소</p>
                </div>
                <p className='reservation-time'>시간</p>
              </div>
              <div className='flex-between'>
                <p className='reservation-label'>짐</p>
                <p>여행용 캐리어</p>
              </div>
            </div>
          </div>

          <div className='list-card'>
            <button className='reservation-state-btn btn-blue'>픽업 전</button>
            <div className='reservation-flow'>
              <div className='flex-between'>
                <div className='reservation-place'>
                  <p className='reservation-label'>출발지</p>
                  <p>주소</p>
                </div>
                <p className='reservation-time'>시간</p>
              </div>
              <div className='flex-between'>
                <div className='reservation-place'>
                  <p className='reservation-label'>도착지</p>
                  <p>주소</p>
                </div>
                <p className='reservation-time'>시간</p>
              </div>
              <div className='flex-between'>
                <p className='reservation-label'>짐</p>
                <p>여행용 캐리어</p>
              </div>
            </div>
          </div>

          <div className='list-card'>
            <button className='reservation-state-btn btn-blue'>픽업 전</button>
            <div className='reservation-flow'>
              <div className='flex-between'>
                <div className='reservation-place'>
                  <p className='reservation-label'>출발지</p>
                  <p>주소</p>
                </div>
                <p className='reservation-time'>시간</p>
              </div>
              <div className='flex-between'>
                <div className='reservation-place'>
                  <p className='reservation-label'>도착지</p>
                  <p>주소</p>
                </div>
                <p className='reservation-time'>시간</p>
              </div>
              <div className='flex-between'>
                <p className='reservation-label'>짐</p>
                <p>여행용 캐리어</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </>
  )

}