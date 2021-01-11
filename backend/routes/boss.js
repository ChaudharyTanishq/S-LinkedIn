const express = require('express')
const boss = require('../controllers/boss')
const { bossAuth, userAuth } = require('../controllers/verifyToken')

const router = express.Router()
router.get('/', bossAuth, boss.getProfile)
router.post('/create', bossAuth, boss.createJob)

module.exports = router
