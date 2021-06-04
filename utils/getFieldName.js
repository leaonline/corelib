import { FieldNotFoundError } from '../errors/FieldNotFoundError'

export const getFieldName = (schema, field) => {
  const found = Object.entries(schema).find(([key, value]) => value === field)
  if (found?.length === 2) {
    return found[0]
  }

  throw new FieldNotFoundError(field)
}
