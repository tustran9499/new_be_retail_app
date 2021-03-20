import { Entity, Column, PrimaryGeneratedColumn, DeleteDateColumn } from 'typeorm';

@Entity('Product')
export class Product {
    @PrimaryGeneratedColumn()
    Id: number;

    @Column()
    ProductName: string;

    @Column()
    CategoryId: number;

    @Column()
    QuantityPerUnit: string;

    @Column()
    UnitPrice: number;

    @Column()
    UnitsInStock: number;

    @Column()
    ReorderLevel: number;

    @Column()
    Discontinued: boolean;
}