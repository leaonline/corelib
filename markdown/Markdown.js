import { marked, Renderer, Tokenizer } from 'marked'

export const Markdown = {}

export class DefaultMarkdownRenderer extends Renderer {
  constructor(userOptions) {
    super()
    this.userOptions = userOptions
  }

  heading(data) {
    const { tokens, depth } = data
    const text = this.parser.parseInline(tokens)
    const tts = this.userOptions.useTTS ? internal.createTTS(text, this.userOptions) : ''
    const content = tts ? `${tts} ${text}` : text
    return `<h${depth} class="lea-text">${content}</h${depth}>`
  }

  paragraph({ tokens } /*, level */) {
    // Check if there are line breaks within the paragraph
    const hasBreaks = tokens.some(t => t.type === 'br')
    
    if (hasBreaks) {
      // Split tokens by br and render each segment with its own soundbutton
      const segments = []
      let currentSegment = []
      
      for (const token of tokens) {
        if (token.type === 'br') {
          if (currentSegment.length > 0) {
            segments.push(currentSegment)
            currentSegment = []
          }
        } else {
          currentSegment.push(token)
        }
      }
      if (currentSegment.length > 0) {
        segments.push(currentSegment)
      }
      
      // Render each segment with its own soundbutton
      const renderedSegments = segments.map(segment => {
        const html = this.parser.parseInline(segment)
        const plainText = toPlainText(segment)
        const tts = this.userOptions.useTTS && plainText ? internal.createTTS(plainText, this.userOptions) : ''
        return tts ? `${tts} ${html}` : html
      })
      
      return `<p class="lea-text">${renderedSegments.join('<br>')}</p>`
    }
    
    // Regular paragraph without line breaks
    const text = this.parser.parseInline(tokens)
    const plainText = toPlainText(tokens)
    const tts = this.userOptions.useTTS ? internal.createTTS(plainText, this.userOptions) : ''
    const content = tts ? `${tts} ${text}` : text
    return `<p class="lea-text">${content}</p>`
  }

  strong({ tokens }) {
    const text = this.parser.parseInline(tokens)
    return `<span class="lea-text-bold">${text}</span>`
  }

  br() {
    return ''
  }

  listitem({ tokens }) {
    const text = this.parser.parse(tokens)
    const plainText = toPlainText(tokens)
    const tts = this.userOptions.useTTS ? internal.createTTS(plainText, this.userOptions) : ''
    const content = tts ? `${tts} ${text}` : text
    return `<li>${content}</li>`
  }

  tablecell({ tokens, header }) {
    const text = this.parser.parseInline(tokens)
    const tts = this.userOptions.useTTS ? internal.createTTS(text, this.userOptions) : ''
    const content = tts ? `${tts} ${text}` : text
    const tag = header ? 'th' : 'td'
    return `<${tag}>${content}</${tag}>`
  }
}

const internal = {
  Renderer: DefaultMarkdownRenderer,
  Tokenizer,
  createTTS: x => x,
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
  internal.Renderer = value
}

Markdown.setTTSRenderer = fn => {
  internal.createTTS = fn
}

Markdown.setTokenizer = value => {
  internal.Tokenizer = value
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
