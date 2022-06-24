import 'dotenv/config'
import convict from 'convict'

import { getDebugger, getSplitProcessEnv } from 'src/lib/util'

const debug = getDebugger('config')

convict.addFormat(require('convict-format-with-validator').ipaddress)

const config = convict({
  env: {
    doc: 'The application environment.',
    format: ['production', 'development', 'test'],
    default: 'development',
    env: 'NODE_ENV'
  },
  ip: {
    doc: 'The IP address to bind.',
    format: 'ipaddress',
    default: '0.0.0.0',
    env: 'IP_ADDRESS',
    arg: 'ip'
  },
  port: {
    doc: 'The port to bind.',
    format: 'port',
    default: 3000,
    env: 'PORT',
    arg: 'port'
  },
  mqtt: {
    proto: {
      doc: 'The MQTT proto',
      format: String,
      default: 'tcp',
      env: 'MQTT_PROTO',
      arg: 'mqtt-proto'
    },
    user: {
      doc: 'The MQTT user',
      format: String,
      default: '',
      env: 'MQTT_USER',
      arg: 'mqtt-user'
    },
    pass: {
      doc: 'The MQTT pass',
      format: String,
      default: '',
      env: 'MQTT_PASS',
      arg: 'mqtt-pass'
    },
    host: {
      doc: 'MQTT host name/IP',
      format: '*',
      env: 'MQTT_HOST',
      default: 'test.mosquitto.org',
      arg: 'mqtt-host'
    },
    port: {
      doc: 'MQTT port',
      format: 'port',
      default: 1883,
      env: 'MQTT_PORT',
      arg: 'mqtt-port'
    },
    topic: {
      doc: 'MQTT topic',
      format: String,
      default: '/#',
      env: 'MQTT_TOPIC',
      arg: 'mqtt-topic'
    }
  },
  redis: {
    proto: {
      doc: 'The redis proto',
      format: String,
      default: 'redis',
      env: 'REDIS_PROTO',
      arg: 'redis-proto'
    },
    user: {
      doc: 'The redis user',
      format: String,
      default: '',
      env: 'REDIS_USER',
      arg: 'redis-user'
    },
    pass: {
      doc: 'The redis pass',
      format: String,
      default: '',
      env: 'REDIS_PASS',
      arg: 'redis-pass'
    },
    host: {
      doc: 'Redis host name/IP',
      format: '*',
      env: 'REDIS_HOST',
      default: '127.0.0.1',
      arg: 'redis-host'
    },
    port: {
      doc: 'Redis port',
      format: 'port',
      default: 6379,
      env: 'REDIS_PORT',
      arg: 'redis-port'
    },
    db: {
      doc: 'Redis database number',
      format: String,
      env: 'REDIS_DB',
      arg: 'redis-db',
      default: ''
    }
  }
})

// Load environment dependent configuration
const env = config.get('env')

if ((getSplitProcessEnv('CONFIG_FILES') ?? '').length > 0) config.loadFile(getSplitProcessEnv('CONFIG_FILES') ?? '')

try {
  config.loadFile(['./config.' + env + '.json', './config.json'])
} catch (e) {
  debug('No config file found')
}

// Perform validation
config.validate({ allowed: 'strict' })

export default config
