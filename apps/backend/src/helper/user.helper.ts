import { IUserData, IUpdateUserData, IUserUpdateResponse, PartialBy } from '@food-book/api-interface';
import { Request, Response } from 'express';
import { User } from '../entity/User.entity';
import { ProfilePictureStorage } from './storage.helper';

export class UserHelper {
    public static readonly userSearchKeys = {
        EMAIL: 'email',
        USERNAME: 'username',
        ID: 'id',
    };

    public static getUserPayload(user: User): IUserData | IUserUpdateResponse {
        return {
            userId: user.id,
            username: user.username,
            email: user.email,
            profilePicture: ProfilePictureStorage.getProfilePicturePath(user.id),
        };
    }

    public static async checkAvailability(req: Request, res: Response, userData: PartialBy<IUpdateUserData, 'userId'>): Promise<boolean> {
        if (await this.userExistsByKey(UserHelper.userSearchKeys.EMAIL, userData.email, userData.userId)) {
            res.status(409).send({ message: 'This email is already registered' });
            return false;
        }
        if (await this.userExistsByKey(UserHelper.userSearchKeys.USERNAME, userData.username, userData.userId)) {
            res.status(409).send({ message: 'This username is already taken' });
            return false;
        }
        return true;
    }

    public static async userExistsByKey(searchKey: string, value: string, userId?: string): Promise<boolean> {
        return (
            (await User.find({ [searchKey]: value })).filter((user) => {
                if (!userId) return true;
                return user.id != userId;
            }).length > 0
        );
    }
}
