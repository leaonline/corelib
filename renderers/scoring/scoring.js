import { Template } from 'meteor/templating'
import { Competency } from '../../contexts/Competency'
import { getCollection } from '../../utils/collection'
import '../../components/icon/icon'
import './scoring.html'

Template.itemScoringRenderer.helpers({
  getCompetency (_id) {
    const competencyDoc = getCollection(Competency.name).findOne(_id) || {}
    return competencyDoc[Competency.representative] || _id
  }
})
