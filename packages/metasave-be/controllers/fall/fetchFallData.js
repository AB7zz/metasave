import dotenv from 'dotenv'
import axios from 'axios'
import { abi } from '../../abi/index.js'
import { addresses } from '../../constants/addresses.js'
import { ethers } from 'ethers'

dotenv.config()

const ALCHEMY_API_URL = process.env.ALCHEMY_API_URL
const PINATA_BASE_URL = process.env.PINATA_BASE_URL
const PINATA_API_KEY = process.env.PINATA_API_KEY

async function fetchFallDataIPFS(cid) {
    try {
      const response1 = await axios.get(`${PINATA_BASE_URL}/ipfs/${cid}`, {
        headers: {
            'x-pinata-gateway-token': PINATA_API_KEY
        }
      })
  
      const innerJsonString = JSON.stringify(response1.data)
      const innerJsonObject = JSON.parse(innerJsonString);
      return innerJsonObject
    } catch (error) {
      console.error(error);
      return null;
    }
}

const fetchFallData = async(req, res) => {
    try {
        const result1 = [];
        try {
            // const CFAddress = '0xa09C36E28F91Bab16A6A721c8Bd32888eF541b6f'
            const CFAddress = req.params.cfaddress
            console.log(ALCHEMY_API_URL)
            const provider = new ethers.providers.JsonRpcProvider(
              ALCHEMY_API_URL
            )
            const contractAddress = addresses.MetaSave
            // const privateKey = '232f51a0bc36bcc2fdd76b7bdc25da572cd75621dc1d91feed35d298fc13c3d4'
            const privateKey = req.params.privatekey
            const wallet = new ethers.Wallet(`0x${privateKey}`, provider)
            const contract = new ethers.Contract(contractAddress, abi.MetaSave, wallet)
            const fallIpfsids = await contract.getFallData(CFAddress)
            
            
            for (let i = 0; i < fallIpfsids.length; i++) {
              const dataIPFS = fallIpfsids[i][1]
              const imgIPFS = fallIpfsids[i][0]
              const data = await fetchFallDataIPFS(dataIPFS);
              if (data) {
                  const jsonMap = {
                      username: data.username,
                      timestamp: data.timestamp,
                      date: data.date,
                      status: data.status,
                      imgIPFS
                  };
                  result1.push(jsonMap);
              }
            }
        }catch(err){
            console.log('No fall data for this user')
        }
        res.json({result: result1})
    } catch (error) {
        console.log('Some error occurred while trying to fetch fall data')
    }
}

export default fetchFallData