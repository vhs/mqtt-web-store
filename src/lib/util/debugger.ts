import Debug from 'debug'

const baseDebugger = Debug('app')

export const getDebugger = (scope: string) => {
  return baseDebugger.extend(scope)
}
