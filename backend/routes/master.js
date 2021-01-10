import express from 'express'
import { getProfile, createJob } from '../controllers/master.js'

const router = express.Router()

router.get('/', getProfile)
router.post('/create', createJob)

export default router
