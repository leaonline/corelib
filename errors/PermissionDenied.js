import { LeaError } from './LeaErorr'

export class PermissionDeniedError extends LeaError {
  static get TITLE () {
    return 'errors.permissionDenied.title'
  }

  static get NOT_OWNER () {
    return 'errors.permissionDenied.notOwner'
  }

  static get NO_USER () {
    return 'errors.permissionDenied.noUser'
  }

  static get NOT_IN_ROLES () {
    return 'errors.permissionDenied.notInRoles'
  }

  constructor (reason, details) {
    super(PermissionDeniedError.TITLE, reason, details)
  }
}
