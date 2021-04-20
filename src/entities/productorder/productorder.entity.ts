import { Entity, Column, PrimaryGeneratedColumn, DeleteDateColumn, PrimaryColumn } from 'typeorm';

@Entity('ProductOrder')
export class ProductOrder {
    @PrimaryColumn()
    ProductId: number;

    @PrimaryColumn()
    OrderId: number;

    @Column()
    Price: number;

    @Column()
    Quantity: number;

    @Column({ default: 0 })
    ReturnedQuantity: number;

    @Column({ default: 0 })
    Tax: number;
}
