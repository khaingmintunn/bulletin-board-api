'use strict'

const uuidv4 = require('uuid').v4
const moment = require('moment')
const UserValidation = require('../validations').User
const UserSchema = require('../schemas').User
const TokenSchema = require('../schemas').Token
const TokenModel = require('../models/token').TokenModel
const Email = require('../utils/email')
const EmailBody = require('../utils/emailBody')
const Util = require('../utils/util')
const { ERROR } = require('../constant')
const { AUTH_STATUS, TOKEN_TYPE, USER_TYPE } = require('../constant')

class UserModel {
  constructor(params) {
    this.user_id = params.user_id
    this.name = params.name
    this.email = params.email
    this.auth_status = params.auth_status
    this.user_type = params.user_type
    this.created = params.created
    this.updated = params.updated
  }

  static async create(params) {
    const error = UserValidation.create(params)
    if (error) return { error: { status: 400, message: error } }

    const exist_user = await this._getByEmail(params.email)
    if (exist_user)
      return { error: { status: 422, message: ERROR.USER_EXIST_MESSAGE } }
    const payload = await this.createUserPayload(params)
    const user_schema = UserSchema(payload)
    const user = await user_schema.save()

    return { user: this.toModel(user) }
  }

  static async getAll() {
    const users = await this._getAll()
    return { users }
  }

  static async profileUpdate(params) {
    const error = UserValidation.updateProfile(params)
    if (error) return { error: { status: 400, message: error } }

    const exist_user = await this._getById(params.current_user.user_id)
    if (!exist_user)
      return { error: { status: 404, message: ERROR.USER_NOT_FOUND } }
    const user = await this.update({ name: params.name }, exist_user)

    return { user: this.toModel(user) }
  }

  static async emailUpdate(params) {
    const error = UserValidation.updateEmail(params)
    if (error) return { error: { status: 400, message: error } }

    const exist_user = await this._getById(params.current_user.user_id)
    if (!exist_user)
      return { error: { status: 404, message: ERROR.USER_NOT_FOUND } }
    const token = await TokenModel.create(
      TOKEN_TYPE.EMAIL_UPDATE,
      exist_user.user_id,
      { email: params.email }
    )
    if (!token)
      return { error: { status: 500, message: ERROR.INTERNAL_SERVER } }
    await Email.send({
      email: params.email,
      subject: 'Email Changing',
      html: EmailBody.updateEmail({ name: exist_user.name, ...token }),
    })

    return {
      message: `Changing email success. Please check in ${params.email}.`,
    }
  }

  static async emailUpdateConfirm(params) {
    const error = UserValidation.updateEmailConfirm(params)
    if (error) return { error: { status: 400, message: error } }

    const token = await TokenSchema.findOne({
      token_id: params.token_id,
      type: TOKEN_TYPE.EMAIL_UPDATE,
    })
    if (!token) {
      return { error: { status: 401, message: ERROR.TOKEN_NOT_FOUND } }
    }
    if (token?.expired < moment().unix()) {
      return { error: { status: 403, message: ERROR.EXPIRED_MESSAGE } }
    }

    const user = await this._getById(token.user_id)
    if (!user) return { error: { status: 404, message: ERROR.USER_NOT_FOUND } }

    await this.update({ email: token.email }, user)
    await TokenModel.deleteById(params.token_id)
    Email.send({
      email: token.email,
      subject: 'Success: Changing email',
      html: EmailBody.updateEmailConfirm({ name: user.name }),
    })

    return { message: 'Changing email success.' }
  }

  static async passwordUpdate(params) {
    const error = UserValidation.updatePassword(params)
    if (error) return { error: { status: 400, message: error } }

    const user = await UserSchema.findOne({
      user_id: params.current_user.user_id,
    })
    const is_match = await Util.comparePassword(
      params.old_password,
      user.password
    )
    if (!is_match)
      return {
        error: { status: 406, message: ERROR.INCORRECT_CURRENT_PASSWORD },
      }

    const hashed_password = await Util.hashPassword(params.new_password)
    await this.update({ password: hashed_password }, user)
    Email.send({
      email: user.email,
      subject: 'Success: Changing password',
      html: EmailBody.updatePassword({ name: user.name }),
    })

    return { message: 'Password changing success.' }
  }

  static async suspend(params) {
    const exist_user = await UserSchema.findOne({
      user_id: params.user_id,
      auth_status: { $ne: AUTH_STATUS.NO_AUTH },
    })

    if (!exist_user)
      return { error: { status: 406, message: ERROR.NOT_SUSPEND } }
    const auth_status =
      exist_user?.auth_status === AUTH_STATUS.AUTHED
        ? AUTH_STATUS.SUSPENDED
        : AUTH_STATUS.AUTHED
    const user = await this.update({ auth_status }, exist_user)

    Email.send({
      email: exist_user.email,
      subject:
        auth_status === AUTH_STATUS.SUSPENDED ? 'Suspended' : 'Unsuspended',
      html:
        auth_status === AUTH_STATUS.SUSPENDED
          ? EmailBody.suspend({ name: exist_user.name })
          : EmailBody.unsuspend({ name: exist_user.name }),
    })
    return { user }
  }

  static async update(params, user) {
    const updated_user = await UserSchema.findOneAndUpdate(
      { user_id: user.user_id },
      {
        email: params.email || user.email,
        password: params.password || user.password,
        name: params.name || user.name,
        auth_status: params.auth_status || user.auth_status,
        updated: moment().unix(),
      },
      { new: true }
    )

    return this.toModel(updated_user)
  }
  /**************************************************************************************************
   * User Payload
   ***************************************************************************************************/
  static async createUserPayload(params) {
    const hashed_password = await Util.hashPassword(params.password)

    return {
      user_id: uuidv4(),
      name: params.name,
      email: params.email,
      password: hashed_password,
      auth_status: AUTH_STATUS.AUTHED,
      user_type: params.user_type || USER_TYPE.USER,
      created: moment().unix(),
      updated: moment().unix(),
    }
  }
  /**************************************************************************************************
   * Query
   ***************************************************************************************************/
  static async _getAll() {
    const users = await UserSchema.find().sort({ updated: -1 })

    const user_list = []
    users.map((user) => {
      user_list.push(this.toModel(user))
    })

    return user_list
  }

  static async _getByEmail(email) {
    const user = await UserSchema.findOne({ email })

    return this.toModel(user)
  }

  static async _getById(user_id) {
    const user = await UserSchema.findOne({ user_id })

    return this.toModel(user)
  }

  static async _getAuthedUserById(user_id) {
    const user = await UserSchema.findOne({
      user_id,
      auth_status: AUTH_STATUS.AUTHED,
    })

    return this.toModel(user)
  }

  static async _getAuthedUserByEmail(email) {
    const user = await UserSchema.findOne({
      email,
      auth_status: AUTH_STATUS.AUTHED,
    })

    return this.toModel(user)
  }

  static async _deleteById(user_id) {
    const user = await UserSchema.findOneAndDelete({ user_id })

    return user
  }
  /***************************************************************************************************
   * Model
   ****************************************************************************************************/
  static toModel(params) {
    if (!params) return null

    const user = {
      user_id: params.user_id !== undefined ? params.user_id : null,
      name: params.name !== undefined ? params.name : null,
      email: params.email !== undefined ? params.email : null,
      auth_status: params.auth_status !== undefined ? params.auth_status : null,
      user_type: params.user_type !== undefined ? params.user_type : null,
      created: params.created !== undefined ? params.created : null,
      updated: params.updated !== undefined ? params.updated : null,
    }

    return new UserModel(user)
  }
}

module.exports.UserModel = UserModel
