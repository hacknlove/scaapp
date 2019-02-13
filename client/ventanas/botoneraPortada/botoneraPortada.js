import { Template } from 'meteor/templating'
import { ventanas } from '/client/ventanas'

Template.botoneraPortada.onRendered(function () {
  const that = this
  this.autorun(function () {
    if (ventanas.find({
      portada: {
        $ne: true
      },
      cerrar: {
        $ne: true
      }
    }).count()) {
      that.$('#botoneraPortada').addClass('oculto')
    } else {
      that.$('#botoneraPortada').removeClass('oculto')
    }
  })
})

ventanas.insert({
  template: 'botoneraPortada',
  portada: true
})

Template.botoneraPortada.helpers({
  activo (a) {
    return ventanas.findOne({
      template: {
        $in: a.split(',')
      },
      cerrar: {
        $ne: true
      }
    }) ? 'activo' : ''
  }
})

Template.botoneraPortada.events({
  'click .js-patreon' () {
    window.location = 'https://www.patreon.com/scaapp_video_gps_blockchain'
  }
})
