import express = require('express');
import {AuthRouter} from './auth.router';
import {DishRouter} from './dish.router';
import {PostRouter} from './post.router';
import {ProfileRouter} from './profile.router';

export const RootRouter = express.Router({
  strict: true,
});

RootRouter.use('/auth', AuthRouter);

RootRouter.use('/dish', DishRouter);

RootRouter.use('/profile', ProfileRouter);

RootRouter.use('/post', PostRouter);

RootRouter.get('/resetPassword', async (req, res) => {
  res.sendStatus(200);
});

