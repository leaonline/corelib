import { Meteor } from 'meteor/meteor'

export class FieldNotFoundError extends Meteor.Error {
  constructor (reason, details) {
    super(FieldNotFoundError.name, reason, details)
  }
}

FieldNotFoundError.name = 'errors.fieldNotFound'
