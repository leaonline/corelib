export const SchemaValidator = {}

const message = `Schema validator is not implemented!
In order to implement SchemaValidator, you need to run

import { 
  SchemaValidator 
} from 'meteor/leaonline:corelib/validation/SchemaValidator'

SchemaValidator.set(function (schema) {
  // ... your implementation here
})
`

let _validator = () => {
  throw new Error(message)
}

SchemaValidator.set = function (validator) {
  console.info('[SchemaValidator]: set factory function')
  _validator = validator
}

SchemaValidator.get = function (schema) {
  return _validator(schema)
}
