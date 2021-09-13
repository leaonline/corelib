import { Choice } from './choice/Choice'
import { Cloze } from './text/Cloze'
import { Highlight } from './highlight/Highlight'
import { Connect } from './interactive/Connect'
import { ItemTypeName } from './ItemTypeName'

/**
 * Represents the core items that are always part of all apps
 */
export const Items = {}

Items.name = 'items'
Items.typeName = ItemTypeName

const allItems = new Map()
allItems.set(Choice.name, Choice)
allItems.set(Cloze.name, Cloze)
allItems.set(Highlight.name, Highlight)
allItems.set(Connect.name, Connect)

Items.forEach = cb => allItems.forEach(cb)

Items.get = name => allItems.get(name)
