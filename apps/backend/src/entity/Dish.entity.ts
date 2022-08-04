import { IDish, IDishUpload } from '@food-book/api-interface';
import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    OneToMany,
    BaseEntity,
    ManyToOne,
    UpdateDateColumn,
    CreateDateColumn,
    ManyToMany,
} from 'typeorm';
import { Ingredient } from './Ingredient.entity';
import { Step } from './Step.entity';
import { User } from './User.entity';
import { faker } from '@faker-js/faker';
import { Rating } from './Rating.entity';

@Entity({ name: 'dish' })
export class Dish extends BaseEntity implements Omit<IDish, 'postedBy' | 'images' | 'myRating' | 'saved'> {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    title: string;

    @Column({length: 5000})
    description: string;

    @Column()
    servings: number;

    @Column()
    time: number;

    @Column()
    isPublic: boolean;

    @UpdateDateColumn()
    lastUpdated!: Date;

    @CreateDateColumn()
    createdAt!: Date;

    @OneToMany(() => Ingredient, (ingredient) => ingredient.dish, {
        cascade: true,
    })
    ingredients: Ingredient[];

    @OneToMany(() => Step, (step) => step.dish, { cascade: true })
    steps: Step[];

    @ManyToOne(() => User, (user) => user.dishes, { eager: true , onDelete: "CASCADE"})
    postedBy: User;

    @OneToMany(() => Rating, (rating) => rating.dish, { eager: true })
    ratings: Rating[];

    @ManyToMany(() => User, (user) => user.saved, { eager: true })
    savedBy: User[];

    constructor(postedBy: User, dish?: IDishUpload, ingredients?: Ingredient[], steps?: Step[]) {
        super();
        this.title = dish?.title ?? '';
        this.description = dish?.description ?? '';
        this.servings = dish?.servings ?? 0;
        this.time = dish?.time ?? 0;
        this.postedBy = postedBy;
        this.isPublic = false;

        if (ingredients) {
            this.ingredients = ingredients;
        }
        if (steps) {
            this.steps = steps;
        }
    }
}

export const createExampleDish = (): Dish => {
    return new Dish(
        null,
        {
            id: faker.datatype.uuid(),
            title: faker.commerce.product(),
            description: faker.lorem.paragraph().substring(0, 100),
            steps: [],
            ingredients: [],
            time: faker.datatype.number(),
            servings: faker.datatype.number(),
            saved: false,
            userId: faker.datatype.uuid(),
            isPublic: true,
        },
        [],
        []
    );
};
