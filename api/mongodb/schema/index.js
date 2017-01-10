export const typeDefs = [`
  type PostType {
    _id: String!
    title: String!
    body: String!
    author: UserType!
  }

  type UserType {
    _id: String!
    email: String!
    profile: UserProfileType!
  }

  type UserProfileType {
    type: String!
    displayName: String
    picture: String
  }
`]

export const resolvers = {
  PostType: {
    author(root, args, { UserModel }) {
      return UserModel.findById(root.userId)
    }
  }
}
