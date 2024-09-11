import React, { useEffect } from 'react';
import Sidebar from './Sidebar';
import { useMainContext } from '../../context/MainContext';
import { useAuthContext } from '../../context/AuthContext';
import DataPopup from '../../components/Dashboard/DataPopup';
 
const FallHistory = () => {
  const { CFAddress, walletProvider } = useAuthContext();
  const { fetchFallDetails, fetchUserDetails, fallDetails } = useMainContext();

  useEffect(() => {
    if (CFAddress && walletProvider) {
      fetchUserDetails(walletProvider, CFAddress);
      fetchFallDetails(walletProvider, CFAddress);
    }
  }, [CFAddress, walletProvider]);

  const Detail = ({ detail }) => {
    const [close, setClose] = React.useState(true);
    return (
      <div className='my-4'>
        <div className='flex justify-between items-center'>
          <h3 className='text-xl'>{detail.username}</h3>
          <button onClick={() => setClose(false)} className='text-blue-500 text-xl'>
            <u>View Image</u>
          </button>
          <div className='text-right'>
            <h3 className='text-xl'>{detail.date}</h3>
            
            <p className='text-gray-600 font-bold'>{detail.timestamp}</p>
          </div>
        </div>
        <hr className='border-[1.5px]' />
        {!close && <DataPopup data={detail} setClose={setClose} />}
      </div>
    );
  };

  return (
    <div className="flex sm:ml-64">
      <Sidebar />
      <div className="p-4 flex-1">
        <h1 className="poppins text-[#3a3a3a] text-3xl mb-5">
          Patient Fall History
        </h1>
        <div className='w-full'>
          {fallDetails.length > 0 ? (
            fallDetails.slice().reverse().map((detail, i) => (
              <Detail key={i} detail={detail} />
            ))
          ) : (
            <p>Loading...</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default FallHistory;
