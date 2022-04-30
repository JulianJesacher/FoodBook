import { Request, Response } from 'express';

export class ProfileHelper {
    public static isOwnProfile(req: Request, res: Response): boolean {
        const profileId: string = req.params.profileId;
        console.log("profile", profileId);
        if (!profileId) {
            return false;
        }

        const userId: string = res.locals.user.userId;
        console.log("user", userId);
        if (profileId !== userId) {
            return false;
        }

        return true;
    }
}
