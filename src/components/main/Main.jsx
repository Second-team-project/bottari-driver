import './Main.css';
import { useEffect, useRef, useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import EditProfileModal from './modals/EditProfileModal.jsx';
import WorkStatusConfirmModal from './modals/WorkStatusConfirmModal.jsx';
import dayjs from 'dayjs';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'sonner';
import TransportStatusConfirmModal from './modals/TransportStatusConfirmModal.jsx';
import { statusThunk, toggleThunk } from '../../store/thunks/attendanceThunk.js';
import { assignedThunk } from '../../store/thunks/deliveriesThunk.js';

export default function Main() {
  const dispatch = useDispatch();

  const filterRef = useRef(null);

  // 기사 개인정보, 현재 근무 상태
  const { driver, isAttendanceState } = useSelector(state => state.auth);
  // 예약 정보
  const { list } = useSelector(state => state.deliveries);

  // 개인정보 수정 모달
  const [editProfileOpen, setEditProfileOpen] = useState(false); // 모달 표시 여부
  
  // 근무중, 휴무 토글 버튼 모달
  const [workPendingStatus, setWorkPendingStatus] = useState(null); // 바꾸려는 상태
  const [workStatusModalOpen, setWorkStatusModalOpen] = useState(false); // 모달 표시 여부
  
  // 정렬기준 선택 드랍박스
  const [sortBtnValue, setSortBtnValue] = useState('정렬 기준'); // 정렬 기준 버튼 value
  const [filterDropboxOpen, setFilterDropboxOpen] = useState(false); // 드랍 박스 on/off

  // 아코디언 상태 관리 (열려있는 카드의 ID 저장)
  const [expandedId, setExpandedId] = useState(null);
  
  // 배송 상태 변경 모달
  const [isState, setIsState] = useState(false); // 실제 배송 상태
  const [transportPendingStatus, setTransportPendingStatus] = useState(null); // 바꾸려는 상태
  const [transportStateOpen, setTransportStateOpen] = useState(false); // 모달 표시 여부

  // 오늘 날짜 포멧
  const today = dayjs().format('YYYY-MM-DD');

  // 근무 중, 휴무 토글 상태 변경 요청
  const handleToggleRequest = () => {
    const nextState = isAttendanceState ? 'CLOCKED_OUT' : 'CLOCKED_IN';
    setWorkPendingStatus(nextState);
    setWorkStatusModalOpen(true);
  };
  // 확인 동작
  const handleConfirm = async () => {
    try {
      const resultAction = await dispatch(toggleThunk({ nextState: workPendingStatus }));
      
      if (toggleThunk.fulfilled.match(resultAction)) {
        toast.success(workPendingStatus === 'CLOCKED_IN' ? "출근되었습니다." : "퇴근되었습니다.");
        setWorkStatusModalOpen(false);
      } else {
        toast.error(resultAction.payload?.data.msg || "상태 변경에 실패했습니다.");
      }
    } catch (error) {
      toast.error("시스템 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
    }
  };
  // 취소 동작
  const handleCancel = () => {
    setWorkPendingStatus(null);
    setWorkStatusModalOpen(false);
    setTransportStateOpen(false);
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
  

  // 배송 상태 변경 버튼 클릭
  function handlereservationStateChange(e) {
    if (e) e.stopPropagation();
    setTransportStateOpen(true);
  }

  
  // 아코디언 토글 함수
  const toggleAccordion = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };
  
  const stateMapping = {
    RESERVED: { label: '픽업 전', className: 'btn-blue' },
    IN_PROGRESS: { label: '운송 중', className: 'btn-pink' },
    COMPLETED: { label: '완료', className: 'btn-gray' },
  };

  // 전화번호 포멧
  const formatPhone = (val) => {
    if (!val) return "";
    // 숫자만 남기기 (혹시 모를 공백이나 특수문자 제거)
    const s = val.replace(/\D/g, "");
    // 010-1234-5678 또는 010-123-4567 대응
    return s.replace(/(\d{3})(\d{3,4})(\d{4})/, "$1-$2-$3");
  };

  useEffect(() => {
    dispatch(statusThunk());
    dispatch(assignedThunk());
    
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
            <p>{`${driver.driverName} 기사님`}</p>
          </div>
          <p className='info-left-bottom'>{`오늘은 ${today} 입니다.`}</p>
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
            className={`toggle ${isAttendanceState ? "on" : "off"}`}
            aria-pressed={isAttendanceState}
            aria-label={isAttendanceState ? "근무중" : "휴무"}
            onClick={handleToggleRequest}
          >
            <span className="knob" />
            <span className="label">
              {isAttendanceState ? "근무중" : "휴무"}
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

        {/* 배송 예약 리스트 */}
        <div className='list-container'>
          {list && list.map((item) => {
            const isExpanded = expandedId === item.id;
            const currentState = stateMapping[item.deliveryState] || stateMapping.RESERVED;

            return (
              // 상단 기본 정보 영역 (클릭 시 아코디언 토글)
              <div key={item.id} className="list-card" onClick={() => toggleAccordion(item.id)}>
                <div className="card-header-row">
                  <button type='button'
                    className={`reservation-state-btn ${currentState.className}`}
                    onClick={handlereservationStateChange}
                  >
                    {currentState.label}
                  </button>
                </div>

                <div className='reservation-flow'>
                  {/* 출발지 */}
                  <div className='flex-between'>
                    <div className='reservation-place'>
                      <p className='reservation-label'>출발지</p>
                      <p className='addr-text'>{item.startAddr}</p>
                    </div>
                    <p className='reservation-time'>{item.pickupTime}</p>
                  </div>

                  {/* 도착지 */}
                  <div className='flex-between'>
                    <div className='reservation-place'>
                      <p className='reservation-label'>도착지</p>
                      <p className='addr-text'>{item.endAddr}</p>
                    </div>
                    <p className='reservation-time'>{item.deliveryTime}</p>
                  </div>

                    {/* 짐 목록 (여러 개일 경우 줄바꿈) */}
                    <div className='flex-between items-start'>
                      <p className='detail-label'>짐</p>
                      <div className='luggage-list'>
                        {item.luggageList && item.luggageList.length > 0 ? (
                          item.luggageList.map((lugText, idx) => (
                            <p key={idx} className="luggage-item">{lugText}</p>
                          ))
                        ) : (
                          <p className="luggage-item">짐 정보 없음</p>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="accordion-arrow-row">
                    {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                  </div>

                {/* 아코디언 상세 정보 영역 (예약자 성함, 전화번호, 요청사항) */}
                {isExpanded && (
                  <div className='accordion-detail'>
                    <div className='detail-divider'></div>
                    <div className='detail-content'>
                      <div className='flex-between'>
                        <p className='detail-label'>예약자</p>
                        <p>{item.userName}</p>
                      </div>
                      <div className='flex-between'>
                        <p className='detail-label'>전화번호</p>
                        <p>{formatPhone(item.userPhone)}</p>
                      </div>
                      <div className='flex-between label-top'>
                        <p className='detail-label'>요청사항</p>
                        <p className='detail-value'>{item.request || '요청사항이 없습니다.'}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
        {/* 배송 상태 변경 모달 */}
        <TransportStatusConfirmModal
          isOpen={transportStateOpen}
          onCancel={handleCancel}
        />
      </div>
    </>
  )
  
}