import jwt = require("jsonwebtoken");
import { UserToken } from '../entity/UserTokens.entity';
import { User } from '../entity/User.entity';
import { getHash } from './crypto.helper';
import { UserHelper } from './user.helper';
import { IUserData, ITokens, IUserAuthResponse } from "@food-book/api-interface";

export class jwthelper {

    public static getAccessToken(payload: IUserData): string {
        return jwt.sign({ user: payload }, process.env.ACCESS_PRIVATE_KEY, { expiresIn: parseInt(process.env.ACCESS_TIME, 10) });
    }

    public static async getRefreshToken(payload: IUserData): Promise<string> {
        const userRefreshTokens: UserToken[] = await UserToken.find({ userId: payload.userId });

        if (userRefreshTokens.length >= 5) {
            const res: UserToken[] = userRefreshTokens.sort((a, b) => (a.createdAt > b.createdAt) ? 1 : -1);
            for (let index = 0; index < res.length - 5 + 1; index++) {
                UserToken.remove(res[index]);
            }
        }

        const refreshToken: string = jwt.sign({ user: payload }, process.env.REFRESH_PRIVATE_KEY, { expiresIn: parseInt(process.env.REFRESH_TIME, 10) });
        await UserToken.save(new UserToken(payload.userId, getHash(refreshToken)));

        return refreshToken;
    }

    public static verifyJWTToken(token: string) {
        return new Promise((resolve, reject) => {
            if (!token.startsWith('Bearer')) {
                return reject('Token is invalid');
            }

            //Removing 'Bearer '
            token = token.slice(7, token.length);

            jwt.verify(token, process.env.ACCESS_PRIVATE_KEY, (err: any, decodedToken: any) => {
                if (err) {
                    return reject(err.message);
                }
                if (!decodedToken || !decodedToken.user) {
                    return reject('Token invalid');
                }

                resolve(decodedToken.user);
            });
        });
    }

    public static async refreshToken(refreshToken: string): Promise<ITokens> {
        const decodedRefreshToken: any = await jwt.verify(refreshToken, process.env.REFRESH_PRIVATE_KEY);
        const decodedUserdata: IUserData = decodedRefreshToken.user;

        const user: User | undefined = await User.findOne(
            { id: decodedUserdata.userId }
        );
        if (!user) {
            throw new Error('User not found');
        }

        const allRefreshTokens: UserToken[] = await UserToken.find(
            { userId: user.id }
        );
        if (!allRefreshTokens || !allRefreshTokens.length) {
            throw new Error('No refresh token found corresponding to this id');
        }

        const currentRefreshToken = allRefreshTokens.find(token => token.refreshToken === getHash(refreshToken));
        if (!currentRefreshToken) {
            throw new Error('Invalid refresh Token');
        }
        const payload : IUserData = UserHelper.getUserPayload(user);

        const newRefreshToken: string = await jwthelper.getUpdatedRefreshToken(refreshToken, payload);
        const newAccessToken = jwthelper.getAccessToken(payload);

        return <ITokens>{ accessToken: newAccessToken, refreshToken: newRefreshToken };
    }

    public static async getUpdatedRefreshToken(oldRefreshToken: string, payload: IUserData): Promise<string> {
        const newRefreshToken = jwt.sign({ user: payload }, process.env.REFRESH_PRIVATE_KEY, { expiresIn: parseInt(process.env.REFRESH_TIME, 10) });
        const tokens = await UserToken.find({ refreshToken: getHash(oldRefreshToken) });

        await tokens.forEach(async token => {
            token.refreshToken = getHash(newRefreshToken);
            await UserToken.save(token);
            return oldRefreshToken;
        });

        return newRefreshToken;
    }

    public static async getUserReturnData(user: User): Promise<IUserAuthResponse> {
        const userPayload: IUserData = UserHelper.getUserPayload(user);

        const accessToken = jwthelper.getAccessToken(userPayload);
        const refreshToken = await jwthelper.getRefreshToken(userPayload);

        return ({
            accessToken,
            refreshToken,
            user: userPayload
        });
    }
}
