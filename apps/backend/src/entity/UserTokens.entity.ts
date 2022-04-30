import { BaseEntity, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'usertokens' })
export class UserToken extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column()
    userId: string;

    @Column()
    refreshToken: string;

    @CreateDateColumn()
    createdAt!: Date;

    constructor(userId: string, refreshToken: string) {
        super();
        this.userId = userId;
        this.refreshToken = refreshToken;
    }
}
