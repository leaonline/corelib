/* eslint-env mocha */
import { expect } from 'chai'
import { isSafeInteger } from '../isSafeInteger'

describe(isSafeInteger.name, function () {
  it('detects safe integer', function () {
    [
      Number.MIN_SAFE_INTEGER,
      Number.MIN_SAFE_INTEGER,
      Number.MAX_SAFE_INTEGER.toString(),
      Number.MIN_SAFE_INTEGER.toString(),
      1, '1',
      0, '0',
      -1, '-1',
    ].forEach(value => expect(isSafeInteger(value), value).to.equal(true, value))
  })
  it('detects unsafe integer', function () {
    [
      Number.MIN_SAFE_INTEGER - 1,
      Number.MAX_SAFE_INTEGER + 1,
      1.1,
      0.1,
      -1.1,
      NaN,
      Infinity,
      -Infinity,
    ].forEach(value => expect(isSafeInteger(value), value).to.equal(false, value))
  })
})
