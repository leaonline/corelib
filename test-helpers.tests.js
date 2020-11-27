import SimpleSchema from 'simpl-schema'
import { SchemaOptions } from './schema/SchemaOptions'

// allow our custom schema keys here to pass schema based tests
SimpleSchema.extendOptions(Object.keys(SchemaOptions))

export const createSchema = (schema, options) => new SimpleSchema(schema, options)

export const multiSchema = (...defs) =>  SimpleSchema.oneOf(defs)

export const delay = ms => new Promise(resolve => setTimeout(resolve, ms))
export const iterate = (num, fct) => (new Array(num)).forEach(fct)

export const unsafeInt = negative => negative
  ? (Number.MIN_SAFE_INTEGER - 1)
  : (Number.MAX_SAFE_INTEGER + 1)