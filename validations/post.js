'use strict'

const validator = require('../utils/validator').CustomValidator

class PostValidation {
  static createPost(params) {
    const messages = [
      validator.isRequired('title', params.title),
      validator.isRequired('text', params.text),
      validator.validateLength('title', params.title, 1, 100),
      validator.validateLength('text', params.text, 4, 2500),
    ]
    const errors = messages.filter((message) => {
      return message !== null
    })
    return errors.length > 0 ? errors[0] : null
  }

  static updatePost(params) {
    const messages = [
      validator.isRequired('title', params.title),
      validator.isRequired('text', params.text),
      validator.validateLength('title', params.title, 1, 100),
      validator.validateLength('text', params.text, 4, 2500),
    ]
    const errors = messages.filter((message) => {
      return message !== null
    })
    return errors.length > 0 ? errors[0] : null
  }
}

module.exports.PostValidation = PostValidation
