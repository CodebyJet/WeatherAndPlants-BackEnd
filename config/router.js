import express from 'express';
import secureRoute from '../middleware/secureRoute.js';
import userController from '../controllers/userController.js';
import plantController from '../controllers/plantController.js';

const Router = express.Router();

Router.route('/register').post(userController.registerUser);
Router.route('/login').post(userController.loginUser);

Router.route('/users').post(secureRoute, userController.getAllUsers);
Router.route('/users/search').post(secureRoute, userController.searchUser);
Router.route('/users/:id')
  .post(secureRoute, userController.getSingleUser)
  .put(secureRoute, userController.updateSingleUser);

Router.route('/login').post(userController.loginUser);

Router.post('/users/:userId/plants', secureRoute, plantController.createPlant);
Router.get('/users/:userId/plants', secureRoute, plantController.getAllPlants);
Router.get(
  '/users/:userId/plants/:plantId',
  secureRoute,
  plantController.getSinglePlant
);
Router.put(
  '/users/:userId/plants/:plantId',
  secureRoute,
  plantController.updatePlant
);
Router.delete(
  '/users/:userId/plants/:plantId',
  secureRoute,
  plantController.deletePlant
);

export default Router;
