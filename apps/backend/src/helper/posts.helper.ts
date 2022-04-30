import { Dish } from '../entity/Dish.entity';
import { UserHelper } from './user.helper';
import { DishPictureStorage } from './storage.helper';
import { IPost } from '@food-book/api-interface';
import { User } from '../entity/User.entity';
import { getManager, QueryBuilder } from 'typeorm';

interface IRatingRecord {
    ratingValue: number;
    ratingSum: number;
    ratingAmount: number;
    dishId: string;
}

export class PostHelper {
    public static async convertDishesToPostsResponse(dishes: Dish[], user: User): Promise<IPost[]> {
        const posts: IPost[] = [];
        const whereClause = dishes.length <= 0 ? 'WHERE 1 = 2' : `WHERE rating.dishId IN (${dishes.map(x=> `"${x.id}"` ).join(",")})`
        const query = `SELECT sub.ratingSum/sub.ratingAmount AS ratingValue, sub.* FROM (SELECT rating.dishId, SUM(rating.ratingNumber) AS ratingSum, COUNT(rating.ratingNumber) AS ratingAmount FROM rating ${whereClause} GROUP BY rating.dishId) AS sub`;
        const ratingRecords: IRatingRecord[] = await getManager().query(
            query
        );

        dishes.forEach((dish) => {
            const post = {
                id: dish.id,
                title: dish.title,
                description: dish.description,
                time: dish.time,
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                savedByAmount: dish.savedBy?.length ?? dish.savedByAmount,
                postedBy: UserHelper.getUserPayload(dish.postedBy),
                images: DishPictureStorage.getDishImages(dish.id),
                rating: ratingRecords.find((rating) => rating.dishId === dish.id)?.ratingValue ?? 0,
                saved: user?.saved.some((saved: Dish) => saved.id === dish.id) ?? false,
                isPublic: dish.isPublic,
            };
            posts.push(post);
        });

        return posts;
    }
}
