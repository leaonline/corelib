import { MediaLib } from '../contexts/MediaLib'
import { Labels } from '../i18n/Labels'

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
  custom (...args) {
    // TODO validate based on element type/subtype
  }
})
