'use strict'

module.exports = app => {
  const controller = require('../controllers/controller')(app)
  
  app.route('/').post(controller.logIn);
  app.route('/logout').post(controller.authenticateToken, controller.logOut);


  app.route('/user').post(controller.authenticateToken, controller.insertUser);
  app.route('/user').get(controller.authenticateToken, controller.getUser);
  app.route('/user').put(controller.authenticateToken, controller.updateUser);
  app.route('/user').delete(controller.authenticateToken, controller.deleteUser);

  app.route('/group').post(controller.authenticateToken, controller.insertGroup);
  app.route('/group').get(controller.authenticateToken, controller.getGroup);
  app.route('/group').delete(controller.authenticateToken, controller.deleteGroup);
  app.route('/group').put(controller.authenticateToken, controller.updateGroup);

  app.route('/group-user').post(controller.authenticateToken, controller.insertGroupUser);
  app.route('/group-user').delete(controller.authenticateToken, controller.deleteGroup);
  app.route('/group-users').get(controller.authenticateToken, controller.getGroupUsers);
  app.route('/user-groups').get(controller.authenticateToken, controller.getUserGroups);

  app.route('/note').post(controller.authenticateToken, controller.insertNote);
  app.route('/note').delete(controller.authenticateToken, controller.deleteNote);
  app.route('/note').put(controller.authenticateToken, controller.updateNote);
}
