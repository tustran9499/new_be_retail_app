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
} from "typeorm";
import { Account } from "../account/account.entity";
import { Product } from "../product/product.entity";
import { Store } from "../store/store.entity";
import { Warehouse } from "./warehouse.entity";

@Entity("ReturnedCargoRequest")
export class ReturnedCargoRequest {
  @PrimaryGeneratedColumn()
  Id: number;

  @Column()
  FromRequestId: number;

  @CreateDateColumn()
  CreatedAt: Date;

  @Column()
  Status: string;

  @Column()
  createdByAccountId: number;

  @ManyToOne(() => Account, (user) => user.returnedOrders)
  CreatedByAccount: Account;

  @ManyToMany(() => Product, (product) => product.returnedOrders)
  @JoinTable()
  products: Product[];
}
