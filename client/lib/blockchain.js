/* global gapi Blob FileReader */
import { Meteor } from 'meteor/meteor'
import bencode from 'bencode'
import { Base64 } from 'js-base64'

function convertUint8ArrayToBinaryString (u8Array) {
  var i
  var len = u8Array.length
  var str = ''
  for (i = 0; i < len; i++) {
    str += String.fromCharCode(u8Array[i])
  }
  return str
}

const fileId = {}

export const agregarEslabon = async function agregarEslabon (fileName, arraybuffer) {
  console.log(arraybuffer)
  if (typeof arraybuffer === 'string') {
    let encoder = new TextEncoder()
    arraybuffer = encoder.encode(arraybuffer)
  }

  const fileHash = Base64.encodeURI(
    convertUint8ArrayToBinaryString(
      new Uint8Array(
        await window.crypto.subtle.digest('SHA-512', arraybuffer)
      )
    )
  ).replace(/=*$/, '')

  Meteor.call('agregarEslabon', fileName, fileHash, function (e, r) {
    if (e) {
      return
    }
    const token = gapi.auth2.getAuthInstance().currentUser.get().getAuthResponse().access_token
    r.fecha = r.fecha.toISOString()
    var string = bencode.encode(r)

    const params = {
      file: new Blob([string]),
      token: token,
      params: {
        convert: false,
        ocr: false
      }
    }
    if (fileId[fileName]) {
      params.fileId = fileId[fileName]
    } else {
      params.metadata = {
        name: `${fileName}.blockchain`,
        mimeType: 'application/octet-stream',
        parents: [global.scaapId]
      }
      params.onComplete = function (r) {
        r = JSON.parse(r)
        fileId[fileName] = r.id
      }
    }
    var uploader = new window.UploaderForGoogleDrive(params)
    uploader.upload()
  })
}

export const agregarEslabonDeBlob = function agregarEslabonDeBlob (fileName, blob) {
  var reader = new FileReader()
  reader.onload = function () {
    agregarEslabon(fileName, reader.result)
  }
  reader.readAsArrayBuffer(blob)
}
