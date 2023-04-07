import express from 'express';
import * as mailController from '../controller/mailer'

const router = express.Router()

router.post('/registerMail', mailController.registerMail)

export default router