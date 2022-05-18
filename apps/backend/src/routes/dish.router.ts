import {jwtmiddleware} from '../middleware/test/jwtmiddleware';
import {DishController} from '../controller/dish.controller';
import {DishPictureStorage} from '../helper/storage.helper';
import {DishMiddleware} from '../middleware/dish.middleware';
import {StepController} from '../controller/step.controller';
import {StepMiddleware} from '../middleware/step.middleware';
import express = require('express');
import {IngredientController} from '../controller/ingredient.controller';
import {IngredientMiddleware} from '../middleware/ingredient.middleware';
import {UserMiddleware} from '../middleware/user.middleware';

export const DishRouter = express.Router({strict: true});

DishRouter.use('/images', express.static(process.env.DISH_IMAGES_DEST));
DishRouter.use(jwtmiddleware.loggerMiddleware);

DishRouter.post('/', DishController.createDish);
DishRouter.put('/:dishId', DishMiddleware.changedByCreator, DishController.updateDish);
DishRouter.get('/:dishId', DishMiddleware.retrieveDish, DishController.getDish);
DishRouter.delete('/:dishId', DishMiddleware.retrieveDish, DishMiddleware.changedByCreator, DishController.removeDish);

DishRouter.post(
  '/:dishId/images',
  DishMiddleware.changedByCreator,
  DishMiddleware.createImageDirectory,
  DishPictureStorage.upload.array('files'),
  DishPictureStorage.sendUploadedImages
);
DishRouter.delete('/:dishId/images/:image', DishMiddleware.changedByCreator, DishPictureStorage.removeImage);

DishRouter.post('/:dishId/step', DishMiddleware.changedByCreator, StepController.createStep);
DishRouter.put('/:dishId/step/:stepId', DishMiddleware.changedByCreator, StepMiddleware.getStepId, StepController.updateStep);
DishRouter.delete('/:dishId/step/:stepId', DishMiddleware.changedByCreator, StepMiddleware.getStepId, StepController.removeStep);

DishRouter.post('/:dishId/ingredient', DishMiddleware.changedByCreator, IngredientController.createIngredient);
DishRouter.put(
  '/:dishId/ingredient/:ingredientId',
  DishMiddleware.changedByCreator,
  IngredientMiddleware.getIngredientId,
  IngredientController.updateIngredient
);
DishRouter.delete(
  '/:dishId/ingredient/:ingredientId',
  DishMiddleware.changedByCreator,
  IngredientMiddleware.getIngredientId,
  IngredientController.removeIngredient
);

DishRouter.post('/:dishId/save', DishMiddleware.retrieveDish, UserMiddleware.retrieveFullUser, DishController.handleSaveOperation);

DishRouter.post('/:dishId/rate', DishMiddleware.retrieveDish, UserMiddleware.retrieveFullUser, DishController.handleRatingOperation);

DishRouter.post('/:dishId/visibility', DishMiddleware.changedByCreator, DishController.handleVisibilityChange);
