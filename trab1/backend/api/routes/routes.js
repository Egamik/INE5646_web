'use strict'

module.exports = app => {
  const controller = require('../controllers/controller')(app)
  
  app.route('/').get(controller.logIn)
}
