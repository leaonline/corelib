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
  api.versionsFrom('1.6')
  api.use('ecmascript')
  api.use('leaonline:ejson-regexp')

  // client-only definitions are set as weak
  // so we let the project decide, which package to load
  // therefore ensure a minimum package footprint
  const arch = ['server', 'client']
  const options = { weak: true }

  api.use('http', arch, options)

  // special case is when using dynamic imports
  // because we then need templaing to exist in the first place
  const USE_DYNAMIC_IMPORTS = process.env.USE_DYNAMIC_IMPORTS
  if (USE_DYNAMIC_IMPORTS) {
    api.use('templating')
    api.use('dynamic-import')
  }
})

Package.onTest(function (api) {
  api.use('ecmascript')
  api.use('tinytest')
  api.use('leaonline:core')
  api.mainModule('core-tests.js')
})
