import { Entity, PrimaryGeneratedColumn, BaseEntity, OneToOne, JoinColumn, CreateDateColumn, ManyToOne } from 'typeorm';
import { User } from './User.entity';

@Entity({ name: 'passwordresetcode' })
export class PasswordResetCode extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => User, (user)=>user.passwordResetCodes)
    user: User;

    @CreateDateColumn()
    createdAt: Date;

    constructor(user: User) {
        super();
        this.user = user;
    }
}
