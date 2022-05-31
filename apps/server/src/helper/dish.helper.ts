import { IDish, IIngredient, IStep } from '@food-book/api-interface';
import { Dish } from '../entity/Dish.entity';
import { Ingredient } from '../entity/Ingredient.entity';
import { Step } from '../entity/Step.entity';
import { UserHelper } from './user.helper';
import { DishPictureStorage } from './storage.helper';
import { User } from '../entity/User.entity';
import { Rating } from '../entity/Rating.entity';

export class DishHelper {
    public static async convertDishToDishResponse(dish: Dish, user?: User): Promise<IDish> {
        let rating: Rating;
        if (user) {
            rating = await Rating.createQueryBuilder('rating')
                .where('dishId=:dishId', { dishId: dish.id })
                .andWhere('userId=:userId', { userId: user.id })
                .getOne();
        }
        return {
            id: dish.id,
            title: dish.title,
            description: dish.description,
            ingredients: DishHelper.getIngredientsResponse(dish.ingredients),
            steps: DishHelper.getStepsResponse(dish.steps),
            time: dish.time,
            servings: dish.servings,
            postedBy: UserHelper.getUserPayload(dish.postedBy),
            myRating: rating?.ratingNumber ?? 0,
            images: DishPictureStorage.getDishImages(dish.id),
            saved: user?.saved.some((saved: Dish) => saved.id == dish.id) ?? false,
            isPublic: dish.isPublic,
        };
    }

    private static getIngredientsResponse(ingredients: Ingredient[]): IIngredient[] {
        if (!ingredients) {
            return [];
        }
        const output: IIngredient[] = [];
        ingredients.forEach((ingredient) => {
            output.push({
                name: ingredient.name,
                amount: ingredient.amount,
                unit: ingredient.unit,
                id: ingredient.id,
            });
        });
        return output;
    }

    private static getStepsResponse(steps: Step[]): IStep[] {
        if (!steps) {
            return [];
        }
        const output: IStep[] = [];
        steps
            .sort((a, b) => a.number - b.number)
            .forEach((step) => {
                output.push(step);
            });
        return output;
    }
}
