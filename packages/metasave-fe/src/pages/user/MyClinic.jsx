import React from 'react'
import Sidebar from '../../components/Dashboard/Sidebar'

const MyClinic = () => {
  return (
    <div>
      <Sidebar />
      <div className="p-4 sm:ml-64 flex-1">
        <div className="w-full bg-gray-600 text-white p-4 rounded-md relative py-4">
          <h1 className="text-4xl pt-4 font-semibold">Appolo Hospital</h1>
          <p className="mb-4">Angamaly, Ernakulam</p>
          <button className="bg-[#AAF0D1] px-4 py-1 text-black rounded-md ml-auto">
            Change Clinic
          </button>
          {/* phone nos */}
          <div className="mt-2 absolute top-0 right-0 px-4">
            <p className="">+91 1234567890</p>
            <p>+91 1234567890</p>
          </div>
        </div>
        <div className="">
          <h2 className="text-2xl font-semibold  mt-4">Departments</h2>
          <div className="flex justify-between items-center mt-4">
            <p className="">Neurology</p>
            <button className="bg-[#AAF0D1] px-4 py-2 rounded-md">
              Book Now
            </button>
          </div>
          <div className="flex justify-between items-center mt-4">
            <p className="">Orthology</p>
            <button className="bg-[#AAF0D1] px-4 py-2 rounded-md">
              Book Now
            </button>
          </div>
          <div className="flex justify-between items-center mt-4">
            <p className="">Pathology</p>
            <button className="bg-[#AAF0D1] px-4 py-2 rounded-md">
              Book Now
            </button>
          </div>
          <div className="flex justify-between items-center mt-4">
            <p className="">Neurology</p>
            <button className="bg-[#AAF0D1] px-4 py-2 rounded-md">
              Book Now
            </button>
          </div>
          <div className="flex justify-between items-center mt-4">
            <p className="">Neurology</p>
            <button className="bg-[#AAF0D1] px-4 py-2 rounded-md">
              Book Now
            </button>
          </div>
          <div className="flex justify-between items-center mt-4">
            <p className="">Neurology</p>
            <button className="bg-[#AAF0D1] px-4 py-2 rounded-md">
              Book Now
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MyClinic
