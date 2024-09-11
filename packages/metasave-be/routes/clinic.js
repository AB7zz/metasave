import express from 'express'
import getPatientsOfClinic from '../controllers/clinic/getPatientsOfClinic.js'

const router = express.Router();

router.get('/:clinicId/patients', getPatientsOfClinic);

export default router

