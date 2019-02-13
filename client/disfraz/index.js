import { configuracion, guardarConfiguracion } from '/client/lib/configuracion'
import { Template } from 'meteor/templating'

Template.disfraz.events({
  'click button' () {
    guardarConfiguracion('disfrazado', false)
  }
})

export const disfraz = function (forzar) {
  const conf = configuracion.findOne()
  if (!conf.disfrazarse && !forzar) {
    return
  }
  guardarConfiguracion('disfrazado', true)
}
