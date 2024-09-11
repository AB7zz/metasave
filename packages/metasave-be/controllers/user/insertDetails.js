import axios from 'axios';
import { FormData } from 'formdata-node';
import dotenv from 'dotenv';

dotenv.config();

const PINATA_API_KEY = process.env.PINATA_API_KEY;

const insertDetails = async (req, res) => {
  try {
    const formData = new FormData();
    const data = req.body.data;

    // Create pinataMetadata object
    let pinataMetadata;
    if (data.type === 'clinic') {
      pinataMetadata = {
        keyvalues: {
          CF: data.CF,
          name: data.name,
          email: data.email,
          address1: data.address1,
          firstPhone: data.firstPhone,
          secondPhone: data.secondPhone,
          clinicName: data.clinicName
        }
      };
    } else if (data.type === 'user') {
      pinataMetadata = {
        keyvalues: {
          CF: data.CF,
          name: data.name,
          email: data.email,
          age: data.age,
          gender: data.gender,
          phone: data.phone,
          address: data.address
        },
        contacts: [
          { name: data.contacts[0].name, phoneNumber: data.contacts[0].phoneNumber },
          { name: data.contacts[1].name, phoneNumber: data.contacts[1].phoneNumber }
        ]
      };
    }

    // Convert pinataMetadata to JSON
    const pinataMetadataJSON = JSON.stringify(pinataMetadata);

    // Create the JSON file from data
    const jsonFile = new Blob([pinataMetadataJSON], { type: 'application/json' });
    formData.set('file', jsonFile);

    // Add pinataMetadata to FormData
    formData.set('pinataMetadata', pinataMetadataJSON);

    // Pinata options
    const pinataOptions = JSON.stringify({
      cidVersion: 0,
    });
    formData.set('pinataOptions', pinataOptions);

    try {
      console.log('Uploading to IPFS');
      const response = await axios.post(
        'https://api.pinata.cloud/pinning/pinFileToIPFS',
        formData,
        {
          maxBodyLength: 'Infinity',
          headers: {
            'Content-Type': `multipart/form-data; boundary=${formData._boundary}`,
            Authorization: `Bearer ${PINATA_API_KEY}`,
          },
        }
      );
      console.log('Successfully uploaded to IPFS!', response.data.IpfsHash);
      res.json({ CID: response.data.IpfsHash });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: 'Failed to upload to IPFS' });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'Failed to process request' });
  }
};

export default insertDetails;
