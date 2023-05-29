import express from 'express';
import * as paymentController from '../controller/payment'
import { verifyAdmin, verifyToken } from '../middleware/auth';

const router = express.Router()

router.use(verifyToken)
router.post('/create_payment_url', paymentController.createPaymentUrl);
router.get('/vnpay_return', paymentController.paymentReturn);
router.get('/pay_history', paymentController.paymentHistory);
router.use(verifyAdmin)
router.get('/pay_success', paymentController.getPaymentSuccess);
router.get('/total_pay', paymentController.getTotalPayment);
router.get('/pay_by_month', paymentController.getPaymentByMonth);
router.get('/total_pay_by_month', paymentController.getTotalPaymentByMonth);
router.get('/total_pay_by_day', paymentController.getTotalPaymentByDay);

export default router