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
    _id: '5873738dbd47c80001efec08',  // for dev purpose only
    email: 'Annonymous@gmail.com',
    profile: {
      type: 'guest',
      displayName: 'Annonymous',
      picture: 'http://geniusdemo.eu/front/images/avatar.jpg',
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
    },
    formatError: ({ message, locations, stack }) => {
      let format = {
        message
      }
      if (config.isProduction !== true) {
        format = {
          ...format,
          locations,
          stack
        }
      }
      return format
    },
  }
}))

app.use('/graphiql', graphiqlExpress({
  endpointURL: '/graphql',
  query: `{
  posts(limit: 10) {
    _id
    title
    body
    categories
    author {
      _id
      email
      profile {
        type
        displayName
        picture
      }
    }
    comments
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
