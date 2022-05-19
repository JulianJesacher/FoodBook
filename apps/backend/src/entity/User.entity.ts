import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, OneToMany, ManyToMany, JoinTable, CreateDateColumn, ManyToOne } from 'typeorm';
import { Dish } from './Dish.entity';
import { getHash } from '../helper/crypto.helper';
import { ISignupData, IUpdateUserData } from '@food-book/api-interface';
import { Rating } from './Rating.entity';
import { PasswordResetCode } from './PasswordResetCode.entity';

@Entity({ name: 'user' })
export class User extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    username: string;

    @Column()
    password: string;

    @Column()
    email: string;

    @CreateDateColumn()
    joined: Date;

    @OneToMany(() => Dish, (dish) => dish.postedBy)
    dishes: Dish[];

    @OneToMany(() => Rating, (rating) => rating.user)
    ratings: Rating[];

    @ManyToMany(() => Dish, (dish) => dish.savedBy)
    @JoinTable()
    saved: Dish[];

    @ManyToOne(() => PasswordResetCode, (passwordResetCode) => passwordResetCode.user)
    passwordResetCodes: PasswordResetCode[];

    changeCredentials(newCredentials: IUpdateUserData) {
        this.email = newCredentials.email;
        this.username = newCredentials.username;
        this.password = getHash(`${newCredentials.username}${newCredentials.password}`);
    }

    changePassword(newPassword: string){
      this.password = getHash(`${this.username}${newPassword}`);
    }

    passwordMatches(password: string): boolean {
        if (!password) {
            return false;
        }
        return this.password === getHash(`${this.username}${password}`);
    }

    constructor(userData: ISignupData) {
        super();
        if (!userData) return;
        this.saved = [];
        this.dishes = [];
        this.ratings = [];
        this.username = userData.username;
        this.password = getHash(`${userData.username}${userData.password}`);
        this.email = userData.email;
    }
}
