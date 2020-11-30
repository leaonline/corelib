/* eslint-env mocha */
import { Random } from 'meteor/random'
import { createGetAllRoute } from '../getAll'
import { expect } from 'chai'

describe(createGetAllRoute.name, function () {
  it ('defines a route for a given context', function () {
    const context = {
      name: 'foo-bar',
      schema: { bar: Number } // should be ignored
    }

    const route = createGetAllRoute({ context })
    expect(route).to.deep.equal({
      path: `/api/${context.name}/get/all`,
      method: 'get',
      schema: undefined,
    })
  })

  it ('allows to optionally define a custom schema', function () {
    const context = {
      name: 'foo-bar'
    }

    const schema = {
      bar: Number
    }

    const route = createGetAllRoute({ context, schema })
    expect(route).to.deep.equal({
      path: `/api/${context.name}/get/all`,
      method: 'get',
      schema: { bar: Number },
    })
  })
  it ('allows to optionally define a run function', function () {
    const randomId = Random.id()
    const context = {
      name: 'foo-bar'
    }
    const runFct = function run () {
      return randomId
    }

    const route = createGetAllRoute({ context, run: runFct })
    expect(route).to.deep.equal({
      path: `/api/${context.name}/get/all`,
      method: 'get',
      schema: undefined,
    })

    if (Meteor.isServer) {
      expect(route.run).to.equal(runFct)
      expect(route.run()).to.equal(randomId)
    }

    if (Meteor.isClient) {
      expect(route.run).to.equal(undefined)
    }
  })
})
