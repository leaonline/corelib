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

    it('splits paragraph text by soft line breaks', async function () {
      const tokens = await Markdown.tokenize({
        value: 'first line\nsecond line\nthird line'
      })

      expect(tokens.map(({ type, text }) => ({ type, text }))).to.deep.equal([
        { type: 'paragraph', text: 'first line' },
        { type: 'paragraph', text: 'second line' },
        { type: 'paragraph', text: 'third line' }
      ])
    })

    it('returns one token per list item', async function () {
      const tokens = await Markdown.tokenize({
        value: '- one\n- two'
      })

      expect(tokens.map(({ type, text }) => ({ type, text }))).to.deep.equal([
        { type: 'list', text: 'one' },
        { type: 'list', text: 'two' }
      ])
    })

    it('handles soft line breaks with inline formatting', async function () {
      const tokens = await Markdown.tokenize({
        value: 'first line with **bold**\nsecond line with *italic*'
      })

      expect(tokens.map(({ text }) => text)).to.deep.equal([
        'first line with bold',
        'second line with italic'
      ])
    })

    it('returns one token per list item with formatting stripped', async function () {
      const tokens = await Markdown.tokenize({
        value: '- item with **bold**\n- item with *italic*'
      })

      expect(tokens.map(({ type, text }) => ({ type, text }))).to.deep.equal([
        { type: 'list', text: 'item with bold' },
        { type: 'list', text: 'item with italic' }
      ])
    })

    it('handles mixed content with paragraphs and lists', async function () {
      const tokens = await Markdown.tokenize({
        value: 'A paragraph\n\n- item 1\n- item 2'
      })

      expect(tokens.map(({ type, text }) => ({ type, text }))).to.deep.equal([
        { type: 'paragraph', text: 'A paragraph' },
        { type: 'list', text: 'item 1' },
        { type: 'list', text: 'item 2' }
      ])
    })

    it('returns one token per table cell', async function () {
      const tokens = await Markdown.tokenize({
        value: '| H1 | H2 |\n|----|----|\n| C1 | C2 |'
      })

      expect(tokens.map(({ type, text }) => ({ type, text }))).to.deep.equal([
        { type: 'table', text: 'H1' },
        { type: 'table', text: 'H2' },
        { type: 'table', text: 'C1' },
        { type: 'table', text: 'C2' }
      ])
    })

    it('handles table cells with formatting', async function () {
      const tokens = await Markdown.tokenize({
        value: '| H **1** | H *2* |\n|---------|-------|\n| C **1** | C *2* |'
      })

      expect(tokens.map(({ text }) => text)).to.deep.equal([
        'H 1',
        'H 2',
        'C 1',
        'C 2'
      ])
    })
  })
})