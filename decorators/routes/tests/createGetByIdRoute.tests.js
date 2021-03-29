/* eslint-env mocha */
import { Meteor } from 'meteor/meteor'
import { Random } from 'meteor/random'
import { createGetByIdRoute } from '../createGetByIdRoute'
import { expect } from 'chai'

describe(createGetByIdRoute.name, function () {
  it('defines a route for a given context', function () {
    const context = {
      name: 'foo-bar',
      schema: { bar: Number } // should be ignored
    }

    const route = createGetByIdRoute({ context })
    expect(route).to.deep.equal({
      path: `/api/${context.name}/get/byId`,
      method: 'get',
      schema: { _id: String },
      run: undefined
    })
  })

  it('allows to optionally define a custom schema', function () {
    const context = {
      name: 'foo-bar'
    }

    const schema = {
      bar: Number
    }

    const route = createGetByIdRoute({ context, schema })
    expect(route).to.deep.equal({
      path: `/api/${context.name}/get/byId`,
      method: 'get',
      schema: { bar: Number },
      run: undefined
    })
  })
  it('allows to optionally define a run function', function () {
    const randomId = Random.id()
    const context = {
      name: 'foo-bar'
    }
    const runFct = function run () {
      return randomId
    }

    const route = createGetByIdRoute({ context, run: runFct })

    if (Meteor.isServer) {
      expect(route).to.deep.equal({
        path: `/api/${context.name}/get/byId`,
        method: 'get',
        schema: { _id: String },
        run: runFct
      })
      expect(route.run()).to.equal(randomId)
    }

    if (Meteor.isClient) {
      expect(route).to.deep.equal({
        path: `/api/${context.name}/get/byId`,
        method: 'get',
        schema: { _id: String },
        run: undefined
      })
    }
  })
})
