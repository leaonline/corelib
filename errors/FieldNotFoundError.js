import { Meteor } from 'meteor/meteor'

export class FieldNotFoundError extends Meteor.Error {
  constructor (reason, details) {
    super('errors.fieldNotFound', reason, details)
  }
}
