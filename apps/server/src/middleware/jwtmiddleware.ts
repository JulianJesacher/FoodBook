import { IUserData } from '@food-book/api-interface';
import { Request, Response } from 'express';
import { jwthelper } from '../helper/jwt.helper';

export class jwtmiddleware {
    public static loggerMiddleware(req: Request, res: Response, next: () => void) {
        const token = req.get('Authorization') ?? (('Bearer ' + req.query.access_token) as string);
        if (!token) {
            return res.status(401).send('No token found');
        }
        jwthelper
            .verifyJWTToken(token)
            .then((user) => {
                res.locals.user = user as IUserData;
                next();
            })
            .catch((err) => {
                return res.status(401).send(err);
            });
    }
}
