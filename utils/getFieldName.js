import { FieldNotFoundError } from '../errors/FieldNotFoundError'

/**
 * Extracts a field's name from a given schema.
 * @param schema {object}
 * @param field {object}
 * @return {string}
 * @throws {FieldNotFoundError} if no field has been found that matches given field
 */
export const getFieldName = (schema, field) => {
  const found = Object.entries(schema).find(([key, value]) => value === field)
  if (found?.length === 2) {
    return found[0]
  }

  throw new FieldNotFoundError(field)
}
