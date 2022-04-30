import { Request, Response } from 'express';
import { User } from '../entity/User.entity';
import { jwthelper } from '../helper/jwt.helper';
import { getHash } from '../helper/crypto.helper';
import { UserHelper } from '../helper/user.helper';
import { ILoginData, ISignupData, ITokens, IUserAuthResponse } from '@food-book/api-interface';
import { PasswordResetCode } from '../entity/PasswordResetCode.entity';

export class UserController {
    public static async signup(req: Request, res: Response): Promise<void> {
        const userData: ISignupData = req.body;

        if (UserHelper.checkAvailability(req, res, userData)) {
            const newUser: User = new User(userData);

            await User.save(newUser);
            const returnData: IUserAuthResponse = await jwthelper.getUserReturnData(newUser);
            res.status(200).send(returnData);
        }
    }

    public static async login(req: Request, res: Response): Promise<unknown> {
        const userData: ILoginData = req.body;

        if (!userData || !userData.email || !userData.password) {
            return res.status(400).send({ message: 'Please enter valid data' });
        }

        const user: User | undefined = await User.findOne({ email: userData.email });
        if (!user || user.password != getHash(`${user.username}${userData.password}`)) {
            return res.status(401).send({ message: 'Email or password is wrong' });
        }

        const returnData: IUserAuthResponse = await jwthelper.getUserReturnData(user);
        res.status(200).send(returnData);
    }

    public static async refreshToken(req: Request, res: Response): Promise<unknown> {
        const refreshToken: string = req.body.refreshToken;
        if (!refreshToken) {
            return res.status(403).send('Access forbidden');
        }

        try {
            const newTokens: ITokens = await jwthelper.refreshToken(refreshToken);
            res.send(newTokens);
        } catch (err: any) {
            const message: string = err.message;
            res.status(400).send(message);
        }
    }

    public static async requestPasswordReset(req: Request, res: Response): Promise<unknown> {
        const email: string = req.params.email;
        if (!email) {
            return res.status(400).send({ message: 'No email was specified' });
        }

        const user: User = await User.findOne({ email: email });
        if (!user) {
            return res.status(400).send({ message: 'No user with this email was found' });
        }

        await new PasswordResetCode(user).save();
        res.sendStatus(200);
    }
}
