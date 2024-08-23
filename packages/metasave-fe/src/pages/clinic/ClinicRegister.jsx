import React, { useState } from 'react'
import { useMainContext } from '../../context/MainContext'
import { useAuthContext } from '../../context/AuthContext'
import { type } from 'requests'

const ClinicRegister = () => {
  const { AAProvider, CFAddress } = useAuthContext()
  const { insertClinicDetails } = useMainContext()

  const [email, setEmail] = useState('')
  const [address1, setAddress1] = useState('')
  const [firstPhone, setFirstPhone] = useState('')
  const [secondPhone, setSecondPhone] = useState('')
  const [clinicName, setClinicName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleSubmit = async (event) => {
    event.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    try {
      const data = {
        type: 'clinic',
        CF: CFAddress,
        email,
        address1,
        firstPhone,
        secondPhone,
        clinicName,
      }
      console.log('clinicData: ', data)
      const result = await insertClinicDetails(AAProvider, CFAddress, data)

      if (result) {
        setSuccess('Clinic registered successfully!')
        setTimeout(() => {
          window.location.href = '/clinic/dashboard'
        }, 2000) // Redirect after 2 seconds to show success message
      } else {
        throw new Error('Registration failed')
      }
    } catch (error) {
      console.error('Error registering clinic:', error)
      setError('Error registering clinic: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex">
      <div className="w-1/3 bg-[#4AA9FF] flex flex-col px-12 justify-center">
        <h2 className="text-white text-3xl font-bold">Register to</h2>
        <h1 className="text-white text-7xl font-extrabold">MetaSave</h1>
        <p className="text-white text-sm mt-8">
          Step into a world of wellness with us!{' '}
        </p>
      </div>
      <div className="w-2/3 flex items-center justify-center">
        <div className="max-w-md w-full space-y-4">
          <div className="flex items-center my-8">
            <span className="ml-2 text-xl font-bold">MetaSave</span>
          </div>
          <div>
            <h2 className="text-3xl font-bold">Create an account</h2>
            <p className="mt-4 text-sm">
              Already have an account?&nbsp;
              <a href="/clinic/signin" className="font-medium underline">
                Login
              </a>
            </p>
          </div>
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <input
                type="text"
                required
                style={{ borderBottom: '.5px solid black' }}
                className="appearance-none rounded-none relative block w-full py-2 border-0 border-black placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm mt-4"
                placeholder="Clinic Name"
                value={clinicName}
                onChange={(e) => setClinicName(e.target.value)}
              />
              <input
                type="email"
                required
                style={{ borderBottom: '.5px solid black' }}
                className="appearance-none rounded-none relative block w-full py-2 border-0 border-black placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm mt-4"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="tel"
                  required
                  style={{ borderBottom: '.5px solid black' }}
                  className="appearance-none rounded-none relative block w-full py-2 border-0 border-black placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm mt-4"
                  placeholder="Phone number 1"
                  value={firstPhone}
                  onChange={(e) => setFirstPhone(e.target.value)}
                />
                <input
                  type="tel"
                  required
                  style={{ borderBottom: '.5px solid black' }}
                  className="appearance-none rounded-none relative block w-full py-2 border-0 border-black placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm mt-4"
                  placeholder="Phone number 2"
                  value={secondPhone}
                  onChange={(e) => setSecondPhone(e.target.value)}
                />
              </div>
              <input
                type="text"
                required
                style={{ borderBottom: '.5px solid black' }}
                className="appearance-none rounded-none relative block w-full py-2 border-0 border-black placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm mt-4"
                placeholder="Address Line"
                value={address1}
                onChange={(e) => setAddress1(e.target.value)}
              />
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            {success && <p className="text-green-500 text-sm">{success}</p>}
            {loading && <p className="text-blue-500 text-sm">Registering...</p>}
            <div className="mt-16 w-1/2 mx-auto">
              <button
                type="submit"
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-[#4AA9FF] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                disabled={loading}
              >
                Register
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default ClinicRegister
