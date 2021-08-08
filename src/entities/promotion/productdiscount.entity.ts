import { Entity, Column, PrimaryGeneratedColumn, DeleteDateColumn, PrimaryColumn, ManyToOne, JoinColumn, OneToOne } from 'typeorm';
import { Product } from '../product/product.entity';
import { Promotion } from './promotion.entity';

@Entity('ProductDiscount')
export class ProductDiscount {
    @PrimaryColumn()
    Coupon: number;

    @OneToOne(() => Promotion)
    @JoinColumn({ name: "Coupon", referencedColumnName: "Coupon" })
    Promotion: Promotion;

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
