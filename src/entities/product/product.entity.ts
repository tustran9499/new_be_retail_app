import { CargoRequestRepository } from "src/modules/warehouse/cargoRequest/cargoRequests.repository";
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  DeleteDateColumn,
  ManyToOne,
  JoinColumn,
  ManyToMany,
  JoinTable,
  OneToMany,
} from "typeorm";
import { CargoRequest } from "../warehouse/cargorequest.entity";
import { Category } from "./category.entity";

import { ProductOrder } from "../productorder/productorder.entity";
import { StoreProduct } from "../storeproduct/storeproduct.entity";
import { ReturnedCargoRequest } from "../warehouse/returnedcargorequest.entity";
import { ProductDiscount } from "../promotion/productdiscount.entity";

@Entity("Product")
export class Product {
  @PrimaryGeneratedColumn()
  Id: number;

  @Column()
  ProductName: string;

  @Column({ name: "CategoryId" })
  CategoryId: number;

  @ManyToOne(() => Category, (Category) => Category.Products, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "CategoryId", referencedColumnName: "Id" })
  Category: Category;

  @Column()
  QuantityPerUnit: string;

  @Column()
  UnitPrice: number;

  @Column()
  Discount: number;

  @Column({ nullable: true })
  Barcode: string;

  @OneToMany(() => ProductOrder, (ProductOrder) => ProductOrder.Product)
  ProductOrders: ProductOrder[];

  @OneToMany(() => ProductDiscount, (ProductDiscount) => ProductDiscount.Product)
  ProductDiscounts: ProductDiscount[];

  @OneToMany(() => StoreProduct, (StoreProduct) => StoreProduct.Product)
  StoreProducts: StoreProduct[];

  @Column()
  UnitsInStock: number;

  @Column()
  ReorderLevel: number;

  @Column()
  Discontinued: boolean;

  @Column({ nullable: true, default: null })
  PhotoURL: string;

  @ManyToMany(() => CargoRequest, (order) => order.products)
  orders: CargoRequest[];

  @ManyToMany(
    () => ReturnedCargoRequest,
    (returnedOrder) => returnedOrder.products
  )
  returnedOrders: ReturnedCargoRequest[];
}
