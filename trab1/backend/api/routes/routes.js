'use strict'

module.exports = app => {
  const controller = require('../controllers/controller')(app)
  
  app.route('/').post(controller.logIn);
  app.route('/user').post(controller.insertUser);
  app.route('/user').get(controller.getUser);
  app.route('/user').put(controller.updateUser);
  app.route('/user').delete(controller.deleteUser);

  app.route('/group').post(controller.insertGroup);
  app.route('/group').get(controller.getGroup);
  app.route('/group').delete(controller.deleteGroup);
  app.route('/group').put(controller.updateGroup);

  app.route('/group-user').post(controller.insertGroupUser);
  app.route('/group-user').delete(controller.deleteGroup);
  app.route('/group-users').get(controller.getGroupUsers);
  app.route('/user-groups').get(controller.getUserGroups);

  app.route('/note').post(controller.insertNote);
  app.route('/note').delete(controller.deleteNote);
  app.route('/note').put(controller.updateNote);
}
