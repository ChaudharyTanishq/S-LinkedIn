const express = require('express')
const boss = require('../controllers/boss')

const router = express.Router()
router.get('/', boss.getProfile)
router.post('/create', boss.createJob)

module.exports = router
