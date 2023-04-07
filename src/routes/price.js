import express from 'express';
import * as priceController from '../controller/price'

const router = express.Router()

router.get('/all', priceController.getPrices)

export default router