import { ITokens } from './jwt.types';

export interface IUserData {
    userId: string;
    email: string;
    username: string;
    profilePicture: string;
}

export interface IAuthResponse {
    accessToken: string;
    refreshToken: string;
    personalPrivateKey: string;
    user: IUserData;
}

export const CStorageKeys = {
    ACCESS_TOKEN: 'token',
    REFRESH_TOKEN: 'refreshToken',
    PERSONAL_PRIVATE_KEY: 'personalPrivateKey',
};

export interface IBasicUserData {
    email: string;
    username: string;
    password: string;
}

export interface IUpdateUserData extends IBasicUserData {
    userId: string;
}

export type ISignupData = IBasicUserData;

export type IUpdateData = IBasicUserData;

export type ILoginData = Omit<ISignupData, 'username'>;

export type IUserUpdateResponse = IUserData;

export interface IUserAuthResponse extends ITokens {
    personalPrivateKey: string;
    user: IUserData;
}