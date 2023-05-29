import express from 'express';
import * as userController from '../controller/user'
import { verifyAdmin, verifyToken } from '../middleware/auth'

const router = express.Router()

router.use(verifyToken)
router.get('/current_user', userController.getCurrentUser)
router.put('/profile/update', userController.updateProfile)

router.use(verifyAdmin)
router.get('/all', userController.getUsers)
router.delete('/delete', userController.deleteUser)
router.get('/count_user_by_month', userController.getCountUserByMonth)
router.get('/count_user_by_day', userController.getCountUserByDay)
router.get('/user_by_month', userController.getUserByMonth)

export default router