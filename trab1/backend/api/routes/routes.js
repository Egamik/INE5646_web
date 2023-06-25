'use strict'

module.exports = app => {
  const controller = require('../controllers/controller')(app)
  
  app.route('/').post(controller.logIn);
  app.route('/user').post(controller.insertUser);
  app.route('/user').get(controller.getUser);
  app.route('/user').put(controller.updateUser);

  app.route('/group').post(controller.insertGroup);
}
