export const schema = [`
  type QueryType {
    post(
      _id: String!
    ): PostType

    posts(
      limit: Int!
    ): [PostType]
  }

  type PostType {
    _id: String!
    title: String!
  }
`]

export const resolvers = {
  QueryType: {
    post(root, { _id }, { PostModel }) {
      return PostModel.findById(_id)
    }
  }
}
