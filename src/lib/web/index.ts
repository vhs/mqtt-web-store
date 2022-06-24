import Koa from 'koa'
import KoaRouter from '@koa/router'
import KoaBody from 'koa-body'

import { getDebugger, isJsonString } from 'src/lib/util'
import redis from 'src/lib/redis'

const debug = getDebugger('web')

const app = new Koa()
const router = new KoaRouter()

app.use(KoaBody())

router.get('/', async (ctx: Koa.Context, next: Koa.Next) => {
  ctx.body = await redis.getAll(ctx.request.query.filter)
})

router.delete('/:path*', async (ctx: Koa.Context, next: Koa.Next) => {
  const path = ctx.request.path

  await redis.remove(path)

  ctx.body = await redis.get(path)
})

router.get('/:path*', async (ctx: Koa.Context, next: Koa.Next) => {
  const path = ctx.request.path

  const result = await redis.get(path)

  if (isJsonString(result.value)) result.value = JSON.parse(result.value)

  ctx.body = result
})

router.put('/:path*', async (ctx: Koa.Context, next: Koa.Next) => {
  const path = ctx.request.path
  const value = typeof ctx.request.body === 'string' ? ctx.request.body : JSON.stringify(ctx.request.body)

  await redis.save(path, value)

  ctx.body = await redis.get(path)
})

app
  .use(router.routes())
  .use(router.allowedMethods())

export const start = async (port: number | string) => {
  debug('Starting on port:', port)

  await app.listen(port)
}

export default { start }
