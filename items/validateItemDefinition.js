import { Meteor } from 'meteor/meteor'
import { Items } from './Items'
import { SchemaValidator } from '../validation/SchemaValidator'
import { createSimpleCache } from '../utils/simpleCache'

const fromCache = createSimpleCache()

export const validateItemDefinition = (itemType, contentDoc) => {
  const itemDef = Items.get(itemType)
  if (!itemDef) {
    throw new Meteor.Error('validation.failed', 'items.unknownType', { itemType })
  }

  const validator = fromCache(itemType, function () {
    return SchemaValidator.get(itemDef.schema)
  })

  return validator(contentDoc)
}
