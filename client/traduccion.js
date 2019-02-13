
import { Template } from 'meteor/templating'
import { traducciones } from '/common/traducciones'
import { configuracion } from '/client/lib/configuracion'

export const lang = function () {
  return (configuracion.findOne() || {
    lang: navigator.language.replace(/-.*/, '')
  }).lang || 'es'
}

export const traducir = function (key) {
  if (!traducciones[key]) {
    console.log(key)
    return key
  }
  return traducciones[key][lang()] || key
}

Template.registerHelper('_', traducir)
