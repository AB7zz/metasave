import React, { useState } from 'react'
import { useAuthContext } from '../../context/AuthContext'
import { useMainContext } from '../../context/MainContext'

const UserRegister = () => {
  const { AAProvider, CFAddress } = useAuthContext()
  const { insertUserDetails } = useMainContext()

  const [step, setStep] = useState(1)
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [address1, setAddress1] = useState('')
  const [age, setAge] = useState('')
  const [gender, setGender] = useState('male')
  const [name, setName] = useState('')
  const [emergencyContact1, setEmergencyContact1] = useState('')
  const [emergencyContact2, setEmergencyContact2] = useState('')
  const [emergencyContactName1, setEmergencyContactName1] = useState('')
  const [emergencyContactName2, setEmergencyContactName2] = useState('')

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (step === 1) {
      setStep(2)
    } else {
      // Final submission logic here, e.g., sending data to an API
      const data = {
        type: 'user',
        CF: CFAddress,
        name,
        email,
        age,
        gender,
        phone,
        address: address1,
        contacts: [
          { name: emergencyContactName1, phoneNumber: emergencyContact1 },
          { name: emergencyContactName2, phoneNumber: emergencyContact2 },
        ],
      }

      console.log(data)

      const res = await insertUserDetails(AAProvider, CFAddress, data)
      if(res){
        window.location.replace(`/${localStorage.getItem('userType')}/dashboard`)
      }
    }
  }

  return (
    <div className="min-h-screen flex">
      <div className="w-1/3 bg-[#2A9D8F] flex flex-col px-12 justify-center">
        <h2 className="text-white text-3xl font-bold">Register to</h2>
        <h1 className="text-white text-7xl font-extrabold">MetaSave</h1>
        <p className="text-white text-sm mt-8">
          Step into a world of wellness with us!
        </p>
      </div>
      <div className="w-2/3 flex items-center justify-center">
        <div className="max-w-md w-full space-y-4">
          <div className="flex items-center my-8"></div>
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
            {step === 1 ? (
              <div>
                <input
                  type="text"
                  required
                  style={{ borderBottom: '.5px solid black' }}
                  className="appearance-none rounded-none relative block w-full py-2 border-0 border-black placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm mt-4"
                  placeholder="Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
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
                <input
                  type="tel"
                  required
                  style={{ borderBottom: '.5px solid black' }}
                  className="appearance-none rounded-none relative block w-full py-2 border-0 border-black placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm mt-4"
                  placeholder="Phone Number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="number"
                    required
                    style={{ borderBottom: '.5px solid black' }}
                    className="appearance-none rounded-none relative block w-full py-2 border-0 border-black placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm mt-4"
                    placeholder="Age"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                  />
                  <select
                    required
                    style={{ borderBottom: '.5px solid black' }}
                    className="appearance-none rounded-none relative block w-full py-2 border-0 border-black placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm mt-4"
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                  >
                    <option value="" disabled>
                      Gender
                    </option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
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
            ) : (
              <div>
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="text"
                    required
                    style={{ borderBottom: '.5px solid black' }}
                    className="appearance-none rounded-none relative block w-full py-2 border-0 border-black placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm mt-4"
                    placeholder="Name"
                    value={emergencyContactName1}
                    onChange={(e) => setEmergencyContactName1(e.target.value)}
                  />

                  <input
                    type="tel"
                    required
                    style={{ borderBottom: '.5px solid black' }}
                    className="appearance-none rounded-none relative block w-full py-2 border-0 border-black placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm mt-4"
                    placeholder="Phone Number"
                    value={emergencyContact1}
                    onChange={(e) => setEmergencyContact1(e.target.value)}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="text"
                    required
                    style={{ borderBottom: '.5px solid black' }}
                    className="appearance-none rounded-none relative block w-full py-2 border-0 border-black placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm mt-4"
                    placeholder="Name"
                    value={emergencyContactName2}
                    onChange={(e) => setEmergencyContactName2(e.target.value)}
                  />

                  <input
                    type="tel"
                    required
                    style={{ borderBottom: '.5px solid black' }}
                    className="appearance-none rounded-none relative block w-full py-2 border-0 border-black placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm mt-4"
                    placeholder="Phone Number"
                    value={emergencyContact2}
                    onChange={(e) => setEmergencyContact2(e.target.value)}
                  />
                </div>
              </div>
            )}
            <div className="mt-16 w-1/2 mx-auto">
              <button
                type="submit"
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-[#2A9D8F] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                {step === 1 ? 'Next' : 'Register'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default UserRegister
