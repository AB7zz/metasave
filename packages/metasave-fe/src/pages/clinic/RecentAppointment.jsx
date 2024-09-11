import React from 'react'
import Sidebar from './Sidebar'

const RecentAppointments = () => {
  return (
    <div>
      <Sidebar />
      <div className="p-4 sm:ml-64">
        <div className="flex flex-col md:flex-row justify-between items-center my-4">
          <h1 className="poppins text-[#3a3a3a] text-3xl mb-3 md:mb-0 ml-5">
            Recent Appointments
          </h1>
        </div>
        <div>
          <form className="mr-30">
            <label
              htmlFor="default-search"
              className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white"
            >
              Search
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                <svg
                  className="w-4 h-4 ml-5 text-gray-500 dark:text-gray-400"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 20 20"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                  />
                </svg>
              </div>
              <input
                type="search"
                id="default-search"
                className="block w-1/2 p-3 ml-5 ps-10 text-sm text-gray-900 border border-gray-300 rounded-xl mt-8 bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="Search here..."
                required
              />
            </div>
          </form>
        </div>
        <div className="grid grid-cols-5 font-bold ml-6 mt-11">
          <h1>Patient ID</h1>
          <h1>Name</h1>
          <h1>Appointment Date</h1>
          <h1>Doctor</h1>
          <h1>Status</h1>
        </div>

        <div className="grid grid-cols-5 font-normal ml-6 mt-9">
          <h3>1</h3>
          <h3>Alex</h3>
          <h3>2024-06-01</h3>
          <h3>Dr. Smith</h3>
          <h3 className="text-green-600">Completed</h3>
        </div>
        <div className="border border-gray-200 w-auto ml-6 mt-4"></div>
        <div className="grid grid-cols-5 font-normal ml-6 mt-7">
          <h3>2</h3>
          <h3>Bob</h3>
          <h3>2024-06-02</h3>
          <h3>Dr. Johnson</h3>
          <h3 className="text-red-600">Cancelled</h3>
        </div>
        <div className="border border-gray-200 w-auto ml-6 mt-4"></div>
        <div className="grid grid-cols-5 font-normal ml-6 mt-7">
          <h3>3</h3>
          <h3>Charlie</h3>
          <h3>2024-06-03</h3>
          <h3>Dr. Brown</h3>
          <h3 className="text-yellow-600">Pending</h3>
        </div>
        <div className="border border-gray-200 w-auto ml-6 mt-4"></div>
        <div className="grid grid-cols-5 font-normal ml-6 mt-7">
          <h3>4</h3>
          <h3>David</h3>
          <h3>2024-06-04</h3>
          <h3>Dr. White</h3>
          <h3 className="text-green-600">Completed</h3>
        </div>
        <div className="border border-gray-200 w-auto ml-6 mt-4"></div>
        <div className="grid grid-cols-5 font-normal ml-6 mt-7">
          <h3>5</h3>
          <h3>Eve</h3>
          <h3>2024-06-05</h3>
          <h3>Dr. Green</h3>
          <h3 className="text-yellow-600">Pending</h3>
        </div>

        <div className="flex flex-1 justify-between sm:hidden">
          <a
            href="#"
            className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Previous
          </a>
          <a
            href="#"
            className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Next
          </a>
        </div>
        <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-center mt-6">
          <div>
            <nav
              className="isolate inline-flex -space-x-px rounded-md shadow-sm"
              aria-label="Pagination"
            >
              <a
                href="#"
                className="relative inline-flex items-center rounded-l-md px-3 py-3 text-indigo-800 ring-1 ring-inset ring-gray-500 hover:bg-indigo-50 focus:z-20 focus:outline-offset-0"
              >
                <span className="sr-only">Previous</span>
                <svg
                  className="h-5 w-12"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z"
                    clipRule="evenodd"
                  />
                </svg>
              </a>
            </nav>
            <nav
              className="isolate inline-flex -space-x-px rounded-md shadow-sm"
              aria-label="Pagination"
            >
              <a
                href="#"
                className="relative inline-flex items-center rounded-r-md px-3 py-3 text-indigo-800 ring-1 ring-inset ring-gray-500 hover:bg-indigo-50 focus:z-20 focus:outline-offset-0"
              >
                <span className="sr-only">Next</span>
                <svg
                  className="h-5 w-12 rotate-180"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z"
                    clipRule="evenodd"
                  />
                </svg>
              </a>
            </nav>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RecentAppointments
