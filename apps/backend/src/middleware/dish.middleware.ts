import { Request, Response } from 'express';
import { Dish } from '../entity/Dish.entity';
import express = require('express');
import fs = require('fs-extra');

export class DishMiddleware {
    public static async retrieveDish(req: Request, res: Response, next: express.NextFunction): Promise<unknown> {
        const dishId: string = req.params.dishId;
        if (!dishId) {
            return res.status(400).send({ message: 'No dishId specified' });
        }

        const dish: Dish = await Dish.findOne({
            where: { id: dishId },
            relations: ['steps', 'ingredients', 'postedBy'],
        });

        if (!dish) {
            return res.status(400).send({ message: 'No dish with this id found' });
        }

        res.locals.dish = dish;
        next();
    }

    public static createImageDirectory(req: Request, res: Response, next: express.NextFunction): void {
        const dishId = req.params.dishId;
        const directory = `${process.env.DISH_IMAGES_DEST}/${dishId}`;
        fs.emptyDirSync(directory);
        console.log("createImageDirecotry");
        next();
    }

    public static async changedByCreator(req: Request, res: Response, next: express.NextFunction): Promise<unknown> {
        const userId: string = res.locals.user.userId;
        if (!userId) {
            return res.status(400).send({ message: 'No userId was specified' });
        }

        let dish: Dish = res.locals.dish;
        if (!dish) {
            dish = await Dish.findOne({ id: req.params.dishId });
            res.locals.dish = dish;
        }
        if (dish.postedBy?.id !== userId) {
            return res.status(403).send({ message: 'This user is not allowed to perform the requested operation' });
        }

        next();
    }
}
