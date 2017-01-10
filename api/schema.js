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

  schema {
    query: QueryType
    # mutation: MutationType
    # subscription: SubscriptionType
  }
`, ...mongodbTypeDefs]

const rootResolvers = {
  QueryType: {
    posts(root, { limit = 10 }, { PostModel }) {
      return PostModel.find().limit(limit).sort('-date')
    },
    post(root, { _id }, { PostModel }) {
      return PostModel.findById(_id)
    },
    currentUser(root, args, { user }) {
      return user
    }
  }
}

const resolvers = merge(rootResolvers, mongodbResolvers)

export default makeExecutableSchema({
  typeDefs,
  resolvers,
})
