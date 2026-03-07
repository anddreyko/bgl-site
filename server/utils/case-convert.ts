type JsonValue = string | number | boolean | null | undefined | JsonObject | JsonArray
type JsonObject = { [key: string]: JsonValue }
type JsonArray = JsonValue[]

function toSnakeCase(str: string): string {
  return str.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`)
}

function toCamelCase(str: string): string {
  return str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase())
}

function convertKeys(obj: JsonValue, convertFn: (key: string) => string): JsonValue {
  if (obj === null || obj === undefined || typeof obj !== 'object') return obj
  if (Array.isArray(obj)) return obj.map(item => convertKeys(item, convertFn))

  const result: JsonObject = {}
  for (const key in obj) {
    result[convertFn(key)] = convertKeys((obj as JsonObject)[key], convertFn)
  }
  return result
}

export function snakeToCamel<T = unknown>(obj: unknown): T {
  return convertKeys(obj as JsonValue, toCamelCase) as T
}

export function camelToSnake<T = unknown>(obj: unknown): T {
  return convertKeys(obj as JsonValue, toSnakeCase) as T
}
