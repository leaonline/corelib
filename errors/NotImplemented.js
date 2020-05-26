import { LeaError } from './LeaErorr'

export class NotImplementedError extends LeaError {
  static get TITLE () {
    return 'errors.notImplemented.title'
  }

  constructor (reason, details) {
    super(NotImplementedError.TITLE, reason, details)
  }
}
