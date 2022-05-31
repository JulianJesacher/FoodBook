import { Faker } from '@faker-js/faker';
import {define, factory} from 'typeorm-seeding';
import { Dish } from '../../entity/Dish.entity';
import { Rating } from '../../entity/Rating.entity';
import { User } from '../../entity/User.entity';

define(User, (faker: Faker) => {
    return new User({
        email: faker.internet.email(),
        username: faker.internet.userName(),
        password: 'Password123',
    });
});


define(Dish, (faker: Faker) => {
        return new Dish(
            factory(User)() as unknown as User,
            {
                id: '',
                title: faker.commerce.product(),
                description: faker.lorem.paragraph().substring(0, 100),
                steps: [],
                ingredients: [],
                time: faker.random.number(),
                servings: faker.random.number(),
                saved: false,
                userId: '',
                isPublic: true,
            },
            [],
            []
        );
});

define(Rating, (faker: Faker) => {
    return new Rating(faker.random.number({ min: 1, max: 5 }), factory(User)() as unknown as User, factory(Dish)() as unknown as Dish);
});

factory(Dish)().makeMany(5);