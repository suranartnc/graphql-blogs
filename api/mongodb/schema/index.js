export const typeDefs = [`
  type PostType {
    _id: String!
    title: String!
    author: UserType
  }
`]

export const resolvers = {
  PostType: {
    author(root, {}, { UserModel}) {
      return UserModel.findById(root.userId)
    }
  }
}
