import { Match } from 'meteor/check'

export const isObject = Match.Where(x => typeof x === 'object' && x !== null)
export const maybe = x => Match.Maybe(x)
