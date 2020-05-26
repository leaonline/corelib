import { Meteor } from 'meteor/meteor'

/**
 * Returns truthy if we have a current user session and Meteor.userId,
 * as well as Meteor.user both return no falsey value.
 * @return {boolean}
 */
export const loggedIn = () => !!(Meteor.userId() && Meteor.user())

/**
 * Returns true if either Meteor.userId, Meteor.user or both return a falsey value
 * @return {boolean}
 */
export const loggedOut = () => !loggedIn()
