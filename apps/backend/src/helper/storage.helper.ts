import { Request, Response } from 'express';
import express = require('express');
import * as multer from 'multer';
import path = require('path');
import fs = require('fs-extra');
import { randomUUID } from 'crypto';

export class ProfilePictureStorage {
    private static readonly _directory: string = process.env.PROFILE_IMAGES_DEST;

    private static storage = multer.diskStorage({
        destination: (req, file, callBack) => {
            callBack(null, ProfilePictureStorage._directory);
        },
        filename: (req, file, callBack) => {
            const fileName = `${req.params.profileId}${path.extname(file.originalname)}`;
            callBack(null, fileName);
        },
    });

    public static upload = multer({ storage: ProfilePictureStorage.storage });

    public static getProfilePicturePath(userId: string): string {
        const path = `${ProfilePictureStorage._directory}/${userId}`;
        const host: string = process.env.SERVER_HOST + `/profile/images/${userId}`;

        if (fs.existsSync(path + '.png')) {
            return host + '.png';
        }

        if (fs.existsSync(path + '.jpg')) {
            return host + '.jpg';
        }
        return 'https://i.stack.imgur.com/l60Hf.png';
    }

    public static removeProfilePicture(req: Request, res: Response, next: express.NextFunction): void {
        const path = `${ProfilePictureStorage._directory}/${req.params.profileId}`;
        fs.removeSync(path + '.jpg');
        fs.removeSync(path + '.png');
        next();
    }
}

export class DishPictureStorage {
    private static readonly _directory: string = process.env.DISH_IMAGES_DEST;

    private static storage = multer.diskStorage({
        destination: function (req, file, callBack) {
            const dishId: string = req.params.dishId;
            const path = `${DishPictureStorage._directory}/${dishId}`;
            callBack(null, path);
        },
        filename: function (req, file, callBack) {
            const fileEnding: string = file.originalname.split('.').pop();
            const fileName = `${randomUUID()}.${fileEnding}`;
            callBack(null, fileName);
        },
    });
    public static upload = multer({ storage: DishPictureStorage.storage });

    public static getDishImages(dishId: string): string[] {
        const out: string[] = [];

        const directory = `${DishPictureStorage._directory}/${dishId}`;
        if (fs.existsSync(directory)) {
            fs.readdirSync(directory).forEach((file) => {
                out.push(`${process.env.SERVER_HOST}/dish/images/${dishId}/${file}`);
            });
        }
        return out;
    }

    public static removeImage(req: Request, res: Response): unknown {
        const dishId: string = req.params.dishId;
        if (!dishId) {
            return res.status(400).send({ message: 'No dishId specified' });
        }

        const imageName: string = req.params.image;
        fs.removeSync(`${DishPictureStorage._directory}/${dishId}/${imageName}`);
        res.sendStatus(204);
    }

    public static removeDirectoryAndAllImages(dishId: string): void {
        const path = `${DishPictureStorage._directory}/${dishId}`;
        if (fs.existsSync(path)) {
            fs.removeSync(path);
        }
    }

    public static sendUploadedImages(req: Request, res: Response): void {
        const dishId: string = req.params.dishId;
        const newFiles: string[] = (req.files as Express.Multer.File[]).map(
            (file) => `${process.env.SERVER_HOST}/dish/images/${dishId}/${file.filename}`
        );
        res.status(200).send(newFiles);
    }
}
