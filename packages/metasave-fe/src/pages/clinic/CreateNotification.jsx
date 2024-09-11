import React, { useState } from 'react'
import Sidebar from './Sidebar'

const CreateNotification = () => {
  const [message, setMessage] = useState('')
  const [type, setType] = useState('info')
  const [appointment, setAppointment] = useState('')
  const [clinicStatus, setClinicStatus] = useState('open')
  const [mode, setMode] = useState('email')

  const handleSubmit = (e) => {
    e.preventDefault()
    // Add logic to send notification
    console.log(`Sending ${type} notification: ${message}`)
    console.log(`Appointment: ${appointment}`)
    console.log(`Clinic Status: ${clinicStatus}`)
    console.log(`Mode: ${mode}`)
    // Reset form
    setMessage('')
    setType('info')
    setAppointment('')
    setClinicStatus('open')
    setMode('email')
  }

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 p-6 sm:ml-64">
        <div className="flex flex-col md:flex-row justify-between items-center my-4">
          <h1 className="poppins text-[#3a3a3a] text-3xl mb-3 md:mb-0">
            Create Notification
          </h1>
        </div>
        <form onSubmit={handleSubmit} className="bg-white my-4 space-y-12">
          <div>
            <label
              htmlFor="message"
              className="mt-4 block text-lg font-medium text-gray-700"
            >
              Message
            </label>
            <textarea
              id="message"
              name="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="mt-2 block w-full border-b-2 border-gray-300 sm:text-sm outline-none" 
              rows="3"
              required
            ></textarea>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label
                htmlFor="appointment"
                className="block text-lg font-medium text-gray-700"
              >
                Appointment
              </label>
              <input
                id="appointment"
                name="appointment"
                type="text"
                value={appointment}
                onChange={(e) => setAppointment(e.target.value)}
                className="mt-2 block w-full border-b-2 border-gray-300 sm:text-sm outline-none"
              />
            </div>
            <div>
              <label
                htmlFor="clinicStatus"
                className="block text-lg font-medium text-gray-700"
              >
                Clinic Status
              </label>
              <select
                id="clinicStatus"
                name="clinicStatus"
                value={clinicStatus}
                onChange={(e) => setClinicStatus(e.target.value)}
                className="mt-2 block w-full border-b-2 border-gray-300 sm:text-sm outline-none"
                required
              >
                <option value="open">Open</option>
                <option value="closed">Closed</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label
                htmlFor="mode"
                className="block text-lg font-medium text-gray-700"
              >
                Mode
              </label>
              <select
                id="mode"
                name="mode"
                value={mode}
                onChange={(e) => setMode(e.target.value)}
                className="mt-2 block w-full border-b-2 border-gray-300 sm:text-sm"
                required
              >
                <option value="email">Email</option>
                <option value="sms">SMS</option>
                <option value="whatsapp">WhatsApp</option>
              </select>
            </div>
            <div>
              <label
                htmlFor="type"
                className="block text-lg font-medium text-gray-700"
              >
                Type
              </label>
              <select
                id="type"
                name="type"
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="mt-2 block w-full border-b-2 border-gray-300 sm:text-sm"
                required
              >
                <option value="info">Information</option>
                <option value="warning">Warning</option>
                <option value="error">Error</option>
              </select>
            </div>
          </div>
          <button
            type="submit"
            className="w-fit inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-400 hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Send Notification
          </button>
        </form>
      </div>
    </div>
  )
}

export default CreateNotification
