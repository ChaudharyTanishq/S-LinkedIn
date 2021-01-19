const express = require('express')
const user = require('../controllers/user')
const JobDesc = require('../models/JobDesc')
const { bossAuth, userAuth, getWho } = require('../controllers/verifyToken')

const router = express.Router()
router.get('/dashboard', user.getDashboard)
router.get('/profile', user.getProfile)
router.patch('/profile', user.updateProfile)
router.post('/profile/education', user.updateEducation)
router.get('/applications', user.getApplications)
router.get('/dashboard/:jobId', user.showJob)
router.post('/dashboard/:jobId', user.applyJob)
router.post('/rating', user.postRating)
module.exports = router
