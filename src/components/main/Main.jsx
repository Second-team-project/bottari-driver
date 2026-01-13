import './Main.css';
import { useEffect, useRef, useState } from 'react';
import { ArrowUpToLine, Check, ChevronDown, ChevronUp } from 'lucide-react';
import EditProfileModal from './modals/EditProfileModal.jsx';
import WorkStatusConfirmModal from './modals/WorkStatusConfirmModal.jsx';
import dayjs from 'dayjs';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'sonner';
import TransportStatusConfirmModal from './modals/TransportStatusConfirmModal.jsx';
import { statusThunk, toggleThunk } from '../../store/thunks/attendanceThunk.js';
import { assignedThunk, updateStateThunk } from '../../store/thunks/deliveriesThunk.js';
import SkeletonCard from './skeletons/SkeletonCard.jsx';
// 위치 저장용 커스텀 훅
import useLocationTracker from '../../hooks/useLocationTracker.js';

export default function Main() {
  const dispatch = useDispatch();

  const filterRef = useRef(null);
  const loadingStartTime = useRef(null);

  // 오늘 날짜 포멧
  const today = dayjs().format('YYYY-MM-DD');


  // 기사 개인정보, 현재 근무 상태
  const { driver, isAttendanceState} = useSelector(state => state.auth);
  // 예약 정보
  const { list, monthPerformance, todayPerformance, loading } = useSelector(state => state.deliveries);

  // 개인정보 수정 모달
  const [editProfileOpen, setEditProfileOpen] = useState(false); // 모달 표시 여부
  
  // 근무중, 휴무 토글 버튼 모달
  const [workPendingStatus, setWorkPendingStatus] = useState(null); // 바꾸려는 상태
  const [workStatusModalOpen, setWorkStatusModalOpen] = useState(false); // 모달 표시 여부
  
  // 날짜 선택
  const [selectedDate, setSelectedDate] = useState(today);

  // 정렬기준 선택 드랍박스
  const [sortBtnValue, setSortBtnValue] = useState('전체'); // 정렬 기준 버튼 value
  const [filterDropboxOpen, setFilterDropboxOpen] = useState(false); // 드랍 박스 on/off

  // 스켈레톤 표시 여부
  const [showSkeleton, setShowSkeleton] = useState(false);

  // 아코디언 상태 관리 (열려있는 카드의 ID 저장)
  const [expandedId, setExpandedId] = useState(null);
  
  // 배송 상태 변경 모달
  const [selectedItem, setSelectedItem] = useState(null); // 선택된 예약 객체
  const [transportStateOpen, setTransportStateOpen] = useState(false); // 모달 표시 여부

  // 스크롤이 생겼을 시 최상단으로 이동 버튼
  const [showTopBtn, setShowTopBtn] = useState(false); // 버튼 표시 여부 상태

  // DB에 gps 저장용
  const { startTracking, stopTracking } = useLocationTracker();
  useEffect(() => {
    // 출근 중이면 → 1분마다 gps 저장
    if (isAttendanceState) {
      startTracking();

    // 출근 중이 아니라면 → 저장 안 함
    } else {
      stopTracking();
    }
    return () => stopTracking();
  }, [isAttendanceState]);

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
        toast.error(resultAction.payload?.msg || "시스템 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
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


  // 예약 목록 날짜 변경
  const handleDateChange = (e) => {
    const newDate = e.target.value;

    setSelectedDate(newDate);
    
    // Thunk 호출 시 날짜 인자 전달
    dispatch(assignedThunk(newDate));
  };


  // 정렬 기준 필터 리스트
  const sortOptions = [
    { value: 'ALL_LIST', label: '전체' },
    { value: 'RESERVED', label: '픽업 전' },
    { value: 'PICKING_UP', label: '픽업 중' },
    { value: 'IN_PROGRESS', label: '운송 중' },
    { value: 'COMPLETED', label: '완료' },
  ];

  // 정렬 드랍다운 리스트 값 클릭 시 버튼 값 바꾸고 드랍다운 닫기
  function handleSortChange(value) {
    setSortBtnValue(value);
    setFilterDropboxOpen(false);
  }


  // loading 상태에 따른 스켈레톤 노출 제어
  useEffect(() => {
    let delayTimer;
    let minDisplayTimer;

    if (loading) {
      // 로딩 시작 시점 기록
      loadingStartTime.current = Date.now();
      
      // 200ms 지연 후 스켈레톤 표시
      delayTimer = setTimeout(() => {
        setShowSkeleton(true);
      }, 200);
    } else {
      // 로딩이 끝났을 때의 경과 시간 계산
      const elapsedTime = loadingStartTime.current 
        ? Date.now() - loadingStartTime.current 
        : 0;
      
      const minDisplayTime = 300; 

      if (showSkeleton) {
        // 이미 스켈레톤이 떴다면 남은 시간만큼 더 보여줌
        const remainingTime = Math.max(0, minDisplayTime - elapsedTime);
        minDisplayTimer = setTimeout(() => {
          setShowSkeleton(false);
        }, remainingTime);
      } else {
        // 아직 안 떴다면 타이머 취소하고 바로 종료
        clearTimeout(delayTimer);
        setShowSkeleton(false);
      }
    }

    return () => {
      clearTimeout(delayTimer);
      clearTimeout(minDisplayTimer);
    };
  }, [loading]);
  

  // 배송 상태 변경 버튼 클릭
  function handlereservationStateChange(e, item) {
    if (e) e.stopPropagation();

    // 완료된 건은 더 이상 변경 불가
    if (item.deliveryState === 'COMPLETED') {
      toast.info("이미 완료된 배송입니다.");
      return;
    }

    setSelectedItem(item); // [추가] 클릭한 카드의 정보를 저장
    setTransportStateOpen(true);
  }

  // 배송 상태 변경 확인 버튼
  const handleTransportConfirm = async () => {
    if(!selectedItem) return;

    const resultAction = await dispatch(updateStateThunk({
      resId: selectedItem.resId,
      currentState: selectedItem.deliveryState
    }));

    if(updateStateThunk.fulfilled.match(resultAction)) {
      toast.success("상태가 변경되었습니다.");

      setTransportStateOpen(false);
      dispatch(assignedThunk()); // 서버에서 최신 실적과 리스트를 다시 불러옴
    } else {
      toast.error(resultAction.payload?.msg || "시스템 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
    }
  };

  
  // 아코디언 토글 함수
  const toggleAccordion = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };
  
  const stateMapping = {
    RESERVED: { label: '픽업 전', className: 'btn-navy' },
    PICKING_UP: { label: '픽업 중', className: 'btn-blue' },
    IN_PROGRESS: { label: '운송 중', className: 'btn-pink' },
    COMPLETED: { label: '완료', className: 'btn-gray' },
  };

  // 정렬 함수
  const getSortedList = () => {
    if (!list) return [];

    const isLookingAtToday = selectedDate === today;

    // 1. 필터링 로직
    const filteredList = list.filter(item => {
      // [Case 1] 드롭다운 필터가 특정 상태(픽업 전, 완료 등)를 가리킬 때 -> 해당 상태만 필터링
      if (sortBtnValue !== '전체') {
        const selectedOption = sortOptions.find(opt => opt.label === sortBtnValue);
        return item.deliveryState === selectedOption?.value;
      }

      // [Case 2] 드롭다운 필터가 '전체'일 때
      if (isLookingAtToday) {
        // 오늘 날짜라면: '완료'된 건은 제외하고 보여줌
        return item.deliveryState !== 'COMPLETED';
      } else {
        // 오늘이 아닌 날짜(미래/과거)라면: '완료' 포함 모든 상태를 다 보여줌
        return true;
      }
    });
    
    // 2. 정렬 로직 (반드시 필터링 된 결과 뒤에 chaining 하거나 새로 할당)
    // 순서: RESERVED(픽업전) -> PICKING_UP(픽업중) -> IN_PROGRESS(운송중) -> COMPLETED(완료)
    const priority = ['RESERVED', 'PICKING_UP', 'IN_PROGRESS', 'COMPLETED'];

    return [...filteredList].sort((a, b) => {
      const indexA = priority.indexOf(a.deliveryState);
      const indexB = priority.indexOf(b.deliveryState);

      // 인덱스 값을 비교하여 정렬 (작은 숫자가 위로)
      // 만약 정의되지 않은 상태가 있다면 맨 뒤로 보냄
      const sortA = indexA === -1 ? 999 : indexA;
      const sortB = indexB === -1 ? 999 : indexB;

      return sortA - sortB;
    });
  };

  // 정렬된 리스트를 변수에 할당
  const sortedList = getSortedList();

  // 전화번호 포멧
  const formatPhone = (val) => {
    if (!val) return "";
    // 숫자만 남기기 (혹시 모를 공백이나 특수문자 제거)
    const s = val.replace(/\D/g, "");
    // 010-1234-5678 또는 010-123-4567 대응
    return s.replace(/(\d{3})(\d{3,4})(\d{4})/, "$1-$2-$3");
  };

  function scrollToTop() {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
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

    const handleShowButton = () => {
      if (window.scrollY > 250) { // 300px 이상 스크롤 되면 버튼 보임
        setShowTopBtn(true);
      } else {
        setShowTopBtn(false);
      }
    };

    window.addEventListener("scroll", handleShowButton);
    
    return () => {
      window.removeEventListener("scroll", handleShowButton);
      document.removeEventListener("mousedown", handleSearchClickOutside)
    };
  }, [])
  
  return (
    <>
     {/* 기사 개인정보 */}
      <div className='driver-info'>
        <div className='info-top'>
          <div className='info-left-top'>
            <p>안녕하세요.</p>
            <p>{`${driver.driverName} 기사님`}</p>
          </div>
          {/* 개인정보 수정 버튼 */}
          <button type='button'
            className='info-modify'
            onClick={() => setEditProfileOpen(true)}
          >
            정보 수정 하기
          </button>
        </div>
        <div className='info-bottom'>
          <p className='info-left-bottom'>{`오늘은 ${today} 입니다.`}</p>

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
            <p>{monthPerformance}</p>
          </div>
          <div className='dashboard-line'></div>
          <div className='dashboard-right'>
            <p>오늘 실적</p>
            <p>{todayPerformance}</p>
          </div>
        </div>
      </div>

      {/* 예약 리스트 */}
      <div className='reservation-list'>
        <div className='reservation-header'>
          <p className='list-title'>{selectedDate === today ? '오늘의 예약' : `${dayjs(selectedDate).format('MM/DD')} 예약`}</p>
          <div className='list-filter-container'>
            {/* 날짜 선택 */}
            <div className='list-date-container'>
              <input type="date"
                className='list-date-input'
                value={selectedDate}
                onChange={handleDateChange}
              />
            </div>

            {/* 정렬 선택 */}
            <div className='sort-dropdown-container' ref={filterRef}>
              <button type='button'
                className={`sort-btn ${filterDropboxOpen ? 'sort-open' : ''}`}
                onClick={() => setFilterDropboxOpen(!filterDropboxOpen)}
                >
                {sortBtnValue}
                <ChevronDown size={15} className={`sort-dropdown-arrow ${filterDropboxOpen ? 'sort-open' : ''}`} />
              </button>
              {/* 정렬 드랍다운 */}
              <ul className={`sort-dropdown ${filterDropboxOpen ? 'open' : ''}`}>
                {sortOptions.map((option) => {
                  const isActive = sortBtnValue === option.label;
                  return (
                    <li key={option.value}
                      className={`sort-dropdown-item ${isActive ? 'active' : ''}`}
                      onClick={() => handleSortChange(option.label)}
                    >
                      {option.label}
                      {isActive &&
                        <span className="check-mark">
                          <Check size={13} />
                        </span>
                      }
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </div>

        {/* 배송 예약 리스트 */}
        {
          showSkeleton ? (
            <div className='skeleton-container'>
              <SkeletonCard />
              <SkeletonCard />
              <SkeletonCard />
            </div>
          ) : (
            <div className='list-container'>
              {sortedList.length > 0 ?
                (sortedList.map((item) => {
                  const isExpanded = expandedId === item.id;
                  const currentState = stateMapping[item.deliveryState] || '';

                  return (
                    // 상단 기본 정보 영역 (클릭 시 아코디언 토글)
                    <div key={item.id} className="list-card" onClick={() => toggleAccordion(item.id)}>
                      <div className="card-header-row">
                        <button type='button'
                          className={`reservation-state-btn ${currentState.className}`}
                          onClick={(e) => handlereservationStateChange(e, item)}
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
                                <p className="luggage-item">짐 정보가 존재하지 않습니다.</p>
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
                              <p className='detail-value'>{item.request || '요청사항 없음'}</p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })
              ) : (
                <div className='list-none-container'>
                  <p>
                    현재 배정된 예약 건이 없습니다.
                  </p>
                </div>
              )}
            </div>
          )
        }

        {/* 위로 올라가는 버튼 */}
        {
          showTopBtn && (
            <button type='button' className='list-top-btn' onClick={scrollToTop}>
              <ArrowUpToLine color='#ffffff' />
            </button>
          )
        }

        {/* 배송 상태 변경 모달 */}
        <TransportStatusConfirmModal
          isOpen={transportStateOpen}
          currentState={selectedItem?.deliveryState} // 현재 상태 전달
          onConfirm={handleTransportConfirm}         // 확인 함수 전달
          onCancel={handleCancel}
        />
      </div>

      {/* 푸터 */}
      <div className='driver-footer-container'>
        <p>(주)보따리 | 대표  김보따 | 개인정보 보호책임자  김보따</p>
        <p>주소  대구광역시 중구 중앙대로 394 5층 | 전화  053 572 1005</p>
        <p>COPYRIGHT © 2026 BOTTARI.ALL RIGHTS RESERVED.</p>
      </div>
    </>
  )
  
}