export const schema = [`

  type PostType {
    _id: String!
    title: String!
    body: String!
    author: UserType!
    categories: [CategoryType]
    comments: [CommentType]
    createdAt: String!
  }

  type CategoryType {
    title: String!
    slug: String!
  }

  type CommentType {
    body: String!
    author: UserType!
    createdAt: String!
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

    categories(post, args, { CategoryModel }) {
      return CategoryModel.find({
        _id: {
          $in: post.categories,
        },
      })
    },

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
