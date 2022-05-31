import { Response, Request } from 'express';
import { Dish } from '../entity/Dish.entity';
import { PostHelper } from '../helper/posts.helper';
import { QueryParameters } from '@food-book/api-interface';
import { SelectQueryBuilder, getManager } from 'typeorm';
import { User } from '../entity/User.entity';

export class PostController {

    public static async handleGetPostsRequest(req: Request, res: Response): Promise<void> {
        const parameters: QueryParameters = req.query;
        const queryBuilder = PostController.getQueryBuilder(parameters);

        queryBuilder.andWhere('(dish.isPublic = :public OR postedById = :postedBy)', { public: true, postedBy: res.locals.user.userId });
        const dishes: Dish[] = (await queryBuilder.getMany().catch((error) => {
            return res.status(500).send({ error });
        })) as Dish[];

        const user: User = await User.findOne({
            where: { id: res.locals.user.userId },
            relations: ['saved'],
        });

        const posts = await PostHelper.convertDishesToPostsResponse(dishes, user);
        res.status(200).send(posts);
    }

    private static getQueryBuilder(parameters: QueryParameters): SelectQueryBuilder<Dish> {
        const queryBuilder = Dish.createQueryBuilder('dish');
        queryBuilder.offset(parameters.offset ?? 0).limit(parameters.limit ?? 10);

        for (const singleOrder of parameters.order ?? []) {
            queryBuilder.orderBy(singleOrder.field, singleOrder.direction);
        }

        if (parameters.filter) {
            for (const [index, singleFilter] of parameters.filter.entries() ?? [].entries()) {
                if (!isValidOperator(singleFilter.op) || !isValidField(singleFilter.field)) {
                    continue;
                }

                const whereClause = `dish.${singleFilter.field} ${singleFilter.op} :value${index}`;
                const whereParameters = { [`value${index}`]: singleFilter.value };

                if (singleFilter.joining === 'OR') {
                    queryBuilder.orWhere(whereClause, whereParameters);
                    continue;
                }
                queryBuilder.andWhere(whereClause, whereParameters);
            }
        }

        queryBuilder.leftJoinAndSelect('dish.postedBy', 'postedByUser').leftJoinAndSelect('dish.savedBy', 'savedByUser');
        return queryBuilder;
    }

    public static async getSavedPosts(req: Request, res: Response): Promise<void> {
        const random: string = req.query.random as string;
        delete req.query['random'];
        const parameters: QueryParameters = req.query;

        const user: User = res.locals.user;

        let orderByClause = parameters.order.map((singleOrder) => `${singleOrder.field} ${singleOrder.direction ?? ''} `).join(',');

        if (orderByClause.length > 0) {
            orderByClause = `ORDER BY ${orderByClause}`;
        }

        let response = await getManager().query(
            `SELECT sub.*, stats.savedByAmount FROM (SELECT dish.*, user.email, user.username FROM dish, user_saved_dish, user WHERE user_saved_dish.userId = '${
                user.id
            }' AND user_saved_dish.dishId = dish.id AND user.id = dish.postedById) AS sub, (SELECT COUNT(user_saved_dish.userId) AS savedByAmount, dishId FROM user_saved_dish GROUP BY user_saved_dish.dishId) AS stats WHERE sub.id = stats.dishId ${orderByClause}LIMIT ${
                parameters.limit ?? 10
            } OFFSET ${parameters.offset ?? 0}`
        );
        response = response.map((singleRow) => ({
            ...singleRow,
            postedBy: {
                id: singleRow.postedById,
                email: singleRow.email,
                username: singleRow.username,
            },
        }));
        console.log("Uff", await PostHelper.convertDishesToPostsResponse(response, user));
        res.status(200).send(await PostHelper.convertDishesToPostsResponse(response, user));
    }
}

export const validOperators = ['=', '>', '<', '>=', '<=', '<>', 'LIKE'];

export const isValidOperator = (operator: string): boolean => {
    return validOperators.includes(operator);
};

export const validDishFields = [
    'id',
    'title',
    'description',
    'servings',
    'time',
    'ratingSum',
    'ratingAmount',
    'lastUpdated',
    'createdAt',
    'postedById',
];

export const isValidField = (field: string): boolean => {
    return validDishFields.includes(field);
};
