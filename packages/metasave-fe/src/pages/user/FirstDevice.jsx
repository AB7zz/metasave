import React, { useState } from 'react'

const FirstDevice = () => {
  const [deviceName, setDeviceName] = useState('')
  const [deviceID, setDeviceID] = useState('')
  const [deviceIP, setDeviceIP] = useState('')
  const [date, setDate] = useState('')

  const handleInputChange = (event, setter) => {
    setter(event.target.value)
  }

  const handleNextClick = () => {
    // Add your logic for the next step here
    // alert(
    //   `Device Name: ${deviceName}\nDevice ID: ${deviceID}\nDevice IP: ${deviceIP}\nDate: ${date}`
    // )
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div className="px-4 py-4 w-full max-w-md">
        <h1 className="text-3xl font-semibold text-center mb-8">
          Add your health device
        </h1>
        <div className="relative mt-4">
          <input
            className="w-full rounded-full py-3 px-4 bg-[#F9F9F9] leading-tight focus:outline-none focus:ring-1 focus:ring-gray-500"
            type="text"
            placeholder="Add device name"
            value={deviceName}
            onChange={(e) => handleInputChange(e, setDeviceName)}
          />
          <input
            className="w-full rounded-full py-3 px-4 mt-4 bg-[#F9F9F9] leading-tight focus:outline-none focus:ring-1 focus:ring-gray-500"
            type="text"
            placeholder="Add device ID"
            value={deviceID}
            onChange={(e) => handleInputChange(e, setDeviceID)}
          />
          <input
            className="w-full rounded-full py-3 px-4 mt-4 bg-[#F9F9F9] leading-tight focus:outline-none focus:ring-1 focus:ring-gray-500"
            type="text"
            placeholder="Add device IP address"
            value={deviceIP}
            onChange={(e) => handleInputChange(e, setDeviceIP)}
          />
          <input
            className="w-full rounded-full py-3 px-4 mt-4 bg-[#F9F9F9] leading-tight focus:outline-none focus:ring-1 focus:ring-gray-500"
            type="text"
            placeholder="Date"
            value={date}
            onChange={(e) => handleInputChange(e, setDate)}
          />
        </div>
        <div className="flex justify-center px-4 mt-8">
          <button
            className="py-2 px-8 mr-2 bg-black text-white font-semibold rounded-full text-center hover:bg-gray-700 transition duration-300"
            onClick={() => alert('Go back functionality')}
          >
            Back
          </button>
          <button
            className="py-2 px-8 bg-black text-white font-semibold rounded-full text-center hover:bg-gray-700 transition duration-300"
            onClick={handleNextClick}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  )
}

export default FirstDevice
