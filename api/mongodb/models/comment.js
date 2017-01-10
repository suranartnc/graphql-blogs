import mongoose from 'mongoose'

const CommentSchema = new mongoose.Schema({
  body: {
    type: String,
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  postId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post',
    required: true,
  },
  repliedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Comment',
  },
}, { timestamps: true })

export default mongoose.model('Comment', CommentSchema)
