'use strict'

const uuidv4 = require('uuid').v4
const moment = require('moment')
const PostValidation = require('../validations').Post
const PostSchema = require('../schemas').Post
const { ERROR } = require('../constant')

class PostModel {
  constructor(params) {
    this.post_id = params.post_id
    this.title = params.title
    this.text = params.text
    this.user_id = params.user_id
    this.created = params.created
    this.updated = params.updated
  }

  static async create(params) {
    const error = PostValidation.createPost(params)
    if (error) return { error: { status: 400, message: error } }

    const post_payload = this.createPostPayload(params)
    const post_schema = new PostSchema(post_payload)
    const post = await post_schema.save()

    return {
      post: this.toModel(post),
    }
  }

  static async updatePost(params) {
    const error = PostValidation.updatePost(params)
    if (error) return { error: { status: 400, message: error } }

    const post = await PostSchema.findOne({
      post_id: params.post_id,
      user_id: params.current_user.user_id,
    })
    if (!post) return { error: { status: 404, message: ERROR.POST_NOT_FOUND } }

    const updated_post = await PostSchema.findOneAndUpdate(
      { post_id: params.post_id, user_id: params.current_user.user_id },
      {
        title: params.title || user.title,
        text: params.text || user.text,
        updated: moment().unix(),
      },
      { new: true }
    )
    return {
      post: this.toModel(updated_post),
    }
  }

  static async getPost(params) {
    const post = await PostSchema.findOne({
      post_id: params.post_id,
      user_id: params.user_id,
    })

    return {
      post: this.toModel(post),
    }
  }

  static async getPosts(user_id) {
    const posts = await PostSchema.find({ user_id }).sort({
      updated: -1,
      created: -1,
    })
    let posts_model = []
    posts.map((post) => {
      posts_model.push(this.toModel(post))
    })

    return {
      posts: posts_model,
    }
  }

  static async deletePost(params) {
    const post = await PostSchema.findOne({
      post_id: params.post_id,
      user_id: params.user_id,
    })
    if (!post) return { error: { status: 404, message: ERROR.POST_NOT_FOUND } }

    const deleted_post = await PostSchema.remove({
      post_id: params.post_id,
      user_id: params.user_id,
    })

    return {
      post: deleted_post ? this.toModel(post): null,
    }
  }

  /**************************************************************************************************
   * Post Payload
   ***************************************************************************************************/
  static createPostPayload(params) {
    return {
      post_id: uuidv4(),
      title: params.title,
      text: params.text,
      user_id: params.current_user.user_id,
      created: moment().unix(),
    }
  }

  static toModel(params) {
    if (!params) return null

    const post = {
      post_id: params.post_id !== undefined ? params.post_id : null,
      title: params.title !== undefined ? params.title : null,
      text: params.text !== undefined ? params.text : null,
      user_id: params.user_id !== undefined ? params.user_id : null,
      created: params.created !== undefined ? params.created : null,
      updated: params.updated !== undefined ? params.updated : null,
    }

    return new PostModel(post)
  }
}

module.exports.PostModel = PostModel
