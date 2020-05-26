import { Mongo } from 'meteor/mongo'

/**
 * Gets a collection either by name (String) or { name } (Object).
 * @param options Either a String or Object with name property
 * @return {Mongo.Collection}
 */
export const getCollection = options => {
  const type = typeof options
  if (type === 'string') {
    return Mongo.Collection.get(options)
  }
  if (type === 'object' && options.name && typeof options.name === 'string') {
    return Mongo.Collection.get(options.name)
  }
  throw new Error(`Unexpected type for "name" -> ${type}, expected String or Object { name:String }`)
}
