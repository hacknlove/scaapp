/* global gapi */
import { Template } from 'meteor/templating'

Template.menuConfigurar.events({
  'click .js-salir' () {
    gapi.auth2.getAuthInstance().signOut()
  }
})
