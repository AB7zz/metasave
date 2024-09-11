import dotenv from 'dotenv'
import axios from 'axios'

dotenv.config()

const PINATA_BASE_URL = process.env.PINATA_BASE_URL
const PINATA_API_KEY = process.env.PINATA_API_KEY

const fetchDetails = async(req, res) => {
    try {
        const ipfsId = req.params.cid;
        console.log("CID:",ipfsId)
        let data
        try{
            const response = await axios.get(`${PINATA_BASE_URL}/ipfs/${ipfsId}`, {
                headers: {
                    'x-pinata-gateway-token': PINATA_API_KEY
                }
            })
            console.log(response.data)
            data = response.data
        }catch(e){
            console.log('Some error occurred while trying to fetch data from IPFS')
        }
        res.json({data})
    } catch (error) {
        console.log('Some error occurred while trying to fetch data from IPFS')
    }
}

export default fetchDetails
