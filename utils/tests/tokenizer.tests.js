/* eslint-env mocha */
import { expect } from 'chai'
import { createSimpleTokenizer } from '../tokenizer'

const start = '['
const end = ']'
const tokenizer = createSimpleTokenizer(start, end)
describe(createSimpleTokenizer.name, function () {
  it('tokenizes a simple field', function () {
    const tokens = tokenizer('[this is interesting]')
    expect(tokens).to.deep.equal([{
      index: 0,
      length: 0,
      value: ''
    }, {
      index: 1,
      isToken: true,
      length: 19,
      value: 'this is interesting'
    }, {
      index: 2,
      length: 0,
      value: ''
    }])
  })
  it('tokenizes simple field with prefix and suffix', function () {
    expect(tokenizer('foo [bar]')).to.deep.equal([{
      index: 0,
      length: 4,
      value: 'foo '
    }, {
      index: 1,
      isToken: true,
      length: 3,
      value: 'bar'
    }, {
      index: 2,
      length: 0,
      value: ''
    }])

    expect(tokenizer('foo [bar] baz')).to.deep.equal([{
      index: 0,
      length: 4,
      value: 'foo '
    }, {
      index: 1,
      isToken: true,
      length: 3,
      value: 'bar'
    }, {
      index: 2,
      length: 4,
      value: ' baz'
    }])

    expect(tokenizer('[bar] foo')).to.deep.equal([{
      index: 0,
      length: 0,
      value: ''
    }, {
      index: 1,
      isToken: true,
      length: 3,
      value: 'bar'
    }, {
      index: 2,
      length: 4,
      value: ' foo'
    }])
  })
  it('tokenizes multiple fields', function () {
    const tokens = tokenizer('foo [bar] and [baz]')
    expect(tokens).to.deep.equal([{
      index: 0,
      length: 4,
      value: 'foo '
    }, {
      index: 1,
      isToken: true,
      length: 3,
      value: 'bar'
    }, {
      index: 2,
      length: 5,
      value: ' and '
    }, {
      index: 3,
      length: 3,
      isToken: true,
      value: 'baz'
    }, {
      index: 4,
      length: 0,
      value: ''
    }])
  })
})
