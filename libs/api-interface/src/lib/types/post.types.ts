import { IUserData } from './user.types';

export interface IPostBase {
    title: string;
    description: string;
    time: number;
    id: string;
    saved: boolean;
    isPublic: boolean;
}

export interface IPost extends IPostBase {
    postedBy: IUserData;
    rating: number;
    images: string[];
    savedByAmount: number;
}

export type ISaveOperation = 'add' | 'remove';