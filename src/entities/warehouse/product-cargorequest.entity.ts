import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
} from 'typeorm';
import { Product } from '../product/product.entity';
import { CargoRequest } from './cargorequest.entity';

@Entity('ProductCargoRequest')
export class ProductCargoRequest {
  @PrimaryGeneratedColumn()
  Id: number;

  @Column()
  ProductId: number;

  @Column()
  CargoRequestId: number;

  @Column()
  Quantity: number;

  // @ManyToOne(() => Product, Product => Product.Product_CargoRequest)
  // Product!: Product;

  // @ManyToOne(
  //   () => CargoRequest,
  //   CargoRequest => CargoRequest.Product_CargoRequest,
  // )
  // CargoRequest!: CargoRequest;
}
