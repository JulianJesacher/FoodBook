import { IUserData } from './user.types';
import { IPostBase } from './post.types';

export interface IIngredientUpload {
    name: string;
    amount: number;
    unit: string;
}

export interface IIngredient extends IIngredientUpload {
    id: string;
}

export interface IStepUpload {
    content: string;
    number: number;
}

export interface IStep extends IStepUpload {
    id: string;
}

export interface IDishUpload extends IPostBase {
    userId: string;
    servings: number;
    steps: string[];
    ingredients: IIngredientUpload[];
}

export interface IDish extends IPostBase {
    servings: number;
    postedBy: IUserData;
    images: string[];
    myRating: number;
    steps: IStep[];
    ingredients: IIngredient[];
}