import { merge } from 'lodash'
import { makeExecutableSchema } from 'graphql-tools'

import {
  typeDefs as mongodbTypeDefs,
  resolvers as mongodbResolvers,
} from 'api/mongodb/schema'

const typeDefs = [`

  type QueryType {

    posts(
      limit: Int
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
  }

  schema {
    query: QueryType
    mutation: MutationType
  }

`, ...mongodbTypeDefs]

const rootResolvers = {

  QueryType: {
    posts(root, { limit = 10 }, { PostModel }) {
      return PostModel.find().limit(limit).sort('-createdAt')
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
    }
  }
}

const resolvers = merge(rootResolvers, mongodbResolvers)

export default makeExecutableSchema({
  typeDefs,
  resolvers,
})
