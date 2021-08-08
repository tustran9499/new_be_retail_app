import { Entity, Column, PrimaryGeneratedColumn, DeleteDateColumn, PrimaryColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Product } from '../product/product.entity';

@Entity('ProductDiscount')
export class ProductDiscount {
    @PrimaryColumn()
    Coupon: number;

    @Column()
    ProductId: number;

    @ManyToOne(() => Product, Product => Product.ProductDiscounts, {
        onDelete: "RESTRICT"
    })
    @JoinColumn({ name: "ProductId", referencedColumnName: "Id" })
    Product: Product;

    @Column()
    StoreId: number;
}
