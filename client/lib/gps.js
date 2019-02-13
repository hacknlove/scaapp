/* global gapi Blob */
import { status } from '/client/lib/status'
import papa from 'papaparse'
import { agregarEslabon } from '/client/lib/blockchain'

var gps
var fileId
var grabacionId
var posiciones

const noop = function () {}

const radioDeLaTierra = 6371000

const guardar = function (a, b) {
  if (!a.latitude) { // No hay posición anterior
    return true
  }
  if (a.accuracy < b.accuracy) { // La posición actual es más precisa
    return true
  }
  var dLat = (b.latitude - a.latitude) * Math.PI / 180
  var dLon = (b.longitude - b.longitude) * Math.PI / 180
  var primerpaso = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
          Math.cos(a.latitude * Math.PI / 180) * Math.cos(b.latitude * Math.PI / 180) *
          Math.sin(dLon / 2) * Math.sin(dLon / 2)
  var segundopaso = 2 * Math.asin(Math.sqrt(primerpaso))
  return (a.accuracy + b.accuracy) < radioDeLaTierra * segundopaso // la distancia entre la posición actual y la anterior es mayor que la suma de las precisiones
}

export const iniciarGps = function (id) {
  grabacionId = id
  posiciones = []

  if (!navigator.geolocation) {
    console.log('no hay geolocation')
    return
  }
  var anterior = {}

  const success = function (position) {
    if (!position) {
      return
    }
    const actual = {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
      accuracy: position.coords.accuracy,
      timestamp: Date.now()
    }
    if (!guardar(anterior, actual)) {
      return
    }

    posiciones.push({
      longitude: actual.longitude,
      latitude: actual.latitude,
      accuracy: actual.accuracy,
      interval: anterior.timestamp ? actual.timestamp - (anterior.timestamp || actual.timestamp) : actual.timestamp
    })
    anterior = actual
    subirArchivo()
  }
  navigator.geolocation.getCurrentPosition(function (position) {
    success(position)
    gps = navigator.geolocation.watchPosition(success, noop, {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0
    })
  }, noop, {
    enableHighAccuracy: true,
    timeout: 15000,
    maximumAge: 0
  })
}

export const detenerGps = function () {
  console.log('detener gps')
  gps && navigator.geolocation && navigator.geolocation.clearWatch(gps)
  gps = null
}

function subirArchivo () {
  const token = gapi.auth2.getAuthInstance().currentUser.get().getAuthResponse().access_token
  const string = papa.unparse(posiciones)
  const params = {
    fileId: fileId,
    file: new Blob([string]),
    token: token,
    onError (e) {
      console.log(e)
    },
    onComplete (r) {
      r = JSON.parse(r)
      fileId = r.id
      status.update({}, {
        set: {
          posicionesGPSguardadas: posiciones.length
        }
      })
      agregarEslabon(`${grabacionId}.gps`, string)
    },
    params: {
      convert: false,
      ocr: false
    }
  }
  if (fileId) {
    params.fileId = fileId
  } else {
    params.metadata = {
      name: `${grabacionId}.gps`,
      mimeType: 'application/octet-stream',
      parents: [global.scaapId]
    }
  }
  var uploader = new window.UploaderForGoogleDrive(params)
  uploader.upload()
}
