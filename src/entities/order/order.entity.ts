import { Guid } from 'guid-typescript';
import { Entity, Column, PrimaryGeneratedColumn, DeleteDateColumn } from 'typeorm';

@Entity('Order')
export class Order {
    @PrimaryGeneratedColumn()
    Id: number;

    @Column()
    OrderDate: Date;

    @Column()
    CustomerId?: number;

    @Column()
    SaleClerkId: number;

    @Column()
    SessionId: string;

    @DeleteDateColumn()
    DeletedAt?: Date;
}
