import { Request, Response } from 'express';
import express = require('express');
import { User } from '../entity/User.entity';
import { ProfilePictureStorage } from '../helper/storage.helper';

export class UserMiddleware {
    public static async RetrieveFullUser(req: Request, res: Response, next: express.NextFunction): Promise<unknown> {
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

/*     public static async GetFileEnding(req: Request, res: Response, next: express.NextFunction): Promise<void> {
        const userId: string = req.url.split('.')[0].substring(1);
        const fileEnding: string = await ProfilePictureStorage.getFileEnding(userId);
        if(!fileEnding){
            req.url = 
        }
        req.url = `/${userId}.${fileEnding}`;
        console.log(req.url);
        next();
    } */
}
