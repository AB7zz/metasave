import fs from 'fs'
import axios from 'axios'
import FormData from 'form-data'
import dotenv from 'dotenv'
import { userOperation } from '../../helpers/userOperation.js'
import { abi } from '../../abi/index.js'
import AA from '../../helpers/aa.js'
import { addresses } from '../../constants/addresses.js'
import sendMessage from '../../helpers/whatsapp/sendMessage.js'
import { ethers } from 'ethers'

dotenv.config()

const PINATA_BASE_URL = process.env.PINATA_BASE_URL
const PINATA_API_KEY = process.env.PINATA_API_KEY
const ALCHEMY_API_URL = process.env.ALCHEMY_API_URL

const insertFall = async (req, res) => {
  try {
    const AAProvider = await AA(req.body.PRIV_KEY)
    const PRIV_KEY = req.body.PRIV_KEY
    const CFAddress = await AAProvider.getAddress()
    console.log('CFFAddress', CFAddress)
    const provider = new ethers.providers.JsonRpcProvider(
      ALCHEMY_API_URL,
    )
    const contractAddress = addresses.MetaSave
    const privateKey = req.body.PRIV_KEY
    const wallet = new ethers.Wallet(`0x${privateKey}`, provider)
    const contract = new ethers.Contract(contractAddress, abi.MetaSave, wallet)
    const ipfsid = await contract.getIPFSFileName(CFAddress)
    // const fallData = await contract.getFallData(CFAddress)

    const imagePath = `./uploads/${req.body.USERNAME}/image.jpg`
    
    
    let imgIPFSid = ''
    let dataIPFSid = ''

    // Upload image to IPFS
    if (fs.existsSync(imagePath)) {
      const formDataImage = new FormData()
      formDataImage.append('file', fs.createReadStream(imagePath))

      imgIPFSid = await uploadToIPFS(formDataImage, 'file')
      console.log('Image IPFS ID:', imgIPFSid)
    } else {
      console.log('Image file does not exist:', imagePath)
    }

    console.log('ipfs id:', ipfsid)

    
    const details = await axios.get(`${PINATA_BASE_URL}/ipfs/${ipfsid}`)
    
    console.log('details:', details.data)
    console.log('phones:', details.data.contacts)
    const phones = details.data.contacts
    console.log('phones:', phones)
    const dummyPhoneNumber = '+919778393558'
    
    const falldetails = JSON.parse(req.body.PREDICTION_DATA)

    for (let i = 0; i < phones.length; i++) {
      // let ph = phones[i].phoneNumber.replace(' ', '').replace('+', '')
      let ph = dummyPhoneNumber.replace(' ', '').replace('+', '')
      const res = sendMessage(
        `${PINATA_BASE_URL}/ipfs/${imgIPFSid}`,
        details.data.name,
        ph,
        falldetails.timestamp,
        falldetails.date
      )
      if (!res) {
        console.log('Error sending message to', phones[i].phoneNumber)
      }
    }
    
    dataIPFSid = await uploadToIPFS(
      JSON.parse(req.body.PREDICTION_DATA),
      'json'
    )

    console.log('Data IPFS ID:', dataIPFSid)

    // Store fall data on blockchain
    
    const txHash = await userOperation(
      abi.MetaSave,
      'setFallData',
      [CFAddress, imgIPFSid, dataIPFSid],
      addresses.MetaSave,
      PRIV_KEY
    )

    res.send({
      imgIPFSid,
      dataIPFSid,
      txHash,
    })
  } catch (err) {
    console.error('Server error:', err)
    res.status(500).send({ error: err.message })
  }
}

async function uploadToIPFS(data, type) {
  try {
    if (type === 'json') {
      const response = await axios.post(
        'https://api.pinata.cloud/pinning/pinJSONToIPFS',
        data,
        {
          headers: {
            Authorization: `Bearer ${PINATA_API_KEY}`,
          },
        }
      )
      return response.data.IpfsHash
    } else if (type === 'file') {
      const response = await axios.post(
        'https://api.pinata.cloud/pinning/pinFileToIPFS',
        data,
        {
          headers: {
            ...data.getHeaders(),
            Authorization: `Bearer ${PINATA_API_KEY}`,
          },
          maxBodyLength: 'Infinity',
        }
      )
      return response.data.IpfsHash
    }
  } catch (error) {
    console.error('Error uploading to IPFS:', error)
    throw new Error('Failed to upload to IPFS.')
  }
}

export default insertFall
