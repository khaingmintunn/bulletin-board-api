'use strict'

const validator = require('../utils/validator').CustomValidator

class PostValidation {
  static createPost(params) {
    const messages = [
      validator.isRequired('search', params.search),
      validator.validateLength('search', params.search, 4, 50),
    ]
    const errors = messages.filter((message) => {
      return message !== null
    })
    return errors.length > 0 ? errors[0] : null
  }
}

module.exports.PostValidation = PostValidation
