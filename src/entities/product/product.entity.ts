import { Entity, Column, PrimaryGeneratedColumn, DeleteDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Category } from "./category.entity";

@Entity('Product')
export class Product {
    @PrimaryGeneratedColumn()
    Id: number;

    @Column()
    ProductName: string;

    @Column({ name: 'CategoryId' })
    CategoryId: number;

    @ManyToOne(() => Category, Category => Category.Products, {
        onDelete: "CASCADE"
    })
    @JoinColumn({ name: "CategoryId", referencedColumnName: "Id" })
    Category: Category;

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

    @Column({ nullable: true, default: null })
    PhotoURL: string;
}
