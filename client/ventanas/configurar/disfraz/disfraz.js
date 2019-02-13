import { Template } from 'meteor/templating'
import { guardarConfiguracion } from '/client/lib/configuracion'

Template.seleccionarDisfraz.events({
  'submit form' (event, template) {
    event.preventDefault()
    const data = template.$('form').validarFormulario()
    if (data.disfrazarse && !data.disfraz) {
      return template.$('input[name="disfraz"]').marcarError('vacio')
    }
    this.cerrar()
    guardarConfiguracion('disfraz', data.disfraz)
    guardarConfiguracion('disfrazarse', data.disfrazarse)
  }
})
