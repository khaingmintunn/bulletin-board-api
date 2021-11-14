const mongoose = require('mongoose')
const Schema = mongoose.Schema

const PostSchema = new Schema({
  post_id: {
    type: String,
    required: true,
    unique: true,
  },
  title: {
    type: String,
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  user_id: {
    type: String,
    required: true,
  },
  created: {
    type: Number,
    required: true,
  },
  updated: {
    type: Number,
  },
})

module.exports = mongoose.model('Post', PostSchema)
