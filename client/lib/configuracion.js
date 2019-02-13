import { Template } from 'meteor/templating'

import { Mongo } from 'meteor/mongo'

export const configuracion = new Mongo.Collection(null)

const conectar = function (primero) {
  const conf = configuracion.findOne()
  if (!conf) {
    configuracion.insert({
      _id: 'configuracion',
      retraso: 0,
      duracion: 120,
      lang: navigator.language.replace(/-.*/, ''),
      disfraz: 'https://www.wikipedia.org'
    })
  }
}

// eslint-disable-next-line
const configuracionObserver = new PersistentMinimongo2(configuracion, 'camara', conectar)

export const guardarConfiguracion = function (clave, valor) {
  configuracion.update({}, {
    $set: {
      [clave]: valor
    }
  })
}

Template.registerHelper('configuracion', function () {
  return configuracion.findOne()
})

window.configuracion = configuracion
