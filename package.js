/* eslint-env meteor */
Package.describe({
  name: 'leaonline:corelib',
  version: '1.0.0',
  // Brief, one-line summary of the package.
  summary: 'Includes the most common reusable components for lea.online',
  // URL to the Git repository containing the source code for this package.
  git: 'git@github.com:leaonline/corelib.git',
  // By default, Meteor will default to using README.md for documentation.
  // To avoid submitting documentation, set this field to null.
  documentation: 'README.md'
})

Package.onUse(function (api) {
  api.versionsFrom('1.6')
  api.use('ecmascript')
  api.use('leaonline:ejson-regexp')
})

Package.onTest(function (api) {
  api.use('ecmascript')
  api.use('mongo')
  api.use('random')
  api.use(['lmieulet:meteor-legacy-coverage', 'lmieulet:meteor-coverage','meteortesting:mocha'])
  api.use('leaonline:corelib')
  api.mainModule('core-tests.js')
})
