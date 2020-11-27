import { Meteor } from 'meteor/meteor'
import { Items } from './Items'
import { SchemaValidator } from '../validation/SchemaValidator'
import { createSimpleCache } from '../utils/simpleCache'

const fromCache = createSimpleCache()

export const validateItemDefinition = (itemType, contentDoc) => {
  const typename = (typeof itemType === 'object') ? itemType.name : itemType
  const itemDef = Items.get(typename)

  if (!itemDef) {
    throw new Meteor.Error('validation.failed', 'items.unknownType', { itemType })
  }

  const validator = fromCache(typename, function () {
    return SchemaValidator.get(itemDef.schema)
  })

  return validator(contentDoc)
}
