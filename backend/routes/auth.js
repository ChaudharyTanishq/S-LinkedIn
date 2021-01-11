const express = require('express')
const auth = require('../controllers/auth')

const router = express.Router()

router.post('/signup', auth.postSignup)
router.post('/signin', auth.postSignin)

module.exports = router
