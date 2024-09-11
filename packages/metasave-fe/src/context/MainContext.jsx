import React, {useState} from 'react'
import { addresses } from '../constants/addresses'
import { abi } from '../abi/index.js'
import axios from 'axios'
import { initializeApp } from 'firebase/app'
import { getDatabase, ref, onValue, remove } from 'firebase/database'
import { encodeFunctionData } from 'viem'

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTHDOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECTID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGEBUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGINGSENDERID,
  appId: import.meta.env.VITE_FIREBASE_APPID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENTID,
}

initializeApp(firebaseConfig)

const database = getDatabase()

const MainContext = React.createContext()

export const MainContextProvider = ({ children }) => {
  const [fallPopup, setFallPopup] = React.useState(false)
  const [walletProvider, setWalletProvider] = React.useState()
  const [CFAddress, setCFAddress] = React.useState()
  const [clinicDetails, setClinicDetails] = useState(null);
  const [patients, setPatients] = useState([]);
  const [devices, setDevices] = React.useState([
    // ...additional devices
  ])
  React.useEffect(() => {
    if (walletProvider && CFAddress) {
      console.log('checking firebase rtb for fall')
      const fallRef = ref(database, 'fall')
      onValue(fallRef, (snapshot) => {
        if (snapshot.exists()) {
          console.log('fall detected', snapshot.val())
          setFallPopup(true)
          fetchFallDetails(walletProvider, CFAddress)
          remove(fallRef)
        }
      })
    }
  }, [walletProvider, CFAddress])
  const serverUrl = import.meta.env.VITE_BACKEND_URL
  const [userDetails, setUserDetails] = React.useState({})

  const [fallDetails, setFallDetails] = React.useState({
    //fall details
  })

  const fetchUserDetails = async (walletProvider, CFAddress) => {
    const MetaSave = await walletProvider.getContract(
      addresses.MetaSave,
      abi.MetaSave
    )
    console.log('fetchin user details for', CFAddress)
    // let IPFSid = 'QmUtKWis5gMaFyK4H9B8psVXbZtnsY22iXFUwcQsXQqvmR'
    let IPFSid = await MetaSave.getIPFSFileName(CFAddress)

    console.log('IPFS ID: ', IPFSid)

    try {
      // const data = {
      //   CF: '0xa09C36E28F91Bab16A6A721c8Bd32888eF541b6f',
      //   name: 'Alosh Denny',
      //   email: 'aloshdhenny@gmail.com ',
      //   age: 22,
      //   gender: 'male',
      //   phone: '9778393558',
      //   address: 'Kochi',
      //   contacts: [
      //     { name: 'Friend1', phoneNumber: '9495090845' },
      //     { name: 'Friend1', phoneNumber: '9400542359' },
      //   ]
      // }
      // console.log(data)
      // setUserDetails(data)
      
      const res = await axios.get(`${serverUrl}/user/${IPFSid}`)
      console.log(res.data.data)
      setUserDetails(res.data.data)
    } catch (err) {
      console.log('invalid ipfsid')
    }
  }

  const fetchFallDetails = async (walletProvider, CFAddress) => {
    console.log('fetch fall details', CFAddress)
    setWalletProvider(walletProvider)
    const priv_key = await walletProvider.getPrivateKey()
    setCFAddress(CFAddress)
    try {
      const res = await axios.get(`${serverUrl}/falldata/${CFAddress}/${priv_key}`)

      const result = res.data.result

      console.log('fall detailsssss', result)

      const uniqueObjects = {}

      // result.forEach(obj => {
      //     const timestamp = obj.timestamp;
      //     if (!uniqueObjects[timestamp]) {
      //         uniqueObjects[timestamp] = obj;
      //     }
      // });

      // const uniqueArray = Object.values(uniqueObjects);

      // console.log(uniqueArray);
      setFallDetails(result)
    } catch (err) {
      console.log('No fall data for this user')
    }
  }

  const fetchDevices = async (walletProvider, CFAddress) => {
    try {
      // call the SC function that fetches all devices connected to the user
    } catch (error) {
      console.log('No devices found')
    }
  }

  const insertUserDetails = async (AAProvider, CFAddress, data) => {
    const res = await axios.post(`${serverUrl}/user`, { data })

    const IPFSid = res.data.CID

    console.log('IPFS ID: ', IPFSid)
    console.log('CFAddress: ', CFAddress)

    const uoCallData = encodeFunctionData({
      abi: abi.MetaSave,
      functionName: 'setIPFSFileName',
      args: [CFAddress, IPFSid],
    })
    const uo = await AAProvider.sendUserOperation({
      uo: {
        target: addresses.MetaSave,
        data: uoCallData,
      }
    })

    const txHash = await AAProvider.waitForUserOperationTransaction(uo)
    if (txHash) {
      console.log('TX HASH: ', txHash)
      return true
    } else {
      return false
    }
  }

  const insertClinicDetails = async (AAProvider, CFAddress, data) => {
    const res = await axios.post(`${serverUrl}/user`, { data })

    const IPFSid = res.data.CID

    console.log("IPFS ID: ", IPFSid)
    console.log("CFAddress: ", CFAddress)

    const uoCallData = encodeFunctionData({
        abi: abi.MetaSave,
        functionName: "setIPFSFileName",
        args: [CFAddress, IPFSid],
    })
    const uo = await AAProvider.sendUserOperation({
      uo: {
        target: addresses.MetaSave,
        data: uoCallData,
      }
    });
    const txHash = await AAProvider.waitForUserOperationTransaction(uo)
    if (txHash) {
        console.log("TX HASH: ", txHash)
        return true
    } else {
        return false
    }
  }

  const fetchClinicDetails = async (walletProvider, CFAddress) => {
    const MetaSave = await walletProvider.getContract(addresses.MetaSave, abi.MetaSave)
    console.log('fetchin clinic details for', CFAddress)
    // let IPFSid = 'QmURC4AqiMdHxNYCfSwQdCypcgyBx9gPCqidSURjZBfV6Z'
    let IPFSid = await MetaSave.getIPFSFileName(CFAddress)

    try {
        const res = await axios.get(`${serverUrl}/user/${IPFSid}`)
        console.log(res.data.data)
        setClinicDetails(res.data.data)
    } catch (err) {
        console.log('invalid ipfsid',)
    }
}

// should actually pass the cid of the clinic
  const fetchPatientsOfClinic = async (clinicId) => {
    try {
      const res = await axios.get(`${serverUrl}/${clinicId}/patients`);
      // returns all the cids related to that clinic
      console.log("Fetched patients: ", res.data.patients);
      setPatients(res.data.patients);
    } catch (err) {
      console.log('Error fetching patients of clinic');
    }
  };



  return (
    <MainContext.Provider
      value={{
        serverUrl,
        userDetails,
        fallDetails,
        fallPopup,
        devices,
        clinicDetails,
        patients,
        setDevices,
        setFallPopup,
        setFallDetails,
        setUserDetails,
        fetchUserDetails,
        fetchFallDetails,
        insertUserDetails,
        fetchDevices,
        insertClinicDetails,
        fetchClinicDetails,
        fetchPatientsOfClinic,
      }}
    >
      {children}
    </MainContext.Provider>
  )
}

export const useMainContext = () => React.useContext(MainContext)
