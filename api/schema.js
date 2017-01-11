import { merge } from 'lodash'
import { makeExecutableSchema } from 'graphql-tools'

import {
  typeDefs as mongodbTypeDefs,
  resolvers as mongodbResolvers,
} from 'api/mongodb/schema'

const typeDefs = [`

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

`, ...mongodbTypeDefs]

const rootResolvers = {

  QueryType: {
    posts(root, { first = 10, offset = 0 }, { PostModel }) {
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
    addPost(root, args, { PostModel, user }) {
      const post = Object.assign({}, args)
      post.userId = user._id
      return PostModel.create(post)
        .then(({ _id }) => PostModel.findById(_id))
    },
    addComment(root, args, { CommentModel, user }) {
      const comment = Object.assign({}, args)
      comment.userId = user._id
      return CommentModel.create(comment)
        .then(({ _id }) => CommentModel.findById(_id))
    }
  }
}

const resolvers = merge(rootResolvers, mongodbResolvers)

export default makeExecutableSchema({
  typeDefs,
  resolvers,
})
