import express from 'express';
import * as authController from '../controller/auth'
import { verifyToken } from '../middleware/auth'

const router = express.Router()

router.post('/register', authController.register)
router.post('/login', authController.login)
router.post('/forgot-password', authController.forgotPassword)
router.post('/reset-password', authController.resetPassword)

router.use(verifyToken)
router.put('/change-password', authController.changePassword)
export default router