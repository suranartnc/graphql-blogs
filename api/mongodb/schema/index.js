export const typeDefs = [`
  type PostType {
    _id: String!
    title: String!
    body: String!
    author: UserType!
    comments: [CommentType]
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

  type CommentType {
    body: String!
    author: UserType!
    date: String!
  }
`]

export const resolvers = {
  PostType: {
    author(post, args, { UserModel }) {
      return UserModel.findById(post.userId)
    },
    comments(post, args, { CommentModel }) {
      return CommentModel.find({
        postId: post._id
      })
    }
  },
  CommentType: {
    author(comment, args, { UserModel }) {
      return UserModel.findById(comment.userId)
    }
  }
}
