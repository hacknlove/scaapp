import { Template } from 'meteor/templating'
import { ventanas } from '/client/ventanas'
import { idiomas } from '/common/traducciones'
import { lang } from '/client/traduccion'
import { configuracion } from '/client/lib/configuracion'

ventanas.insert({
  template: 'idiomas',
  portada: true
})

Template.idiomas.helpers({
  languages: Object.keys(idiomas),
  idiomaActivo (idioma) {
    const l = lang()
    if (!idiomas[l] && idioma === 'es') {
      return 'activo'
    }
    return idioma === l && 'activo'
  }
})

Template.idiomas.events({
  'click .languages>div.activo' (event, template) {
    template.$('.languages').toggleClass('mostrar')
  },
  'click .languages>div:not(.activo)' (event, template) {
    configuracion.update({}, {
      $set: {
        lang: event.currentTarget.dataset.lang
      }
    })
    setTimeout(function () {
      template.$('.languages').toggleClass('mostrar')
    }, 500)
  }
})
