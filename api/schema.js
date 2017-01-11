import { merge } from 'lodash'
import { makeExecutableSchema } from 'graphql-tools'

import {
  schema as mongodbSchema,
  resolvers as mongodbResolvers,
} from 'api/mongodb/schema'

const rootSchema = [`

  # Each root field must have resolver
  # Each custom type have some fields, use to cast received data
  # Each field with custom type must have resolver
  # Each resolver tell us how to resolve fields of a custom type

  type QueryType {

    posts(
      limit: Int
      offset: Int
    ): [PostType]

    post(
      _id: String!
    ): PostType

    currentUser: UserType
  }

  type MutationType {

    addPost(
      title: String!
      body: String!
      categories: [String]
      thumbnail: String
      tags: [String]
    ): PostType

    addComment(
      body: String!
      postId: String!
    ): CommentType
  }

  schema {
    query: QueryType
    mutation: MutationType
  }

`]

const rootResolvers = {

  QueryType: {
    posts(root, { limit = 10, offset = 0 }, { PostModel }) {
      return PostModel.find()
        .skip(offset)
        .limit(limit)
        .sort('-createdAt')
    },
    post(root, { _id }, { PostModel }) {
      return PostModel.findById(_id)
    },
    currentUser(root, args, { user }) {
      return user
    }
  },

  MutationType: {
    async addPost(root, args, { PostModel, user }) {
      if (!user) {
        throw new Error('Must be logged in to add new post.');
      }
      const post = Object.assign({}, args)
      post.userId = user._id
      const newPost = await PostModel.create(post)
      return PostModel.findById(newPost._id)
    },
    async addComment(root, args, { CommentModel, user }) {
      if (!user) {
        throw new Error('Must be logged in to post a comment.');
      }
      const comment = Object.assign({}, args)
      comment.userId = user._id
      const newComment = await CommentModel.create(comment)
      return CommentModel.findById(newComment._id)
    }
  }
}

const schema = [...rootSchema, ...mongodbSchema];
const resolvers = merge(rootResolvers, mongodbResolvers)

export default makeExecutableSchema({
  typeDefs: schema,
  resolvers,
})
