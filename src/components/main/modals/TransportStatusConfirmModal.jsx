import './TransportStatusConfirmModal.css';

export default function TransportStatusConfirmModal() {

  return (
    <>
      <div className='modal-backdrop'>
        <div className='modal-container' onClick={e => e.stopPropagation()}>

        </div>
      </div>
    </>
  )
}