import { marked, Renderer, Tokenizer } from 'marked'

export const Markdown = {}

export class DefaultMarkdownRenderer extends Renderer {
  constructor (userOptions) {
    super()
    this.userOptions = userOptions
  }

  heading (data) {
    const { tokens, depth } = data
    const text = this.parser.parseInline(tokens)
    const tts = this.userOptions.useTTS ? internal.createTTS(text, this.userOptions) : ''
    const content = tts ? `${tts} ${text}` : text
    return `<h${depth} class="lea-text">${content}</h${depth}>`
  }

  paragraph ({ tokens } /*, level */) {
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

  strong ({ tokens }) {
    const text = this.parser.parseInline(tokens)
    return `<span class="lea-text-bold">${text}</span>`
  }

  br () {
    return ''
  }

  listitem ({ tokens }) {
    const text = this.parser.parse(tokens)
    const plainText = toPlainText(tokens)
    const tts = this.userOptions.useTTS ? internal.createTTS(plainText, this.userOptions) : ''
    const content = tts ? `${tts} ${text}` : text
    return `<li>${content}</li>`
  }

  tablecell ({ tokens, header }) {
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
    headerIds: false
  }
}

const normalizeMarkdown = value =>
  // eslint-disable-next-line
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

// Extract texts that correspond to soundbutton placement
// For paragraphs with line breaks, returns multiple text entries (one per line)
// For other blocks, returns a single text entry
const extractSoundButtonTexts = (token) => {
  if (!token || typeof token !== 'object') return []

  if (token.type === 'paragraph') {
    // Check if paragraph has line breaks
    if (Array.isArray(token.tokens) && token.tokens.some(t => t.type === 'br')) {
      // Split by br tokens and extract text for each segment
      const segments = []
      let currentSegment = []

      for (const t of token.tokens) {
        if (t.type === 'br') {
          if (currentSegment.length > 0) {
            segments.push(currentSegment)
            currentSegment = []
          }
        } else {
          currentSegment.push(t)
        }
      }
      if (currentSegment.length > 0) {
        segments.push(currentSegment)
      }

      return segments.map(segment => toPlainText(segment)).filter(text => text.length > 0)
    }
    // No line breaks - return single text
    return [toPlainText(token.tokens)]
  }

  if (token.type === 'heading') {
    return [toPlainText(token.tokens)]
  }

  if (token.type === 'list') {
    // List items each get their own text
    return (token.items || []).map(item => toPlainText(item))
  }

  if (token.type === 'table') {
    // Table cells each get their own text
    const texts = []

    // Header cells
    if (Array.isArray(token.header)) {
      for (const headerCell of token.header) {
        texts.push(toPlainText(headerCell))
      }
    }

    // Body cells
    if (Array.isArray(token.rows)) {
      for (const row of token.rows) {
        for (const cell of row) {
          texts.push(toPlainText(cell))
        }
      }
    }

    return texts
  }

  // For other block types, return the full text
  return [toPlainText(token)]
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
      renderer
    }
  )
}

Markdown.tokenize = async (element) => {
  if (!element?.value || typeof element.value !== 'string') return []
  const { value, ...options } = element

  const blockTokens = marked.lexer(normalizeMarkdown(value), {
    ...internal.defaultOptions,
    ...options
  })
    .filter(token => token.type !== 'space')

  // Extract texts that correspond to soundbutton placement
  const result = []
  for (const token of blockTokens) {
    const texts = extractSoundButtonTexts(token)
    for (const text of texts) {
      if (text.length > 0) {
        result.push({
          ...token,
          text
        })
      }
    }
  }

  return result
}
