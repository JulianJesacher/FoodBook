import { Connection } from 'typeorm';
import {Factory, Seeder} from 'typeorm-seeding';
import { Dish } from '../../entity/Dish.entity';
import { Rating } from '../../entity/Rating.entity';
import { faker } from '@faker-js/faker';
export default class CreateRatings implements Seeder {
    async run(factory: Factory, connection: Connection): Promise<void> {
        const dishSet = await factory(Dish)().createMany(10);
        //dishSet.forEach(x => Dish.save(x));

        await factory(Rating)().map(async (rating: Rating) => {
            rating.dish = dishSet[faker.datatype.number({min: 0, max: 9})]
            return rating;
        }).createMany(200);
    }

}