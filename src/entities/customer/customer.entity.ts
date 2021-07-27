import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    DeleteDateColumn,
    OneToMany,
} from 'typeorm';
import { Order } from "../order/order.entity";


@Entity('Customer')
export class Customer {
    @PrimaryGeneratedColumn()
    Id: number;

    @Column()
    ContactTitle: string;

    @Column()
    ContactName: string;

    @Column()
    Address: string;

    @Column()
    City: string;

    @Column()
    Region: string;

    @Column()
    PostalCode: string;

    @Column()
    Country: string;

    @Column()
    Phone: string;

    @Column()
    Fax: string;

    @OneToMany(() => Order, Order => Order.Customer)
    Orders: Order[];
}
