import express from 'express';
import * as addressController from '../controller/address'

const router = express.Router()

router.get('/provinces', addressController.getProvinces)
router.get('/districts', addressController.getDistricts)
router.get('/wards', addressController.getWards)

export default router