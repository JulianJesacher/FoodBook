import {jwtmiddleware} from '../middleware/test/jwtmiddleware';
import express = require('express');
import {ProfileController} from '../controller/profile.controller';
import {ProfilePictureStorage} from '../helper/storage.helper';
import {UserMiddleware} from '../middleware/user.middleware';
import {ProfileHelper} from "../helper/profile.helper";

export const ProfileRouter = express.Router({strict: true});
ProfileRouter.use(jwtmiddleware.loggerMiddleware);

ProfileRouter.use('/images', express.static(process.env.PROFILE_IMAGES_DEST));

ProfileRouter.get('/:profileId', ProfileController.getProfile);
ProfileRouter.put('/:profileId', UserMiddleware.retrieveFullUser, ProfileHelper.isOwnProfile, ProfileController.update);

ProfileRouter.post(
  '/:profileId/image',
  ProfilePictureStorage.upload.single('file'),
  ProfileController.uploadImage
);
