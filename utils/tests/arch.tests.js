/* eslint-env mocha */
import { Meteor } from 'meteor/meteor'
import { expect } from 'chai'
import { Random } from 'meteor/random'
import {
  onServer,
  onServerExec,
  onClientExec,
  onClient,
  isomorph
} from '../arch'

describe('arch', function () {
  describe(onServer.name, function () {
    const id = Random.id()
    if (Meteor.isServer) {
      expect(onServer(id)).to.equal(id)
    }
    if (Meteor.isClient) {
      expect(onServer(id)).to.equal(undefined)
    }
  })
  describe(onServerExec.name, function () {
    const id = Random.id()
    if (Meteor.isServer) {
      expect(onServerExec(() => id)).to.equal(id)
    }
    if (Meteor.isClient) {
      expect(onServerExec(() => id)).to.equal(undefined)
    }
  })
  describe(onClient.name, function () {
    const id = Random.id()
    if (Meteor.isClient) {
      expect(onClient(id)).to.equal(id)
    }
    if (Meteor.isServer) {
      expect(onClient(id)).to.equal(undefined)
    }
  })
  describe(onClientExec.name, function () {
    const id = Random.id()
    if (Meteor.isClient) {
      expect(onClientExec(() => id)).to.equal(id)
    }
    if (Meteor.isServer) {
      expect(onClientExec(() => id)).to.equal(undefined)
    }
  })
  describe(isomorph.name, function () {
    it('allows to define for server and client', function () {
      const server = Random.id()
      const client = Random.id()
      const value = isomorph({
        onClient: () => client,
        onServer: () => server
      })

      if (Meteor.isServer) {
        expect(value).to.equal(server)
      }

      if (Meteor.isClient) {
        expect(value).to.equal(client)
      }
    })
  })
})
