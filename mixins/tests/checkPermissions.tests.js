/* eslint-env mocha */
import { Random } from 'meteor/random'
import { expect } from 'chai'
import { checkPermissions } from '../checkPermissions'

describe(checkPermissions.name, function () {
  it ('throws on non-logged in users', function () {
    const { run } = checkPermissions({
      run: function () {}
    })
    expect(() => run.call({})).to.throw('errors.permissionDenied')
  })
  it ('passes when a userId exists', function () {
    const id = Random.id()
    const { run } = checkPermissions({
      run: function () {
        return id
      }
    })
    expect(run.call({ userId: Random.id() })).to.equal(id)
  })
  it ('skips, if isPublic flag is set', function () {
    const id = Random.id()
    const { run } = checkPermissions({
      isPublic: true,
      run: function () {
        return id
      }
    })
    expect(run.call({})).to.equal(id)
  })
})