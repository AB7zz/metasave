import express from 'express'
import insertFall from '../controllers/fall/insertFall.js'
import fetchFallData from '../controllers/fall/fetchFallData.js'
import multer from 'multer'
import path, { dirname } from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url'
import { abi } from '../abi/index.js'
import { addresses } from '../constants/addresses.js'
import { ethers } from 'ethers'
import keccak256 from 'keccak256'
import { StandardMerkleTree } from "@openzeppelin/merkle-tree";
import AA from '../helpers/aa.js'
import fetchMT from '../helpers/merkleTree/fetchMT.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const ALCHEMY_API_URL = process.env.ALCHEMY_API_URL

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const username = req.body.USERNAME
    const uploadsDir = path.join(__dirname, `../uploads/${username}`)
    fs.mkdirSync(uploadsDir, { recursive: true })
    cb(null, uploadsDir)
  },
  filename: function (req, file, cb) {
    cb(null, 'image.jpg')
  },
})

const upload = multer({ storage: storage })

const router = express.Router()

router.post('/fall', upload.single('file'), insertFall)
router.get('/falldata/:cfaddress/:privatekey', fetchFallData)

export default router
