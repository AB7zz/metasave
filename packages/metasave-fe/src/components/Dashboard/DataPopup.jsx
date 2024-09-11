import '../../styles/ImagePopup.css'; // Adjust the path as needed

const DataPopup = ({ data, setClose }) => {
  if (!data) return null;
  return (
    <div className='image-popup-overlay'>
      <div className='image-popup-container'>
        {/* <video loop autoPlay>
          <source src="/fall.mp4" alt={alt || 'Image'} className='image-popup-image' />
        </video> */}
        <img src={`${import.meta.env.VITE_PINATA_BASE_URL}/ipfs/${data.imgIPFS}`} alt='Image' className='image-popup-image' />
        <div>
          <p>{data.username}</p>
          <p>{data.timestamp}</p>
          <p>{data.date}</p>
          <p>{data.status}</p>
        </div>
        <button 
          onClick={() => setClose(true)} 
          className='image-popup-close-btn'>
          Close
        </button>
      </div>
    </div>
  );
};

export default DataPopup;
