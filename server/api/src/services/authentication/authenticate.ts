import { db } from '../../knex-connection'
import { saveUser } from '../users/save-user'
import { saveAuthToken } from '../tokens/save-auth-token'
import { getUser } from './passport-profile-converter'

export const authenticate = async ({ token, profile }) => {
  const user = getUser(profile)
  let userId = await getUserId(user.email)

  if (userId === 0) {
    userId = await saveUser(user)
  }

  const authToken = {
    userId,
    token,
    provider: profile.provider,
    status: 'active',
  }

  await saveAuthToken(authToken)
}

const getUserId = async (email: string) => {
  const user = await db('users')
    .select('id')
    .where({ email })
    .first()

  return user ? user.id : 0
}
