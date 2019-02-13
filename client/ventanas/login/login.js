/* global gapi */
// import { $ } from 'meteor/jquery'
import { Template } from 'meteor/templating'
import { ventanas } from '/client/ventanas'
import { Meteor } from 'meteor/meteor'
import 'meteor/hacknlove:validarformulario'
var DISCOVERY_DOCS = ['https://www.googleapis.com/discovery/v1/apis/drive/v3/rest']

var SCOPES = 'https://www.googleapis.com/auth/drive.file'

ventanas.insert({
  template: 'entrando'
})

Meteor.startup(function () {
  setTimeout(function () {
    gapi.load('client:auth2', initClient)
  }, 1000)
})

function initClient () {
  gapi.client.init({
    clientId: Meteor.settings.public.google.clientId,
    discoveryDocs: DISCOVERY_DOCS,
    scope: SCOPES
  }).then(function () {
    gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus)
    updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get())
  }, function (e) {
    ventanas.error({
      message: JSON.stringify(e, null, 2)
    })
  })
}

function updateSigninStatus (isSignedIn) {
  ventanas.remove({
    template: 'entrando'
  })
  if (isSignedIn) {
    ventanas.remove({
      template: 'login'
    })
    obtenerIdDeCarpetaScaap()
  } else {
    return ventanas.insert({
      template: 'login'
    })
  }
}

function obtenerIdDeCarpetaScaap () {
  gapi.client.drive.files.list({
    'q': "mimeType = 'application/vnd.google-apps.folder' and trashed = false and name = 'scaapp'"
  }).then(function (r) {
    if (r.result.files.length === 0) {
      return crearCarpetaScaap()
    }
    global.scaapId = r.result.files[0].id
  })
}
function crearCarpetaScaap () {
  gapi.client.request({
    path: 'https://www.googleapis.com/drive/v3/files/',
    method: 'POST',
    body: {
      name: 'scaapp',
      mimeType: 'application/vnd.google-apps.folder'
    }
  }).then(function (r) {
    global.scaapId = r.result.id
  })
}

Template.login.events({
  'submit form' (event, template) {
    event.preventDefault()
    this.esperar()
    gapi.auth2.getAuthInstance().signIn()
  }
})
