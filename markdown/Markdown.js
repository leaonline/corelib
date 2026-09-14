import { marked, Renderer, Tokenizer } from 'marked'

export const Markdown = {}

const internal = {
  Renderer,
  Tokenizer,
  defaultOptions: {
    mangle: false,
    breaks: true,
    gfm: true,
    async: true,
    headerIds: false,
  }
}

const normalizeMarkdown = value =>
  value.replace(/^[\u200B\u200C\u200D\u200E\u200F\uFEFF]/, '')

const toPlainText = token => {
  if (typeof token === 'string') return token
  if (Array.isArray(token)) {
    return token
      .map(toPlainText)
      .filter(Boolean)
      .join(' ')
      .replace(/\s+/g, ' ')
      .trim()
  }
  if (!token || typeof token !== 'object') return ''

  const parts = []
  if (Array.isArray(token.tokens)) parts.push(toPlainText(token.tokens))
  if (Array.isArray(token.items)) parts.push(toPlainText(token.items))
  if (Array.isArray(token.header)) parts.push(toPlainText(token.header))
  if (Array.isArray(token.rows)) parts.push(toPlainText(token.rows))

  const plain = parts
    .filter(Boolean)
    .join(' ')
    .replace(/\s+/g, ' ')
    .trim()

  if (plain) return plain
  if (typeof token.text === 'string') return token.text
  return ''
}

Markdown.setRenderer = value => {
  internal.renderer = value
}

Markdown.setTokenizer = value => {
  internal.tokenizer = value
}

Markdown.setDefaultOptions = defaultOptions => {
  internal.defaultOptions = defaultOptions
}

Markdown.render = async (element) => {
  if (!element?.value) return ''
  const { value, ...options } = element
  const renderer = new internal.Renderer(options)
  return await marked.parse(
    normalizeMarkdown(value),
    {
      ...internal.defaultOptions,
      renderer,
    },
  )
}

Markdown.tokenize = async (element) => {
  if (!element?.value || typeof element.value !== 'string') return []
  const { value, ...options } = element

  return marked.lexer(normalizeMarkdown(value), {
    ...internal.defaultOptions,
    ...options,
  })
    .filter(token => token.type !== 'space')
    .map(token => ({
      ...token,
      text: toPlainText(token),
    }))
    .filter(token => token.text.length > 0)
}
