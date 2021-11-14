const express = require('express')
const router = express.Router()
const { ERROR } = require('../constant')
const Model = require('../models')
const { AUTH_ADMIN, AUTH_USER, AUTHED } = require('../utils/auth')

router.get('/profile', AUTHED, async (req, res) => {
  try {
    const user = Model.User.toModel(req.body.current_user)
    return res.status(200).send({ user })
  } catch (error) {
    return res.status(500).send({ message: ERROR.PROFILE })
  }
})

router.put('/profile-update', AUTHED, async (req, res) => {
  try {
    const result = await Model.User.profileUpdate(req.body)
    if (result.error) {
      return res
        .status(result.error.status)
        .send({ message: result.error.message })
    }

    return res.status(200).send(result)
  } catch (error) {
    return res.status(500).send({ message: ERROR.PROFILE_UPDATE })
  }
})

router.put('/email-update', AUTHED, async (req, res) => {
  try {
    const result = await Model.User.emailUpdate(req.body)
    if (result.error) {
      return res
        .status(result.error.status)
        .send({ message: result.error.message })
    }

    return res.status(200).send(result)
  } catch (error) {
    return res.status(500).send({ message: ERROR.EMAIL_UPDATE })
  }
})

router.put('/email-update-confirm', AUTHED, async (req, res) => {
  try {
    const result = await Model.User.emailUpdateConfirm(req.body)
    if (result.error) {
      return res
        .status(result.error.status)
        .send({ message: result.error.message })
    }

    return res.status(200).send(result)
  } catch (error) {
    return res.status(500).send({ message: ERROR.EMAIL_UPDATE_CONFIRM })
  }
})

router.put('/password-update', AUTHED, async (req, res) => {
  try {
    const result = await Model.User.passwordUpdate(req.body)
    if (result.error) {
      return res
        .status(result.error.status)
        .send({ message: result.error.message })
    }

    return res.status(200).send(result)
  } catch (error) {
    return res.status(500).send({ message: ERROR.PASSWORD_UPDATE })
  }
})

router.get('/list', AUTH_ADMIN, async (req, res) => {
  try {
    const result = await Model.User.getAll()

    return res.status(200).send(result)
  } catch (error) {
    return res.status(500).send({ message: ERROR.USER_LIST })
  }
})

router.get('/user/:user_id', AUTH_ADMIN, async (req, res) => {
  try {
    const user = await Model.User._getById(req.params.user_id)

    return res.status(200).send({ user })
  } catch (error) {
    return res.status(500).send({ message: ERROR.USER })
  }
})

router.post('/create', AUTH_ADMIN, async (req, res) => {
  try {
    const result = await Model.User.create(req.body)
    if (result.error) {
      return res
        .status(result.error.status)
        .send({ message: result.error.message })
    }

    return res.status(200).send(result)
  } catch (error) {
    return res.status(500).send({ message: ERROR.USER_CREATE })
  }
})

router.put('/:user_id/suspend', AUTH_ADMIN, async (req, res) => {
  try {
    const result = await Model.User.suspend(req.params)
    if (result.error) {
      return res
        .status(result.error.status)
        .send({ message: result.error.message })
    }

    return res.status(200).send(result)
  } catch (error) {
    return res.status(500).send({ message: ERROR.USER_SUSPEND })
  }
})

router.delete('/:user_id', AUTH_ADMIN, async (req, res) => {
  try {
    const result = await Model.User._deleteById(req.params.user_id)
    if (!result) {
      return res
        .status(404)
        .send({ message: ERROR.USER_NOT_FOUND })
    }

    return res.status(200).send(result)
  } catch (error) {
    return res.status(500).send({ message: ERROR.USER_DELETE })
  }
})
module.exports = router
