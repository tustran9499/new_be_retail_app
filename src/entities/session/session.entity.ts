import { Entity, Column, PrimaryGeneratedColumn, DeleteDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Account } from '../account/account.entity';

@Entity('Shift')
export class Session {
    @PrimaryGeneratedColumn("uuid")
    SessionId: string;

    @Column()
    Start: Date;

    @Column({ nullable: true, default: null })
    End: Date;

    @Column({ nullable: true, default: null })
    Type: string;

    @Column()
    SaleclerkId: number;

    @ManyToOne(() => Account, Account => Account.Sessions, {
        onDelete: "RESTRICT"
    })
    @JoinColumn({ name: "SaleclerkId", referencedColumnName: "Id" })
    Account: Account;

}
