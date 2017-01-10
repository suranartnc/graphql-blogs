import { merge } from 'lodash'
import { makeExecutableSchema } from 'graphql-tools'

import {
  schema as querySchema,
  resolvers as queryResolvers,
} from './query/schema'

const typeDefs = [`
  schema {
    query: QueryType
  }
`, ...querySchema]

const resolvers = merge(queryResolvers)

export default makeExecutableSchema({
  typeDefs,
  resolvers,
})
