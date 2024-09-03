/* eslint-env meteor */
Package.describe({
  name: 'leaonline:corelib',
  version: '2.0.0',
  // Brief, one-line summary of the package.
  summary: 'Includes the most common reusable components for lea.online',
  // URL to the Git repository containing the source code for this package.
  git: 'git@github.com:leaonline/corelib.git',
  // By default, Meteor will default to using README.md for documentation.
  // To avoid submitting documentation, set this field to null.
  documentation: 'README.md'
})

Package.onUse(function (api) {
  api.versionsFrom(['2.8.1', '3.0.1'])
  api.use('ecmascript')
  api.use('reactive-var')
})

Package.onTest(function (api) {
  api.versionsFrom(['2.8.1', '3.0.1'])
  api.use([
    'ecmascript',
    'mongo',
    'random',
    'lmieulet:meteor-coverage@4.3.0',
    'lmieulet:meteor-legacy-coverage@0.4.0',
    'meteortesting:mocha@3.0.0'
  ])
  api.use('leaonline:corelib')
  api.mainModule('core-tests.js')
})
