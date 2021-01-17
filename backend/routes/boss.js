const express = require('express')
const boss = require('../controllers/boss')
const { bossAuth, userAuth, getWho } = require('../controllers/verifyToken')

const router = express.Router()
router.get('/profile', boss.getProfile)
router.patch('/profile', boss.updateProfile)
router.get('/myJobs', boss.getMyJobs)
router.post('/create', boss.createJob)
router.get('/myJobs/:jobId', boss.showJob)
router.post('/myJobs/:jobId', boss.updateApplicationsJob)
router.delete('/myJobs/:jobId', boss.deleteJob)
router.patch('/myJobs/:jobId', boss.updateJob)

module.exports = router
