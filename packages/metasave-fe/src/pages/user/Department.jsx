import React from 'react'
import Sidebar from '../../components/Dashboard/Sidebar'

const doctors = [
  {
    name: 'Dr. John Doe',
    specialty: 'Neurology',
    timings: '9:00 AM - 5:00 PM',
  },
  {
    name: 'Dr. Jane Doe',
    specialty: 'Neurology',
    timings: '9:00 AM - 5:00 PM',
  },
  {
    name: 'Dr. John Doe',
    specialty: 'Neurology',
    timings: '9:00 AM - 5:00 PM',
  },
  {
    name: 'Dr. Jane Doe',
    specialty: 'Neurology',
    timings: '9:00 AM - 5:00 PM',
  },

  // Add more doctors if needed
]

const Department = () => {
  return (
    <div>
      <Sidebar />
      <div className="p-4 sm:ml-64 flex-1 mx-4 ml-4">
        <h2 className="text-3xl mt-4 ml-4">Neurology</h2>
        <div className="grid grid-cols-3 gap-4 mt-8 ml-4 ">
          <div className="font-semibold">Doctor Name</div>
          <div className="font-semibold">Specialty</div>
          <div className="font-semibold">Available Timings</div>
          {doctors.map((doctor, index) => (
            <React.Fragment key={index}>
              <div>{doctor.name}</div>
              <div>{doctor.specialty}</div>
              <div>{doctor.timings}</div>
              <hr className="col-span-3" />
            </React.Fragment>
          ))}
        </div>
        <div className="ml-auto w-fit mt-6 bg-gray-600 text-white px-4 py-2 rounded-md">
          Book Now
        </div>
      </div>
    </div>
  )
}

export default Department
