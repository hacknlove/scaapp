import { Mongo } from 'meteor/mongo'
import { Template } from 'meteor/templating'

export const status = new Mongo.Collection(null)
status.insert({
  _id: 'status'
})
Template.registerHelper('status', function () {
  return status.findOne()
})
export const guardarStatus = function (clave, valor) {
  status.update({}, {
    $set: {
      [clave]: valor
    }
  })
}
