const express = require('express')
const user = require('../controllers/user')
const { bossAuth, userAuth } = require('../controllers/verifyToken')

const router = express.Router()
router.get('/', userAuth, user.getDashboard)
router.get('/profile', userAuth, user.getProfile)

module.exports = router
