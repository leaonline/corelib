import { Scoring } from '../scoring/Scoring'

const isUndefined = value => value === Scoring.UNDEFINED || typeof value === 'undefined' || value === null || value === ''

export const isUndefinedResponse = value => isUndefined(value) ||
  (Array.isArray(value) && value.every(isUndefined))
