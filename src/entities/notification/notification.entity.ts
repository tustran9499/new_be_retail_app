import { Entity, Column, PrimaryGeneratedColumn, DeleteDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Account } from '../account/account.entity';

@Entity('Notification')
export class UserNotification {
    @PrimaryGeneratedColumn()
    Id: string;

    @Column()
    CreatedAt: Date;

    @Column()
    IsRead: Boolean;

    @Column()
    Title: string;

    @Column()
    Message: string;

    @Column()
    AccountId: number;

    @ManyToOne(() => Account, Account => Account.Sessions, {
        onDelete: "CASCADE"
    })
    @JoinColumn({ name: "AccountId", referencedColumnName: "Id" })
    Account: Account;

}
