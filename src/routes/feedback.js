import express from 'express';
import * as feedbackController from '../controller/feedback'

const router = express.Router()

router.post('/create', feedbackController.createFeedback)
router.get('/all', feedbackController.getFeedbacks)

export default router