import { Competency } from '../../contexts/Competency'
import '../../components/icon/icon'
import './scoring.html'
import { getCollection } from '../../utils/collection'


Template.itemScoringRenderer.helpers({
  getCompetency (_id) {
    const competencyDoc = getCollection(Competency.name).findOne(_id) || {}
    return competencyDoc[Competency.representative] || _id
  }
})