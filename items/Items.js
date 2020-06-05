import { Choice } from './choice/Choice'
import { Cloze } from './text/Cloze'
import { Highlight } from './highlight/Highlight'

export const Items = {}

const allItems = [
  Choice,
  Cloze,
  Highlight
]

Items.forEach = cb => allItems.forEach(cb)
