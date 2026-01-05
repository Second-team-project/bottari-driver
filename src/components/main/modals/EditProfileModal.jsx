import { useDispatch, useSelector } from 'react-redux';
import './EditProfileModal.css';
import { useEffect, useState } from 'react';
import { PatternFormat } from 'react-number-format';
import { profileThunk } from '../../../store/thunks/profileThunk';
import { toast } from 'sonner';

export default function EditProfileModal({ open, onClose }) {
  const dispatch = useDispatch();

  // 기사 정보
  const { driver } = useSelector(state => state.auth);
  
  // 저장용 state
  const [driverName, setDriverName] = useState('');
  const [phone, setPhone] = useState('');
  const [carNumber, setCarNumber] = useState('');
  const [email, setEmail] = useState('');
  
  async function handleEditProfile(e) {
    // 기존 이벤트 취소
    e.preventDefault();
    
    const updatedData = {
      driverName,
      phone: phone.replace(/-/g, ''), // 하이픈 제거
      carNumber: carNumber.toUpperCase(), // 차량번호 대문자
      email
    };
    
    // thunk dispatch
    const resultAction = await dispatch(profileThunk(updatedData));

    if (profileThunk.fulfilled.match(resultAction)) {
      // 성공 시
      toast.success('개인정보가 수정되었습니다.');
      onClose();
    } else {
      // 실패 시
      toast.error('수정 실패: ' + (resultAction.payload?.data.msg || '알 수 없는 오류'));
    }
  }

  useEffect(() => {
    if(open && driver) {
      setDriverName(driver.driverName || '');
      setPhone(driver.phone || '');
      setCarNumber(driver.carNumber || '');
      setEmail(driver.email || '');
    }
  }, [open, driver]);
  
  if(!open) return null;

  return (
    <>
      <div className='modal-backdrop' onClick={onClose}>
        <div className='modal-container' onClick={e => e.stopPropagation()}>
          <p className='edit-modal-title'>개인 정보를 변경하시겠습니까?</p>
          <form className='edit-form'>
            <div className='edit-form-container'>
              <div className='edit-label-input-container'>
                <label htmlFor='edit-name'>이름 :</label>
                <input type="text" id='edit-name'
                  value={driverName}
                  onChange={(e) => setDriverName(e.target.value)}
                />
              </div>
              <div className='edit-label-input-container'>
                <label htmlFor='edit-phone'>전화번호 :</label>
                <PatternFormat
                  id='edit-phone'
                  className='edit-phone-input'
                  value={phone}
                  onValueChange={(values) => setPhone(values.value)}
                  format="###-####-####"
                />
              </div>
              <div className='edit-label-input-container'>
                <label htmlFor='edit-car-numder'>차량 번호 :</label>
                <input type="text" id='edit-car-numder'
                  value={carNumber}
                  onChange={(e) => setCarNumber(e.target.value)}
                />
              </div>
              <div>
                <div className='edit-label-input-container'>
                  <label htmlFor='edit-email'>이메일 :</label>
                  <input type="text" id='edit-email'
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <p className='edit-helper-text'>이메일을 등록할 경우 아이디, 비밀번호를 보다 쉽게 찾을 수 있습니다.</p>
              </div>
            </div>
            <div className='edit-btn-container'>
              <button type='button' className='cancel-btn' onClick={onClose}>취소</button>
              <button type='submit' className='confirm-btn' onClick={handleEditProfile}>저장</button>
            </div>
          </form>
        </div>
      </div>
    </>
  )
}