import { MediaLib } from '../contexts/MediaLib'
import { Labels } from '../i18n/Labels'
import { onServerExec } from '../utils/arch'

export const createPageSchema = ({ label } = {}) => ({
  type: Array,
  label: label,
  isPageContent: true,
  optional: true,
  dependency: {
    filesCollection: MediaLib.name,
    version: 'original'
  }
})

export const createPageEntrySchema = () => ({
  type: Object,
  optional: true,
  label: Labels.entry,
  blackbox: true,
  custom: onServerExec(function () {
    const { Items } = require('../items/Items')
    const { validateItemDefinition } = require('../items/validateItemDefinition')
    const { validateMinimalPageEntryContentDefinition } = require('./validateMinimalPageEntryContentDefinition')
    return function () {
      const { value } = this

      if (typeof value === 'undefined' || value === null) {
        return
      }

      // every entry should have a minimal definition of content, which consists
      // of type (i.e. text, item), subtype (which text, which item) and id
      const { type, subtype, contentId, width, ...content } = value
      validateMinimalPageEntryContentDefinition({ type, subtype, contentId, width })

      //
      if (type === Items.typeName) {
        validateItemDefinition(subtype, content.value)
      }
    }
  })
})
