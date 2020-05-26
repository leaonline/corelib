import { Competency } from './Competency'
import { getCollection } from '../utils/lib/collection'

const isVisible = () => {}
export const H5PScoring = {}

H5PScoring.types = {}

H5PScoring.types.fillInTheBlanks = {
  global: {
    responseType: {
      type: String,
      autoform: {
        options () {
          return [
            { value: 'word', label: 'responseType.word' },
            { value: 'symbol', label: 'responseType.symbol' },
            { value: 'sentence', label: 'responseType.sentence' }
          ]
        }
      }
    },

    // if responseType is symbol
    symbolCorrect: {
      type: Array,
      optional: true,
      autoform: {
        type: isVisible('responseType', ['symbol'])
      }
    },
    'symbolCorrect.$': {
      type: String
    },

    // if responseType is word
    wordCorrect: {
      type: String,
      optional: true
    },
    minDistanceWord: {
      type: Number,
      optional: true
    },
    exceptionBeginWord: {
      type: String,
      optional: true
    },
    exceptionEndWord: {
      type: String,
      optional: true
    },

    // if responseType is sentence
    sentenceCorrect: {
      type: String,
      optional: true
    },
    minDistanceSentence: {
      type: Number,
      optional: true
    },
    exceptionBeginSentence: {
      type: String,
      optional: true
    }
  },
  item: {
    competency: {
      type: String,
      optional: true,
      autoform: {
        options () {
          const CompetencyCollection = getCollection(Competency)
          return CompetencyCollection.find({}, { sort: { competencyId: 1 } })
            .fetch()
            .map(doc => ({ value: doc._id, label: doc.competencyId }))
        }
      }
    },
    itemType: {
      type: String,
      autoform: {
        options: (type) => {
          switch (type) {
            case 'word':
              return [
                { value: 'caseSensitivity', label: 'itemType.caseSensitivity' },
                { value: 'pattern', label: 'itemType.pattern' }
              ]
            case 'symbol':
              return [
                { value: 'symbol', label: 'itemType.symbol' }
              ]
            case 'sentence':
              return [
                { value: 'phonemic', label: 'itemType.phonemic' },
                { value: 'first', label: 'itemType.first' },
                { value: 'punctuationSentence', label: 'itemType.punctuationSentence' },
                { value: 'caseSensitivitySentence', label: 'itemType.caseSensitivitySentence' },
                { value: 'patternSentence', label: 'itemType.patternSentence' }
              ]
            default:
              throw new Error(`Unkown type ${type}`)
          }
        }
      }
    },

    // if itemType is one of ['punctuationSentence', 'caseSensitivitySentence',  'patternSentence']
    word: String,

    // if itemType is one of ['pattern', 'punctuationSentence']
    pattern: String,
    location: {
      type: String,
      autoform: {
        options: []
      }
    }

  }
}
