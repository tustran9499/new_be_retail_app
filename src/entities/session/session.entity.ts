import { Entity, Column, PrimaryGeneratedColumn, DeleteDateColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { Account } from '../account/account.entity';
import { Store } from '../store/store.entity';
import { Order } from '../order/order.entity';

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

    @Column()
    StoreId: number;

    @ManyToOne(() => Store, Store => Store.Sessions, {
        onDelete: "RESTRICT"
    })
    @JoinColumn({ name: "StoreId", referencedColumnName: "Id" })
    Store: Store;

    @OneToMany(() => Order, Order => Order.Session)
    Orders: Order[];

}
