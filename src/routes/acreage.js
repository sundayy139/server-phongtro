import express from 'express';
import * as acreageController from '../controller/acreage'

const router = express.Router()

router.get('/all', acreageController.getAcreages)

export default router