/* eslint-env mocha */
import { expect } from 'chai'
import { Markdown } from '../Markdown'

describe('Markdown', () => {
  describe('tokenize', function () {
    it('returns an empty array for invalid markdown input', async function () {
      const values = ['', undefined, null, 1, {}, []]

      const results = await Promise.all(
        values.map(value => Markdown.tokenize({ value }))
      )

      results.forEach(result => {
        expect(result).to.deep.equal([])
      })
    })

    it('returns a flat list of block tokens with plain text', async function () {
      const tokens = await Markdown.tokenize({
        value: '# Headline 1\n\nThis is some paragraph.'
      })

      expect(tokens.map(({ type, text }) => ({ type, text }))).to.deep.equal([
        { type: 'heading', text: 'Headline 1' },
        { type: 'paragraph', text: 'This is some paragraph.' }
      ])
    })

    it('strips inline formatting from token text', async function () {
      const tokens = await Markdown.tokenize({
        value: '# Headline **1**\n\nThis is *some* paragraph.'
      })

      expect(tokens.map(({ text }) => text)).to.deep.equal([
        'Headline 1',
        'This is some paragraph.'
      ])
    })

    it('collects text from nested block tokens', async function () {
      const tokens = await Markdown.tokenize({
        value: '- one\n- two'
      })

      expect(tokens.map(({ type, text }) => ({ type, text }))).to.deep.equal([
        { type: 'list', text: 'one two' }
      ])
    })
  })
})