/* eslint-env meteor */
Package.describe({
  name: 'leaonline:corelib',
  version: '1.0.0',
  // Brief, one-line summary of the package.
  summary: '',
  // URL to the Git repository containing the source code for this package.
  git: '',
  // By default, Meteor will default to using README.md for documentation.
  // To avoid submitting documentation, set this field to null.
  documentation: 'README.md'
})

Package.onUse(function (api) {
  api.versionsFrom('1.8.1')
  api.use('ecmascript')

  api.mainModule('core-server.js', 'server')

  // client-only definitions are set as weak
  // so we let the project decide, which package to load
  // therefore ensure a minimum package footprint
  api.use('dynamic-import', 'client', {weak: true})
  api.use('reactive-dict', 'client', {weak: true})
  api.use('templating', 'client', {weak: true})
  api.use('http', 'client', {weak: true})
  api.mainModule('core-client.js', 'client')
})

Package.onTest(function (api) {
  api.use('ecmascript')
  api.use('tinytest')
  api.use('leaonline:core')
  api.mainModule('core-tests.js')
})
