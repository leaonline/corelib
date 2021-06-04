export const SchemaValidator = {}

const defaultValidator = () => {
  throw new Error('SchemaValidator is not set')
}

let _validator

SchemaValidator.set = function (validator) {
  _validator = validator
}

SchemaValidator.get = function (schema) {
  const target = _validator || defaultValidator
  return target(schema)
}
