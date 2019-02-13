import { Template } from 'meteor/templating'
import { obtenerDispositivos, dispositivos, inicializarMedia, pararStream } from '/client/lib/media'
import { guardarConfiguracion } from '/client/lib/configuracion'
import { ventanas } from '/client/ventanas'

Template.seleccionarAudio.events({
  'submit form' (event, template) {
    event.preventDefault()
  },
  'seleccionado form' (event, template, data) {
    if (data === 'false') {
      return guardarConfiguracion('audio', 'false')
    }
    ventanas.insert({
      template: 'probarAudio',
      audio: data
    })
  },
  'click .recargar': obtenerDispositivos
})

Template.seleccionarAudio.helpers({
  microfonos () {
    return dispositivos.get().audioinput
  }
})

Template.probarAudio.onRendered(function () {
  const audio = this.$('audio')[0]
  inicializarMedia({
    audio: this.data.audio
  }, function (stream) {
    if (!stream) {
      return
    }
    audio.srcObject = stream
    audio.play()
  })
})
Template.probarAudio.events({
  'click button' (event, template) {
    event.preventDefault()
    const audio = template.$('audio')[0]
    pararStream(audio.srcObject)
  },
  'click .js-recargar': obtenerDispositivos,
  'click .js-aceptar' () {
    return guardarConfiguracion('audio', this.audio)
  }
})
