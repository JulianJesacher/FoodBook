import { IIngredient, IIngredientUpload } from '@food-book/api-interface';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, BaseEntity } from 'typeorm';
import { Dish } from './Dish.entity';

export enum Units {
    G = 'g',
    ML = 'ml',
    PIECES = 'pieces',
    SPOON = 'tbsp',
    PINCH = 'pinch',
}

@Entity({ name: 'ingredient' })
export class Ingredient extends BaseEntity implements IIngredient {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @Column()
    amount: number;

    @Column({
        type: 'enum',
        enum: Units,
        default: Units.PIECES,
    })
    unit: string;

    @ManyToOne(() => Dish, (dish) => dish.ingredients)
    dish: Dish;

    constructor(ingredientData: IIngredientUpload, dish?: Dish) {
        super();
        this.name = ingredientData?.name;
        this.unit = Ingredient.getUnit(ingredientData?.unit);
        this.amount = ingredientData?.amount;

        if (dish) {
            this.dish = dish;
        }
    }

    public equals(other: Ingredient): boolean {
        return this.name === other.name && this.amount === other.amount && this.unit == other.unit && this.dish === other.dish;
    }

    private static getUnit(input: string): Units {
        switch (input) {
            case 'g':
                return Units.G;
            case 'ml':
                return Units.ML;
            case 'tbsp':
                return Units.SPOON;
            case 'pinch':
                return Units.PINCH;
            default:
                return Units.PIECES;
        }
    }
}
