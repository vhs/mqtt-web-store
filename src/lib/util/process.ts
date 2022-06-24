export const getSplitProcessEnv = (key: string): string[] | null => {
  if (process.env != null && process.env[key] != null) return null

  const value = process.env[key]
  if (value == null) return null

  return value.split(',')
}
