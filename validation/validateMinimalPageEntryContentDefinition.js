import { SchemaValidator } from './SchemaValidator'

const minimalPageEntryContentSchema = {
  type: String,
  subtype: String,
  contentId: String,
  width: {
    type: String,
    optional: true
  }
}

let _validator

export const validateMinimalPageEntryContentDefinition = content => {
  if (!_validator) {
    _validator = SchemaValidator.get(minimalPageEntryContentSchema)
  }
  return _validator(content)
}
