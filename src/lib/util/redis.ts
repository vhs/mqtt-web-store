import { redisOpts } from 'src/types/redis-opts'

export const formatRedisUrl = (redis:redisOpts): string => {
  const { proto, user, pass, host, port, db } = redis

  let url = `${proto}://`

  if (user !== '') url += `${user}`

  if (user !== '' && pass !== '') url += `:${pass}`

  if (user !== '') url += '@'

  url += `${host}:${port}`

  if (db !== '') url += `/${db}`

  return url
}

export const formatRedisUrlSafe = (redis:redisOpts): string => {
  const { proto, user, pass, host, port, db } = redis

  let url = `${proto}://`

  if (user !== '') url += `${user}`

  if (user !== '' && pass !== '') url += ':REDACTED'

  if (user !== '') url += '@'

  url += `${host}:${port}`

  if (db !== '') url += `/${db}`

  return url
}

export default { formatRedisUrl, formatRedisUrlSafe }
