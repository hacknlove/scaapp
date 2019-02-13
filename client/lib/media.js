/* global URL MediaRecorder gapi */
import { _ } from 'meteor/underscore'

import { ReactiveVar } from 'meteor/reactive-var'
import { Meteor } from 'meteor/meteor'
import { Tracker } from 'meteor/tracker'
import { status } from '/client/lib/status'
import { agregarEslabonDeBlob } from '/client/lib/blockchain'

var streams = {}

const partesPorSubir = []
const upload = _.throttle(function () {
  if (partesPorSubir.length === 0) {
    return
  }
  const parametros = partesPorSubir.pop()

  var uploader = new window.UploaderForGoogleDrive({
    file: parametros.Body,
    token: gapi.auth2.getAuthInstance().currentUser.get().getAuthResponse().access_token,
    metadata: {
      name: `${parametros.grabacionId}.${parametros.i}.part`,
      mimeType: 'application/octet-stream',
      parents: [global.scaapId]
    },
    onError (e) {
      partesPorSubir.push(parametros)
      return upload()
    },
    onComplete (r) {
      upload()
      agregarEslabonDeBlob(`${parametros.grabacionId}.${parametros.i}.part`, parametros.Body)
      status.update({}, {
        $inc: {
          minutosSubidos: 1
        }
      })
    },
    params: {
      convert: false,
      ocr: false
    }
  })

  uploader.upload()
}, 6000)

export const dispositivos = new ReactiveVar()

export const inicializarMedia = function (conf, callback) {
  const opciones = {}
  if (conf.audio) {
    opciones.audio = {
      deviceId: conf.audio
    }
  }
  if (conf.video) {
    opciones.video = {
      deviceId: conf.video
    }
  }
  navigator.mediaDevices.getUserMedia(opciones).then(function (s) {
    streams[s.id] = s
    callback(s)
  }).catch(function (e) {
    console.log(e)
  })
}

export const pararStream = function (stream) {
  delete streams[stream.id]
  stream && stream.getTracks().forEach(function (track) {
    track.stop()
  })
}

export const crearMediaUploader = function (stream, grabacionId) {
  var i = 0
  if (!stream) {
    return {
      stop () {
      }
    }
  }
  const recorder = new MediaRecorder(stream, {
    mimeType: `${stream.getVideoTracks().length ? 'video' : 'audio'}/webm`
  })

  recorder.ondataavailable = function (event) {
    status.update({}, {
      $inc: {
        minutosGrabados: 1
      }
    })
    partesPorSubir.push({
      Body: event.data,
      grabacionId,
      i: i++
    })
    upload()
  }
  recorder.start(60000)
  return {
    stop () {
      if (recorder.state !== 'inactive') {
        recorder.stop()
      }
      pararStream(stream)
    }
  }
}

export const obtenerDispositivos = function () {
  navigator.mediaDevices.enumerateDevices().then(function (devices) {
    const respuesta = {
      audioinput: [{
        valor: 'false',
        etiqueta: 'no audio'
      }],
      videoinput: [{
        valor: 'false',
        etiqueta: 'no video'
      }]
    }
    devices.forEach(function (dispositivo) {
      if (!respuesta[dispositivo.kind]) {
        return
      }
      respuesta[dispositivo.kind].push({
        valor: dispositivo.deviceId,
        etiqueta: dispositivo.label || `${dispositivo.kind} - ${respuesta[dispositivo.kind].length}`
      })
    })
    dispositivos.set(respuesta)
  }).catch(function (e) {
    dispositivos.set([])
  })
}

Meteor.startup(obtenerDispositivos)

Tracker.autorun(function () {
  upload()
})

export const terminarGrabaciones = function () {
  const s = Object.keys(streams)
  if (s.length === 0) {
    return false
  }
  s.forEach(function (id) {
    pararStream(streams[id])
  })
  return true
}

window.addEventListener('beforeunload', function (event) {
  if (!terminarGrabaciones()) {
    return
  }
  event.preventDefault()
  event.returnValue = 'Cerrar ahora la página podría acarrear una pérdida de datos. Te recomendamos esperar unos minutos. ¿Cerra ahora?'
  return event.returnValue
})
