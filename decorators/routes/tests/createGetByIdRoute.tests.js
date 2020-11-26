/* eslint-env mocha */
import { Random } from 'meteor/random'
import { createGetByIdRoute } from '../createGetByIdRoute'
import { expect } from 'chai'

describe(createGetByIdRoute.name, function () {
  it ('defines a route for a given context', function () {
    const context = {
      name: 'foo-bar',
      schema: { bar: Number } // should be ignored
    }

    const route = createGetByIdRoute({ context })
    expect(route).to.deep.equal({
      path: `/api/${context.name}/get/byId`,
      method: 'get',
      schema: { _id: String }
    })
  })

  it ('allows to optionally define a custom schema', function () {
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
      schema: { bar: Number }
    })
  })
  it ('allows to optionally define a run function', function () {
    const randomId = Random.id()
    const context = {
      name: 'foo-bar'
    }
    const run = function run () {
      return randomId
    }

    const route = createGetByIdRoute({ context, run })
    expect(route).to.deep.equal({
      path: `/api/${context.name}/get/byId`,
      method: 'get',
      schema: { _id: String },
      run: run
    })

    expect(route.run()).to.equal(randomId)
  })
})
