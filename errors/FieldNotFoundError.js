import { LeaError } from './LeaErorr'

export class FieldNotFoundError extends LeaError {
  static get TITLE () {
    return 'errors.fieldNotFound.title'
  }

  constructor (reason, details) {
    super(FieldNotFoundError.TITLE, reason, details)
  }
}
