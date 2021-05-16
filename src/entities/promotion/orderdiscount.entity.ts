import { Entity, Column, PrimaryGeneratedColumn, DeleteDateColumn, PrimaryColumn } from 'typeorm';

@Entity('OrderDiscount')
export class OrderDiscount {
    @PrimaryColumn()
    Coupon: number;

    @Column()
    MinBill: number;

    @Column()
    MaxDiscount: number;
}
