import { Request, Response } from 'express';
import { UserController } from '../controller/user.controller';
import { jwtmiddleware } from '../middleware/test/jwtmiddleware';

import express = require('express');

export const AuthRouter = express.Router({ strict: true });

AuthRouter.post('/signup', UserController.signup);

AuthRouter.post('/login', UserController.login);

AuthRouter.post('/refresh-token', UserController.refreshToken);

AuthRouter.put('/:email/requestPasswordReset', UserController.requestPasswordReset);

AuthRouter.get('/current-user', jwtmiddleware.loggerMiddleware, async (req: Request, res: Response) => {
    res.status(200).send(res.locals.user);
})