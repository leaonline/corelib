import { Choice } from './choice/Choice'
import { Cloze } from './text/Cloze'

export const Items = {}

const allItems = [
  Choice,
  Cloze,
]

Items.forEach = cb => allItems.forEach(cb)
