export const ScoringRule = {}

ScoringRule.name = 'scoringRule'
ScoringRule.label = 'scoringRule.title'
ScoringRule.icon = 'clipboard-list'

ScoringRule.schema = () => ({
  itemId: String,
  competency: String,
  selection: {
    type: String,
    optional: true
  },
  regExp: {
    type: String,
    optional: true
  }
})
