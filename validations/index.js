const AuthValidation = require('./auth').AuthValidation
const UserValidation = require('./user').UserValidation
const PostValidation = require('./post').PostValidation

module.exports = {
  Auth: AuthValidation,
  User: UserValidation,
  Post: PostValidation,
}
