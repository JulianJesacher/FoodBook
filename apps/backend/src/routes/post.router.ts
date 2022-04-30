import express = require('express');
import { PostController } from '../controller/post.controller';
import { jwtmiddleware } from '../middleware/test/jwtmiddleware';
import { UserMiddleware } from '../middleware/user.middleware';

export const PostRouter = express.Router({ strict: true });
PostRouter.use(jwtmiddleware.loggerMiddleware);

PostRouter.get('/', PostController.handleGetPostsRequest);

PostRouter.get('/saved', UserMiddleware.RetrieveFullUser, PostController.getSavedPosts);