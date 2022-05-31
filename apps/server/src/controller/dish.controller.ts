import { Dish } from '../entity/Dish.entity';
import { Request, Response } from 'express';
import { User } from '../entity/User.entity';
import { DishHelper } from '../helper/dish.helper';
import { Rating } from '../entity/Rating.entity';
import { DishPictureStorage } from '../helper/storage.helper';

export class DishController {
    public static async createDish(req: Request, res: Response): Promise<unknown> {
        const user: User = await User.findOne({ id: res.locals.user.userId });
        if (!user) {
            return res.status(400).send({ message: 'No user was specified' });
        }
        const dish: Dish = new Dish(user);
        await Dish.save(dish);
        res.status(200).send(await DishHelper.convertDishToDishResponse(dish));
    }

    public static async updateDish(req: Request, res: Response): Promise<unknown> {
        const originalDish: Dish = res.locals.dish;

        delete req.body['steps'];
        delete req.body['ingredients'];
        Object.assign(originalDish, req.body);
        await originalDish.save();

        return res.status(200).send(originalDish);
    }

    public static async getDish(req: Request, res: Response): Promise<void> {
        const dish: Dish = res.locals.dish;

        const currentUser: User = await User.findOne({
            where: { id: res.locals.user.userId },
            relations: ['saved'],
        });

        res.status(200).send(await DishHelper.convertDishToDishResponse(dish, currentUser));
    }

    public static async removeDish(req: Request, res: Response): Promise<void> {
        const dish: Dish = res.locals.dish;
        DishPictureStorage.removeDirectoryAndAllImages(dish.id);
        await dish.remove();
        res.sendStatus(204);
    }

    public static handleSaveOperation(req: Request, res: Response): void {
        const op: string = req.query.op as string;

        if (op === 'add') {
            DishController.saveDish(req, res);
        } else if (op === 'remove') {
            DishController.removeSavedDish(req, res);
        }
    }

    private static async saveDish(req: Request, res: Response): Promise<void> {
        const user: User = res.locals.user;
        const dish: Dish = res.locals.dish;

        user.saved.push(dish);
        await User.save(user);

        res.sendStatus(200);
    }

    private static async removeSavedDish(req: Request, res: Response): Promise<void> {
        const user: User = res.locals.user;
        const dish: Dish = res.locals.dish;

        user.saved = user.saved.filter((currentDish) => dish.id != currentDish.id);
        await User.save(user);
        res.sendStatus(200);
    }

    public static async handleRatingOperation(req: Request, res: Response): Promise<unknown> {
        const ratingNumber: number = parseInt(req.query.rating as string, 10);

        if (ratingNumber < 1 || ratingNumber > 5) {
            return res.status(400).send({ message: 'The rating hast to be a number between 1 and 5' });
        }

        let rating = await Rating.createQueryBuilder('rating')
            .where('dishId=:dishId', { dishId: req.params.dishId })
            .andWhere('userId=:userId', { userId: res.locals.user.id })
            .getOne();

        if (!rating) {
            rating = new Rating(ratingNumber, res.locals.user, res.locals.dish);
        } else {
            rating.ratingNumber = ratingNumber;
        }

        res.status(200).send(await Rating.save(rating));
    }

    public static async handleVisibilityChange(req: Request, res: Response): Promise<void> {
        const dish: Dish = res.locals.dish;
        const newState: string = req.query.state as string;

        if (newState === 'public') {
            dish.isPublic = true;
        } else {
            dish.isPublic = false;
        }

        res.status(200).send(await Dish.save(dish));
    }
}
