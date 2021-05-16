import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryColumn,
  ManyToMany,
  OneToMany,
  ManyToOne,
  JoinTable,
} from 'typeorm';
import { Account } from '../account/account.entity';
import { Product } from '../product/product.entity';
import { Store } from '../store/store.entity';
import { Warehouse } from './warehouse.entity';

@Entity('CargoRequest')
export class CargoRequest {
  @PrimaryGeneratedColumn()
  Id: number;

  @Column()
  RequestId: string;

  @Column()
  warehouseId: number;

  @Column()
  storeId: number;

  @CreateDateColumn()
  CreatedAt: Date;

  @Column()
  CancelledAt: Date;

  @UpdateDateColumn()
  UpdatedAt: Date;

  @Column()
  Notes: string;

  @Column()
  Status: string;

  @Column()
  createdByAccountId: number;

  @ManyToOne(() => Account, user => user.orders)
  CreatedByAccount: Account;

  @ManyToOne(() => Warehouse, warehouse => warehouse.orders)
  Warehouse: Warehouse;

  @ManyToOne(() => Store, store => store.orders)
  Store: Store;

  @Column()
  CancelledBy: number;

  @Column()
  UpdatedBy: number;

  @ManyToMany(() => Product, product => product.orders)
  @JoinTable()
  products: Product[];
}
