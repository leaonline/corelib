const scoringMap = new Map(Object.entries({
  singleChoice: {
    name: 'singleChoice',
    score: function (itemDoc, responseDoc) {
      const { scoring } = itemDoc
      return scoring.map(({ competency, correctResponse }) => {
        const value = responseDoc.responses[0]
        const score = correctResponse === value
        const isUndefined = value === Scoring.UNDEFINED
        return { competency, correctResponse, value, score, isUndefined }
      })
    }
  }
}))

export const Scoring = {
  name: 'scoring',
  UNDEFINED: '__undefined__',
  get: key => scoringMap.get(key)
}
