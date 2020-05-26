import { Meteor } from 'meteor/meteor'

export const onServer = x => Meteor.isServer ? x : undefined
export const onClient = x => Meteor.isClient ? x : undefined
export const onMobile = x => Meteor.isCordova ? x : undefined
