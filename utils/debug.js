import { Meteor } from 'meteor/meteor'
import debug from 'debug'

const LogLevel = {
  error: 'error',
  warn: 'warn',
  info: 'info',
  verbose: 'verbose',
  debug: 'debug',
  silly: 'silly'
}

const LogLevelIndex = {
  error: 0,
  warn: 1,
  info: 2,
  verbose: 3,
  debug: 4,
  silly: 5
}

const settings = Meteor.isServer
  ? Meteor.settings.log
  : Meteor.settings.public.log

const name = settings.name
const logLevel = settings.level || LogLevel.info
// const globalScope = settings.scope || '*'

if (Meteor.isClient) {
  debug.enabled(`${name}`)
}

class Logger {
  constructor (scope) {
    this.scope = scope
    this.DEBUG = this.ERROR = this.INFO = this.SILLY = this.VERBOSE = this.WARN = debug(`${name}:${this.scope}`)
    this.logLevel = logLevel
    this.info('[Logger]: created ', name, scope, logLevel)
  }

  debug (message) {
    if (LogLevelIndex[this.logLevel] >= LogLevelIndex.debug) {
      this.DEBUG(message)
    }
  }

  error (message) {
    if (LogLevelIndex[this.logLevel] >= LogLevelIndex.error) {
      this.ERROR(message)
    }
  }

  info (message) {
    if (LogLevelIndex[this.logLevel] >= LogLevelIndex.info) {
      this.INFO(message)
    }
  }

  silly (message) {
    if (LogLevelIndex[this.logLevel] >= LogLevelIndex.silly) {
      this.SILLY(message)
    }
  }

  verbose (message) {
    if (LogLevelIndex[this.logLevel] >= LogLevelIndex.verbose) {
      this.VERBOSE(message)
    }
  }

  warn (message) {
    if (LogLevelIndex[this.logLevel] >= LogLevelIndex.warn) {
      this.WARN(message)
    }
  }
}

export const createLogger = (scope) => {
  return new Logger(scope)
}
