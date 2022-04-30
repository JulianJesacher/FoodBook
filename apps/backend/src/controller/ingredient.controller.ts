import { Request, Response } from 'express';
import { Dish } from '../entity/Dish.entity';
import { Ingredient } from '../entity/Ingredient.entity';

export class IngredientController {
    public static async createIngredient(req: Request, res: Response): Promise<void> {
        const dish: Dish = res.locals.dish;
        const { name, amount, unit } = req.body;
        const newIngredient = await new Ingredient({ name, amount, unit }, dish).save();
        res.status(200).send(newIngredient);
    }

    public static async updateIngredient(req: Request, res: Response): Promise<unknown> {
        const ingredientId: string = res.locals.ingredientId;

        const originalIngredient: Ingredient = await Ingredient.findOne({ id: ingredientId });
        if (!originalIngredient) {
            return res.status(400).send({ message: 'No ingredient with this id was found' });
        }

        Object.assign(originalIngredient, req.body);
        const updatedIngredient = await Ingredient.save(originalIngredient);
        res.status(200).send(updatedIngredient);
    }

    public static async removeIngredient(req: Request, res: Response): Promise<void> {
        const ingredientId: string = res.locals.ingredientId;
        await Ingredient.delete({ id: ingredientId });
        res.sendStatus(204);
    }
}
