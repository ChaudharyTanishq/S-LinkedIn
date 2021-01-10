import express from 'express'
import { getProfile, getDashboard } from '../controllers/slave.js'
const router = express.Router()

router.get('/', getProfile)
router.get('/dashboard', getDashboard)

export default router
