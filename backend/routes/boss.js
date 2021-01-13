const express = require('express')
const boss = require('../controllers/boss')
const { bossAuth, userAuth } = require('../controllers/verifyToken')

const router = express.Router()
router.get('/', boss.getProfile)
router.get('/myJobs', boss.getMyJobs)
router.post('/create', boss.createJob)
router.get('/:jobId', boss.showJob)
router.post('/:jobId', boss.updateApplicationsJob)
router.delete('/:jobId', boss.deleteJob)
router.patch('/:jobId', boss.updateJob)

module.exports = router
