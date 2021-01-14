const express = require('express')
const auth = require('../controllers/auth')
const { bossAuth, userAuth, getWho } = require('../controllers/verifyToken')
const router = express.Router()

router.post('/signup', auth.postSignup)
router.post('/signin', auth.postSignin)
router.get('/who', getWho)

module.exports = router
