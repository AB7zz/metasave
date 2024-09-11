import React, { useEffect } from 'react';
import Sidebar from './Sidebar';
import { useMainContext } from '../../context/MainContext';

const PatientDetails = () => {
  const { fetchPatientsOfClinic, patients } = useMainContext();

  useEffect(() => {
    fetchPatientsOfClinic('clinic1'); // should actually pass the cid of the clinic
  }, []);

  return (
    <div className="flex">
      <Sidebar />
      <div className="p-4 sm:ml-64 flex-grow">
        <div className="flex flex-col md:flex-row justify-between items-center my-4">
          <h1 className="poppins text-[#3a3a3a] text-3xl mb-3 md:mb-0 ml-5">
            Patient Details
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
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
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
                className="block w-full sm:w-1/2 p-3 pl-10 text-sm text-gray-900 border border-gray-300 rounded-xl mt-8 bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="Search here..."
                required
              />
            </div>
          </form>
        </div>
        <div className="mt-8">
          {patients && patients.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border border-gray-200">
                <thead>
                  <tr>
                    <th className="px-4 py-2 border-b">Serial No.</th>
                    <th className="px-4 py-2 border-b">Patient CID</th>
                  </tr>
                </thead>
                <tbody>
                  {patients.map((patient, index) => (
                    <tr key={index}>
                      <td className="px-4 py-2 border-b text-center">{index + 1}</td>
                      <td className="px-4 py-2 border-b">{patient}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-center text-gray-500">No patients found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default PatientDetails;
