import React from 'react'
import EditIcon from '@mui/icons-material/Edit'
import DoneIcon from '@mui/icons-material/Done'
import { useMainContext } from '../../../context/MainContext'
import '../../../styles/Personal.css'

const Personal = () => {
  const { userDetails } = useMainContext()
  const [editMode, setEditMode] = React.useState({
    mode: '',
    edit: false,
  })

  return (
    <div className="my-8">
      <h1 className="text-black text-3xl">My Profile</h1>
      <div className="my-12">
        <div className="w-full grid grid-cols-2 my-2">
          <div>
            <div className="w-[80%] flex justify-between">
              <h4 className=" text-xl">Name</h4>
              {editMode.edit && editMode.mode == 'name' ? (
                <div
                  onClick={() => setEditMode({ edit: false })}
                  className="flex items-center text-white bg-green-700 hover:bg-green-600 rounded-[10px] px-3 py-2 cursor-pointer"
                >
                  <DoneIcon />
                  <span className="ml-3 poppins font-semibold">Save</span>
                </div>
              ) : (
                <div
                  onClick={() => setEditMode({ mode: 'name', edit: true })}
                  className=" items-center text-[#4A9DFF] cursor-pointer md:flex hidden"
                >
                  <i className="fa-solid fa-pen-to-square text-blue-500 text-xl"></i>
                </div>
              )}
            </div>
            <input
              type="text"
              defaultValue="Ram"
              className="w-[80%] border-t-0 border-l-0 border-r-0 border-2 border-gray-300 outline-none my-3 text-xl"
              readOnly={!editMode.edit && editMode.mode != 'name'}
            />
          </div>
          <div>
            <div className="w-[80%] flex justify-between">
              <h4 className=" text-xl">Email</h4>
              {editMode.edit && editMode.mode == 'email' ? (
                <div
                  onClick={() => setEditMode({ edit: false })}
                  className="flex items-center text-white bg-green-700 hover:bg-green-600 rounded-[10px] px-3 py-2 cursor-pointer"
                >
                  <DoneIcon />
                  <span className="ml-3 poppins font-semibold">Save</span>
                </div>
              ) : (
                <div
                  onClick={() => setEditMode({ mode: 'email', edit: true })}
                  className=" items-center text-[#4A9DFF] cursor-pointer md:flex hidden"
                >
                  <i className="fa-solid fa-pen-to-square text-blue-500 text-xl"></i>
                </div>
              )}
            </div>
            <input
              type="text"
              className="w-[80%] border-t-0 border-l-0 border-r-0 border-2 border-gray-300 outline-none my-3 text-xl"
              readOnly={!editMode.edit && editMode.mode != 'email'}
            />
          </div>
        </div>
        <div className="grid grid-cols-2 my-16">
          <div>
            <div className="w-[80%] flex justify-between">
              <h4 className=" text-xl">Phone Number</h4>
              {editMode.edit && editMode.mode == 'phone' ? (
                <div
                  onClick={() => setEditMode({ edit: false })}
                  className="flex items-center text-white bg-green-700 hover:bg-green-600 rounded-[10px] px-3 py-2 cursor-pointer"
                >
                  <DoneIcon />
                  <span className="ml-3 poppins font-semibold">Save</span>
                </div>
              ) : (
                <div
                  onClick={() => setEditMode({ mode: 'phone', edit: true })}
                  className=" items-center text-[#4A9DFF] cursor-pointer md:flex hidden"
                >
                  <i className="fa-solid fa-pen-to-square text-blue-500 text-xl"></i>
                </div>
              )}
            </div>
            <input
              type="text"
              className="w-[80%] border-t-0 border-l-0 border-r-0 border-2 border-gray-300 outline-none my-3 text-xl"
              readOnly={!editMode.edit && editMode.mode != 'phone'}
            />
          </div>
          <div>
            <div className="w-[80%] flex justify-between">
              <h4 className=" text-xl">Address</h4>
              {editMode.edit && editMode.mode == 'address' ? (
                <div
                  onClick={() => setEditMode({ edit: false })}
                  className="flex items-center text-white bg-green-700 hover:bg-green-600 rounded-[10px] px-3 py-2 cursor-pointer"
                >
                  <DoneIcon />
                  <span className="ml-3 poppins font-semibold">Save</span>
                </div>
              ) : (
                <div
                  onClick={() => setEditMode({ mode: 'address', edit: true })}
                  className=" items-center text-[#4A9DFF] cursor-pointer md:flex hidden"
                >
                  <i className="fa-solid fa-pen-to-square text-blue-500 text-xl"></i>
                </div>
              )}
            </div>
            <input
              type="text"
              className="w-[80%] border-t-0 border-l-0 border-r-0 border-2 border-gray-300 outline-none my-3 text-xl"
              readOnly={!editMode.edit && editMode.mode != 'address'}
            />
          </div>
        </div>
      </div>
      <div className="flex justify-between w-[90%]">
        <h1 className="text-black text-3xl ">Emergency Contacts</h1>
        <i className="cursor-pointer fa-solid fa-plus text-3xl"></i>
      </div>
      <div className="my-20">
        <div className="w-full grid grid-cols-2 my-16">
          <div>
            <div className="w-[80%] flex justify-between">
              <h4 className=" text-xl">Name</h4>
              {editMode.edit && editMode.mode == 'emergencyname1' ? (
                <div
                  onClick={() => setEditMode({ edit: false })}
                  className="flex items-center text-white bg-green-700 hover:bg-green-600 rounded-[10px] px-3 py-2 cursor-pointer"
                >
                  <DoneIcon />
                  <span className="ml-3 poppins font-semibold">Save</span>
                </div>
              ) : (
                <div
                  onClick={() =>
                    setEditMode({ mode: 'emergencyname1', edit: true })
                  }
                  className=" items-center text-[#4A9DFF] cursor-pointer md:flex hidden"
                >
                  <i className="fa-solid fa-pen-to-square text-blue-500 text-xl"></i>
                </div>
              )}
            </div>
            <input
              type="text"
              className="w-[80%] border-t-0 border-l-0 border-r-0 border-2 border-gray-300 outline-none my-3 text-xl"
              readOnly={!editMode.edit && editMode.mode != 'emergencyname1'}
            />
          </div>
          <div>
            <div className="w-[80%] flex justify-between">
              <h4 className=" text-xl">Phone Number</h4>
              {editMode.edit && editMode.mode == 'emergencyphone1' ? (
                <div
                  onClick={() => setEditMode({ edit: false })}
                  className="flex items-center text-white bg-green-700 hover:bg-green-600 rounded-[10px] px-3 py-2 cursor-pointer"
                >
                  <DoneIcon />
                  <span className="ml-3 poppins font-semibold">Save</span>
                </div>
              ) : (
                <div
                  onClick={() =>
                    setEditMode({ mode: 'emergencyphone1', edit: true })
                  }
                  className=" items-center text-[#4A9DFF] cursor-pointer md:flex hidden"
                >
                  <i className="fa-solid fa-pen-to-square text-blue-500 text-xl"></i>
                </div>
              )}
            </div>
            <input
              type="text"
              className="w-[80%] border-t-0 border-l-0 border-r-0 border-2 border-gray-300 outline-none my-3 text-xl"
              readOnly={!editMode.edit && editMode.mode != 'emergencyphone1'}
            />
          </div>
        </div>
        <div className="grid grid-cols-2 my-16">
          <div>
            <div className="w-[80%] flex justify-between">
              <h4 className=" text-xl">Name</h4>
              {editMode.edit && editMode.mode == 'emergencyname2' ? (
                <div
                  onClick={() => setEditMode({ edit: false })}
                  className="flex items-center text-white bg-green-700 hover:bg-green-600 rounded-[10px] px-3 py-2 cursor-pointer"
                >
                  <DoneIcon />
                  <span className="ml-3 poppins font-semibold">Save</span>
                </div>
              ) : (
                <div
                  onClick={() =>
                    setEditMode({ mode: 'emergencyname2', edit: true })
                  }
                  className=" items-center text-[#4A9DFF] cursor-pointer md:flex hidden"
                >
                  <i className="fa-solid fa-pen-to-square text-blue-500 text-xl"></i>
                </div>
              )}
            </div>
            <input
              type="text"
              className="w-[80%] border-t-0 border-l-0 border-r-0 border-2 border-gray-300 outline-none my-3 text-xl"
              readOnly={!editMode.edit && editMode.mode != 'emergencyname2'}
            />
          </div>
          <div>
            <div className="w-[80%] flex justify-between">
              <h4 className=" text-xl">Phone Number</h4>
              {editMode.edit && editMode.mode == 'emergencyphone2' ? (
                <div
                  onClick={() => setEditMode({ edit: false })}
                  className="flex items-center text-white bg-green-700 hover:bg-green-600 rounded-[10px] px-3 py-2 cursor-pointer"
                >
                  <DoneIcon />
                  <span className="ml-3 poppins font-semibold">Save</span>
                </div>
              ) : (
                <div
                  onClick={() =>
                    setEditMode({ mode: 'emergencyphone2', edit: true })
                  }
                  className=" items-center text-[#4A9DFF] cursor-pointer md:flex hidden"
                >
                  <i className="fa-solid fa-pen-to-square text-blue-500 text-xl"></i>
                </div>
              )}
            </div>
            <input
              type="text"
              className="w-[80%] border-t-0 border-l-0 border-r-0 border-2 border-gray-300 outline-none my-3 text-xl"
              readOnly={!editMode.edit && editMode.mode != 'emergencyphone2'}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Personal
