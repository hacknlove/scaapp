import { configuracion, guardarConfiguracion } from '/client/lib/configuracion'
import { inicializarMedia, crearMediaUploader, terminarGrabaciones } from '/client/lib/media'
import { iniciarGps, detenerGps } from '/client/lib/gps'
import { ventanas } from '/client/ventanas'
import { Template } from 'meteor/templating'
import { disfraz } from '/client/disfraz'
import { status } from '/client/lib/status'
import { ReactiveTimer } from 'meteor/frozeman:reactive-timer'
import moment from 'moment'
import { generarCodigo } from '/common/validarCodigo'

const grabar = function () {
  const conf = configuracion.findOne()
  status.update({
    _id: 'status'
  }, {
    _id: 'status',
    minutosSubidos: 0,
    minutosGrabados: 0,
    posicionesGPSguardadas: 0
  })
  const r = generarCodigo()
  iniciarGps(r)
  inicializarMedia(conf, function (stream) {
    crearMediaUploader(stream, r)
  })
}

export const pararGrabacion = function () {
  detenerGps()
  terminarGrabaciones()
}

const timer = new ReactiveTimer()
var tictac

var inicio
var inicioTimer
var fin

Template.temporizador.events({
  'click .js-establecer' (event, template) {
    event.preventDefault()
    const datos = template.$('form').validarFormulario()
    ventanas.remove({})
    if (datos.error) {
      return
    }
    disfraz()

    guardarConfiguracion('esperar', datos.esperar)
    guardarConfiguracion('duracion', datos.duracion)

    ventanas.insert({
      template: 'grabar',
      esperar: parseInt(datos.esperar) * 1000 * 60
    })
    fin = setTimeout(pararGrabacion, (parseInt(datos.esperar) + parseInt(datos.duracion)) * 1000 * 60)
  }
})

Template.grabar.onCreated(function () {
  const that = this
  inicio = moment().add(this.data.esperar)
  timer.start(0.5)

  inicioTimer = setTimeout(function () {
    disfraz()
    ventanas.insert({
      template: 'grabando'
    })
    that.cerrar()
  }, this.data.esperar)
})
Template.grabar.onDestroyed(function () {
  timer.stop()
})
Template.grabar.helpers({
  segundos () {
    tictac = !tictac
    timer.tick()
    var tiempo = moment(moment(inicio).diff())

    if (tiempo.valueOf() < 60 * 60 * 1000) {
      return tiempo.format(`mm${tictac ? ':' : ' '}ss`)
    }
    tiempo.subtract(1, 'hour')
    return tiempo.format(`HH${tictac ? ':' : ' '}mm${tictac ? ':' : ' '}ss`)
  }
})

Template.grabar.events({
  'click .js-empezar' (event, template) {
    this.cerrar()
    ventanas.insert({
      template: 'grabando'
    })
  },
  'submit form' (event, template) {
    event.preventDefault()
    clearTimeout(inicioTimer)
    clearTimeout(fin)
  },
  'click .js-disfrazar': disfraz
})

Template.grabando.events({
  'click .js-disfrazar': disfraz
})

Template.grabando.onCreated(function () {
  clearTimeout(inicioTimer)
  disfraz()
  grabar()
})
Template.grabando.onDestroyed(function () {
  clearTimeout(fin)
  pararGrabacion()
})
