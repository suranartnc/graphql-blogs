import { merge } from 'lodash'
import { makeExecutableSchema } from 'graphql-tools'

import {
  typeDefs as mongooseTypeDefs,
  resolvers as mongooseResolvers,
} from 'api/mongoose/schema'

const typeDefs = [`
  schema {
    query: QueryType
    # mutation: MutationType
    # subscription: SubscriptionType
  }
`, ...mongooseTypeDefs]

const resolvers = merge(mongooseResolvers)

export default makeExecutableSchema({
  typeDefs,
  resolvers,
})
