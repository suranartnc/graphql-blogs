import { merge } from 'lodash'
import { makeExecutableSchema } from 'graphql-tools'

import {
  schema as mongodbSchema,
  resolvers as mongodbResolvers
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

    testPostConnection: PostConnection

    currentUser: UserType
  }

  type MutationType {

    addPost(
      title: String!
      body: String!
      categories: [String]
      thumbnail: String
      tags: [String]
    ): addPostResponseType

    addComment(
      body: String!
      postId: String!
    ): CommentType
  }

  type PageInfo {
    endCursor: String
    hasNextPage: Boolean!
    hasPreviousPage: Boolean!
    startCursor: String
  }

  type addPostResponseType {
    post: PostType,
    errors: [UserErrorType]!
  }

  type UserErrorType {
    key: String,
    message: String!
  }

  schema {
    query: QueryType
    mutation: MutationType
  }

`]

const rootResolvers = {

  QueryType: {
    posts (root, { limit = 10, offset = 0 }, { PostModel }) {
      return PostModel.find()
        .skip(offset)
        .limit(limit)
        .sort('-createdAt')
    },
    post (root, { _id }, { PostModel }) {
      return PostModel.findById(_id)
    },
    testPostConnection (root, args, { PostModel }) {
      return PostModel.find()
        .limit(5)
        .then((posts) => {
          const edges = posts.map(post => ({
            cursor: `post-${post._id.toString()}`,
            node: post
          }))

          const pageInfo = {
            endCursor: edges[edges.length - 1] ? edges[edges.length - 1].cursor : false,
            hasNextPage: true,
            hasPreviousPage: false,
            startCursor: edges[0] ? edges[0].cursor : false
          }

          return {
            edges,
            pageInfo
          }
        })
    },
    currentUser (root, args, { user }) {
      return user
    }
  },

  MutationType: {
    async addPost (root, args, { PostModel, user }) {

      if (!user) {
        throw new Error('Must be logged in to add new post.');
      }

      let newPost = null
      let errors = []

      const post = Object.assign({}, args)

      if (post.title.length < 3) {
        errors.push({
          key: 'title',
          message: 'The title field must longer than 3 characters.'
        })
      }

      if (errors.length === 0) {
        post.userId = user._id
        newPost = await PostModel.create(post)
      }

      return {
        post: newPost,
        errors
      }
    },

    addComment (root, args, { CommentModel, user }) {
      if (!user) {
        throw new Error('Must be logged in to post a comment.');
      }
      const comment = Object.assign({}, args)
      comment.userId = user._id
      return CommentModel.create(comment)
    }
  }
}

const schema = [...rootSchema, ...mongodbSchema];
const resolvers = merge(rootResolvers, mongodbResolvers)

export default makeExecutableSchema({
  typeDefs: schema,
  resolvers
})
