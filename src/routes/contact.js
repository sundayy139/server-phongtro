import express from 'express';
import * as contactController from '../controller/contact'

const router = express.Router()

router.post('/create', contactController.createFeedback)
router.get('/all', contactController.getFeedbacks)

export default router