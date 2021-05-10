import { Entity, Column, PrimaryGeneratedColumn, DeleteDateColumn, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { Category } from "./category.entity";
import { ProductOrder } from "../productorder/productorder.entity";

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
    Discount: number;

    @Column()
    UnitsInStock: number;

    @Column()
    ReorderLevel: number;

    @Column()
    Discontinued: boolean;

    @Column({ nullable: true, default: null })
    PhotoURL: string;

    @OneToMany(() => ProductOrder, ProductOrder => ProductOrder.Product)
    ProductOrders: ProductOrder[];
}
