import MQTT from 'async-mqtt'

import redis from 'src/lib/redis'
import { formatMQTTUrl, getDebugger } from 'src/lib/util'

import { mqttOpts } from 'src/types/mqtt-opts'

const debug = getDebugger('mqtt')
const debugMessage = debug.extend('message')

let mqttClient: any = null

export const start = async (opts: mqttOpts) => {
  if (mqttClient !== null) {
    debug('Client already started')
    return
  }

  debug('Starting...')
  const url = formatMQTTUrl(opts)

  mqttClient = MQTT.connect(url)

  mqttClient.on('connect', () => {
    debug('MQTT Client connected!')

    debug('Subscribing to:', opts.topic)
    mqttClient.subscribe(opts.topic)

    mqttClient.on('message', (topic: string, message: string) => {
      debugMessage('MQTT Client message:', topic, message)
      redis.save(topic, message)
    })
  })
}

export const getClient = () => mqttClient

export default { start, getClient }
