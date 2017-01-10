import path from 'path'
import express from 'express'
import { graphqlExpress, graphiqlExpress } from 'graphql-server-express'

import bodyParser from 'body-parser'

import { createServer } from 'http'

import config from 'api/config'
import schema from 'api/schema'

import mongooseConnector from './mongodb/connector'
const mongoose = mongooseConnector(config.mongoConnectionString)

const app = express()
app.use(express.static(path.join(process.cwd(), 'static')))
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

function getUser(req, res) {
  let user = {
    _id: '',
    email: '',
    profile: {
      type: 'guest',
      picture: '',
    }
  }
  return user
}

app.use('/graphql', graphqlExpress((req, res) => {

  const query = req.query.query || req.body.query;
  if (query && query.length > 2000) {
    throw new Error('Query too large.');
  }

  const user = getUser(req, res)

  return {
    schema,
    context: {
      user,
      UserModel: mongoose.model('User'),
      CategoryModel: mongoose.model('Category'),
      PostModel: mongoose.model('Post'),
      CommentModel: mongoose.model('Comment')
    }
  }
}))

app.use('/graphiql', graphiqlExpress({
  endpointURL: '/graphql',
  query: `{
  posts(limit: 10) {
    _id
    title
  }
}`,
}))

app.listen(config.port, (err) => {
  if (err) {
    console.log(err) // eslint-disable-line no-console
    return
  }
  console.log(`GraphQL server listening on ${config.host}:${config.port}`) // eslint-disable-line no-console
})
