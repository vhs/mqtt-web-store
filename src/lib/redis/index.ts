import { createClient } from 'redis'

import { formatRedisUrl, getDebugger } from 'src/lib/util'

import { redisOpts } from 'src/types/redis-opts'

const debug = getDebugger('redis')

export let client: any = null

export const start = async (opts: redisOpts) => {
  if (client !== null) {
    debug('Client already started')
    return
  }

  const redisUrl = formatRedisUrl(opts)

  debug('Starting:', redisUrl)

  client = createClient({ url: formatRedisUrl(opts) })

  client.on('error', (err: any) => { console.log('Redis Client Error:', err); process.exit(1) })

  client.on('ready', () => { debug('Redis Client connected!') })

  await client.connect()
}

export const getClient = () => client

export const getAll = async (filter?:any) => {
  const storeKeys = await client.keys('store:*')

  if (storeKeys.length === 0) return []

  const resultSet = await Promise.all(storeKeys.map(async (storeKey: string) => {
    const key = storeKey.substring(6)

    const value = await client.get(`store:${key}`)
    const ts = await client.get(`ts:${key}`)

    return { key, value, ts }
  }))

  if (typeof filter === 'string') {
    return resultSet.filter((item: any) => (item.key.indexOf(filter) > -1 || item.value.indexOf(filter) > -1))
  } else {
    return resultSet
  }
}

export const get = async (key: string) => {
  const value = await client.get(`store:${key}`)
  const ts = await client.get(`ts:${key}`)

  return { key, value, ts }
}

export const remove = async (key: string) => {
  const value = await client.delete(`store:${key}`)
  const ts = await client.delete(`ts:${key}`)

  return { key, value, ts }
}

export const save = async (path: string, value: any) => {
  const ts = Date.now()

  await client.set(`ts:${path}`, ts)
  await client.set(`store:${path}`, value)
}

export default { start, getClient, getAll, get, remove, save }
