import express from 'express';
import * as userController from '../controller/user'
import { verifyAdmin, verifyToken } from '../middleware/auth'

const router = express.Router()

router.use(verifyToken)
router.get('/get-current-user', userController.getCurrentUser)
router.put('/update-profile', userController.updateProfile)

router.use(verifyAdmin)
router.get('/get-users', userController.getUsers)
router.delete('/delete-user', userController.deleteUser)
router.get('/get-count-user-by-month', userController.getCountUserByMonth)
router.get('/get-count-user-by-day', userController.getCountUserByDay)
router.get('/get-user-by-month', userController.getUserByMonth)

export default router