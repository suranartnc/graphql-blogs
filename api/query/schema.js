export const schema = [`
  type Query {
    post(
      id: Int!
    ): Post
  }

  type Post {
    id: Int!
  }
`]

export const resolvers = {
  Query: {
    post(root, { id, ...args }) {
      return {
        id
      }
    }
  }
}
