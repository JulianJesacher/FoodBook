import 'reflect-metadata';
import * as express from 'express';
import { createConnection } from 'typeorm';
import { RootRouter } from './routes/root.controller';
import { User } from './entity/User.entity';
import { Dish } from './entity/Dish.entity';
import { Step } from './entity/Step.entity';
import { UserToken } from './entity/UserTokens.entity';
import { Ingredient } from './entity/Ingredient.entity';
import { Rating } from './entity/Rating.entity';
import * as cron from 'node-cron';
import { DishPictureStorage } from './helper/storage.helper';
import { PasswordResetCode } from './entity/PasswordResetCode.entity';

const app = express();
app.use(express.json());

async function runServer(): Promise<void> {
    createConnection({
        type: process.env.TYPEORM_DB_TYPE as any,
        host: process.env.TYPEORM_DB_HOST,
        port: parseInt(process.env.TYPEORM_DB_PORT, 10),
        username: process.env.TYPEORM_DB_USERNAME,
        password: process.env.TYPEORM_DB_PASSWORD,
        database: process.env.TYPEORM_DB_DATABASE,
        logging: JSON.parse(process.env.TYPEORM_DB_LOGGING),
        synchronize: JSON.parse(process.env.TYPEORM_DB_SYNCHRONIZE),
        entities: [User, Dish, Step, UserToken, Ingredient, Rating, PasswordResetCode],
    })
        .then((connection) => {
            cron.schedule('0 * * * *', async () => {
                const deletedDishIds = (await Dish.createQueryBuilder('dish').delete().where('title=""').output('id').execute()).raw.map(
                    (packet) => packet.id
                );
                deletedDishIds.forEach((id) => DishPictureStorage.removeDirectoryAndAllImages(id));

                const resetCodeEntities: PasswordResetCode[] = await PasswordResetCode.createQueryBuilder()
                    .where(`TIMESTAMPADD(HOUR, ${process.env.RESET_PASSWORD_CODE_TIME},createdAt) > NOW()`)
                    .getMany();
                resetCodeEntities.forEach((entity) => entity.remove());
            });

            app.listen(3000);
            console.log('Server listening on port 3000');
        })
        .catch((error) => console.log('TypeORM connecton error: ', error));
}

runServer();
app.use(RootRouter);
