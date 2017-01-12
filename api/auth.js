// import jwt from 'jsonwebtoken'
// import { User } from './model'
// import { jwtSecret } from './config'

export function getUser(req) {
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

// export async function getUser(token) {
//   if (!token) return { user: null }

//   try {
//     const decodedToken = jwt.verify(token.substring(4), jwtSecret)

//     const user = await User.findOne({ _id: decodedToken.id })

//     return {
//       user,
//     }
//   } catch (err) {
//     return { user: null }
//   }
// }

// export function generateToken(user) {
//   return `JWT ${jwt.sign({ id: user._id }, jwtSecret)}`
// }
