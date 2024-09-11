import React from 'react'
import Personal from './Profile/Personal'
import FallDetails from './Profile/FallDetails'
import Sidebar from './Sidebar'
import { useMainContext } from '../../context/MainContext'
import { useAuthContext } from '../../context/AuthContext'

const Profile = () => {
  const [slide, setSlide] = React.useState('personal')
  const { initWeb3Auth, CFAddress, walletProvider } = useAuthContext()

  const {fetchUserDetails, fetchFallDetails} = useMainContext()

  React.useEffect(() => {
    initWeb3Auth()
  }, [])

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
      <div className="p-4 sm:ml-64 flex-1 mx-4 ml-4">
        <div className="px-5 py-5">
          <div className="bg-[#F8F8F8] rounded-[25px]">
            <div className="grid grid-cols-2 gap-0 text-center ">
              <h1
                onClick={() => setSlide('personal')}
                className={`poppins font-semibold px-8 py-3 hover:bg-[#3a3a3a] cursor-pointer rounded-[25px] hover:text-white mb-2 md:mb-0 ${
                  slide === 'personal'
                    ? 'bg-[#3a3a3a] w-full text-white'
                    : 'text-[#3a3a3a]'
                }`}
              >
                Personal Info
              </h1>
              <h1
                onClick={() => setSlide('family')}
                className={`poppins font-semibold px-8 py-3 hover:bg-[#3a3a3a] cursor-pointer rounded-[25px] hover:text-white mb-2 md:mb-0 ${
                  slide === 'family'
                    ? 'bg-[#3a3a3a] text-white'
                    : 'text-[#3a3a3a]'
                }`}
              >
                Fall Details
              </h1>
            </div>
          </div>
          {slide === 'personal' ? <Personal /> : <FallDetails />}
        </div>
      </div>
    </div>
  )
}

export default Profile
