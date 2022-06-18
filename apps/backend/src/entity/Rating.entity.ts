import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, ManyToOne } from 'typeorm';
import { Dish } from './Dish.entity';
import { User } from './User.entity';

@Entity({ name: 'rating' })
export class Rating extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    ratingNumber: number;

    @ManyToOne(() => Dish, (dish) => dish.ratings, {onDelete: "CASCADE"})
    dish: Dish;

    @ManyToOne(() => User, (user) => user.ratings, {onDelete: "CASCADE"})
    user: User;

    constructor(ratingNumber: number, user: User, dish: Dish) {
        super();
        this.user = user;
        this.dish = dish;
        this.ratingNumber = ratingNumber;
    }
}
