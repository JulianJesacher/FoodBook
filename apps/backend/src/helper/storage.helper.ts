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
            const fileName = `${req.body.userId}${path.extname(file.originalname)}`;
            req.body.fileName = fileName;
            callBack(null, fileName);
        },
    });

    public static upload = multer({ storage: ProfilePictureStorage.storage });

    public static removeProfilePicture(req: Request, res: Response, next: express.NextFunction): void {
        fs.readdirSync(ProfilePictureStorage._directory).forEach(async (file) => {
            if (file.startsWith(res.locals.user.userId)) {
                await fs.remove(`${ProfilePictureStorage._directory}/${file}`);
            }
        });
        next();
    }

    public static getFileEnding(userId: string): string {
        return fs
            .readdirSync(ProfilePictureStorage._directory)
            .find((file) => file.startsWith(userId))
            ?.split('.')
            .pop();
    }
}

export class DishPictureStorage {
    private static readonly _directory: string = process.env.DISH_IMAGES_DEST;

    private static storage = multer.diskStorage({
        destination: function(req, file, callBack) {
            const dishId: string = req.params.dishId;
            const path = `${DishPictureStorage._directory}/${dishId}`;
            console.log('patht', path);
            callBack(null, path);
        },
        filename: function (req, file, callBack) {
            const fileEnding: string = file.originalname.split('.').pop();
            console.log(`${randomUUID()}.${fileEnding}`);
            callBack(null, `${randomUUID()}.${fileEnding}`);
        },
    });
    public static upload = multer({ storage: DishPictureStorage.storage });

    public static getDishImages(dishId: string): string[] {
        const out: string[] = [];

        const directory = `${DishPictureStorage._directory}/${dishId}`;
        if (fs.existsSync(directory)) {
            fs.readdirSync(directory).forEach((file) => {
                out.push(`http://localhost:3000/dish/images/${dishId}/${file}`);
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
        console.log("hier");
        const dishId: string = req.params.dishId;
        const newFiles: string[] = (req.files as Express.Multer.File[]).map(
            (file) => `http://localhost:3000/dish/images/${dishId}/${file.originalname}`
        );
        res.status(200).send(newFiles);
    }
}
