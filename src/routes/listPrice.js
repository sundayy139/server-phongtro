import express from 'express';
import * as listPriceController from '../controller/listPrice'
import { verifyAdmin, verifyToken } from '../middleware/auth'

const router = express.Router()

router.use(verifyToken)
router.use(verifyAdmin)
router.get('/all', listPriceController.getListPrice)
router.put('/update', listPriceController.updateListPrice)


export default router