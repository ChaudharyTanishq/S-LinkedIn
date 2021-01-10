const express = require('express')
const user = require('../controllers/user')

const router = express.Router()
router.get('/', user.getDashboard)
router.get('/profile', user.getProfile)

module.exports = router
