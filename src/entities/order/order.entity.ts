import { Guid } from 'guid-typescript';
import { Entity, Column, PrimaryGeneratedColumn, DeleteDateColumn, OneToMany, ManyToOne, JoinColumn } from 'typeorm';
import { ProductOrder } from "../productorder/productorder.entity";
import { Session } from "../session/session.entity";
import { Account } from "../account/account.entity";
import { Customer } from "../customer/customer.entity";

@Entity('Order')
export class Order {
    @PrimaryGeneratedColumn()
    Id: number;

    @Column()
    OrderDate: Date;

    @Column()
    CustomerId: number;

    @ManyToOne(() => Customer, Customer => Customer.Orders, {
        onDelete: "RESTRICT"
    })
    @JoinColumn({ name: "CustomerId", referencedColumnName: "Id" })
    Customer: Customer;

    @Column()
    SaleClerkId: number;

    @ManyToOne(() => Account, Account => Account.Orders, {
        onDelete: "RESTRICT"
    })
    @JoinColumn({ name: "SaleClerkId", referencedColumnName: "Id" })
    Account: Account;

    @Column()
    SessionId: string;

    @DeleteDateColumn()
    DeletedAt?: Date;

    @OneToMany(() => ProductOrder, ProductOrder => ProductOrder.Order)
    ProductOrders: ProductOrder[];
}
