import { Entity, Column, PrimaryGeneratedColumn, DeleteDateColumn, PrimaryColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Product } from "../product/product.entity";
import { Order } from "../order/order.entity";

@Entity('ProductOrder')
export class ProductOrder {
    @PrimaryColumn()
    ProductId: number;

    @ManyToOne(() => Product, Product => Product.ProductOrders, {
        onDelete: "RESTRICT"
    })
    @JoinColumn({ name: "ProductId", referencedColumnName: "Id" })
    Product: Product;

    @PrimaryColumn()
    OrderId: number;

    @ManyToOne(() => Order, Order => Order.ProductOrders, {
        onDelete: "CASCADE"
    })
    @JoinColumn({ name: "OrderId", referencedColumnName: "Id" })
    Order: Order;

    @Column()
    Price: number;

    @Column()
    Quantity: number;

    @Column({ default: 0 })
    ReturnedQuantity: number;

    @Column({ default: 0 })
    Tax: number;
}
