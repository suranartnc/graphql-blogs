export const schema = [`

  type PostType {
    _id: String!
    title: String!
    body: String!
    author: UserType!
    categories: [CategoryType]
    comments(
      limit: Int
      offset: Int
    ): [CommentType]
    createdAt: String!
  }

  type PostConnection {
    edges: [PostEdge]
    pageInfo: PageInfo!
  }

  type PostEdge {
    cursor: String!
    node: PostType
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

    comments(post, { limit = 10, offset = 0 }, { CommentModel }) {
      return CommentModel.find({ postId: post._id })
        .skip(offset)
        .limit(limit)
    }

  },

  CommentType: {
    author(comment, args, { UserModel }) {
      return UserModel.findById(comment.userId)
    }
  }
}
