import { Mongo } from 'meteor/mongo'

/** @private */
const localCollections = new Map()

/**
 * Local Collections only! Adds a local collection to the current realm so it is
 * accessible via {getCollection}.
 * @param collection {Mongo.Collection} the LocalCollection to add
 * @param name {String} name of the collection to be used for access
 * @return {boolean} true if added, false if not
 */
export const addCollection = (collection, name) => {
  // non-local collections are already registered
  if (collection._name !== null) {
    throw new Error(`Unexpected collection name. Expected null, got ${collection._name}`)
  }

  localCollections.set(name, collection)
  return localCollections.has(name)
}

/**
 * Gets a collection either by name (String) or { name } (Object).
 * Main relation is the {collection._name} property.
 * Note, that a {LocalCollection} is not covered out-of-the box and needs to be
 * added via {addCollection}.
 * Prioritizes local collections in favor of synced collections.
 * @param name Either a String or Object with name property
 * @return {Mongo.Collection|undefined} The collection by name or undefined.
 */
export const getCollection = name => {
  const type = typeof name

  if (type !== 'string' && type !== 'object') {
    throw new Error(`Unexpected type for "name" -> ${type}, expected String or Object { name:String }`)
  }

  const ctxName = type === 'string'
    ? name
    : name.name

  if (localCollections.has(ctxName)) {
    return localCollections.get(ctxName)
  }

  return Mongo.Collection.get(name)
}
