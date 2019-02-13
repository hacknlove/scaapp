import { Meteor } from 'meteor/meteor'
import SHA3 from 'sha3'
import bencode from 'bencode'
import { Mongo } from 'meteor/mongo'

const blockchain = new Mongo.Collection('blockchain')
blockchain.rawCollection().createIndex({
  fecha: 1
}, {
  background: true
})

Meteor.methods({
  agregarEslabon (fileName, fileHash) {
    console.log(fileHash)
    const fecha = new Date()
    const sha3 = new SHA3(512)

    const ultimos = blockchain.find({}, {
      fields: {
        _id: 1,
        hash: 1
      },
      sort: {
        fecha: -1
      },
      limit: 10
    }).fetch()

    const parents = ultimos.map(e => e._id)

    sha3.update(bencode.encode({
      fecha: fecha.toISOString(),
      fileHash,
      fileName,
      parents
    }))

    const _id = sha3.digest('base64').replace(/[+]/g, '-').replace(/\//g, '_').replace(/=*$/, '')

    const bloque = {
      _id,
      fecha,
      fileHash,
      fileName,
      parents
    }

    blockchain.insert(bloque)
    return bloque
  }
})
