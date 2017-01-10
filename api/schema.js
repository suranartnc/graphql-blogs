import { merge } from 'lodash'
import { makeExecutableSchema } from 'graphql-tools'

import {
  typeDefs as mongodbTypeDefs,
  resolvers as mongodbResolvers,
} from 'api/mongodb/schema'

const typeDefs = [`

  type QueryType {
    post(
      _id: String!
    ): PostType

    posts(
      limit: Int
    ): [PostType]

    currentUser: UserType
  }

  type UserType {
    _id: String!
    email: String!
    profile: UserProfileType
  }

  type UserProfileType {
    type: String!
    displayName: String!
    picture: String!
  }

  schema {
    query: QueryType
    # mutation: MutationType
    # subscription: SubscriptionType
  }
`, ...mongodbTypeDefs]

const rootResolvers = {
  QueryType: {
    currentUser(root, {}, { user }) {
      return user
    },
    posts(root, { limit = 10 }, { PostModel }) {
      return PostModel.find().limit().sort('-date')
    },
    post(root, { _id }, { PostModel }) {
      return PostModel.findById(_id)
    }
  }
}

const resolvers = merge(rootResolvers, mongodbResolvers)

export default makeExecutableSchema({
  typeDefs,
  resolvers,
})
