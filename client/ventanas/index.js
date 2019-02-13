import { $ } from 'meteor/jquery'
import { Template } from 'meteor/templating'
import { Mongo } from 'meteor/mongo'

export const ventanas = new Mongo.Collection(null)

Template.ventanas.onCreated(function () {
  $('body').on('click', '.abrirModal', function (event) {
    ventanas.insert({
      template: event.currentTarget.dataset.modal
    })
  })
})

Template.ventanas.helpers({
  ventanas () {
    return ventanas.find()
  }
})

Template.modal.onCreated(function () {
  const that = this
  this.cerrar = function () {
    ventanas.update({
      _id: that.data._id
    }, {
      $set: {
        cerrar: true
      }
    })
  }

  this.data.cerrar = this.cerrar
})

Template.modal.onRendered(function () {
  const that = this
  const modal = this.$('.fade')
  if (modal.length) {
    modal.addClass('invisible')
    setTimeout(function () {
      modal.addClass('visible')
    }, 50)
  }

  this.cerrar = function () {
    ventanas.update({
      _id: that.data._id
    }, {
      $set: {
        cerrar: true
      }
    })
  }

  this.data.cerrar = this.cerrar
  this.esperar = function () {
    that.$('form').addClass('esperando')
  }
  this.desesperar = function (ya) {
    if (ya) {
      return that.$('form').removeClass('esperando')
    }
    return setTimeout(function () {
      that.desesperar(that, true)
    }, 1000)
  }

  this.data.esperar = this.esperar
  this.data.desesperar = this.desesperar

  this.autorun(function () {
    if (ventanas.findOne({
      _id: that.data._id,
      cerrar: true
    })) {
      if (modal.length) {
        that.$('.fade').removeClass('visible')
        setTimeout(function () {
          ventanas.remove({
            _id: that.data._id
          })
        }, 350)
      } else {
        ventanas.remove({
          _id: that.data._id
        })
      }
    }
  })
})

Template.modal.events({
  'click .cerrar' (event, template) {
    template.cerrar()
  }
})

ventanas.error = function (e) {
  ventanas.insert({
    template: 'alerta',
    clase: 'error',
    titulo: 'Error:',
    contenido: e.message
  })
}

global.ventanas = ventanas
