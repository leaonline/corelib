import { Meteor } from 'meteor/meteor'

export class FieldNotFoundError extends Meteor.Error {
  constructor (reason, details) {
    super(FieldNotFoundError.NAME, reason, details)
  }
}

FieldNotFoundError.NAME = 'errors.fieldNotFound'
