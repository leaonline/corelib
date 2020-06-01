import { FieldNotFoundError } from '../errors/FieldNotFoundError'

export const getFieldName = (schema, field) => {
  let find
  Object.entries(schema).some(([key, value]) => {
    if (value === field) {
      find = key
      return true
    }
    return false
  })
  if (!find) {
    throw new FieldNotFoundError(field)
  }
  return find
}

export const createGetFieldName = (context) => field => getFieldName(context.schema, field)
