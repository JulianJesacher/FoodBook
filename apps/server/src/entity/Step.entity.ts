import { IStep } from '@food-book/api-interface';
import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, ManyToOne } from 'typeorm';
import { Dish } from './Dish.entity';

@Entity({ name: 'step' })
export class Step extends BaseEntity implements IStep {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    number: number;

    @Column()
    content: string;

    @ManyToOne(() => Dish, (dish) => dish.steps)
    dish: Dish;

    constructor(content: string, number: number, dish: Dish) {
        super();
        this.content = content;
        this.number = number;
        this.dish = dish;
    }

    public equals(other: Step): boolean {
        return this.number === other.number && this.content === other.content && this.dish === other.dish;
    }
}
