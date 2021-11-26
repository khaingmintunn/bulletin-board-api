const express = require('express')
const router = express.Router()
const { ERROR } = require('../constant')
const Model = require('../models')
const { AUTH_USER } = require('../utils/auth')

router.post('/create', AUTH_USER, async (req, res) => {
  try {
    const result = await Model.Post.create(req.body)
    if (result.error) {
      return res
        .status(result.error.status)
        .send({ message: result.error.message })
    }

    return res.status(200).send(result)
  } catch (error) {
    res.status(500).send({ message: ERROR.POST_CREATE })
  }
})

router.get('/post/:post_id', AUTH_USER, async (req, res) => {
  try {
    const params = { ...req.params, ...req.body.current_user }
    const result = await Model.Post.getPost(params)
    if (result.error) {
      return res
        .status(result.error.status)
        .send({ message: result.error.message })
    }

    return res.status(200).send(result)
  } catch (error) {
    res.status(500).send({ message: ERROR.POST })
  }
})

router.get('/list', AUTH_USER, async (req, res) => {
  try {
    const result = await Model.Post.getPosts(req.body.current_user.user_id)
    if (result.error) {
      return res
        .status(result.error.status)
        .send({ message: result.error.message })
    }

    return res.status(200).send(result)
  } catch (error) {
    res.status(500).send({ message: ERROR.POST_LIST })
  }
})

router.put('/:post_id', AUTH_USER, async (req, res) => {
  try {
    const params = { ...req.params, ...req.body }
    const result = await Model.Post.updatePost(params)
    if (result.error) {
      return res
        .status(result.error.status)
        .send({ message: result.error.message })
    }

    return res.status(200).send(result)
  } catch (error) {
    res.status(500).send({ message: ERROR.POST_UPDATE })
  }
})

router.delete('/:post_id', AUTH_USER, async (req, res) => {
  try {
    const params = { ...req.params, ...req.body.current_user }
    const result = await Model.Post.deletePost(params)
    if (result.error) {
      return res
        .status(result.error.status)
        .send({ message: result.error.message })
    }

    return res.status(200).send(result)
  } catch (error) {
    res.status(500).send({ message: ERROR.POST_DELETE })
  }
})
module.exports = router
