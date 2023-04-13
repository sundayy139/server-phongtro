import express from 'express';
import * as paymentController from '../controller/payment'
import { verifyAdmin, verifyToken } from '../middleware/auth';

const router = express.Router()

router.use(verifyToken)
router.post('/create-payment-url', paymentController.createPaymentUrl);
router.get('/vnpay-return', paymentController.paymentReturn);
router.get('/pay-history', paymentController.paymentHistory);
router.use(verifyAdmin)
router.get('/pay-success', paymentController.getPaymentSuccess);
router.get('/pay-by-month', paymentController.getPaymentByMonth);

export default router