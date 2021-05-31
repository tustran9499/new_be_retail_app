import { Entity, Column, PrimaryGeneratedColumn, DeleteDateColumn, PrimaryColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Product } from "../product/product.entity";
import { Order } from "../order/order.entity";
import { Store } from '../store/store.entity';

@Entity('StoreProduct')
export class StoreProduct {
    @PrimaryColumn()
    StoreId: number;

    @ManyToOne(() => Store, Store => Store.StoreProducts, {
        onDelete: "RESTRICT"
    })
    @JoinColumn({ name: "StoreId", referencedColumnName: "Id" })
    Store: Store;

    @PrimaryColumn()
    ProductId: number;

    @ManyToOne(() => Product, Product => Product.StoreProducts, {
        onDelete: "RESTRICT"
    })
    @JoinColumn({ name: "ProductId", referencedColumnName: "Id" })
    Product: Product;

    @Column()
    Quantity: number;

}
