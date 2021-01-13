const express = require('express')
const user = require('../controllers/user')
const JobDesc = require('../models/JobDesc')
const { bossAuth, userAuth } = require('../controllers/verifyToken')

const router = express.Router()
router.get('/', user.getDashboard)
router.get('/profile', user.getProfile)
router.get('/applications', user.getApplications)
router.get('/:jobId', user.showJob)
router.post('/:jobId', user.applyJob)

module.exports = router
