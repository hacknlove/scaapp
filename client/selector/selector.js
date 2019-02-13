import { Template } from 'meteor/templating'
import { ReactiveVar } from 'meteor/reactive-var'

Template.selector.onCreated(function () {
  const value = new ReactiveVar()
  this.value = value
  this.autorun(function () {
    value.set(Template.currentData().value)
  })
})

Template.selector.helpers({
  actual (value) {
    return value === Template.instance().value.get() && 'invertido'
  },
  value () {
    return Template.instance().value.get()
  }
})

Template.selector.events({
  'click button' (event, template) {
    event.preventDefault()
    Template.instance().value.set(event.currentTarget.dataset.value)
    template.$('.selector').trigger('seleccionado', event.currentTarget.dataset.value)
  }
})
