const express = require('express')
const user = require('../controllers/boss')

const router = express.Router()
router.get('/', user.getProfile)

module.exports = router
