import express = require('express');
import { AuthRouter } from './auth.router';
import { DishRouter } from './dish.router';
import { PostRouter } from './post.router';
import { ProfileRouter } from './profile.router';
import * as cors from 'cors';

export const RootRouter = express.Router({
    strict: true,
});

RootRouter.use(
    cors({
        origin: process.env.client_HOST ?? false,
        methods: process.env.SERVER_CORS_ALLOW_METHODS ?? 'GET,HEAD,PUT,PATCH,POST,DELETE',
        allowedHeaders: process.env.SERVER_CORS_ALLOW_HEADERS ?? 'Content-Type,Authorization',
        preflightContinue: false,
        optionsSuccessStatus: 204,
    })
);

RootRouter.use('/auth', AuthRouter);

RootRouter.use('/dish', DishRouter);

RootRouter.use('/profile', ProfileRouter);

RootRouter.use('/post', PostRouter);

RootRouter.get('/resetPassword', async (req, res) => {
    res.sendStatus(200);
});
