import express from 'express';
import * as mailController from '../controller/mailer'

const router = express.Router()

router.post('/register', mailController.registerMail)
router.post('/contact', mailController.contactMail)

export default router