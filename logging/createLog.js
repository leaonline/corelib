import { Meteor } from 'meteor/meteor'
import { getProperty } from '../utils/object/getProperty'

export const logTypes = ['log', 'info', 'debug', 'warn', 'error']
const isDevelopment = Meteor.isDevelopment || !Meteor.isProduction

export const createLog = ({ name, type = 'info', devOnly = false }) => {
  if (!name || typeof name !== 'string') throw new TypeError('Expected name.')
  if (!logTypes.includes(type)) throw new TypeError(`Unsupported type ${type}.`)

  // devonly logs should be an empty function so there is nowhere the chance
  // for passed args to reach STDOUT on the server that could sensitive data
  if (devOnly && (!isDevelopment())) {
    return () => {}
  }

  const logger = getProperty(console, type)
  const logName = `[${name}]:`

  return (...args) => args.unshift(logName) && logger.apply(console, args)
}
