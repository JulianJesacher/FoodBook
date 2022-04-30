import express = require('express');
import { AuthRouter } from './auth.router';
import { DishRouter } from './dish.router';
import { PostRouter } from './post.router';
import { ProfileRouter } from './profile.router';
import { StepController } from '../controller/step.controller';
import { createExampleDish, Dish } from '../entity/Dish.entity';
import { User } from '../entity/User.entity';
import { Rating } from '../entity/Rating.entity';
import { getManager } from 'typeorm';
import { sendEmail } from '../helper/email';

export const RootRouter = express.Router({
    strict: true,
});

RootRouter.use('/auth', AuthRouter);

RootRouter.use('/dish', DishRouter);

RootRouter.use('/profile', ProfileRouter);

RootRouter.use('/post', PostRouter);

RootRouter.get('/test', async (req, res) => {
    sendEmail('julianjesacher@gmail.com', 'x', 'a', 'username');
    res.sendStatus(200);
});

RootRouter.get('/resetPassword', async (req, res) => {
    console.log(req.query);
    res.sendStatus(200);
});

