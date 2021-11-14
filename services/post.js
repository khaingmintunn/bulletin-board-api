const express = require('express')
const router = express.Router()
const { ERROR } = require('../constant')

router.get('/post', (req, res) => {
  try {
  } catch (error) {
    res.status(500).send({ message: ERROR.POST })
  }
})
module.exports = router
