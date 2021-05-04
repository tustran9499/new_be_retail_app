import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryColumn,
  ManyToMany,
  OneToMany,
} from 'typeorm';
import { Product } from '../product/product.entity';
import { ProductCargoRequest } from './product-cargorequest.entity';

@Entity('CargoRequest')
export class CargoRequest {
  @PrimaryGeneratedColumn()
  Id: number;

  @Column()
  RequestId: string;

  @Column()
  WarehouseId: number;

  @Column()
  StoreId: number;

  @CreateDateColumn()
  CreatedAt: Date;

  @Column()
  CancelledAt: Date;

  @UpdateDateColumn()
  UpdatedAt: Date;

  @Column()
  Notes: string;

  @Column()
  CreatedBy: number;

  @Column()
  CancelledBy: number;

  @Column()
  UpdatedBy: number;

  @OneToMany(
    () => ProductCargoRequest,
    ProductCargoRequest => ProductCargoRequest.CargoRequestId,
  )
  Product_CargoRequest!: ProductCargoRequest[];
}
