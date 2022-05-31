import { Request, Response } from 'express';
import express = require('express');

export class IngredientMiddleware {
    public static getIngredientId(req: Request, res: Response, next: express.NextFunction): unknown {
        const ingredientId: string = req.params.ingredientId;
        if (!ingredientId) {
            return res.status(400).send({ message: 'No ingredientId was specified' });
        }

        res.locals.ingredientId = ingredientId;
        next();
    }
}
