import React, { useState, useEffect } from 'react'
import { useAuthContext } from '../../context/AuthContext'

const UserLogin = () => {
  const { login, web3auth } = useAuthContext()
  const [error, setError] = useState('')

  return (
    <div className="min-h-screen font-sans flex">
      <div className="w-1/3 bg-[#2A9D8F] flex flex-col px-12 justify-center">
        <h2 className="text-white text-3xl font-bold">Welcome to</h2>
        <h1 className="text-white text-7xl font-extrabold">MetaSave</h1>
        <p className="text-white text-sm mt-8">
          Step into a world of wellness with us!
        </p>
      </div>
      <div className="w-2/3 flex items-center justify-center">
        <div className="max-w-md w-1/2 space-y-8">
          <div className="flex items-center mt-4">
            <span className="text-xl font-bold">MetaSave</span>
          </div>
          <div>
            <h2 className="mt-6 text-3xl font-bold text-gray-900">
              Sign in to your user account
            </h2>
          </div>
          <div className="my-10">
            {error && <p className="text-center text-red-600 my-5">{error}</p>}
            {web3auth ? (
              <button
                onClick={
                  () => {
                    localStorage.setItem('userType', 'user')
                    login('user')
                  }
                }
                className="bg-[#383838] text-[#EFEFEF] text-center px-10 py-2 rounded-[10px] poppins hover:bg-[#2A2A2A] transition duration-300 ease-in-out w-full"
              >
                Sign in with Google
              </button>
            ) : (
              <p className="text-center">Web3Auth is not initialized</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default UserLogin
