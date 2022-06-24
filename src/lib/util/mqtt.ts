import { mqttOpts } from 'src/types/mqtt-opts'

export const formatMQTTUrl = (mqtt:mqttOpts): string => {
  const { proto, user, pass, host, port } = mqtt

  let url = `${proto}://`

  if (user !== '') url += `${user}`

  if (user !== '' && pass !== '') url += `:${pass}`

  if (user !== '') url += '@'

  url += `${host}:${port}`

  return url
}

export const formatMQTTUrlSafe = (mqtt:mqttOpts): string => {
  const { proto, user, pass, host, port } = mqtt

  let url = `${proto}://`

  if (user !== '') url += `${user}`

  if (user !== '' && pass !== '') url += ':REDACTED'

  if (user !== '') url += '@'

  url += `${host}:${port}`

  return url
}

export default { formatMQTTUrl, formatMQTTUrlSafe }
