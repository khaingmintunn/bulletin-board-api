'use strict'

const validator = require('../utils/validator').CustomValidator
const { USER_TYPE } = require('../constant')

class UserValidation {
  static create(params) {
    const messages = [
      validator.isRequired('name', params.name),
      validator.isRequired('email', params.email),
      validator.isRequired('password', params.password),
      validator.validateLength('name', params.name, 4, 30),
      validator.isEmail('email', params.email),
      validator.validateLength('password', params.password, 8, 30),
      validator.isInclude('user_type', params.user_type, [
        USER_TYPE.ADMIN,
        USER_TYPE.USER,
      ]),
    ]
    const errors = messages.filter((message) => {
      return message !== null
    })
    return errors.length > 0 ? errors[0] : null
  }

  static updateProfile(params) {
    const messages = [
      validator.isRequired('name', params.name),
      validator.validateLength('name', params.name, 4, 30),
    ]
    const errors = messages.filter((message) => {
      return message !== null
    })
    return errors.length > 0 ? errors[0] : null
  }

  static updateEmail(params) {
    const messages = [
      validator.isRequired('email', params.email),
      validator.isEmail('email', params.email),
    ]
    const errors = messages.filter((message) => {
      return message !== null
    })
    return errors.length > 0 ? errors[0] : null
  }

  static updateEmailConfirm(params) {
    const messages = [validator.isRequired('token_id', params.token_id)]
    const errors = messages.filter((message) => {
      return message !== null
    })
    return errors.length > 0 ? errors[0] : null
  }

  static updatePassword(params) {
    const messages = [
      validator.isRequired('old_password', params.old_password),
      validator.isRequired('new_password', params.new_password),
      validator.validateLength('old_password', params.old_password, 8, 30),
      validator.validateLength('new_password', params.new_password, 8, 30),
    ]
    const errors = messages.filter((message) => {
      return message !== null
    })
    return errors.length > 0 ? errors[0] : null
  }
}

module.exports.UserValidation = UserValidation
