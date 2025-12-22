import './EditProfileModal.css';

export default function EditProfileModal({ open, onClose }) {
  if(!open) return null;

  async function handleEditProfile(e) {
    // 기존 이벤트 취소
    e.preventDefault();
  }

  return (
    <>
      <div className='modal-backdrop' onClick={onClose}>
        <div className='modal-container' onClick={e => e.stopPropagation()}>
          <p className='edit-modal-title'>개인 정보를 변경하시겠습니까?</p>
          <form className='edit-form'>
            <div className='edit-form-container'>
              <div className='edit-label-input-container'>
                <label htmlFor='edit-name'>이름 :</label>
                <input type="text" id='edit-name' />
              </div>
              <div className='edit-label-input-container'>
                <label htmlFor='edit-phone'>전화번호 :</label>
                <input type="text" id='edit-phone' />
              </div>
              <div className='edit-label-input-container'>
                <label htmlFor='edit-car-numder'>차량 번호 :</label>
                <input type="text" id='edit-car-numder' />
              </div>
              <div>
                <div className='edit-label-input-container'>
                  <label htmlFor='edit-email'>이메일 :</label>
                  <input type="text" id='edit-email' />
                </div>
                <p className='edit-helper-text'>이메일을 등록할 경우 아이디, 비밀번호를 보다 쉽게 찾을 수 있습니다.</p>
              </div>
            </div>
            <div className='edit-btn-container'>
              <button type='button' onClick={onClose}>취소</button>
              <button type='submit' onClick={handleEditProfile}>저장</button>
            </div>
          </form>
        </div>
      </div>
    </>
  )
}