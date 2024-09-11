import React, { useState } from 'react'
import searchIcon from '../../assets/search.png'
import mapIcon from '../../assets/map.png'

const FirstClinic = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [suggestions, setSuggestions] = useState([])
  const [selectedClinic, setSelectedClinic] = useState(null)

  // Example list of clinics
  const clinics = [
    { name: 'Woodsland Health', address: '17 Woodlands Drive, Singapore' },
    // ...other clinics
  ]

  const handleChange = (event) => {
    const value = event.target.value
    setSearchTerm(value)
    if (value.length > 0) {
      const filteredSuggestions = clinics.filter((clinic) =>
        clinic.name.toLowerCase().includes(value.toLowerCase())
      )
      setSuggestions(filteredSuggestions)
    } else {
      setSuggestions([])
    }
  }

  const handleSelectClinic = (clinic) => {
    setSelectedClinic(clinic)
    setSuggestions([])
    setSearchTerm(clinic.name)
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div className="px-4 py-4 w-full max-w-2xl">
        <h1 className="text-3xl font-semibold text-center mb-8">
          Choose your clinic
        </h1>
        <div className="relative mt-4">
          <div className="flex items-center w-full rounded-full bg-[#F9F9F9]">
            <span className="pl-4 pr-2">
              <img src={searchIcon} alt="search" className="h-6 w-6" />
            </span>
            <input
              className="flex-grow rounded-full py-3 pl-4 pr-4 bg-[#F9F9F9] leading-tight focus:outline-none"
              type="search"
              placeholder="Search clinic"
              value={searchTerm}
              onChange={handleChange}
            />
            <button className="flex items-center justify-center rounded-full p-2">
              <img src={mapIcon} alt="map" className="h-6 w-6" />
            </button>
          </div>
          {suggestions.length > 0 && (
            <ul className="absolute w-full bg-white shadow-lg rounded-md mt-1">
              {suggestions.map((clinic, index) => (
                <li
                  key={index}
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() => handleSelectClinic(clinic)}
                >
                  {clinic.name} <br />
                  <small className="text-gray-500">{clinic.address}</small>
                </li>
              ))}
            </ul>
          )}
        </div>
        {selectedClinic && (
          <div className="mt-4 p-4 rounded-lg shadow-lg bg-[#FFEBFC] h-40">
            <div className="flex justify-between items-center">
              <h2 className="text-3xl">{selectedClinic.name}</h2>
              <button className="bg-[#FFBD03] bg-opacity-75 hover:bg-yellow-200 text-white font-bold py-2 px-4 rounded-lg">
                Connect
              </button>
            </div>
            <p>{selectedClinic.address}</p>
          </div>
        )}
      </div>
      <div className="mt-8 py-2 px-8 bg-black text-white rounded-xl text-center">
        Next
      </div>
    </div>
  )
}

export default FirstClinic
