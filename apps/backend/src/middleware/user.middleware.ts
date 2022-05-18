import { Request, Response } from 'express';
import express = require('express');
import { User } from '../entity/User.entity';

export class UserMiddleware {
    public static async retrieveFullUser(req: Request, res: Response, next: express.NextFunction): Promise<unknown> {
        const userId: string = res.locals.user.userId;

        const user: User = await User.findOne({
            where: { id: userId },
            relations: ['saved'],
        });
        if (!user) {
            return res.status(400).send({ message: 'No user with this id was found' });
        }

        res.locals.user = user;
        next();
    }
}
