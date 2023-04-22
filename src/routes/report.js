import express from 'express';
import * as reportController from '../controller/report'
import { verifyAdmin, verifyToken } from '../middleware/auth';

const router = express.Router()

router.use(verifyToken)
router.post('/create', reportController.createReport)

router.use(verifyAdmin)
router.get('/all', reportController.getAllReport)
router.put('/update-status', reportController.updateStatus)
router.delete('/delete-report', reportController.deleteReport)

export default router