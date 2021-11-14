const AuthModel = require('./auth').AuthModel
const UserModel = require('./user').UserModel
const TokenModel = require('./token').TokenModel
const PostModel = require('./post').PostModel

module.exports = {
  Auth: AuthModel,
  User: UserModel,
  Token: TokenModel,
  Post: PostModel,
}
