import { IUpdateUserData } from '@food-book/api-interface';
import { Request, Response } from 'express';
import { User } from '../entity/User.entity';
import { UserHelper } from '../helper/user.helper';

export class ProfileController {

    public static async sendProfile(req: Request, res: Response): Promise<unknown> {
        const userId: string = req.params.profileId;
        const user: User = await User.findOne({ id: userId });
        if (!userId || !user) {
            return res.status(400).send({ message: "No user with this id found" })
        }

        res.status(200).send(UserHelper.getUserPayload(user));
    }

    public static async getProfile(req: Request, res: Response): Promise<unknown> {
        const profileId : string = req.params.profileId;
        if(!profileId){
            return res.status(400).send({ message: "No profileId was specified" });
        }

        const user: User = await User.findOne({ id: profileId });
        if (!user) {
            return res.status(400).send({ message: "No user with this id found" });
        }

        res.status(200).send(UserHelper.getUserPayload(user));
    }

    public static async update(req: Request, res: Response): Promise<unknown> {
        const profileId: string = req.params.profileId;
        if (!profileId) {
            return res.status(404).send({ message: 'No profileId was specified' });
        }

        if (res.locals.user.userId != profileId) {
            return res.status(403).send({ message: 'This user is not allowed to make changes on this profile' });
        }
        const userData: IUpdateUserData = req.body;

        const existingUser: User = res.locals.user;
        if (!existingUser.passwordMatches(userData.password)) {
            return res.status(401).send({ message: 'Invalid password' });
        }

        if (!(await UserHelper.checkAvailability(req, res, userData))) {
            return res.status(409).send({ message: 'Username or email already in use' });
        }

        existingUser.changeCredentials(userData);
        await User.save(existingUser);
        res.status(200).send(UserHelper.getUserPayload(existingUser));
    }

}