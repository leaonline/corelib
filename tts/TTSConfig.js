import { check, Match } from 'meteor/check'

export const TTSConfig = {}

TTSConfig.name = 'TTSConfig'

// /////////////////////////////////////////////////////////////////////////////
//
// INTERNAL
//
// /////////////////////////////////////////////////////////////////////////////

let internalUrlLoader = undefined

// /////////////////////////////////////////////////////////////////////////////
//
// PUBLIC
//
// /////////////////////////////////////////////////////////////////////////////

/**
 * Allows to define a loader by passing a value or to retrieve it by passing no
 * argument. Pass null to unset the loader.
 * @param {Function|null|undefined} [loader]
 * @return {Function|null|undefined} the current loader
 */
TTSConfig.urlLoader = function urlLoader (loader) {
  check(loader, Match.Maybe(Function))

  if (loader || loader === null) {
    internalUrlLoader = loader
  }

  return internalUrlLoader
}
