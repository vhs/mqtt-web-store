import config from 'src/lib/config/index'
import { getDebugger } from 'src/lib/util'
import mqtt from 'src/lib/mqtt'
import redis from 'src/lib/redis'
import web from 'src/lib/web'

const debug = getDebugger('main')

debug('Starting...')

redis.start(config.get('redis'))

mqtt.start(config.get('mqtt'))

web.start(config.get('port'))
