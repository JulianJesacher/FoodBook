import {Request, Response} from 'express';
import {User} from '../entity/User.entity';
import {jwthelper} from '../helper/jwt.helper';
import {getHash} from '../helper/crypto.helper';
import {UserHelper} from '../helper/user.helper';
import {ILoginData, ISignupData, ITokens, IUserAuthResponse} from '@food-book/api-interface';
import {PasswordResetCode} from '../entity/PasswordResetCode.entity';

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
      return res.status(400).send({message: 'Please enter valid data'});
    }

    const user: User | undefined = await User.findOne({email: userData.email});
    if (!user || user.password != getHash(`${user.username}${userData.password}`)) {
      return res.status(401).send({message: 'Email or password is wrong'});
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
      return res.status(400).send({message: 'No email was specified'});
    }

    const user: User = await User.findOne({email: email});
    if (!user) {
      return res.status(400).send({message: 'No user with this email was found'});
    }

    await new PasswordResetCode(user).save();
    res.sendStatus(200);
  }

  public static async resetPassword(req: Request, res: Response): Promise<unknown> {
    const userId: string = req.params.userId;
    const resetCode: string = req.body.resetCode;

    const exists: boolean = (await PasswordResetCode.createQueryBuilder().where(`userId = :userId AND id = :resetCode AND TIMESTAMPADD(HOUR, ${process.env.RESET_PASSWORD_CODE_TIME},createdAt) > NOW()`, {
      userId,
      resetCode
    }).getOne()) !== undefined;

    if (!exists) {
      return res.status(404).send({message: 'No valid resetCode found'});
    }

    const user: User = await User.findOneOrFail({id: userId});

    const newPassword: string = req.body.newPassword;
    if (!newPassword) {
      return res.status(400).send({message: 'No new Password stated'});
    }

    user.changePassword(newPassword);
    await user.save();

    return res.sendStatus(200);
  }

  public static async usernameExists(req: Request, res: Response) : Promise<void> {
    const exists = await User.createQueryBuilder().where("username = :username", {username: req.params.username}).getOne() !== undefined;
    res.status(200).send(exists);
  }

  public static async emailExists(req: Request, res: Response) : Promise<boolean> {
    return await User.createQueryBuilder().where("email = :email", {username: req.params.email}).getOne() !== undefined;
  }
}
