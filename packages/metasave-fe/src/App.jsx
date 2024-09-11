import './styles/App.css'
import './init.js'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import React from 'react'
import { useAuthContext } from './context/AuthContext.jsx'

// Importing components
import Login from './pages/user/UserLogin.jsx'
import Dashboard from './pages/user/Dashboard.jsx'
import Signup from './pages/user/Signup.jsx'
import AddClinic from './pages/user/AddClinic.jsx'
import AddDevice from './pages/user/AddDevice.jsx'
import CheckUser from './pages/user/CheckUser.jsx'
import FirstDevice from './pages/user/FirstDevice.jsx'
import NewIdentity from './pages/user/NewIdentity.jsx'
import ClinicLogin from './pages/clinic/ClinicLogin.jsx'
import ClinicRegister from './pages/clinic/ClinicRegister.jsx'
import CDash from './pages/clinic/CDash.jsx'
import ClinicProfile from './pages/clinic/ClinicProfile.jsx'
import PatientDetails from './pages/clinic/PatientDetails.jsx'
import ClinicStatistics from './pages/clinic/ClinicStatistics.jsx'
import CreateNotification from './pages/clinic/CreateNotification.jsx'
import Profile from './components/Dashboard/Profile.jsx'
import FirstClinic from './pages/user/FirstClinic.jsx'
import MyClinic from './pages/user/MyClinic.jsx'
import Department from './pages/user/Department.jsx'
import UserRegister from './pages/user/UserRegister.jsx'
import FallHistory from './pages/clinic/FallHistory.jsx'

function App() {
  const { loggedIn, web3auth, initWeb3Auth } = useAuthContext()

  React.useEffect(() => {
    initWeb3Auth()
  }, [])

  const userType = localStorage.getItem('type')

  return (
    <>
      {web3auth && (
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<CheckUser />} />
            <Route
              path="/login"
              element={
                loggedIn && userType ? (
                  <Navigate to={`/${userType}/dashboard`} />
                ) : (
                  <Login />
                )
              }
            />
            <Route path="/signup" element={<Signup />} />
            <Route path="/register" element={<NewIdentity />} />

            {/* User Routes */}
            <Route path="/user/" element={<Dashboard />} />
            <Route path="/user/dashboard" element={<Dashboard />} />
            <Route path="/user/dashboard/profile" element={<Profile />} />
            <Route path="/user/newclinic" element={<AddClinic />} />
            <Route path="/user/dashboard/newdevice" element={<AddDevice />} />
            <Route path="/user/firstclinic" element={<FirstClinic />} />
            <Route path="/user/firstdevice" element={<FirstDevice />} />
            <Route path="/user/myclinic" element={<MyClinic />} />
            <Route path="/user/department" element={<Department />} />
            <Route path="/user/register" element={<UserRegister />} />

            {/* Clinic Routes */}
            <Route path='/clinic/' element={<Navigate to={`/clinic/dashboard`} />} />
            <Route path="/clinic/dashboard/*" element={<CDash />} />
            <Route path="/clinic/profile" element={<ClinicProfile />} />
            <Route
              path="/clinic/dashboard/profile"
              element={<ClinicProfile />}
            />
            <Route path="/clinic/signin" element={<ClinicLogin />} />
            <Route path="/clinic/register" element={<ClinicRegister />} />
            <Route path="/clinic/patientdetails" element={<PatientDetails />} />
            <Route
              path="/clinic/clinicstatistics"
              element={<ClinicStatistics />}
            />
            <Route
              path="/clinic/createnotification"
              element={<CreateNotification />}
            />
            <Route path="/clinic/fallhistory" element={<FallHistory />} />
          </Routes>
        </BrowserRouter>
      )}
    </>
  )
}

export default App
