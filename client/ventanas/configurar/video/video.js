import { Template } from 'meteor/templating'
import { obtenerDispositivos, dispositivos, inicializarMedia, pararStream } from '/client/lib/media'
import { guardarConfiguracion } from '/client/lib/configuracion'
import { ventanas } from '/client/ventanas'

Template.seleccionarVideo.events({
  'submit form' (event, template) {
    event.preventDefault()
  },
  'seleccionado form' (event, template, data) {
    if (data === 'false') {
      return guardarConfiguracion('video', 'false')
    }
    ventanas.insert({
      template: 'probarVideo',
      video: data
    })
  },
  'click .recargar': obtenerDispositivos
})

Template.seleccionarVideo.helpers({
  camaras () {
    return dispositivos.get().videoinput
  }
})

Template.probarVideo.onRendered(function () {
  const video = this.$('video')[0]
  inicializarMedia({
    video: this.data.video
  }, function (stream) {
    if (!stream) {
      return
    }
    video.srcObject = stream
    video.play()
  })
})
Template.probarVideo.events({
  'click button' (event, template) {
    event.preventDefault()
    const video = template.$('video')[0]
    pararStream(video.srcObject)
  },
  'click .js-recargar': obtenerDispositivos,
  'click .js-aceptar' () {
    return guardarConfiguracion('video', this.video)
  }
})
