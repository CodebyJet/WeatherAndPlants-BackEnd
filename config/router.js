import express from 'express';
import secureRoute from '../middleware/secureRoute.js';
import userController from '../controllers/userController.js';

const Router = express.Router();

Router.route('/register').post(userController.registerUser);
Router.route('/login').post(userController.loginUser);

Router.route('/users').post(secureRoute, userController.getAllUsers);
Router.route('/users/search').post(secureRoute, userController.searchUser);
Router.route('/users/:id')
  .post(secureRoute, userController.getSingleUser)
  .put(secureRoute, userController.updateSingleUser);

Router.route('/login').post(userController.loginUser);


router.post('/plants', secureRoute, plantController.createPlant);
router.get('/plants', secureRoute, plantController.getAllPlants);
router.get('/plants/:id', secureRoute, plantController.getSinglePlant);
router.put('/plants/:id', secureRoute, plantController.updatePlant);
router.delete('/plants/:id', secureRoute, plantController.deletePlant);

export default Router;
