const express = require('express')
const router = express.Router()
const auth = require('./auth')
const user = require('./user')
const post = require('./post')

router.use('/', auth)
router.use('/user', user)
router.use('/post', post)

module.exports = router
