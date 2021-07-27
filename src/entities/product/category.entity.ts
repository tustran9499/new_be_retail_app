import { Entity, Column, PrimaryGeneratedColumn, DeleteDateColumn, OneToMany } from 'typeorm';
import { Product } from "./product.entity";

@Entity('Category')
export class Category {
    @PrimaryGeneratedColumn()
    Id: number;

    @Column()
    CategoryName: string;

    @Column()
    Description: string;

    @Column()
    Picture: string;

    @OneToMany(() => Product, Product => Product.Category)
    Products: Product[];
}
