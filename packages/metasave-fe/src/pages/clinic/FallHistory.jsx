import React from 'react'
import Sidebar from './Sidebar'
import { useMainContext } from '../../context/MainContext'
import { useAuthContext } from '../../context/AuthContext'
 
const FallHistory = () => {
    const { CFAddress, walletProvider } = useAuthContext()
    const {fetchFallDetails} = useMainContext()
    React.useEffect(() => {
    if (CFAddress && walletProvider) {
      fetchUserDetails(walletProvider, CFAddress)
      fetchFallDetails(walletProvider, CFAddress)
    }
  }, [
    CFAddress,
    walletProvider,
  ])

  return (
    <div>
      <Sidebar />
      <div className="p-4 sm:ml-64">
        <div className="flex flex-col md:flex-row justify-between items-center my-4">
          <h1 className="poppins text-[#3a3a3a] text-3xl mb-3 md:mb-0 ml-5">
            Patient Fall History
          </h1>
        </div>
      </div>
    </div>
  )
}

export default FallHistory
